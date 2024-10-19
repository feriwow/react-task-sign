import React from 'react';
import { useLocation } from 'react-router-dom';
import SignUpForm from '../components/auth/SignUpForm';
import SignInForm from '../components/auth/SignInForm';
import GoogleLoginButton from '../components/button/GoogleButton';
import FacebookLoginButton from '../components/button/FacebookButton';

const AuthPage = () => {
  const location = useLocation();
  const isSignUp = location.pathname === '/signup'; 

  const handleSubmit = (formData) => {
    if (isSignUp) {
      console.log('Sign Up form submitted:', formData);
    } else {
      console.log('Sign In form submitted:', formData);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl py-4">
          {isSignUp ? 'Create an account' : 'Sign In to your account'}
        </h2>
        {isSignUp ? (
          <SignUpForm onSubmit={handleSubmit} />
        ) : (
          <>
          <SignInForm />
          <br />
          <GoogleLoginButton />
          <br />
          <FacebookLoginButton/>
          </>
        )}
        <p className="mt-4 text-center">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <a href="/signin" className="text-blue-500 hover:underline">
              </a>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign Up
              </a>
              <></>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
