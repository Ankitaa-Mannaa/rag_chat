import os
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import Document
from .serializers import DocumentSerializer
from .utils import extract_text_from_file
from search.utils import add_embeddings_for_document

class UploadDocumentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return documents uploaded by the current user"""
        docs = Document.objects.filter(user=request.user).order_by("-created_at")
        serializer = DocumentSerializer(docs, many=True)
        return Response(serializer.data)

    def post(self, request):
        uploaded = request.FILES.get("file")
        if not uploaded:
            return Response({"msg": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Save to MEDIA storage
            saved_path = default_storage.save(
                f"uploads/{uploaded.name}", ContentFile(uploaded.read())
            )
            absolute_path = default_storage.path(saved_path)

            # Extract text
            text = extract_text_from_file(absolute_path)
            doc = Document.objects.create(
                user=request.user,
                file=saved_path,
                filename=os.path.basename(saved_path),
                text=text,
            )

            # Create embeddings for search
            add_embeddings_for_document(doc, text)

            return Response(
                {"message": "Uploaded", "doc_id": doc.id, "filename": doc.filename}
            )
        except ValueError as e:
            return Response({"msg": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"msg": "Upload failed", "error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
