const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "10mb" }));

// ===== Mock Database =====
const users = new Map();
const enrollments = new Map();
const progress = new Map();

// ===== Auth Middleware (simulated Clerk verification) =====
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // In production, verify with Clerk
    req.userId = "user_001";
    next();
}

// ===== Subscription Middleware =====
function premiumMiddleware(req, res, next) {
    const userId = req.userId;
    const user = users.get(userId) || { subscription: "pro" };
    if (user.subscription !== "pro") {
        return res.status(403).json({ error: "Pro subscription required" });
    }
    next();
}

// ===== Health Check =====
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ===== User Routes =====
app.get("/api/user/profile", authMiddleware, (req, res) => {
    const user = users.get(req.userId) || {
        id: req.userId,
        name: "Alex Developer",
        email: "learner@pixellearn.com",
        subscription: "pro",
        xp: 2450,
        streak: 12,
        badges: [],
        enrolledCourses: [],
        completedExercises: [],
    };
    res.json(user);
});

app.put("/api/user/profile", authMiddleware, (req, res) => {
    const user = users.get(req.userId) || {};
    const updated = { ...user, ...req.body, id: req.userId };
    users.set(req.userId, updated);
    res.json(updated);
});

// ===== Course Routes =====
app.post("/api/courses/enroll", authMiddleware, (req, res) => {
    const { courseId } = req.body;
    const userEnrollments = enrollments.get(req.userId) || [];
    if (!userEnrollments.includes(courseId)) {
        userEnrollments.push(courseId);
        enrollments.set(req.userId, userEnrollments);
    }
    res.json({ success: true, enrolledCourses: userEnrollments });
});

app.get("/api/courses/enrolled", authMiddleware, (req, res) => {
    const userEnrollments = enrollments.get(req.userId) || [];
    res.json({ enrolledCourses: userEnrollments });
});

// ===== Progress Routes =====
app.post("/api/progress/complete", authMiddleware, (req, res) => {
    const { exerciseId, xpReward } = req.body;
    const userProgress = progress.get(req.userId) || {
        completedExercises: [],
        xp: 0,
        streak: 0,
    };

    if (!userProgress.completedExercises.includes(exerciseId)) {
        userProgress.completedExercises.push(exerciseId);
        userProgress.xp += xpReward || 0;
        userProgress.streak += 1;
        progress.set(req.userId, userProgress);
    }

    res.json({ success: true, progress: userProgress });
});

app.get("/api/progress", authMiddleware, (req, res) => {
    const userProgress = progress.get(req.userId) || {
        completedExercises: [],
        xp: 0,
        streak: 0,
    };
    res.json(userProgress);
});

// ===== Code Execution Route =====
app.post("/api/execute", async (req, res) => {
    const { code, language, input } = req.body;

    if (!code || !language) {
        return res.status(400).json({ error: "Code and language are required" });
    }

    const LANGUAGE_MAP = {
        python: { language: "python", version: "3.10.0" },
        javascript: { language: "javascript", version: "18.15.0" },
        typescript: { language: "typescript", version: "5.0.3" },
        java: { language: "java", version: "15.0.2" },
        cpp: { language: "c++", version: "10.2.0" },
        c: { language: "c", version: "10.2.0" },
    };

    const langConfig = LANGUAGE_MAP[language.toLowerCase()];
    if (!langConfig) {
        return res.status(400).json({ error: `Unsupported language: ${language}` });
    }

    const startTime = Date.now();

    try {
        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: langConfig.language,
                version: langConfig.version,
                files: [{ content: code }],
                stdin: input || "",
                run_timeout: 10000,
            }),
        });

        const data = await response.json();
        const executionTime = Date.now() - startTime;

        if (data.run) {
            res.json({
                output: (data.run.stdout || "").trimEnd(),
                error: data.run.stderr || "",
                executionTime,
                success: data.run.code === 0,
            });
        } else if (data.compile && data.compile.stderr) {
            res.json({
                output: "",
                error: data.compile.stderr,
                executionTime: Date.now() - startTime,
                success: false,
            });
        } else {
            res.json({
                output: "",
                error: "Execution failed",
                executionTime: Date.now() - startTime,
                success: false,
            });
        }
    } catch (error) {
        res.json({
            output: "",
            error: "Execution service unavailable",
            executionTime: Date.now() - startTime,
            success: false,
        });
    }
});

// ===== AI Routes =====
app.post("/api/ai/career-qa", authMiddleware, premiumMiddleware, async (req, res) => {
    const { question } = req.body;

    // Mock AI response (replace with Groq API in production)
    const response = `## Career Guidance\n\nBased on your question: "${question}"\n\n### Key Recommendations\n1. Focus on building practical projects\n2. Learn industry-standard tools and frameworks\n3. Network with professionals in the field\n4. Keep learning and staying updated\n\n### Estimated Timeline\n- 3-6 months for focused preparation\n- Regular practice and coding challenges\n- Build 3-5 portfolio projects`;

    res.json({ result: response });
});

app.post("/api/ai/resume-analyze", authMiddleware, premiumMiddleware, async (req, res) => {
    const { resumeText } = req.body;

    // Mock response
    res.json({
        result: JSON.stringify({
            atsScore: 72,
            overallFeedback: "Good structure, needs keyword optimization",
            skillsGap: ["Cloud Computing", "System Design", "TypeScript"],
            formattingFeedback: ["Use consistent formatting", "Add more metrics"],
            missingKeywords: ["Agile", "CI/CD", "Docker"],
            improvements: [
                { section: "Summary", suggestion: "Add professional summary", priority: "high" },
                { section: "Experience", suggestion: "Quantify achievements", priority: "high" },
            ],
        }),
    });
});

app.post("/api/ai/roadmap", authMiddleware, premiumMiddleware, async (req, res) => {
    const { desiredRole, currentSkills, experienceLevel } = req.body;

    // Mock response
    res.json({
        result: JSON.stringify([
            {
                step: 1,
                title: "Foundation",
                description: `Build core skills for ${desiredRole}`,
                duration: "2-3 months",
                skills: ["HTML/CSS", "JavaScript", "Git"],
                resources: ["freeCodeCamp", "MDN"],
                milestone: "Build 3 projects",
            },
            {
                step: 2,
                title: "Specialization",
                description: "Deep dive into specialized tools",
                duration: "2-3 months",
                skills: ["React", "Node.js", "Databases"],
                resources: ["PixelLearn", "Documentation"],
                milestone: "Build a full-stack app",
            },
            {
                step: 3,
                title: "Job Ready",
                description: "Prepare for interviews and job search",
                duration: "1-2 months",
                skills: ["DSA", "System Design", "Soft Skills"],
                resources: ["LeetCode", "Interview Prep"],
                milestone: "Start applying for jobs",
            },
        ]),
    });
});

// ===== Subscription Routes =====
app.post("/api/subscription/update", authMiddleware, (req, res) => {
    const { plan } = req.body;
    const user = users.get(req.userId) || {};
    user.subscription = plan;
    users.set(req.userId, user);
    res.json({ success: true, subscription: plan });
});

// ===== Referral Routes =====
app.post("/api/referral/track", authMiddleware, (req, res) => {
    const { referralCode } = req.body;
    res.json({ success: true, message: "Referral tracked" });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});

// ===== Start Server =====
app.listen(PORT, () => {
    console.log(`
  ╔══════════════════════════════════════╗
  ║  PixelLearn API Server               ║
  ║  Running on port ${PORT}               ║
  ║  http://localhost:${PORT}               ║
  ╚══════════════════════════════════════╝
  `);
});
