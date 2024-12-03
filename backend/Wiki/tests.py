from django.test import TestCase
from .models import WikiArticle
from .documents import WikiDocument

class WikiArticleSearchTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        """Set up test data for the WikiArticle model."""
        articles = [
            {
                "title": "Python Programming",
                "content": "Python is a popular programming language.",
                "images": [{"url": "python_image.jpg", "alt": "Python"}],
                "html": "<h1>Python Programming</h1><p>Python is a popular programming language.</p>",
            },
            {
                "title": "Django Framework",
                "content": "Django is a Python-based web framework.",
                "images": [{"url": "django_image.jpg", "alt": "Django"}],
                "html": "<h1>Django Framework</h1><p>Django is a Python-based web framework.</p>",
            },
            {
                "title": "Elasticsearch",
                "content": "Elasticsearch is a search engine based on Lucene.",
                "images": [{"url": "elasticsearch_image.jpg", "alt": "Elasticsearch"}],
                "html": "<h1>Elasticsearch</h1><p>Elasticsearch is a search engine based on Lucene.</p>",
            },
            {
                "title": "Machine Learning",
                "content": "Machine learning is a field of artificial intelligence.",
                "images": [{"url": "ml_image.jpg", "alt": "Machine Learning"}],
                "html": "<h1>Machine Learning</h1><p>Machine learning is a field of artificial intelligence.</p>",
            },
            {
                "title": "Web Development",
                "content": "Web development involves building websites and web apps.",
                "images": [{"url": "web_dev_image.jpg", "alt": "Web Development"}],
                "html": "<h1>Web Development</h1><p>Web development involves building websites and web apps.</p>",
            },
        ]

        for article in articles:
            WikiArticle.objects.create(**article)

        # Index all articles in Elasticsearch
        for article in WikiArticle.objects.all():
            WikiDocument().update(article)

    def test_search_title(self):
        """Test search by title."""
        search = WikiDocument.search().query("match", title="Python")
        results = search.execute()

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].title, "Python Programming")

    def test_search_content(self):
        """Test search by content."""
        search = WikiDocument.search().query("match", content="search engine")
        results = search.execute()

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].title, "Elasticsearch")

    def test_search_partial_title(self):
        """Test search with partial title."""
        search = WikiDocument.search().query("match", title="Machine")
        results = search.execute()

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].title, "Machine Learning")
        
    def test_retrieve_model(self):
        """Test search and retrieve model."""
        search = WikiDocument.search().query("match", title="Machine")
        query_set = search.to_queryset()
        
        print(query_set)
        
        self.assertEqual(query_set.count(), 1)
        self.assertEqual(query_set[0].title, "Machine Learning")
        self.assertIn("Machine", query_set[0].title)
        self.assertIn("artificial intelligence", query_set[0].content)



    def test_search_no_results(self):
        """Test search with no results."""
        search = WikiDocument.search().query("match", title="Nonexistent")
        results = search.execute()

        self.assertEqual(len(results), 0)