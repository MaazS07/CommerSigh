import React, { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup } from '../../firebaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleAuth = async () => {
    try {
      await auth.signOut();
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Authenticated user:', result.user.email);
      navigate('/');
    } catch (error) {
      console.error('Google authentication error:', error);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(prev => !prev);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <motion.div 
    className="w-full max-w-md mx-auto"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {!user ? (
      <>
        <motion.button
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center py-3 px-4 rounded-full text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FcGoogle className="mr-2 text-xl" />
          {isLogin ? 'Log in' : 'Sign up'} with Google
        </motion.button>
        <p className="mt-6 text-center text-sm text-gray-300">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            className="font-medium text-blue-400 hover:text-blue-300 transition duration-300 ease-in-out"
            onClick={handleToggleMode}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </>
    ) : (
      <div className="text-center">
        <p className="mb-4 text-2xl sm:text-3xl text-yellow-500 font-sans font-extrabold">Welcome, {user.email}</p>
        <motion.button
          onClick={handleLogout}
          className="w-full flex justify-center py-3 px-4 rounded-full text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </div>
    )}
  </motion.div>
);
};

export default LoginSignup;