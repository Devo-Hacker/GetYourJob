import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Bookmark,
  Check,
  TriangleAlert,
  Circle,
  Sparkles,
  Container,
  Cloud,
  Network,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClayCard, CircularProgress } from "../components/ui";
import { getSkillGapData } from "../services/skillGapService";
import { getSkillBoard, updateDesiredSkills } from "../services/skillsService";
import { useTargetRole } from "../context/TargetRoleContext";
import TargetRoleModal from "../components/TargetRoleModal";

function SkillGapHeader({ targetRole, onEditRole }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Skill Gap Analysis</h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Identify skills to improve your match score and career opportunities.
        </p>
      </div>

      <ClayCard className="px-4 py-2.5 min-w-[220px]">
        <p className="text-[11px] font-medium text-slate-400 mb-0.5">Target Role</p>
        <button
          onClick={onEditRole}
          className="flex items-center justify-between w-full text-[13.5px] font-semibold text-slate-700"
        >
          {targetRole}
          <ChevronDown size={15} className="text-slate-400" />
        </button>
      </ClayCard>
    </header>
  );
}

const TABS = ["Overview", "Compare Roles", "Recommendations"];

function Tabs({ active, onChange }) {
  return (
    <div className="flex items-center gap-6 border-b border-slate-200">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`pb-3 text-[13.5px] font-semibold border-b-2 -mb-px transition-colors ${
            active === tab
              ? "text-indigo-600 border-indigo-500"
              : "text-slate-400 border-transparent hover:text-slate-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function OverallMatchCard({ overallMatch, skillsMatched, totalSkills, skillsToImprove, priority }) {
  const priorityToneClasses = {
    High: "bg-rose-50 text-rose-500",
    Medium: "bg-amber-50 text-amber-500",
    Low: "bg-emerald-50 text-emerald-500",
  };

  return (
    <ClayCard className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-6 items-center">
        <div className="flex items-center gap-4 col-span-2 sm:col-span-1">
          <div className="relative w-[72px] h-[72px] shrink-0 flex items-center justify-center">
            <CircularProgress percentage={overallMatch} size={72} stroke={7} trackColor="#ede9fe" barColor="#7c3aed" />
            <span className="absolute text-[15px] font-bold text-slate-800">{overallMatch}%</span>
          </div>
          <p className="text-[12px] font-medium text-slate-400">Overall Skill Match</p>
        </div>

        <div>
          <p className="text-[12px] text-slate-400 mb-1">You have</p>
          <p className="text-2xl font-bold text-slate-800">
            {skillsMatched} <span className="text-slate-300 text-base font-semibold">/ {totalSkills}</span>
          </p>
          <p className="text-[11.5px] text-slate-400">skills matched</p>
        </div>

        <div>
          <p className="text-[12px] text-slate-400 mb-1">You need</p>
          <p className="text-2xl font-bold text-slate-800">{skillsToImprove}</p>
          <p className="text-[11.5px] text-slate-400">skills to improve</p>
        </div>

        <div>
          <p className="text-[12px] text-slate-400 mb-1">Priority</p>
          <span className={`inline-block text-[12px] font-semibold px-2.5 py-1 rounded-full ${priorityToneClasses[priority] || priorityToneClasses.Medium}`}>
            {priority}
          </span>
          <p className="text-[11.5px] text-slate-400 mt-1">to improve match</p>
        </div>

        <div className="col-span-2 sm:col-span-4 xl:col-span-1 bg-indigo-50/60 rounded-2xl p-4">
          <p className="text-[12.5px] font-semibold text-slate-700 mb-1">How it works?</p>
          <p className="text-[11.5px] text-slate-500 leading-snug">
            We compare your profile with the target role requirements and highlight the skill gaps.
          </p>
          <button className="text-[11.5px] font-semibold text-indigo-500 mt-1.5 flex items-center gap-1">
            Learn more <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </ClayCard>
  );
}

function SkillPill({ label, tone, icon }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-sky-50 text-sky-700",
    amber: "bg-amber-50 text-amber-700",
  };
  return (
    <span className={`inline-flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl text-[13px] font-medium ${tones[tone]}`}>
      {label}
      {icon}
    </span>
  );
}

function SkillsOverviewCard({ skillOverview }) {
  const { strong, developing, needsImprovement } = skillOverview;
  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800 text-[15px]">Your Skills Overview</h3>
      </div>

      <div className="flex items-center gap-5 mb-5">
        <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
          <Circle size={8} className="fill-emerald-500 text-emerald-500" /> Strong
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
          <Circle size={8} className="fill-sky-500 text-sky-500" /> Developing
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
          <Circle size={8} className="fill-amber-500 text-amber-500" /> Needs Improvement
        </span>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-[13px] font-semibold text-slate-700 mb-2.5">Strong Skills ({strong.length})</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {strong.map((s) => (
              <SkillPill key={s} label={s} tone="green" icon={<Check size={14} strokeWidth={3} />} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[13px] font-semibold text-slate-700 mb-2.5">Developing Skills ({developing.length})</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {developing.map((s) => (
              <SkillPill key={s} label={s} tone="blue" icon={<span className="w-3 h-3 rounded-full border-2 border-sky-500 border-t-transparent" />} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-[13px] font-semibold text-slate-700 mb-2.5">Needs Improvement ({needsImprovement.length})</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {needsImprovement.map((s) => (
              <SkillPill key={s} label={s} tone="amber" icon={<TriangleAlert size={14} />} />
            ))}
          </div>
        </div>
      </div>
    </ClayCard>
  );
}

const priorityColors = {
  "High Priority": { bar: "#fb7185", pillBg: "bg-rose-50", pillText: "text-rose-500" },
  "Medium Priority": { bar: "#f59e0b", pillBg: "bg-amber-50", pillText: "text-amber-500" },
  "Low Priority": { bar: "#34d399", pillBg: "bg-emerald-50", pillText: "text-emerald-500" },
};

function SkillImproveRow({ label, priority, resources, value }) {
  const colors = priorityColors[priority] || priorityColors["Medium Priority"];
  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-slate-700">{label}</span>
          <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${colors.pillBg} ${colors.pillText}`}>
            {priority}
          </span>
        </div>
        <Bookmark size={15} className="text-slate-300 shrink-0" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: colors.bar }} />
        </div>
        <span className="text-[11px] text-slate-400 shrink-0">{resources} resources</span>
      </div>
    </div>
  );
}

function TopSkillsToImproveCard({ topSkillsToImprove }) {
  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-slate-800 text-[15px]">Top Skills to Improve</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {topSkillsToImprove.map((skill) => (
          <SkillImproveRow key={skill.label} {...skill} />
        ))}
      </div>
      <button className="mt-3 text-[12.5px] font-semibold text-indigo-500 flex items-center gap-1">
        View All Skills <ChevronRight size={13} />
      </button>
    </ClayCard>
  );
}

function ProfileStrengthCard({ percentage }) {
  return (
    <ClayCard className="p-6 flex flex-col items-center text-center">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <CircularProgress percentage={percentage} size={112} stroke={9} trackColor="#ede9fe" barColor="#7c3aed" />
        <span className="absolute text-2xl font-bold text-slate-800">{percentage}%</span>
      </div>
      <p className="text-[13.5px] font-semibold text-slate-800 mt-3">Profile Strength</p>
      <p className="text-[12px] text-slate-400 mt-1 leading-snug">
        Great job! Keep going. Improve your profile to increase match score.
      </p>
      <button className="mt-3 text-[12.5px] font-semibold text-indigo-500 flex items-center gap-1">
        Improve Profile <ChevronRight size={13} />
      </button>
    </ClayCard>
  );
}

const stepIconMap = {
  docker: Container,
  aws: Cloud,
  "system-design": Network,
};

function NextStepRow({ icon, title, time }) {
  const Icon = stepIconMap[icon] || Container;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-none">
      <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-indigo-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-slate-800">{title}</p>
        {time && <p className="text-[11.5px] text-slate-400">{time}</p>}
      </div>
      <ChevronRight size={16} className="text-slate-300 shrink-0" />
    </div>
  );
}

function RecommendedNextStepsCard({ recommendedNextSteps }) {
  return (
    <ClayCard className="p-5">
      <h3 className="font-semibold text-slate-800 text-[15px] mb-1">Recommended Next Steps</h3>
      <div>
        {recommendedNextSteps.map((step) => (
          <NextStepRow key={step.title} {...step} />
        ))}
      </div>
      <button className="mt-3 text-[12.5px] font-semibold text-indigo-500 flex items-center gap-1">
        View Full Roadmap <ChevronRight size={13} />
      </button>
    </ClayCard>
  );
}

function PersonalizedRoadmapBanner() {
  const navigate = useNavigate();
  return (
    <ClayCard className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-50 to-indigo-50 border-none">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
          <Sparkles size={18} className="text-violet-500" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-slate-800">Personalized Roadmap</p>
          <p className="text-[12.5px] text-slate-500">
            Get a step-by-step learning path tailored to your target role.
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate("/roadmap")}
        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(124,58,237,0.5)] shrink-0"
      >
        View Roadmap
      </button>
    </ClayCard>
  );
}

function BoardSkillPill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-50 text-slate-600",
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[11.5px] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function SkillBoardCard({ platformSkills, resumeSkills, desiredSkills, onAddDesired, onRemoveDesired }) {
  const [newSkill, setNewSkill] = useState("");

  function handleAdd(e) {
    e.preventDefault();
    if (!newSkill.trim()) return;
    onAddDesired(newSkill.trim());
    setNewSkill("");
  }

  return (
    <ClayCard className="p-6">
      <p className="text-[14px] font-semibold text-slate-800 mb-1">Skill Board</p>
      <p className="text-[12px] text-slate-400 mb-4">
        Every skill source in one place - what your code shows, what your resume says, and what you're aiming for.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <p className="text-[11.5px] font-semibold text-slate-500 mb-2">Platform Skills (GitHub)</p>
          {platformSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {platformSkills.map((s) => (
                <BoardSkillPill key={s} tone="slate">{s}</BoardSkillPill>
              ))}
            </div>
          ) : (
            <p className="text-[11.5px] text-slate-400">
              Connect GitHub and push some code to see languages here.
            </p>
          )}
        </div>

        <div>
          <p className="text-[11.5px] font-semibold text-slate-500 mb-2">Resume Skills</p>
          {resumeSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {resumeSkills.map((s) => (
                <BoardSkillPill key={s.name} tone="indigo">{s.name}</BoardSkillPill>
              ))}
            </div>
          ) : (
            <p className="text-[11.5px] text-slate-400">
              Upload your resume on the Uploads page to extract skills.
            </p>
          )}
        </div>

        <div>
          <p className="text-[11.5px] font-semibold text-slate-500 mb-2">Desired Skills</p>
          {desiredSkills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {desiredSkills.map((s) => (
                <button
                  key={s}
                  onClick={() => onRemoveDesired(s)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium bg-emerald-50 text-emerald-600"
                  aria-label={`Remove ${s}`}
                >
                  {s} <span className="text-emerald-400">&times;</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[11.5px] text-slate-400 mb-2.5">
              Add skills you're aiming to learn.
            </p>
          )}
          <form onSubmit={handleAdd} className="flex items-center gap-1.5">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. Docker"
              className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[12px] text-slate-800 outline-none focus:border-indigo-400"
            />
            <button
              type="submit"
              className="px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white text-[11.5px] font-semibold"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </ClayCard>
  );
}

export default function SkillGap() {
  const { targetRole, setTargetRole, loading: roleLoading } = useTargetRole();
  const [data, setData] = useState(null);
  const [board, setBoard] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [error, setError] = useState("");

  // Skill SOURCES (resume/GitHub/desired) don't depend on target role,
  // so this only needs to run once.
  useEffect(() => {
    let cancelled = false;
    getSkillBoard().then((result) => {
      if (!cancelled) setBoard(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // The actual GAP DATA (overallMatch, skillOverview, topSkillsToImprove...)
  // is role-specific and must refetch every time targetRole changes -
  // this replaces the old "[]" dependency array that made the page look
  // permanently stuck on Full-Stack Developer.
  useEffect(() => {
    if (!targetRole) return;
    let cancelled = false;

    async function loadGap() {
      setError("");
      try {
        const result = await getSkillGapData(targetRole);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || `Couldn't load skill data for "${targetRole}".`);
        }
      }
    }

    loadGap();
    return () => {
      cancelled = true;
    };
  }, [targetRole]);

  async function handleAddDesired(skill) {
    const next = [...new Set([...(board.desiredSkills || []), skill])];
    setBoard((prev) => ({ ...prev, desiredSkills: next }));
    await updateDesiredSkills(next);
  }

  async function handleRemoveDesired(skill) {
    const next = (board.desiredSkills || []).filter((s) => s !== skill);
    setBoard((prev) => ({ ...prev, desiredSkills: next }));
    await updateDesiredSkills(next);
  }

  if (roleLoading || !board || (!data && !error)) {
    return <p className="text-[13px] text-slate-400">Loading skill gap analysis...</p>;
  }

  return (
    <>
      <SkillGapHeader targetRole={targetRole} onEditRole={() => setRoleModalOpen(true)} />
      <Tabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "Overview" ? (
        <>
          <SkillBoardCard
            platformSkills={board.platformSkills}
            resumeSkills={board.resumeSkills}
            desiredSkills={board.desiredSkills}
            onAddDesired={handleAddDesired}
            onRemoveDesired={handleRemoveDesired}
          />

          {error ? (
            <ClayCard className="p-8 text-center">
              <p className="text-[13.5px] text-rose-500 font-medium">{error}</p>
            </ClayCard>
          ) : (
            <>
              <OverallMatchCard
                overallMatch={data.overallMatch}
                skillsMatched={data.skillsMatched}
                totalSkills={data.totalSkills}
                skillsToImprove={data.skillsToImprove}
                priority={data.priority}
              />

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2">
                  <SkillsOverviewCard skillOverview={data.skillOverview} />
                </div>
                <TopSkillsToImproveCard topSkillsToImprove={data.topSkillsToImprove} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <ProfileStrengthCard percentage={data.profileStrength} />
                <div className="xl:col-span-2">
                  <RecommendedNextStepsCard recommendedNextSteps={data.recommendedNextSteps} />
                </div>
              </div>

              <PersonalizedRoadmapBanner />
            </>
          )}
        </>
      ) : (
        <ClayCard className="p-8 text-center">
          <p className="text-[13.5px] text-slate-400">
            {activeTab} is coming soon.
          </p>
        </ClayCard>
      )}

      <TargetRoleModal
        open={roleModalOpen}
        currentRole={targetRole}
        onClose={() => setRoleModalOpen(false)}
        onSaved={(newRole) => setTargetRole(newRole)}
      />
    </>
  );
}
