import React from 'react';
import './Overview.css';

const MilestoneItem = ({ milestone, onToggle, onDelete }) => {
    return (
        <div className={`milestone-row ${milestone.isCompleted ? 'completed' : ''}`}>
            <div className="ms-checkbox-wrapper" onClick={() => onToggle(milestone._id, !milestone.isCompleted)}>
                <div className={`ms-checkbox ${milestone.isCompleted ? 'checked' : ''}`}>
                    {milestone.isCompleted && '✓'}
                </div>
            </div>
            <div className="ms-details">
                <span className="ms-title">{milestone.title}</span>
                {milestone.dueDate && (
                    <span className="ms-due">Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                )}
            </div>
            <button onClick={() => onDelete(milestone._id)} className="btn-delete-ms" title="Delete">×</button>
        </div>
    );
};

export default MilestoneItem;
