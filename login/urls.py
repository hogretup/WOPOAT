from django.contrib import admin
from django.urls import path, include  # Add the include method
from django.views.generic import TemplateView
from . import views

urlpatterns = [
    path('signin', views.signin, name="signin"),
    path('signup', views.signup, name="signup"),
    path('logout', views.signout, name="logout"),
    path('currentUser', views.currentUser, name="currentUser")
]
