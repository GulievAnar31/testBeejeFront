import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from '../login';
import Dashboard from '../dashboard';

const ProtectedRoute = ({ element: Element, ...props }) => {
  const isAuthenticated = localStorage.getItem('token');
  
  return isAuthenticated ? (
    <Element {...props} />
  ) : (
    <Navigate to="/" />
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
        <Route path="/" element={<Login />} /> 
      </Routes>
    </BrowserRouter>
  );
};

export default App;
