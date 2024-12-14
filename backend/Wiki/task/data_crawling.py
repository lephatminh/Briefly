import requests
import json
from bs4 import BeautifulSoup
import os
from clean_text import remove_latex, clean_text, remove_single_characters, get_wikipedia_content
from extract_figure_figcaption import parse_html_and_title, extract_figure_figcaption
import crawl_html

def create_link(glossary):
    return "https://en.wikipedia.org/wiki/" + glossary.replace(" ", "_")

def get_glossary_content(glossary):
    url = create_link(glossary)
    r = requests.get(url)
    soup = BeautifulSoup(r.content, "html5lib")
    glossaryCSS = soup.find("div", {"class": "mw-parser-output"})
    characterGlossary = glossaryCSS.find_all(class_ = "glossary")
    link_list = []
    for character in characterGlossary:
        keywordList = character.find_all("dt")
        for keyword in keywordList:
            link = keyword.find("a")
            if link:
                href = link["href"]
                # Remove the /wiki/ part of the link
                link_list.append(href[6:])
    return link_list

def crawl_multiple_glossary(glossaries):
    wiki_link = []
    for glossary in glossaries:
        wiki_link += get_glossary_content(glossary)
    return wiki_link

glossaries = ["Glossary of artificial intelligence", "Glossary of computer science", "Glossary of civil engineering", 
              "Glossary of electrical and electronics engineering", "Glossary of mechanical engineering", "Glossary of structural engineering",
              "Glossary of aerospace engineering", "Glossary of mathematics", "Glossary of physics", "Glossary of areas of mathematics"]

def get_clean_content(term):
    """ This function gets the content of a Wikipedia page and cleans it before inputting to the 
    summarization model.
    Args:
        term: the Wikipedia term to search for
    """
    content = get_wikipedia_content(term)
    content = remove_latex(content)
    content = clean_text(content)
    content = remove_single_characters(content)
    return content

def export_json(term_dict):
    if not os.path.exists("wiki"):
        os.makedirs("wiki")
        
    with open(f"wiki/{term_dict['title']}.json", "w") as f:
        json.dump(term_dict, f, indent=4)

wiki_terms = crawl_multiple_glossary(glossaries) # Get the list of Wikipedia terms
wiki_terms = list(set(wiki_terms)) # Remove duplicates
for term in wiki_terms:
    content = get_clean_content(term)
    html, title = parse_html_and_title(term)
    list_fig_figcaption = extract_figure_figcaption(html)
    html_content = crawl_html.create_html_content(term)
    term_dict = {
        "title": title,
        "content": content,
        "img": list_fig_figcaption,
        "html": html_content,
    }
    export_json(term_dict)
    print(f"Exported {title}.json")
    
    

