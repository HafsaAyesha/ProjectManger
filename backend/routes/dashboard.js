const router = require("express").Router();
const dashboardController = require("../controllers/dashboardController");

// GET /api/dashboard/stats
router.get("/stats", dashboardController.getDashboardStats);

// GET /api/dashboard/task-stats - NEW: Get task statistics from Kanban
router.get("/task-stats", dashboardController.getTaskStats);

module.exports = router;
