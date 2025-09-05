const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");

// Public
router.post("/register", register);
router.post("/login", login);

// Profile
router.get("/me", authMiddleware(["ADMIN", "FARMER", "BUYER"]), getProfile);

module.exports = router;
