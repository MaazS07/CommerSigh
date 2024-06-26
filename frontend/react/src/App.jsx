import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrapeInfo from './components/ScrapeInfo';
import FlipkartURLList from './components/Flipkart';
import AmazonURLList from './components/AmazonURLlist';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AmazonURLList />} />
        <Route path="/info" element={<ScrapeInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
