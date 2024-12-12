from django.contrib import admin
from .models import WikiArticle

# Register your models here.
@admin.register(WikiArticle)
class WikiArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'content', 'created_at', 'updated_at')
    search_fields = ('title',)