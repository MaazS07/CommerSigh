import React, { useEffect } from 'react';
import LoginSignup from './LoginSignup';
import TimelineGuide from './TimeGuideline';
import heroImage from "../assets/main_hero.png";
import { motion, useAnimation } from 'framer-motion';

const HeroPage = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    });
  }, [controls]);

  return (
    <div className="bg-gradient-to-br pt-20 from-gray-900 via-black to-purple-700 min-h-screen text-white overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient"></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          className="flex flex-col lg:flex-row items-center justify-between gap-12"
        >
          {/* Left Column: Content and CTA */}
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <motion.h1
              className="text-6xl sm:text-7xl lg:text-9xl pl-0 lg:pl-15 font-extrabold leading-tight bg-clip-text bg-gradient-to-r text-transparent from-white via-blue-100 to-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ fontFamily: "Wittgenstein", fontWeight: "700" }}
            >
              CommerSigh
            </motion.h1>
            <LoginSignup />
            <motion.p
              className="text-3xl sm:text-4xl lg:text-5xl text-yellow-500 pl-0 lg:pl-15 pt-10 text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{ fontFamily: "cursive", fontWeight: "700" }}
            >
              Scrape Smarter, Sell Better
            </motion.p>
          </div>

          {/* Right Column: Hero Image (hidden on small screens) */}
          <motion.div
            className="hidden lg:block lg:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
          >
            <img src={heroImage} alt="CommerSigh Hero" className="w-full h-auto rounded-lg" />
          </motion.div>
        </motion.div>
      </div>

      {/* Timeline Guide */}
      <motion.section
        className="py-16 relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200"
            style={{fontFamily:"Incosolata", fontWeight:"900"}}>
            How It Works
          </h2>
          <TimelineGuide />
        </div>
      </motion.section>
    </div>
  );
};

export default HeroPage;