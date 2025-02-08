from django.urls import path
from .views import WikiArticleDetailView, QAChatbotView, ArticleSummaryView
from .load_wiki_article import load_wiki_article

urlpatterns = [
    path('', WikiArticleDetailView.as_view(), name='get_by_id'),
    path('load/', load_wiki_article, name='load_wiki_article'),
    path('ask/', QAChatbotView.as_view(), name='chatbot'),
    path('summary/', ArticleSummaryView.as_view(), name='summary')
]
