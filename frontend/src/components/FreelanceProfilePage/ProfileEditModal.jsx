import React, { useState, useEffect } from 'react';
import './ProfileEditModal.css';

const ProfileEditModal = ({ isOpen, onClose, formData, onSave, handleChange }) => {
    const [localData, setLocalData] = useState(formData);

    useEffect(() => {
        setLocalData(formData);
    }, [formData, isOpen]);

    const handleLocalChange = (e) => {
        setLocalData({ ...localData, [e.target.name]: e.target.value });
    };

    const handleSaveClick = () => {
        onSave(localData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Edit Profile</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" value={localData.name || ''} onChange={handleLocalChange} />
                    </div>
                    <div className="form-group">
                        <label>Professional Title</label>
                        <input type="text" name="title" value={localData.title || ''} onChange={handleLocalChange} />
                    </div>
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea name="bio" value={localData.bio || ''} onChange={handleLocalChange} rows="4"></textarea>
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="text" name="phone" value={localData.phone || ''} onChange={handleLocalChange} />
                    </div>
                    <div className="form-group">
                        <label>Hourly Rate</label>
                        <input type="number" name="hourlyRate" value={localData.hourlyRate || ''} onChange={handleLocalChange} />
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-save" onClick={handleSaveClick}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditModal;
