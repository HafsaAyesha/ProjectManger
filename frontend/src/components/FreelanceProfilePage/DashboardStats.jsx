import React from 'react';
import MonthlyEarnings from './MonthlyEarnings';
import './DashboardStats.css';

const DashboardStats = ({ stats, earningsData }) => {
    return (
        <div className="dashboard-stats-container">
            {/* Overview Cards Row */}
            <div className="stats-row">
                <div className="dash-card stat-card">
                    <div className="stat-icon-wrapper purple">
                        <i className="fas fa-project-diagram"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.totalProjects}</h3>
                        <p>Total Projects</p>
                    </div>
                </div>
                <div className="dash-card stat-card">
                    <div className="stat-icon-wrapper green">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.completedProjects}</h3>
                        <p>Completed</p>
                    </div>
                </div>
                <div className="dash-card stat-card">
                    <div className="stat-icon-wrapper blue">
                        <i className="fas fa-spinner"></i>
                    </div>
                    <div className="stat-info">
                        <h3>{stats.inProgress}</h3>
                        <p>In Progress</p>
                    </div>
                </div>
                <div className="dash-card stat-card">
                    <div className="stat-icon-wrapper gold">
                        <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="stat-info">
                        <h3>${stats.totalEarnings?.toLocaleString()}</h3>
                        <p>Total Earnings</p>
                    </div>
                </div>
            </div>

            {/* Detailed Charts Grid */}
            <div className="dash-charts-grid">
                <MonthlyEarnings earningsData={earningsData} />
                {/* Removed RecentActivities and SkillUsage as per user request */}
            </div>
        </div>
    );
};

export default DashboardStats;
