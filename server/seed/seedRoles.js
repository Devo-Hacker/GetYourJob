import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Role from "../models/Role.js";

dotenv.config();

const roles = [
  {
    name: "Full-Stack Developer",
    skills: [
      { name: "JavaScript", weight: 10 },
      { name: "React", weight: 10 },
      { name: "Node.js", weight: 9 },
      { name: "Express.js", weight: 8 },
      { name: "MongoDB", weight: 7 },
      { name: "SQL", weight: 6 },
      { name: "REST API", weight: 8 },
      { name: "Git", weight: 7 },
      { name: "HTML/CSS", weight: 7 },
      { name: "TypeScript", weight: 6 },
      { name: "Docker", weight: 6 },
      { name: "AWS", weight: 6 },
      { name: "System Design", weight: 7 },
      { name: "Testing", weight: 5 },
      { name: "CI/CD", weight: 5 },
      { name: "Redis", weight: 4 },
    ],
  },
  {
    name: "Backend Developer",
    skills: [
      { name: "Node.js", weight: 10 },
      { name: "Express.js", weight: 9 },
      { name: "MongoDB", weight: 8 },
      { name: "SQL", weight: 8 },
      { name: "REST API", weight: 9 },
      { name: "System Design", weight: 8 },
      { name: "Docker", weight: 7 },
      { name: "Redis", weight: 6 },
      { name: "AWS", weight: 6 },
      { name: "Testing", weight: 6 },
      { name: "CI/CD", weight: 5 },
      { name: "Git", weight: 6 },
      { name: "Kubernetes", weight: 5 },
      { name: "Java", weight: 6 },
      { name: "Spring Boot", weight: 5 },
    ],
  },
  {
    name: "Frontend Developer",
    skills: [
      { name: "JavaScript", weight: 10 },
      { name: "React", weight: 10 },
      { name: "HTML/CSS", weight: 9 },
      { name: "TypeScript", weight: 7 },
      { name: "Git", weight: 6 },
      { name: "Testing", weight: 5 },
      { name: "REST API", weight: 5 },
      { name: "Figma", weight: 4 },
      { name: "System Design", weight: 4 },
      { name: "CI/CD", weight: 3 },
    ],
  },
  {
    name: "Mobile Developer",
    skills: [
      { name: "React Native", weight: 9 },
      { name: "Flutter", weight: 8 },
      { name: "Kotlin", weight: 8 },
      { name: "Swift", weight: 8 },
      { name: "Java", weight: 6 },
      { name: "REST API", weight: 7 },
      { name: "Git", weight: 6 },
      { name: "Firebase", weight: 6 },
      { name: "SQLite", weight: 5 },
      { name: "CI/CD", weight: 4 },
      { name: "Testing", weight: 5 },
      { name: "UI Design", weight: 4 },
    ],
  },
  {
    name: "UI/UX Designer",
    skills: [
      { name: "Figma", weight: 10 },
      { name: "Wireframing", weight: 9 },
      { name: "Prototyping", weight: 8 },
      { name: "User Research", weight: 8 },
      { name: "Design Systems", weight: 7 },
      { name: "Usability Testing", weight: 7 },
      { name: "Adobe XD", weight: 6 },
      { name: "Sketch", weight: 5 },
      { name: "HTML/CSS", weight: 5 },
      { name: "Accessibility", weight: 6 },
      { name: "Communication", weight: 5 },
    ],
  },
  {
    name: "Machine Learning Engineer",
    skills: [
      { name: "Python", weight: 10 },
      { name: "Machine Learning", weight: 10 },
      { name: "TensorFlow", weight: 8 },
      { name: "PyTorch", weight: 8 },
      { name: "Pandas", weight: 7 },
      { name: "NumPy", weight: 7 },
      { name: "Scikit-learn", weight: 7 },
      { name: "SQL", weight: 6 },
      { name: "Statistics", weight: 8 },
      { name: "Deep Learning", weight: 9 },
      { name: "Data Visualization", weight: 5 },
      { name: "Docker", weight: 6 },
      { name: "Git", weight: 5 },
      { name: "AWS", weight: 6 },
      { name: "MLOps", weight: 6 },
      { name: "Jupyter", weight: 4 },
    ],
  },
  {
    name: "Data Scientist",
    skills: [
      { name: "Python", weight: 10 },
      { name: "Machine Learning", weight: 9 },
      { name: "Statistics", weight: 9 },
      { name: "Pandas", weight: 8 },
      { name: "NumPy", weight: 7 },
      { name: "SQL", weight: 8 },
      { name: "Data Visualization", weight: 7 },
      { name: "Deep Learning", weight: 6 },
      { name: "R", weight: 5 },
      { name: "Jupyter", weight: 5 },
      { name: "A/B Testing", weight: 5 },
      { name: "Communication", weight: 5 },
    ],
  },
  {
    name: "Data Analyst",
    skills: [
      { name: "SQL", weight: 10 },
      { name: "Python", weight: 8 },
      { name: "Excel", weight: 7 },
      { name: "Data Visualization", weight: 8 },
      { name: "Statistics", weight: 7 },
      { name: "Pandas", weight: 6 },
      { name: "Power BI", weight: 6 },
      { name: "Tableau", weight: 6 },
      { name: "Communication", weight: 5 },
    ],
  },
  {
    name: "DevOps Engineer",
    skills: [
      { name: "Docker", weight: 10 },
      { name: "Kubernetes", weight: 10 },
      { name: "AWS", weight: 9 },
      { name: "CI/CD", weight: 9 },
      { name: "Linux", weight: 8 },
      { name: "Terraform", weight: 7 },
      { name: "System Design", weight: 6 },
      { name: "Git", weight: 5 },
      { name: "Monitoring", weight: 5 },
      { name: "Networking", weight: 5 },
    ],
  },
];

// Names that used to be seeded under a different string before a rename -
// upsert-by-name can't clean these up on its own, so we delete them here.
const RENAMED_AWAY = ["ML Engineer"];

async function run() {
  await connectDB();

  const { deletedCount } = await Role.deleteMany({ name: { $in: RENAMED_AWAY } });
  if (deletedCount > 0) {
    console.log(`Removed ${deletedCount} orphaned role(s) from a prior rename: ${RENAMED_AWAY.join(", ")}`);
  }

  for (const role of roles) {
    await Role.findOneAndUpdate({ name: role.name }, role, { upsert: true });
    console.log(`Seeded: ${role.name}`);
  }
  console.log("Done.");
  process.exit(0);
}

run();
