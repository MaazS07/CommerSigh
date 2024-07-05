import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiSearch } from 'react-icons/fi';
import { MdAddToPhotos } from "react-icons/md"


const AmazonAddURL = ({ fetchUrls }) => {
  const [url, setUrl] = useState('');
  const urlRegex = /^(https?:\/\/)?(www\.)?(amazon\.in)\/.*$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-2xl mb-4">
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
      <h2 className="text-2xl font-bold mb-4 text-white">URL Product</h2>
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative flex-1 mr-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter Amazon URL (e.g., https://www.amazon.in/dp/...)"
            className="w-full py-3 px-4 bg-transparent text-white border-b-2 border-gray-600 focus:outline-none focus:border-yellow-500 transition-colors duration-300"
            required
          />
          {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <MdAddToPhotos className="md:text-gray-400 sm:bg-none  sm:text-transparent" />
          </div> */}
        </div>
        <button
          type="submit"
          className="py-3 px-6 bg-yellow-500 text-gray-900 rounded-full hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
        >
          <MdAddToPhotos className="text-xl" />
        </button>
      </form>
    </div>
  );
};

export default AmazonAddURL;