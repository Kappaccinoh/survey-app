from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response as DRFResponse
from django.shortcuts import get_object_or_404
from .models import Survey, Question, Response
from .serializers import (
    SurveySerializer, QuestionSerializer, 
    ResponseSerializer, SurveyResponseSerializer,
    ResponseCreateSerializer
)
import csv
from django.http import HttpResponse
import uuid

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