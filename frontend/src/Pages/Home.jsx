// src/Pages/Home.jsx
import React from 'react';

// Layout Components
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer/Footer";

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
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <UseCases />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
};

export default Home;
