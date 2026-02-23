const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");
const { authMiddleware } = require("../middleware/auth");

router.post("/enroll", authMiddleware, courseController.enroll);
router.get("/enrolled", authMiddleware, courseController.getEnrolledCourses);

module.exports = router;
