import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import timeline from "./assets/timeline.png"

const TimelineGuide = () => {
  const controls = useAnimation();
  const ref = useRef(null);

  const steps = [
    { 
      title: 'Login to CommerSigh', 
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
    { 
      title: 'Click to View Product Rank', 
      description: 'Enter a keyword and view the rank of your product based on the input keyword.'
    },
    { 
      title: 'Top 5 Products on Search', 
      description: 'On search, view the top 5 products listed in the modal on your right.'
    }
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
    <div className="flex flex-col lg:flex-row p-4 rounded-md  from-gray-900 via-black to-purple-700" ref={ref}>
      <div className="w-full lg:w-2/3 relative pr-8">
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-yellow-400/30"></div>
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="mb-16 flex items-center"
            initial="hidden"
            animate={controls}
            variants={{
              visible: { opacity: 1, x: 0 },
              hidden: { opacity: 0, x: -50 }
            }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-yellow-400 border-4 border-gray-800 shadow-lg z-10 flex items-center justify-center text-xl font-bold text-gray-900 italic">
              {index + 1}
            </div>
            <div className="ml-8 flex-grow">
              <h3 className="text-2xl font-semibold text-yellow-400 mb-2 italic">{step.title}</h3>
              <p className="text-gray-300 italic">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="hidden lg:block w-1/3 lg:sticky lg:top-20 h-[60vh] flex justify-center items-center mt-8 lg:mt-20">
        <motion.img 
          src={timeline} 
          alt="Timeline illustration" 
          className="w-full max-w-md h-[60vh] object-cover rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />
      </div>
    </div>
  );
};

export default TimelineGuide;