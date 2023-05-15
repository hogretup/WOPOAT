from django.shortcuts import render
from rest_framework.response import Response
# Response() will automatically serialize any
# Python object (e.g. Strings, lists, dicts) into JSON
# Note that this "serialization" is distinct from
# the serialization of Model data into Python data.

from rest_framework.decorators import api_view
from . import scripts


# path: api/generateQuiz/<str:topic>/<int:difficulty>
@api_view(['GET'])
def generateQuiz(request, topic, difficulty):
    # Currently just generates an Expand quiz with 3 qns
    return Response(scripts.generate_expandquiz(difficulty, 3))
