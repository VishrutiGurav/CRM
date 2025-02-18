/* Layout.jsx */
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="layout-container">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={`mainContent ${isOpen ? 'shifted' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;



