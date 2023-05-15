from django.db import models


class CompletedQuiz(models.Model):
    topic = models.TextField(null=True, blank=True)
    difficulty = models.IntegerField(null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)
    maxscore = models.IntegerField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Topic: {self.topic}, Difficulty: {self.difficulty}, Score: {self.score}, Maxscore: {self.maxscore}"
