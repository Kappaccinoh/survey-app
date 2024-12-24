'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '../../components/Navigation';

type Question = {
  id: number;
  type: 'multiple_choice' | 'text' | 'rating';
  question: string;
  options?: string[];
};

// Mock survey data (replace with actual API call)
const mockSurvey = {
  id: 1,
  title: "Customer Satisfaction Survey",
  description: "Help us improve our services by sharing your experience",
  questions: [
    {
      id: 1,
      type: 'multiple_choice' as const,
      question: 'How satisfied are you with our service?',
      options: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied']
    },
    {
      id: 2,
      type: 'rating' as const,
      question: 'How likely are you to recommend our service to others?',
    },
    {
      id: 3,
      type: 'text' as const,
      question: 'What improvements would you suggest for our service?',
    }
  ]
};

export default function SurveyPage() {
  const params = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    // TODO: Implement API call to submit survey responses
    console.log('Submitting answers:', answers);
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
                  name={`question-${question.id}`}
                  value={option}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  checked={answers[question.id] === option}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
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
                onClick={() => handleAnswer(question.id, rating.toString())}
                className={`w-10 h-10 rounded-full ${
                  answers[question.id] === rating.toString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
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
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Type your answer here..."
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            value={answers[question.id] || ''}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg">
            {/* Survey Header */}
            <div className="px-6 py-4 border-b">
              <h1 className="text-2xl font-bold text-gray-900">{mockSurvey.title}</h1>
              <p className="mt-1 text-gray-600">{mockSurvey.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-2">
              <div
                className="bg-blue-600 h-2 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / mockSurvey.questions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="px-6 py-8">
              <div className="mb-6">
                <span className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {mockSurvey.questions.length}
                </span>
                <h2 className="text-xl font-medium text-gray-900 mt-2">
                  {mockSurvey.questions[currentQuestion].question}
                </h2>
              </div>

              {renderQuestion(mockSurvey.questions[currentQuestion])}
            </div>

            {/* Navigation Buttons */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
              >
                Previous
              </button>
              {currentQuestion < mockSurvey.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Submit Survey
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 