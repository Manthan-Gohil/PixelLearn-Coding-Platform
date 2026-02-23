const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const userController = require("../controllers/userController");

/**
 * GET /api/user/profile
 * Get current user profile
 */
router.get("/profile", authMiddleware, userController.getUserProfile);

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put("/profile", authMiddleware, userController.updateUserProfile);

module.exports = router;
