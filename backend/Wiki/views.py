from django.http import JsonResponse
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search

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
                suggestions.append({
                    'text': option.text,
                    'score': option._score,
                    'post': {    
                        'title': option._source.title,
                        'content': option._source.content,
                        'html': option._source.html,
                        'images': str(option._source.images),
                        'created_at': option._source.created_at,
                        'updated_at': option._source.updated_at
                    }
                })
                seen.add(option._source.title)

        if response.hits:
            for hit in response.hits:
                option = hit.to_dict()
                if option['title'] not in seen:
                    suggestions.append({
                        'text': hit.content,
                        'score': hit.meta.score,
                        'post': {    
                            'title': option['title'],
                            'content': option['content'],
                            'html': option['html'],
                            'images': option['images'],
                            'created_at': option['created_at'],
                            'updated_at': option['updated_at']
                        }
                    })

        return JsonResponse({'suggestions': suggestions})

    return JsonResponse({'error': 'No prefix provided'}, status=400)
