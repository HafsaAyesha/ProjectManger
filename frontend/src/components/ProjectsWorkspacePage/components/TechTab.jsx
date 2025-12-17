import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ExternalLink, Trash2, Edit2 } from 'lucide-react';
import './TabStyles.css';
import './TechTab.css';

const TechTab = ({ project }) => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newLink, setNewLink] = useState({ platform: 'GitHub', url: '', description: '' });

    const [editingLink, setEditingLink] = useState(null);

    const platforms = ['GitHub', 'GitLab', 'S3', 'Vercel', 'Netlify', 'Heroku', 'Figma', 'Jira', 'Other'];

    const fetchLinks = useCallback(async () => {
        if (!project?._id) return;
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:1000/api/v3/projects/${project._id}/tech-links`);
            setLinks(response.data);
        } catch (err) {
            console.error('Error fetching tech links:', err);
        } finally {
            setLoading(false);
        }
    }, [project._id]);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLink) {
                // Update existing link
                const response = await axios.put(`http://localhost:1000/api/v3/tech-links/${editingLink._id}`, newLink);
                setLinks(links.map(l => l._id === editingLink._id ? response.data : l));
            } else {
                // Create new link
                const response = await axios.post(`http://localhost:1000/api/v3/projects/${project._id}/tech-links`, newLink);
                setLinks([response.data, ...links]);
            }
            // Reset form
            setNewLink({ platform: 'GitHub', url: '', description: '' });
            setEditingLink(null);
        } catch (err) {
            console.error('Error saving link:', err);
            alert('Failed to save link');
        }
    };

    const handleEditClick = (link) => {
        setNewLink({ platform: link.platform, url: link.url, description: link.description || '' });
        setEditingLink(link);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setNewLink({ platform: 'GitHub', url: '', description: '' });
        setEditingLink(null);
    };

    const handleDeleteLink = async (linkId) => {
        if (!window.confirm('Delete this link?')) return;
        try {
            await axios.delete(`http://localhost:1000/api/v3/tech-links/${linkId}`);
            setLinks(links.filter(l => l._id !== linkId));
        } catch (err) {
            console.error('Error deleting link:', err);
            alert('Failed to delete link');
        }
    };

    return (
        <div className="tech-tab">
            <h2 className="tab-title">Technical & Code Integration</h2>

            {/* Add/Edit Link Form */}
            <div className="add-link-form">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>{editingLink ? 'Edit Resource' : 'Add New Resource'}</h3>
                    {editingLink && (
                        <button type="button" onClick={handleCancelEdit} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline' }}>
                            Cancel Edit
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-row form-group">
                        <select
                            className="form-select"
                            value={newLink.platform}
                            onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                        >
                            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <input
                            type="url"
                            className="form-input"
                            placeholder="https://..."
                            value={newLink.url}
                            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Description (Optional, e.g. 'Production Deployment')"
                            value={newLink.description}
                            onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn-add-link">
                        {editingLink ? 'Update Resource' : '+ Add Resource'}
                    </button>
                </form>
            </div>

            {/* Links List */}
            {loading ? (
                <div className="tab-loading">Loading resources...</div>
            ) : links.length === 0 ? (
                <div className="empty-state-tab">
                    <p>No technical resources added yet</p>
                    <p className="subtitle">Add links to repositories, deployments, or designs above.</p>
                </div>
            ) : (
                <div className="links-list">
                    {links.map((link) => (
                        <div key={link._id} className="link-card">
                            <div className="link-info">
                                <div className="link-header">
                                    <span className="platform-badge">{link.platform}</span>
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-url">
                                        {link.url}
                                    </a>
                                </div>
                                {link.description && <p className="link-desc">{link.description}</p>}
                            </div>
                            <div className="link-actions">
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-open"
                                >
                                    <ExternalLink size={14} /> Open
                                </a>
                                <button
                                    className="btn-icon-delete" // Re-using delete style for now
                                    onClick={() => handleEditClick(link)}
                                    title="Edit"
                                >
                                    <Edit2 size={18} className="text-blue-500" />
                                </button>
                                <button
                                    className="btn-icon-delete"
                                    onClick={() => handleDeleteLink(link._id)}
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TechTab;
