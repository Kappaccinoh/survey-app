'use client';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Surveys() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Public Surveys</h1>
          {session && (
            <Link
              href="/dashboard"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        {/* Survey List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Sample Survey Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Customer Feedback Survey
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Help us improve our services by sharing your experience
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  5 min • 10 questions
                </span>
                <Link
                  href="/survey/1"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Take Survey
                </Link>
              </div>
            </div>
          </div>

          {/* Add more survey cards here */}
        </div>

        {/* Call to Action for Non-authenticated Users */}
        {!session && (
          <div className="mt-12 bg-blue-50 dark:bg-blue-900 rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Create Your Own Surveys
              </h2>
              <p className="text-blue-700 dark:text-blue-200 mb-4">
                Sign up to create and manage your own surveys, collect responses, and view analytics.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 