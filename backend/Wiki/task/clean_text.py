import requests
import re
from bs4 import BeautifulSoup
import os 


def remove_latex(text):
    # Regular expression to remove LaTeX math blocks
    regex = r'\n\s*\{.*?\}\s*\n'

    cleaned_text = re.sub(regex, '\n', text)
    
    return cleaned_text

def clean_text(text):
    """Clean the text by removing unwanted characters and extra whitespaces.
    """
    text = re.sub(r'<math.*?>.*?</math>', '', text, flags=re.DOTALL)
    text = re.sub(r'<tex.*?>.*?</tex>', '', text, flags=re.DOTALL)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-zA-Z0-9\s.,!?\'"-]', '', text) 
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def remove_single_characters(text):
    """Remove single characters from the text, except for 'a', 'A', and 'i'.

    Args:
        text: the input text
    """
    words = text.split()
    filtered_words = [word for word in words if len(word) > 1 or word in ['a', 'A', 'I']]
    return ' '.join(filtered_words)


def get_wikipedia_content(page_title):

    url = "https://en.wikipedia.org/w/api.php"
    # Example: https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exlimit=1&titles=entropy&explaintext=1&exsectionformat=plain&format=json

    params = {
        'action': 'query',              # Action to perform
        'format': 'json',               # Format of the response
        'titles': page_title,           # Page title (replace with desired page)
        'prop': 'extracts',             # Get extracts (content)
        'explaintext': 1,
        'exlimit': 1,                   # Limit the number of extracts
        'exsectionformat': 'plain'      # Format of the section title
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        pages = data['query']['pages']
        # Extract the content
        for page_id, page_data in pages.items():
            if 'extract' in page_data:
                return page_data['extract']
            else:
                return "Content not found."
    else:
        return f"Error: {response.status_code}"