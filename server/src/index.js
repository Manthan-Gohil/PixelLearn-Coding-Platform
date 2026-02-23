const express = require("express");
require("dotenv").config();

// Config imports
const corsMiddleware = require("./config/cors");
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/auth");

// Route imports
const aiRoutes = require("./routes/aiRoutes");
const userRoutes = require("./routes/userRoutes");

// Legacy route handlers (backward compatibility)
const {
  handleHealthCheck,
  handleCodeExecute,
} = require("./controllers/legacyController");

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware Setup =====
app.use(corsMiddleware);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ===== Health Check =====
app.get("/api/health", handleHealthCheck);

// ===== API Routes =====
// AI routes (career-qa, resume-analyze, roadmap)
app.use("/api/ai", aiRoutes);

// User routes
app.use("/api/user", userRoutes);

// ===== Legacy Routes (backward compatibility) =====
// Code execution endpoint
app.post("/api/execute", handleCodeExecute);

// Progress routes (mock)
app.post("/api/progress/complete", authMiddleware, (req, res) => {
  const { exerciseId, xpReward } = req.body;
  res.json({ success: true, xp: xpReward || 0 });
});

app.get("/api/progress", authMiddleware, (req, res) => {
  res.json({ completedExercises: [], xp: 0, streak: 0 });
});

// Course routes (mock)
app.post("/api/courses/enroll", authMiddleware, (req, res) => {
  const { courseId } = req.body;
  res.json({ success: true, enrolledCourses: [courseId] });
});

app.get("/api/courses/enrolled", authMiddleware, (req, res) => {
  res.json({ enrolledCourses: [] });
});

// Subscription routes (mock)
app.post("/api/subscription/update", authMiddleware, (req, res) => {
  const { plan } = req.body;
  res.json({ success: true, subscription: plan });
});

// ===== Error Handler (must be last) =====
app.use(errorHandler);

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
    method: req.method,
  });
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║  PixelLearn API Server (Refactored)  ║
  ║  Running on port ${PORT}               ║
  ║  http://localhost:${PORT}               ║
  ╚══════════════════════════════════════╝
  `);

  if (!process.env.GROQ_API_KEY) {
    console.warn("⚠️  GROQ_API_KEY not configured. AI features will use mock responses.");
  }
});

module.exports = app;
