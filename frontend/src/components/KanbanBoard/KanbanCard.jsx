import React from "react";
import PriorityBadge from "./PriorityBadge";
import DueDateDisplay from "./DueDateDisplay";
import AssigneeAvatar from "./AssigneeAvatar";
import TagList from "./TagList";
import "./KanbanCard.css";

const KanbanCard = ({ card, onClick, isDragging }) => {
    return (
        <div
            className={`kanban-card ${isDragging ? "kanban-card--dragging" : ""}`}
            onClick={onClick}
        >
            <div className="kanban-card__header">
                <h4 className="kanban-card__title">{card.title}</h4>
                <PriorityBadge priority={card.priority} />
            </div>

            {card.description && (
                <p className="kanban-card__description">{card.description}</p>
            )}

            {card.tags && card.tags.length > 0 && (
                <TagList tags={card.tags} />
            )}

            <div className="kanban-card__footer">
                <div className="card-footer-left">
                    {card.dueDate && <DueDateDisplay dueDate={card.dueDate} />}
                </div>
                <div className="card-footer-right">
                    {card.assignee && <AssigneeAvatar user={card.assignee} />}
                </div>
            </div>
        </div>
    );
};

export default KanbanCard;
