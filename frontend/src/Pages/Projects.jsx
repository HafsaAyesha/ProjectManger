import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PMNavbar from '../components/PMNavbar/PMNavbar';
import PMSidebar from '../components/PMSidebar/PMSidebar';
import PMFooter from '../components/PMFooter/PMFooter';
import Projects from '../components/ProjectsPage/Projects';
import ProjectModal from '../components/ProjectsPage/ProjectModal';
import './Projects.css';

const ProjectsPage = () => {
    // ... (state and logic remains unchanged) ...
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedProject, setSelectedProject] = useState(null);

    // Get user from localStorage
    const getUser = useCallback(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user || null;
    }, []);

    // Get user ID from localStorage
    const getUserId = useCallback(() => {
        const user = getUser();
        return user?._id || null;
    }, [getUser]);

    // Fetch all projects
    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const userId = getUserId();

            if (!userId) {
                setError('Please login to view projects');
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:1000/api/v3/projects', {
                params: { id: userId }
            });

            setProjects(response.data.projects || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.response?.data?.message || 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    }, [getUserId]);

    // Handlers (remains unchanged)
    const handleNewProject = () => {
        setModalMode('create');
        setSelectedProject(null);
        setModalOpen(true);
    };

    const handleEditProject = (project) => {
        setModalMode('edit');
        setSelectedProject(project);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProject(null);
    };

    const handleModalSubmit = async (formData) => {
        const userId = getUserId();

        if (!userId) {
            alert('Please login to create/edit a project');
            return;
        }

        try {
            if (modalMode === 'create') {
                const response = await axios.post('http://localhost:1000/api/v3/projects', {
                    id: userId,
                    ...formData,
                    notesCount: 0
                });

                if (response.status === 201) {
                    alert('Project created successfully!');
                    handleCloseModal();
                    fetchProjects();
                }
            } else {
                const response = await axios.put(`http://localhost:1000/api/v3/projects/${selectedProject._id}`, {
                    id: userId,
                    ...formData,
                    notesCount: selectedProject.notesCount
                });

                if (response.status === 200) {
                    alert('Project updated successfully!');
                    handleCloseModal();
                    fetchProjects();
                }
            }
        } catch (err) {
            console.error('Error saving project:', err);
            alert(err.response?.data?.message || 'Failed to save project');
        }
    };

    const handleDeleteProject = async (projectId) => {
        const userId = getUserId();

        if (!userId) {
            alert('Please login to delete projects');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this project?')) {
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:1000/api/v3/projects/${projectId}`, {
                data: { id: userId }
            });

            if (response.status === 200) {
                alert('Project deleted successfully!');
                fetchProjects();
            }
        } catch (err) {
            console.error('Error deleting project:', err);
            alert(err.response?.data?.message || 'Failed to delete project');
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    if (error && error.includes('login')) {
        return (
            <div className="login-message-container">
                <h2>Please Login</h2>
                <p>{error}</p>
            </div>
        );
    }

    const user = getUser();

    return (
        <div className="projects-page-wrapper">
            <PMNavbar user={user} />

            <div className="projects-layout-container">
                <PMSidebar />
                <div className="projects-page-content">
                    <Projects
                        projects={projects}
                        loading={loading}
                        onNewProject={handleNewProject}
                        onEditProject={handleEditProject}
                        onDeleteProject={handleDeleteProject}
                        onRefresh={fetchProjects}
                    />
                </div>
            </div>

            <PMFooter />

            <ProjectModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSubmit={handleModalSubmit}
                project={selectedProject}
                mode={modalMode}
            />
        </div>
    );
};


export default ProjectsPage;

