import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  BarChart2,
  Map,
  FolderKanban,
  Link2,
  Database,
  Settings,
  Star,
  Bookmark,
  Code2,
  Zap,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

/* ---------------------------------------------
   Small shared primitives
--------------------------------------------- */

function ClayCard({ className = "", children }) {
  return (
    <div
      className={`rounded-[28px] bg-white border border-white shadow-[0_10px_30px_-10px_rgba(76,29,149,0.12)] ${className}`}
    >
      {children}
    </div>
  );
}

function CircularProgress({ percentage, size = 64, stroke = 7, trackColor, barColor }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={barColor}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

/* ---------------------------------------------
   Sidebar
--------------------------------------------- */

function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Briefcase, label: "Jobs" },
    { icon: BarChart2, label: "Skill Gap" },
    { icon: Map, label: "Roadmap" },
    { icon: FolderKanban, label: "Projects" },
    { icon: Link2, label: "Connections" },
    { icon: Database, label: "Storage", badge: "New" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="hidden lg:flex w-56 shrink-0 flex-col bg-white/70 px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
          DS
        </div>
        <span className="font-semibold text-slate-800 tracking-tight">DevSphere</span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ icon: Icon, label, active, badge }) => (
          <button
            key={label}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
              active
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <Icon size={17} strokeWidth={2.1} />
            <span className="flex-1 text-left">{label}</span>
            {badge && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}

/* ---------------------------------------------
   Top stat cards
--------------------------------------------- */

function RoleReadinessCard() {
  return (
    <ClayCard className="bg-gradient-to-br from-violet-500 to-purple-600 border-none text-white p-5 flex flex-col justify-between shadow-[0_15px_30px_-10px_rgba(124,58,237,0.45)]">
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-medium text-violet-100">Role Readiness</span>
        <CircularProgress percentage={76} size={40} stroke={4} trackColor="rgba(255,255,255,0.25)" barColor="#ffffff" />
      </div>
      <div className="mt-3">
        <p className="text-lg font-semibold leading-tight">Full-Stack<br />Developer</p>
        <p className="text-[12px] text-violet-100 mt-1">You are almost there!</p>
      </div>
      <button className="mt-4 text-[12px] font-semibold text-white/95 flex items-center gap-1 self-start">
        View Details <ChevronRight size={13} />
      </button>
    </ClayCard>
  );
}

function BestMatchJobsCard() {
  return (
    <ClayCard className="bg-emerald-50 border-none p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center shadow-sm">
          <Briefcase size={16} className="text-emerald-500" />
        </div>
        <span className="text-[12px] font-semibold text-emerald-600 flex items-center gap-0.5">
          View Jobs <ArrowUpRight size={12} />
        </span>
      </div>
      <div className="mt-3">
        <p className="text-3xl font-bold text-slate-800">12</p>
        <p className="text-[12px] text-slate-500 mt-0.5">Best Match Jobs</p>
      </div>
    </ClayCard>
  );
}

function SkillsAnalysedCard() {
  return (
    <ClayCard className="bg-violet-50 border-none p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center shadow-sm">
          <Star size={16} className="text-violet-500" />
        </div>
        <span className="text-[12px] font-semibold text-violet-600 flex items-center gap-0.5">
          View Skills <ArrowUpRight size={12} />
        </span>
      </div>
      <div className="mt-3">
        <p className="text-3xl font-bold text-slate-800">24</p>
        <p className="text-[12px] text-slate-500 mt-0.5">Skills Analysed</p>
      </div>
    </ClayCard>
  );
}

function ProfileStrengthCard() {
  return (
    <ClayCard className="bg-amber-50 border-none p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-medium text-amber-700">Profile Strength</span>
        <CircularProgress percentage={82} size={40} stroke={4} trackColor="#fde9b8" barColor="#f5a524" />
      </div>
      <div className="mt-3">
        <p className="text-sm font-semibold text-slate-700">Great job! Keep going.</p>
        <p className="text-[12px] text-slate-500 mt-0.5">Improve your profile to increase match score.</p>
      </div>
      <button className="mt-3 text-[12px] font-semibold text-amber-600 flex items-center gap-1 self-start">
        Improve Profile <ChevronRight size={13} />
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Skill overview
--------------------------------------------- */

function SkillPill({ label, tone }) {
  const tones = {
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-rose-100 text-rose-600",
  };
  return (
    <span className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${tones[tone]}`}>
      {label}
    </span>
  );
}

function SkillOverviewCard() {
  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 text-[15px]">Your Skill Overview</h3>
        <button className="text-[12px] font-semibold text-indigo-500">View All</button>
      </div>

      <div className="space-y-3.5">
        <div>
          <p className="text-[11px] font-medium text-slate-400 mb-1.5">Strong Skills</p>
          <div className="flex flex-wrap gap-2">
            <SkillPill label="React" tone="green" />
            <SkillPill label="JavaScript" tone="green" />
            <SkillPill label="Git" tone="green" />
            <SkillPill label="HTML/CSS" tone="green" />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-400 mb-1.5">Developing Skills</p>
          <div className="flex flex-wrap gap-2">
            <SkillPill label="Node.js" tone="amber" />
            <SkillPill label="SQL" tone="amber" />
            <SkillPill label="Express" tone="amber" />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-400 mb-1.5">Needs Improvement</p>
          <div className="flex flex-wrap gap-2">
            <SkillPill label="Docker" tone="red" />
            <SkillPill label="AWS" tone="red" />
            <SkillPill label="Testing" tone="red" />
            <SkillPill label="TypeScript" tone="red" />
          </div>
        </div>
      </div>

      <button className="mt-5 w-full py-2.5 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(124,58,237,0.5)]">
        View Skill Gap Analysis
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Top recommended jobs
--------------------------------------------- */

function JobRow({ title, company, location, match, iconBg, iconColor }) {
  const matchColor = match >= 90 ? "text-emerald-500" : match >= 80 ? "text-amber-500" : "text-rose-500";
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Briefcase size={16} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-slate-800 truncate">{title}</p>
        <p className="text-[12px] text-slate-400 truncate">{company} · {location}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-[13px] font-bold ${matchColor}`}>{match}%</p>
        <p className="text-[10px] text-slate-400">Match</p>
      </div>
      <Bookmark size={15} className="text-slate-300 shrink-0" />
    </div>
  );
}

function TopJobsCard() {
  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-800 text-[15px]">Top Recommended Jobs</h3>
        <button className="text-[12px] font-semibold text-indigo-500">View All</button>
      </div>

      <div className="divide-y divide-slate-100">
        <JobRow title="Frontend Developer" company="ABC Technologies" location="Bangalore" match={91} iconBg="bg-rose-50" iconColor="text-rose-400" />
        <JobRow title="React Developer" company="XYZ Solutions" location="Bangalore" match={87} iconBg="bg-amber-50" iconColor="text-amber-400" />
        <JobRow title="Full Stack Developer" company="InnovateX" location="Bangalore" match={79} iconBg="bg-orange-50" iconColor="text-orange-400" />
      </div>

      <button className="mt-4 w-full py-2.5 rounded-2xl bg-rose-400 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(251,113,133,0.6)]">
        Explore More Jobs
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Skill gaps
--------------------------------------------- */

function GapBar({ label, value, color, priority, priorityColor }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12.5px] font-medium text-slate-600">{label}</span>
        <span className={`text-[10.5px] font-semibold ${priorityColor}`}>{priority}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function SkillGapsCard() {
  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 text-[15px]">Skill Gaps</h3>
        <button className="text-[12px] font-semibold text-indigo-500">View All</button>
      </div>

      <div className="space-y-3.5">
        <GapBar label="Docker" value={30} color="#fb7185" priority="High Priority" priorityColor="text-rose-500" />
        <GapBar label="AWS" value={22} color="#f5a524" priority="High Priority" priorityColor="text-rose-500" />
        <GapBar label="TypeScript" value={55} color="#a855f7" priority="Medium Priority" priorityColor="text-amber-500" />
        <GapBar label="Testing" value={45} color="#22d3ee" priority="Medium Priority" priorityColor="text-amber-500" />
        <GapBar label="System Design" value={68} color="#34d399" priority="Low Priority" priorityColor="text-emerald-500" />
      </div>

      <button className="mt-5 w-full py-2.5 rounded-2xl bg-cyan-400 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(34,211,238,0.55)]">
        Improve These Skills
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   AI recommendations
--------------------------------------------- */

function RecoRow({ text }) {
  return (
    <div className="flex items-start gap-3 bg-white/70 rounded-2xl px-3.5 py-3">
      <div className="w-7 h-7 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
        <Zap size={13} className="text-rose-500" />
      </div>
      <p className="text-[12.5px] text-slate-600 leading-snug">{text}</p>
    </div>
  );
}

function AIRecommendationsCard() {
  return (
    <ClayCard className="bg-rose-50 border-none p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className="text-rose-500" />
        <h3 className="font-semibold text-slate-800 text-[15px]">AI Recommendations For You</h3>
      </div>

      <div className="space-y-2.5">
        <RecoRow text="Learn Docker – High demand in 34% of Full-Stack Developer jobs." />
        <RecoRow text="Build a deployment project – Add DevOps & cloud experience." />
        <RecoRow text="Solve 10 more DSA problems – Strengthen your problem solving." />
      </div>

      <button className="mt-4 text-[12.5px] font-semibold text-rose-500 flex items-center gap-1">
        View Full Recommendations <ChevronRight size={13} />
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Recent projects
--------------------------------------------- */

function ProjectRow({ name, stack, updated, dotColor }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className={`w-9 h-9 rounded-2xl ${dotColor} shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-slate-800 truncate">{name}</p>
        <p className="text-[11.5px] text-slate-400 truncate">{stack}</p>
        <p className="text-[10.5px] text-slate-300">{updated}</p>
      </div>
      <button className="shrink-0 text-[11.5px] font-semibold text-white bg-emerald-400 px-3 py-1.5 rounded-full">
        View Project
      </button>
    </div>
  );
}

function RecentProjectsCard() {
  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-800 text-[15px]">Recent Projects</h3>
        <button className="text-[12px] font-semibold text-indigo-500">View All</button>
      </div>
      <div className="divide-y divide-slate-100">
        <ProjectRow name="E-Commerce Web App" stack="MERN Stack · Docker · CI/CD" updated="Updated 2 days ago" dotColor="bg-emerald-100" />
        <ProjectRow name="Task Management System" stack="MERN Stack · JWT · MongoDB" updated="Updated 1 week ago" dotColor="bg-sky-100" />
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Connected profiles footer
--------------------------------------------- */

function ConnectedBadge({ icon: Icon, label, iconBg, iconColor }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={14} className={iconColor} />
      </div>
      <div>
        <p className="text-[12.5px] font-semibold text-slate-700">{label}</p>
        <p className="text-[10.5px] text-emerald-500 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Connected
        </p>
      </div>
    </div>
  );
}

function ConnectedProfilesBar() {
  return (
    <ClayCard className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-6">
        <span className="text-[13px] font-semibold text-slate-500 hidden sm:inline">Connected Profiles</span>
        <ConnectedBadge icon={FaGithub} label="GitHub" iconBg="bg-slate-100" iconColor="text-slate-700" />
        <ConnectedBadge icon={Code2} label="LeetCode" iconBg="bg-orange-50" iconColor="text-orange-500" />
        <ConnectedBadge icon={Code2} label="GeeksforGeeks" iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <ConnectedBadge icon={FaLinkedin} label="LinkedIn" iconBg="bg-sky-50" iconColor="text-sky-600" />
      </div>
      <button className="px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-[12.5px] font-semibold">
        Manage Connections
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Page
--------------------------------------------- */

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-[#F4F3FA] flex">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">Good morning, Sanjay!</h1>
          <p className="text-[13px] text-slate-400 mt-1">
            Aspiring Full-Stack Developer · Bangalore, India · Fresher
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <RoleReadinessCard />
          <BestMatchJobsCard />
          <SkillsAnalysedCard />
          <ProfileStrengthCard />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <SkillOverviewCard />
          <TopJobsCard />
          <SkillGapsCard />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <AIRecommendationsCard />
          <RecentProjectsCard />
        </div>

        <ConnectedProfilesBar />
      </main>
    </div>
  );
}
