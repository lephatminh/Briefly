from .models import WikiArticle
from rest_framework import serializers
from .documents import *

class SuggestionPostSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    image = serializers.DictField()
    
class SuggestionSerializer(serializers.Serializer):
    text = serializers.CharField()
    score = serializers.FloatField()
    post = SuggestionPostSerializer()
    
class WikiArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = WikiArticle
        fields = '__all__'