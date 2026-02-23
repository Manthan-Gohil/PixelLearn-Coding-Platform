const aiService = require("../services/aiService");
const fileService = require("../services/fileService");
const { validateRequired, validateFile, validateTextLength } = require("../utils/validators");
const AppError = require("../utils/errors");

/**
 * Career Q&A Handler
 */
async function handleCareerQA(req, res, next) {
  try {
    const { question } = req.body;

    // Validate input
    validateRequired({ question }, ["question"]);
    validateTextLength(question, 10, 1000);

    const response = await aiService.careerQA(question);

    res.json({
      success: true,
      type: "career-qa",
      result: response,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Resume Analysis Handler - accepts file upload
 */
async function handleResumeAnalysis(req, res, next) {
  try {
    const file = req.file;

    // Validate file upload
    if (!file) {
      throw new AppError("No file provided. Please upload a resume file.", 400);
    }

    validateFile(file);

    // Extract text from file
    const resumeText = await fileService.extractTextFromFile(file);
    validateTextLength(resumeText, 50, 50000);

    // Analyze resume with Groq
    const analysisResult = await aiService.analyzeResume(resumeText);

    res.json({
      success: true,
      type: "resume-analyze",
      result: analysisResult,
      fileName: file.originalname,
      fileSize: file.size,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Roadmap Generator Handler
 */
async function handleRoadmapGeneration(req, res, next) {
  try {
    const { desiredRole, currentSkills, experienceLevel } = req.body;

    // Validate input
    validateRequired(
      { desiredRole },
      ["desiredRole"]
    );
    validateTextLength(desiredRole, 2, 200);

    const skillsArray = currentSkills
      ? (Array.isArray(currentSkills)
          ? currentSkills
          : currentSkills.split(",").map((s) => s.trim()))
      .filter((s) => s.length > 0)
      : [];

    const level = experienceLevel || "beginner";

    const roadmap = await aiService.generateRoadmap(
      desiredRole,
      skillsArray,
      level
    );

    res.json({
      success: true,
      type: "roadmap",
      result: roadmap,
      metadata: {
        desiredRole,
        experienceLevel: level,
        skillsCount: skillsArray.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleCareerQA,
  handleResumeAnalysis,
  handleRoadmapGeneration,
};
