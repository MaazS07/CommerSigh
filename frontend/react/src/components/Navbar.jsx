import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaAmazon, FaBars, FaTimes } from 'react-icons/fa';
import { SiFlipkart } from 'react-icons/si';
import { toast, Toaster } from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    auth.signOut();
    setIsOpen(false);
    navigate('/');
  };

  const handleAmazonClick = () => {
    if (!user) {
      toast.error('Please login to access Amazon!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#333',
          color: '#fff',
        },
      });
    } else {
      navigate('/amazon');
      setIsOpen(false);
    }
  };

  const handleFlipkartClick = () => {
    if (!user) {
      toast.error('Please login to access Flipkart!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#333',
          color: '#fff',
        },
      });
    } else {
      navigate('/flipkart');
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-900 text-white p-4 w-full  z-50 h-20 border-b-rose-50 border-2">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-yellow-600"
        >
          E-Scrape
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
          <NavItem to="/" icon={<FaHome />} text="Home" />

          <NavItem to="/amazon" icon={<FaAmazon />} text="Amazon" onClick={handleAmazonClick} />
          <NavItem to="/flipkart" icon={<SiFlipkart />} text="Flipkart" onClick={handleFlipkartClick} />

          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white">{user.displayName}</span>
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-yellow-500"
              />
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-md text-white hover:from-red-600 hover:to-pink-600 transition duration-300"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link to="/" className="text-white">
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-64 bg-black bg-opacity-90 text-white p-4 transform transition-transform duration-300 ease-in-out">
          <div className="flex flex-col space-y-6">
            <NavItem to="/" icon={<FaHome />} text="Home" onClick={() => setIsOpen(false)} />
            <NavItem to="/amazon" icon={<FaAmazon />} text="Amazon" onClick={handleAmazonClick} />
            <NavItem to="/flipkart" icon={<SiFlipkart />} text="Flipkart" onClick={handleFlipkartClick} />

            {user && (
              <div className="flex flex-col items-center space-y-4">
                <span className="text-white">{user.displayName}</span>
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-purple-500"
                />
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-md text-white hover:from-red-600 hover:to-pink-600 transition duration-300"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </nav>
  );
};

const NavItem = ({ to, icon, text, onClick }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={onClick ? onClick : () => navigate(to)}
      className="flex items-center space-x-2 hover:text-purple-400 transition duration-300"
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default Navbar;
