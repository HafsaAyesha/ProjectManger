import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import KanbanBoard from "../KanbanBoard/KanbanBoard";
import "./Kanban.css";

const Kanban = ({ userId, email }) => {
  const [boards, setBoards] = useState([]);
  const [activeBoard, setActiveBoard] = useState(null);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch boards
  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/kanban/boards/${userId}`);
      if (res.data.boards) {
        setBoards(res.data.boards);

        // Auto-select first board if none selected
        if (!activeBoard && res.data.boards.length > 0) {
          setActiveBoard(res.data.boards[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, activeBoard]);

  useEffect(() => {
    if (userId) {
      fetchBoards();
    }
  }, [userId, fetchBoards]);

  // Create new board
  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;

    try {
      const res = await axios.post("/api/kanban/boards", {
        title: newBoardTitle,
        description: newBoardDescription,
        userId,
      });

      if (res.data.board) {
        setBoards([res.data.board, ...boards]);
        setActiveBoard(res.data.board._id);
        setNewBoardTitle("");
        setNewBoardDescription("");
        setIsCreatingBoard(false);
      }
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  if (loading) {
    return (
      <div className="kanban-loading-container">
        <div className="spinner"></div>
        <p>Loading boards...</p>
      </div>
    );
  }

  // No boards exist - show create board prompt
  if (boards.length === 0 && !isCreatingBoard) {
    return (
      <div className="kanban-empty-state">
        <div className="empty-state-content">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="empty-state-icon"
          >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <h2>No Kanban Boards Yet</h2>
          <p>Create your first board to start organizing tasks</p>
          <button
            onClick={() => setIsCreatingBoard(true)}
            className="create-board-btn"
          >
            Create Your First Board
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kanban-wrapper">
      {/* Board Selection Header */}
      <div className="kanban-header">
        <div className="board-selector">
          <label>Board:</label>
          <select
            value={activeBoard || ""}
            onChange={(e) => setActiveBoard(e.target.value)}
            className="board-select"
          >
            {boards.map((board) => (
              <option key={board._id} value={board._id}>
                {board.title}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsCreatingBoard(true)}
          className="new-board-btn"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Board
        </button>
      </div>

      {/* Create Board Form */}
      {isCreatingBoard && (
        <div className="create-board-form">
          <h3>Create New Board</h3>
          <input
            type="text"
            placeholder="Board title"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            className="board-input"
            autoFocus
          />
          <textarea
            placeholder="Board description (optional)"
            value={newBoardDescription}
            onChange={(e) => setNewBoardDescription(e.target.value)}
            className="board-textarea"
            rows="2"
          />
          <div className="form-actions">
            <button onClick={handleCreateBoard} className="btn-create">
              Create Board
            </button>
            <button
              onClick={() => {
                setIsCreatingBoard(false);
                setNewBoardTitle("");
                setNewBoardDescription("");
              }}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      {activeBoard && <KanbanBoard boardId={activeBoard} userId={userId} />}
    </div>
  );
};

export default Kanban;

