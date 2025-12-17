import React from 'react';
import './PersonalInfoSection.css';

const PersonalInfoSection = ({ user, formData, editMode, setEditMode, handleChange, onSave }) => {
    return (
        <div className="personal-details-section">
            <div className="card-header-row" style={{ borderBottom: 'none', marginBottom: '10px', paddingBottom: 0 }}>
                <h4>Personal Details</h4>
                <button
                    className="btn-icon-edit"
                    onClick={() => editMode ? onSave() : setEditMode(true)}
                >
                    <i className={`fas ${editMode ? 'fa-save' : 'fa-pen'}`}></i>
                </button>
            </div>
            <div className="details-grid-mini">
                <div className="detail-item-mini">
                    <label>Email</label>
                    <p>{user?.email}</p>
                </div>
                <div className="detail-item-mini">
                    <label>Phone</label>
                    {editMode ? (
                        <input type="text" value={formData.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} />
                    ) : <p>{formData.phone || "-"}</p>}
                </div>
                <div className="detail-item-mini">
                    <label>Hourly Rate</label>
                    {editMode ? (
                        <input type="number" value={formData.hourlyRate || ""} onChange={(e) => handleChange("hourlyRate", e.target.value)} />
                    ) : <p>${formData.hourlyRate || 0}/hr</p>}
                </div>
            </div>
        </div>
    );
};

export default PersonalInfoSection;
