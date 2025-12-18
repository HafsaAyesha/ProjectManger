import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CardModal.css";

const CardModal = ({ card, onClose, onUpdate, onDelete, userId }) => {
    const [editedCard, setEditedCard] = useState({
        title: card.title || "",
        description: card.description || "",
        priority: card.priority || "medium",
        dueDate: card.dueDate ? card.dueDate.split("T")[0] : "",
        tags: card.tags || [],
    });
    const [newTag, setNewTag] = useState("");
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState(card.comments || []);

    useEffect(() => {
        // Fetch full card details with comments
        const fetchCardDetails = async () => {
            try {
                const res = await axios.get(`/api/kanban/cards/${card._id}`);
                if (res.data.card) {
                    setComments(res.data.card.comments || []);
                }
            } catch (error) {
                console.error("Error fetching card details:", error);
            }
        };
        fetchCardDetails();
    }, [card._id]);

    const handleSave = () => {
        onUpdate(card._id, {
            title: editedCard.title,
            description: editedCard.description,
            priority: editedCard.priority,
            dueDate: editedCard.dueDate || null,
            tags: editedCard.tags,
        });
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this card?")) {
            onDelete(card._id);
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !editedCard.tags.includes(newTag.trim())) {
            setEditedCard({
                ...editedCard,
                tags: [...editedCard.tags, newTag.trim()],
            });
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setEditedCard({
            ...editedCard,
            tags: editedCard.tags.filter((tag) => tag !== tagToRemove),
        });
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const res = await axios.post(`/api/kanban/cards/${card._id}/comments`, {
                userId,
                text: newComment,
            });

            if (res.data.card) {
                setComments(res.data.card.comments || []);
                setNewComment("");
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="card-modal-overlay" onClick={onClose}>
            <div className="card-modal" onClick={(e) => e.stopPropagation()}>
                <div className="card-modal__header">
                    <h2 className="card-modal__title">Edit Card</h2>
                    <button className="modal-close-btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="card-modal__content">
                    {/* Title */}
                    <div className="card-modal__section">
                        <label className="card-modal__label">Title</label>
                        <input
                            type="text"
                            value={editedCard.title}
                            onChange={(e) =>
                                setEditedCard({ ...editedCard, title: e.target.value })
                            }
                            className="card-modal__input"
                        />
                    </div>

                    {/* Description */}
                    <div className="card-modal__section">
                        <label className="card-modal__label">Description</label>
                        <textarea
                            value={editedCard.description}
                            onChange={(e) =>
                                setEditedCard({ ...editedCard, description: e.target.value })
                            }
                            className="card-modal__textarea"
                            rows="4"
                        />
                    </div>

                    {/* Priority and Due Date */}
                    <div className="card-modal__row">
                        <div className="card-modal__section">
                            <label className="card-modal__label">Priority</label>
                            <select
                                value={editedCard.priority}
                                onChange={(e) =>
                                    setEditedCard({ ...editedCard, priority: e.target.value })
                                }
                                className="card-modal__select"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="card-modal__section">
                            <label className="card-modal__label">Due Date</label>
                            <input
                                type="date"
                                value={editedCard.dueDate}
                                onChange={(e) =>
                                    setEditedCard({ ...editedCard, dueDate: e.target.value })
                                }
                                className="card-modal__input"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="card-modal__section">
                        <label className="card-modal__label">Tags</label>
                        <div className="tags-container">
                            {editedCard.tags.map((tag, index) => (
                                <span key={index} className="tag-item">
                                    {tag}
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="tag-remove"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="tag-input-wrapper">
                            <input
                                type="text"
                                placeholder="Add a tag..."
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                                className="card-modal__input"
                            />
                            <button onClick={handleAddTag} className="tag-add-btn">
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="card-modal__section">
                        <label className="card-modal__label">
                            Comments ({comments.length})
                        </label>
                        <div className="comments-list">
                            {comments.map((comment, index) => (
                                <div key={index} className="comment-item">
                                    <div className="comment-header">
                                        <span className="comment-author">
                                            {comment.userId?.username || comment.userId?.email || "Unknown"}
                                        </span>
                                        <span className="comment-date">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="comment-text">{comment.text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="comment-input-wrapper">
                            <textarea
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="card-modal__textarea"
                                rows="2"
                            />
                            <button onClick={handleAddComment} className="comment-add-btn">
                                Add Comment
                            </button>
                        </div>
                    </div>

                    {/* Activity */}
                    <div className="card-modal__section">
                        <label className="card-modal__label">Activity</label>
                        <div className="activity-list">
                            <div className="activity-item">
                                <span className="activity-label">Created:</span>
                                <span className="activity-value">{formatDate(card.createdAt)}</span>
                            </div>
                            <div className="activity-item">
                                <span className="activity-label">Last Updated:</span>
                                <span className="activity-value">{formatDate(card.updatedAt)}</span>
                            </div>
                            {card.createdBy && (
                                <div className="activity-item">
                                    <span className="activity-label">Created By:</span>
                                    <span className="activity-value">
                                        {card.createdBy.username || card.createdBy.email}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card-modal__footer">
                    <button onClick={handleDelete} className="btn-delete">
                        Delete Card
                    </button>
                    <div className="footer-right">
                        <button onClick={onClose} className="btn-cancel">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="btn-save">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardModal;
