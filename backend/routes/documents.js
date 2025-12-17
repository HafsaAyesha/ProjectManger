const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ProjectDocument = require('../models/projectDocument');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Unique filename: timestamp + random + extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// GET: List documents for a project
router.get('/projects/:projectId/documents', async (req, res) => {
    try {
        const documents = await ProjectDocument.find({ projectId: req.params.projectId })
            .sort({ createdAt: -1 });
        res.status(200).json(documents);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch documents', error: err.message });
    }
});

// POST: Upload document
router.post('/projects/:projectId/documents', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { projectId } = req.params;
        const { createdBy } = req.body; // Passed from frontend

        const newDoc = new ProjectDocument({
            projectId,
            fileName: req.file.filename,
            originalName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            filePath: req.file.path,
            uploadedBy: createdBy
        });

        const savedDoc = await newDoc.save();
        res.status(201).json(savedDoc);
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ message: 'Failed to upload document', error: err.message });
    }
});

// DELETE: Delete document
router.delete('/documents/:documentId', async (req, res) => {
    try {
        const doc = await ProjectDocument.findById(req.params.documentId);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Remove file from filesystem
        if (fs.existsSync(doc.filePath)) {
            fs.unlinkSync(doc.filePath);
        }

        // Remove from DB
        await ProjectDocument.findByIdAndDelete(req.params.documentId);
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete document', error: err.message });
    }
});

// GET: Download document
router.get('/documents/download/:documentId', async (req, res) => {
    try {
        const doc = await ProjectDocument.findById(req.params.documentId);
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const absolutePath = path.resolve(doc.filePath);
        if (fs.existsSync(absolutePath)) {
            res.download(absolutePath, doc.originalName);
        } else {
            res.status(404).json({ message: 'File not found on server' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Download failed', error: err.message });
    }
});

module.exports = router;
