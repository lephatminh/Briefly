import requests
from bs4 import BeautifulSoup
import re

def parse_html_and_title(title):
    params = {
        "action": "parse",
        "page": title,
        "format": "json"}
    headers = {"User-Agent": "My-Bot-Name/1.0"}
    req = requests.get("https://en.wikipedia.org/w/api.php", headers=headers, params=params)
    if req.status_code != 200:
        raise Exception("Failed to fetch the page.")
    res = req.json()
    return res["parse"]["text"]["*"], res["parse"]["title"]

def extract_figure_figcaption(html):
    list_fig_figcaption = [] # List to store figure and figcaption pairs
    soup = BeautifulSoup(html, "html.parser")
    figures = soup.find_all("figure")
    for figure in figures:
        img = figure.find("img")
        if img:
            img_src = img["src"]
            link = "https:" + img_src
            figcaption = figure.find("figcaption")
            figcaption_text = figcaption.get_text()
            
            list_fig_figcaption.append((link, figcaption_text))
    return list_fig_figcaption

html, title = parse_html_and_title("Entropy")
list_fig_figcaption = extract_figure_figcaption(html)
print(list_fig_figcaption)