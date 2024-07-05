import React from 'react';
import { FaEnvelope, FaPhone, FaCode } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <FaEnvelope className="mr-2" />
              <span>maazsaboowala07@gmail.com</span>
            </div>
            <div className="flex items-center mb-2">
              <FaPhone className="mr-2" />
              <span>7304032169</span>
            </div>
            <div className="flex items-center">
              <FaCode className="mr-2" />
              <span>Developed by Maaz Saboowala</span>
            </div>
          </div>
          <div className="text-4xl font-bold text-gray-100">
            Scrappy
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;