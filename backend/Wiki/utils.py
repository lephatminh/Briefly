import google.generativeai as genai
import textwrap

def setup_gemini(api_key):
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')
    return model

def chunk_text(text, chunk_size=30000):
    return textwrap.wrap(text, chunk_size, break_long_words=False)