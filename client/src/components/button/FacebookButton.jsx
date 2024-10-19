import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID

const FacebookLoginButton = () => {
  const navigate = useNavigate();

  const responseFacebook = async (response) => {
    if (response.accessToken) {
      try {
        const apiResponse = await axios.post(
          'http://localhost:3000/fb-login',  
          { accessToken: response.accessToken }, 
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true, 
          }
        );
      
        if (apiResponse.status === 200) {
          navigate('/');
        } else {
          console.error('Facebook login failed');
        }
      } catch (error) {
        console.error('Error during Facebook login:', error);
      }
      
    } else {
      console.error('Facebook login cancelled');
    }
  };

  return (
    <FacebookLogin
      appId={FACEBOOK_APP_ID}
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebook}
      icon="fa-facebook"
    />
  );
};

export default FacebookLoginButton;