import React from 'react';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from "lucide-react";
import "./DashboardView.css";

export function DashboardView({ tasks, taskStats }) {
    // Use taskStats from API if available, otherwise calculate from tasks
    const stats = taskStats || {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.columnTitle === 'Done' || t.status === 'done').length,
        inProgressTasks: tasks.filter(t => t.columnTitle === 'In Progress' || t.status === 'in-progress' || t.status === 'inProgress').length,
        highPriorityTasks: tasks.filter(t => t.priority === 'high').length,
        completionRate: 0
    };

    // Calculate completion rate if not provided
    if (!taskStats?.completionRate && stats.totalTasks > 0) {
        stats.completionRate = (stats.completedTasks / stats.totalTasks) * 100;
    }

    const statCards = [
        {
            title: "Total Tasks",
            value: stats.totalTasks,
            icon: TrendingUp,
            colorClass: "purple",
        },
        {
            title: "Completed",
            value: stats.completedTasks,
            icon: CheckCircle2,
            colorClass: "green",
        },
        {
            title: "In Progress",
            value: stats.inProgressTasks,
            icon: Clock,
            colorClass: "blue",
        },
        {
            title: "High Priority",
            value: stats.highPriorityTasks,
            icon: AlertCircle,
            colorClass: "red",
        },
    ];

    // Get task distribution by status/column
    const tasksByStatus = taskStats?.tasksByStatus || {};

    // If no tasksByStatus from API, calculate from tasks
    const distribution = Object.keys(tasksByStatus).length > 0
        ? tasksByStatus
        : tasks.reduce((acc, task) => {
            const key = task.columnTitle || task.status || 'Unknown';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

    return (
        <div className="dashboard-view">
            <div className="dashboard-header">
                <h2>Task Management</h2>
                <p>Overview of your task progress</p>
            </div>

            <div className="dashboard-stats-grid">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="stat-card">
                            <div className={`stat-icon-wrapper ${stat.colorClass}`}>
                                <Icon size={24} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.title}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Completion Card - Matching stats-section-card pattern */}
            <div className="completion-card">
                <h3>Completion Rate</h3>
                <div>
                    <div className="completion-row">
                        <span className="completion-label">Overall Progress</span>
                        <span className="completion-value">{stats.completionRate.toFixed(0)}%</span>
                    </div>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${stats.completionRate}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Distribution Card - Matching stats-section-card pattern */}
            <div className="distribution-card">
                <h3>Task Distribution</h3>
                <div className="distribution-list">
                    {Object.entries(distribution).map(([status, count]) => (
                        <div key={status} className="distribution-item">
                            <div className="distribution-info">
                                <div className="distribution-label">
                                    {status}
                                </div>
                                <div className="distribution-bar-bg">
                                    <div
                                        className="distribution-bar-fill"
                                        style={{ width: `${stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                            <span className="distribution-count">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
