import React, { useState } from 'react';
import axios from 'axios';
import { FiSearch, FiX } from 'react-icons/fi';

const AmazonModal = ({ isOpen, onClose, title }) => {
  const [inputValue, setInputValue] = useState('');
  const [rank, setRank] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false)

  const handleSubmit = () => {
    setLoading(true);
    const data = {
      title: title,
      keyword: inputValue
    };
    axios.post('http://localhost:3000/api/urls/ranking', data)
      .then(response => {
        const { rank, topProducts } = response.data;
        setRank(rank);
        setTopProducts(topProducts || []);
        setExpanded(true)
      })
      .catch(error => {
        console.error('Error:', error);
        setRank('We are unable to track it');
        setTopProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="flex items-center justify-center p-5 min-h-screen ">
        <div className={`bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-full ${expanded ? 'max-w-6xl' : 'md:max-w-2xl'} mx-auto rounded-2xl shadow-2xl overflow-hidden border border-yellow-500 z-50`}>
          <div className="relative p-8 flex flex-col md:flex-row z-100">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-yellow-500 hover:text-yellow-400 transition duration-300 hover:bg-red-600 hover:text-white hover:rounded-3xl"
            >
              <FiX className="w-8 h-8" />
            </button>
            <div className="flex-1 pr-0 md:pr-8">
              <h3 className="text-3xl font-bold text-yellow-500 mb-8 text-center" style={{ fontFamily: "Anton SC", fontWeight: "900" }}>
                Amazon Search Engine Rank
              </h3>
              <div className="mb-8">
                <div className="relative">
                  <h3 className='text-white mb-10 opacity-30' style={{ fontFamily: 'Roboto', fontWeight: 'normal' }}>
                    Add a keyword here to get your product rank based on it
                  </h3>
                  <h2 className='text-xl font-bold text-white mb-8 text-center' style={{ fontFamily: "Wittgenstein", fontWeight: "700" }}>
                    {title}
                  </h2>
                  <input
                    type="text"
                    className="w-full py-4 px-6 bg-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-300"
                    placeholder="Enter keyword here"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ fontFamily: 'Roboto', fontWeight: 'normal' }}
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-24 h-24 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                rank !== null && (
                  <div className="bg-gray-700 rounded-lg p-6 mb-8">
                    <h2 className="text-3xl font-bold text-yellow-500 text-center" style={{ fontFamily: "Wittgenstein", fontWeight: "700" }}>
                      {rank === 'We are unable to track it' ? rank : `Rank: ${rank}`}
                    </h2>
                  </div>
                )
              )}
              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  className="px-8 py-4 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition duration-300 transform hover:scale-105 flex items-center"
                  style={{ fontFamily: 'Roboto', fontWeight: 'bold' }}
                >
                  <FiSearch className="mr-2" />
                  Check Rank
                </button>
              </div>
            </div>
            {Array.isArray(topProducts) && topProducts.length > 0 && (
              <div className="flex-1 mt-8 md:mt-4 md:ml-8 bg-gray-700 rounded-lg p-6">
                <h2 className="text-3xl font-bold text-yellow-500 text-center mb-6" style={{ fontFamily: "Wittgenstein", fontWeight: "700" }}>
                  Top 5 Products
                </h2>
                <ul>
                  {topProducts.map((product, index) => (
                    <li key={index} className="mb-4">
                      <h3 className="text-xl font-bold text-white" style={{ fontFamily: "Wittgenstein", fontWeight: "700" }}>
                        {product.title}
                      </h3>
                      <p className="text-lg text-yellow-500" style={{ fontFamily: "Wittgenstein", fontWeight: "700" }}>
                        {product.price}
                      </p>
                      <p className="text-lg text-yellow-500" style={{ fontFamily: "Wittgenstein", fontWeight: "700" }}>
                        {product.rating}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmazonModal;
