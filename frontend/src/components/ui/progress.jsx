import React from 'react';
import './ui.css';

export function Progress({ value, className }) {
    return (
        <div className={`ui-progress-root ${className || ''}`}>
            <div
                className="ui-progress-indicator"
                style={{ width: `${value}%` }}
            />
        </div>
    );
}
