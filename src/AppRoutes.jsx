import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import OtpVerification from './components/Auth/OtpVerification';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CreateQuestion from './components/Questions/CreateQuestion';
import QuestionFilterPage from './components/Questions/QuestionFilterPage';
import TestRunnerPage from './components/Test/TestRunnerPage';
import TestResultPage from './components/Test/TestResultPage';
import MyCreatedQuestionsPage from './components/Questions/MyCreatedQuestionsPage';
import LandingPage from './components/Dashboard/LandingPage';

const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<LandingPage />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/verify-otp" element={<OtpVerification />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
      <Route path="create" element={<CreateQuestion />} />
      <Route path="filter" element={<QuestionFilterPage />} />
      <Route path="my-questions" element={<MyCreatedQuestionsPage />} />
      <Route index element={null} />
    </Route>
    <Route path="/test-runner" element={<TestRunnerPage />} />
    <Route path="/test-detail/:testId" element={<TestResultPage />} />
    <Route path="/" element={<Navigate to="/login" />} />
  </Routes>
);

export default AppRoutes;