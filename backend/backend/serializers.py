from rest_framework import serializers
from .models import Survey, Question, QuestionOption, Response, Answer
from django.contrib.auth import get_user_model

class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['text', 'order']

class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, required=False)

    class Meta:
        model = Question
        fields = ['type', 'question', 'description', 'required', 'options']

    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        question = Question.objects.create(**validated_data)
        for option_data in options_data:
            QuestionOption.objects.create(question=question, **option_data)
        return question

class SurveySerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True)

    class Meta:
        model = Survey
        fields = ['id', 'title', 'description', 'status', 'created_at', 'questions']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        survey = Survey.objects.create(**validated_data)

        for question_data in questions_data:
            options_data = question_data.pop('options', [])
            question = Question.objects.create(survey=survey, **question_data)
            
            for option_data in options_data:
                QuestionOption.objects.create(question=question, **option_data)

        return survey
        
class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'question', 'answer_text']

class ResponseSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = Response
        fields = ['id', 'survey', 'respondent_email', 'respondent_name', 
                 'department', 'created_at', 'completed', 'answers']

    def create(self, validated_data):
        answers_data = validated_data.pop('answers', [])
        response = Response.objects.create(**validated_data)
        for answer_data in answers_data:
            Answer.objects.create(response=response, **answer_data)
        return response

class SurveyResponseSerializer(serializers.ModelSerializer):
    """Serializer for public survey view (without sensitive data)"""
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Survey
        fields = ['id', 'title', 'description', 'questions']

class AnswerCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['question', 'answer_text']

class ResponseCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new responses"""
    answers = AnswerCreateSerializer(many=True)

    class Meta:
        model = Response
        fields = [
            'survey', 'respondent_email', 'respondent_name',
            'department', 'answers'
        ]

    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        response = Response.objects.create(**validated_data)
        
        for answer_data in answers_data:
            Answer.objects.create(response=response, **answer_data)
        
        # Mark response as completed
        response.completed = True
        response.save()
        
        return response
