import React from 'react';
import ProgressBar from './common/ProgressBar';
import './OverviewTab.css';

const OverviewTab = ({ project, progressStats, onEditDetails }) => {
    // Fallback if stats aren't passed (though they should be)
    const stats = progressStats || { total: 0, completed: 0, progress: 0 };

    const formatDeadline = (deadline) => {
        if (!deadline) return 'No deadline set';
        return new Date(deadline).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatBudget = (budget) => {
        if (!budget) return 'Not set';
        return `$${budget.toLocaleString()}`;
    };

    return (
        <div className="overview-tab">
            <h2 className="tab-title">Project Overview</h2>

            {/* Shared Progress Bar */}
            <div className="overview-section">
                <ProgressBar
                    progress={stats.progress}
                    total={stats.total}
                    completed={stats.completed}
                />
            </div>

            {/* Key Information */}
            <div className="overview-section">
                <div className="section-header-row">
                    <h3>Key Information</h3>
                    {onEditDetails && (
                        <button onClick={onEditDetails} className="btn-edit-overview">
                            Edit
                        </button>
                    )}
                </div>
                <div className="info-grid">
                    <div className="info-item">
                        <label>Status</label>
                        <div className={`status-pill status-${project.status}`}>
                            {project.status}
                        </div>
                    </div>
                    <div className="info-item">
                        <label>Client</label>
                        <p>{project.clientName}</p>
                    </div>
                    <div className="info-item">
                        <label>Budget</label>
                        <p>{formatBudget(project.budget)}</p>
                    </div>
                    <div className="info-item">
                        <label>Deadline</label>
                        <p>{formatDeadline(project.deadline)}</p>
                    </div>
                </div>
            </div>

            {/* Description */}
            {project.description && (
                <div className="overview-section">
                    <h3>Description</h3>
                    <p className="description-text">{project.description}</p>
                </div>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
                <div className="overview-section">
                    <h3>Tech Stack & Skills</h3>
                    <div className="tags-container">
                        {project.tags.map((tag, index) => (
                            <span key={index} className="tag-overview">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div className="overview-section">
                <h3>Quick Stats</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{project.notesCount || 0}</div>
                        <div className="stat-label">Notes</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{project.tags?.length || 0}</div>
                        <div className="stat-label">Technologies</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{Math.round(stats.progress)}%</div>
                        <div className="stat-label">Complete</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
