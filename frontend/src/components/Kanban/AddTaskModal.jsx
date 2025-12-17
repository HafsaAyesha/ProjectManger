import React, { useState, useEffect } from 'react';
import '../../styles/kanban.css';

const AddTaskModal = ({ isOpen, onClose, onSave, initialStatus }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        status: initialStatus || 'backlog',
        assignee: '',
        dueDate: '',
        tags: ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({ ...prev, status: initialStatus || 'backlog' }));
        }
    }, [isOpen, initialStatus]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        onSave(taskData);
        // Reset form or controlled by parent closing
        setFormData({
            title: '',
            description: '',
            priority: 'medium',
            status: 'backlog',
            assignee: '',
            dueDate: '',
            tags: ''
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Task</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Task Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Fix authentication bug"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Task details..."
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleChange}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="backlog">Backlog</option>
                                <option value="todo">To Do</option>
                                <option value="inprogress">In Progress</option>
                                <option value="review">Review</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Assignee</label>
                        <input
                            type="text"
                            name="assignee"
                            value={formData.assignee}
                            onChange={handleChange}
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="form-group">
                        <label>Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Tags (comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="bug, frontend, urgent"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-tertiary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
