const router = require("express").Router();
const ProjectMilestone = require("../models/projectMilestone");

// GET all milestones for a project
router.get("/projects/:projectId/milestones", async (req, res) => {
    try {
        const milestones = await ProjectMilestone.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
        res.status(200).json(milestones);
    } catch (error) {
        res.status(500).json({ message: "Error fetching milestones", error });
    }
});

// POST create a milestone
router.post("/projects/:projectId/milestones", async (req, res) => {
    try {
        const { title, dueDate, startDate, createdBy } = req.body;
        const newMilestone = new ProjectMilestone({
            projectId: req.params.projectId,
            title,
            startDate,
            dueDate,
            createdBy
        });
        await newMilestone.save();
        res.status(201).json(newMilestone);
    } catch (error) {
        res.status(500).json({ message: "Error creating milestone", error });
    }
});

// PUT update a milestone (toggle complete / edit)
router.put("/milestones/:milestoneId", async (req, res) => {
    try {
        const { title, isCompleted, status, startDate, dueDate, checklist, notes } = req.body;
        const updateData = {};

        if (title !== undefined) updateData.title = title;
        if (startDate !== undefined) updateData.startDate = startDate;
        if (dueDate !== undefined) updateData.dueDate = dueDate;
        if (status !== undefined) updateData.status = status;
        if (checklist !== undefined) updateData.checklist = checklist;
        if (notes !== undefined) updateData.notes = notes;

        // Sync old isCompleted boolean with status enum for backward compatibility
        if (isCompleted !== undefined) {
            updateData.isCompleted = isCompleted;
            updateData.status = isCompleted ? 'completed' : (updateData.status === 'completed' ? 'in_progress' : updateData.status || 'not_started');
            updateData.completedAt = isCompleted ? new Date() : null;
        } else if (status === 'completed') {
            updateData.isCompleted = true;
            updateData.completedAt = new Date();
        } else if (status && status !== 'completed') {
            updateData.isCompleted = false;
            updateData.completedAt = null;
        }

        const updatedMilestone = await ProjectMilestone.findByIdAndUpdate(
            req.params.milestoneId,
            updateData,
            { new: true }
        );
        res.status(200).json(updatedMilestone);
    } catch (error) {
        res.status(500).json({ message: "Error updating milestone", error });
    }
});

// DELETE a milestone
router.delete("/milestones/:milestoneId", async (req, res) => {
    try {
        await ProjectMilestone.findByIdAndDelete(req.params.milestoneId);
        res.status(200).json({ message: "Milestone deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting milestone", error });
    }
});

module.exports = router;
