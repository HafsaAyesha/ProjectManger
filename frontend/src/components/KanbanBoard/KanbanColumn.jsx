import React, { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import KanbanCard from "./KanbanCard";
import AddCardButton from "./AddCardButton";
import "./KanbanColumn.css";

const KanbanColumn = ({ column, cards, onCardClick, onCreateCard }) => {
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState("");
    const [newCardDescription, setNewCardDescription] = useState("");

    const handleAddCard = () => {
        if (!newCardTitle.trim()) return;

        onCreateCard(column._id, {
            title: newCardTitle,
            description: newCardDescription,
        });

        setNewCardTitle("");
        setNewCardDescription("");
        setIsAddingCard(false);
    };

    const handleCancel = () => {
        setNewCardTitle("");
        setNewCardDescription("");
        setIsAddingCard(false);
    };

    return (
        <div className="kanban-column">
            <div className="kanban-column__header">
                <div className="column-title-wrapper">
                    <h3 className="kanban-column__title">{column.title}</h3>
                    <span className="kanban-column__count">{cards.length}</span>
                </div>
                {column.wipLimit && (
                    <span className="wip-limit">
                        Limit: {column.wipLimit}
                    </span>
                )}
            </div>

            <Droppable droppableId={column._id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`kanban-column__cards ${snapshot.isDraggingOver ? "kanban-column--drag-over" : ""
                            }`}
                    >
                        {cards.map((card, index) => (
                            <Draggable key={card._id} draggableId={card._id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <KanbanCard
                                            card={card}
                                            onClick={() => onCardClick(card)}
                                            isDragging={snapshot.isDragging}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}

                        {isAddingCard && (
                            <div className="add-card-form">
                                <input
                                    type="text"
                                    placeholder="Card title"
                                    value={newCardTitle}
                                    onChange={(e) => setNewCardTitle(e.target.value)}
                                    autoFocus
                                    className="add-card-input"
                                />
                                <textarea
                                    placeholder="Description (optional)"
                                    value={newCardDescription}
                                    onChange={(e) => setNewCardDescription(e.target.value)}
                                    className="add-card-textarea"
                                    rows="2"
                                />
                                <div className="add-card-actions">
                                    <button onClick={handleAddCard} className="btn-add">
                                        Add Card
                                    </button>
                                    <button onClick={handleCancel} className="btn-cancel">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Droppable>

            {!isAddingCard && (
                <AddCardButton onClick={() => setIsAddingCard(true)} />
            )}
        </div>
    );
};

export default KanbanColumn;
