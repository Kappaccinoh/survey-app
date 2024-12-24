'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '../../../components/Navigation';
import { fetchSurveyResults } from '../../../services/api';
import ResponseTrends from '../../../components/ResponseTrends';
import CompletionRates from '../../../components/CompletionRates';

interface QuestionResult {
  id: number;
  type: 'multiple_choice' | 'text' | 'rating' | 'yes_no';
  question: string;
  responses: Array<{
    option?: string;
    count?: number;
    answer_text?: string;
  }>;
  averageRating?: number;
  distribution?: Array<{
    rating: number;
    count: number;
  }>;
}

interface SurveyResults {
  id: string;
  title: string;
  totalResponses: number;
  questions: QuestionResult[];
}

export default function SurveyResults() {
  const params = useParams();
  const router = useRouter();
  const [results, setResults] = useState<SurveyResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await fetchSurveyResults(params.id as string);
        setResults(data);
      } catch (error) {
        setError('Failed to load survey results');
        console.error('Error loading results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [params.id]);

  const renderQuestionResults = (question: QuestionResult) => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            {question.responses.map((response, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">{response.option}</span>
                  <span className="text-sm text-gray-700">
                    {Math.round((response.count! / results!.totalResponses) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(response.count! / results!.totalResponses) * 100}%` }}
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
              {question.distribution?.map((item) => (
                <div key={item.rating} className="relative">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.rating} stars</span>
                    <span className="text-sm text-gray-500">{item.count} responses</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(item.count / results!.totalResponses) * 100}%` }}
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
            {question.responses.map((response, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-800">{response.answer_text}</p>
              </div>
            ))}
          </div>
        );

      case 'yes_no':
        return (
          <div className="space-y-4">
            {question.responses.map((response, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">{response.option}</span>
                  <span className="text-sm text-gray-700">
                    {Math.round((response.count! / results!.totalResponses) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(response.count! / results!.totalResponses) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !results) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center text-red-600">
              {error || 'Failed to load survey results'}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <button
              onClick={() => router.push('/surveys')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Surveys
            </button>
          </div>

          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg px-6 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">{results.title}</h1>
                <div className="text-gray-500">
                  Total Responses: <span className="font-semibold">{results.totalResponses}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-white shadow rounded-lg p-8">
                <div className="h-[500px]">
                  <ResponseTrends data={generateTrendData(results)} />
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-8">
                <div className="h-[500px]">
                  <CompletionRates data={generateCompletionData(results)} />
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-8 py-8 space-y-12">
                {results.questions.map((question, index) => (
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
      </div>
    </>
  );
}

function generateTrendData(results: SurveyResults) {
  // Generate daily response counts for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    return {
      date,
      count: Math.floor(Math.random() * 20) + 1 // Replace with actual data
    };
  });
}

function generateCompletionData(results: SurveyResults) {
  return results.questions.map(q => ({
    name: q.question.slice(0, 20) + '...',
    completed: q.responses.length,
    incomplete: results.totalResponses - q.responses.length
  }));
} 