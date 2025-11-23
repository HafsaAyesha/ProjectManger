// src/components/PMNavbar/PMNavbar.jsx
import React from "react";
import "./PMNavbar.css";
import { Link } from "react-router-dom";

const PMNavbar = ({ user }) => {
  return (
    <nav className="pm-navbar">
      <div className="pm-brand">Project Manager</div>
      <ul className="pm-nav-links">
        <li><Link to="/kanban">Kanban</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/teams">Teams</Link></li>
        <li>{user ? `Hello, ${user.username}` : <Link to="/login">Login</Link>}</li>
      </ul>
    </nav>
  );
};

export default PMNavbar;
