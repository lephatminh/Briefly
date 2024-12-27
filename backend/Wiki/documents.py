from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from .models import WikiArticle

@registry.register_document
class WikiDocument(Document):
    images = fields.ObjectField(
        properties={
            'url': fields.TextField(),
            'alt': fields.TextField()
        }
    )
    
    title = fields.KeywordField(
        fields={
            'raw': fields.KeywordField(),
            'suggest': fields.CompletionField(),
        },
    )
    
    class Index:
        name = 'wiki_articles'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 1
        }
    
    class Django:
        model = WikiArticle
        fields = ['id', 'content', 'updated_at', 'popularity']