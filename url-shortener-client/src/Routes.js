import React from 'react';
import { Routes,Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';

const MainRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Dashboard/> }/>
            <Route path='/signup' element={<Signup/>} />
            <Route path='/login' element={<Login/>} />
        </Routes>
    );
};

export default MainRoutes;