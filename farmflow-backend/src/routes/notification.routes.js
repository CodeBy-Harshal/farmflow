const express = require("express");
const router = express.Router();
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  sendNotification,
} = require("../controllers/notification.controller");
const authMiddleware = require("../middleware/auth");

// Get logged-in user's notifications
router.get("/", authMiddleware(["BUYER","FARMER","ADMIN"]), getMyNotifications);

// Mark one as read
router.put("/:id/read", authMiddleware(["BUYER","FARMER","ADMIN"]), markAsRead);

// Mark all as read
router.put("/read/all", authMiddleware(["BUYER","FARMER","ADMIN"]), markAllAsRead);

// Admin only -- send notification
router.post("/", authMiddleware(["ADMIN"]), sendNotification);

module.exports = router;
