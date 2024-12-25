const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
console.log('API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Final API_URL:', API_URL);

export const api = {
  surveys: {
    list: () => `${API_URL}/api/surveys/`,
    create: () => `${API_URL}/api/surveys/`,
    get: (id: string) => `${API_URL}/api/surveys/${id}/`,
    update: (id: string) => `${API_URL}/api/surveys/${id}/`,
    delete: (id: string) => `${API_URL}/api/surveys/${id}/`,
    results: (id: string) => `${API_URL}/api/surveys/${id}/results/`,
  },
  responses: {
    create: (surveyId: string) => `${API_URL}/api/surveys/${surveyId}/responses/`,
  },
  auth: {
    login: () => `${API_URL}/api/auth/login/`,
    register: () => `${API_URL}/api/auth/register/`,
  }
};

export const fetchSurvey = async (id: string, publicLink?: string) => {
  const url = publicLink 
    ? `${API_URL}/api/surveys/${id}/public/${publicLink}/`
    : `${API_URL}/api/surveys/${id}/`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch survey');
  return response.json();
};

export const submitSurveyResponse = async (data: {
  survey: string;
  respondent_email?: string;
  respondent_name?: string;
  department?: string;
  answers: Array<{
    question: string;
    answer_text: string;
  }>;
}) => {
  const response = await fetch(`${API_URL}/api/responses/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Failed to submit response');
  return response.json();
};

export const createSurvey = async (data: {
  title: string;
  description: string;
  questions: Array<{
    type: string;
    question: string;
    description?: string;
    required: boolean;
    options?: string[];
  }>;
}) => {
  // Transform the data to match backend expectations
  const transformedData = {
    ...data,
    questions: data.questions.map(question => ({
      ...question,
      options: question.options?.map((text, index) => ({
        text,
        order: index
      }))
    }))
  };

  console.log('Sending survey data:', transformedData);

  const response = await fetch(`${API_URL}/api/surveys/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transformedData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Survey creation error:', errorData);
    throw new Error('Failed to create survey');
  }
  return response.json();
};

export const fetchSurveys = async () => {
  const response = await fetch(`${API_URL}/api/surveys/`);
  if (!response.ok) throw new Error('Failed to fetch surveys');
  return response.json();
};

export const fetchSurveyResults = async (id: string) => {
  const response = await fetch(`${API_URL}/api/surveys/${id}/results/`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch survey results');
  }
  return response.json();
}; 