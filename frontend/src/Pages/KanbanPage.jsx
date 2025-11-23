// src/Pages/KanbanPage.jsx
import React from "react";
import Kanban from "../components/Kanban/Kanban";
import PMNavbar from "../components/PMNavbar/PMNavbar";
import PMFooter from "../components/PMFooter/PMFooter";

const KanbanPage = ({ userId, email, user }) => {
  return (
    <div>
      <PMNavbar user={user} />       {/* <-- This must render */}
      <div style={{ padding: "20px" }}>
        <h1>My Kanban Board</h1>
        <Kanban userId={userId} email={email} />
      </div>
      <PMFooter />                   {/* <-- This must render */}
    </div>
  );
};

export default KanbanPage;
