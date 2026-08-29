import OpenAI from "openai";

// Groq's API is OpenAI-compatible, so we just point the OpenAI SDK at Groq's
// base URL. Free tier, no credit card - https://console.groq.com/keys
//
// NOTE: the client is created lazily (inside the function, not at module
// load time). ES module imports resolve before dotenv.config() runs in
// server.js, so building this at the top of the file would read
// process.env.GROQ_API_KEY before it's actually set.
function getGroqClient() {
  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });
}

// AI's job here is ONLY extraction - turning messy resume text into
// structured data. It never invents the final readiness score; that's
// calculated deterministically later in skillAnalyzer.js (next phase).
export async function extractSkillsFromResume(resumeText) {
  const prompt = `
You are extracting structured data from a resume for a job-readiness app.
Return ONLY valid JSON, no markdown fences, no commentary, in exactly this shape:

{
  "skills": [{ "name": "React", "proficiency": 0.8 }],
  "experience": [{ "title": "...", "company": "...", "duration": "..." }],
  "education": [{ "degree": "...", "institution": "...", "year": "..." }],
  "projects": [{ "name": "...", "description": "..." }]
}

Rules:
- proficiency is your estimate from 0 to 1, based on how prominently and recently the skill appears.
- Only include real, named technical skills (languages, frameworks, tools) - not soft skills.
- If a section has nothing, return an empty array for it.

Resume text:
"""
${resumeText.slice(0, 12000)}
"""
`.trim();

  const groq = getGroqClient();
  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0].message.content.trim();
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/, "").trim();

  return JSON.parse(cleaned);
}
