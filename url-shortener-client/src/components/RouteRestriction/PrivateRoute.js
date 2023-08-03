import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import "./PrivateRoute.css"

const PrivateRoute = ({ isLoggedIn, isLoading }) => {


  if (isLoading) {
    return <div className='loading'><img src="https://i.gifer.com/YCZH.gif" alt="" /></div>;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
