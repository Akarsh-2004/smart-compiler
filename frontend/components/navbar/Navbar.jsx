import React, { useState } from 'react';
import './Navbar.css'; // Import the CSS for the Navbar

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu open/close

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    // Main navigation bar container
    <nav className="navbar">
      {/* Brand/Logo section */}
      <div className="navbar-brand">
        <a href="/" className="navbar-logo">
          {/* You can replace this with an SVG logo or an image */}
          <span className="logo-icon">💻</span> SecureDev
        </a>
      </div>

      {/* Hamburger menu icon for mobile */}
      <div className="menu-toggle" onClick={toggleMenu} aria-expanded={isOpen ? "true" : "false"} aria-controls="navbar-links">
        <div className={`hamburger ${isOpen ? 'open' : ''}`}></div>
        <div className={`hamburger ${isOpen ? 'open' : ''}`}></div>
        <div className={`hamburger ${isOpen ? 'open' : ''}`}></div>
      </div>

      {/* Navigation links - Desktop and Mobile (conditionally rendered/styled) */}
      <div className={`navbar-links ${isOpen ? 'open' : ''}`} id="navbar-links">
        <ul>
          <li><a href="#home" onClick={() => setIsOpen(false)}>Home</a></li>
          <li><a href="#editor" onClick={() => setIsOpen(false)}>Editor</a></li>
          <li><a href="#about" onClick={() => setIsOpen(false)}>About</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
