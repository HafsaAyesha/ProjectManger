import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProgressMilestoneList from './Progress/ProgressMilestoneList';
import GanttChart from './Progress/GanttChart';
import { Card } from "../../../components/ui/card";
import './TabStyles.css';
import './ProgressTab.css';

const ProgressTab = ({ projectId, initialMilestones, onMilestoneChange, progressStats }) => {
    // Use local state for immediate UI updates, but sync with parent
    const [milestones, setMilestones] = useState(initialMilestones || []);
    const [loading, setLoading] = useState(!initialMilestones);

    // Sync local state when parent updates
    useEffect(() => {
        if (initialMilestones) {
            setMilestones(initialMilestones);
            setLoading(false);
        }
    }, [initialMilestones]);

    // Get current user ID
    const getUserId = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?._id;
    };

    const fetchMilestones = useCallback(async () => {
        // If we have parent sync, we might just want to trigger it? 
        // But for local actions like delete, we still need to know when it's done.
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:1000/api/v3/projects/${projectId}/milestones`);
            setMilestones(response.data);
            // Notify parent to update global stats
            if (onMilestoneChange) onMilestoneChange();
        } catch (err) {
            console.error('Error fetching milestones:', err);
        } finally {
            setLoading(false);
        }
    }, [projectId, onMilestoneChange]);

    useEffect(() => {
        fetchMilestones();
    }, [fetchMilestones]);

    // Handlers
    const handleAddMilestone = async (milestoneData) => {
        const userId = getUserId();
        if (!userId) return;

        try {
            // Support both old (title, dueDate) and new (object) signatures just in case,
            // though we are switching to object primarily.
            let payload = { createdBy: userId };

            if (typeof milestoneData === 'string') {
                // Legacy fallback
                payload.title = milestoneData;
            } else {
                payload = { ...payload, ...milestoneData };
            }

            const response = await axios.post(`http://localhost:1000/api/v3/projects/${projectId}/milestones`, payload);
            setMilestones([response.data, ...milestones]);
            if (onMilestoneChange) onMilestoneChange();
        } catch (err) {
            alert('Failed to add milestone');
        }
    };


    const handleUpdateMilestone = async (milestoneId, updates) => {
        try {
            const response = await axios.put(`http://localhost:1000/api/v3/milestones/${milestoneId}`, updates);

            setMilestones(milestones.map(m =>
                m._id === milestoneId ? response.data : m
            ));
            if (onMilestoneChange) onMilestoneChange();
        } catch (err) {
            alert('Failed to update milestone');
        }
    };

    const handleDeleteMilestone = async (milestoneId) => {
        if (!window.confirm('Delete this milestone?')) return;

        try {
            await axios.delete(`http://localhost:1000/api/v3/milestones/${milestoneId}`);
            setMilestones(milestones.filter(m => m._id !== milestoneId));
            if (onMilestoneChange) onMilestoneChange();
        } catch (err) {
            alert('Failed to delete milestone');
        }
    };

    if (loading) return <div className="tab-loading">Loading progress...</div>;


    return (
        <div className="progress-tab-container">
            <h2 className="tab-title">Progress Tracking</h2>



            <div className="space-y-6">
                <Card className="p-6">
                    <GanttChart milestones={milestones} />
                </Card>

                <Card className="p-6">
                    <ProgressMilestoneList
                        milestones={milestones}
                        onAdd={handleAddMilestone}
                        onUpdate={handleUpdateMilestone}
                        onDelete={handleDeleteMilestone}
                    />
                </Card>
            </div>
        </div>
    );
};

export default ProgressTab;
