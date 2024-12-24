'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';

type QuestionType = 'multiple_choice' | 'text' | 'rating' | 'yes_no';

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  required: boolean;
  description?: string;
}

export default function CreateSurvey() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentEdit, setCurrentEdit] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      question: '',
      required: false,
      options: type === 'multiple_choice' ? [''] : undefined,
    };
    setQuestions([...questions, newQuestion]);
    setCurrentEdit(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...updates } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    if (currentEdit === id) setCurrentEdit(null);
  };

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? {
        ...q,
        options: [...(q.options || []), '']
      } : q
    ));
  };

  const updateOption = (questionId: string, index: number, value: string) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? {
        ...q,
        options: q.options?.map((opt, i) => i === index ? value : opt)
      } : q
    ));
  };

  const removeOption = (questionId: string, index: number) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? {
        ...q,
        options: q.options?.filter((_, i) => i !== index)
      } : q
    ));
  };

  const renderQuestionEditor = (question: Question) => {
    return (
      <div key={question.id} className="bg-white p-6 rounded-lg shadow mb-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={question.question}
              onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
              placeholder="Enter your question"
              className="w-full text-lg font-medium mb-2 p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <input
              type="text"
              value={question.description || ''}
              onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
              placeholder="Add a description (optional)"
              className="w-full text-sm text-gray-800 p-2 border rounded"
            />
          </div>
          <button
            onClick={() => removeQuestion(question.id)}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-gray-800">Required question</span>
          </label>
        </div>

        {question.type === 'multiple_choice' && (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-2 text-gray-500">•</span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(question.id, index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 p-2 border rounded text-gray-800 placeholder-gray-500"
                />
                <button
                  onClick={() => removeOption(question.id, index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => addOption(question.id)}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Option
            </button>
          </div>
        )}

        {question.type === 'rating' && (
          <div className="text-sm text-gray-600">
            Rating scale from 1 to 10
          </div>
        )}
      </div>
    );
  };

  const handleSave = async () => {
    try {
      if (!title) {
        setError('Please enter a survey title');
        return;
      }

      if (questions.length === 0) {
        setError('Please add at least one question');
        return;
      }

      const response = await fetch('http://localhost:8000/api/surveys/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          questions: questions.map(q => ({
            type: q.type,
            question: q.question,
            description: q.description,
            required: q.required,
            options: q.options,
          }))
        })
      });

      if (response.ok) {
        router.push('/surveys');
      }
    } catch (error) {
      setError('Failed to save survey. Please try again.');
      console.error('Error saving survey:', error);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Survey Title"
              className="w-full text-2xl font-bold mb-4 p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Survey Description"
              className="w-full text-gray-800 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {questions.map(question => renderQuestionEditor(question))}

          {/* Add Question Button */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Question</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => addQuestion('multiple_choice')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left"
              >
                <div className="font-medium text-gray-900">Multiple Choice</div>
                <div className="text-sm text-gray-700">Choose from options</div>
              </button>
              <button
                onClick={() => addQuestion('text')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left"
              >
                <div className="font-medium text-gray-900">Text</div>
                <div className="text-sm text-gray-700">Free text response</div>
              </button>
              <button
                onClick={() => addQuestion('rating')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left"
              >
                <div className="font-medium text-gray-900">Rating</div>
                <div className="text-sm text-gray-700">1-10 rating scale</div>
              </button>
              <button
                onClick={() => addQuestion('yes_no')}
                className="p-4 border rounded-lg hover:bg-gray-50 text-left"
              >
                <div className="font-medium text-gray-900">Yes/No</div>
                <div className="text-sm text-gray-700">Binary choice</div>
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => router.push('/surveys')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Survey
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 