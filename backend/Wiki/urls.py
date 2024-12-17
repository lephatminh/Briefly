from django.urls import path
from .views import search_suggestions, WikiArticleDetailView

urlpatterns = [
    path('', search_suggestions, name='suggest'),
    path('article/', WikiArticleDetailView.as_view(), name='get_by_id'),
]
