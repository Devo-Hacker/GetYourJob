import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// AI's job here is ONLY extraction - turning messy resume text into
// structured data. It never invents the final readiness score; that's
// calculated deterministically later in skillAnalyzer.js (next phase).
export async function extractSkillsFromResume(resumeText) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/```$/, "").trim();

  return JSON.parse(cleaned);
}
