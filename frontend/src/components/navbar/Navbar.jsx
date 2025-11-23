import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    // Standard section links. These must start with '#' in href.
    { text: 'Features', href: '#features' }, 
    { text: 'Pricing', href: '#pricing' }, 
    { text: 'Reviews', href: '#testimonials' }, 
    
    // Auth links MUST use 'to'
    { text: 'Get Started', to: '/register', isButton: true }, 
    { text: 'Login', to: '/login' } 
  ];

  // Helper function to determine the correct element to render
  const renderMenuItem = (item) => {
    const isInternalAnchor = item.href && item.href.startsWith('#');

    // 1. Home Page Section Link: Use <a> tag for natural scrolling/hash-change on the same page.
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
    // 2. External Routes or Section Link from Non-Home Page: Use <Link>.
    else {
      // Logic for targetPath:
      // If it's an internal section link (e.g., #features), we route to '/#features' 
      // so React Router takes the user back to the home page with the scroll hash.
      // Otherwise, use the standard 'to' or 'href' path (e.g., /login).
      const targetPath = isInternalAnchor 
        ? `/${item.href}` 
        : (item.to || item.href); 
      
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