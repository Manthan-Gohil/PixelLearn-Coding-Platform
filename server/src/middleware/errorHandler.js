/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("[ERROR]", {
    status: statusCode,
    message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  res.status(statusCode).json({
    error: message,
    status: statusCode,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;
