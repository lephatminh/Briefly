from django.shortcuts import render
from .documents import WikiDocument
from .serializers import WikiDocumentSerializer
from django_elasticsearch_dsl_drf.viewsets import DocumentViewSet
from django_elasticsearch_dsl_drf.filter_backends import (
    FilteringFilterBackend,
    CompoundSearchFilterBackend
)

class WikiDocumentView(DocumentViewSet):
    document = WikiDocument
    serializer_class = WikiDocumentSerializer
    
    filter_backends = [
        FilteringFilterBackend,
        CompoundSearchFilterBackend
    ]
    
    filter_fields = {
        
    }
    
    search_fields = ('title', 'content')
    multi_match_search_fields = ('title', 'content')
    filter_fields = {
        'title': 'title',
        'content': 'content'
    }