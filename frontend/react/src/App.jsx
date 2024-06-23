import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddURL from './components/AddUrl';
import URLList from './components/URLlist';
import ScrapeInfo from './components/ScrapeInfo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<URLList />} />
        <Route path="/add" element={<AddURL />} />
        <Route path="/info" element={<ScrapeInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
