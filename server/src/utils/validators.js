const { SUPPORTED_FILE_TYPES, MAX_FILE_SIZE } = require("./constants");
const AppError = require("./errors");

/**
 * Validate file upload
 */
function validateFile(file) {
  if (!file) {
    throw new AppError("No file provided", 400);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new AppError(
      `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`,
      400
    );
  }

  if (!SUPPORTED_FILE_TYPES.includes(file.mimetype)) {
    throw new AppError(
      "Unsupported file type. Supported: PDF, DOCX, TXT",
      400
    );
  }

  return true;
}

/**
 * Validate required fields
 */
function validateRequired(data, requiredFields) {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === "string" && !data[field].trim())) {
      throw new AppError(`Missing required field: ${field}`, 400);
    }
  }
  return true;
}

/**
 * Validate text input length
 */
function validateTextLength(text, minLength = 10, maxLength = 10000) {
  if (!text || text.length < minLength) {
    throw new AppError(
      `Text must be at least ${minLength} characters`,
      400
    );
  }

  if (text.length > maxLength) {
    throw new AppError(
      `Text must not exceed ${maxLength} characters`,
      400
    );
  }

  return true;
}

module.exports = {
  validateFile,
  validateRequired,
  validateTextLength,
};
