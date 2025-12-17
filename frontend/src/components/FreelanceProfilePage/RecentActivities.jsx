import React from 'react';
import './RecentActivities.css';

const RecentActivities = ({ activities }) => {
    return (
        <div className="dash-card">
            <h3>Recent Activity</h3>
            <div className="activity-feed">
                {activities && activities.length > 0 ? activities.map(act => (
                    <div key={act.id} className="activity-item">
                        <div className={`activity-icon bg-${act.color}`}>
                            <i className={`fas ${act.icon}`}></i>
                        </div>
                        <div className="activity-details">
                            <p><strong>{act.action}</strong>: {act.target}</p>
                            <small>{act.time}</small>
                        </div>
                    </div>
                )) : <p className="empty-text">No recent activity.</p>}
            </div>
        </div>
    );
};

export default RecentActivities;
