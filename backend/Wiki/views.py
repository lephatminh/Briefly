from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Count
from django.conf import settings
from rest_framework.views import APIView
from rest_framework import status
from .models import WikiArticle
import random
import time
import logging
import nltk
import re
import google.generativeai as genai
import textwrap
from sentence_transformers import SentenceTransformer, util

logger = logging.getLogger(__name__)
nltk.download('punkt_tab')
model = SentenceTransformer('sentence-transformers/multi-qa-MiniLM-L6-cos-v1')
        
def setup_gemini(api_key):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')
    return model

def chunk_text(text, chunk_size=30000):
    return textwrap.wrap(text, chunk_size, break_long_words=False)
        
class WikiArticleDetailView(APIView):

    def summarize_text(text, api_key):
        try:
            model = setup_gemini(api_key)
            
            # Split long text into chunks
            chunks = chunk_text(text)
            summaries = []

            for chunk in chunks:
                prompt = f"Please only give a summary paragraph of maximum 15 sentences of this long content: {chunk}. Please try to capture as much necessary information as possible."
                response = model.generate_content(prompt)
                summaries.append(response.text)
            
            print(summaries[0])
            return summaries[0]

        except Exception as e:
            return f"Error during summarization: {str(e)}"
        
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
    def get(self, request, *args, **kwargs):
        query = request.GET.get('q', None)
        article_id = request.GET.get('id', None)
        if article_id:
            article = get_object_or_404(WikiArticle, id=article_id)
        else:
            return JsonResponse({'error': 'Article not found.'}, status=status.HTTP_404_NOT_FOUND)
            
        if query:
            pattern = r'(?<=[.?!])\s+(?=[A-Z])'
            docs = re.split(pattern, article.content)
            docs = [d.strip() for d in docs if d.strip()]

            #Encode query and documents
            query_emb = model.encode(query)
            doc_emb = model.encode(docs)

            #Compute dot score between query and all document embeddings
            scores = util.dot_score(query_emb, doc_emb)[0].cpu().tolist()

            #Combine docs & scores
            doc_score_pairs = list(zip(docs, scores))

            doc_score_pairs = [(doc, score) for doc, score in doc_score_pairs if score > 0.5]
            doc_score_pairs = sorted(doc_score_pairs, key=lambda x: (-x[1]))

            top = 7
            doc_score_pairs = doc_score_pairs[:top]
            doc_score_pairs = sorted(doc_score_pairs, key=lambda x: (docs.index(x[0])))
            response = ""
            for doc, score in doc_score_pairs:
                if top == 0:
                    break
                doc = doc.replace("\n", " ")
                response += doc + " "
                top -= 1
            return JsonResponse({'response': response}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({'error': 'No query provided or mismatched article ID'}, status=status.HTTP_400_BAD_REQUEST)
        
class ArticleSummaryView(APIView):
    def get(self, request, *args, **kwargs):
        article_id = request.GET.get('id', None)
        
        if article_id is None:
            return JsonResponse({'error': 'Article not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        
        article = get_object_or_404(WikiArticle, id=article_id)
        try:
            # Validate content
            if not article.content or len(article.content.strip()) == 0:
                raise ValueError("Empty content")

            # Initialize Sumy components
            content = article.content.replace("\\", "")
            # print(content)
            index = content.find("See also")
            if index != -1:
                content = content[:index]
            summarized_content = WikiArticleDetailView.summarize_text(content, settings.GEMINI_API_KEY)      
        except ValueError as ve:
            logger.error(f"Validation error: {str(ve)}")
            summarized_content = "Could not generate summary: invalid content"
        except Exception as e:
            logger.error(f"Summarization error: {str(e)}")
            summarized_content = "Error generating summary"
    
        return JsonResponse({'summary': summarized_content}, status=status.HTTP_200_OK)