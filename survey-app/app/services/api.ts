const API_BASE_URL = 'http://localhost:8000/api';

export const fetchSurvey = async (id: string, publicLink?: string) => {
  const url = publicLink 
    ? `${API_BASE_URL}/surveys/${id}/public/${publicLink}/`
    : `${API_BASE_URL}/surveys/${id}/`;
  
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
  const response = await fetch(`${API_BASE_URL}/responses/`, {
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
  const response = await fetch(`${API_BASE_URL}/surveys/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error('Failed to create survey');
  return response.json();
};

export const fetchSurveys = async () => {
  const response = await fetch(`${API_BASE_URL}/surveys/`);
  if (!response.ok) throw new Error('Failed to fetch surveys');
  return response.json();
}; 