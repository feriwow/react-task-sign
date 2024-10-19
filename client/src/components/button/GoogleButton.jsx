import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const BASE_URL = import.meta.env.VITE_BASE_URL;

const GoogleLoginButton = () => {
    const navigate = useNavigate();

    const onSuccess = async (credentialResponse) => {
        try {

            const response = await axios.post(`${BASE_URL}/google-login`, {
                token: credentialResponse.credential,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true 
            });

            if (response.status === 200) {
                navigate("/"); 
            } else {
                console.error('Login failed:', response.data.message); 
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <GoogleLogin
            onSuccess={onSuccess}
            onError={() => {
                console.log('Login Failed');
            }}
        />
    );
};

export default GoogleLoginButton;
