import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PMNavbar from '../components/PMNavbar/PMNavbar';
import PMSidebar from '../components/PMSidebar/PMSidebar';
import PMFooter from '../components/PMFooter/PMFooter';
import ProjectWorkspace from '../components/ProjectsWorkspacePage/ProjectWorkspace';

const ProjectWorkspacePage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get user from localStorage
    const getUser = useCallback(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user || null;
    }, []);

    // Get user ID
    const getUserId = useCallback(() => {
        const user = getUser();
        return user?._id || null;
    }, [getUser]);

    // Fetch project data
    const fetchProject = useCallback(async () => {
        try {
            setLoading(true);
            const userId = getUserId();

            if (!userId) {
                setError('Please login to view project');
                setLoading(false);
                return;
            }

            const response = await axios.get(`http://localhost:1000/api/v3/projects/${projectId}`, {
                params: { userId }
            });

            setProject(response.data.project);
            setError(null);
        } catch (err) {
            console.error('Error fetching project:', err);
            setError(err.response?.data?.message || 'Failed to fetch project');
        } finally {
            setLoading(false);
        }
    }, [projectId, getUserId]);

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    const handleBackToProjects = () => {
        navigate('/projects');
    };

    if (loading) {
        return (
            <div className="workspace-loading">
                <PMNavbar user={getUser()} />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading project workspace...</p>
                </div>
                <PMFooter />
            </div>
        );
    }

    if (error) {
        return (
            <div className="workspace-error">
                <PMNavbar user={getUser()} />
                <div className="error-container">
                    <h2>Error Loading Project</h2>
                    <p>{error}</p>
                    <button onClick={handleBackToProjects} className="btn-back">
                        Back to Projects
                    </button>
                </div>
                <PMFooter />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="workspace-not-found">
                <PMNavbar user={getUser()} />
                <div className="not-found-container">
                    <h2>Project Not Found</h2>
                    <p>The project you're looking for doesn't exist or you don't have access to it.</p>
                    <button onClick={handleBackToProjects} className="btn-back">
                        Back to Projects
                    </button>
                </div>
                <PMFooter />
            </div>
        );
    }

    return (
        <div className="workspace-page-wrapper">
            <PMNavbar user={getUser()} />
            <div className="workspace-body" style={{ display: 'flex', flex: 1 }}>
                <PMSidebar />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <ProjectWorkspace
                        project={project}
                        onBack={handleBackToProjects}
                        onUpdate={fetchProject}
                    />
                </div>
            </div>
            <PMFooter />
        </div>
    );
};

export default ProjectWorkspacePage;
