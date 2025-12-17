import React from 'react';
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import "./DashboardView.css";

export function DashboardView({ tasks }) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "done").length;
    // Normalize status check: 'in-progress' or 'inProgress'
    const inProgressTasks = tasks.filter((t) => t.status === "in-progress" || t.status === "inProgress").length;
    // Handle priority if it exists, otherwise 0
    const highPriorityTasks = tasks.filter((t) => t.priority === "high").length;

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const stats = [
        {
            title: "Total Tasks",
            value: totalTasks,
            icon: TrendingUp,
            color: "stat-card__icon",
            bgColor: "stat-card__icon-wrapper stat-gradient-blue",
        },
        {
            title: "Completed",
            value: completedTasks,
            icon: CheckCircle2,
            color: "stat-card__icon",
            bgColor: "stat-card__icon-wrapper stat-gradient-green",
        },
        {
            title: "In Progress",
            value: inProgressTasks,
            icon: Clock,
            color: "stat-card__icon",
            bgColor: "stat-card__icon-wrapper stat-gradient-yellow",
        },
        {
            title: "High Priority",
            value: highPriorityTasks,
            icon: AlertCircle,
            color: "stat-card__icon",
            bgColor: "stat-card__icon-wrapper stat-gradient-red",
        },
    ];

    // Get tasks by status
    const tasksByStatus = {
        backlog: tasks.filter((t) => t.status === "backlog").length,
        todo: tasks.filter((t) => t.status === "todo").length,
        "in-progress": tasks.filter((t) => t.status === "in-progress" || t.status === "inProgress").length,
        review: tasks.filter((t) => t.status === "review").length,
        done: tasks.filter((t) => t.status === "done").length,
    };

    return (
        <div className="dashboard-view">
            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <p>Overview of your project progress</p>
            </div>

            <div className="dashboard-stats-grid">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="stat-card">
                            <div className="stat-card__content">
                                <div className="stat-card__info">
                                    <p>{stat.title}</p>
                                    <p>{stat.value}</p>
                                </div>
                                <div className={stat.bgColor}>
                                    <Icon className={stat.color} />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Card className="completion-card">
                <h3>Completion Rate</h3>
                <div>
                    <div className="completion-row">
                        <span className="completion-label">Overall Progress</span>
                        <span className="completion-value">{completionRate.toFixed(0)}%</span>
                    </div>
                    <Progress value={completionRate} className="completion-bar" />
                </div>
            </Card>

            <Card className="distribution-card">
                <h3>Task Distribution</h3>
                <div className="distribution-list">
                    {Object.entries(tasksByStatus).map(([status, count]) => (
                        <div key={status} className="distribution-item">
                            <div className="distribution-info">
                                <div className="distribution-label">
                                    {status.replace("-", " ")}
                                </div>
                                <Progress
                                    value={totalTasks > 0 ? (count / totalTasks) * 100 : 0}
                                    className="distribution-bar"
                                />
                            </div>
                            <span className="distribution-count">{count}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
