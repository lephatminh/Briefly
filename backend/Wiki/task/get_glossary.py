import requests
from bs4 import BeautifulSoup
from clean_text import remove_latex, clean_text, remove_single_characters, get_wikipedia_content



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
    




    
    

