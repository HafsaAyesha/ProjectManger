import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer>
      <div>
        <div className="footer-brand">Freelance Flow</div>
        <p style={{ fontSize: '12px', marginBottom: '16px' }}>Project management made simple for freelancers.</p>
        <div className="footer-social">
          <div className="social-icon"><i className="fa-brands fa-twitter"></i></div>
          <div className="social-icon"><i className="fa-brands fa-linkedin"></i></div>
          <div className="social-icon"><i className="fa-brands fa-facebook"></i></div>
          <div className="social-icon"><i className="fa-brands fa-instagram"></i></div>
        </div>
      </div>
      <div>
        <h4>Product</h4>
        <ul>
          <li><a href="#">Features</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Security</a></li>
          <li><a href="#">Roadmap</a></li>
          <li><a href="#">Updates</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Partners</a></li>
        </ul>
      </div>
      <div>
        <h4>Resources</h4>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Documentation</a></li>
          <li><a href="#">API Docs</a></li>
          <li><a href="#">Status</a></li>
          <li><a href="#">Terms & Privacy</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;