import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLinkIcon, TrashIcon } from '@heroicons/react/outline';


const FlipkartURLList = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/flipkart');
      setUrls(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching URLs:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/flipkart/${id}`);
      setUrls(urls.filter((url) => url._id !== id));
    } catch (error) {
      console.error('Error deleting URL:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Flipkart URL List</h2>
      <div className="mb-6">
        <AddURL fetchUrls={fetchUrls} />
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <ul>
          {urls.map((url) => {
            const latestData = url.data.length ? url.data[url.data.length - 1] : {};
            return (
              <li key={url._id} className="border-b border-gray-200 py-4">
                <div className="cursor-pointer mb-2" onClick={() => window.open(url.url, '_blank')}>
                  <p className="text-lg font-semibold mb-1">{latestData.title || 'N/A'}</p>
                  <p className="text-black text-md font-semibold mb-1">{latestData.price !== 'N/A' ? `Price: ${latestData.price}` : 'Not listed Currently'}</p>
                  <p className="text-gray-600 mb-1">{new Date(url.createdAt).toLocaleString()}</p>
                  <p className="text-gray-600 text-sm">{latestData.rating !== 'N/A' ? `Rating: ${latestData.rating}` : 'No ratings yet'}</p>
                  <p className="text-gray-600 text-sm">{latestData.availability !== 'N/A' ? `Availability: ${latestData.availability}` : 'Out of Stock'}</p>
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={() => handleDelete(url._id)} className="flex items-center text-red-500 hover:text-red-600 focus:outline-none">
                    <TrashIcon className="h-5 w-5 mr-1" />
                    Delete
                  </button>
                  <a href={url.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 flex items-center focus:outline-none">
                    <ExternalLinkIcon className="h-5 w-5 mr-1" />
                    Visit URL
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FlipkartURLList;
