const router = require("express").Router();
const ProjectNote = require("../models/projectNote");
const ProjectFinance = require("../models/projectFinance");
const ProjectProgress = require("../models/projectProgress");
const ProjectExtension = require("../models/projectExtension");

// --- NOTES OPERATIONS ---

// GET all notes for a project
router.get("/projects/:projectId/notes", async (req, res) => {
    try {
        const notes = await ProjectNote.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notes", error });
    }
});

// POST create a note
router.post("/projects/:projectId/notes", async (req, res) => {
    try {
        const { content, createdBy } = req.body;
        const newNote = new ProjectNote({
            projectId: req.params.projectId,
            content,
            createdBy
        });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: "Error creating note", error });
    }
});

// PUT update a note
router.put("/notes/:noteId", async (req, res) => {
    try {
        const { content } = req.body;
        const updatedNote = await ProjectNote.findByIdAndUpdate(
            req.params.noteId,
            { content },
            { new: true }
        );
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: "Error updating note", error });
    }
});

// DELETE a note
router.delete("/notes/:noteId", async (req, res) => {
    try {
        await ProjectNote.findByIdAndDelete(req.params.noteId);
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting note", error });
    }
});

// --- FINANCE OPERATIONS ---

// GET finance data
router.get("/projects/:projectId/finance", async (req, res) => {
    try {
        let finance = await ProjectFinance.findOne({ projectId: req.params.projectId });
        if (!finance) {
            // Create default if not exists
            finance = new ProjectFinance({ projectId: req.params.projectId });
            await finance.save();
        }
        res.status(200).json(finance);
    } catch (error) {
        res.status(500).json({ message: "Error fetching finance data", error });
    }
});

// PUT update finance (generic update for simplicity)
router.put("/projects/:projectId/finance", async (req, res) => {
    try {
        const { totalBudget, paymentsReceived, expenses } = req.body;
        const updateData = {};
        if (totalBudget !== undefined) updateData.totalBudget = totalBudget;
        if (paymentsReceived !== undefined) updateData.paymentsReceived = paymentsReceived;
        if (expenses !== undefined) updateData.expenses = expenses;

        const updatedFinance = await ProjectFinance.findOneAndUpdate(
            { projectId: req.params.projectId },
            updateData,
            { new: true, upsert: true }
        );
        res.status(200).json(updatedFinance);
    } catch (error) {
        res.status(500).json({ message: "Error updating finance data", error });
    }
});

// --- PROGRESS OPERATIONS ---

// GET progress data
router.get("/projects/:projectId/progress", async (req, res) => {
    try {
        let progress = await ProjectProgress.findOne({ projectId: req.params.projectId });
        if (!progress) {
            progress = new ProjectProgress({ projectId: req.params.projectId });
            await progress.save();
        }
        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: "Error fetching progress data", error });
    }
});

// PUT update progress
router.put("/projects/:projectId/progress", async (req, res) => {
    try {
        const { overallProgress, milestones, history } = req.body;
        const updateData = {};
        if (overallProgress !== undefined) updateData.overallProgress = overallProgress;
        if (milestones !== undefined) updateData.milestones = milestones;
        if (history !== undefined) updateData.history = history;

        const updatedProgress = await ProjectProgress.findOneAndUpdate(
            { projectId: req.params.projectId },
            updateData,
            { new: true, upsert: true }
        );
        res.status(200).json(updatedProgress);
    } catch (error) {
        res.status(500).json({ message: "Error updating progress data", error });
    }
});

// --- DETAILS / EXTENSION OPERATIONS ---

// GET details
router.get("/projects/:projectId/details", async (req, res) => {
    try {
        let details = await ProjectExtension.findOne({ projectId: req.params.projectId });
        if (!details) {
            details = new ProjectExtension({ projectId: req.params.projectId });
            await details.save();
        }
        res.status(200).json(details);
    } catch (error) {
        res.status(500).json({ message: "Error fetching details", error });
    }
});

// PUT update details
router.put("/projects/:projectId/details", async (req, res) => {
    try {
        const { requirements, scope, deliverables, clientInfo } = req.body;
        const updateData = {};
        if (requirements !== undefined) updateData.requirements = requirements;
        if (scope !== undefined) updateData.scope = scope;
        if (deliverables !== undefined) updateData.deliverables = deliverables;
        if (clientInfo !== undefined) updateData.clientInfo = clientInfo;

        const updatedDetails = await ProjectExtension.findOneAndUpdate(
            { projectId: req.params.projectId },
            updateData,
            { new: true, upsert: true }
        );
        res.status(200).json(updatedDetails);
    } catch (error) {
        res.status(500).json({ message: "Error updating details", error });
    }
});

module.exports = router;
