import React from 'react';
import './ExperienceSection.css';

const ExperienceSection = ({ experience, editMode, onAdd, onSave, onDelete, handleChange }) => {
    // We can manage local state for new items if we want, but if the parent handles the "formData", 
    // we need to know if we are editing *this* specific section.
    // The prompt implies granular edits.
    // "onAdd", "onEdit", "onDelete".

    // For inline editing as per original design:
    // We iterate over experiences. If editMode is true, we show inputs.

    // But wait, the original design had a global "editExperience" toggle.
    // If we want granular rows, we might need local state for which row is being edited.
    // For now, I'll stick to the "Edit Section" pattern from the original file where the whole section enters edit mode.

    return (
        <div className="profile-card">
            <div className="card-header-row">
                <h3>Work Experience</h3>
                <div className="header-actions">
                    {editMode && <button className="btn-add-section-mini" onClick={onAdd}>
                        <i className="fas fa-plus"></i> Add
                    </button>}
                    <button
                        className="btn-icon-edit"
                        onClick={onSave} // This acts as Toggle Edit / Save
                    >
                        <i className={`fas ${editMode ? 'fa-save' : 'fa-pen'}`}></i>
                    </button>
                </div>
            </div>
            <div className="timeline-list">
                {(experience || []).map((exp, index) => (
                    <div key={index} className="timeline-item">
                        {editMode ? (
                            <div className="edit-group">
                                <input type="text" placeholder="Job Title" value={exp.title} onChange={(e) => handleChange(index, 'title', e.target.value)} />
                                <input type="text" placeholder="Company" value={exp.company} onChange={(e) => handleChange(index, 'company', e.target.value)} />
                                <input type="text" placeholder="Years (e.g. 2020-2022)" value={exp.year} onChange={(e) => handleChange(index, 'year', e.target.value)} />
                                <textarea placeholder="Description" value={exp.description} onChange={(e) => handleChange(index, 'description', e.target.value)} />
                                <button className="btn-delete-item" onClick={() => onDelete(index)}>Delete</button>
                            </div>
                        ) : (
                            <>
                                <div className="timeline-icon">
                                    <i className="fas fa-briefcase"></i>
                                </div>
                                <div className="timeline-content">
                                    <h4>{exp.title}</h4>
                                    <span className="timeline-date">{exp.company} | {exp.year}</span>
                                    <p>{exp.description}</p>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {(!experience || experience.length === 0) && !editMode && (
                    <p className="section-empty-message">No experience added.</p>
                )}
            </div>
        </div>
    );
};

export default ExperienceSection;
