const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const courseRoutes = require("./courseRoutes");
const progressRoutes = require("./progressRoutes");
const executionRoutes = require("./executionRoutes");
const aiRoutes = require("./aiRoutes");
const { authMiddleware } = require("../middleware/auth");
const { updateSubscription } = require("../controllers/subscriptionController");

// Health check
router.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Subscription (direct in index or separate file)
router.post("/subscription/update", authMiddleware, updateSubscription);

// Other routes
router.use("/user", userRoutes);
router.use("/courses", courseRoutes);
router.use("/progress", progressRoutes);
router.use("/execute", executionRoutes);
router.use("/ai", aiRoutes);

// Referral
router.post("/referral/track", authMiddleware, (req, res) => {
    res.json({ success: true, message: "Referral tracked" });
});

module.exports = router;
