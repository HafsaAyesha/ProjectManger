// src/Pages/Home.jsx
import React from 'react';

// Layout Components
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/Footer/Footer";

// Import all static sections
import Hero from '../components/HomePage/Hero/Hero';
import Stats from '../components/HomePage/Stats/Stats';
import Features from '../components/HomePage/Features/Features';
import UseCases from '../components/HomePage/UseCases/UseCases';
import Testimonials from '../components/HomePage/Testimonials/Testimonials';
import CTA from '../components/HomePage/CTA/CTA';

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
