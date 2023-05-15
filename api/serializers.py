from rest_framework.serializers import ModelSerializer
from .models import CompletedQuiz


class CompletedQuizSerializer(ModelSerializer):
    class Meta:
        model = CompletedQuiz
        fields = "__all__"
