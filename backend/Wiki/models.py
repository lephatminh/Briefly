from django.db import models

class WikiArticle(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, unique=True)
    content = models.TextField()
    images = models.JSONField(default=list)
    html = models.TextField()
    popularity = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Article '{self.title}'"