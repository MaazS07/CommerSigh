import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ExternalLinkIcon,
  TrashIcon,
  DocumentDownloadIcon,
  StarIcon,
} from "@heroicons/react/outline";
import { toast, Toaster } from "react-hot-toast";
import AmazonModal from "./AmazonModal";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import AddURL from "./AmazonAddUrl";
import { auth} from "../firebaseClient"; // Make sure to import useAuthState
import { useAuthState } from "react-firebase-hooks/auth";

const AmazonURLList = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [user] = useAuthState(auth); 

  useEffect(() => {
    if(user)
    {
      fetchUrls();
    }
    
  }, [user]);

  const fetchUrls = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/amazon/${user.uid}`);
      setUrls(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching URLs:", error);
      setLoading(false);
      toast.error("Failed to fetch URLs. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/amazon/${id}`);
      setUrls(urls.filter((url) => url._id !== id));
      toast.success("URL deleted successfully");
    } catch (error) {
      console.error("Error deleting URL:", error);
      toast.error("Failed to delete URL. Please try again.");
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
    const worksheet = workbook.addWorksheet("Amazon Data");

    // Define columns headers
    worksheet.columns = [
      { header: "Title", key: "title", width: 40 },
      { header: "Price (INR)", key: "price", width: 15 },
      { header: "Last Updated", key: "updatedAt", width: 20 },
      { header: "Rating", key: "rating", width: 15 },
      { header: "Availability", key: "availability", width: 20 },
      { header: "URL", key: "url", width: 40 },
    ];

    // Add data rows
    urls.forEach((url) => {
      const latestData = url.data.length ? url.data[url.data.length - 1] : {};
      worksheet.addRow({
        title: latestData.title || "N/A",
        price: latestData.price
          ? parseFloat(latestData.price.slice(0, -1).replace(/,/g, ""))
          : null,
        updatedAt: url.createdAt
          ? new Date(url.createdAt).toLocaleString()
          : "N/A",
        rating: latestData.rating
          ? `${latestData.rating.slice(0, 3)}`
          : "No ratings yet",
        availability: latestData.availability || "Out of Stock",
        url: url.url,
      });
    });

    // Generate Excel file
    const today = new Date();
    const fileName = `Amazon_${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}.xlsx`;
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, fileName);
    });

    toast.success("Data exported to Excel successfully!");
  };

  return (
    <>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 min-h-screen py-8 font-sans">
        <Toaster position="top-right" />
        <div className="max-w-6xl mx-auto px-4 ">
         
          <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mt-[15vh]">
            <div className="p-8">
              <AddURL fetchUrls={fetchUrls} />
            </div>
            <div className="border-t border-gray-700">
              <div className="flex justify-end mb-4">
              <button
              onClick={exportToExcel}
              className="m-10 mb-0 flex items-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 px-6 py-3 rounded-full hover:from-yellow-500 hover:to-yellow-700 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
                  <DocumentDownloadIcon className="h-6 w-6 mr-2" />
                  Export to Excel
                </button>
              </div>
              <h2
                className="text-3xl font-semibold p-8 pb-6 text-white"
                style={{ fontFamily: "Inconsolata", fontWeight: "700" }}
              >
                Added Products
              </h2>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                   <div className="w-24 h-24 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                   
                </div>
              ) : (
                <ul className="divide-y divide-gray-700">
                  {urls.map((url) => {
                    const latestData = url.data.length
                      ? url.data[url.data.length - 1]
                      : {};
                    return (
                      <li
                        key={url._id}
                        className="p-8 hover:bg-gray-700 transition duration-300 ease-in-out"
                      >
                        <div
                          className="cursor-pointer mb-4"
                          onClick={() => openModal(url)}
                        >
                          <h3
                            className="text-2xl font-semibold mb-3 text-white "
                            style={{
                              fontFamily: "Inconsolata",
                              fontWeight: "700",
                            }}
                          >
                            {latestData.title || "N/A"}
                          </h3>
                          <p
                            className="text-3xl font-bold text-yellow-500 mb-3 "
                            style={{
                              fontFamily: "Inconsolata",
                              fontWeight: "700",
                            }}
                          >
                            {latestData.price
                              ? `₹${latestData.price}`
                              : "Not listed currently"}
                          </p>

                          <p className=" text-gray-400 mb-2 italic text-xl">
                            Last updated:{" "}
                            {url.createdAt
                              ? new Date(url.createdAt).toLocaleString()
                              : "N/A"}
                          </p>
                          <p className="text-xl text-gray-400 mb-2 italic font-md flex items-center">
                            {latestData.rating
                              ? `Rating: ${latestData.rating.slice(0, 3)}`
                              : "No ratings yet"}
                            <StarIcon className="h-4 w-4 ml-1 text-yellow-500" />
                          </p>
                          <p className="text-xl text-gray-400 italic font-xl">
                            {latestData.availability
                              ? `Availability: ${latestData.availability}`
                              : "Out of Stock"}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-6">
                          <button
                            onClick={() => handleDelete(url._id)}
                            className="flex items-center text-red-400 hover:text-red-300 focus:outline-none transition duration-300 ease-in-out"
                          >
                            <TrashIcon className="h-5 w-5 mr-2" />
                            Delete
                          </button>
                          <a
                            href={url.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-400 hover:text-blue-300 focus:outline-none transition duration-300 ease-in-out"
                          >
                            <ExternalLinkIcon className="h-5 w-5 mr-2 italic" />
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
      {isModalOpen && (
        <AmazonModal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={
            selectedUrl.data.length
              ? selectedUrl.data[selectedUrl.data.length - 1].title
              : "N/A"
          }
        />
      )}
    </>
  );
};

export default AmazonURLList;
