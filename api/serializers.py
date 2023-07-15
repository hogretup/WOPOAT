from rest_framework.serializers import ModelSerializer
from .models import CompletedQuiz
from .models import UserProfile


class CompletedQuizSerializer(ModelSerializer):
    class Meta:
        model = CompletedQuiz
        fields = "__all__"


class UserProfileSerializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = "__all__"
