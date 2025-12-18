import React from "react";
import "./TagList.css";

const TagList = ({ tags }) => {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="tag-list">
            {tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">
                    {tag}
                </span>
            ))}
            {tags.length > 3 && (
                <span className="tag tag--more">+{tags.length - 3}</span>
            )}
        </div>
    );
};

export default TagList;
