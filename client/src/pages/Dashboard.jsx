import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Star,
  Bookmark,
  Code2,
  Zap,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { ClayCard, CircularProgress } from "../components/ui";
import { getDashboardData } from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";

// Returns a time-of-day greeting based on the current hour in IST,
// regardless of what timezone the visitor's device is set to.
function getGreeting() {
  const istHour = parseInt(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false,
    }),
    10
  );

  if (istHour >= 5 && istHour < 12) return "Good morning";
  if (istHour >= 12 && istHour < 17) return "Good afternoon";
  if (istHour >= 17 && istHour < 21) return "Good evening";
  return "Good night";
}

/* ---------------------------------------------
   Top stat cards
--------------------------------------------- */

function RoleReadinessCard({ role, percentage, onViewDetails }) {
  return (
    <ClayCard className="bg-gradient-to-br from-violet-500 to-purple-600 border-none text-white p-5 flex flex-col justify-between shadow-[0_15px_30px_-10px_rgba(124,58,237,0.45)]">
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-medium text-violet-100">Role Readiness</span>
        <CircularProgress percentage={percentage} size={40} stroke={4} trackColor="rgba(255,255,255,0.25)" barColor="#ffffff" />
      </div>
      <div className="mt-3">
        <p className="text-lg font-semibold leading-tight">{role}</p>
        <p className="text-[12px] text-violet-100 mt-1">
          {percentage >= 80 ? "You are almost there!" : percentage >= 50 ? "Making solid progress." : "Let's build up your match."}
        </p>
      </div>
      <button onClick={onViewDetails} className="mt-4 text-[12px] font-semibold text-white/95 flex items-center gap-1 self-start">
        View Details <ChevronRight size={13} />
      </button>
    </ClayCard>
  );
}

function BestMatchJobsCard({ count, onViewJobs }) {
  return (
    <ClayCard className="bg-emerald-50 border-none p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center shadow-sm">
          <Briefcase size={16} className="text-emerald-500" />
        </div>
        <button onClick={onViewJobs} className="text-[12px] font-semibold text-emerald-600 flex items-center gap-0.5">
          View Jobs <ArrowUpRight size={12} />
        </button>
      </div>
      <div className="mt-3">
        <p className="text-3xl font-bold text-slate-800">{count}</p>
        <p className="text-[12px] text-slate-500 mt-0.5">Best Match Jobs</p>
      </div>
    </ClayCard>
  );
}

function SkillsAnalysedCard({ count, onViewSkills }) {
  return (
    <ClayCard className="bg-violet-50 border-none p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center shadow-sm">
          <Star size={16} className="text-violet-500" />
        </div>
        <button onClick={onViewSkills} className="text-[12px] font-semibold text-violet-600 flex items-center gap-0.5">
          View Skills <ArrowUpRight size={12} />
        </button>
      </div>
      <div className="mt-3">
        <p className="text-3xl font-bold text-slate-800">{count}</p>
        <p className="text-[12px] text-slate-500 mt-0.5">Skills Analysed</p>
      </div>
    </ClayCard>
  );
}

function ProfileStrengthCard({ percentage, onImprove }) {
  const message =
    percentage >= 80
      ? "Great job! Keep going."
      : percentage >= 50
      ? "You're on the right track."
      : "Let's build up your profile.";

  return (
    <ClayCard className="bg-amber-50 border-none p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <span className="text-[13px] font-medium text-amber-700">Profile Strength</span>
        <CircularProgress percentage={percentage} size={40} stroke={4} trackColor="#fde9b8" barColor="#f5a524" />
      </div>
      <div className="mt-3">
        <p className="text-sm font-semibold text-slate-700">{message}</p>
        <p className="text-[12px] text-slate-500 mt-0.5">Improve your profile to increase match score.</p>
      </div>
      <button onClick={onImprove} className="mt-3 text-[12px] font-semibold text-amber-600 flex items-center gap-1 self-start">
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

function SkillOverviewCard({ skillOverview, onViewAll }) {
  const isEmpty =
    skillOverview.strong.length === 0 &&
    skillOverview.developing.length === 0 &&
    skillOverview.needsImprovement.length === 0;

  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 text-[15px]">Your Skill Overview</h3>
        <button onClick={onViewAll} className="text-[12px] font-semibold text-indigo-500">View All</button>
      </div>

      {isEmpty ? (
        <p className="text-[12.5px] text-slate-400">
          Upload a resume or connect GitHub to start analysing your skills.
        </p>
      ) : (
        <div className="space-y-3.5">
          <div>
            <p className="text-[11px] font-medium text-slate-400 mb-1.5">Strong Skills</p>
            <div className="flex flex-wrap gap-2">
              {skillOverview.strong.length > 0 ? (
                skillOverview.strong.map((s) => <SkillPill key={s} label={s} tone="green" />)
              ) : (
                <span className="text-[11.5px] text-slate-300">None yet</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 mb-1.5">Developing Skills</p>
            <div className="flex flex-wrap gap-2">
              {skillOverview.developing.length > 0 ? (
                skillOverview.developing.map((s) => <SkillPill key={s} label={s} tone="amber" />)
              ) : (
                <span className="text-[11.5px] text-slate-300">None yet</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 mb-1.5">Needs Improvement</p>
            <div className="flex flex-wrap gap-2">
              {skillOverview.needsImprovement.length > 0 ? (
                skillOverview.needsImprovement.map((s) => <SkillPill key={s} label={s} tone="red" />)
              ) : (
                <span className="text-[11.5px] text-slate-300">None yet</span>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onViewAll}
        className="mt-5 w-full py-2.5 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(124,58,237,0.5)]"
      >
        View Skill Gap Analysis
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Top recommended jobs
--------------------------------------------- */

function JobRow({ title, company, location, match }) {
  const matchColor = match >= 90 ? "text-emerald-500" : match >= 80 ? "text-amber-500" : "text-rose-500";
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-slate-50">
        <Briefcase size={16} className="text-slate-400" />
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

function TopJobsCard({ topJobs, onViewAll }) {
  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-800 text-[15px]">Top Recommended Jobs</h3>
        <button onClick={onViewAll} className="text-[12px] font-semibold text-indigo-500">View All</button>
      </div>

      {topJobs.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {topJobs.map((job) => (
            <JobRow key={job.title + job.company} {...job} />
          ))}
        </div>
      ) : (
        <p className="text-[12.5px] text-slate-400 py-3">
          No live job matches right now - check back soon or adjust your target role.
        </p>
      )}

      <button
        onClick={onViewAll}
        className="mt-4 w-full py-2.5 rounded-2xl bg-rose-400 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(251,113,133,0.6)]"
      >
        Explore More Jobs
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Skill gaps
--------------------------------------------- */

const priorityColors = {
  "High Priority": { bar: "#fb7185", text: "text-rose-500" },
  "Medium Priority": { bar: "#a855f7", text: "text-amber-500" },
  "Low Priority": { bar: "#34d399", text: "text-emerald-500" },
};

function GapBar({ label, value, priority }) {
  const colors = priorityColors[priority] || priorityColors["Medium Priority"];
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[12.5px] font-medium text-slate-600">{label}</span>
        <span className={`text-[10.5px] font-semibold ${colors.text}`}>{priority}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: colors.bar }} />
      </div>
    </div>
  );
}

function SkillGapsCard({ skillGaps, onViewAll }) {
  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 text-[15px]">Skill Gaps</h3>
        <button onClick={onViewAll} className="text-[12px] font-semibold text-indigo-500">View All</button>
      </div>

      {skillGaps.length > 0 ? (
        <div className="space-y-3.5">
          {skillGaps.map((gap) => (
            <GapBar key={gap.label} {...gap} />
          ))}
        </div>
      ) : (
        <p className="text-[12.5px] text-slate-400">
          No gaps detected for this role yet - nice work.
        </p>
      )}

      <button
        onClick={onViewAll}
        className="mt-5 w-full py-2.5 rounded-2xl bg-cyan-400 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(34,211,238,0.55)]"
      >
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

function AIRecommendationsCard({ aiRecommendations, onViewAll }) {
  return (
    <ClayCard className="bg-rose-50 border-none p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className="text-rose-500" />
        <h3 className="font-semibold text-slate-800 text-[15px]">AI Recommendations For You</h3>
      </div>

      <div className="space-y-2.5">
        {aiRecommendations.map((text) => (
          <RecoRow key={text} text={text} />
        ))}
      </div>

      <button onClick={onViewAll} className="mt-4 text-[12.5px] font-semibold text-rose-500 flex items-center gap-1">
        View Full Recommendations <ChevronRight size={13} />
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Recent projects
--------------------------------------------- */

function ProjectRow({ name, stack, updated, link, onNoLink }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-9 h-9 rounded-2xl bg-slate-100 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-slate-800 truncate">{name}</p>
        <p className="text-[11.5px] text-slate-400 truncate">{stack}</p>
        <p className="text-[10.5px] text-slate-300">{updated}</p>
      </div>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 text-[11.5px] font-semibold text-white bg-emerald-400 px-3 py-1.5 rounded-full"
        >
          View Project
        </a>
      ) : (
        <button
          onClick={onNoLink}
          className="shrink-0 text-[11.5px] font-semibold text-white bg-emerald-400 px-3 py-1.5 rounded-full"
        >
          View Project
        </button>
      )}
    </div>
  );
}

function RecentProjectsCard({ recentProjects, onViewAll }) {
  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-800 text-[15px]">Recent Projects</h3>
        <button onClick={onViewAll} className="text-[12px] font-semibold text-indigo-500">View All</button>
      </div>
      {recentProjects.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {recentProjects.map((project) => (
            <ProjectRow key={project.name} {...project} onNoLink={onViewAll} />
          ))}
        </div>
      ) : (
        <p className="text-[12.5px] text-slate-400 py-3">
          No projects yet - add one from the Uploads page.
        </p>
      )}
    </ClayCard>
  );
}

/* ---------------------------------------------
   Connected profiles footer
--------------------------------------------- */

const profileIconMap = {
  GitHub: { icon: FaGithub, iconBg: "bg-slate-100", iconColor: "text-slate-700" },
  LeetCode: { icon: Code2, iconBg: "bg-orange-50", iconColor: "text-orange-500" },
  GeeksforGeeks: { icon: Code2, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  LinkedIn: { icon: FaLinkedin, iconBg: "bg-sky-50", iconColor: "text-sky-600" },
};

function ConnectedBadge({ label }) {
  const { icon: Icon, iconBg, iconColor } = profileIconMap[label] || { icon: Code2, iconBg: "bg-slate-100", iconColor: "text-slate-500" };
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

function ConnectedProfilesBar({ connectedProfiles, onManage }) {
  return (
    <ClayCard className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-6">
        <span className="text-[13px] font-semibold text-slate-500 hidden sm:inline">Connected Profiles</span>
        {connectedProfiles.length > 0 ? (
          connectedProfiles.map((label) => <ConnectedBadge key={label} label={label} />)
        ) : (
          <span className="text-[12.5px] text-slate-400">No platforms connected yet.</span>
        )}
      </div>
      <button onClick={onManage} className="px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-[12.5px] font-semibold">
        Manage Connections
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Page
--------------------------------------------- */

export default function Dashboard() {
  const [data, setData] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      const result = await getDashboardData();
      if (!cancelled) setData(result);
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return <p className="text-[13px] text-slate-400">Loading dashboard...</p>;
  }

  const subline = [user?.role, data.user.location, data.user.status].filter(Boolean).join(" · ");

  return (
    <>
      <header>
        <h1 className="text-2xl font-bold text-slate-800">{getGreeting()}, {user?.displayName}!</h1>
        {subline && <p className="text-[13px] text-slate-400 mt-1">{subline}</p>}
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <RoleReadinessCard
          role={data.roleReadiness.role}
          percentage={data.roleReadiness.percentage}
          onViewDetails={() => navigate("/skill-gap")}
        />
        <BestMatchJobsCard count={data.bestMatchJobs} onViewJobs={() => navigate("/jobs")} />
        <SkillsAnalysedCard count={data.skillsAnalysed} onViewSkills={() => navigate("/skill-gap")} />
        <ProfileStrengthCard percentage={data.profileStrength} onImprove={() => navigate("/uploads")} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <SkillOverviewCard skillOverview={data.skillOverview} onViewAll={() => navigate("/skill-gap")} />
        <TopJobsCard topJobs={data.topJobs} onViewAll={() => navigate("/jobs")} />
        <SkillGapsCard skillGaps={data.skillGaps} onViewAll={() => navigate("/skill-gap")} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <AIRecommendationsCard aiRecommendations={data.aiRecommendations} onViewAll={() => navigate("/skill-gap")} />
        <RecentProjectsCard recentProjects={data.recentProjects} onViewAll={() => navigate("/uploads")} />
      </div>

      <ConnectedProfilesBar connectedProfiles={data.connectedProfiles} onManage={() => navigate("/connections")} />
    </>
  );
}