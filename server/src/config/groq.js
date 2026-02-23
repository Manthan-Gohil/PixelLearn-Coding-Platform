const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

if (!GROQ_API_KEY) {
  console.warn("⚠️ GROQ_API_KEY not set. AI features will use mock responses.");
}

module.exports = {
  GROQ_API_KEY,
  GROQ_API_URL,
  MODEL,
};
