import React from 'react';
import './Overview.css';

const Timeline = ({ milestones }) => {
    // Derive events from milestones
    const events = [];
    milestones.forEach(ms => {
        // Created event
        events.push({
            type: 'created',
            date: new Date(ms.createdAt),
            title: ms.title,
            id: ms._id
        });

        // Completed event
        if (ms.isCompleted && ms.completedAt) {
            events.push({
                type: 'completed',
                date: new Date(ms.completedAt),
                title: ms.title,
                id: ms._id
            });
        }
    });

    // Sort by date descending
    events.sort((a, b) => b.date - a.date);

    return (
        <div className="timeline-section">
            <div className="section-header">
                <h3>Recent Activity</h3>
            </div>
            <div className="timeline-container">
                {events.length === 0 ? (
                    <div className="empty-state">No activity recorded yet.</div>
                ) : (
                    events.map((event, idx) => (
                        <div key={`${event.id}-${event.type}`} className="timeline-entry">
                            <div className={`timeline-dot ${event.type}`}></div>
                            <div className="timeline-content">
                                <span className="timeline-date">
                                    {event.date.toLocaleDateString()} • {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <p className="timeline-msg">
                                    {event.type === 'completed' ? (
                                        <>Completed milestone <strong>{event.title}</strong></>
                                    ) : (
                                        <>Created milestone <strong>{event.title}</strong></>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Timeline;
