import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FileText, Download, Trash2 } from 'lucide-react';
import './TabStyles.css';
import './DocumentsTab.css';

const DocumentsTab = ({ projectId }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // Get current user ID
    const getUserId = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user?._id;
    };

    const fetchDocuments = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:1000/api/v3/projects/${projectId}/documents`);
            setDocuments(response.data);
        } catch (err) {
            console.error('Error fetching documents:', err);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const userId = getUserId();
        if (!userId) {
            alert('Please login to upload files');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('createdBy', userId);

        try {
            setUploading(true);
            const response = await axios.post(
                `http://localhost:1000/api/v3/projects/${projectId}/documents`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            setDocuments([response.data, ...documents]);
            setSelectedFile(null);
            // Reset file input value
            document.getElementById('file-upload-input').value = '';
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (docId) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;

        try {
            await axios.delete(`http://localhost:1000/api/v3/documents/${docId}`);
            setDocuments(documents.filter(d => d._id !== docId));
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete file');
        }
    };

    const handleDownload = async (docId, fileName) => {
        try {
            const response = await axios.get(
                `http://localhost:1000/api/v3/documents/download/${docId}`,
                { responseType: 'blob' }
            );

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Download failed:', err);
            alert('Failed to download file');
        }
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="documents-tab">
            <h2 className="tab-title">Documents & Files</h2>

            {/* Upload Section */}
            <div className="upload-section">
                <div className="file-input-wrapper">
                    <button className="btn-select-file">Choose File</button>
                    <input
                        id="file-upload-input"
                        type="file"
                        onChange={handleFileSelect}
                        className="file-input"
                    />
                </div>
                {selectedFile && <span className="selected-file-name">{selectedFile.name}</span>}

                <button
                    className="btn-upload"
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            </div>

            {/* Documents List */}
            {loading ? (
                <div className="tab-loading">Loading documents...</div>
            ) : documents.length === 0 ? (
                <div className="empty-state-tab">
                    <p>No documents uploaded yet</p>
                    <p className="subtitle">Upload specifications, assets, or contracts here.</p>
                </div>
            ) : (
                <div className="documents-grid">
                    {documents.map((doc) => (
                        <div key={doc._id} className="document-card">
                            <div className="doc-content">
                                <div className="doc-icon">
                                    <FileText size={32} strokeWidth={1.5} />
                                </div>
                                <div className="doc-info">
                                    <span className="doc-name" title={doc.originalName}>{doc.originalName}</span>
                                    <div className="doc-meta">
                                        <span>{formatSize(doc.fileSize)}</span> •
                                        <span> {new Date(doc.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="doc-actions">
                                <button
                                    className="btn-icon-action download"
                                    onClick={() => handleDownload(doc._id, doc.originalName)}
                                    title="Download"
                                >
                                    <Download size={18} />
                                </button>
                                <button
                                    className="btn-icon-action delete"
                                    onClick={() => handleDelete(doc._id)}
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

export default DocumentsTab;
