import React, { useMemo, useState } from 'react';
import './GanttChart.css';

const GanttChart = ({ milestones }) => {
    const [viewMode, setViewMode] = useState('Week'); // Day, Week, Month

    const processedData = useMemo(() => {
        if (!milestones.length) return null;

        const dates = [
            ...milestones.map(m => new Date(m.startDate || m.createdAt).getTime()),
            ...milestones.map(m =>
                m.dueDate
                    ? new Date(m.dueDate).getTime()
                    : new Date(m.createdAt).getTime() + 604800000
            )
        ];

        let minDate = Math.min(...dates);
        let maxDate = Math.max(...dates);

        const dayMs = 86400000;
        minDate -= dayMs * 3;
        maxDate += dayMs * 7;

        return { minDate, maxDate };
    }, [milestones]);

    const timeUnits = useMemo(() => {
        if (!processedData) return [];

        const units = [];
        const { minDate, maxDate } = processedData;
        let scaleMs;

        switch (viewMode) {
            case 'Day': scaleMs = 86400000; break;
            case 'Week': scaleMs = 86400000 * 7; break;
            case 'Month': scaleMs = 86400000 * 30; break;
            default: scaleMs = 86400000 * 7;
        }

        let current = minDate;
        while (current <= maxDate) {
            units.push(current);
            current += scaleMs;
        }
        return units;
    }, [processedData, viewMode]);

    if (!processedData) return <div className="gantt-empty">No milestone data for timeline</div>;

    const { minDate, maxDate } = processedData;
    const totalDuration = maxDate - minDate;

    const getLeftPosition = (startDate) => {
        const start = new Date(startDate).getTime();
        return ((start - minDate) / totalDuration) * 100;
    };

    const getWidth = (startDate, endDate) => {
        const start = new Date(startDate).getTime();
        let end = endDate
            ? new Date(endDate).getTime()
            : start + (viewMode === 'Day' ? 86400000 : 604800000);

        return Math.max(((end - start) / totalDuration) * 100, 0.5);
    };

    return (
        <div className="gantt-chart-section">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Project Timeline</h3>
                <div className="gantt-controls">
                    {['Day', 'Week', 'Month'].map(mode => (
                        <button
                            key={mode}
                            className={`btn-view-mode ${viewMode === mode ? 'active' : ''}`}
                            onClick={() => setViewMode(mode)}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
            </div>

            <div className="gantt-container">
                <div className="gantt-header-row">
                    {timeUnits.map((time, idx) => (
                        <div
                            key={idx}
                            className="time-unit"
                            style={{ width: `${(1 / timeUnits.length) * 100}%` }}
                        >
                            {new Date(time).toLocaleDateString(undefined, {
                                month: 'short',
                                day: viewMode === 'Month' ? undefined : 'numeric',
                                year: viewMode === 'Month' ? '2-digit' : undefined
                            })}
                        </div>
                    ))}
                </div>

                {/* ✅ ADDITION: Vertical scrolling container */}
                <div
                    className="gantt-body"
                    style={{
                        maxHeight: '420px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        position: 'relative'
                    }}
                >
                    <div className="grid-lines">
                        {timeUnits.map((_, idx) => (
                            <div
                                key={idx}
                                className="grid-line"
                                style={{ width: `${(1 / timeUnits.length) * 100}%` }}
                            />
                        ))}
                    </div>

                    {milestones.map(ms => {
                        const start = ms.startDate || ms.createdAt;

                        return (
                            <div key={ms._id} className="gantt-row">
                                {/* ✅ ADDITION: Force sticky milestone names */}
                                <div
                                    className="gantt-task-name"
                                    title={ms.title}
                                    style={{
                                        position: 'sticky',
                                        left: 0,
                                        zIndex: 50,
                                        background: '#ffffff'
                                    }}
                                >
                                    {ms.title}
                                </div>

                                <div className="gantt-bar-area">
                                    <div
                                        className={`gantt-bar ${ms.status === 'completed' || ms.isCompleted
                                                ? 'completed'
                                                : 'pending'
                                            }`}
                                        style={{
                                            left: `${getLeftPosition(start)}%`,
                                            width: `${getWidth(start, ms.dueDate)}%`,
                                            backgroundColor:
                                                ms.status === 'not_started'
                                                    ? '#9ca3af'
                                                    : ms.status === 'in_progress'
                                                        ? '#3b82f6'
                                                        : '#10b981'
                                        }}
                                        title={`${ms.title}\nStatus: ${ms.status || 'Pending'}`}
                                    >
                                        {(ms.status === 'completed' || ms.isCompleted) && (
                                            <span className="bar-status">✓</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {Date.now() >= minDate && Date.now() <= maxDate && (
                        <div
                            className="gantt-today-line"
                            style={{ left: `${getLeftPosition(Date.now())}%` }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default GanttChart;
