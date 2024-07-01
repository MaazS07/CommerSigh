import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import timeline from "../assets/timeline.png"
const TimelineGuide = () => {
  const controls = useAnimation();
  const ref = useRef(null);

  const steps = [
    { 
      title: 'Login to E-Scrape', 
      description: 'Create an account or log in to your existing account.'
    },
    { 
      title: 'Navigate to Flipkart/Amazon', 
      description: 'Choose the e-commerce platform you want to scrape from.'
    },
    { 
      title: 'Add Product URL', 
      description: 'Copy the URL of the product page and paste it into the input field. Click the "Add" button.'
    },
    { 
      title: 'Wait for Scraping', 
      description: 'The system will scrape the product information and add it to your list.'
    },
    { 
      title: 'Download Excel File', 
      description: 'Once you have all the products you need, download the Excel file with the listed products.'
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible');
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  return (
    <div className="flex" ref={ref}>
      <div className="w-2/3 relative pr-8">
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-orange-200"></div>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="mb-16 flex items-center"
            initial="hidden"
            animate={controls}
            variants={{
              visible: { opacity: 1, y: 0 },
              hidden: { opacity: 0, y: 50 }
            }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-orange-500 border-4 border-white shadow-lg z-10 flex items-center justify-center text-xl font-bold text-white">
              {index + 1}
            </div>
            <div className="ml-8 flex-grow">
              <h3 className="text-2xl font-semibold text-orange-600 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="w-1/3 sticky top-20 h-screen flex justify-center">
      <img 
          src={timeline} 
          alt="Timeline illustration" 
          className="w-[50vw] h-[60vh] object-cover drop-shadow-xl"
        />
      </div>
    </div>
  );
};

export default TimelineGuide;