# usage/models.py
from django.conf import settings
from django.db import models

class UsageEvent(models.Model):
    QUESTION = "question"
    KIND_CHOICES = [(QUESTION, "Question")]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="usage_events")
    kind = models.CharField(max_length=32, choices=KIND_CHOICES, default=QUESTION)
    ts = models.DateTimeField(auto_now_add=True)
    meta = models.JSONField(blank=True, default=dict)  # e.g., {"endpoint": "/api/answer/", "query_len": 42}

    class Meta:
        indexes = [models.Index(fields=["user", "ts"])]
        ordering = ["-ts"]
