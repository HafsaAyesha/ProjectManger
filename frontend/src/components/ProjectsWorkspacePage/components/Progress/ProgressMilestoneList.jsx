import React, { useState } from 'react';
import ProgressMilestoneItem from './ProgressMilestoneItem';
import { Plus, CheckSquare } from 'lucide-react';
import '../Overview/Overview.css';
import './ProgressMilestone.css';

const ProgressMilestoneList = ({ milestones, onAdd, onUpdate, onDelete }) => {
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateSave = (id, draftData) => {
        onAdd(draftData);
        setIsCreating(false);
    };

    return (
        <div className="milestone-list-container">
            <div className="milestone-list-header">
                <div className="milestone-list-header-content">
                    <h3 className="milestone-list-title">Project Milestones</h3>
                    <p className="milestone-list-subtitle">Track key deliverables and deadlines</p>
                </div>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="btn-add milestone-new-btn"
                    >
                        <Plus size={16} /> New Milestone
                    </button>
                )}
            </div>

            {/* Creation Card */}
            {isCreating && (
                <div className="milestone-creation-card">
                    <ProgressMilestoneItem
                        milestone={{
                            title: '',
                            status: 'not_started',
                            checklist: [],
                            notes: '',
                            startDate: null,
                            dueDate: null
                        }}
                        isNew={true}
                        onUpdate={handleCreateSave}
                        onCancelCreate={() => setIsCreating(false)}
                    />
                </div>
            )}

            <div className="milestone-list-items">
                {milestones.length === 0 && !isCreating ? (
                    <div className="milestone-empty-state">
                        <div className="milestone-empty-icon">
                            <CheckSquare size={24} />
                        </div>
                        <h4 className="milestone-empty-title">No milestones yet</h4>
                        <p className="milestone-empty-text">Create your first milestone to start tracking progress.</p>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="milestone-empty-btn"
                        >
                            Create Milestone
                        </button>
                    </div>
                ) : (
                    milestones.map(ms => (
                        <ProgressMilestoneItem
                            key={ms._id}
                            milestone={ms}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProgressMilestoneList;