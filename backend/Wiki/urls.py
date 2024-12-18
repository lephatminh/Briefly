from django.urls import path
from .views import search_suggestions, WikiArticleDetailView
from .load_wiki_article import load_wiki_article

urlpatterns = [
    path('', search_suggestions, name='suggest'),
    path('article/', WikiArticleDetailView.as_view(), name='get_by_id'),
    path('load/', load_wiki_article, name='load_wiki_article')
]
