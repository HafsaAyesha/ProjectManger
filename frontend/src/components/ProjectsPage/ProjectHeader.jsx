import React from 'react';
import './ProjectHeader.css';

const ProjectHeader = ({ projectCount, onNewProject }) => {
    return (
        <div className="project-header">
            <div className="project-header-left">
                <h1 className="project-header-title">My Projects</h1>
                <span className="project-count">{projectCount} {projectCount === 1 ? 'Project' : 'Projects'}</span>
            </div>
            <button className="btn-new-project" onClick={onNewProject}>
                <span className="btn-icon">+</span>
                New Project
            </button>
        </div>
    );
};

export default ProjectHeader;
