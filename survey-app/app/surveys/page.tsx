'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import { fetchSurveys } from '../services/api';
import ResponseTrends from '../components/ResponseTrends';
import CompletionRates from '../components/CompletionRates';
import { api } from '../services/api';

interface Survey {
  id: string;
  title: string;
  createdAt: string;
  status: 'published' | 'draft' | 'closed';
  created_at: string;
  responseCount: number;
  publicLink?: string;
  description: string;
}

const mockTrendData = [
  { date: new Date('2024-01-01'), count: 10 },
  { date: new Date('2024-01-02'), count: 15 },
  { date: new Date('2024-01-03'), count: 12 },
  { date: new Date('2024-01-04'), count: 25 },
  { date: new Date('2024-01-05'), count: 20 },
  { date: new Date('2024-01-06'), count: 30 },
  { date: new Date('2024-01-07'), count: 35 },
];

const mockCompletionData = [
  { name: 'Customer Survey', completed: 85, incomplete: 15 },
  { name: 'Employee Feedback', completed: 92, incomplete: 8 },
  { name: 'Product Review', completed: 78, incomplete: 22 },
  { name: 'Event Feedback', completed: 95, incomplete: 5 },
];

export default function Surveys() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSurveys = async () => {
      try {
        const data = await fetchSurveys();
        setSurveys(data);
      } catch (error) {
        setError('Failed to load surveys');
        console.error('Error loading surveys:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSurveys();
  }, []);

  const handleCSVUpload = async (surveyId: string, file: File) => {
    try {
      // Here you would implement the actual CSV upload logic
      const formData = new FormData();
      formData.append('file', file);
      formData.append('surveyId', surveyId);

      // Mock API call
      console.log('Uploading CSV:', file.name);
      
      // Success message
      alert('Respondents uploaded successfully!');
      setCsvError(null);
    } catch (error) {
      setCsvError('Error uploading CSV. Please check the file format.');
      alert(error);
    }
  };

  const generatePublicLink = async (surveyId: string) => {
    try {
      // Generate frontend URL for the survey
      const publicPath = `${process.env.NEXT_PUBLIC_FRONTEND_URL || window.location.origin}/s/${surveyId}`;
      
      // Update the backend with the public link
      const response = await fetch(api.surveys.update(surveyId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_link: publicPath,
          status: 'published'  // Optionally publish the survey when generating link
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate public link');
      }

      const updatedSurvey = await response.json();
      
      // Update local state
      setSelectedSurvey(prev => prev ? { ...prev, publicLink: publicPath } : null);
      
      return publicPath;
    } catch (error) {
      console.error('Error generating link:', error);
      return null;
    }
  };

  const ShareModal = ({ survey, onClose }: { survey: Survey; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Survey</h3>
        
        {/* Public Link Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">Public Link</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={survey.publicLink || 'No link generated'}
              readOnly
              className="flex-1 p-2 border rounded-lg text-gray-800 bg-gray-50"
            />
            <button
              onClick={() => generatePublicLink(survey.id)}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Generate
            </button>
          </div>
        </div>

        {/* CSV Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">Upload Respondents (CSV)</label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCSVUpload(survey.id, file);
              }}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-800 text-sm font-medium flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload CSV
            </button>
          </div>
          {csvError && <p className="mt-2 text-sm text-red-600">{csvError}</p>}
          <p className="mt-2 text-sm text-gray-700">
            CSV format: email, name, department (header row required)
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-800 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-red-600">
              {error}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Survey Dashboard</h1>
            <Link
              href="/surveys/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create New Survey
            </Link>
          </div>

          {/* Analytics Overview */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-700 truncate">Total Surveys</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{surveys.length}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Responses</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {surveys.reduce((acc, survey) => acc + (survey.responseCount || 0), 0)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Average Response Rate</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">85%</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Surveys</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {surveys.filter(s => s.status === 'published').length}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Response Trends</h2>
              <ResponseTrends data={mockTrendData} />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Completion Rates</h2>
              <CompletionRates data={mockCompletionData} />
            </div>
          </div>

          {/* Survey List */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Surveys</h2>
            </div>
            {surveys.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No surveys created yet. Create your first survey!
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {surveys.map((survey) => (
                  <li key={survey.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{survey.title}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <p className="text-sm text-gray-600">
                            Created on {new Date(survey.createdAt).toLocaleDateString()}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium
                            ${survey.status === 'published' 
                              ? 'bg-blue-50 text-blue-700' 
                              : survey.status === 'draft'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-yellow-50 text-yellow-700'
                            }`}
                          >
                            {survey.status ? survey.status.charAt(0).toUpperCase() + survey.status.slice(1) : 'Unknown'}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700">
                            {survey.responseCount} {survey.responseCount === 1 ? 'response' : 'responses'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => {
                            setSelectedSurvey(survey);
                            setShowModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          Share
                        </button>
                        <Link
                          href={`/surveys/${survey.id}/results`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          View Results
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showModal && selectedSurvey && (
        <ShareModal
          survey={selectedSurvey}
          onClose={() => {
            setShowModal(false);
            setSelectedSurvey(null);
          }}
        />
      )}
    </>
  );
} 