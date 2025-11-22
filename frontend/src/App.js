// src/App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"; 

// Layout Components
import Navbar from "./components/navbar/Navbar"; // <-- CHECK THIS ONE
import Footer from "./components/Footer/Footer"; // <-- CHECK THIS ONE

// Page Components
import Home from "./Pages/Home"; // <-- CORRECT: No braces
import Login from "./components/Auth/Login"; // <-- CORRECT: No braces
import Register from "./components/Auth/Register"; // <-- CORRECT: No braces

const App = () => {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer /> 
    </Router>
  );
};

export default App;