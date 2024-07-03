import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AmazonURLList from './components/AmazonURLlist';
import FlipkartURLList from './components/FlipkartURLlist';
import HeroPage from './components/Hero/Hero';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/amazon" element={<AmazonURLList />} />
        <Route path='/flipkart' element={<FlipkartURLList/>}/>
        <Route path='/' element={<HeroPage/>}/>

      </Routes>
    </Router>
  );
}

export default App;
