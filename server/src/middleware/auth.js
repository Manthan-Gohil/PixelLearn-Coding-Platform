const AppError = require("../utils/errors");

/**
 * Authentication middleware - Verify Bearer token
 * In production, verify with Clerk or your auth provider
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized - Missing or invalid token", 401));
  }

  // Extract user ID from token (in production, verify with Clerk)
  req.userId = "user_001";
  req.user = {
    id: "user_001",
    subscription: "pro",
  };

  next();
}

module.exports = authMiddleware;
