import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import axios from "axios";
import KanbanColumn from "./KanbanColumn";
import FilterBar from "./FilterBar";
import CardModal from "./CardModal";
import "./KanbanBoard.css";

const KanbanBoard = ({ boardId, userId }) => {
    const [board, setBoard] = useState(null);
    const [columns, setColumns] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        priority: null,
        assignee: null,
        tags: [],
        search: "",
    });
    const [loading, setLoading] = useState(true);

    // Fetch board data
    const fetchBoard = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/kanban/boards/detail/${boardId}`);
            if (res.data.board) {
                setBoard(res.data.board);
                setColumns(res.data.board.columns || []);
            }
        } catch (error) {
            console.error("Error fetching board:", error);
        } finally {
            setLoading(false);
        }
    }, [boardId]);

    useEffect(() => {
        if (boardId) {
            fetchBoard();
        }
    }, [boardId, fetchBoard]);

    // Handle drag end
    const handleDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        // Dropped outside droppable area
        if (!destination) return;

        // Same position
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        const sourceColumnId = source.droppableId;
        const destColumnId = destination.droppableId;

        // Optimistic UI update
        const newColumns = Array.from(columns);
        const sourceColumn = newColumns.find((col) => col._id === sourceColumnId);
        const destColumn = newColumns.find((col) => col._id === destColumnId);

        if (!sourceColumn || !destColumn) return;

        const sourceCards = Array.from(sourceColumn.cards);
        const destCards =
            sourceColumnId === destColumnId
                ? sourceCards
                : Array.from(destColumn.cards);

        // Remove from source
        const [movedCard] = sourceCards.splice(source.index, 1);

        // Add to destination
        destCards.splice(destination.index, 0, movedCard);

        // Update columns
        sourceColumn.cards = sourceCards;
        if (sourceColumnId !== destColumnId) {
            destColumn.cards = destCards;
        }

        setColumns(newColumns);

        // API call
        try {
            if (sourceColumnId === destColumnId) {
                // Reorder within same column
                await axios.put(`/api/kanban/cards/${draggableId}/reorder`, {
                    newOrder: destination.index,
                });
            } else {
                // Move to different column
                await axios.put(`/api/kanban/cards/${draggableId}/move`, {
                    newColumnId: destColumnId,
                    newOrder: destination.index,
                });
            }
        } catch (error) {
            console.error("Error moving card:", error);
            // Revert on error
            fetchBoard();
        }
    };

    // Handle card click
    const handleCardClick = (card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    // Handle card creation
    const handleCreateCard = async (columnId, cardData) => {
        try {
            const res = await axios.post("/api/kanban/cards", {
                ...cardData,
                columnId,
                boardId,
                createdBy: userId,
            });

            if (res.data.card) {
                fetchBoard(); // Refresh board
            }
        } catch (error) {
            console.error("Error creating card:", error);
        }
    };

    // Handle card update
    const handleUpdateCard = async (cardId, updates) => {
        try {
            await axios.put(`/api/kanban/cards/${cardId}`, updates);
            fetchBoard(); // Refresh board
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error updating card:", error);
        }
    };

    // Handle card delete
    const handleDeleteCard = async (cardId) => {
        try {
            await axios.delete(`/api/kanban/cards/${cardId}`);
            fetchBoard(); // Refresh board
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error deleting card:", error);
        }
    };

    // Filter cards
    const getFilteredCards = (cards) => {
        return cards.filter((card) => {
            // Priority filter
            if (filters.priority && card.priority !== filters.priority) {
                return false;
            }

            // Assignee filter
            if (filters.assignee && card.assignee?._id !== filters.assignee) {
                return false;
            }

            // Tags filter
            if (filters.tags.length > 0) {
                const hasTag = filters.tags.some((tag) => card.tags.includes(tag));
                if (!hasTag) return false;
            }

            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matchTitle = card.title.toLowerCase().includes(searchLower);
                const matchDesc = card.description.toLowerCase().includes(searchLower);
                if (!matchTitle && !matchDesc) return false;
            }

            return true;
        });
    };

    if (loading) {
        return (
            <div className="kanban-loading">
                <div className="spinner"></div>
                <p>Loading board...</p>
            </div>
        );
    }

    if (!board) {
        return (
            <div className="kanban-error">
                <p>Board not found</p>
            </div>
        );
    }

    return (
        <div className="kanban-board-wrapper">
            <div className="kanban-board-header">
                <h1>{board.title}</h1>
                {board.description && <p className="board-description">{board.description}</p>}
            </div>

            <FilterBar filters={filters} setFilters={setFilters} />

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="kanban-board">
                    {columns.map((column) => (
                        <KanbanColumn
                            key={column._id}
                            column={column}
                            cards={getFilteredCards(column.cards || [])}
                            onCardClick={handleCardClick}
                            onCreateCard={handleCreateCard}
                        />
                    ))}
                </div>
            </DragDropContext>

            {isModalOpen && selectedCard && (
                <CardModal
                    card={selectedCard}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={handleUpdateCard}
                    onDelete={handleDeleteCard}
                    userId={userId}
                />
            )}
        </div>
    );
};

export default KanbanBoard;
