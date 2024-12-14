from django.http import JsonResponse
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search

# Connect to Elasticsearch instance
client = Elasticsearch("localhost:9200")

def search_suggestions(request):
    # Get the prefix from the query parameters
    prefix = request.GET.get('q', None)
    
    if prefix:
        # Create a search object
        s = Search(using=client, index='wiki_articles')

        # Add suggester for title first (priority)
        s = s.suggest(
            'title_suggestion',  # Name of the title suggester
            prefix,  # The prefix for the suggestion
            completion={'field': 'title.suggest'}  # The completion field for title
        )
        
        # Add suggester for content (lower priority)
        s = s.query('match', content={'query': prefix, 'fuzziness': 'AUTO'})

        # Execute the search and get suggestions
        response = s.execute()

        # Extract and prioritize suggestions (title suggestions first)
        suggestions = []
        seen = set()

        if 'title_suggestion' in response.suggest:
            for option in response.suggest['title_suggestion'][0].options:
                images = list(option._source.images)
                suggestions.append({
                    'text': option.text,
                    'score': option._score,
                    'post': {    
                        'title': option._source.title,
                        'content': option._source.content,
                        'html': option._source.html,
                        'images': str(images),
                        'created_at': option._source.created_at,
                        'updated_at': option._source.updated_at
                    }
                })
                seen.add(option._source.title)

        # Add content-based suggestions
        if response.hits:
            # print(response.hits)
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

        # Remove duplicates based on text field

        return JsonResponse({'suggestions': suggestions})

    return JsonResponse({'error': 'No prefix provided'}, status=400)
