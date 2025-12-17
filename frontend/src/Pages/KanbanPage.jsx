import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PMNavbar from "../components/PMNavbar/PMNavbar";
import PMSidebar from "../components/PMSidebar/PMSidebar";
import PMFooter from "../components/PMFooter/PMFooter";
import Kanban from "../components/KanbanPage/Kanban";
import "../components/KanbanPage/Kanban.css";

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
    <div className="kanban-page-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PMNavbar user={user} />

      {message && (
        <div className="pm-success-banner">
          <span>{message}</span>
          <button className="close-btn" onClick={closeMessage}>&times;</button>
        </div>
      )}

      <div style={{ display: 'flex', flex: 1 }}>
        <PMSidebar />
        <div className="kanban-container" style={{ flex: 1, minWidth: 0 }}>
          <Kanban userId={userId} email={email} user={user} />
        </div>
      </div>

      <PMFooter />
    </div>
  );

};

export default KanbanPage;
