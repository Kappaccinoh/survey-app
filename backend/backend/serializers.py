from rest_framework import serializers
from .models import Survey, Question, QuestionOption, Response, Answer
from django.contrib.auth import get_user_model

class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['id', 'text', 'order']

class QuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True, required=False)

    class Meta:
        model = Question
        fields = ['id', 'type', 'question', 'description', 'required', 'order', 'options']

    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        question = Question.objects.create(**validated_data)
        for option_data in options_data:
            QuestionOption.objects.create(question=question, **option_data)
        return question

class SurveySerializer(serializers.ModelSerializer):
    class Meta:
        model = Survey
        fields = ['id', 'title', 'description', 'questions', 'status', 'created_at', 'updated_at']

    def create(self, validated_data):
        questions_data = validated_data.pop('questions', [])
        try:
            # Get the first superuser instead of any user
            User = get_user_model()
            admin_user = User.objects.filter(is_superuser=True).first()
            if not admin_user:
                raise serializers.ValidationError("No admin user found")
            
            validated_data['creator'] = admin_user
            survey = Survey.objects.create(**validated_data)

            for question_data in questions_data:
                options_data = question_data.pop('options', [])
                question = Question.objects.create(survey=survey, **question_data)
                
                if question.type == 'multiple_choice':
                    for option_data in options_data:
                        QuestionOption.objects.create(question=question, text=option_data)

            return survey
        except Exception as e:
            raise serializers.ValidationError(str(e))
        
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
