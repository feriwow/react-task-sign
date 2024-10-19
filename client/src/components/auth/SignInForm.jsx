import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SignInForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 
    
    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true } 
      );
      

      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setErrorMessage(''); 
        navigate('/');
      }

    } catch (error) {
      
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Login failed. Please try again.');
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div>
          <label className=''>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@email.com"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white py-2 rounded-lg w-full">
          Sign In
        </button>
      </form>

      {/* Error or Success Message */}
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
    </>
  );
};

export default SignInForm;
