import React, { useState } from 'react';
import './Overview.css';

import MilestoneItem from './MilestoneItem';

const MilestoneList = ({ milestones, onAdd, onToggle, onDelete }) => {
    const [newTitle, setNewTitle] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;
        onAdd(newTitle, dueDate);
        setNewTitle('');
        setDueDate('');
    };

    return (
        <div className="milestone-section">
            <div className="section-header">
                <h3>Project Milestones</h3>
            </div>

            <form onSubmit={handleSubmit} className="add-milestone-form">
                <input
                    type="text"
                    placeholder="Add a new milestone..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="input-title"
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="input-date"
                />
                <button type="submit" className="btn-add" disabled={!newTitle.trim()}>
                    + Add
                </button>
            </form>

            <div className="milestone-container">
                {milestones.length === 0 ? (
                    <div className="empty-state">No milestones yet. Add one above!</div>
                ) : (
                    milestones.map((ms) => (
                        <MilestoneItem
                            key={ms._id}
                            milestone={ms}
                            onToggle={onToggle}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default MilestoneList;
