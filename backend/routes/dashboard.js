const router = require("express").Router();
const dashboardController = require("../controllers/dashboardController");

// GET /api/dashboard/stats
router.get("/stats", dashboardController.getDashboardStats);

module.exports = router;
