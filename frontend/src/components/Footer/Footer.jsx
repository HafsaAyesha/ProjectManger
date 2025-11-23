import React from 'react';
import './Footer.css';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-brand">Freelance Flow</div>
          <p className="footer-tagline">Project management made simple for freelancers.</p>
        </div>

        <div className="footer-links-group">
          <div className="footer-column">

            <ul>
              <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
              <li><a href="#statistics" onClick={(e) => { e.preventDefault(); scrollToSection('statistics'); }}>Statistics</a></li>
              <li><a href="#reviews" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Reviews</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;