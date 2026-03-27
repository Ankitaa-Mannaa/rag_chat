from django.db import models
from documents.models import Document

class Embedding(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="embeddings")
    chunk_text = models.TextField()
    vector = models.BinaryField()  # float32 bytes
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Embedding(doc={self.document_id}, len={len(self.chunk_text)})"
