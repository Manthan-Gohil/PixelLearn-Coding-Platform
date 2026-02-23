require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 5000,
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    PISTON_API_URL: "https://emkc.org/api/v2/piston/execute",
    LANGUAGE_MAP: {
        python: { language: "python", version: "3.10.0" },
        javascript: { language: "javascript", version: "18.15.0" },
        typescript: { language: "typescript", version: "5.0.3" },
        java: { language: "java", version: "15.0.2" },
        cpp: { language: "c++", version: "10.2.0" },
        c: { language: "c", version: "10.2.0" },
    }
};
