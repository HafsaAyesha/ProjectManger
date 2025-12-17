import React from 'react';
import '../../styles/kanban.css';

const TaskCard = ({ task }) => {
    // Format date: DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
    };

    return (
        <div className="task-card">
            <span className={`task-priority ${task.priority}`}>
                {task.priority}
            </span>

            <h3 className="task-title">{task.title}</h3>

            <p className="task-description">
                {task.description}
            </p>

            <div className="task-tags">
                {task.tags && task.tags.map((tag, index) => (
                    <span key={index} className="task-tag">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="task-meta">
                <span className="task-due-date">{formatDate(task.dueDate)}</span>
                <span className="task-assignee">{task.assignee}</span>
                {/* Placeholder for comments count or story points as per design example */}
                <span className="task-points" style={{ fontWeight: 'bold' }}>35</span>
            </div>
        </div>
    );
};

export default TaskCard;
