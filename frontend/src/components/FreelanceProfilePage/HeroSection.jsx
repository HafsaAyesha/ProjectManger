import React from 'react';
import './HeroSection.css';

const HeroSection = ({ user, formData, editHeader, setEditHeader, handleChange, handleSave }) => {
    return (
        <div className="profile-header-card">
            <div className="header-bg"></div>
            <div className="header-info-row">
                {/* Avatar & Basic Info */}
                <div className="header-left-group">
                    <div className="profile-avatar-large">
                        {formData.avatar ? (
                            <img src={formData.avatar} alt="Profile" />
                        ) : (
                            <div className="avatar-placeholder-large">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        {editHeader && (
                            <>
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (file.size > 5 * 1024 * 1024) {
                                                alert("Image size should be less than 5MB");
                                                return;
                                            }
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                handleChange("avatar", reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <button className="btn-upload-avatar" onClick={() => document.getElementById('avatar-upload').click()}>
                                    <i className="fas fa-camera"></i>
                                </button>
                            </>
                        )}
                    </div>

                    <div className="header-text-group">
                        <div className="header-text-upper">
                            {/* Name on Purple Background */}
                            {editHeader ? (
                                <input
                                    type="text"
                                    className="input-name"
                                    value={formData.name || user?.username || ""}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="Full Name"
                                />
                            ) : (
                                <h1>{formData.name || user?.username || "Freelancer"}</h1>
                            )}
                        </div>

                        <div className="header-text-lower">
                            {/* Title below Purple Background */}
                            {editHeader ? (
                                <input
                                    type="text"
                                    className="input-title"
                                    value={formData.title || ""}
                                    onChange={(e) => handleChange("title", e.target.value)}
                                    placeholder="Professional Title"
                                />
                            ) : (
                                <h3>{formData.title || "No Title Set"}</h3>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    className={`btn-edit-section ${editHeader ? 'active' : ''}`}
                    onClick={() => editHeader ? handleSave('header') : setEditHeader(true)}
                >
                    <i className={`fas ${editHeader ? 'fa-save' : 'fa-pen'}`}></i> {editHeader ? 'Save' : 'Edit'}
                </button>
            </div>
        </div>
    );
};

export default HeroSection;
