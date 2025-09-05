const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getMySales,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getOrderStats,
  getOrderById,
  getNextStatuses,
  getAllStatuses,
} = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth");

// Buyer
router.post("/", authMiddleware(["BUYER"]), placeOrder);
router.get("/my", authMiddleware(["BUYER"]), getMyOrders);

// Cancel order (Buyer only)
router.post("/:id/cancel", authMiddleware(["BUYER"]), cancelOrder);

// Farmer
router.get("/sales", authMiddleware(["FARMER"]), getMySales);

// Update order status (Farmer/Admin only)
router.put("/:id/status", authMiddleware(["FARMER", "ADMIN"]), updateOrderStatus);

// Hard delete (only if CANCELLED)
router.delete("/:id/hard", authMiddleware(["FARMER", "ADMIN"]), deleteOrder);

// Admin
router.get("/", authMiddleware(["ADMIN"]), getAllOrders);
router.get("/statuses", authMiddleware(["ADMIN"]), getAllStatuses);

// Stats
router.get("/stats", authMiddleware(["BUYER", "FARMER", "ADMIN"]), getOrderStats);

// Next statuses (for Farmer/Admin to check allowed transitions)
router.get("/:id/next-statuses", authMiddleware(["FARMER", "ADMIN"]), getNextStatuses);

// Keep this LAST (single order fetch)
router.get("/:id", authMiddleware(["BUYER", "FARMER", "ADMIN"]), getOrderById);

module.exports = router;
