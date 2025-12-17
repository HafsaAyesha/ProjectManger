import React from 'react';
import './MonthlyEarnings.css';

const MonthlyEarnings = ({ earningsData }) => {
    // earningsData: { labels: [], data: [] }
    const maxVal = Math.max(...(earningsData.data || [0]), 1); // Avoid div by zero

    return (
        <div className="dash-card chart-card">
            <h3>Monthly Earnings</h3>
            <div className="simple-bar-chart">
                {earningsData.data && earningsData.data.length > 0 ? earningsData.data.map((h, i) => (
                    <div key={i} className="bar-group">
                        <div className="bar" style={{ height: `${(h / maxVal) * 100}%` }} title={`$${h}`}></div>
                        <span className="label">{earningsData.labels[i]}</span>
                    </div>
                )) : <p className="chart-empty-state">No earnings data</p>}
            </div>
        </div>
    );
};

export default MonthlyEarnings;
