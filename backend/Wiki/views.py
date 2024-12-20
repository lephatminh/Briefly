from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Count
from rest_framework.views import APIView
from rest_framework import status
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from .serializers import SuggestionSerializer
from .models import WikiArticle
import random
import logging
import nltk

logger = logging.getLogger(__name__)
nltk.download('punkt_tab')
client = Elasticsearch("localhost:9200")

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

        suggestions = []
        seen = set()

        if 'title_suggestion' in response.suggest:
            for option in response.suggest['title_suggestion'][0].options:
                image = {'url': "/blank-img.svg", 'alt': 'image not found'} if not option._source.images \
                    else {'url': option._source.images[0]['url'],'alt': option._source.images[0]['alt']}
                if len(seen) <= MAX_SUGGESTIONS:
                    suggestion_data = {
                        'text': option.text,
                        'score': option._score,
                        'post': {    
                            'id': option._source.id,
                            'title': option._source.title,
                            'image': image,
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
        
        if article_id:
            article = get_object_or_404(WikiArticle, id=article_id)
        else:
            count = WikiArticle.objects.aggregate(count=Count('id'))['count']
            if count == 0:
                return JsonResponse({'error': 'No article available'}, status=status.HTTP_404_NOT_FOUND)
            random_index = random.randint(0, count - 1)
            article = WikiArticle.objects.all()[random_index]
            
        # Summarize the article content using Sumy
        try:
            # Validate content
            if not article.content or len(article.content.strip()) == 0:
                raise ValueError("Empty content")

            # Initialize Sumy components
            content = article.content.replace("\\", "")
            index = content.find("See also")
            if index != -1:
                content = content[:index]
            parser = PlaintextParser.from_string(content, Tokenizer("english"))
            summarizer = LexRankSummarizer()
            
            # Set number of sentences (e.g., 3 sentences)
            summary_sentences = summarizer(parser.document, sentences_count=12)
            
            if not summary_sentences:
                raise ValueError("No summary generated")
            
            # Combine summarized sentences
            summarized_content = ' '.join(str(sentence) for sentence in summary_sentences)
            
        except ValueError as ve:
            logger.error(f"Validation error: {str(ve)}")
            summarized_content = "Could not generate summary: invalid content"
        except Exception as e:
            logger.error(f"Summarization error: {str(e)}")
            summarized_content = "Error generating summary"
            
        return JsonResponse({
            'id': article.id,
            'title': article.title,
            'content': summarized_content,
            'images': article.images,
            'html': article.html,
            'created_at': article.created_at,
            'updated_at': article.updated_at
        }, status=status.HTTP_200_OK)