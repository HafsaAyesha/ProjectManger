import React, { useState, useEffect } from 'react';
import ProjectHeader from './ProjectHeader';
import ProjectSearch from './ProjectSearch';
import ProjectCard from './ProjectCard';
import './Projects.css';

const Projects = ({ projects, loading, onNewProject, onEditProject, onDeleteProject, onRefresh }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);

    // Filter projects based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredProjects(projects);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = projects.filter(project => {
                const titleMatch = project.title.toLowerCase().includes(query);
                const clientMatch = project.clientName.toLowerCase().includes(query);
                const tagsMatch = project.tags?.some(tag => tag.toLowerCase().includes(query));
                return titleMatch || clientMatch || tagsMatch;
            });
            setFilteredProjects(filtered);
        }
    }, [searchQuery, projects]);

    if (loading) {
        return (
            <div className="projects-container">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="projects-container">
            <ProjectHeader
                projectCount={projects.length}
                onNewProject={onNewProject}
            />

            <ProjectSearch
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {filteredProjects.length === 0 ? (
                <div className="empty-state">
                    {searchQuery ? (
                        <>
                            <svg className="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                            <h3>No projects found</h3>
                            <p>Try adjusting your search query</p>
                        </>
                    ) : (
                        <>
                            <svg className="empty-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                            </svg>
                            <h3>No projects yet</h3>
                            <p>Create your first project to get started with managing your freelance work</p>
                            <button className="btn-create-first" onClick={onNewProject}>
                                Create Project
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="projects-grid">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            onEdit={onEditProject}
                            onDelete={onDeleteProject}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Projects;
