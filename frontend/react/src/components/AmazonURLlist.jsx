import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLinkIcon, TrashIcon } from '@heroicons/react/outline';
import { toast, Toaster } from 'react-hot-toast';
import AddURL from './AmazonAddUrl';

const AmazonURLList = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/urls');
      setUrls(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching URLs:', error);
      setLoading(false);
      toast.error('Failed to fetch URLs. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/urls/${id}`);
      setUrls(urls.filter((url) => url._id !== id));
      toast.success('URL deleted successfully');
    } catch (error) {
      console.error('Error deleting URL:', error);
      toast.error('Failed to delete URL. Please try again.');
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen py-8">
        <Toaster position="top-right" />
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Amazon Price Tracker</h1>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Add New URL</h2>
              <AddURL fetchUrls={fetchUrls} />
            </div>
            <div className="border-t border-gray-200">
              <h2 className="text-2xl font-semibold p-6 pb-3">Tracked URLs</h2>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {urls.map((url) => {
                    const latestData = url.data.length ? url.data[url.data.length - 1] : {};
                    return (
                      <li key={url._id} className="p-6 hover:bg-gray-50 transition duration-150 ease-in-out">
                        <div className="cursor-pointer mb-4" onClick={() => window.open(url.url, '_blank')}>
                          <h3 className="text-xl font-semibold mb-2">{latestData.title || 'N/A'}</h3>
                          <p className="text-2xl font-bold text-green-600 mb-2">
                            {latestData.price ? `₹${latestData.price}` : 'Not listed currently'}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            Last updated: {latestData.createdAt ? new Date(latestData.createdAt).toLocaleString() : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            {latestData.rating ? `Rating: ${latestData.rating}★` : 'No ratings yet'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {latestData.availability ? `Availability: ${latestData.availability}` : 'Out of Stock'}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <button
                            onClick={() => handleDelete(url._id)}
                            className="flex items-center text-red-500 hover:text-red-600 focus:outline-none transition duration-150 ease-in-out"
                          >
                            <TrashIcon className="h-5 w-5 mr-1" />
                            Delete
                          </button>
                          <a
                            href={url.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-500 hover:text-blue-600 focus:outline-none transition duration-150 ease-in-out"
                          >
                            <ExternalLinkIcon className="h-5 w-5 mr-1" />
                            Visit Amazon
                          </a>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AmazonURLList;
