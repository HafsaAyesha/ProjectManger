import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './ProfileDashboard.css';

const ProfileDashboard = ({ projects = [] }) => {
    const [filter, setFilter] = useState('All');
    const [stats, setStats] = useState({
        totalProjects: 0,
        completedProjects: 0,
        inProgress: 0,
        totalEarnings: 0
    });
    const [earningsData, setEarningsData] = useState({ labels: [], data: [] });
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?._id;

    useEffect(() => {
        const fetchStats = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }
            try {
                const [dashboardRes, earningsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/v2/stats/dashboard/${userId}`),
                    axios.get(`http://localhost:5000/api/v2/stats/chart/earnings/${userId}`)
                ]);

                setStats(dashboardRes.data);
                setEarningsData(earningsRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setLoading(false);
            }
        };

        fetchStats();
    }, [userId]);

    // --- Filter Projects ---
    const filteredProjects = useMemo(() => {
        if (filter === 'All') return projects;
        return projects.filter(p => p.status === filter);
    }, [projects, filter]);

    if (loading) return <div className="dashboard-loading">Loading dashboard stats...</div>;

    return (
        <div className="profile-dashboard">
            {/* Stats Row */}
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
                        <h3>${stats.totalEarnings.toLocaleString()}</h3>
                        <p>Total Earnings</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Full Width Column: Projects Table & Earnings Chart */}
                <div className="dash-main-col full-width">

                    {/* Projects Overview */}
                    <div className="dash-card">
                        <div className="card-header">
                            <h3>Projects Overview</h3>
                            <div className="filter-tabs">
                                {['All', 'Completed', 'In Progress'].map(f => (
                                    <button
                                        key={f}
                                        className={`filter-btn ${filter === f ? 'active' : ''}`}
                                        onClick={() => setFilter(f)}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="projects-table">
                                <thead>
                                    <tr>
                                        <th>Project Name</th>
                                        <th>Client</th>
                                        <th>Status</th>
                                        <th>Deadline</th>
                                        <th>Budget</th>
                                        <th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProjects.length > 0 ? filteredProjects.map((project, idx) => (
                                        <tr key={idx}>
                                            <td className="fw-600">{project.title}</td>
                                            <td>{project.client}</td>
                                            <td>
                                                <span className={`status-pill ${project.status.toLowerCase().replace(' ', '-')}`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td>{project.deadline ? new Date(project.deadline).toLocaleDateString() : '-'}</td>
                                            <td>${project.budget}</td>
                                            <td>
                                                <div className="progress-bar-mini">
                                                    <div className="fill" style={{ width: `${project.status === 'Completed' ? 100 : 60}%` }}></div>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="table-empty-state">No projects found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Earnings Chart */}
                    <div className="dash-card chart-card">
                        <h3>Monthly Earnings</h3>
                        <div className="simple-bar-chart">
                            {earningsData.data.length > 0 ? earningsData.data.map((h, i) => (
                                <div key={i} className="bar-group">
                                    <div className="bar" style={{ height: `${(h / Math.max(...earningsData.data)) * 100}%` }} title={`$${h}`}></div>
                                    <span className="label">{earningsData.labels[i]}</span>
                                </div>
                            )) : <p className="chart-empty-state">No earnings data</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDashboard;
