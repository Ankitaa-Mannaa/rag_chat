from django.contrib import admin
from .models import Document

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "filename", "user", "created_at")
    search_fields = ("filename", "user__username")
    readonly_fields = ("text",)
