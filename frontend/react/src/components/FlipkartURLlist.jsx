import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLinkIcon, TrashIcon,DownloadIcon } from '@heroicons/react/outline';
import { toast, Toaster } from 'react-hot-toast';
import FlipkartAddURL from './FlipkartAddURL';
import Modal from './Modal';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

const FlipkartURLList = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling modal visibility
  const [selectedUrl, setSelectedUrl] = useState(null); // State to track the selected URL

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
      toast.error('Failed to fetch URLs. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/flipkart/${id}`);
      setUrls(urls.filter((url) => url._id !== id));
      toast.success('URL deleted successfully');
    } catch (error) {
      console.error('Error deleting URL:', error);
      toast.error('Failed to delete URL. Please try again.');
    }
  };

  const openModal = (url) => {
    setSelectedUrl(url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUrl(null);
    setIsModalOpen(false);
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Flipkart Data');
    
    // Define columns headers
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 40 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Last Updated', key: 'updatedAt', width: 20 },
      { header: 'Rating', key: 'rating', width: 15 },
      { header: 'Availability', key: 'availability', width: 20 },
      { header: 'URL', key: 'url', width: 40 },
    ];

    // Add data rows
    urls.forEach(url => {
      const latestData = url.data.length ? url.data[url.data.length - 1] : {};
      worksheet.addRow({
        title: latestData.title || 'N/A',
        price: latestData.price ? `${latestData.price}` : 'Not listed currently',
        updatedAt: url.createdAt ? new Date(url.createdAt).toLocaleString() : 'N/A',
        rating: latestData.rating ? `${latestData.rating.slice(0, 3)}★` : 'No ratings yet',
        availability: latestData.availability || 'Out of Stock',
        url: url.url,
      });
    });

    // Generate Excel file
    const today = new Date();
    const fileName = `Flipkart_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}.xlsx`;
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, fileName);
    });

    toast.success('Data exported to Excel successfully!');
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen py-8">
        <Toaster position="top-right" />
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Flipkart Price Tracker</h1>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Add New URL</h2>
              <FlipkartAddURL fetchUrls={fetchUrls} />
            </div>
            <div className="border-t border-gray-200">
              <div className="flex justify-end mb-4">
              <button
  onClick={exportToExcel}
  className=" m-10  mb-0 flex items-center bg-green-900 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none transition duration-150 ease-in-out"
>
  <DownloadIcon className="h-5 w-5 text-white bolder mr-2" />
  Excel
</button>

              </div>
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
                        <div className="cursor-pointer mb-4" onClick={() => openModal(url)}>
                          <h3 className="text-xl font-semibold mb-2">{latestData.title || 'N/A'}</h3>
                          <p className="text-2xl font-bold text-green-600 mb-2">
                            {latestData.price ? `${latestData.price}` : 'Not listed currently'}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            Last updated: {url.createdAt ? new Date(url.createdAt).toLocaleString() : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            {latestData.rating ? `Rating: ${latestData.rating.slice(0, 3)}★` : 'No ratings yet'}
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
                            Visit Flipkart
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
      {/* Render Modal if isModalOpen is true */}
      {isModalOpen && <Modal isOpen={isModalOpen} onClose={closeModal} url={selectedUrl} />}
    </>
  );
};

export default FlipkartURLList;
