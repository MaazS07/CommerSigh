import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './components/firebaseClient';

import AmazonURLList from './components/AmazonURLlist';
import FlipkartURLList from './components/FlipkartURLlist';
import HeroPage from './components/Hero/Hero';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoutes'; // Ensure correct import path for PrivateRoute

function App() {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public route */}
        <Route path="/" element={<HeroPage />} />
        
        {/* Private routes */}
      
      </Routes>
      <PrivateRoute path="/amazon" element={<AmazonURLList />} user={user} />
      <PrivateRoute path="/flipkart" element={<FlipkartURLList />} user={user} />
      <Footer />
    </Router>
  );
}

export default App;
