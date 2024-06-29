import React, { useState } from 'react';
import axios from 'axios';

const AmazonModal = ({ isOpen, onClose, title }) => {
  const [inputValue, setInputValue] = useState('');
  const [rank, setRank] = useState(null); // State to hold the rank received from backend

  const handleSubmit = () => {
    // Handle form submission or any action needed
    console.log('Submitted:', inputValue); // Log the input value
    console.log('Title:', title); // Log the title received from props
    alert(`Submitted: ${inputValue}\nTitle: ${title}`); // Show alert with input value and title
    
    // Prepare data to send to backend
    const data = {
      title: title, // Pass the title received as prop
      keyword: inputValue // Pass the input value as keyword
    };

    // Send POST request using axios
    axios.post('http://localhost:3000/api/urls/ranking', data)
      .then(response => {
        const receivedRank = response.data.rank;
        console.log('Rank:', receivedRank); // Log the rank received from backend
        setRank(receivedRank); // Set the rank in state to display it
        alert(`Rank: ${receivedRank}`); // Show alert with the rank received from backend
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error fetching rank from server.'); // Show alert if there's an error
      });

    onClose(); // Close modal after handling action
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Add New URL</h3>
                <div className="mt-2">
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter keyword here"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          {rank !== null && (
            <div className="bg-white px-4 py-5 sm:px-6">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-4">Rank: {rank}</h2>
            </div>
          )}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save
            </button>
            <button
              onClick={onClose}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmazonModal;
