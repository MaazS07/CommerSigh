import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';

const AmazonAddURL = ({ fetchUrls }) => {
  const [url, setUrl] = useState('');

  // Regular expression for validating Amazon URLs
  const urlRegex = /^(https?:\/\/)?(www\.)?(amazon\.in)\/.*$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate URL format
    if (!urlRegex.test(url)) {
      showErrorToast('Please enter a valid Amazon.in URL');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/urls', { url });
      console.log(response.data);
      setUrl('');
      fetchUrls();
      showSuccessToast('URL added successfully');
    } catch (error) {
      console.error('Error adding URL:', error);
      if (error.response && error.response.status === 400 && error.response.data.message.includes('duplicate key error')) {
        showErrorToast('This URL is already in the list');
      } else {
        showErrorToast('Failed to add URL. URL might exist in the list');
      }
    }
  };

  const showSuccessToast = (message) => {
    toast.success(message, {
      icon: <FiCheckCircle className="text-green-500" />,
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      icon: <FiXCircle className="text-red-500" />,
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4 ">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <h2 className="text-xl font-bold mb-2">Add Amazon URL</h2>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Amazon URL (e.g., https://www.amazon.in/dp/...)"
          className="flex-1 py-2 px-4 mr-2 rounded-md border-gray-300 focus:outline-none focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Add URL
        </button>
      </form>
    </div>
  );
};

export default AmazonAddURL;