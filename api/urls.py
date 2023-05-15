from django.urls import path
from . import views

urlpatterns = [
    # <type:name> is Django syntax to capture variable values from the URL
    path('generateQuiz/<str:topic>/<int:difficulty>',
         views.generateQuiz, name="generateQuiz"),
    path('quiz/updateHistory', views.updateQuizHistory, name="updateQuizHistory"),
    path('quiz/recent', views.getRecentQuizzes, name="getRecentQuizzes")
]
