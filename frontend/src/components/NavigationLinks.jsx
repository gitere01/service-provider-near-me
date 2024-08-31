import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../client';

const NavigationLinks = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const user = await supabase.auth.getUser();
        setIsLoggedIn(user !== null);
      } catch (error) {
        console.error('Error fetching user:', error.message);
      }
    };
    checkUserLoggedIn();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const handleUploadSkillClick = () => {
    if (!isLoggedIn) {
      navigate('/signup'); // Redirect to sign-in page if not logged in
    }
  };

  const handleSubscribeClick = () => {
    if (!isLoggedIn) {
      navigate('/signup'); // Redirect to sign-in page if not logged in
    }
  };

  return (
    <ul className="md:flex  space-x-4">
      <li><Link to="/" className="text-white">Home</Link></li>
      <li><Link to="/addskill" onClick={handleUploadSkillClick} className="text-white">Add Your Service</Link></li>
      
      {isLoggedIn ? (
        <li><button onClick={handleSignOut} className="text-white">Sign Out</button></li>
      ) : (
        <li><Link to="/signup" className="text-white">Login/Register</Link></li>
      )}
      <li><Link to="/profile" className="text-white">Profile</Link></li>
      <li><Link to="/privacy" className="text-white">Policy</Link></li>
      <li><Link to="/contact" className="text-white">Contact us</Link></li>
    </ul>
  );
};

export default NavigationLinks;
