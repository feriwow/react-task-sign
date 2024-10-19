import React, { useState, useRef } from 'react';
import { validatePassword } from '../../helper/passwordValidator';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL; 

const SignUpForm = () => {
  const [form, setForm] = useState({ email: '', password: '', username: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [matchError, setMatchError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const passwordRef = useRef(null); 
  const confirmPasswordRef = useRef(null); 
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    setPasswordErrors([]);
    setMatchError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true); 
    const passwordErrors = validatePassword(form.password);

    // Check if passwords match
    if (form.password !== form.confirmPassword) {
      setMatchError('Passwords do not match.');
      confirmPasswordRef.current.focus(); 
      setIsLoading(false); 
      return; 
    }

    if (passwordErrors.length > 0) {
      setPasswordErrors(passwordErrors);
      passwordRef.current.focus();
      setIsLoading(false); 
      return; 
    }

    // If there are no errors, proceed with form submission
    try {
      const response = await axios.post(
        `${BASE_URL}/register`,
        {
          email: form.email,
          password: form.password,
          username: form.username
        }
      );

      if (response.status === 201) {
        setSuccessMessage(response.data.message); 
        setErrorMessage(''); 
        setIsLoading(false); 
        navigate('/resend-email', { state: { email: form.email } }); 
      }
    } catch (error) {
      setIsLoading(false); 
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Sign up failed. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
        />
      </div>
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          name="password"
          ref={passwordRef}
          value={form.password}
          onChange={handleChange}
          required
          className={`bg-gray-50 border text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${passwordErrors.length > 0 ? 'border-red-500' : 'border-gray-300'}`}
        />
      </div>
      <div>
        <label>Re-enter Password:</label>
        <input
          type="password"
          name="confirmPassword"
          ref={confirmPasswordRef} 
          value={form.confirmPassword} 
          onChange={handleChange}
          required
          className={`bg-gray-50 border text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 ${matchError ? 'border-red-500' : 'border-gray-300'}`}
        />
        {matchError && <p className="text-red-500 text-sm">{matchError}</p>} {/* Display match error message */}
      </div>
      {passwordErrors.length > 0 && (
        <div className="text-red-500 text-sm">
          {passwordErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )} {/* Display password error messages */}
      {errorMessage && (
        <p className="mt-4 text-red-500">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="mt-4 text-green-500">
          {successMessage}
        </p>
      )}

      <button 
        type="submit" 
        className={`bg-blue-500 text-white py-2 rounded-lg w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignUpForm;
