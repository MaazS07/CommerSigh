import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { MdAddToPhotos } from "react-icons/md";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseClient'; // Ensure this points to your Firebase configuration
import { SiFlipkart } from 'react-icons/si';

const FlipkartAddURL = ({ fetchUrls }) => {
  const [url, setUrl] = useState('');
  const [user] = useAuthState(auth);
  const urlRegex = /^(https?:\/\/)?(www\.)?(flipkart\.com)\/.*$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!urlRegex.test(url)) {
      showErrorToast('Please enter a valid Flipkart URL');
      return;
    }

    if (!user) {
      showErrorToast('You must be logged in to add a URL');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/flipkart', { url, userId: user.uid });
      console.log(response.data);
      setUrl('');
      fetchUrls(user.uid);
      showSuccessToast('URL added successfully');
    } catch (error) {
      console.error('Error adding URL:', error);
      if (error.response) {
        if (error.response.status === 401 && error.response.data.message === 'User ID is required') {
          showErrorToast('User ID is required. Please log in again.');
        } else if (error.response.status === 400 && error.response.data.message === 'URL already exists') {
          showErrorToast('This URL already exists.');
        } else if (error.response.status === 400) {
          showErrorToast('Bad Request. Please check your input.');
          console.error('Bad Request. Server response:', error.response.data);
        } else {
          showErrorToast('Failed to add URL. Please try again later.');
          console.error('Server Error:', error.response.data);
        }
      } else if (error.request) {
        showErrorToast('Network Error. Please check your connection.');
        console.error('Network Error:', error.request);
      } else {
        showErrorToast('Unknown Error. Please try again later.');
        console.error('Unknown Error:', error.message);
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
    <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 rounded-lg shadow-2xl mb-4">
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
<div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-4 p-2">
    <SiFlipkart className="text-4xl sm:text-5xl md:text-6xl text-white" />
    <div className="flex items-center">
      <span className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mx-2">|</span>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "Inconsolata, monospace" }}>
        Flipkart
      </h1>
    </div>
  </div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative flex-1 mr-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter Flipkart URL (e.g., https://www.flipkart.com/product/...)"
            className="w-full py-3 px-4 bg-white bg-opacity-20 text-white placeholder-gray-200 border-b-2 border-white focus:outline-none focus:border-yellow-400 rounded-lg transition-colors duration-300"
            required
          />
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

export default FlipkartAddURL;
