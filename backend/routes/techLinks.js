const express = require('express');
const router = express.Router();
const ProjectTechLink = require('../models/projectTechLink');

// GET: List all tech links for a project
router.get('/projects/:projectId/tech-links', async (req, res) => {
    try {
        const links = await ProjectTechLink.find({ projectId: req.params.projectId })
            .sort({ createdAt: -1 });
        res.status(200).json(links);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch tech links', error: err.message });
    }
});

// POST: Add a new tech link
router.post('/projects/:projectId/tech-links', async (req, res) => {
    try {
        const { platform, url, description } = req.body;

        const newLink = new ProjectTechLink({
            projectId: req.params.projectId,
            platform,
            url,
            description
        });

        const savedLink = await newLink.save();
        res.status(201).json(savedLink);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add tech link', error: err.message });
    }
});

// PUT: Update a tech link
router.put('/tech-links/:linkId', async (req, res) => {
    try {
        const updatedLink = await ProjectTechLink.findByIdAndUpdate(
            req.params.linkId,
            req.body,
            { new: true }
        );
        if (!updatedLink) {
            return res.status(404).json({ message: 'Link not found' });
        }
        res.status(200).json(updatedLink);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update link', error: err.message });
    }
});

// DELETE: Remove a tech link
router.delete('/tech-links/:linkId', async (req, res) => {
    try {
        const deletedLink = await ProjectTechLink.findByIdAndDelete(req.params.linkId);
        if (!deletedLink) {
            return res.status(404).json({ message: 'Link not found' });
        }
        res.status(200).json({ message: 'Link deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete link', error: err.message });
    }
});

module.exports = router;
