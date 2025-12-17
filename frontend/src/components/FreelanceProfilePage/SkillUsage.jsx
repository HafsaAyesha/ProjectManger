import React from 'react';
import './SkillUsage.css';

const SkillUsage = ({ skillsData }) => {
    return (
        <div className="dash-card chart-card">
            <h3>Skills Usage</h3>
            <div className="skills-bar-chart">
                {skillsData && skillsData.length > 0 ? skillsData.map((skill, i) => (
                    <div key={i} className="skill-bar-row">
                        <span className="skill-label">{skill.label}</span>
                        <div className="skill-track">
                            <div className="skill-fill" style={{ width: `${skill.val}%` }}></div>
                        </div>
                    </div>
                )) : <p className="chart-empty-message">No skills data</p>}
            </div>
        </div>
    );
};

export default SkillUsage;
