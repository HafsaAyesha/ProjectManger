import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PMNavbar.css";

const PMNavbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="pm-navbar">
      <Link to="/" className="pm-brand">Freelance Flow</Link>

      <div className="pm-right-section">
        <div className="user-profile">
          <i className="fas fa-user-circle profile-icon"></i>
          <span className="username">{user ? user.username : "Guest"}</span>
        </div>

        {user && (
          <button className="logout-btn-icon" onClick={handleLogout} title="Logout">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        )}
      </div>
    </nav>
  );
};

export default PMNavbar;
