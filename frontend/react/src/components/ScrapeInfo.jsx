import React from 'react';
import axios from 'axios';

const ScrapeInfo = () => {
  const handleScrape = async () => {
    try {
      await axios.post('http://localhost:3000/api/scrape');
      alert('Scraping completed and data updated');
    } catch (error) {
      console.error('Error scraping:', error);
      alert('Failed to scrape');
    }
  };

  return (
    <div>
      <h2>Scrape Information</h2>
      <button onClick={handleScrape}>Scrape Data</button>
    </div>
  );
};

export default ScrapeInfo;
