import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Edit2, Save, Trash2, Plus, CheckSquare, MessageSquare, Calendar } from 'lucide-react';
import '../Overview/Overview.css';
import './ProgressMilestone.css';

const ProgressMilestoneItem = ({ milestone, onUpdate, onDelete, isNew = false, onCancelCreate }) => {
    // Mode State
    const [isEditing, setIsEditing] = useState(isNew);
    const [isExpanded, setIsExpanded] = useState(isNew);

    // Draft State (Local changes)
    const [draft, setDraft] = useState({ ...milestone });

    // Reset draft when milestone prop updates (unless currently editing)
    useEffect(() => {
        if (!isEditing) {
            setDraft({ ...milestone });
        }
    }, [milestone, isEditing]);

    // Helpers
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'status-completed';
            case 'in_progress':
                return 'status-in-progress';
            default:
                return 'status-not-started';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'in_progress':
                return 'In Progress';
            default:
                return 'Not Started';
        }
    };

    // --- Draft Handlers (Edit Mode) ---
    const updateDraft = (field, value) => {
        setDraft(prev => ({ ...prev, [field]: value }));
    };

    const handleChecklistToggle = (idx) => {
        const newChecklist = [...(draft.checklist || [])];
        newChecklist[idx] = { ...newChecklist[idx], isCompleted: !newChecklist[idx].isCompleted };
        updateDraft('checklist', newChecklist);
    };

    const handleChecklistAdd = () => {
        const newChecklist = [...(draft.checklist || []), { text: 'New Item', isCompleted: false }];
        updateDraft('checklist', newChecklist);
    };

    const handleChecklistTextChange = (idx, text) => {
        const newChecklist = [...(draft.checklist || [])];
        newChecklist[idx].text = text;
        updateDraft('checklist', newChecklist);
    };

    const handleChecklistDelete = (idx) => {
        const newChecklist = draft.checklist.filter((_, i) => i !== idx);
        updateDraft('checklist', newChecklist);
    };

    // --- Actions ---
    const handleSave = () => {
        if (!draft.title.trim()) {
            alert("Title is required");
            return;
        }
        onUpdate(milestone._id, draft);
        if (!isNew) setIsEditing(false);
    };

    const handleCancel = () => {
        if (isNew) {
            onCancelCreate();
        } else {
            setDraft({ ...milestone });
            setIsEditing(false);
        }
    };

    // --- Renderers ---
    // 1. View Mode Header
    const renderViewHeader = () => (
        <div className="milestone-view-header">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="milestone-expand-btn"
            >
                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            <div className="milestone-header-content">
                <div className="milestone-title-row">
                    <h4 className="milestone-title">{milestone.title}</h4>
                    <span className={`milestone-status-badge ${getStatusColor(milestone.status)}`}>
                        {getStatusLabel(milestone.status)}
                    </span>
                </div>
                <div className="milestone-meta">
                    <span className="milestone-meta-item">
                        <Calendar size={12} />
                        {milestone.startDate ? new Date(milestone.startDate).toLocaleDateString() : 'No Start Date'}
                        {' - '}
                        {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'No Due Date'}
                    </span>
                    {milestone.checklist?.length > 0 && (
                        <span className="milestone-meta-item">
                            <CheckSquare size={12} />
                            {milestone.checklist.filter(i => i.isCompleted).length}/{milestone.checklist.length} Tasks
                        </span>
                    )}
                </div>
            </div>
            <div className="milestone-actions">
                <button
                    onClick={() => setIsEditing(true)}
                    className="milestone-edit-btn"
                    title="Edit Milestone"
                >
                    <Edit2 size={16} />
                </button>
            </div>
        </div>
    );

    // 2. Edit Mode Header (Title & Status)
    const renderEditHeader = () => (
        <div className="milestone-edit-header">
            <div className="milestone-edit-title-section">
                <h4 className="milestone-edit-label">
                    {isNew ? 'Create New Milestone' : 'Editing Milestone'}
                </h4>
            </div>
            <div className="milestone-edit-fields">
                <div className="milestone-field-group milestone-field-title">
                    <label className="milestone-field-label">Title</label>
                    <input
                        type="text"
                        value={draft.title}
                        onChange={(e) => updateDraft('title', e.target.value)}
                        className="input-title"
                        placeholder="Milestone Title"
                        autoFocus
                    />
                </div>
                <div className="milestone-field-group milestone-field-status">
                    <label className="milestone-field-label">Status</label>
                    <select
                        value={draft.status || 'not_started'}
                        onChange={(e) => updateDraft('status', e.target.value)}
                        className="milestone-select"
                    >
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>
        </div>
    );

    // 3. Expanded Content (View Mode - Read Only Details)
    const renderViewBody = () => (
        <div className="milestone-view-body">
            <div className="milestone-content-grid">
                {/* Checklist View */}
                <div className="milestone-section-block">
                    <div className="milestone-section-header">
                        <CheckSquare size={16} className="milestone-section-icon" />
                        <h5 className="milestone-section-title">Deliverables / Tasks</h5>
                    </div>
                    <div className="milestone-checklist-view">
                        {(!milestone.checklist || milestone.checklist.length === 0) ? (
                            <span className="empty-state">No checklist items.</span>
                        ) : (
                            milestone.checklist.map((item, idx) => (
                                <div key={idx} className="milestone-checklist-item-view">
                                    <div className={`ms-checkbox ${item.isCompleted ? 'checked' : ''}`}>
                                        {item.isCompleted && <span>✓</span>}
                                    </div>
                                    <span className={item.isCompleted ? 'milestone-item-completed' : 'milestone-item-text'}>
                                        {item.text}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Notes View */}
                <div className="milestone-section-block">
                    <div className="milestone-section-header">
                        <MessageSquare size={16} className="milestone-section-icon milestone-icon-purple" />
                        <h5 className="milestone-section-title">Notes</h5>
                    </div>
                    <div className="milestone-notes-view">
                        {milestone.notes ? (
                            <p className="milestone-notes-text">{milestone.notes}</p>
                        ) : (
                            <span className="empty-state">No notes added.</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Actions (Delete) */}
            <div className="milestone-footer-actions">
                <button
                    onClick={() => onDelete(milestone._id)}
                    className="btn-delete-ms milestone-delete-btn"
                >
                    <Trash2 size={12} />
                    Delete Milestone
                </button>
            </div>
        </div>
    );

    // 4. Edit Body (Full Form)
    const renderEditBody = () => (
        <div className="milestone-edit-body">
            <div className="milestone-date-row">
                <div className="milestone-field-group">
                    <label className="milestone-field-label">Start Date</label>
                    <input
                        type="date"
                        value={draft.startDate ? new Date(draft.startDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => updateDraft('startDate', e.target.value)}
                        className="input-date"
                    />
                </div>
                <div className="milestone-field-group">
                    <label className="milestone-field-label">Due Date</label>
                    <input
                        type="date"
                        value={draft.dueDate ? new Date(draft.dueDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => updateDraft('dueDate', e.target.value)}
                        className="input-date"
                    />
                </div>
            </div>

            <div className="milestone-content-grid">
                {/* Checklist Editor */}
                <div className="milestone-section-block">
                    <div className="milestone-edit-section-header">
                        <label className="milestone-field-label">Checklist</label>
                        <button
                            onClick={handleChecklistAdd}
                            type="button"
                            className="milestone-add-item-btn"
                        >
                            <Plus size={12} />
                            Add Item
                        </button>
                    </div>
                    <div className="milestone-checklist-edit">
                        {draft.checklist && draft.checklist.map((item, idx) => (
                            <div key={idx} className="milestone-checklist-item-edit">
                                <input
                                    type="checkbox"
                                    checked={item.isCompleted}
                                    onChange={() => handleChecklistToggle(idx)}
                                    className="milestone-checkbox-input"
                                />
                                <input
                                    type="text"
                                    value={item.text}
                                    onChange={(e) => handleChecklistTextChange(idx, e.target.value)}
                                    className="milestone-item-input"
                                    placeholder="Task description..."
                                />
                                <button
                                    onClick={() => handleChecklistDelete(idx)}
                                    className="milestone-item-delete-btn"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        {(!draft.checklist || draft.checklist.length === 0) && (
                            <div className="empty-state milestone-empty-checklist">
                                No items. Click "Add Item" to start.
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes Editor */}
                <div className="milestone-section-block">
                    <label className="milestone-field-label">Notes</label>
                    <textarea
                        value={draft.notes || ''}
                        onChange={(e) => updateDraft('notes', e.target.value)}
                        className="milestone-notes-textarea"
                        placeholder="Add notes, feedback, or reminders here..."
                    />
                </div>
            </div>

            {/* Footer Actions (Save/Cancel) */}
            <div className="milestone-edit-actions">
                <button
                    onClick={handleCancel}
                    className="milestone-cancel-btn"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="btn-add milestone-save-btn"
                >
                    <Save size={16} />
                    {isNew ? 'Create Milestone' : 'Save Changes'}
                </button>
            </div>
        </div>
    );

    return (
        <div className={`milestone-card ${isEditing ? 'milestone-editing' : ''}`}>
            {/* View Mode */}
            {!isEditing && (
                <>
                    {renderViewHeader()}
                    {isExpanded && renderViewBody()}
                </>
            )}

            {/* Edit Mode */}
            {isEditing && (
                <>
                    {renderEditHeader()}
                    {renderEditBody()}
                </>
            )}
        </div>
    );
};

export default ProgressMilestoneItem;