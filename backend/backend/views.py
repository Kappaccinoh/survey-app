from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response as DRFResponse
from django.shortcuts import get_object_or_404
from .models import Survey, Question, Response, Answer
from .serializers import (
    SurveySerializer, QuestionSerializer, 
    ResponseSerializer, SurveyResponseSerializer,
    ResponseCreateSerializer
)
import csv
from django.http import HttpResponse
import uuid
from django.db.models import Count

class SurveyViewSet(viewsets.ModelViewSet):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve_public':
            return SurveyResponseSerializer
        return SurveySerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user if self.request.user.is_authenticated else None)

    @action(detail=True, methods=['post'])
    def generate_public_link(self, request, pk=None):
        survey = self.get_object()
        public_link = str(uuid.uuid4())[:8]
        survey.public_link = public_link
        survey.save()
        return DRFResponse({'public_link': public_link})

    @action(detail=True, methods=['post'])
    def upload_respondents(self, request, pk=None):
        survey = self.get_object()
        csv_file = request.FILES.get('file')
        
        if not csv_file:
            return DRFResponse(
                {'error': 'No file provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            decoded_file = csv_file.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file)
            
            for row in reader:
                Response.objects.create(
                    survey=survey,
                    respondent_email=row.get('email'),
                    respondent_name=row.get('name'),
                    department=row.get('department')
                )
            
            return DRFResponse({'message': 'Respondents uploaded successfully'})
        except Exception as e:
            return DRFResponse(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['get'], url_path='public/(?P<public_link>[^/.]+)')
    def retrieve_public(self, request, pk=None, public_link=None):
        """Endpoint for accessing public surveys"""
        survey = get_object_or_404(
            Survey, 
            id=pk, 
            public_link=public_link, 
            status='active'
        )
        serializer = self.get_serializer(survey)
        return DRFResponse(serializer.data)

    def create(self, request, *args, **kwargs):
        print("Received data:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)
            return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return DRFResponse(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        survey = self.get_object()
        questions = survey.questions.all()
        total_responses = survey.responses.filter(completed=True).count()

        results = {
            'id': survey.id,
            'title': survey.title,
            'totalResponses': total_responses,
            'questions': []
        }

        for question in questions:
            question_data = {
                'id': question.id,
                'type': question.type,
                'question': question.question,
                'responses': []
            }

            if question.type == 'multiple_choice' or question.type == 'yes_no':
                answers = Answer.objects.filter(
                    question=question,
                    response__completed=True
                ).values('answer_text').annotate(count=Count('answer_text'))
                
                question_data['responses'] = [
                    {'option': answer['answer_text'], 'count': answer['count']}
                    for answer in answers
                ]

            elif question.type == 'rating':
                answers = Answer.objects.filter(
                    question=question,
                    response__completed=True
                )
                ratings = [int(a.answer_text) for a in answers if a.answer_text.isdigit()]
                
                if ratings:
                    question_data['averageRating'] = sum(ratings) / len(ratings)
                    question_data['distribution'] = [
                        {'rating': i, 'count': ratings.count(i)}
                        for i in range(1, 11)
                    ]

            else:  # text responses
                answers = Answer.objects.filter(
                    question=question,
                    response__completed=True
                )
                question_data['responses'] = [
                    {'answer_text': answer.answer_text}
                    for answer in answers
                ]

            results['questions'].append(question_data)

        return DRFResponse(results)

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.AllowAny]

class ResponseViewSet(viewsets.ModelViewSet):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return ResponseCreateSerializer
        return ResponseSerializer

    def create(self, request, *args, **kwargs):
        survey_id = request.data.get('survey')
        survey = get_object_or_404(Survey, id=survey_id)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return DRFResponse(
            {'message': 'Response submitted successfully'},
            status=status.HTTP_201_CREATED
        )