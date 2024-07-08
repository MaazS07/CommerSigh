import React from 'react';
import { FaEnvelope, FaPhone, FaCode, FaGithub, FaLinkedin } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isFlipkart = location.pathname === '/flipkart';

  const getFooterStyle = () => {
    switch (location.pathname) {
      case '/amazon':
        return 'bg-gradient-to-r from-yellow-700 via-yellow-800 to-yellow-900 text-white shadow-lg';
      case '/flipkart':
        return 'bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-lg';
      default:
        return 'bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white shadow-lg';
    }
  };

  const getHoverStyle = (baseClass) =>
    isFlipkart ? `${baseClass} hover:text-blue-300` : `${baseClass} hover:text-yellow-300`;

  return (
    <footer className={`${getFooterStyle()} py-8 md:py-12 px-4 md:px-8`}>
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="text-center md:text-left space-y-6">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-yellow-400 animate-gradient-slow" style={{ fontFamily: "Inconsolata", fontWeight: "700" }}>
              Scrappy
            </h2>
            <p className={`mb-4 text-lg ${isFlipkart ? 'text-blue-100' : 'text-yellow-100'}`}>Your one-stop solution for e-commerce scraping</p>
            <div className="flex justify-center md:justify-start space-x-8">
              <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className={`text-3xl transition duration-300 ${getHoverStyle('')}`}>
                <FaGithub />
              </a>
              <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className={`text-3xl transition duration-300 ${getHoverStyle('')}`}>
                <FaLinkedin />
              </a>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-yellow-400 animate-gradient-slow" style={{ fontFamily: "Inconsolata", fontWeight: "700" }}>
              Contact Us
            </h3>
            <div className="space-y-4">
              <a href="mailto:maazsaboowala07@gmail.com" className={`flex items-center group ${getHoverStyle('group')}`}>
                <FaEnvelope className={`mr-2 md:mr-4 text-xl md:text-2xl transition duration-300 ${getHoverStyle('group-hover')}`} />
                <span className={`text-base md:text-lg transition duration-300 ${getHoverStyle('group-hover')}`}>maazsaboowala07@gmail.com</span>
              </a>
              <a href="tel:7304032169" className={`flex items-center group ${getHoverStyle('group')}`}>
                <FaPhone className={`mr-2 md:mr-4 text-xl md:text-2xl transition duration-300 ${getHoverStyle('group-hover')}`} />
                <span className={`text-base md:text-lg transition duration-300 ${getHoverStyle('group-hover')}`}>7304032169</span>
              </a>
              <div className="flex items-center">
                <FaCode className={`mr-2 md:mr-4 text-xl md:text-2xl ${isFlipkart ? 'text-blue-300' : 'text-yellow-300'}`} />
                <span className="text-base md:text-lg">Developed by Maaz Saboowala</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-sm opacity-75">
          &copy; {new Date().getFullYear()} Scrappy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
