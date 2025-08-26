from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ("id", "filename", "text", "created_at")
        read_only_fields = ("id", "text", "created_at", "filename")
