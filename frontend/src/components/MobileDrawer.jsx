import React from 'react';
import NavigationLinks from './NavigationLinks';

const MobileDrawer = ({ isOpen, toggleDrawer }) => {
  return (
    <div className={`md:hidden ${isOpen ? 'inline' : 'hidden'}`}>
      {isOpen && (
        <div className="flex flex-col">
          <NavigationLinks onClick={toggleDrawer} />
        </div>
      )}
    </div>
  );
};

export default MobileDrawer;
