from django.shortcuts import render
from rest_framework.response import Response
# Response() will automatically serialize any
# Python object (e.g. Strings, lists, dicts) into JSON
# Note that this "serialization" is distinct from
# the serialization of Model data into Python data.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .quiz_scripts import scripts
from .models import CompletedQuiz
from .serializers import CompletedQuizSerializer


# path: api/quiz/generateQuiz/<str:topic>/<int:difficulty>
@api_view(['GET'])
def generateQuiz(request, topic, difficulty):
    # Currently just generates a quiz with 5 qns
    return Response(scripts.generate_quiz(topic, difficulty, 5))

# path: api/quiz/generateQuizFromSeed


@api_view(['POST'])
def generateQuizFromSeed(request):
    data = request.data
    return Response(scripts.generate_quiz_from_seed(data['seed']))

# path: api/quiz/updateHistory


@ api_view(['POST'])
@ permission_classes([IsAuthenticated])
def updateQuizHistory(request):
    this_user = request.user
    data = request.data
    cq = CompletedQuiz.objects.create(
        user=this_user,
        topic=data['topic'],
        difficulty=data['difficulty'],
        score=data['score'],
        maxscore=data['maxscore'],
        seed=data['seed'],
        quiz=data['quiz']
    )

    print(data['quiz'])

    serializer = CompletedQuizSerializer(cq, many=False)
    return Response(serializer.data)


# path: api/quiz/recent
@ api_view(['GET'])
@ permission_classes([IsAuthenticated])
def getRecentQuizzes(request):
    """
    Returns the users' last 10 completed quizzes in database
    """
    user = request.user
    # "completedquiz_set" is an attribute of user, returns list of all the users' completedquizzes (Python descriptors)
    last_ten = user.completedquiz_set.all().order_by('-created')[:10]
    # last_ten = CompletedQuiz.objects.all().order_by('-created')[:10]
    serializer = CompletedQuizSerializer(last_ten, many=True)
    return Response(serializer.data)
