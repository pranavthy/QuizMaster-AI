from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Quiz, Question, Choice, QuizAttempt, UserAnswer
from .serializers import (
    UserSerializer, RegisterSerializer, QuizSerializer,
    QuizDetailSerializer, QuizAttemptSerializer
)
# We will create an ai_service.py shortly to handle Gemini integration
from .ai_service import generate_quiz_questions, get_topic_suggestions

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user': UserSerializer(user).data})
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class UserView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class QuizListView(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Quiz.objects.all().order_by('-created_at')

class QuizDetailView(generics.RetrieveAPIView):
    serializer_class = QuizDetailSerializer
    queryset = Quiz.objects.all()
    permission_classes = [permissions.IsAuthenticated]

class GenerateQuizView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        topic = request.data.get('topic')
        difficulty = request.data.get('difficulty')
        num_questions = int(request.data.get('num_questions', 5))
        question_types = request.data.get('question_types', ["mcq"])
        learning_goal = request.data.get('learning_goal', "Practice")
        show_explanation = request.data.get('show_explanation', True)

        if not all([topic, difficulty, num_questions]):
            return Response({'error': 'topic, difficulty, and num_questions are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            quiz_data = generate_quiz_questions(topic, difficulty, num_questions, question_types, learning_goal)
            
            # Create Quiz
            quiz = Quiz.objects.create(
                title=quiz_data.get('title', f"{topic} Quiz"),
                topic=topic,
                difficulty=difficulty,
                num_questions=num_questions,
                creator=request.user
            )

            # Create Questions and Choices
            for q_data in quiz_data.get('questions', []):
                question = Question.objects.create(
                    quiz=quiz, 
                    text=q_data.get('text', q_data.get('question_text'))
                )
                for c_data in q_data.get('choices', []):
                    Choice.objects.create(
                        question=question,
                        text=c_data['text'],
                        is_correct=c_data['is_correct']
                    )

            return Response(QuizDetailSerializer(quiz).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SuggestTopicView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if len(query) < 2:
            return Response([])
            
        suggestions = get_topic_suggestions(query)
        return Response(suggestions)

class SubmitQuizView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            quiz = Quiz.objects.get(pk=pk)
        except Quiz.DoesNotExist:
            return Response({'error': 'Quiz not found'}, status=status.HTTP_404_NOT_FOUND)
        
        answers_data = request.data.get('answers', [])
        # answers should be a list of dicts: [{'question_id': 1, 'choice_id': 2}]
        score = 0
        
        attempt = QuizAttempt.objects.create(user=request.user, quiz=quiz, score=0)
        
        for ans in answers_data:
            q_id = ans.get('question_id')
            c_id = ans.get('choice_id')
            try:
                question = Question.objects.get(pk=q_id, quiz=quiz)
                choice = Choice.objects.get(pk=c_id, question=question)
                
                UserAnswer.objects.create(attempt=attempt, question=question, selected_choice=choice)
                if choice.is_correct:
                    score += 1
            except (Question.DoesNotExist, Choice.DoesNotExist):
                continue

        attempt.score = score
        attempt.save()

        return Response({
            'attempt_id': attempt.id,
            'score': score,
            'total': quiz.questions.count()
        })

class QuizAttemptListView(generics.ListAPIView):
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return QuizAttempt.objects.filter(user=self.request.user).order_by('-completed_at')

class QuizAttemptDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            attempt = QuizAttempt.objects.get(pk=pk, user=request.user)
        except QuizAttempt.DoesNotExist:
            return Response({'error': 'Attempt not found'}, status=status.HTTP_404_NOT_FOUND)
        
        user_answers = attempt.answers.all()
        answers_data = []
        for ua in user_answers:
            answers_data.append({
                'question': ua.question.text,
                'selected_choice': ua.selected_choice.text if ua.selected_choice else None,
                'is_correct': ua.selected_choice.is_correct if ua.selected_choice else False,
                'correct_choice': ua.question.choices.filter(is_correct=True).first().text,
                'explanation': ua.question.explanation
            })

        return Response({
            'quiz_title': attempt.quiz.title,
            'score': attempt.score,
            'total': attempt.quiz.questions.count(),
            'completed_at': attempt.completed_at,
            'answers': answers_data
        })
