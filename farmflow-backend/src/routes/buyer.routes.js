const express = require("express");
const router = express.Router();
const { getBuyerDashboard } = require("../controllers/buyer.controller");
const authMiddleware = require("../middleware/auth");

// Buyer dashboard
router.get("/dashboard", authMiddleware(["BUYER"]), getBuyerDashboard);

module.exports = router;
