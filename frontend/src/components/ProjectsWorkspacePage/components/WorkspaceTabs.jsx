import React from 'react';
import './WorkspaceTabs.css';

const WorkspaceTabs = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="workspace-tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default WorkspaceTabs;
