# usage/views.py
from datetime import date
from django.utils import timezone
from django.db.models import Count
from django.db.models.functions import TruncDate, TruncMonth
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UsageEvent
from datetime import date
from django.utils import timezone

def get_local_today():
    now = timezone.now()
    if timezone.is_naive(now):
        return now.date()   # fallback if USE_TZ=False
    return timezone.localtime(now).date()


class UsageSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today_local = get_local_today()

        # Today count
        today_count = UsageEvent.objects.filter(
            user=user, ts__date=today_local, kind=UsageEvent.QUESTION
        ).count()

        # Month-to-date
        first_of_month = today_local.replace(day=1)
        mtd_count = UsageEvent.objects.filter(
            user=user, ts__date__gte=first_of_month, ts__date__lte=today_local, kind=UsageEvent.QUESTION
        ).count()

        # Last 24h
        now = timezone.now()
        last24h_count = UsageEvent.objects.filter(
            user=user, ts__gte=now - timezone.timedelta(hours=24), kind=UsageEvent.QUESTION
        ).count()

        return Response({
            "today": today_count,
            "remaining_today": max(0, 100 - today_count),
            "month_to_date": mtd_count,
            "last_24h": last24h_count,
        })


class UsageDailySeriesView(APIView):
    """
    GET /api/usage/daily?start=YYYY-MM-DD&end=YYYY-MM-DD
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        start = request.query_params.get("start")
        end = request.query_params.get("end")
        if not start or not end:
           
            end = str(timezone.localdate())
            start = str(timezone.localdate() - timezone.timedelta(days=29))

        qs = (
            UsageEvent.objects.filter(
                user=user, kind=UsageEvent.QUESTION, ts__date__gte=start, ts__date__lte=end
            )
            .annotate(day=TruncDate("ts"))
            .values("day")
            .annotate(count=Count("id"))
            .order_by("day")
        )
        
        day_map = {str(r["day"]): r["count"] for r in qs}
        d0 = date.fromisoformat(start)
        d1 = date.fromisoformat(end)
        out = []
        cur = d0
        while cur <= d1:
            key = cur.isoformat()
            out.append({"date": key, "count": day_map.get(key, 0)})
            cur += timezone.timedelta(days=1)
        return Response({"granularity": "day", "series": out})


class UsageMonthlySeriesView(APIView):
    """
    GET /api/usage/monthly?year=YYYY
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        year = int(request.query_params.get("year", timezone.localdate().year))

        qs = (
            UsageEvent.objects.filter(
                user=user, kind=UsageEvent.QUESTION, ts__year=year
            )
            .annotate(month=TruncMonth("ts"))
            .values("month")
            .annotate(count=Count("id"))
            .order_by("month")
        )
        series = [{"month": r["month"].strftime("%Y-%m"), "count": r["count"]} for r in qs]
        return Response({"year": year, "granularity": "month", "series": series})
