import React, { useEffect, useState } from "react";
import axios from "axios";
import PMNavbar from "../components/PMNavbar/PMNavbar";
import PMFooter from "../components/PMFooter/PMFooter";
import { DashboardView } from "../components/Dashboard/DashboardView";

const Dashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      
      const res = await axios.get("http://localhost:1000/api/tasks");
      if (res.data) setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchTasks();
    }
  }, [user]);

  return (
    <div className="dashboard-page-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PMNavbar user={user} />
      <div className="dashboard-container" style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <DashboardView tasks={tasks} />
      </div>
      <PMFooter />
    </div>
  );
};

export default Dashboard;
