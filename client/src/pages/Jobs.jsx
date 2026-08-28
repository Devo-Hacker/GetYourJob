import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  Filter,
  Bookmark,
  Send,
  BadgeCheck,
  Check,
  TriangleAlert,
} from "lucide-react";
import { ClayCard, CircularProgress } from "../components/ui";
import { getJobs, getJobStats, saveJob } from "../services/jobsService";

/* ---------------------------------------------
   Search + filter bar
--------------------------------------------- */

function SearchFilterBar() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <ClayCard className="flex-1 flex items-center gap-3 px-4 py-3">
        <Search size={17} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Search job title, skills, company..."
          className="flex-1 bg-transparent outline-none text-[13.5px] text-slate-600 placeholder:text-slate-400"
        />
      </ClayCard>

      <button className="flex items-center gap-2 px-4 py-3 rounded-[20px] bg-white border border-white shadow-[0_10px_30px_-10px_rgba(76,29,149,0.12)] text-[13px] font-medium text-slate-600 shrink-0">
        Sort by <ChevronDown size={15} />
      </button>

      <button className="flex items-center gap-2 px-4 py-3 rounded-[20px] bg-white border border-white shadow-[0_10px_30px_-10px_rgba(76,29,149,0.12)] text-[13px] font-medium text-slate-600 shrink-0">
        <Filter size={15} /> Filter
      </button>
    </div>
  );
}

/* ---------------------------------------------
   Stat cards
--------------------------------------------- */

function SavedJobsCard({ count }) {
  return (
    <ClayCard className="bg-indigo-50 border-none p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
        <Bookmark size={18} className="text-indigo-500" />
      </div>
      <div>
        <p className="text-[13px] font-medium text-slate-600">Saved Jobs</p>
        <p className="text-2xl font-bold text-slate-800 leading-tight">{count}</p>
        <p className="text-[12px] text-slate-400">jobs saved</p>
      </div>
    </ClayCard>
  );
}

function AppliedJobsCard({ count }) {
  return (
    <ClayCard className="bg-emerald-50 border-none p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
        <Send size={18} className="text-emerald-500" />
      </div>
      <div>
        <p className="text-[13px] font-medium text-slate-600">Applied Jobs</p>
        <p className="text-2xl font-bold text-slate-800 leading-tight">{count}</p>
        <p className="text-[12px] text-slate-400">jobs applied</p>
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Job card
--------------------------------------------- */

function MatchBadge({ match }) {
  const tone =
    match >= 75
      ? { text: "text-emerald-600", bg: "bg-emerald-50", ring: "#10b981", track: "#d1fae5" }
      : match >= 60
      ? { text: "text-amber-600", bg: "bg-amber-50", ring: "#f59e0b", track: "#fde9b8" }
      : { text: "text-rose-600", bg: "bg-rose-50", ring: "#f43f5e", track: "#fecdd3" };

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0 ${tone.bg}`}>
      <span className={`text-[12.5px] font-semibold whitespace-nowrap ${tone.text}`}>
        {match}% Match
      </span>
      <CircularProgress percentage={match} size={20} stroke={3} trackColor={tone.track} barColor={tone.ring} />
    </div>
  );
}

function SkillTag({ label, matched }) {
  return matched ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-emerald-50 text-emerald-600">
      {label} <Check size={12} strokeWidth={3} />
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-amber-50 text-amber-600">
      {label} <TriangleAlert size={12} strokeWidth={2.5} />
    </span>
  );
}

function JobCard({ job }) {
  const {
    id,
    logo,
    logoBg,
    title,
    company,
    verified,
    activelyHiring,
    location,
    type,
    tags,
    salary,
    posted,
    match,
  } = job;

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await saveJob(id);
    setSaving(false);
  };

  return (
    <ClayCard className="p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div
          className={`w-14 h-14 rounded-2xl ${logoBg} text-white flex items-center justify-center font-bold text-sm shrink-0`}
        >
          {logo}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>
            {activelyHiring && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-600">
                Actively hiring
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[13px] text-slate-500">{company}</span>
            {verified && <BadgeCheck size={14} className="text-indigo-500" />}
          </div>

          <p className="text-[12px] text-slate-400 mt-1">
            {location} · {type}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((t) => (
              <SkillTag key={t.label} label={t.label} matched={t.matched} />
            ))}
          </div>

          <p className="text-[12.5px] text-slate-500 mt-3">
            {salary} · Posted {posted}
          </p>
        </div>

        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-3 shrink-0 sm:ml-4 sm:w-auto">
          <MatchBadge match={match} />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3.5 py-2 rounded-2xl border border-slate-200 text-[12.5px] font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
            >
              <Bookmark size={14} /> {saving ? "Saving..." : "Save"}
            </button>
            <button className="px-4 py-2 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[12.5px] font-semibold shadow-[0_10px_20px_-8px_rgba(124,58,237,0.5)] whitespace-nowrap">
              View Job
            </button>
          </div>
        </div>
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Page
--------------------------------------------- */

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ savedJobs: 0, appliedJobs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadJobsPage() {
      setLoading(true);
      const [jobsData, statsData] = await Promise.all([getJobs(), getJobStats()]);
      if (!cancelled) {
        setJobs(jobsData);
        setStats(statsData);
        setLoading(false);
      }
    }

    loadJobsPage();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-[13px] text-slate-400">Loading jobs...</p>;
  }

  return (
    <>
      <SearchFilterBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SavedJobsCard count={stats.savedJobs} />
        <AppliedJobsCard count={stats.appliedJobs} />
      </div>

      <div className="space-y-5">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </>
  );
}
