const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth");

// Single endpoint for all dashboard data
router.get("/dashboard", authMiddleware(["ADMIN"]), getDashboardStats);

module.exports = router;
