from django.urls import path
from .views import (
    RegisterView, LoginView, UserView,
    QuizListView, QuizDetailView, GenerateQuizView,
    SubmitQuizView, QuizAttemptListView, QuizAttemptDetailView,
    SuggestTopicView
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/user/', UserView.as_view(), name='user'),
    
    path('quizzes/', QuizListView.as_view(), name='quiz-list'),
    path('quizzes/suggest/', SuggestTopicView.as_view(), name='quiz-suggest'),
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('quizzes/generate/', GenerateQuizView.as_view(), name='quiz-generate'),
    path('quizzes/<int:pk>/submit/', SubmitQuizView.as_view(), name='quiz-submit'),
    
    path('attempts/', QuizAttemptListView.as_view(), name='attempt-list'),
    path('attempts/<int:pk>/', QuizAttemptDetailView.as_view(), name='attempt-detail'),
]
