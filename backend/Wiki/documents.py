from django_elasticsearch_dsl import Document
from django_elasticsearch_dsl.registries import registry
from .models import WikiArticle

@registry.register_document
class WikiDocument(Document):
    class Index:
        name = 'wiki_articles'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 1
        }
    
    class Django:
        model = WikiArticle
        fields = ['title', 'content']