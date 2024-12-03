from bs4 import BeautifulSoup
import requests

glossaries = ["Glossary of artificial intelligence", "Glossary of computer science", "Glossary of civil engineering", 
              "Glossary of electrical and electronics engineering", "Glossary of mechanical engineering", "Glossary of structural engineering",
              "Glossary of aerospace engineering", "Glossary of mathematics", "Glossary of physics", "Glossary of areas of mathematics"]

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


    
