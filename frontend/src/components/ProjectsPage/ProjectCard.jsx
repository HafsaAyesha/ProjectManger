import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectCard.css';

const ProjectCard = ({ project, onEdit, onDelete }) => {
    const navigate = useNavigate();

    // Status badge color mapping
    const getStatusClass = (status) => {
        switch (status) {
            case 'active':
                return 'status-active';
            case 'on-hold':
                return 'status-on-hold';
            case 'completed':
                return 'status-completed';
            default:
                return 'status-active';
        }
    };

    // Format deadline
    const formatDeadline = (deadline) => {
        if (!deadline) return 'No deadline';
        const date = new Date(deadline);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Format budget
    const formatBudget = (budget) => {
        if (!budget) return 'Not set';
        return `$${budget.toLocaleString()}`;
    };

    // Navigate to workspace
    const handleOpenWorkspace = () => {
        navigate(`/projects/${project._id}`);
    };

    return (
        <div className="project-card">
            <div className="project-card-header">
                <div className="project-title-section">
                    <h3 className="project-title">{project.title}</h3>
                    <span className={`status-badge ${getStatusClass(project.status)}`}>
                        {project.status}
                    </span>
                </div>
                <div className="project-actions">
                    <button
                        className="action-btn open-btn"
                        onClick={handleOpenWorkspace}
                        title="Open workspace"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                    </button>
                    <button
                        className="action-btn edit-btn"
                        onClick={() => onEdit(project)}
                        title="Edit project"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button
                        className="action-btn delete-btn"
                        onClick={() => onDelete(project._id)}
                        title="Delete project"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {project.description && (
                <p className="project-description">{project.description}</p>
            )}

            <div className="project-meta">
                <div className="meta-item">
                    <svg className="meta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span className="meta-label">Client:</span>
                    <span className="meta-value">{project.clientName}</span>
                </div>

                <div className="meta-item">
                    <svg className="meta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                    <span className="meta-label">Budget:</span>
                    <span className="meta-value">{formatBudget(project.budget)}</span>
                </div>

                <div className="meta-item">
                    <svg className="meta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span className="meta-label">Deadline:</span>
                    <span className="meta-value">{formatDeadline(project.deadline)}</span>
                </div>

                <div className="meta-item">
                    <svg className="meta-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span className="meta-label">Notes:</span>
                    <span className="meta-value">{project.notesCount || 0}</span>
                </div>
            </div>

            {project.tags && project.tags.length > 0 && (
                <div className="project-tags">
                    {project.tags.map((tag, index) => (
                        <span key={index} className="tag">
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectCard;
