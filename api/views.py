from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
# Response() will automatically serialize any
# Python object (e.g. Strings, lists, dicts) into JSON
# Note that this "serialization" is distinct from
# the serialization of Model data into Python data.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser

from .quiz_scripts import scripts
from .models import CompletedQuiz, FriendRequest, UserProfile
from .serializers import CompletedQuizSerializer, UserProfileSerializer, FriendRequestSerializer


# path: api/generateQuiz/<str:topic>/<int:difficulty>
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

# -------------------- Friends --------------------


# path: api/getUserProfile
@ api_view(['GET'])
@ permission_classes([IsAuthenticated])
def getUserProfile(request):
    """
    Returns the User Profile with user information
    """
    friends = request.user.myprofile.friends.all()
    print(friends)
    serializer = UserProfileSerializer(request.user.myprofile)
    return Response(serializer.data)


# path: api/getFriendsList
@ api_view(['GET'])
@ permission_classes([IsAuthenticated])
def getFriendsList(request):
    """
    Returns a list of usernames of friends
    """
    friends = request.user.myprofile.friends.all()
    friendList = [friend.username for friend in friends]
    return Response(friendList)


# path: api/sendFriendRequest/<str:username>
@ api_view(['POST'])
@ permission_classes([IsAuthenticated])
def sendFriendRequest(request, username):
    """
    Sends a friend request to another User
    """
    from_user = request.user
    to_user = User.objects.get(username=username)

    # Can't send a friend request to yourself
    if to_user == from_user:
        return Response("failed", status=status.HTTP_400_BAD_REQUEST)
    friend_request, created = FriendRequest.objects.get_or_create(
        from_user=from_user, to_user=to_user)
    if created:
        return Response('friend request sent')
    else:
        return Response('friend request was already sent')


# path: api/acceptFriendRequest/<int:requestID>
@ api_view(['POST'])
@ permission_classes([IsAuthenticated])
def acceptFriendRequest(request, requestID):
    """
    Accepts the friend request from a User
    """
    friendRequest = FriendRequest.objects.get(id=requestID)
    if friendRequest.to_user == request.user:
        friendRequest.to_user.myprofile.friends.add(
            friendRequest.from_user)
        friendRequest.from_user.myprofile.friends.add(
            friendRequest.to_user)
        friendRequest.delete()
        return Response('successfully accepted')
    else:
        return Response('something went wrong when accepting')


# path: api/declineFriendRequest/<int:requestID>
@ api_view(['POST'])
@ permission_classes([IsAuthenticated])
def declineFriendRequest(request, requestID):
    """
    Declines the friend request from a User
    """
    friendRequest = FriendRequest.objects.get(id=requestID)
    if friendRequest.to_user == request.user:
        friendRequest.delete()
        return Response('successfully declined')
    else:
        return Response('something went wrong when declining')


# path: api/getFriendRequests
@ api_view(['GET'])
@ permission_classes([IsAuthenticated])
def getFriendRequests(request):
    """
    Returns a list of all pending friend requests to current user,
    e.g. [{username: 'a', requestID: '1'}]
    """
    user = request.user
    friend_requests = user.to_user.all().order_by('-created')
    request_list = [{'username': friend_request.from_user.username,
                     'requestID': friend_request.id} for friend_request in friend_requests]
    return Response(request_list)

from django.http import JsonResponse, QueryDict
from django.views.decorators.csrf import csrf_exempt

# path: api/updateUserDetails
@ api_view(['POST'])
@ permission_classes([IsAuthenticated])
def updateUserDetails(request):
        print(request.body)
        return
        