import React from 'react';
import LoginSignup from './LoginSignup';
import TimelineGuide from './TimeGuideline';
import heroimage from "../assets/main_hero.png";
import { motion } from 'framer-motion';

const HeroPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDU2IDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZDcwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-5"></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
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
          
          {/* Image and Tagline */}
          <motion.div 
            className="w-full lg:w-1/2 flex flex-col items-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative w-full max-w-md h-[50vh] mb-8 overflow-hidden rounded-lg">
              <img 
                src={heroimage} 
                alt="E-Scrape Hero" 
                className="w-full h-full object-cover filter brightness-75 contrast-125 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-yellow-600/30 mix-blend-overlay"></div>
            </div>
            <motion.h3 
              className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Revolutionize Your E-Commerce Experience
            </motion.h3>
            <motion.p
              className="text-lg text-center text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Scrape, analyze, and optimize your online shopping journey
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Timeline Guide */}
      <hr className='' />
      <div className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">How It Works</h2>
          <TimelineGuide />
        </div>
      </div>
    </div>
  );
};

export default HeroPage;