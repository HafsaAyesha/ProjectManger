import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import MilestoneList from './MilestoneList';
import Timeline from './Timeline';
import './Overview.css';

const Overview = ({ projectId }) => {
    const [milestones, setMilestones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get current user ID
    const getUserId = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?._id;
    };

    const fetchMilestones = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:1000/api/v3/projects/${projectId}/milestones`);
            setMilestones(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching milestones:', err);
            setError('Failed to load project data.');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchMilestones();
    }, [fetchMilestones]);

    // Progress Calculation
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.isCompleted).length;
    const progress = totalMilestones === 0 ? 0 : (completedMilestones / totalMilestones) * 100;

    // Handlers
    const handleAddMilestone = async (title, dueDate) => {
        const userId = getUserId();
        if (!userId) return;

        try {
            const response = await axios.post(`http://localhost:1000/api/v3/projects/${projectId}/milestones`, {
                title,
                dueDate,
                createdBy: userId
            });
            setMilestones([response.data, ...milestones]);
        } catch (err) {
            alert('Failed to add milestone');
        }
    };

    const handleToggleMilestone = async (milestoneId, isCompleted) => {
        try {
            const response = await axios.put(`http://localhost:1000/api/v3/milestones/${milestoneId}`, {
                isCompleted
            });

            setMilestones(milestones.map(m =>
                m._id === milestoneId ? response.data : m
            ));
        } catch (err) {
            alert('Failed to update milestone');
        }
    };

    const handleDeleteMilestone = async (milestoneId) => {
        if (!window.confirm('Delete this milestone?')) return;

        try {
            await axios.delete(`http://localhost:1000/api/v3/milestones/${milestoneId}`);
            setMilestones(milestones.filter(m => m._id !== milestoneId));
        } catch (err) {
            alert('Failed to delete milestone');
        }
    };

    if (loading) return <div className="loading-text">Loading project overview...</div>;
    if (error) return <div className="error-text">{error}</div>;

    return (
        <div className="overview-container">
            <ProgressBar
                progress={progress}
                total={totalMilestones}
                completed={completedMilestones}
            />

            <div className="overview-grid">
                <MilestoneList
                    milestones={milestones}
                    onAdd={handleAddMilestone}
                    onToggle={handleToggleMilestone}
                    onDelete={handleDeleteMilestone}
                />

                <Timeline milestones={milestones} />
            </div>
        </div>
    );
};

export default Overview;
