import React from 'react';
// Assuming you are using React Router, import the Link component
import { Link } from 'react-router-dom'; 
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>
          Manage Projects Like a <span>Pro</span>
        </h1>
        <p>
          A streamlined project management tool designed for individual freelancers.
          Track projects, manage deadlines, collaborate with clients, and deliver on
          time. Every time.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="primary-btn">
            Start Now
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <img src="/img_1.png" alt="Freelance Flow Dashboard" />
      </div>
    </section>
  );
};

export default Hero;