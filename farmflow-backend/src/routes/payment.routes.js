const express = require("express");
const router = express.Router();
const {
  initiateUpiPayment,
  getPaymentById,
  confirmPayment,
} = require("../controllers/payment.controller");
const auth = require("../middleware/auth");

// Buyer initiates a UPI link/QR for an order
router.post("/initiate", auth(["BUYER"]), initiateUpiPayment);

// Buyer confirms payment after paying
router.post("/:id/confirm", auth(["BUYER"]), confirmPayment);

// Anyone involved can check payment status
router.get("/:id", auth(["BUYER", "FARMER", "ADMIN"]), getPaymentById);

module.exports = router;
