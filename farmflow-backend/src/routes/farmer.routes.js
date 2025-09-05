const express = require("express");
const router = express.Router();
const { getFarmerDashboard } = require("../controllers/farmer.controller");
const authMiddleware = require("../middleware/auth");

// Farmer dashboard
router.get("/dashboard", authMiddleware(["FARMER"]), getFarmerDashboard);

module.exports = router;
