from django.contrib import admin
from .models import CompletedQuiz
from .models import UserProfile

# Register your models here. (for admin page)


class CompletedQuizAdmin(admin.ModelAdmin):
    list_display = [
        'topic',
        'difficulty',
        'score',
        'maxscore',
        'created'
    ]


class UserProfileAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'profile_image',
    ]


admin.site.register(CompletedQuiz, CompletedQuizAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
