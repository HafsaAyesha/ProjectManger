import React from "react";
import { Link } from "react-router-dom";
import "./PMNavbar.css";

const PMNavbar = ({ user }) => {
  return (
    <nav className="pm-navbar">
      <div className="pm-brand">ProjectManager</div>

      <ul className="pm-nav-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/kanban">Kanban</Link></li>
        <li><Link to="/tasks">Tasks</Link></li>
        <li><Link to="/calendar">Calendar</Link></li>
      </ul>

      <div className="user-info">
        <span>Welcome, {user ? user.username : "Login"}</span>
      </div>
    </nav>
  );
};

export default PMNavbar;
