import React from "react";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";
import "./DashboardView.css";

export function DashboardView({ tasks }) {
  // Compute stats based on current schema
  const totalTasks = tasks.length;
const completedTasks = tasks.filter((t) => t.status === "done").length;
const inProgressTasks = tasks.filter((t) => t.status === "inprogress").length;
const backlogTasks = tasks.filter((t) => t.status === "backlog").length;
const todoTasks = tasks.filter((t) => t.status === "todo").length;
const reviewTasks = tasks.filter((t) => t.status === "review").length;
const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;


  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const stats = [
    {
      title: "Total Tasks",
      value: totalTasks,
      icon: TrendingUp,
      variant: "blue",
    },
    {
      title: "Completed",
      value: completedTasks,
      icon: CheckCircle2,
      variant: "green",
    },
    {
      title: "In Progress",
      value: inProgressTasks,
      icon: Clock,
      variant: "yellow",
    },
  ];

  const tasksByStatus = {
     backlog: backlogTasks,
    todo: todoTasks,
    inprogress: inProgressTasks,
    review: reviewTasks,
    done: completedTasks,
  };

  return (
    <div className="dashboard-view">
      <header className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Overview of your project progress</p>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="stat-card">
              <div className="stat-content">
                <div>
                  <p className="stat-title">{stat.title}</p>
                  <p className="stat-value">{stat.value}</p>
                </div>
                <div className={`stat-icon ${stat.variant}`}>
                  <Icon size={24} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Completion Rate */}
      <Card className="section-card">
        <h3>Completion Rate</h3>
        <div className="progress-row">
          <span>Overall Progress</span>
          <span>{completionRate.toFixed(0)}%</span>
        </div>
        <Progress value={completionRate} className="progress-bar" />
      </Card>

      {/* Task Distribution */}
      <Card className="section-card">
        <h3>Task Distribution</h3>
        <div className="distribution-list">
          {Object.entries(tasksByStatus).map(([status, count]) => (
            <div key={status} className="distribution-row">
              <span className="status-label">{status}</span>
              <Progress
                value={totalTasks ? (count / totalTasks) * 100 : 0}
                className="progress-bar"
              />
              <span className="status-count">{count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Task List */}
      <Card className="section-card">
        <h3>Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="task-row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.5rem 0",
                borderBottom: "1px solid #eee",
              }}
            >
              
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
