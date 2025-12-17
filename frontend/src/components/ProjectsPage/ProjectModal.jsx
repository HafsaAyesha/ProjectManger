import React, { useState, useEffect } from 'react';
import './ProjectModal.css';

const ProjectModal = ({ isOpen, onClose, onSubmit, project = null, mode = 'create' }) => {
    const [formData, setFormData] = useState({
        title: '',
        clientName: '',
        description: '',
        budget: '',
        deadline: '',
        tags: '',
        status: 'active'
    });

    const [errors, setErrors] = useState({});

    // Populate form for edit mode
    useEffect(() => {
        if (project && mode === 'edit') {
            setFormData({
                title: project.title || '',
                clientName: project.clientName || '',
                description: project.description || '',
                budget: project.budget || '',
                deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
                tags: project.tags?.join(', ') || '',
                status: project.status || 'active'
            });
        } else {
            // Reset for create mode
            setFormData({
                title: '',
                clientName: '',
                description: '',
                budget: '',
                deadline: '',
                tags: '',
                status: 'active'
            });
        }
        setErrors({});
    }, [project, mode, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        const projectData = {
            title: formData.title.trim(),
            clientName: formData.clientName.trim(),
            description: formData.description.trim(),
            budget: parseFloat(formData.budget) || 0,
            deadline: formData.deadline || null,
            tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : [],
            status: formData.status
        };

        onSubmit(projectData);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{mode === 'create' ? 'Create New Project' : 'Edit Project'}</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label htmlFor="title">Project Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={errors.title ? 'error' : ''}
                            placeholder="e.g., E-commerce Website"
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="clientName">Client Name *</label>
                        <input
                            type="text"
                            id="clientName"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleChange}
                            className={errors.clientName ? 'error' : ''}
                            placeholder="e.g., TechCorp Inc."
                        />
                        {errors.clientName && <span className="error-message">{errors.clientName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Project details and requirements..."
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="budget">Budget ($)</label>
                            <input
                                type="number"
                                id="budget"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="5000"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="deadline">Deadline</label>
                            <input
                                type="date"
                                id="deadline"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="on-hold">On Hold</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tags">Tags (comma-separated)</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB"
                        />
                        <small className="form-hint">Separate tags with commas</small>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit">
                            {mode === 'create' ? 'Create Project' : 'Update Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectModal;
