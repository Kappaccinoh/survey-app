from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from backend.models import Survey, Question, QuestionOption, Response, Answer
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Seeds the database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting database seed...')

        # Create test users
        users = [
            User.objects.create_superuser(  # Changed to create_superuser
                username='demo@example.com',
                email='demo@example.com',
                password='demo1234',
                first_name='Demo',
                last_name='User'
            ),
            User.objects.create_user(
                username='test@example.com',
                email='test@example.com',
                password='test1234',
                first_name='Test',
                last_name='User'
            )
        ]
        self.stdout.write('Created users')

        # Create surveys
        surveys = [
            Survey.objects.create(
                creator=users[0],
                title="Customer Satisfaction Survey",
                description="Help us improve our services by sharing your experience",
                status='published',  # Changed from 'active' to 'published'
                public_link='cs-survey-2024'
            ),
            Survey.objects.create(
                creator=users[0],
                title="Employee Engagement Survey",
                description="Annual employee feedback survey",
                status='published',  # Changed from 'active' to 'published'
                public_link='emp-survey-2024'
            ),
            Survey.objects.create(
                creator=users[1],
                title="Product Feedback Survey",
                description="Share your thoughts on our new product",
                status='draft',
                public_link='product-feedback'
            )
        ]
        self.stdout.write('Created surveys')

        # Questions for Customer Satisfaction Survey
        cs_questions = [
            Question.objects.create(
                survey=surveys[0],
                type='multiple_choice',
                question="How satisfied are you with our service?",
                required=True,
                order=1
            ),
            Question.objects.create(
                survey=surveys[0],
                type='rating',
                question="How likely are you to recommend our service to others?",
                required=True,
                order=2
            ),
            Question.objects.create(
                survey=surveys[0],
                type='text',
                question="What improvements would you suggest for our service?",
                required=False,
                order=3
            )
        ]
        self.stdout.write('Created CS questions')

        # Options for multiple choice question
        satisfaction_options = [
            "Very satisfied",
            "Satisfied",
            "Neutral",
            "Dissatisfied",
            "Very dissatisfied"
        ]

        for idx, option in enumerate(satisfaction_options):
            QuestionOption.objects.create(
                question=cs_questions[0],
                text=option,
                order=idx
            )
        self.stdout.write('Created CS question options')

        # Questions for Employee Engagement Survey
        emp_questions = [
            Question.objects.create(
                survey=surveys[1],
                type='multiple_choice',
                question="How satisfied are you with your current role?",
                required=True,
                order=1
            ),
            Question.objects.create(
                survey=surveys[1],
                type='multiple_choice',
                question="How would you rate your work-life balance?",
                required=True,
                order=2
            ),
            Question.objects.create(
                survey=surveys[1],
                type='rating',
                question="How likely are you to be working here in two years?",
                required=True,
                order=3
            ),
            Question.objects.create(
                survey=surveys[1],
                type='text',
                question="What would make this company a better place to work?",
                required=False,
                order=4
            )
        ]
        self.stdout.write('Created EMP questions')

        # Create sample responses
        departments = ["Sales", "Marketing", "Engineering", "Customer Support", "HR"]
        
        # Generate 50 responses for Customer Satisfaction Survey
        for i in range(50):
            response = Response.objects.create(
                survey=surveys[0],
                respondent_email=f"respondent{i}@example.com",
                respondent_name=f"Respondent {i}",
                department=random.choice(departments),
                completed=True,
                created_at=timezone.now()  # Added created_at
            )

            # Multiple choice answer
            Answer.objects.create(
                response=response,
                question=cs_questions[0],
                answer_text=random.choice(satisfaction_options)
            )

            # Rating answer
            Answer.objects.create(
                response=response,
                question=cs_questions[1],
                answer_text=str(random.randint(1, 10))
            )

            # Text answer
            Answer.objects.create(
                response=response,
                question=cs_questions[2],
                answer_text="Sample feedback text for improvements."
            )
        self.stdout.write('Created CS responses')

        # Generate 30 responses for Employee Engagement Survey
        for i in range(30):
            response = Response.objects.create(
                survey=surveys[1],
                respondent_email=f"employee{i}@company.com",
                respondent_name=f"Employee {i}",
                department=random.choice(departments),
                completed=True,
                created_at=timezone.now()  # Added created_at
            )

            # Add answers for each question
            for question in emp_questions:
                if question.type == 'multiple_choice':
                    Answer.objects.create(
                        response=response,
                        question=question,
                        answer_text=random.choice(satisfaction_options)
                    )
                elif question.type == 'rating':
                    Answer.objects.create(
                        response=response,
                        question=question,
                        answer_text=str(random.randint(1, 10))
                    )
                else:  # text
                    Answer.objects.create(
                        response=response,
                        question=question,
                        answer_text="Sample text feedback from employee."
                    )
        self.stdout.write('Created EMP responses')

        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))