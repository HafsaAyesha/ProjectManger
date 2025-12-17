import React from "react";
import PMNavbar from "../components/PMNavbar/PMNavbar";
import PMFooter from "../components/PMFooter/PMFooter";
import Kanban from "../components/Kanban/KanbanContainer";

const KanbanPage = ({ userId, email, user }) => {
  return (
    <>
      <PMNavbar user={user} />
      <Kanban userId={userId} email={email} />
      <PMFooter />
    </>
  );
};

export default KanbanPage;
