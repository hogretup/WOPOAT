from django.urls import path
from . import views

urlpatterns = [
    # <type:name> is Django syntax to capture variable values from the URL
    path('generateQuiz/<str:topic>/<int:difficulty>',
         views.generateQuiz, name="generateQuiz"),
    path('quiz/generateQuizFromSeed', views.generateQuizFromSeed,
         name="generateQuizFromSeed"),
    path('quiz/updateHistory', views.updateQuizHistory, name="updateQuizHistory"),
    path('quiz/recent', views.getRecentQuizzes, name="getRecentQuizzes"),
    path('sendFriendRequest/<int:username>',
         views.sendFriendRequest, name="sendFriendRequest"),
    path('acceptFriendRequest/<int:requestID>',
         views.acceptFriendRequest, name='acceptFriendRequest'),
    path('declineFriendRequest/<int:requestID>',
         views.declineFriendRequest, name='declineFriendRequest'),
    path('getUserProfile', views.getUserProfile, name="getUserProfile")



]
