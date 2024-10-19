import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import UserProfile from './pages/UserProfile';
import RequireAuth from './hooks/RequireAuth';
import ResetPassword from './pages/ResetPassword';
import ResendEmail from './pages/ResendEmail';
import { GoogleOAuthProvider } from '@react-oauth/google'
const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const App = () => {
  return (
    <GoogleOAuthProvider clientId={VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/resend-email" element={<ResendEmail />} />
          <Route path="/" element={
            <RequireAuth>
              <Layout>
                <Dashboard />
              </Layout>
            </RequireAuth>
          } />
          <Route path="/profile" element={
            <RequireAuth>
              <Layout>
                <UserProfile />
              </Layout>
            </RequireAuth>
          } />
          <Route path="/resetPassword" element={
            <RequireAuth>
              <Layout>
                <ResetPassword />
              </Layout>
            </RequireAuth>
          } />
        </Routes>
      </Router>
    </GoogleOAuthProvider >
  );
};

export default App;
