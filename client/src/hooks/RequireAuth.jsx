import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie'; 

const RequireAuth = ({ children }) => {
  const token = Cookies.get('token'); 

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default RequireAuth;
