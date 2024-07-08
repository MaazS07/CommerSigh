import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseClient';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaAmazon, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { SiFlipkart } from 'react-icons/si';
import { MdInsights } from 'react-icons/md'; // Import MdInsights icon
import { toast, Toaster } from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    if (location.pathname === '/amazon') {
      setTheme('amazon');
    } else if (location.pathname === '/flipkart') {
      setTheme('flipkart');
    } else {
      setTheme('default');
    }
  }, [location]);

  const handleLogout = () => {
    auth.signOut();
    setIsOpen(false);
    navigate('/');
  };

  const handleNavigation = (path) => {
    if (!user && (path === '/amazon' || path === '/flipkart')) {
      toast.error(`Please login to access ${path === '/amazon' ? 'Amazon' : 'Flipkart'}!`, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#333',
          color: '#fff',
        },
      });
    } else {
      navigate(path);
      setIsOpen(false);
    }
  };

  const getNavbarStyle = () => {
    switch (theme) {
      case 'amazon':
        return 'bg-gradient-to-r from-amazon-dark to-amazon-light';
      case 'flipkart':
        return 'bg-gradient-to-r from-flipkart-dark to-flipkart-light';
      default:
        return 'bg-gradient-to-r from-black to-yellow-600';
    }
  };

  return (
    <nav className= "text-white p-4 w-full fixed top-0 z-50">
      <div className={`${getNavbarStyle()}container mx-auto flex justify-between items-center w-[70%] mt-4 rounded-full shadow-lg px-6 py-3 bg-opacity-80 backdrop-blur-md`}>
        <Link
          to="/"
          className="flex items-center text-3xl  bg-clip-text text-transparent bg-gradient-to-r from-slate-400 to-white font-extrabold"
        >
          <MdInsights className="mr-2  text-white" /> {/* MdInsights icon added here */}
          CommerSigh
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-8">
          <NavItem to="/" icon={<FaHome size={24} />} text="Home" theme={theme} onClick={() => handleNavigation('/')} />
          <NavItem to="/amazon" icon={<FaAmazon size={24} />} text="Amazon" theme={theme} onClick={() => handleNavigation('/amazon')} />
          <NavItem to="/flipkart" icon={<SiFlipkart size={24} />} text="Flipkart" theme={theme} onClick={() => handleNavigation('/flipkart')} />

          {user ? (
            <div className="flex items-center space-x-4 bg-opacity-20 bg-white rounded-full p-2">
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-yellow-500"
              />
              <div className="flex flex-col">
                <span className="text-sm text-black font-semibold">{user.displayName}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/" className="text-white hover:text-yellow-300 transition duration-300">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          {user && (
            <div className="flex items-center mr-4 bg-opacity-20 bg-white rounded-full p-2">
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-yellow-500 mr-2"
              />
              <span className="text-sm font-semibold">{user.displayName}</span>
            </div>
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-black bg-opacity-90 text-white p-4 transform transition-all duration-300 ease-in-out">
          <div className="flex flex-col space-y-6">
            <NavItem to="/" icon={<FaHome size={24} />} text="Home" theme={theme} onClick={() => handleNavigation('/')} />
            <NavItem to="/amazon" icon={<FaAmazon size={24} />} text="Amazon" theme={theme} onClick={() => handleNavigation('/amazon')} />
            <NavItem to="/flipkart" icon={<SiFlipkart size={24} />} text="Flipkart" theme={theme} onClick={() => handleNavigation('/flipkart')} />

            {user && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-md text-white hover:from-red-600 hover:to-pink-600 transition duration-300"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      )}

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

const NavItem = ({ to, icon, text, theme, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const getItemStyle = () => {
    let baseStyle = "flex items-center space-x-2 px-4 py-2 rounded-full transition duration-300 ";
    if (isActive) {
      switch (theme) {
        case 'amazon':
          return baseStyle + "bg-amazon-accent text-white";
        case 'flipkart':
          return baseStyle + "bg-flipkart-accent text-white";
        default:
          return baseStyle + "bg-yellow-600 text-black";
      }
    }
    return baseStyle + "hover:bg-opacity-20 hover:bg-white";
  };

  return (
    <button onClick={onClick} className={getItemStyle()}>
      {icon}
      <span className="font-medium">{text}</span>
    </button>
  );
};

export default Navbar;
