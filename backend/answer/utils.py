import requests
from django.conf import settings
from typing import Tuple, List
from search.utils import search_similar

def generate_answer(query: str) -> Tuple[str, List[int]]:
    context = search_similar(query, top_k=3)
    context_text = "\n\n".join([c for _, _, c, _ in context])
    source_doc_ids = list({d for _, d, _, _ in context})

    prompt = (
        "You are a helpful assistant. Use ONLY the following context to answer the question.\n"
        "If the context is only partially relevant, do your best to summarize it anyway.\n"
        "Do not say 'I don't know' unless there is absolutely no information related.\n\n"
        f"Context:\n{context_text}\n\n"
        f"Question: {query}\n\nAnswer:"
    )

    api_key = settings.OPENROUTER_API_KEY or ""
    if not api_key:
        # Fallback (no external call)
        return ("[DEV MODE] OPENROUTER_API_KEY not set. "
                "Cannot call model. Context snippets returned above.", source_doc_ids)

    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "model": "openai/gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=60,
        )
        data = resp.json()
        content = data["choices"][0]["message"]["content"]
        return content, source_doc_ids
    except Exception as e:
        return (f"[FALLBACK] Answer generation failed: {e}. "
                "Returning top context snippets instead.\n\n" + context_text, source_doc_ids)
