from django.shortcuts import render
from rest_framework.response import Response
# Response() will automatically serialize any
# Python object (e.g. Strings, lists, dicts) into JSON
# Note that this "serialization" is distinct from
# the serialization of Model data into Python data.

from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json


# path: login/signup
@api_view(['POST'])
def signup(request):
    data = json.loads(request.body)
    username = data['username']
    password = data['password']
    myuser = User.objects.create_user(username=username, password=password)
    myuser.save()
    return JsonResponse({'message': 'User created successfully!'})


# path: login/signin
@api_view(['POST'])
def signin(request):
    data = json.loads(request.body)
    username = data['username']
    password = data['password']

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return Response("success")
    else:
        return Response("invalid")


# path: login/signout
@api_view(['GET'])
def signout(request):
    logout(request)
    return HttpResponse(status=200)


# path: login/currentUser
@api_view(['GET'])
def currentUser(request):
    user = request.user
    return Response({
        'username': user.username,
    })
