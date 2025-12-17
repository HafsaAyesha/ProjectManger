import React from 'react';
import './EducationSection.css';

const EducationSection = ({ education, editMode, onAdd, onSave, onDelete, handleChange }) => {
    return (
        <div className="profile-card">
            <div className="card-header-row">
                <h3>Education</h3>
                <div className="header-actions">
                    {editMode && <button className="btn-add-section-mini" onClick={onAdd}>
                        <i className="fas fa-plus"></i> Add
                    </button>}
                    <button
                        className="btn-icon-edit"
                        onClick={onSave}
                    >
                        <i className={`fas ${editMode ? 'fa-save' : 'fa-pen'}`}></i>
                    </button>
                </div>
            </div>
            <div className="timeline-list">
                {(education || []).map((edu, index) => (
                    <div key={index} className="timeline-item">
                        {editMode ? (
                            <div className="edit-group">
                                <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => handleChange(index, 'degree', e.target.value)} />
                                <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => handleChange(index, 'institution', e.target.value)} />
                                <input type="text" placeholder="Year" value={edu.year} onChange={(e) => handleChange(index, 'year', e.target.value)} />
                                <button className="btn-delete-item" onClick={() => onDelete(index)}>Delete</button>
                            </div>
                        ) : (
                            <>
                                <div className="timeline-icon edu-icon">
                                    <i className="fas fa-graduation-cap"></i>
                                </div>
                                <div className="timeline-content">
                                    <h4>{edu.degree}</h4>
                                    <span className="timeline-date">{edu.institution} | {edu.year}</span>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {(!education || education.length === 0) && !editMode && (
                    <p className="section-empty-message">No education added.</p>
                )}
            </div>
        </div>
    );
};

export default EducationSection;
