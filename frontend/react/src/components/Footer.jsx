import React from 'react';
import { FaEnvelope, FaCode, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  const getFooterStyle = () => {
    switch (location.pathname) {
      case '/amazon':
        return 'bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800';
      case '/flipkart':
        return 'bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700';
      default:
        return 'bg-gradient-to-r from-gray-900 via-black to-purple-900';
    }
  };

  const getAccentColor = () => {
    switch (location.pathname) {
      case '/amazon':
        return 'text-white';
      case '/flipkart':
        return 'text-white';
      default:
        return 'text-white';
    }
  };

  const hoverEffect = `transition duration-300 transform hover:scale-125`;

  return (
    <footer className={`${getFooterStyle()} text-white py-6 flex items-center`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-6xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" style={{ fontFamily: "Playwrite België Walloon, cursive" }}>
              CommerSigh
            </h2>
            <p className={`text-xl text-center ml-5 mt-5 text-white font-semibold`} style={{ fontFamily: "Inconsolata", fontWeight: "700" }}>Scrape Smarter, Sell Better !</p>
          </div>
          
          <div className="flex space-x-4">
            <a href="mailto:maazsaboowala07@gmail.com" className={`${hoverEffect} ${getAccentColor()}`}>
              <FaEnvelope className="text-3xl" />
            </a>
            <a href="https://github.com/MaazS07" target="_blank" rel="noopener noreferrer" className={`${hoverEffect} ${getAccentColor()}`}>
              <FaGithub className="text-3xl" />
            </a>
            <a href="https://www.linkedin.com/in/maaz-saboowala/" target="_blank" rel="noopener noreferrer" className={`${hoverEffect} ${getAccentColor()}`}>
              <FaLinkedin className="text-3xl" />
            </a>
            <a href="https://instagram.com/maaz_s.07" target="_blank" rel="noopener noreferrer" className={`${hoverEffect} ${getAccentColor()}`}>
              <FaInstagram className="text-3xl" />
            </a>
          </div>
          
          <div className="flex items-center text-md">
            <FaCode className={`mr-2 ${getAccentColor()} text-3xl`} />
            <span className='text-xl' style={{ fontFamily: "Inconsolata", fontWeight: "700" }}>Developed by Maaz Saboowala</span>
          </div>
        </div>
        
        <div className="mt-4 ml-9 text-center text-md font-semibold">
          &copy; {new Date().getFullYear()} CommerSigh. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
