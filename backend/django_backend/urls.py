from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/authapp/", include("authapp.urls")),
    path("api/documents/", include("documents.urls")),
    path("api/search/", include("search.urls")),
    path("api/answer/", include("answer.urls")),
    path("api/usage/", include("usage.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
