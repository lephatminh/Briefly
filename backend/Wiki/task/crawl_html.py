import mwparserfromhell
import requests
import re
import pypandoc
from bs4 import BeautifulSoup

# Constants
API_URL = "https://en.wikipedia.org/w/api.php"

# Regex Patterns
RE_SINGLE_DOLLAR = re.compile(r'(?<!\$)\$(?!\$)')
RE_ADD_SPACE = re.compile(r'([^ ])\$\$')
RE_REMOVE_NEWLINES = re.compile(r'(?<![A-Za-z]{2})\n+(?=\\(?:text|display)style)')
RE_REMOVE_TEMPLATE_CONTENT = re.compile(r'\{\{.*?\}\}', flags=re.DOTALL)
RE_REMOVE_CLOSING_BRACES = re.compile(r'<[^>]*?>\s*}}\s*<[^>]*?>')
RE_REMOVE_SECTIONS = re.compile(r'<h2[^>]*?>\s*(See also|Notes|References|External links|Further reading)\s*</h2>.*', flags=re.DOTALL)
RE_REMOVE_IMAGES = re.compile(r'<img[^>]*?>')
RE_REMOVE_FIGURES = re.compile(r'<figure[^>]*?>.*?</figure>', flags=re.DOTALL)
RE_REMOVE_THUMB_PATTERN = re.compile(r'thumb\|[\d]+px')
RE_REMOVE_NUMERIC_BOLD_TAGS = re.compile(r'<b>\d+</b>')

def parse(title):
    params = {
        "action": "query",
        "prop": "revisions",
        "rvprop": "content",
        "rvslots": "main",
        "rvlimit": 1,
        "titles": title,
        "format": "json",
        "formatversion": "2",
    }
    headers = {"User-Agent": "My-Bot-Name/1.0"}
    req = requests.get(API_URL, headers=headers, params=params)
    res = req.json()
    revision = res["query"]["pages"][0]["revisions"][0]
    text = revision["slots"]["main"]["content"]
    return mwparserfromhell.parse(text)

def preprocess_wikitext(wikitext):
    """
    Preprocess the wikitext by removing specific templates and fixing newline issues.

    Args:
        wikitext (str): The raw wikitext content.

    Returns:
        str: The cleaned and modified wikitext.
    """
    parsed = mwparserfromhell.parse(wikitext)

    # Remove all 'Infobox' templates
    templates = parsed.filter_templates(matches=lambda t: t.name.lower().strip() == "infobox")
    for template in templates:
        parsed.remove(template)

    # Remove newlines before LaTeX commands
    cleaned_text = str(parsed)
    cleaned_text = RE_REMOVE_NEWLINES.sub('', cleaned_text)

    # Remove all the contents starting with {{ and ending with }}
    cleaned_text = RE_REMOVE_TEMPLATE_CONTENT.sub('', cleaned_text)
    return cleaned_text

def convert_wikitext_to_html(wikitext, output_format='html'):
    """
    Convert wikitext to HTML using Pandoc.

    Args:
        wikitext (str): The preprocessed wikitext content.
        output_format (str): The desired output format (default is 'html').

    Returns:
        str: The converted HTML content.
    """
    try:
        # Convert using Pandoc via pypandoc
        html = pypandoc.convert_text(wikitext, to=output_format, format='mediawiki')
        return html
    except RuntimeError as e:
        print("An error occurred during conversion:", e)
        return ""

def process_html(content):
    # Remove any lines that contain }} only between tags. For example, <p>}}</p>
    content = RE_REMOVE_CLOSING_BRACES.sub('', content)

    # Remove any content from the "See also" section onwards
    content = RE_REMOVE_SECTIONS.sub('', content)

    soup = BeautifulSoup(content, 'html.parser')

    # Replace <a> tags with <b> tags containing the text
    for a_tag in soup.find_all('a'):
        b_tag = soup.new_tag('b')
        b_tag.string = a_tag.text
        a_tag.replace_with(b_tag)

    # Remove the <sup> tags and their content
    for sup_tag in soup.find_all('sup'):
        sup_tag.decompose()

    cleaned_content = str(soup).strip()

    # Remove all <img /> tags
    cleaned_content = RE_REMOVE_IMAGES.sub('', cleaned_content)

    # Remove all <figure> tags and their content
    cleaned_content = RE_REMOVE_FIGURES.sub('', cleaned_content)

    # If before and after $$ there's not a space, add a space
    cleaned_content = RE_ADD_SPACE.sub(r'\1 $$', cleaned_content)

    # Replace single $ with $$ for MathJax compatibility
    cleaned_content = RE_SINGLE_DOLLAR.sub('$$', cleaned_content)

    # Remove the pattern thumb| followed by a number
    cleaned_content = RE_REMOVE_THUMB_PATTERN.sub('', cleaned_content)

    # Remove any <b> tags that contain only numbers
    cleaned_content = RE_REMOVE_NUMERIC_BOLD_TAGS.sub('', cleaned_content)

    return cleaned_content

def create_html_content(page_title):
    # Get the content of the page
    wikicode = parse(page_title)
    wikitext = str(wikicode)
    cleaned_wikitext = preprocess_wikitext(wikitext)
    html_content = convert_wikitext_to_html(cleaned_wikitext)
    html_content = process_html(html_content)
    return html_content

# The HTML content is now cleaned and ready to be pushed to database
