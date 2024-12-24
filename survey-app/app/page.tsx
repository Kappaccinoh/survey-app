import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

// Example page components (you would implement these separately)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SurveyListPage from './pages/SurveyListPage';
import SurveyCreatePage from './pages/SurveyCreatePage';
import SurveyDetailPage from './pages/SurveyDetailPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route path="/surveys" element={<SurveyListPage />} />
        <Route path="/surveys/new" element={<SurveyCreatePage />} />
        <Route path="/surveys/:id" element={<SurveyDetailPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Catch-all for unmatched routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
