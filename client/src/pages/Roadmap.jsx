import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Sparkles,
  Calendar,
  CalendarDays,
  Flame,
  Trophy,
  Target,
} from "lucide-react";
import { ClayCard, CircularProgress } from "../components/ui";
import { getRoadmapData } from "../services/roadmapService";

/* ---------------------------------------------
   Header
--------------------------------------------- */

function RoadmapHeader({ targetRole }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Your Personalized Roadmap</h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Step-by-step plan to build the skills you need and land better opportunities.
        </p>
      </div>

      <ClayCard className="px-4 py-2.5 min-w-[220px]">
        <p className="text-[11px] font-medium text-slate-400 mb-0.5">Target Role</p>
        <button className="flex items-center justify-between w-full text-[13.5px] font-semibold text-slate-700">
          {targetRole}
          <ChevronDown size={15} className="text-slate-400" />
        </button>
      </ClayCard>
    </header>
  );
}

/* ---------------------------------------------
   Difficulty mini bar-chart
--------------------------------------------- */

const difficultyLevels = { Easy: 1, Moderate: 2, Hard: 3 };

function DifficultyBars({ difficulty }) {
  const level = difficultyLevels[difficulty] || 2;
  const bars = [6, 10, 14, 18, 22];
  return (
    <div className="flex items-end gap-1 h-6">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full ${i < level + 1 ? "bg-emerald-400" : "bg-slate-200"}`}
          style={{ height: h }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------------------
   Top stats row
--------------------------------------------- */

function StatsRow({ overallProgress, skillsToImprove, estimatedHours, difficulty }) {
  return (
    <ClayCard className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-6 items-center">
        <div className="flex items-center gap-4 col-span-2 sm:col-span-1">
          <div className="relative w-[72px] h-[72px] shrink-0 flex items-center justify-center">
            <CircularProgress percentage={overallProgress} size={72} stroke={7} trackColor="#ede9fe" barColor="#7c3aed" />
            <span className="absolute text-[15px] font-bold text-slate-800">{overallProgress}%</span>
          </div>
          <p className="text-[12px] font-medium text-slate-400">Overall Progress</p>
        </div>

        <div>
          <p className="text-[12px] text-slate-400 mb-1">Skills to Improve</p>
          <p className="text-2xl font-bold text-slate-800">{skillsToImprove}</p>
          <p className="text-[11.5px] text-slate-400">high priority skills</p>
        </div>

        <div>
          <p className="text-[12px] text-slate-400 mb-1">Estimated Time</p>
          <p className="text-2xl font-bold text-slate-800 flex items-center gap-1.5">
            <Clock size={16} className="text-indigo-500" />
            {estimatedHours} <span className="text-slate-300 text-base font-semibold">hrs</span>
          </p>
          <p className="text-[11.5px] text-slate-400">to reach your goal</p>
        </div>

        <div>
          <p className="text-[12px] text-slate-400 mb-1">Roadmap Difficulty</p>
          <DifficultyBars difficulty={difficulty} />
          <p className="text-[11.5px] text-slate-400 mt-1">{difficulty}</p>
        </div>

        <div className="col-span-2 sm:col-span-4 xl:col-span-1 bg-indigo-50/60 rounded-2xl p-4 flex gap-2.5">
          <Sparkles size={16} className="text-violet-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[12.5px] font-semibold text-slate-700 mb-1">Stay Consistent!</p>
            <p className="text-[11.5px] text-slate-500 leading-snug">
              Complete learning goals regularly to see the best results.
            </p>
          </div>
        </div>
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Roadmap phases
--------------------------------------------- */

const toneClasses = {
  indigo: { badge: "bg-indigo-500", pillBg: "bg-indigo-50", pillText: "text-indigo-600" },
  sky: { badge: "bg-sky-500", pillBg: "bg-sky-50", pillText: "text-sky-600" },
  amber: { badge: "bg-amber-500", pillBg: "bg-amber-50", pillText: "text-amber-600" },
  emerald: { badge: "bg-emerald-500", pillBg: "bg-emerald-50", pillText: "text-emerald-600" },
};

function PhaseCard({ phase, isLast }) {
  const tone = toneClasses[phase.tone] || toneClasses.indigo;
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-8 h-8 rounded-full ${tone.badge} text-white text-[13px] font-bold flex items-center justify-center shrink-0`}
        >
          {phase.id}
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-200 my-1" />}
      </div>

      <div className="flex-1 pb-5">
        <ClayCard className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="font-semibold text-slate-800 text-[15px]">{phase.title}</h3>
                <span className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-full ${tone.pillBg} ${tone.pillText}`}>
                  {phase.status}
                </span>
              </div>
              <p className="text-[12.5px] text-slate-500 mt-1">{phase.description}</p>

              <div className="flex items-center gap-4 mt-2.5 text-[12px] text-slate-400">
                <span>{phase.skillsCount} Skills</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {phase.hours} hrs
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {phase.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11.5px] font-medium px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="relative w-14 h-14 flex items-center justify-center">
                <CircularProgress percentage={phase.progress} size={56} stroke={5} trackColor="#ede9fe" barColor="#7c3aed" />
                <span className="absolute text-[12px] font-bold text-slate-800">{phase.progress}%</span>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          </div>
        </ClayCard>
      </div>
    </div>
  );
}

function RoadmapPhasesCard({ phases }) {
  return (
    <ClayCard className="p-5">
      <h3 className="font-semibold text-slate-800 text-[15px] mb-4">Roadmap Phases</h3>
      <div className="flex flex-col">
        {phases.map((phase, i) => (
          <PhaseCard key={phase.id} phase={phase} isLast={i === phases.length - 1} />
        ))}
      </div>
      <p className="text-[12px] text-slate-400 flex items-center gap-1.5 mt-1">
        <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px]">i</span>
        Follow the phases in order for the best learning experience.
      </p>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Daily goal
--------------------------------------------- */

function DailyGoalCard({ dailyGoal }) {
  const pct = Math.round((dailyGoal.completed / dailyGoal.total) * 100) || 0;
  return (
    <ClayCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-2.5">
          <Calendar size={17} className="text-indigo-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-slate-800 text-[14.5px]">Daily Goal</h3>
            <p className="text-[13px] font-semibold text-indigo-600">
              {dailyGoal.completed}/{dailyGoal.total} tasks completed
            </p>
            <p className="text-[11.5px] text-slate-400">Keep the streak going!</p>
          </div>
        </div>
        <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
          <CircularProgress percentage={pct} size={44} stroke={4} trackColor="#f1f5f9" barColor="#7c3aed" />
          <span className="absolute text-[10.5px] font-bold text-slate-800">{pct}%</span>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        {dailyGoal.tasks.map((task) => (
          <div key={task.label} className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2.5 text-[12.5px] text-slate-600">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-indigo-500" readOnly checked={task.done >= task.total} />
              {task.label}
            </label>
            <span className="text-[11.5px] text-slate-400 shrink-0">
              {task.done}/{task.total}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1.5 text-[12px] text-slate-400">
          <Flame size={14} className="text-orange-400" /> {dailyGoal.streak} day streak
        </span>
        <button className="text-[12px] font-semibold text-indigo-500 flex items-center gap-1">
          View Calendar <ChevronRight size={12} />
        </button>
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Weekly goal
--------------------------------------------- */

function WeeklyGoalCard({ weeklyGoal }) {
  const pct = Math.round((weeklyGoal.completed / weeklyGoal.total) * 100) || 0;
  return (
    <ClayCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-2.5">
          <CalendarDays size={17} className="text-indigo-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-slate-800 text-[14.5px]">Weekly Goal</h3>
            <p className="text-[13px] font-semibold text-indigo-600">
              {weeklyGoal.completed}/{weeklyGoal.total} tasks completed
            </p>
            <p className="text-[11.5px] text-slate-400">Complete more to level up!</p>
          </div>
        </div>
        <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
          <CircularProgress percentage={pct} size={44} stroke={4} trackColor="#f1f5f9" barColor="#7c3aed" />
          <span className="absolute text-[10.5px] font-bold text-slate-800">{pct}%</span>
        </div>
      </div>

      <div className="flex justify-between mt-3.5">
        {weeklyGoal.days.map((day, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-semibold ${
              day.done ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-200 text-slate-400"
            }`}
          >
            {day.label}
          </div>
        ))}
      </div>

      <div className="mt-3.5 space-y-2.5">
        {weeklyGoal.tasks.map((task) => (
          <div key={task.label} className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2.5 text-[12.5px] text-slate-600">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-indigo-500" readOnly checked={task.done >= task.total} />
              {task.label}
            </label>
            <span className="text-[11.5px] text-slate-400 shrink-0">
              {task.done}/{task.total} {task.unit || ""}
            </span>
          </div>
        ))}
      </div>

      <button className="text-[12px] font-semibold text-indigo-500 flex items-center gap-1 mt-3 pt-3 border-t border-slate-100 w-full">
        View Weekly Progress <ChevronRight size={12} />
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Milestones
--------------------------------------------- */

function MilestonesCard({ milestones }) {
  return (
    <ClayCard className="p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <Trophy size={17} className="text-amber-500" />
        <h3 className="font-semibold text-slate-800 text-[14.5px]">Milestones</h3>
      </div>
      <div className="space-y-3">
        {milestones.map((m) => (
          <div key={m.label} className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2.5 text-[12.5px] text-slate-600">
              <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
              {m.label}
            </label>
            <span className="text-[11.5px] text-slate-400 shrink-0">{m.progress}%</span>
          </div>
        ))}
      </div>
      <button className="text-[12px] font-semibold text-indigo-500 flex items-center gap-1 mt-3">
        View All Milestones <ChevronRight size={12} />
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Bottom CTA banner
--------------------------------------------- */

function TrackProgressBanner() {
  const navigate = useNavigate();
  return (
    <ClayCard className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-50 to-indigo-50 border-none">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
          <Target size={18} className="text-violet-500" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-slate-800">Track Your Progress</p>
          <p className="text-[12.5px] text-slate-500">
            Complete skills, build projects and track progress to increase your match score.
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate("/skill-gap")}
        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(124,58,237,0.5)] shrink-0 flex items-center gap-1.5"
      >
        Go to Skill Gap <ChevronRight size={14} />
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Page
--------------------------------------------- */

export default function Roadmap() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRoadmap() {
      const result = await getRoadmapData();
      if (!cancelled) setData(result);
    }

    loadRoadmap();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return <p className="text-[13px] text-slate-400">Loading your roadmap...</p>;
  }

  return (
    <>
      <RoadmapHeader targetRole={data.targetRole} />

      <StatsRow
        overallProgress={data.overallProgress}
        skillsToImprove={data.skillsToImprove}
        estimatedHours={data.estimatedHours}
        difficulty={data.difficulty}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        <div className="xl:col-span-2">
          <RoadmapPhasesCard phases={data.phases} />
        </div>
        <div className="space-y-5">
          <DailyGoalCard dailyGoal={data.dailyGoal} />
          <WeeklyGoalCard weeklyGoal={data.weeklyGoal} />
          <MilestonesCard milestones={data.milestones} />
        </div>
      </div>

      <TrackProgressBanner />
    </>
  );
}
