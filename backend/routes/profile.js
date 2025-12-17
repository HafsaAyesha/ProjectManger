const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');

// GET Profile by ID (or specific username if needed)
router.get("/profile/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Fetch profile error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// PUT Update Profile
// --- Stats Endpoints ---

// Get Dashboard Overview Stats
router.get("/stats/dashboard/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const Project = require("../models/project");

        const projects = await Project.find({ "assignedTo": userId }); // Adjust query based on actual schema

        const totalProjects = projects.length;
        const completedProjects = projects.filter(p => p.status === 'Completed').length;
        const inProgress = projects.filter(p => p.status === 'In Progress').length;
        const totalEarnings = projects
            .filter(p => p.status === 'Completed')
            .reduce((acc, curr) => acc + (Number(curr.netProfit) || 0), 0);

        res.status(200).json({
            totalProjects,
            completedProjects,
            inProgress,
            totalEarnings
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get Activity Feed
router.get("/stats/activity/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const Project = require("../models/project");
        // Fetch recent projects assigned to user, sorted by update time
        const recentProjects = await Project.find({ "assignedTo": userId })
            .sort({ updatedAt: -1 })
            .limit(5);

        const activities = recentProjects.map(p => {
            const isCompleted = p.status === 'Completed';
            return {
                id: p._id,
                action: isCompleted ? "Completed project" : "Updated project",
                target: p.title,
                time: new Date(p.updatedAt).toLocaleDateString(),
                icon: isCompleted ? "fa-check-circle" : "fa-edit",
                color: isCompleted ? "green" : "blue"
            };
        });

        res.status(200).json(activities);
    } catch (error) {
        console.error("Activity stats error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get Earnings Chart Data
router.get("/stats/chart/earnings/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const Project = require("../models/project");
        const projects = await Project.find({ "assignedTo": userId, status: 'Completed' });

        // Aggregate by month (using netProfit and endDate)
        const earningsByMonth = {};
        projects.forEach(p => {
            const date = new Date(p.endDate || p.updatedAt);
            const month = date.toLocaleString('default', { month: 'short' });
            earningsByMonth[month] = (earningsByMonth[month] || 0) + (Number(p.netProfit) || 0);
        });

        // Convert to array format expected by frontend
        const labels = Object.keys(earningsByMonth);
        const data = Object.values(earningsByMonth);

        // If empty, return some defaults or empty
        if (labels.length === 0) {
            res.status(200).json({ labels: ['Jan', 'Feb', 'Mar'], data: [0, 0, 0] });
        } else {
            res.status(200).json({ labels, data });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Get Skills Usage
router.get("/stats/chart/skills/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user || !user.profile || !user.profile.skills) {
            return res.status(200).json([]);
        }
        // Return skills with levels mapped to mock usage stats or just count
        // For now, we'll map levels to percentages for visualization
        const levelMap = { "Beginner": 25, "Intermediate": 50, "Advanced": 75, "Expert": 100 };
        const skillsData = user.profile.skills.map(s => ({
            label: s.name,
            val: levelMap[s.level] || 50
        }));
        res.status(200).json(skillsData);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Existing PUT route...
// --- Experience Endpoints ---
router.post("/experience/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const newExp = req.body; // { title, company, ... }
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { "profile.experience": newExp } },
            { new: true }
        ).select("-password");
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/experience/:userId/:expId", async (req, res) => {
    try {
        const { userId, expId } = req.params;
        const updatedExp = req.body;

        // Construct update object dynamically to avoid overwriting with nulls if partial
        const updateOps = {};
        for (const key in updatedExp) {
            updateOps[`profile.experience.$.${key}`] = updatedExp[key];
        }

        const user = await User.findOneAndUpdate(
            { _id: userId, "profile.experience._id": expId },
            { $set: updateOps },
            { new: true }
        ).select("-password");
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.delete("/experience/:userId/:expId", async (req, res) => {
    try {
        const { userId, expId } = req.params;
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { "profile.experience": { _id: expId } } },
            { new: true }
        ).select("-password");
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// --- Education Endpoints ---
router.post("/education/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const newEdu = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { "profile.education": newEdu } },
            { new: true }
        ).select("-password");
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/education/:userId/:eduId", async (req, res) => {
    try {
        const { userId, eduId } = req.params;
        const updatedEdu = req.body;

        const updateOps = {};
        for (const key in updatedEdu) {
            updateOps[`profile.education.$.${key}`] = updatedEdu[key];
        }

        const user = await User.findOneAndUpdate(
            { _id: userId, "profile.education._id": eduId },
            { $set: updateOps },
            { new: true }
        ).select("-password");
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.delete("/education/:userId/:eduId", async (req, res) => {
    try {
        const { userId, eduId } = req.params;
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { "profile.education": { _id: eduId } } },
            { new: true }
        ).select("-password");
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.put("/profile/:id", async (req, res) => {
    try {
        const { profile } = req.body; // Expecting { profile: { ... } }

        // Use findByIdAndUpdate with $set to update specific fields in nested object if needed, 
        // or just replace the profile object.
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { profile: profile } }, // This replaces the entire profile object with the new one
            { new: true } // Return updated doc
        ).select("-password");

        res.status(200).json({ message: "Profile Updated Successfully", user: updatedUser });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
