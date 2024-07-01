import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-auto relative overflow-hidden space-y-4 transition duration-300 border border-transparent hover:border-black shadow-md hover:shadow-lg">
      <motion.h2 
        className="text-3xl font-bold mb-6 text-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLogin ? 'Log in to E-Scrape' : 'Sign up for E-Scrape'}
      </motion.h2>
      <form className="space-y-4">
        {!isLogin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-0 transition duration-300"
              required
            />
            <label htmlFor="username" className="absolute left-0 top-0 mt-3 ml-3 text-gray-500 transition duration-300 transform origin-left -translate-y-7 scale-75">
              Username
            </label>
          </motion.div>
        )}
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-0 transition duration-300"
            required
          />
          <label htmlFor="email" className="absolute left-0 top-0 mt-3 ml-3 text-gray-500 transition duration-300 transform origin-left -translate-y-7 scale-75">
            Email address
          </label>
        </div>
        <div className="relative">
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full px-3 py-2 bg-transparent border-b border-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-0 transition duration-300"
            required
          />
          <label htmlFor="password" className="absolute left-0 top-0 mt-3 ml-3 text-gray-500 transition duration-300 transform origin-left -translate-y-7 scale-75">
            Password
          </label>
        </div>
        <motion.button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLogin ? 'Log in' : 'Sign up'}
        </motion.button>
      </form>
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {/* Add social login buttons here */}
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          className="font-medium text-indigo-600 hover:text-indigo-500"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>
    </div>
  );
};

export default LoginSignup;
