from django.urls import path
from .views import AnswerView

urlpatterns = [
    path("", AnswerView.as_view()),
]
