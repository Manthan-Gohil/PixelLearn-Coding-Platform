const { users } = require("../data/mockDb");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // In production, verify with Clerk
    req.userId = "user_001";
    next();
};

const premiumMiddleware = (req, res, next) => {
    const userId = req.userId;
    const user = users.get(userId) || { subscription: "pro" };
    if (user.subscription !== "pro") {
        return res.status(403).json({ error: "Pro subscription required" });
    }
    next();
};

module.exports = {
    authMiddleware,
    premiumMiddleware
};
