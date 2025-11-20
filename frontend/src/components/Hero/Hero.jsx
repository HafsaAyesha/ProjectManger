import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Manage Projects Like a <span>Pro</span></h1>
        <p>A streamlined project management tool designed for freelancers and small teams. Track projects, manage deadlines, collaborate with clients, and deliver on time. Every time.</p>
        <div className="hero-buttons">
          <button className="primary-btn">Start Free Trial</button>
          <button className="secondary-btn">Watch Demo</button>
        </div>
        <div className="hero-trust">
          <i className="fa-solid fa-shield-check"></i>
          <span>No credit card required. Free for 14 days.</span>
        </div>
      </div>
      <div className="hero-image">
        <img src="/img_1.png" alt="Freelance Flow Dashboard"/>
      </div>
    </section>
  );
};

export default Hero;