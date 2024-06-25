import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ScrapeInfo = () => {
  const [scrapeData, setScrapeData] = useState([]);

  const fetchScrapeData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/urls');
      setScrapeData(response.data);
    } catch (error) {
      console.error('Error fetching scrape data:', error);
    }
  };

  useEffect(() => {
    fetchScrapeData();
  }, []);

  return (
    <div>
      <h2>Scrape Information</h2>
      <ul>
        {scrapeData.map((data) => (
          <li key={data._id}>
            <p><strong>URL:</strong> {data.url}</p>
            <p><strong>Title:</strong> {data.title || 'N/A'}</p>
            <p><strong>Price:</strong> {data.price || 'N/A'}</p>
            <p><strong>Rating:</strong> {data.rating || 'N/A'}</p>
            <p><strong>Availability:</strong> {data.availability || 'N/A'}</p>
            <p><strong>Last Scraped:</strong> {new Date(data.createdAt).toLocaleString() || 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScrapeInfo;
