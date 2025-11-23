// src/pages/Home.jsx
import React from 'react';

// Import all static sections
import Hero from '../components/Hero/Hero';
import Stats from '../components/Stats/Stats';
import Features from '../components/Features/Features';
import UseCases from '../components/UseCases/UseCases';
import Testimonials from '../components/Testimonials/Testimonials';
import CTA from '../components/CTA/CTA';

const Home = () => {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <UseCases />
      <Testimonials />
      <CTA />
    </>
  );
};

export default Home;