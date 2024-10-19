import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL; 

const ResendEmail = () => {
  const location = useLocation();
  const email = location.state?.email;


  const [isCooldown, setIsCooldown] = useState(false); 
  const [cooldownTime, setCooldownTime] = useState(0); 

  const handleResend = async () => {
    try {
      await axios.post(`${BASE_URL}/resend-verification-email`, { email });
      setIsCooldown(true); 

      let timeLeft = 30;
      setCooldownTime(timeLeft);
      const countdown = setInterval(() => {
        timeLeft -= 1;
        setCooldownTime(timeLeft);

        if (timeLeft <= 0) {
          clearInterval(countdown);
          setIsCooldown(false); 
        }
      }, 1000);
    } catch (error) {
      console.error('Error resending email:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-md mx-auto p-6 shadow-md rounded-lg text-center bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">Resend Email Verification</h2>
        <button
          onClick={handleResend}
          className={`bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 ${isCooldown ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          disabled={isCooldown} 
        >
          {isCooldown ? `Resend available in ${cooldownTime}s` : 'Resend Email Verification'}
        </button>

      </div>
    </div>
  );
};

export default ResendEmail;
