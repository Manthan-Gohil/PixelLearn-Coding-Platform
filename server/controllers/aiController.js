const aiService = require("../services/aiService");

const careerQA = async (req, res) => {
    const { question } = req.body;
    const response = await aiService.getCareerGuidance(question);
    res.json({ result: response });
};

const resumeAnalyze = async (req, res) => {
    const { resumeText } = req.body;
    const response = await aiService.analyzeResume(resumeText);
    res.json({ result: response });
};

const roadmap = async (req, res) => {
    const { desiredRole, currentSkills, experienceLevel } = req.body;
    const response = await aiService.getRoadmap(desiredRole, currentSkills, experienceLevel);
    res.json({ result: response });
};

module.exports = {
    careerQA,
    resumeAnalyze,
    roadmap
};
