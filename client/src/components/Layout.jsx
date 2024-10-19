import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/profile`, { withCredentials: true });
        setShowResetPassword(response.data.authProvider === null);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate('/signin');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 space-y-6">
        <div className="text-2xl font-bold mb-6">React Task</div>
        <nav className="space-y-4">
          <Link to="/" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
            Dashboard
          </Link>
          <Link to="/profile" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
            User Profile
          </Link>
          {showResetPassword && (
            <Link to="/resetPassword" className="block py-2 px-4 rounded-lg hover:bg-gray-700">
              Reset Password
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="block w-full py-2 px-4 rounded-lg hover:bg-red-600 text-left"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-grow bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;