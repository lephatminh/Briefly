from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search
from .serializers import SuggestionSerializer, WikiArticleSerializer
from .models import WikiArticle
from .summarization import summarize
import random

client = Elasticsearch("localhost:9200")

MAX_SUGGESTIONS = 6

def search_suggestions(request):
    prefix = request.GET.get('q', None)
    
    if prefix:
        s = Search(using=client, index='wiki_articles')

        # Add suggester for title
        s = s.suggest(
            'title_suggestion',
            prefix,
            completion={'field': 'title.suggest'}
        )
        
        # Add suggester for content
        s = s.query('match', content={'query': prefix, 'fuzziness': 'AUTO'})

        response = s.execute()

        suggestions = []
        seen = set()

        if 'title_suggestion' in response.suggest:
            for option in response.suggest['title_suggestion'][0].options:
                if len(seen) <= MAX_SUGGESTIONS:
                    suggestion_data = {
                        'text': option.text,
                        'score': option._score,
                        'post': {    
                            'id': option._source.id,
                            'title': option._source.title,
                            'image': {
                                'url': option._source.images[0]['url'],
                                'alt': option._source.images[0]['alt'],
                            },
                        }
                    }
                    serializer = SuggestionSerializer(data=suggestion_data)
                    if serializer.is_valid():
                        suggestions.append(serializer.validated_data)
                    seen.add(option._source.title)

        if len(seen) < MAX_SUGGESTIONS and response.hits:
            for hit in response.hits:
                option = hit.to_dict()
                if len(seen) < MAX_SUGGESTIONS and option['title'] not in seen:
                    suggestion_data = {
                        'text': hit.content,
                        'score': hit.meta.score,
                        'post': {  
                            'id': option['id'],
                            'title': option['title'],
                            'image': option['images'][0],
                        }
                    }
                    serializer = SuggestionSerializer(data=suggestion_data)
                    if serializer.is_valid():
                        suggestions.append(suggestion_data)
                    seen.add(option['title'])

        return JsonResponse({'suggestions': suggestions}, status=status.HTTP_200_OK)

    return JsonResponse({'error': 'No prefix provided'}, status=status.HTTP_400_BAD_REQUEST)

class WikiArticleDetailView(APIView):
    def get(self, request, *args, **kwargs):
        article_id = request.GET.get('id', None)
        
        print(article_id)
        if article_id:
            article = get_object_or_404(WikiArticle, id=article_id)
        else:
            count = WikiArticle.objects.aggregate(count=Count('id'))['count']
            if count == 0:
                return JsonResponse({'error': 'No article available'}, status=status.HTTP_404_NOT_FOUND)
            random_index = random.randint(0, count - 1)
            article = WikiArticle.objects.all()[random_index]
        
        content = article.content
        summary = summarize(content)  
        serializer = WikiArticleSerializer(article)
        data = serializer.data
        data['content'] = summary
        return Response(data, status=status.HTTP_200_OK)