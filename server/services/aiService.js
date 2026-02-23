const getCareerGuidance = async (question) => {
    // Mock AI response (replace with Groq API in production)
    return `## Career Guidance\n\nBased on your question: "${question}"\n\n### Key Recommendations\n1. Focus on building practical projects\n2. Learn industry-standard tools and frameworks\n3. Network with professionals in the field\n4. Keep learning and staying updated\n\n### Estimated Timeline\n- 3-6 months for focused preparation\n- Regular practice and coding challenges\n- Build 3-5 portfolio projects`;
};

const analyzeResume = async (resumeText) => {
    // Mock response
    return JSON.stringify({
        atsScore: 72,
        overallFeedback: "Good structure, needs keyword optimization",
        skillsGap: ["Cloud Computing", "System Design", "TypeScript"],
        formattingFeedback: ["Use consistent formatting", "Add more metrics"],
        missingKeywords: ["Agile", "CI/CD", "Docker"],
        improvements: [
            { section: "Summary", suggestion: "Add professional summary", priority: "high" },
            { section: "Experience", suggestion: "Quantify achievements", priority: "high" },
        ],
    });
};

const getRoadmap = async (desiredRole, currentSkills, experienceLevel) => {
    // Mock response
    return JSON.stringify([
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
    ]);
};

module.exports = {
    getCareerGuidance,
    analyzeResume,
    getRoadmap
};
