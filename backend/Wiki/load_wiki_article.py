from .models import WikiArticle
import sys
import os
sys.path.append(os.path.join(os.getcwd(), "Wiki/task"))
from get_glossary import get_clean_content, crawl_multiple_glossary # type: ignore
from extract_figure_figcaption import parse_html_and_title, extract_figure_figcaption # type: ignore
from crawl_html import create_html_content # type: ignore

def load_wiki_article():
    glossaries = ["Glossary of artificial intelligence", "Glossary of computer science", "Glossary of civil engineering", 
              "Glossary of electrical and electronics engineering", "Glossary of mechanical engineering", "Glossary of structural engineering",
              "Glossary of aerospace engineering", "Glossary of mathematics", "Glossary of physics", "Glossary of areas of mathematics"]
    wiki_terms = crawl_multiple_glossary(glossaries) # Get the list of Wikipedia terms
    wiki_terms = list(set(wiki_terms)) # Remove duplicates

    for term in wiki_terms:
        content = get_clean_content(term)
        html, title = parse_html_and_title(term)
        if html == None:
            continue
        list_fig_figcaption = extract_figure_figcaption(html)
        html_content = create_html_content(term)
        WikiArticle.objects.update_or_create(title=title, content=content
        , images=list_fig_figcaption, html=html_content)
        print(title + " is added to the database")
        
# load_wiki_article()
# print("All wiki articles are loaded")