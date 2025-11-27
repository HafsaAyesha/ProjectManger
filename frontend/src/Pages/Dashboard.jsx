import Sidebar from "../components/Sidebar/sidebar";
import Navbar from "../components/navbar/Navbar";
import Card from "../components/Card/card";

import "./Dashboard.css"


function Dashboard({ user }) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Navbar user={user} />

        <h1>Dashboard</h1>

        <div className="cards-container">
          <Card 
            title="Go to Kanban"
            description="View and manage tasks"
            onClick={() => window.location.href = "/kanban"}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
