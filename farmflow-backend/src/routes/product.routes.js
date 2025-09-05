const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});
const upload = multer({ storage });

const {
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  hardDeleteProduct,
  updateProductStatus,
  getMyProducts,
  getPendingProducts,
  getProductStats,
  searchProducts,
  getProductStatuses,
} = require("../controllers/product.controller");

const authMiddleware = require("../middleware/auth");

// Public
router.get("/", getAllProducts);
router.get("/search", searchProducts);

// Farmer
router.get("/my", authMiddleware(["FARMER"]), getMyProducts);
router.post("/", authMiddleware(["FARMER"]), upload.array("images", 5), addProduct);
router.put("/:id", authMiddleware(["FARMER", "ADMIN"]), upload.array("images", 5), updateProduct);
router.delete("/:id", authMiddleware(["FARMER", "ADMIN"]), deleteProduct);
router.delete("/:id/hard", authMiddleware(["FARMER", "ADMIN"]), hardDeleteProduct);

// Admin
router.get("/pending", authMiddleware(["ADMIN"]), getPendingProducts);
router.put("/:id/status", authMiddleware(["ADMIN"]), updateProductStatus);
router.get("/statuses", authMiddleware(["ADMIN"]), getProductStatuses);

// Stats
router.get("/stats", authMiddleware(["FARMER", "ADMIN"]), getProductStats);

// Keep last
router.get("/:id", getProductById);

module.exports = router;
