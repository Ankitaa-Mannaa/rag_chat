from django.urls import path
from .views import UsageSummaryView, UsageDailySeriesView, UsageMonthlySeriesView

urlpatterns = [
    path("", UsageSummaryView.as_view()),
    path("daily/", UsageDailySeriesView.as_view()),  
    path("monthly/", UsageMonthlySeriesView.as_view())
]
