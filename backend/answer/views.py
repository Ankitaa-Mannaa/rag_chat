from django.http import StreamingHttpResponse
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.renderers import BaseRenderer
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed
from django.utils.timezone import localdate

from authapp.models import User
from usage.models import UsageEvent
from .utils import generate_answer_stream

from datetime import date

def get_local_today():
    now = timezone.now()
    if timezone.is_naive(now):
        return now.date()   
    return timezone.localtime(now).date()

DAILY_LIMIT = 100

class EventStreamRenderer(BaseRenderer):
    media_type = "text/event-stream"
    format = "event-stream"

    def render(self, data, accepted_media_type=None, renderer_context=None):
        return data


def _record_question(user, meta=None):
    """
    Safe, non-blocking usage logging. One event per request.
    """
    try:
        UsageEvent.objects.create(user=user, kind=UsageEvent.QUESTION, meta=meta or {})
    except Exception:
        pass


def _today_count(user):
    """
    Count today's questions from UsageEvent (respects project TIME_ZONE).
    """
    today = today = get_local_today()
    return UsageEvent.objects.filter(
        user=user, kind=UsageEvent.QUESTION, ts__date=today
    ).count()

class AnswerView(APIView):
    permission_classes = [AllowAny]
    renderer_classes = [EventStreamRenderer]

    def _authenticate_user(self, request):
        try:
            user_auth = JWTAuthentication().authenticate(request)
            if user_auth:
                return user_auth[0]
        except AuthenticationFailed:
            pass

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
            return StreamingHttpResponse(
                "data: Unauthorized\n\n", status=401, content_type="text/event-stream"
            )

        query = request.GET.get("query", "").strip()
        if not query:
            return StreamingHttpResponse(
                "data: query is required\n\n", content_type="text/event-stream"
            )

        used_today = _today_count(user)
        if used_today >= DAILY_LIMIT:
           
            now = timezone.now()
            tomorrow = (localdate() + timezone.timedelta(days=1))
            retry_after = int(
                (timezone.make_aware(
                    timezone.datetime.combine(tomorrow, timezone.datetime.min.time())
                ) - now).total_seconds()
            )
            resp = StreamingHttpResponse(
                "data: Rate limit exceeded (100/day). Try again after midnight.\n\n",
                status=429,
                content_type="text/event-stream",
            )
            resp["Retry-After"] = str(retry_after)
            resp["Cache-Control"] = "no-cache"
            return resp

        _record_question(
            user,
            {
                "endpoint": "/api/answer/",
                "query_len": len(query),
                "ip": request.META.get("REMOTE_ADDR"),
                "ua": request.META.get("HTTP_USER_AGENT"),
                "sse": True,
                "method": "GET",
            },
        )

        try:
            user.questions_asked = (user.questions_asked or 0) + 1
            user.save(update_fields=["questions_asked"])
        except Exception:
            pass  

        def event_stream():
            for chunk in generate_answer_stream(query):
                yield f"data: {chunk}\n\n"
            yield "data: [END]\n\n"

        response = StreamingHttpResponse(event_stream(), content_type="text/event-stream")
        response["Cache-Control"] = "no-cache"
        return response
