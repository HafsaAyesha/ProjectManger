import React from 'react';
import './WorkspaceHeader.css';

const WorkspaceHeader = ({ project, onBack }) => {
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

    return (
        <div className="workspace-header">
            <button className="btn-back-header" onClick={onBack}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Projects
            </button>

            <div className="header-content">
                <div className="header-main">
                    <h1 className="project-title-large">{project.title}</h1>
                    <span className={`status-badge-large ${getStatusClass(project.status)}`}>
                        {project.status}
                    </span>
                </div>
                <p className="project-client">Client: {project.clientName}</p>
            </div>
        </div>
    );
};

export default WorkspaceHeader;
