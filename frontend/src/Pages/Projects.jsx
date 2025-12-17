import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PMNavbar from '../components/PMNavbar/PMNavbar';
import PMFooter from '../components/PMFooter/PMFooter';
import Projects from '../components/ProjectsPage/Projects';
import ProjectModal from '../components/ProjectsPage/ProjectModal';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [selectedProject, setSelectedProject] = useState(null);

    // Get user from localStorage
    const getUser = useCallback(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user || null;
    }, []);

    // Get user ID from localStorage (matching your existing auth pattern)
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
                params: { id: userId } // Use params for GET request, not data
            });

            setProjects(response.data.projects || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err.response?.data?.message || 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    }, [getUserId]); // getUserId is now stable due to useCallback

    // Open modal for new project
    const handleNewProject = () => {
        setModalMode('create');
        setSelectedProject(null);
        setModalOpen(true);
    };

    // Open modal for editing project
    const handleEditProject = (project) => {
        setModalMode('edit');
        setSelectedProject(project);
        setModalOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProject(null);
    };

    // Handle modal form submission
    const handleModalSubmit = async (formData) => {
        const userId = getUserId();

        if (!userId) {
            alert('Please login to create/edit a project');
            return;
        }

        try {
            if (modalMode === 'create') {
                // Create new project
                const response = await axios.post('http://localhost:1000/api/v3/projects', {
                    id: userId,
                    ...formData,
                    notesCount: 0
                });

                if (response.status === 201) {
                    alert('Project created successfully!');
                    handleCloseModal();
                    fetchProjects(); // Refresh list
                }
            } else {
                // Edit existing project
                const response = await axios.put(`http://localhost:1000/api/v3/projects/${selectedProject._id}`, {
                    id: userId,
                    ...formData,
                    notesCount: selectedProject.notesCount
                });

                if (response.status === 200) {
                    alert('Project updated successfully!');
                    handleCloseModal();
                    fetchProjects(); // Refresh list
                }
            }
        } catch (err) {
            console.error('Error saving project:', err);
            alert(err.response?.data?.message || 'Failed to save project');
        }
    };

    // Delete project
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
                fetchProjects(); // Refresh list
            }
        } catch (err) {
            console.error('Error deleting project:', err);
            alert(err.response?.data?.message || 'Failed to delete project');
        }
    };

    // Fetch projects on component mount
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    if (error && error.includes('login')) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                flexDirection: 'column',
                gap: '1rem'
            }}>
                <h2>Please Login</h2>
                <p>{error}</p>
            </div>
        );
    }

    const user = getUser();

    return (
        <div className="projects-page-wrapper">
            <PMNavbar user={user} />

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

