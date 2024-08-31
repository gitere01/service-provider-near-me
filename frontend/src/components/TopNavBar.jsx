import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileDrawer from './MobileDrawer';
import NavigationLinks from './NavigationLinks';
import service from '../assets/images/service-logor.png';

const TopNavBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <nav className="w-full bg-black p-4 flex justify-between items-center">
      <div className="max-w-6xl mx-auto flex items-center space-x-4">
        <img src={service} alt="Logo" className="h-8" /> {/* Use your logo image here */}
        <Link to="/" className="text-white font-bold text-xl">Service Providers Near Me</Link>
      </div>
      <div className="hidden md:flex">
        <NavigationLinks />
      </div>
      <div className="md:hidden">
        <button onClick={toggleDrawer} className="text-white focus:outline-none">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isDrawerOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>
      <MobileDrawer isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
    </nav>
  );
};

export default TopNavBar;
