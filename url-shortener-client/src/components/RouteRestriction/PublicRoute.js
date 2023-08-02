import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = ({ isLoggedIn, isLoading }) => {

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isLoggedIn ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
