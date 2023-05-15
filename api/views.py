from django.shortcuts import render
from rest_framework.response import Response
# Response() will automatically serialize any
# Python object (e.g. Strings, lists, dicts) into JSON
# Note that this "serialization" is distinct from
# the serialization of Model data into Python data.

from rest_framework.decorators import api_view
from . import scripts
from .models import CompletedQuiz
from .serializers import CompletedQuizSerializer


# path: api/generateQuiz/<str:topic>/<int:difficulty>
@api_view(['GET'])
def generateQuiz(request, topic, difficulty):
    # Currently just generates an Expand quiz with 3 qns
    return Response(scripts.generate_expandquiz(difficulty, 3))


# path: api/quiz/updateHistory
@api_view(['POST'])
def updateQuizHistory(request):
    data = request.data
    cq = CompletedQuiz.objects.create(
        topic=data['topic'],
        difficulty=data['difficulty'],
        score=data['score'],
        maxscore=data['maxscore']
    )

    serializer = CompletedQuizSerializer(cq, many=False)
    return Response(serializer.data)


# path: api/quiz/recent
@api_view(['GET'])
def getRecentQuizzes(request):
    """
    Returns the last 10 completed quizzes in database
    """
    last_ten = CompletedQuiz.objects.all().order_by('-created')[:10]
    serializer = CompletedQuizSerializer(last_ten, many=True)
    return Response(serializer.data)
