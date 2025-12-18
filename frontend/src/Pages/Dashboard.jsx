import React, { useEffect, useState } from "react";
import axios from "axios";
import PMNavbar from "../components/PMNavbar/PMNavbar";
import PMSidebar from "../components/PMSidebar/PMSidebar";
import PMFooter from "../components/PMFooter/PMFooter";
import DashboardStats from "../components/DashboardPage/DashboardStats/DashboardStats";
import { DashboardView } from "../components/DashboardPage/DashboardView";

const Dashboard = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKanbanTasks = async () => {
      try {
        setLoading(true);

        // Fetch task statistics from Kanban
        const statsRes = await axios.get(`/api/dashboard/task-stats?userId=${user._id}`);

        if (statsRes.data) {
          setTaskStats(statsRes.data);
          setTasks(statsRes.data.tasks || []);
        }
      } catch (error) {
        console.error("Error fetching Kanban task data:", error);
        // Fallback to empty state
        setTasks([]);
        setTaskStats({
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          highPriorityTasks: 0,
          tasksByStatus: {},
          completionRate: 0
        });
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) {
      fetchKanbanTasks();
    }
  }, [user]);

  return (
    <div className="dashboard-page-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PMNavbar user={user} />
      <div style={{ display: 'flex', flex: 1 }}>
        <PMSidebar />
        <div className="dashboard-container" style={{ flex: 1, padding: '2rem', maxWidth: '100%', margin: '0 auto', width: '100%' }}>
          <DashboardStats user={user} />
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              <div className="spinner" style={{
                width: '40px',
                height: '40px',
                border: '4px solid #f3f4f6',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              <p>Loading tasks...</p>
            </div>
          ) : (
            <DashboardView tasks={tasks} taskStats={taskStats} />
          )}
        </div>
      </div>
      <PMFooter />
    </div>
  );
};

export default Dashboard;
