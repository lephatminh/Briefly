from django.http import JsonResponse
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search

MAX_SUGGESTIONS = 6

client = Elasticsearch("localhost:9200")

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
                    suggestions.append({
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
                    })
                    seen.add(option._source.title)

        if len(seen) < MAX_SUGGESTIONS and response.hits:
            for hit in response.hits:
                option = hit.to_dict()
                if len(seen) < MAX_SUGGESTIONS and option['title'] not in seen:
                    suggestions.append({
                        'text': hit.content,
                        'score': hit.meta.score,
                        'post': {  
                            'id': option['id'],
                            'title': option['title'],
                            'image': option['images'][0],
                        }
                    })

        return JsonResponse({'suggestions': suggestions})

    return JsonResponse({'error': 'No prefix provided'}, status=400)
