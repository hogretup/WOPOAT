from django.db import models
from django.contrib.auth.models import User


class CompletedQuiz(models.Model):
    # ForeignKey: for many-to-one relationship
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    topic = models.TextField(null=True, blank=True)
    difficulty = models.IntegerField(null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)
    maxscore = models.IntegerField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    seed = models.TextField(null=True, blank=True)
    quiz = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Topic: {self.topic}, Difficulty: {self.difficulty}, Score: {self.score}, Maxscore: {self.maxscore}"
