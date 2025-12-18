import React from "react";
import "./AssigneeAvatar.css";

const AssigneeAvatar = ({ user }) => {
    if (!user) return null;

    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="assignee-avatar" title={user.username || user.email}>
            {getInitials(user.username || user.email)}
        </div>
    );
};

export default AssigneeAvatar;
