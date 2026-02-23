const AppError = require("../utils/errors");

/**
 * Extract text from uploaded file based on file type
 */
async function extractTextFromFile(file) {
  const mimeType = file.mimetype;

  if (mimeType === "text/plain") {
    return extractFromTxt(file);
  } else if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractFromDocx(file);
  } else if (mimeType === "application/pdf") {
    return extractFromPdf(file);
  } else {
    throw new AppError("Unsupported file type", 400);
  }
}

/**
 * Extract text from TXT file
 */
function extractFromTxt(file) {
  try {
    const text = file.buffer.toString("utf-8");
    if (!text || text.trim().length === 0) {
      throw new Error("TXT file is empty");
    }
    return text;
  } catch (error) {
    throw new AppError(`Failed to extract text from TXT file: ${error.message}`, 400);
  }
}

/**
 * Extract text from DOCX file
 * Uses mammoth library
 */
async function extractFromDocx(file) {
  try {
    const mammoth = require("mammoth");
    const result = await mammoth.extractRawText({ buffer: file.buffer });

    if (!result.value || result.value.trim().length === 0) {
      throw new Error("DOCX file is empty or unreadable");
    }

    return result.value;
  } catch (error) {
    // Fallback: if mammoth not installed, return instructional message
    if (error.code === "MODULE_NOT_FOUND") {
      throw new AppError(
        "DOCX parsing not available. Please install mammoth library.",
        500
      );
    }
    throw new AppError(
      `Failed to extract text from DOCX file: ${error.message}`,
      400
    );
  }
}

/**
 * Extract text from PDF file
 * Uses pdfparse library
 */
async function extractFromPdf(file) {
  try {
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(file.buffer);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error("PDF file is empty or unreadable");
    }

    return data.text;
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      throw new AppError(
        "PDF parsing not available. Please install pdf-parse library.",
        500
      );
    }
    throw new AppError(
      `Failed to extract text from PDF file: ${error.message}`,
      400
    );
  }
}

module.exports = {
  extractTextFromFile,
};
