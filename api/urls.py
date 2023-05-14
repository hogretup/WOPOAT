from django.urls import path
from . import views

urlpatterns = [
    # <type:name> is Django syntax to capture variable values from the URL
    path('generateQuiz/<str:topic>/<int:difficulty>',
         views.generateQuiz, name="generateQuiz")
]
