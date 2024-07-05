import React from 'react';
import { Routes,Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ user, path, element }) => {
  return (
    user ? (
        <Routes>
            <Route path={path} element={element} />
        </Routes>
      
    ) : (
      <Navigate to="/" replace />
    )
  );
};

export default PrivateRoute;
