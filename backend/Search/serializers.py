from rest_framework import serializers

class SuggestionPostSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField()
    image = serializers.DictField()
    
class SuggestionSerializer(serializers.Serializer):
    text = serializers.CharField()
    score = serializers.FloatField()
    popularity = serializers.IntegerField()
    post = SuggestionPostSerializer()