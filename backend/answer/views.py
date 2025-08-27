from django.http import StreamingHttpResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.renderers import BaseRenderer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from authapp.models import User
from .utils import generate_answer_stream

class EventStreamRenderer(BaseRenderer):
    media_type = "text/event-stream"
    format = "event-stream"

    def render(self, data, accepted_media_type=None, renderer_context=None):
        return data

class AnswerView(APIView):
    # handle JWT manually
    permission_classes = [AllowAny]
    renderer_classes = [EventStreamRenderer]

    def _authenticate_user(self, request):
        # Authorization header
        try:
            user_auth = JWTAuthentication().authenticate(request)
            if user_auth:
                return user_auth[0]
        except AuthenticationFailed:
            pass

        # Try ?token= query parameter
        token = request.GET.get("token")
        if token:
            try:
                validated = AccessToken(token)
                return User.objects.get(id=validated["user_id"])
            except Exception:
                return None
        return None

    def get(self, request, *args, **kwargs):
        user = self._authenticate_user(request)
        if not user:
            return StreamingHttpResponse("data: Unauthorized\n\n", status=401, content_type="text/event-stream")

        query = request.GET.get("query", "").strip()
        if not query:
            return StreamingHttpResponse("data: query is required\n\n", content_type="text/event-stream")

        # Track usage
        user.questions_asked = (user.questions_asked or 0) + 1
        user.save(update_fields=["questions_asked"])

        def event_stream():
            for chunk in generate_answer_stream(query):
                yield f"data: {chunk}\n\n"
            yield "data: [END]\n\n"

        response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
        response["Cache-Control"] = "no-cache"
        return response
