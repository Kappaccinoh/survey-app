'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '../../../components/Navigation';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

// Mock results data (replace with actual API call)
const mockResults = {
  totalResponses: 150,
  questions: [
    {
      id: 1,
      type: 'multiple_choice',
      question: 'How satisfied are you with our service?',
      responses: [
        { option: 'Very satisfied', count: 75 },
        { option: 'Satisfied', count: 45 },
        { option: 'Neutral', count: 20 },
        { option: 'Dissatisfied', count: 8 },
        { option: 'Very dissatisfied', count: 2 }
      ]
    },
    {
      id: 2,
      type: 'rating',
      question: 'How likely are you to recommend our service to others?',
      averageRating: 8.5,
      distribution: [
        { rating: 10, count: 50 },
        { rating: 9, count: 35 },
        { rating: 8, count: 30 },
        { rating: 7, count: 20 },
        { rating: 6, count: 10 },
        { rating: 5, count: 5 }
      ]
    },
    {
      id: 3,
      type: 'text',
      question: 'What improvements would you suggest for our service?',
      responses: [
        "Better mobile app interface",
        "Faster response times",
        "More customization options"
      ]
    }
  ]
};

export default function SurveyResults() {
  // const { data: session } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     redirect('/login');
  //   },
  // });
  
  const params = useParams();
  const router = useRouter();

  const renderQuestionResults = (question: any) => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            {question.responses.map((response: any, index: number) => (
              <div key={index} className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">{response.option}</span>
                  <span className="text-sm text-gray-700">
                    {Math.round((response.count / mockResults.totalResponses) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(response.count / mockResults.totalResponses) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 'rating':
        return (
          <div>
            <div className="text-center mb-6">
              <span className="text-3xl font-bold text-gray-900">{question.averageRating}</span>
              <span className="text-gray-500 ml-2">average rating</span>
            </div>
            <div className="space-y-3">
              {question.distribution.map((item: any) => (
                <div key={item.rating} className="relative">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.rating} stars</span>
                    <span className="text-sm text-gray-500">{item.count} responses</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(item.count / mockResults.totalResponses) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            {question.responses.map((response: string, index: number) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-800">{response}</p>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <button
              onClick={() => router.push('/surveys')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              Back to Surveys
            </button>
          </div>

          <div className="bg-white shadow rounded-lg">
            {/* Header */}
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Survey Results</h1>
                <div className="text-gray-500">
                  Total Responses: <span className="font-semibold">{mockResults.totalResponses}</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="px-6 py-8 space-y-12">
              {mockResults.questions.map((question, index) => (
                <div key={question.id} className="space-y-4">
                  <h2 className="text-xl font-medium text-gray-900">
                    {index + 1}. {question.question}
                  </h2>
                  {renderQuestionResults(question)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 