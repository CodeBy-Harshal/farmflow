const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  getUserGrowth,
} = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth");

router.get("/me", authMiddleware(), getMyProfile);
router.put("/me", authMiddleware(), updateMyProfile);

// Admin only
router.get("/", authMiddleware(["ADMIN"]), getAllUsers);
router.get("/stats/growth", authMiddleware(["ADMIN"]), getUserGrowth);

module.exports = router;
