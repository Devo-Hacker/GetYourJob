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
    phases: [
      { title: "Foundation Building", description: "Strengthen core concepts and fundamental skills.", tone: "indigo", skills: ["JavaScript", "HTML/CSS", "Git", "TypeScript"], estimatedHours: 32 },
      { title: "Frontend Development", description: "Build interactive, tested UIs.", tone: "sky", skills: ["React", "REST API", "Testing"], estimatedHours: 28 },
      { title: "Backend Development", description: "Build strong backend and database expertise.", tone: "amber", skills: ["Node.js", "Express.js", "MongoDB", "SQL", "Redis"], estimatedHours: 36 },
      { title: "DevOps & Deployment", description: "Learn deployment, CI/CD and cloud services.", tone: "emerald", skills: ["Docker", "AWS", "CI/CD", "System Design"], estimatedHours: 30 },
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
    phases: [
      { title: "Foundation", description: "Core tools every backend dev needs.", tone: "indigo", skills: ["Git", "SQL", "REST API"], estimatedHours: 24 },
      { title: "Core Backend", description: "Build and test real APIs, in JS and Java.", tone: "sky", skills: ["Node.js", "Express.js", "MongoDB", "Java", "Spring Boot", "Testing"], estimatedHours: 42 },
      { title: "Scaling & Design", description: "Design systems that scale.", tone: "amber", skills: ["System Design", "Redis", "Kubernetes"], estimatedHours: 30 },
      { title: "Deployment", description: "Ship and automate releases.", tone: "emerald", skills: ["Docker", "AWS", "CI/CD"], estimatedHours: 26 },
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
    phases: [
      { title: "Foundation", description: "The building blocks of the web.", tone: "indigo", skills: ["HTML/CSS", "Git", "JavaScript"], estimatedHours: 26 },
      { title: "React Ecosystem", description: "Build real, tested React apps.", tone: "sky", skills: ["React", "TypeScript", "Testing"], estimatedHours: 32 },
      { title: "Polish & Design", description: "Design sense and shipping.", tone: "emerald", skills: ["Figma", "System Design", "REST API", "CI/CD"], estimatedHours: 22 },
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
    phases: [
      { title: "Foundation", description: "Core tools and mobile UI thinking.", tone: "indigo", skills: ["Git", "Java", "UI Design"], estimatedHours: 22 },
      { title: "Cross-Platform Development", description: "Build for iOS and Android at once.", tone: "sky", skills: ["React Native", "Flutter"], estimatedHours: 34 },
      { title: "Native Platforms", description: "Go deeper on each native stack.", tone: "amber", skills: ["Kotlin", "Swift"], estimatedHours: 32 },
      { title: "Backend Integration & Ship", description: "Connect, test and release your app.", tone: "emerald", skills: ["REST API", "Firebase", "SQLite", "Testing", "CI/CD"], estimatedHours: 30 },
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
    phases: [
      { title: "Foundations", description: "How to think about a design problem.", tone: "indigo", skills: ["Wireframing", "User Research", "Communication"], estimatedHours: 18 },
      { title: "Design Tools", description: "Get fluent in the industry's toolset.", tone: "sky", skills: ["Figma", "Adobe XD", "Sketch"], estimatedHours: 26 },
      { title: "Craft & Systems", description: "Design that scales across a product.", tone: "amber", skills: ["Prototyping", "Design Systems", "Accessibility"], estimatedHours: 24 },
      { title: "Validate & Handoff", description: "Test with users, hand off to devs.", tone: "emerald", skills: ["Usability Testing", "HTML/CSS"], estimatedHours: 18 },
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
    phases: [
      { title: "Foundations", description: "Math and tooling for ML.", tone: "indigo", skills: ["Python", "Statistics", "Git", "Jupyter"], estimatedHours: 30 },
      { title: "Core ML", description: "Classic machine learning.", tone: "sky", skills: ["Machine Learning", "Pandas", "NumPy", "Scikit-learn"], estimatedHours: 40 },
      { title: "Deep Learning", description: "Neural networks in practice.", tone: "amber", skills: ["Deep Learning", "TensorFlow", "PyTorch"], estimatedHours: 38 },
      { title: "Production", description: "Ship models that stay working.", tone: "emerald", skills: ["MLOps", "Docker", "AWS", "SQL", "Data Visualization"], estimatedHours: 34 },
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
    phases: [
      { title: "Foundations", description: "The math and tools of data science.", tone: "indigo", skills: ["Python", "Statistics", "SQL", "Jupyter"], estimatedHours: 28 },
      { title: "Analysis & Modeling", description: "From raw data to a working model.", tone: "sky", skills: ["Pandas", "NumPy", "Machine Learning", "Data Visualization"], estimatedHours: 34 },
      { title: "Advanced Topics", description: "Go deeper, test rigorously.", tone: "amber", skills: ["Deep Learning", "R", "A/B Testing"], estimatedHours: 28 },
      { title: "Communication & Impact", description: "Turn findings into decisions.", tone: "emerald", skills: ["Communication"], estimatedHours: 10 },
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
    phases: [
      { title: "Foundations", description: "Query and reason about data.", tone: "indigo", skills: ["Excel", "SQL", "Statistics"], estimatedHours: 22 },
      { title: "Analysis Tools", description: "Analyze at scale.", tone: "sky", skills: ["Python", "Pandas", "Data Visualization"], estimatedHours: 26 },
      { title: "Reporting & Communication", description: "Turn analysis into decisions.", tone: "emerald", skills: ["Power BI", "Tableau", "Communication"], estimatedHours: 20 },
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
    phases: [
      { title: "Foundations", description: "The systems layer.", tone: "indigo", skills: ["Linux", "Git", "Networking"], estimatedHours: 24 },
      { title: "Containers & Orchestration", description: "Package and run at scale.", tone: "sky", skills: ["Docker", "Kubernetes"], estimatedHours: 32 },
      { title: "Cloud & Automation", description: "Automate infrastructure.", tone: "amber", skills: ["AWS", "Terraform", "CI/CD"], estimatedHours: 30 },
      { title: "Reliability", description: "Keep it running.", tone: "emerald", skills: ["System Design", "Monitoring"], estimatedHours: 18 },
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