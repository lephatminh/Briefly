import os
import logging
from llama_index.core import VectorStoreIndex
from llama_index.core.settings import Settings
from llama_index.vector_stores.elasticsearch import ElasticsearchStore
from llama_index.embeddings.google_genai import GoogleGenAIEmbedding
from llama_index.llms.google_genai import GoogleGenAI
from elasticsearch import Elasticsearch
from django.conf import settings

logger = logging.getLogger(__name__)

def setup_llamaindex():
    """Setup LlamaIndex with Gemini API and ElasticSearch"""
    try:
        # Initialize Elasticsearch connection
        es_client = Elasticsearch(settings.ELASTICSEARCH_DSL['default']['hosts'])
        
        vector_store = ElasticsearchStore(
            es_client=es_client,
            index_name="wiki_articles",
            embedding_dimension=768  # Dimension depends on your embedding model
        )
        
        # Updated embedding model instantiation using new GoogleGenAIEmbedding
        print(f"GEMINI_API_KEY: {settings.GEMINI_API_KEY}")  # Add this line
        embed_model = GoogleGenAIEmbedding(
            api_key=settings.GEMINI_API_KEY,
            model_name="models/embedding-001"
        )
        
        # Set up LLM using new GoogleGenAI
        llm = GoogleGenAI(
            api_key=settings.GEMINI_API_KEY,
            model="gemini-1.5-pro"
        )
        
        # Use Settings instead of ServiceContext
        Settings.llm = llm
        Settings.embed_model = embed_model
        
        # Create index from vector store
        index = VectorStoreIndex.from_vector_store(vector_store=vector_store)
        
        return index
    except Exception as e:
        logger.error(f"Error setting up LlamaIndex: {e}", exc_info=True)
        return None

def query_index(index, query_str, article_content=None):
    """Query the LlamaIndex with a user question"""
    try:
        if index is None:
            return "LlamaIndex is not properly initialized."
            
        if article_content:
            # If we have specific article content, we can use it to augment the query
            query_str = f"Based on this article: {article_content[:1000]}...\n\nQuestion: {query_str}"
        
        # Create query engine
        query_engine = index.as_query_engine(
            similarity_top_k=3,
            response_mode="compact"
        )
        
        # Execute query
        response = query_engine.query(query_str)
        
        return response.response
    except Exception as e:
        logger.error(f"Error querying LlamaIndex: {e}")
        return f"Error: {str(e)}"