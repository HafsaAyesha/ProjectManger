import React from 'react';
import TaskCard from './TaskCard';
import '../../styles/kanban.css';

const KanbanColumn = ({ title, status, tasks, onAddTask }) => {
    return (
        <div className="kanban-column">
            <div className="kanban-column-header">
                <span className="kanban-column-title">{title}</span>
                <span className="kanban-column-count">{tasks.length}</span>
            </div>

            <div className="kanban-task-list">
                {tasks.map(task => (
                    // In a real generic list, we'd pass an onClick or similar to edit
                    <TaskCard key={task._id || task.id} task={task} />
                ))}
            </div>

            <button
                className="add-task-btn-column"
                onClick={() => onAddTask(status)}
            >
                +
            </button>
        </div>
    );
};

export default KanbanColumn;
