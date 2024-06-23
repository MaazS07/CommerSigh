import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URLList = () => {
  const [urls, setURLs] = useState([]);

  useEffect(() => {
    fetchURLs();
  }, []);

  const fetchURLs = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/urls');
      setURLs(response.data);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/urls/${id}`);
      setURLs(urls.filter(url => url._id !== id));
      alert('URL deleted successfully');
    } catch (error) {
      console.error('Error deleting URL:', error);
      alert('Failed to delete URL');
    }
  };

  return (
    <div>
      <h2>URL List</h2>
      <ul>
        {urls.map(url => (
          <li key={url._id}>
            <a href={url.url} target="_blank" rel="noopener noreferrer">{url.url}</a>
            <button onClick={() => handleDelete(url._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default URLList;
