'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '../../../components/Navigation';

interface Question {
  id: string;
  type: 'multiple_choice' | 'text' | 'rating' | 'yes_no';
  question: string;
  description?: string;
  required: boolean;
  options?: string[];
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export default function RespondToSurvey() {
  const params = useParams();
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [respondentInfo, setRespondentInfo] = useState({
    email: '',
    name: '',
    department: ''
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setSurvey({
        id: params.id as string,
        title: "Customer Satisfaction Survey",
        description: "Help us improve our services by sharing your feedback",
        questions: [
          {
            id: "1",
            type: "multiple_choice",
            question: "How satisfied are you with our service?",
            required: true,
            options: [
              "Very satisfied",
              "Satisfied",
              "Neutral",
              "Dissatisfied",
              "Very dissatisfied"
            ]
          },
          {
            id: "2",
            type: "rating",
            question: "How likely are you to recommend our service to others?",
            required: true
          },
          {
            id: "3",
            type: "text",
            question: "What improvements would you suggest for our service?",
            required: false
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const handleAnswer = (answer: string) => {
    const currentQuestionId = survey?.questions[currentQuestion].id;
    if (currentQuestionId) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestionId]: answer
      }));
    }
  };

  const isQuestionAnswered = (questionId: string) => {
    return !!answers[questionId] || !survey?.questions.find(q => q.id === questionId)?.required;
  };

  const handleSubmit = async () => {
    try {
      // Here you would implement the actual API call
      console.log('Submitting answers:', {
        survey: params.id,
        ...respondentInfo,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question: questionId,
          answer_text: answer
        }))
      });
      
      router.push(`/surveys/${params.id}/thank-you`);
    } catch (error) {
      setError('Failed to submit survey. Please try again.');
    }
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div className="flex justify-center space-x-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
              <button
                key={rating}
                onClick={() => handleAnswer(rating.toString())}
                className={`w-12 h-12 rounded-full ${
                  answers[question.id] === rating.toString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {rating}
              </button>
            ))}
          </div>
        );

      case 'text':
        return (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows={4}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        );

      case 'yes_no':
        return (
          <div className="flex space-x-4">
            {['Yes', 'No'].map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`px-6 py-3 rounded-lg ${
                  answers[question.id] === option
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-900">Survey not found</div>
      </div>
    );
  }

  if (currentQuestion === 0) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white shadow rounded-lg p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{survey.title}</h1>
              <p className="text-gray-700 mb-8">{survey.description}</p>

              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={respondentInfo.email}
                    onChange={(e) => setRespondentInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-2 border rounded-lg text-gray-900"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={respondentInfo.name}
                    onChange={(e) => setRespondentInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border rounded-lg text-gray-900"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={respondentInfo.department}
                    onChange={(e) => setRespondentInfo(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full p-2 border rounded-lg text-gray-900"
                    placeholder="Your department"
                  />
                </div>
              </div>

              <button
                onClick={() => setCurrentQuestion(1)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start Survey
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg">
            {/* Progress bar */}
            <div className="w-full bg-gray-200 h-2">
              <div
                className="bg-blue-600 h-2 transition-all duration-300"
                style={{ width: `${((currentQuestion) / survey.questions.length) * 100}%` }}
              />
            </div>

            <div className="p-6">
              {/* Question */}
              <div className="mb-8">
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  {survey.questions[currentQuestion - 1].question}
                </h2>
                {survey.questions[currentQuestion - 1].description && (
                  <p className="text-gray-700">
                    {survey.questions[currentQuestion - 1].description}
                  </p>
                )}
              </div>

              {/* Answer input */}
              {renderQuestion(survey.questions[currentQuestion - 1])}

              {/* Error message */}
              {error && (
                <div className="mt-4 text-red-600">
                  {error}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentQuestion(prev => prev - 1)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (currentQuestion === survey.questions.length) {
                      handleSubmit();
                    } else {
                      setCurrentQuestion(prev => prev + 1);
                    }
                  }}
                  disabled={!isQuestionAnswered(survey.questions[currentQuestion - 1].id)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion === survey.questions.length ? 'Submit' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 