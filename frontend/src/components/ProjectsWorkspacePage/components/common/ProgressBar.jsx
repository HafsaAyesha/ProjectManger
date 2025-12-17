import React from 'react';
import '../Overview/Overview.css'; // Reusing existing styles for consistently

const ProgressBar = ({ progress, total, completed }) => {
    return (
        <div className="progress-summary-card">
            <div className="progress-header">
                <h3>Overall Progress</h3>
                <span className="percent-text">{Math.round(progress)}%</span>
            </div>
            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="progress-stats">
                <span>{completed} of {total} Milestones Completed</span>
                {total === 0 && <span className="setup-hint">Set up milestones below to track progress</span>}
            </div>
        </div>
    );
};

export default ProgressBar;
