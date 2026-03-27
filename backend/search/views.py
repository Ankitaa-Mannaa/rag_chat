from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .utils import search_similar

class SearchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        query = request.data.get("query", "").strip()
        if not query:
            return Response({"msg": "query is required"}, status=status.HTTP_400_BAD_REQUEST)
        results = search_similar(query, top_k=5)
        payload = [
            {"score": float(s), "doc_id": d, "filename": fn, "text": c}
            for (s, d, c, fn) in results
        ]
        return Response({"results": payload})
