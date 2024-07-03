import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseClient';

const Navbar = () => {
  const [user] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
      <div className="flex items-center">
        <span className="text-lg font-bold">E-Scrape</span> {/* Your brand name */}
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <img
              className="w-8 h-8 rounded-full"
              src={user.photoURL || 'https://via.placeholder.com/50'}
              alt={user.displayName}
            />
            <span>{user.displayName}</span>
            <button
              onClick={() => auth.signOut()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
            >
              Sign out
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
