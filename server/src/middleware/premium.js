const AppError = require("../utils/errors");

/**
 * Premium subscription middleware - Check if user has pro subscription
 */
function premiumMiddleware(req, res, next) {
  const user = req.user || { subscription: "free" };

  if (user.subscription !== "pro") {
    return next(
      new AppError("Pro subscription required to access this feature", 403)
    );
  }

  next();
}

module.exports = premiumMiddleware;
