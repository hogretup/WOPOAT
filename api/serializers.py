from rest_framework.serializers import ModelSerializer
from .models import CompletedQuiz, UserProfile, FriendRequest


class CompletedQuizSerializer(ModelSerializer):
    class Meta:
        model = CompletedQuiz
        fields = "__all__"


class UserProfileSerializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"


class FriendRequestSerializer(ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = "__all__"
