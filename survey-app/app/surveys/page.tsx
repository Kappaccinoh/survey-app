'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Surveys() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {session ? (
          // Authenticated user view
          <div className="flex flex-col items-center">
            <div className="text-center mb-12 w-full">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Survey Workspace</h1>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Create, manage, and analyze your surveys all in one place. Start collecting valuable feedback today.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 w-full">
              {/* Create New Survey Card */}
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:border-blue-500 transition-colors group cursor-pointer">
                <Link href="/survey/create" className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Survey</h3>
                  <p className="text-sm text-gray-500">Start from scratch or use a template</p>
                </Link>
              </div>

              {/* Template Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Feedback</h3>
                  <p className="text-sm text-gray-500 mb-4 flex-grow">Gather insights about your customer experience</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">10 questions</span>
                    <Link href="/survey/template/feedback" className="text-blue-600 hover:text-blue-700">
                      Use Template →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Employee Survey Template */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Employee Satisfaction</h3>
                  <p className="text-sm text-gray-500 mb-4 flex-grow">Measure employee engagement and satisfaction</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">15 questions</span>
                    <Link href="/survey/template/employee" className="text-blue-600 hover:text-blue-700">
                      Use Template →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-50 rounded-lg p-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-500">Active Surveys</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-500">Total Responses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-500">Templates Used</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Non-authenticated user view
          <div className="flex flex-col items-center justify-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
              Create Powerful Surveys
            </h1>
            <p className="text-xl text-gray-500 mb-8 text-center">
              Get started with our easy-to-use survey platform. Create, share, and analyze surveys in minutes.
            </p>
            <div className="space-y-4 text-center">
              <Link
                href="/signup"
                className="inline-block px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Your First Survey
              </Link>
              <div className="text-sm text-gray-500 mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Setup</h3>
                <p className="text-sm text-gray-500">Create and launch your survey in minutes with our intuitive builder</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Real-time Analytics</h3>
                <p className="text-sm text-gray-500">Get instant insights with our powerful analytics dashboard</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready Templates</h3>
                <p className="text-sm text-gray-500">Choose from our library of professional survey templates</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 