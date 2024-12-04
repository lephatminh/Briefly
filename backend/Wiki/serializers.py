from .models import WikiArticle
from django_elasticsearch_dsl_drf.serializers import DocumentSerializer
from .documents import *

class WikiDocumentSerializer(DocumentSerializer):
    class Meta:
        model = WikiArticle
        document = WikiDocument
        
        fields = ('title', 'content', 'images', 'html', 'created_at', 'updated_at')
        
        def get_location(self, obj):
            try:
                return obj.location.to_dict()
            except:
                return {}