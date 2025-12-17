import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Search, Trash2, Edit2, Check, X, Plus, Calendar, ArrowUpDown, XCircle } from 'lucide-react';
import './TabStyles.css';
import './NotesTab.css';

const NotesTab = ({ projectId }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editContent, setEditContent] = useState('');

    // --- Filter State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'
    const [timeFilter, setTimeFilter] = useState('all'); // 'all' | 'today' | 'week' | 'month' | 'custom'
    const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

    // Get current user ID
    const getUserId = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?._id;
    };

    // Fetch notes
    const fetchNotes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:1000/api/v3/projects/${projectId}/notes`);
            setNotes(response.data);
        } catch (err) {
            console.error('Error fetching notes:', err);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    // --- Advanced Compositional Filtering Logic ---
    const filteredNotes = useMemo(() => {
        let result = [...notes];

        // 1. Search Filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(note =>
                note.content.toLowerCase().includes(query)
            );
        }

        // 2. Time Filter
        const now = new Date();
        const todayStart = new Date(now.setHours(0, 0, 0, 0));

        if (timeFilter !== 'all') {
            result = result.filter(note => {
                const noteDate = new Date(note.createdAt);

                if (timeFilter === 'today') {
                    return noteDate >= todayStart;
                }
                if (timeFilter === 'week') {
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return noteDate >= weekAgo;
                }
                if (timeFilter === 'month') {
                    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    return noteDate >= monthAgo;
                }
                if (timeFilter === 'custom' && customDateRange.start && customDateRange.end) {
                    const start = new Date(customDateRange.start);
                    const end = new Date(customDateRange.end);
                    end.setHours(23, 59, 59, 999); // Include the end day
                    return noteDate >= start && noteDate <= end;
                }
                return true;
            });
        }

        // 3. Sorting
        result.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [notes, searchQuery, timeFilter, customDateRange, sortOrder]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (searchQuery) count++;
        if (timeFilter !== 'all') count++;
        if (sortOrder !== 'newest') count++;
        return count;
    }, [searchQuery, timeFilter, sortOrder]);

    const clearFilters = () => {
        setSearchQuery('');
        setTimeFilter('all');
        setSortOrder('newest');
        setCustomDateRange({ start: '', end: '' });
    };

    // --- CRUD Handlers ---

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        const userId = getUserId();
        if (!userId) {
            alert('Please login to add notes');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:1000/api/v3/projects/${projectId}/notes`, {
                content: newNote,
                createdBy: userId
            });
            const updatedNotes = [response.data, ...notes];
            setNotes(updatedNotes);
            setNewNote('');
        } catch (err) {
            console.error('Error adding note:', err);
            alert('Failed to add note');
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        try {
            await axios.delete(`http://localhost:1000/api/v3/notes/${noteId}`);
            setNotes(notes.filter(note => note._id !== noteId));
        } catch (err) {
            console.error('Error deleting note:', err);
            alert('Failed to delete note');
        }
    };

    const handleUpdateNote = async (noteId) => {
        if (!editContent.trim()) return;
        try {
            const response = await axios.put(`http://localhost:1000/api/v3/notes/${noteId}`, {
                content: editContent
            });
            setNotes(notes.map(note =>
                note._id === noteId ? response.data : note
            ));
            setEditingNoteId(null);
            setEditContent('');
        } catch (err) {
            console.error('Error updating note:', err);
            alert('Failed to update note');
        }
    };

    const startEditing = (note) => {
        setEditingNoteId(note._id);
        setEditContent(note.content);
    };

    const cancelEditing = () => {
        setEditingNoteId(null);
        setEditContent('');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading && notes.length === 0) return <div className="tab-loading">Loading notes...</div>;

    return (
        <div className="notes-tab">
            <h2 className="tab-title">Client Notes & Meeting Minutes</h2>

            {/* Note Creation */}
            <form onSubmit={handleAddNote} className="add-note-form">
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Write a new note here..."
                    className="note-input"
                    rows="3"
                />
                <button type="submit" className="btn-add-note" disabled={!newNote.trim()}>
                    <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Note
                </button>
            </form>

            {/* Filter Toolbar */}
            <div className="filter-toolbar">
                <div className="filter-group main-filters">
                    <div className="input-with-icon search-box">
                        <Search size={16} className="input-icon" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="btn-clear-search">
                                <XCircle size={14} />
                            </button>
                        )}
                    </div>

                    <div className="input-with-icon">
                        <Calendar size={16} className="input-icon" />
                        <select
                            value={timeFilter}
                            onChange={(e) => setTimeFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">Last 7 Days</option>
                            <option value="month">Last 30 Days</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>

                    <div className="input-with-icon">
                        <ArrowUpDown size={16} className="input-icon" />
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="filter-select"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>

                    {activeFilterCount > 0 && (
                        <button onClick={clearFilters} className="btn-clear-filters">
                            Clear Filters ({activeFilterCount})
                        </button>
                    )}
                </div>

                {/* Custom Date Range Inputs */}
                {timeFilter === 'custom' && (
                    <div className="filter-group date-range-group">
                        <input
                            type="date"
                            value={customDateRange.start}
                            onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                            className="date-input"
                        />
                        <span className="date-separator">to</span>
                        <input
                            type="date"
                            value={customDateRange.end}
                            onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                            className="date-input"
                        />
                    </div>
                )}
            </div>

            {/* Notes List */}
            <div className="notes-list">
                {filteredNotes.length === 0 ? (
                    <div className="empty-notes">
                        {notes.length === 0 ? (
                            <p>No notes yet. Start writing above!</p>
                        ) : (
                            <div className="no-results">
                                <Search size={48} className="no-results-icon" />
                                <p>No notes match your filters.</p>
                                <button onClick={clearFilters} className="btn-link">Clear all filters</button>
                            </div>
                        )}
                    </div>
                ) : (
                    filteredNotes.map((note) => (
                        <div key={note._id} className="note-card">
                            <div className="note-header">
                                <span className="note-date">{formatDate(note.createdAt)}</span>
                                <div className="note-actions">
                                    {editingNoteId === note._id ? (
                                        <>
                                            <button onClick={() => handleUpdateNote(note._id)} className="btn-icon-check" title="Save">
                                                <Check size={16} />
                                            </button>
                                            <button onClick={cancelEditing} className="btn-icon-cancel" title="Cancel">
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => startEditing(note)} className="btn-icon-edit" title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteNote(note._id)} className="btn-icon-delete" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {editingNoteId === note._id ? (
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="note-edit-input"
                                    rows="3"
                                    autoFocus
                                />
                            ) : (
                                <div className="note-content">
                                    {note.content.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotesTab;
