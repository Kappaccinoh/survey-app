'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if user previously set dark mode
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="font-bold text-xl text-blue-600 dark:text-blue-400">
                SurveyApp
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {darkMode ? '🌞' : '🌙'}
              </button>
              <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Create and Share</span>
            <span className="block text-blue-600 dark:text-blue-400">Surveys with Ease</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create professional surveys, gather insights, and make data-driven decisions. 
            Start collecting responses in minutes.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/signup"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/surveys"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10"
              >
                View Surveys
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 dark:bg-blue-500 text-white mx-auto">
                  <Image src="/globe.svg" alt="Global" width={24} height={24} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Global Reach</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Collect responses from participants worldwide with our multilingual support.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="relative p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 dark:bg-blue-500 text-white mx-auto">
                  <Image src="/window.svg" alt="Analytics" width={24} height={24} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Real-time Analytics</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Get instant insights with our powerful analytics dashboard.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="relative p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 dark:bg-blue-500 text-white mx-auto">
                  <Image src="/file.svg" alt="Templates" width={24} height={24} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Custom Templates</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Choose from various templates or create your own custom surveys.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}