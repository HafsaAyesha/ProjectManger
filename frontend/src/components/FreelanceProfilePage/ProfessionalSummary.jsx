import React from 'react';
import './ProfessionalSummary.css';

const ProfessionalSummary = ({ formData, editMode, setEditMode, handleChange, onSave }) => {
    return (
        <div className="bio-section">
            <div className="card-header-row" style={{ borderBottom: 'none', marginBottom: '10px', paddingBottom: 0 }}>
                <h4>Professional Summary</h4>
                <button
                    className="btn-icon-edit"
                    onClick={() => editMode ? onSave() : setEditMode(true)}
                >
                    <i className={`fas ${editMode ? 'fa-save' : 'fa-pen'}`}></i>
                </button>
            </div>
            {editMode ? (
                <textarea
                    className="summary-textarea"
                    value={formData.bio || ""}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    placeholder="Write a brief professional bio..."
                />
            ) : (
                <p className="bio-text">{formData.bio || "No professional summary added yet."}</p>
            )}
        </div>
    );
};

export default ProfessionalSummary;
