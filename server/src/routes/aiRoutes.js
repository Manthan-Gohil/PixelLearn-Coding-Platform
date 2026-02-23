const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/auth");
const premiumMiddleware = require("../middleware/premium");
const aiController = require("../controllers/aiController");

// Multer configuration for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Supported: PDF, DOCX, TXT"), false);
    }
  },
});

/**
 * POST /api/ai/career-qa
 * Career Q&A with text input
 */
router.post(
  "/career-qa",
  authMiddleware,
  premiumMiddleware,
  aiController.handleCareerQA
);

/**
 * POST /api/ai/resume-analyze
 * Resume analysis with file upload
 */
router.post(
  "/resume-analyze",
  authMiddleware,
  premiumMiddleware,
  upload.single("resume"),
  aiController.handleResumeAnalysis
);

/**
 * POST /api/ai/roadmap
 * Roadmap generation with text inputs
 */
router.post(
  "/roadmap",
  authMiddleware,
  premiumMiddleware,
  aiController.handleRoadmapGeneration
);

module.exports = router;
