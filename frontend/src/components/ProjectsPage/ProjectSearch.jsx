import React from 'react';
import './ProjectSearch.css';

const ProjectSearch = ({ searchQuery, onSearchChange }) => {
    return (
        <div className="project-search">
            <svg
                className="search-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
                type="text"
                className="search-input"
                placeholder="Search projects by title, client, or tags..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
            />
        </div>
    );
};

export default ProjectSearch;
