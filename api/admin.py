from django.contrib import admin
from .models import CompletedQuiz

# Register your models here. (for admin page)


class CompletedQuizAdmin(admin.ModelAdmin):
    list_display = [
        'topic',
        'difficulty',
        'score',
        'maxscore',
        'created'
    ]
    # test


admin.site.register(CompletedQuiz, CompletedQuizAdmin)
