import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Briefcase,
    Users,
    DollarSign,
    TrendingUp,
    Flag,
    Calendar,
    PieChart,
    AlertCircle
} from 'lucide-react';
import './DashboardStats.css';

const DashboardStats = ({ user }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (!user || !user._id) return;

                setLoading(true);
                // Adjust port if needed, assuming proxy is set or standard fetch
                // Frontend usually proxies /api to backend port 1000
                const response = await axios.get(`http://localhost:1000/api/dashboard/stats?id=${user._id}`);
                setStats(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
                setError("Failed to load dashboard statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user]);

    if (loading) {
        return (
            <div className="stats-loading">
                <div className="spinner"></div>
                {/* Assuming spinner class exists, if not just text */}
                <span style={{ marginLeft: '10px' }}>Loading statistics...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="stats-error-msg" style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
                <AlertCircle size={24} style={{ display: 'block', margin: '0 auto 10px' }} />
                {error}
            </div>
        );
    }

    if (!stats) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getDaysUrgencyClass = (days) => {
        if (days <= 3) return 'urgent';
        if (days <= 7) return 'warning';
        return 'normal';
    };

    const getDaysLabel = (days) => {
        if (days < 0) return `${Math.abs(days)} days due`; // Overdue
        if (days === 0) return 'Due today';
        if (days === 1) return 'Due tomorrow';
        return `${days} days left`;
    };

    const totalTrackedProjects =
        stats.projectStatusBreakdown.active +
        stats.projectStatusBreakdown.completed +
        stats.projectStatusBreakdown.on_hold +
        stats.projectStatusBreakdown.not_started || 1; // avoid division by zero

    const getStatusPercent = (count) => {
        return Math.round((count / totalTrackedProjects) * 100);
    }

    return (
        <div className="dashboard-stats-wrapper">
            {/* Top Metrics Row */}
            <div className="stats-metrics-grid">
                <StatCard
                    icon={Briefcase}
                    label="Active Projects"
                    value={stats.activeProjects}
                    colorClass="purple"
                />
                <StatCard
                    icon={Users}
                    label="Total Clients"
                    value={stats.totalClients}
                    colorClass="blue"
                />
                <StatCard
                    icon={DollarSign}
                    label="Net Profit"
                    value={formatCurrency(stats.netProfit)}
                    colorClass="green"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Completion Rate"
                    value={`${stats.completionRate}%`}
                    colorClass="purple"
                />
            </div>

            {/* Content Grid */}
            <div className="stats-content-grid">
                {/* Left: Upcoming Milestones */}
                <div className="stats-section-card">
                    <div className="stats-header">
                        <h3 className="stats-title">
                            <Flag size={20} className="text-purple-600" />
                            Upcoming Milestones
                        </h3>
                        <span className="text-sm text-gray-500">Next 5 due</span>
                    </div>
                    <div className="stats-body">
                        {stats.upcomingMilestones && stats.upcomingMilestones.length > 0 ? (
                            <div className="milestone-list-compact">
                                {stats.upcomingMilestones.map((ms) => (
                                    <div key={ms.id} className="milestone-item-compact">
                                        <div className="mi-info">
                                            <h4>{ms.title}</h4>
                                            <p className="mi-project">{ms.projectName}</p>
                                        </div>
                                        <div className="mi-status">
                                            <span className="mi-date">
                                                {new Date(ms.dueDate).toLocaleDateString()}
                                            </span>
                                            <span className={`mi-days ${getDaysUrgencyClass(ms.daysRemaining)}`}>
                                                {getDaysLabel(ms.daysRemaining)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-milestones">
                                <Calendar size={32} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                                <p>No upcoming milestones found.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Sidebar Stats */}
                <div className="stats-sidebar">
                    {/* Project Status */}
                    <div className="stats-section-card sidebar-section">
                        <div className="stats-header">
                            <h3 className="stats-title">
                                <PieChart size={18} /> Projects Status
                            </h3>
                        </div>
                        <div className="stats-body">
                            <div className="status-list">
                                <StatusRow
                                    label="In Progress"
                                    count={stats.projectStatusBreakdown.in_progress}
                                    percent={getStatusPercent(stats.projectStatusBreakdown.in_progress)}
                                    type="active"
                                />
                                <StatusRow
                                    label="Completed"
                                    count={stats.projectStatusBreakdown.completed}
                                    percent={getStatusPercent(stats.projectStatusBreakdown.completed)}
                                    type="completed"
                                />
                                <StatusRow
                                    label="On Hold"
                                    count={stats.projectStatusBreakdown.on_hold}
                                    percent={getStatusPercent(stats.projectStatusBreakdown.on_hold)}
                                    type="on-hold"
                                />
                                <StatusRow
                                    label="Not Started"
                                    count={stats.projectStatusBreakdown.not_started}
                                    percent={getStatusPercent(stats.projectStatusBreakdown.not_started)}
                                    type="not-started"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Top Clients */}
                    <div className="stats-section-card">
                        <div className="stats-header">
                            <h3 className="stats-title">
                                <Users size={18} /> Top Clients
                            </h3>
                        </div>
                        <div className="stats-body">
                            {stats.topClients && stats.topClients.length > 0 ? (
                                <ul className="client-list">
                                    {stats.topClients.map((client, idx) => (
                                        <li key={idx} className="client-item">
                                            <span className="client-name">{client.name}</span>
                                            <span className="project-badge">{client.projectCount} Projects</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400 text-sm text-center">No client data available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-components
const StatCard = ({ icon: Icon, label, value, colorClass }) => (
    <div className="stat-card">
        <div className={`stat-icon-wrapper ${colorClass}`}>
            <Icon size={24} />
        </div>
        <div className="stat-content">
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    </div>
);

const StatusRow = ({ label, count, percent, type }) => (
    <div className="status-row">
        <div className="status-header-row">
            <span>{label}</span>
            <span>{count}</span>
        </div>
        <div className="status-bar-bg">
            <div
                className={`status-bar-fill ${type}`}
                style={{ width: `${percent}%` }}
            ></div>
        </div>
    </div>
);

export default DashboardStats;
