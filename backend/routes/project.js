const router = require("express").Router();
const Project = require("../models/project");

// GET all projects for a user
router.get("/projects", async (req, res) => {
    try {
        const { id } = req.query; // Changed from req.body to req.query for GET request

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const projects = await Project.find({ createdBy: id })
            .sort({ createdAt: -1 }); // Most recent first

        res.status(200).json({ projects });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// GET single project by ID
router.get("/projects/:id", async (req, res) => {
    try {
        const { id: projectId } = req.params;
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const project = await Project.findOne({ _id: projectId, createdBy: userId });

        if (!project) {
            return res.status(404).json({ message: "Project not found or unauthorized" });
        }

        res.status(200).json({ project });
    } catch (error) {
        console.error("Error fetching project:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// POST - Create a new project
router.post("/projects", async (req, res) => {
    try {
        const { title, description, clientName, status, budget, deadline, tags, notesCount, id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (!title || !clientName) {
            return res.status(400).json({ message: "Title and Client Name are required" });
        }

        const newProject = new Project({
            title,
            description,
            clientName,
            status: status || 'active',
            budget,
            deadline,
            tags: tags || [],
            notesCount: notesCount || 0,
            createdBy: id,
        });

        await newProject.save();

        res.status(201).json({ message: "Project created successfully", project: newProject });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// PUT - Update a project
router.put("/projects/:id", async (req, res) => {
    try {
        const { id: projectId } = req.params;
        const { id: userId, title, description, clientName, status, budget, deadline, tags, notesCount } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find project and verify ownership
        const project = await Project.findOne({ _id: projectId, createdBy: userId });

        if (!project) {
            return res.status(404).json({ message: "Project not found or unauthorized" });
        }

        // Update fields
        if (title !== undefined) project.title = title;
        if (description !== undefined) project.description = description;
        if (clientName !== undefined) project.clientName = clientName;
        if (status !== undefined) project.status = status;
        if (budget !== undefined) project.budget = budget;
        if (deadline !== undefined) project.deadline = deadline;
        if (tags !== undefined) project.tags = tags;
        if (notesCount !== undefined) project.notesCount = notesCount;

        await project.save();

        res.status(200).json({ message: "Project updated successfully", project });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE - Delete a project
router.delete("/projects/:id", async (req, res) => {
    try {
        const { id: projectId } = req.params;
        const { id: userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find and delete project (only if user owns it)
        const project = await Project.findOneAndDelete({ _id: projectId, createdBy: userId });

        if (!project) {
            return res.status(404).json({ message: "Project not found or unauthorized" });
        }

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
