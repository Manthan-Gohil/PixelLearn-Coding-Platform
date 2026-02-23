const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const { authMiddleware, premiumMiddleware } = require("../middleware/auth");

router.post("/career-qa", authMiddleware, premiumMiddleware, aiController.careerQA);
router.post("/resume-analyze", authMiddleware, premiumMiddleware, aiController.resumeAnalyze);
router.post("/roadmap", authMiddleware, premiumMiddleware, aiController.roadmap);

module.exports = router;
