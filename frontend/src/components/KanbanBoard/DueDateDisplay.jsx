import React from "react";
import "./DueDateDisplay.css";

const DueDateDisplay = ({ dueDate }) => {
    const getDueDateStatus = (dueDate) => {
        if (!dueDate) return null;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(dueDate);
        due.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { status: "overdue", color: "#ef4444", text: "Overdue" };
        if (diffDays === 0) return { status: "due-today", color: "#f59e0b", text: "Due today" };
        if (diffDays <= 3) return { status: "due-soon", color: "#f59e0b", text: `${diffDays}d left` };
        return { status: "on-track", color: "#10b981", text: `${diffDays}d left` };
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const status = getDueDateStatus(dueDate);
    if (!status) return null;

    return (
        <div className={`due-date due-date--${status.status}`} title={formatDate(dueDate)}>
            <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{status.text}</span>
        </div>
    );
};

export default DueDateDisplay;
