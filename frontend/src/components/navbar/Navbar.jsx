import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // <-- Add useLocation hook
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // <-- Get current URL path

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    // Standard section links. We still use 'href' for scrolling.
    { text: 'Features', href: '#features' }, 
    { text: 'Pricing', href: '#pricing' }, 
    { text: 'Reviews', href: '#testimonials' }, 
    
    // Auth links MUST use 'to'
    { text: 'Get Started', to: '/register', isButton: true }, 
    { text: 'Login', to: '/login' } 
  ];

  // Helper function to determine the correct element to render
  const renderMenuItem = (item) => {
    // Determine if it's an internal section link (starts with #)
    const isInternalAnchor = item.href && item.href.startsWith('#');

    // If it's the Home page AND an internal anchor, use an <a> tag for natural scrolling.
    if (isInternalAnchor && location.pathname === '/') {
      return (
        <a 
          href={item.href} 
          className={item.isButton ? 'nav-btn' : ''}
          onClick={() => setIsOpen(false)}
        >
          {item.text}
        </a>
      );
    } 
    // Otherwise (for all external routes: /login, /register, or section links from other pages), use <Link>.
    else {
      // Use 'to' for routing, prioritizing 'to' if it exists, otherwise use 'href' for a simple path change
      const targetPath = item.to || item.href; 
      
      return (
        <Link
          to={targetPath}
          className={item.isButton ? 'nav-btn' : ''}
          onClick={() => setIsOpen(false)}
        >
          {item.text}
        </Link>
      );
    }
  };


  return (
    <nav>
      {/* Logo always links to home */}
      <Link to="/" className="logo" onClick={() => setIsOpen(false)}>Freelance Flow</Link> 
      
      <button 
        className={`hamburger ${isOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <ul className={`nav-menu ${isOpen ? 'active' : ''}`}>
        {menuItems.map((item, index) => (
          <li key={index}>
            {renderMenuItem(item)}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;