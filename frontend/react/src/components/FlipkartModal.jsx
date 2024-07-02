import React, { useState } from 'react';
import axios from 'axios';
import { FiSearch, FiX } from 'react-icons/fi';

const FlipkartModal = ({ isOpen, onClose, title }) => {
  const [inputValue, setInputValue] = useState('');
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    const data = {
      title: title,
      keyword: inputValue
    };
    axios.post('http://localhost:3000/api/flipkart/ranking', data)
      .then(response => {
        const receivedRank = response.data.rank;
        setRank(receivedRank);
      })
      .catch(error => {
        console.error('Error:', error);
        setRank('We are unable to track it');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="flex items-center justify-center p-5 min-h-screen">
        <div className="bg-white w-full max-w-2xl mx-auto rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="relative px-8 py-10">
          <button
              onClick={onClose}
              className="absolute top-4 right-4 text-yellow-500 hover:text-yellow-400 transition duration-300  hover:bg-red-600 hover:text-white hover:rounded-3xl "
            >
              <FiX className="w-8 h-8 " />
            </button>
            <h3 className="text-3xl font-bold text-blue-800 mb-8 text-center" style={{ fontFamily: "Anton SC", fontWeight: "900" }}>Flipkart Search Engine Rank</h3>
            <div className="mb-8">
              <div className="relative">
                <h3 className='text-gray-600 mb-10 opacity-70' style={{ fontFamily: 'Roboto', fontWeight: 'normal' }}>Add a keyword here to get your product rank based on it</h3>
                <h2 className='text-xl font-bold text-blue-800 mb-8 text-center' style={{ fontFamily: "Wittgenstein", fontWeight: "700" }}>{title}</h2>
                <input
                  type="text"
                  className="w-full py-4 px-6 bg-white text-blue-800 placeholder-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-100 transition duration-300"
                  placeholder="Enter keyword here"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  style={{ fontFamily: 'Roboto', fontWeight: 'normal' }}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="w-24 h-24 border-4 border-blue-800 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : rank !== null && (
              <div className="bg-yellow-50 rounded-lg p-6 mb-8">
                <h2 className="text-3xl font-bold text-blue-800 text-center" style={{ fontFamily: "Wittgenstein", fontWeight: "700" }}>
                  {rank === 'We are unable to track it' ? rank : `Rank: ${rank}`}
                </h2>
              </div>
            )}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="px-8 py-4 bg-yellow-500 text-blue-800 rounded-lg hover:bg-yellow-300 transition duration-300 transform hover:scale-105 flex items-center"
                style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}
              >
                <FiSearch className="mr-2" />
                Check Rank
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipkartModal;
