import React, { useState } from 'react';
import axios from 'axios';

const AddURL = () => {
  const [url, setURL] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/urls', { url });
      alert('URL added successfully');
      setURL('');
    } catch (error) {
      console.error('Error adding URL:', error);
      alert('Failed to add URL');
    }
  };

  return (
    <div>
      <h2>Add URL</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setURL(e.target.value)}
          placeholder="Enter URL"
          required
        />
        <button type="submit">Add URL</button>
      </form>
    </div>
  );
};

export default AddURL;
