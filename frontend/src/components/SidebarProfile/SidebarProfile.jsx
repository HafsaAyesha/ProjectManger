import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SidebarProfile.css';

const SidebarProfile = ({ user }) => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    if (!user) return null;

    return (
        <div className="sidebar-profile" onClick={handleProfileClick} title="View Profile">
            <div className="profile-avatar-container">
                {user.profile?.avatar ? (
                    <img src={user.profile.avatar} alt="Profile" className="sidebar-avatar" />
                ) : (
                    <div className="sidebar-avatar-placeholder">
                        {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                )}
            </div>
            <div className="profile-info">
                <div className="profile-name">{user.username}</div>
                <div className="profile-title">{user.profile?.title || 'Freelancer'}</div>
            </div>
            <div className="profile-arrow">
                <i className="fas fa-chevron-right"></i>
            </div>
        </div>
    );
};

export default SidebarProfile;
