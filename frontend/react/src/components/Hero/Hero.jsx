import React from 'react';
import LoginSignup from './LoginSignup';
import TimelineGuide from './TimeGuideline';
import heroimage from "../assets/main_hero.png";
import { motion } from 'framer-motion';

const HeroPage = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background SVG */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#a18cd1', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#fbc2eb', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <circle cx="30%" cy="30%" r="400" fill="url(#gradient1)" />
      </svg>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Login/Signup Component */}
          <motion.div 
            className="w-full lg:w-1/2 mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <LoginSignup />
          </motion.div>
          
          {/* Image */}
          <motion.div 
            className="w-full lg:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src={heroimage} 
              alt="E-Scrape Hero" 
              className="w-full max-w-md h-[50vh] rounded-lg object-cover filter drop-shadow-xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Timeline Guide */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          <TimelineGuide />
        </div>
      </div>
    </div>
  );
};

export default HeroPage;
