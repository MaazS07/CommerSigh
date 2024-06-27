import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AmazonURLList from './components/AmazonURLlist';
import FlipkartURLList from './components/FlipkartURLlist';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AmazonURLList />} />
        <Route path='/flipkart' element={<FlipkartURLList/>}/>
      </Routes>
    </Router>
  );
}

export default App;
