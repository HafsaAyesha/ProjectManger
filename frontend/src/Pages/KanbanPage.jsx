import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PMNavbar from "../components/PMNavbar/PMNavbar";
import PMFooter from "../components/PMFooter/PMFooter";
import Kanban from "../components/Kanban/Kanban";
import "../components/Kanban/Kanban.css";

const KanbanPage = ({ userId, email, user }) => {
  const location = useLocation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const closeMessage = () => setMessage("");

//
  return (
    <div className="kanban-page-wrapper">
      <PMNavbar user={user} />

      {message && (
        <div className="pm-success-banner">
          <span>{message}</span>
          <button className="close-btn" onClick={closeMessage}>&times;</button>
        </div>
      )}

      <div className="kanban-container">
        <Kanban userId={userId} email={email} user={user} />
      </div>

      <PMFooter />
    </div>
  );

};

export default KanbanPage;
