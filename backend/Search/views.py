from django.http import JsonResponse
from rest_framework import status
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search
from .serializers import SuggestionSerializer
from django.conf import settings
import re

client = Elasticsearch(settings.ELASTICSEARCH_DSL['default']['hosts'])

MAX_SUGGESTIONS = 10

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

        title_matches = []
        content_matches = []
        seen = set()

        if 'title_suggestion' in response.suggest:
            for option in response.suggest['title_suggestion'][0].options:
                image = {'url': "/blank-img.svg", 'alt': 'image not found'} if not option._source.images \
                    else {'url': option._source.images[0]['url'],'alt': option._source.images[0]['alt']}
                if len(seen) <= MAX_SUGGESTIONS:
                    suggestion_data = {
                        'text': option.text,
                        'score': option._score,
                        'popularity': option._source.popularity,    
                        'post': {    
                            'id': option._source.id,
                            'title': option._source.title,
                            'image': image,
                        }
                    }
                    serializer = SuggestionSerializer(data=suggestion_data)
                    if serializer.is_valid():
                        title_matches.append(serializer.validated_data)
                    seen.add(option._source.title)

        if response.hits:
            for hit in response.hits:
                option = hit.to_dict()
                image = option['images'][0] if option['images'] else {'url': "/blank-img.svg", 'alt': 'image not found'}
                if option['title'] not in seen:
                    suggestion_data = {
                        'text': ' '.join(re.split(r'(?<=[.!?])\s+', hit.content.strip())[:4]),
                        'score': hit.meta.score,
                        'popularity': option['popularity'],
                        'post': {  
                            'id': option['id'],
                            'title': option['title'],
                            'image': image,
                        }
                    }
                    serializer = SuggestionSerializer(data=suggestion_data)
                    if serializer.is_valid():
                        content_matches.append(suggestion_data)
                    seen.add(option['title'])
                    
        title_matches = sorted(title_matches, key=lambda x: x['popularity'], reverse=True)
        content_matches = sorted(content_matches, key=lambda x: x['popularity'], reverse=True)

        suggestions = title_matches + content_matches

        return JsonResponse({'suggestions': suggestions[:20]}, status=status.HTTP_200_OK)

    return JsonResponse({'error': 'No prefix provided'}, status=status.HTTP_400_BAD_REQUEST)