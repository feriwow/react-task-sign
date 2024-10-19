import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const UserProfile = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/profile`, {
          withCredentials: true,
        });;
        const { email, username } = response.data;
        setEmail(email);
        setUsername(username);
        setNewUsername(username); 
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setStatusMessage('Failed to load profile.');
      }
    };

    fetchUserProfile();
  }, []);

  // Handle username change submission
  const handleUsernameChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/change-name`, {
        username: newUsername,
      }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUsername(newUsername);
        setIsEditing(false); 
        setStatusMessage('Username successfully updated!');
      }
    } catch (error) {
      console.error('Error updating username:', error);
      setStatusMessage('Failed to update username.');
    }
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-semibold mb-6">User Profile</h1>
      <div className="mb-4">
        <p><strong>Email:</strong> {email}</p>

        {/* Username display */}
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <form onSubmit={handleUsernameChange} className="space-x-2 flex items-center">
              <input
                id="newUsername"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setNewUsername(username); 
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            </form>
          ) : (
            <>
              <p><strong>Username:</strong> {username}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <p className={`mt-4 ${statusMessage.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default UserProfile;
