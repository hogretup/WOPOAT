from django.shortcuts import render
from rest_framework.response import Response
# Response() will automatically serialize any
# Python object (e.g. Strings, lists, dicts) into JSON
# Note that this "serialization" is distinct from
# the serialization of Model data into Python data.

from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json


@api_view(['POST'])
def signup(request):
    # Currently just generates an Expand quiz with 3 qns
    data = json.loads(request.body)
    username = data['username']
    password = data['password']
    myuser = User.objects.create_user(username = username, password = password)
    myuser.save()
    return JsonResponse({'message': 'User created successfully!'})

@api_view(['POST'])
def signin(request):
    data = json.loads(request.body)
    username = data['username']
    password = data['password']
    print(data['username'])
    print(data['password'])
    try:
        user = User.objects.get(username=username)
        print("the user is: " + str(user))
        if user.check_password(password):
            response_data = {'exists': 'Valid user'}
            return JsonResponse(response_data)
        else:
            response_data = {'exists': 'Invalid password'}
            return HttpResponse(response_data)
    except User.DoesNotExist:
        response_data = {'exists': 'Invalid username'}
        return HttpResponse(response_data)
