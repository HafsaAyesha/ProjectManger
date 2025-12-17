import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Edit2, Save, X, Trash2 } from 'lucide-react';
import './TabStyles.css';
import './DetailsTab.css';

const DetailsTab = ({ project, onUpdate }) => {
    // Extension Details (Scope, Reqs, etc.)
    const [details, setDetails] = useState({
        requirements: '',
        scope: '',
        deliverables: [],
        clientInfo: { email: '', phone: '', company: '', location: '', notes: '', communicationLog: [] }
    });

    // Loading & UI State
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State (Initialized when entering edit mode)
    const [editForm, setEditForm] = useState(null);

    // Log state
    const [newLog, setNewLog] = useState({ type: 'email', summary: '', date: '' });
    const [showLogForm, setShowLogForm] = useState(false);

    // Fetch details
    const fetchDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:1000/api/v3/projects/${project._id}/details`);
            if (response.data) {
                // Merge existsing data with potential nulls
                setDetails(prev => ({ ...prev, ...response.data }));
            }
        } catch (err) {
            console.error('Error fetching details:', err);
        } finally {
            setLoading(false);
        }
    }, [project._id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleEdit = () => {
        // Initialize form with BOTH Project Core data AND Extension details
        setEditForm({
            // Core Project Fields
            title: project.title || '',
            clientName: project.clientName || '',
            status: project.status || 'active',
            deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
            budget: project.budget || '',

            // Extension Fields
            scope: details.scope || '',
            requirements: details.requirements || '',
            // Initialize deliverables for edit mode - ensure they are objects
            deliverables: details.deliverables.map(d =>
                typeof d === 'string' ? { text: d, isCompleted: false } : d
            ),
            clientInfo: { ...details.clientInfo }
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm(null);
    };

    const handleSave = async () => {
        try {
            // 1. Update Core Project Data
            const coreUpdatePromise = axios.put(`http://localhost:1000/api/v3/projects/${project._id}`, {
                id: project.createdBy, // Required by backend for auth/verification
                title: editForm.title,
                clientName: editForm.clientName,
                status: editForm.status,
                deadline: editForm.deadline,
                budget: parseFloat(editForm.budget) || 0
            });

            // 2. Update Extension Data
            const extensionData = {
                scope: editForm.scope,
                requirements: editForm.requirements,
                deliverables: editForm.deliverables.filter(d => d.text.trim()), // Filter empty
                clientInfo: editForm.clientInfo
            };
            const extensionUpdatePromise = axios.put(`http://localhost:1000/api/v3/projects/${project._id}/details`, extensionData);

            // Execute both
            const [, extensionResponse] = await Promise.all([coreUpdatePromise, extensionUpdatePromise]);

            setDetails(extensionResponse.data);
            setIsEditing(false);

            // Trigger parent refresh to update Title/Client Name in header/overview
            if (onUpdate) onUpdate();

        } catch (err) {
            console.error('Error saving details:', err);
            alert('Failed to save details. Please try again.');
        }
    };

    const handleAddLog = async (e) => {
        e.preventDefault();
        if (!newLog.summary) return;

        try {
            const updatedLog = [...(details.clientInfo?.communicationLog || []), {
                ...newLog,
                date: newLog.date || new Date()
            }];

            const updateData = {
                clientInfo: {
                    ...details.clientInfo,
                    communicationLog: updatedLog
                }
            };

            const response = await axios.put(`http://localhost:1000/api/v3/projects/${project._id}/details`, updateData);
            setDetails(response.data);
            setNewLog({ type: 'email', summary: '', date: '' });
            setShowLogForm(false);
        } catch (err) {
            console.error('Error adding log:', err);
            alert('Failed to add log');
        }
    };

    // Checklist Handlers
    const toggleDeliverable = async (index) => {
        if (isEditing) return; // Only toggle in view mode for now, or edit mode state? Assuming View Mode toggle.

        const newDeliverables = [...details.deliverables];
        // Handle string migration on the fly if needed, though fetchDetails should ideally normalize it.
        // But for safety:
        const item = newDeliverables[index];
        if (typeof item === 'string') {
            newDeliverables[index] = { text: item, isCompleted: true };
        } else {
            newDeliverables[index] = { ...item, isCompleted: !item.isCompleted };
        }

        // Optimistic update
        setDetails(prev => ({ ...prev, deliverables: newDeliverables }));

        try {
            await axios.put(`http://localhost:1000/api/v3/projects/${project._id}/details`, {
                deliverables: newDeliverables
            });
        } catch (err) {
            console.error('Error updating task:', err);
            // Revert on error
            fetchDetails();
        }
    };

    // Edit Mode Checklist Helpers
    const updateEditDeliverable = (index, text) => {
        const newDels = [...editForm.deliverables];
        newDels[index] = { ...newDels[index], text };
        setEditForm({ ...editForm, deliverables: newDels });
    };

    const addEditDeliverable = () => {
        setEditForm({
            ...editForm,
            deliverables: [...editForm.deliverables, { text: '', isCompleted: false }]
        });
    };

    const removeEditDeliverable = (index) => {
        const newDels = editForm.deliverables.filter((_, i) => i !== index);
        setEditForm({ ...editForm, deliverables: newDels });
    };

    if (loading) return <div className="tab-loading">Loading details...</div>;

    return (
        <div className="details-tab">
            <div className="tab-header-row">
                <h2 className="tab-title">Project Knowledge Hub</h2>
                {!isEditing && (
                    <button onClick={handleEdit} className="btn-edit-details">
                        <Edit2 size={16} /> Edit Scope & Info
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="edit-details-form">
                    {/* --- CORE PROJECT EDITING --- */}
                    <div className="edit-section-header">Core Project Details</div>
                    <div className="form-group">
                        <label className="form-label">Project Title</label>
                        <input
                            type="text"
                            value={editForm.title}
                            onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                            className="form-input text-lg font-medium"
                        />
                    </div>

                    <div className="form-row-multi">
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                value={editForm.status}
                                onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                                className="form-select"
                            >
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Deadline</label>
                            <input
                                type="date"
                                value={editForm.deadline}
                                onChange={e => setEditForm({ ...editForm, deadline: e.target.value })}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Budget ($)</label>
                            <input
                                type="number"
                                value={editForm.budget}
                                onChange={e => setEditForm({ ...editForm, budget: e.target.value })}
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* --- CLIENT INFO EDITING --- */}
                    <div className="edit-section-header">Client Information</div>
                    <div className="form-group">
                        <label className="form-label">Client Name</label>
                        <input
                            type="text"
                            value={editForm.clientName}
                            onChange={e => setEditForm({ ...editForm, clientName: e.target.value })}
                            className="form-input"
                        />
                    </div>
                    <div className="form-row-multi">
                        <div className="form-group">
                            <label className="form-label">Client Email</label>
                            <input
                                type="email"
                                value={editForm.clientInfo?.email || ''}
                                onChange={e => setEditForm({
                                    ...editForm,
                                    clientInfo: { ...editForm.clientInfo, email: e.target.value }
                                })}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="text"
                                value={editForm.clientInfo?.phone || ''}
                                onChange={e => setEditForm({
                                    ...editForm,
                                    clientInfo: { ...editForm.clientInfo, phone: e.target.value }
                                })}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-row-multi">
                        <div className="form-group">
                            <label className="form-label">Company / Organization</label>
                            <input
                                type="text"
                                value={editForm.clientInfo?.company || ''}
                                onChange={e => setEditForm({
                                    ...editForm,
                                    clientInfo: { ...editForm.clientInfo, company: e.target.value }
                                })}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <input
                                type="text"
                                value={editForm.clientInfo?.location || ''}
                                onChange={e => setEditForm({
                                    ...editForm,
                                    clientInfo: { ...editForm.clientInfo, location: e.target.value }
                                })}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Client Notes / Preferences</label>
                        <textarea
                            value={editForm.clientInfo?.notes || ''}
                            onChange={e => setEditForm({
                                ...editForm,
                                clientInfo: { ...editForm.clientInfo, notes: e.target.value }
                            })}
                            className="form-textarea"
                            rows="2"
                        />
                    </div>

                    {/* --- DETAILS EDITING --- */}
                    <div className="edit-section-header">Project Scope & Deliverables</div>
                    <div className="form-group">
                        <label className="form-label">Scope of Work</label>
                        <textarea
                            value={editForm.scope}
                            onChange={e => setEditForm({ ...editForm, scope: e.target.value })}
                            placeholder="Define the project scope..."
                            className="form-textarea"
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Requirements</label>
                        <textarea
                            value={editForm.requirements}
                            onChange={e => setEditForm({ ...editForm, requirements: e.target.value })}
                            placeholder="List functional and non-functional requirements..."
                            className="form-textarea"
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Deliverables Checklist</label>
                        <div className="deliverables-list">
                            {editForm.deliverables.map((item, idx) => (
                                <div key={idx} className="checklist-item">
                                    <div className="checklist-edit-row">
                                        <input
                                            type="text"
                                            value={item.text}
                                            onChange={(e) => updateEditDeliverable(idx, e.target.value)}
                                            className="checklist-input"
                                            placeholder="Deliverable item..."
                                        />
                                        <button onClick={() => removeEditDeliverable(idx)} className="btn-icon">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addEditDeliverable} className="btn-add-item">
                                + Add Deliverable
                            </button>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button onClick={handleCancel} className="btn-cancel">
                            <X size={16} /> Cancel
                        </button>
                        <button onClick={handleSave} className="btn-save">
                            <Save size={16} /> Save Changes
                        </button>
                    </div>
                </div>
            ) : (
                <div className="details-view-grid">
                    {/* Column 1: Client & Communication */}
                    <div className="details-col-left">
                        <div className="info-card client-card">
                            <div className="card-header">
                                <h3>Client Profile</h3>
                            </div>
                            <div className="info-grid">
                                <div className="info-row">
                                    <span className="info-label">Name</span>
                                    <span className="info-value highlight">{project.clientName}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Company</span>
                                    <span className="info-value">{details.clientInfo?.company || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Email</span>
                                    {details.clientInfo?.email ? (
                                        <a href={`mailto:${details.clientInfo.email}`} className="info-value link">{details.clientInfo.email}</a>
                                    ) : <span className="info-value">N/A</span>}
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Phone</span>
                                    <span className="info-value">{details.clientInfo?.phone || 'N/A'}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Location</span>
                                    <span className="info-value">{details.clientInfo?.location || 'N/A'}</span>
                                </div>
                            </div>
                            {details.clientInfo?.notes && (
                                <div className="client-notes mt-2">
                                    <span className="info-label">Notes:</span>
                                    <p className="notes-text">{details.clientInfo.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="info-card">
                            <div className="card-header">
                                <h3>Project Core</h3>
                            </div>
                            <div className="info-grid">
                                <div className="info-row">
                                    <span className="info-label">Title</span>
                                    <span className="info-value">{project.title}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Status</span>
                                    <span className={`status-badge status-${project.status}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Deadline</span>
                                    <span className="info-value">
                                        {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'None'}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Budget</span>
                                    <span className="info-value">
                                        {project.budget ? `$${project.budget.toLocaleString()}` : 'Not set'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="communication-log-section">
                            <div className="log-header">
                                <h3>Communication Log</h3>
                                <button onClick={() => setShowLogForm(!showLogForm)} className="btn-add-log">
                                    {showLogForm ? 'Cancel' : '+ Log'}
                                </button>
                            </div>

                            {showLogForm && (
                                <form onSubmit={handleAddLog} className="log-form">
                                    <select
                                        value={newLog.type}
                                        onChange={(e) => setNewLog({ ...newLog, type: e.target.value })}
                                        className="form-select"
                                    >
                                        <option value="email">Email</option>
                                        <option value="call">Call</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Summary..."
                                        value={newLog.summary}
                                        onChange={(e) => setNewLog({ ...newLog, summary: e.target.value })}
                                        className="form-input"
                                        required
                                    />
                                    <input
                                        type="date"
                                        value={newLog.date}
                                        onChange={(e) => setNewLog({ ...newLog, date: e.target.value })}
                                        className="form-input"
                                    />
                                    <button type="submit" className="btn-save-log">Save</button>
                                </form>
                            )}

                            <div className="log-list">
                                {details.clientInfo?.communicationLog && details.clientInfo.communicationLog.length > 0 ? (
                                    [...details.clientInfo.communicationLog]
                                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                                        .map((log, i) => (
                                            <div key={i} className={`log-item ${log.type}`}>
                                                <div className="log-icon" style={{ fontSize: '0.9rem', width: '20px' }}>
                                                    {log.type === 'email' && '✉️'}
                                                    {log.type === 'call' && '📞'}
                                                    {log.type === 'meeting' && '📅'}
                                                    {log.type === 'other' && '📝'}
                                                </div>
                                                <div className="log-content">
                                                    <span className="log-date">{new Date(log.date).toLocaleDateString()}</span>
                                                    <p className="log-summary">{log.summary}</p>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="empty-logs">No communication logged.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Scope & Reqs */}
                    <div className="details-col-right">
                        <div className="detail-block">
                            <div className="block-header">
                                <h3>Scope of Work</h3>
                            </div>
                            <div className="block-content">
                                {details.scope ? (
                                    <p className="whitespace-pre-wrap">{details.scope}</p>
                                ) : (
                                    <em className="placeholder-text">No scope defined.</em>
                                )}
                            </div>
                        </div>

                        <div className="detail-block">
                            <div className="block-header">
                                <h3>Requirements</h3>
                            </div>
                            <div className="block-content">
                                {details.requirements ? (
                                    <p className="whitespace-pre-wrap">{details.requirements}</p>
                                ) : (
                                    <em className="placeholder-text">No requirements defined.</em>
                                )}
                            </div>
                        </div>

                        <div className="detail-block">
                            <div className="block-header">
                                <h3>Deliverables Checklist</h3>
                            </div>
                            <div className="block-content">
                                {details.deliverables && details.deliverables.length > 0 ? (
                                    <div className="deliverables-list">
                                        {details.deliverables.map((item, idx) => {
                                            const isString = typeof item === 'string';
                                            const text = isString ? item : item.text;
                                            const isCompleted = isString ? false : item.isCompleted;

                                            return (
                                                <div key={idx} className="checklist-item" onClick={() => toggleDeliverable(idx)}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isCompleted}
                                                        readOnly
                                                        className="checklist-checkbox"
                                                    />
                                                    <span className={`checklist-text ${isCompleted ? 'completed' : ''}`}>
                                                        {text}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <em className="placeholder-text">No deliverables listed.</em>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailsTab;
