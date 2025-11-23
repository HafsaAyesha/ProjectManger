// src/components/PMFooter/PMFooter.jsx
import React from "react";
import "./PMFooter.css";

const PMFooter = () => {
  return (
    <footer className="pm-footer">
      <p>&copy; {new Date().getFullYear()} Project Manager App. All rights reserved.</p>
      <p>Version 1.0</p>
    </footer>
  );
};

export default PMFooter;
