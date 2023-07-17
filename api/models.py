from django.db import models
from django.contrib.auth.models import User


class CompletedQuiz(models.Model):
    # ForeignKey: for many-to-one relationship
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True)
    topic = models.TextField(null=True, blank=True)
    difficulty = models.IntegerField(null=True, blank=True)
    score = models.IntegerField(null=True, blank=True)
    maxscore = models.IntegerField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    seed = models.TextField(null=True, blank=True)
    quiz = models.JSONField(null=True, blank=True)

    def __str__(self):
        return f"Topic: {self.topic}, Difficulty: {self.difficulty}, Score: {self.score}, Maxscore: {self.maxscore}"


def upload_to(instance, filename):
    print(filename)
    return 'images/{filename}'.format(filename=filename)


# User model to store non-auth related informatio
class UserProfile(models.Model):
    user = models.OneToOneField(
        User, related_name="myprofile", on_delete=models.CASCADE)
    friends = models.ManyToManyField(
        User, related_name="friends", blank=True)
    email = models.EmailField(null=True)
    profile_image = models.ImageField(
        null=True, blank='True', upload_to=upload_to)
    displayName = models.TextField(null=True)


class FriendRequest(models.Model):

    created = models.DateTimeField(auto_now_add=True)

    # many-to-one relationship with user who is sending the request
    from_user = models.ForeignKey(
        User, related_name="from_user", on_delete=models.CASCADE)

    # many-to-one relationship with user who is receiving the request
    to_user = models.ForeignKey(
        User, related_name="to_user", on_delete=models.CASCADE)
