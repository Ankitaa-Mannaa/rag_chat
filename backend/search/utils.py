import numpy as np
from typing import List, Tuple
from sentence_transformers import SentenceTransformer
from django.db import transaction
from .models import Embedding
from documents.models import Document

_model = SentenceTransformer("all-MiniLM-L6-v2")

def _chunk_text(text: str, chunk_size: int = 200, overlap: int = 50) -> List[str]:
    """
    Split text into overlapping chunks of ~chunk_size words.
    """
    if not text:
        return []
    words = text.split()
    chunks = []
    start = 0
    n = len(words)
    while start < n:
        end = min(start + chunk_size, n)
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        if end == n:
            break
        start = end - overlap
        if start < 0:
            start = 0
    return chunks

def _embed_texts(texts: List[str]) -> np.ndarray:
    if not texts:
        return np.empty((0, 384), dtype=np.float32)  # 384 for MiniLM-L6-v2
    vecs = _model.encode(texts, convert_to_numpy=True, normalize_embeddings=False)
    return vecs.astype(np.float32, copy=False)

@transaction.atomic
def add_embeddings_for_document(doc: Document, text: str) -> None:
    chunks = _chunk_text(text)
    if not chunks:
        return
    vectors = _embed_texts(chunks)
    objs = []
    for chunk, vec in zip(chunks, vectors):
        objs.append(Embedding(document=doc, chunk_text=chunk, vector=vec.tobytes()))
    Embedding.objects.bulk_create(objs, batch_size=256)

def _cosine(a: np.ndarray, b: np.ndarray) -> float:
    denom = (np.linalg.norm(a) * np.linalg.norm(b)) + 1e-9
    return float(np.dot(a, b) / denom)

def search_similar(query: str, top_k: int = 3, min_score: float = 0.25) -> List[Tuple[float, int, str, str]]:
    """
    Returns a list of (score, doc_id, chunk_text, filename) sorted by score desc,
    but only keeps results above min_score.
    """
    qvec = _embed_texts([query])[0]
    results = []
    for emb in Embedding.objects.select_related("document").all():
        vec = np.frombuffer(emb.vector, dtype=np.float32)
        score = _cosine(qvec, vec)
        if score >= min_score:
            results.append((score, emb.document_id, emb.chunk_text, emb.document.filename))
    results.sort(key=lambda x: x[0], reverse=True)
    return results[:top_k]
