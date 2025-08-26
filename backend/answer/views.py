from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .utils import generate_answer

class AnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        query = request.data.get("query", "").strip()
        if not query:
            return Response({"msg": "query is required"}, status=status.HTTP_400_BAD_REQUEST)

        answer, sources = generate_answer(query)

        # Track usage
        u = request.user
        u.questions_asked = (u.questions_asked or 0) + 1
        u.save(update_fields=["questions_asked"])

        return Response({"answer": answer, "sources": sources})
