import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddURL from './components/AddUrl';
import URLList from './components/URLlist';
import ScrapeInfo from './components/ScrapeInfo';
import FlipkartURLList from './components/Flipkart';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<URLList />} />
        <Route path="/flipkart" element={<FlipkartURLList />} />
        <Route path="/info" element={<ScrapeInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
