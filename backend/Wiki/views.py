from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Count
from rest_framework.views import APIView
from rest_framework import status
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from .models import WikiArticle
import random
import time
import logging
import nltk

logger = logging.getLogger(__name__)
nltk.download('punkt_tab')

class WikiArticleDetailView(APIView):
    def get(self, request, *args, **kwargs):
        start_time = time.time()
        article_id = request.GET.get('id', None)
        
        if article_id:
            article = get_object_or_404(WikiArticle, id=article_id)
        else:
            count = WikiArticle.objects.aggregate(count=Count('id'))['count']
            if count == 0:
                return JsonResponse({'error': 'No article available'}, status=status.HTTP_404_NOT_FOUND)
            
            random_index = random.randint(0, count - 1)
            article = WikiArticle.objects.all()[random_index]
            while article.html.startswith('<ol>\n<li>'):
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
            
        end_time = time.time()
        response_time = end_time - start_time
            
        return JsonResponse({
            'id': article.id,
            'title': article.title,
            'content': summarized_content,
            'images': article.images,
            'html': article.html,
            'created_at': article.created_at,
            'updated_at': article.updated_at,
            'response_time': response_time
        }, status=status.HTTP_200_OK)