from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Count
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import status
from .models import WikiArticle
from .utils import *
import random
import time
import logging
import nltk
import re

logger = logging.getLogger(__name__)
nltk.download('punkt_tab')
gemini = setup_gemini(settings.GEMINI_API_KEY)
        
class WikiArticleDetailView(APIView):        
    def get(self, request, *args, **kwargs):
        start_time = time.time()
        article_id = request.GET.get('id', None)
        
        if article_id:
            article = get_object_or_404(WikiArticle, id=article_id)
            article.popularity += 1
            article.save(update_fields=['popularity'])
        else:
            count = WikiArticle.objects.aggregate(count=Count('id'))['count']
            if count == 0:
                return JsonResponse({'error': 'No article available'}, status=status.HTTP_404_NOT_FOUND)
            random_index = random.randint(0, count - 1)
            article = WikiArticle.objects.all()[random_index]
            while article.html.startswith('<ol>\n<li>'):
                random_index = random.randint(0, count - 1)
                article = WikiArticle.objects.all()[random_index]
            
        end_time = time.time()
        response_time = end_time - start_time
            
        return JsonResponse({
            'id': article.id,
            'title': article.title,
            'teaser': ' '.join(re.split(r'(?<=[.!?])\s+', article.content.strip())[:10]),
            'images': article.images,
            'html': article.html,
            'created_at': article.created_at,
            'updated_at': article.updated_at,
            'response_time': response_time
        }, status=status.HTTP_200_OK)
        
        
class QAChatbotView(APIView):
    def answer_question(self, topic, question):
        try:
            prompt = f"Answer this question on the topic of {topic} in at most 10 sentences: {question}"
            response = gemini.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error during summarization: {str(e)}"

    def get(self, request, *args, **kwargs):
        query = request.GET.get('q', None)
        article_id = request.GET.get('id', None)
        if article_id:
            article = get_object_or_404(WikiArticle, id=article_id)
        else:
            return JsonResponse({'error': 'Article not found.'}, status=status.HTTP_404_NOT_FOUND)

        if query:
            response = self.answer_question(article.title, query)
            return JsonResponse({'response': response}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({'error': 'No query provided or mismatched article ID'}, status=status.HTTP_400_BAD_REQUEST)

        
class ArticleSummaryView(APIView):
    def summarize_text(self, text, api_key):
        try:
            # Split long text into chunks
            chunks = chunk_text(text)
            summaries = []

            for chunk in chunks:
                prompt = f"Please only give a summary paragraph of maximum 15 sentences of this long content: {chunk}. Please try to capture as much necessary information as possible."
                response = gemini.generate_content(prompt)
                summaries.append(response.text)
            
            print(summaries[0])
            return summaries[0]

        except Exception as e:
            return f"Error during summarization: {str(e)}"
        
    def get(self, request, *args, **kwargs):
        article_id = request.GET.get('id', None)
        
        if article_id is None:
            return JsonResponse({'error': 'Article not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        
        article = get_object_or_404(WikiArticle, id=article_id)
        try:
            if not article.content or len(article.content.strip()) == 0:
                raise ValueError("Empty content")

            content = article.content.replace("\\", "")
            index = content.find("See also")
            if index != -1:
                content = content[:index]
            summarized_content = self.summarize_text(content, settings.GEMINI_API_KEY)      
        except ValueError as ve:
            logger.error(f"Validation error: {str(ve)}")
            summarized_content = "Could not generate summary: invalid content"
        except Exception as e:
            logger.error(f"Summarization error: {str(e)}")
            summarized_content = "Error generating summary"
    
        return JsonResponse({'summary': summarized_content}, status=status.HTTP_200_OK)