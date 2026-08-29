import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  MapPin,
  Bookmark,
  Send,
  BadgeCheck,
  Check,
  TriangleAlert,
} from "lucide-react";
import { ClayCard, CircularProgress } from "../components/ui";
import { getJobs, getJobStats, saveJob, applyJob } from "../services/jobsService";
import { useTargetRole } from "../context/TargetRoleContext";
import TargetRoleModal from "../components/TargetRoleModal";

/* ---------------------------------------------
   Header - target role (drives what jobs are fetched) + search/location
--------------------------------------------- */

function JobsHeader({ targetRole, onEditRole }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Jobs</h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Live openings matched against your real skills, not a static list.
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

function SearchFilterBar({ search, onSearchChange, location, onLocationChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <ClayCard className="flex-1 flex items-center gap-3 px-4 py-3">
        <Search size={17} className="text-slate-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by title, company, or skill..."
          className="flex-1 bg-transparent outline-none text-[13.5px] text-slate-600 placeholder:text-slate-400"
        />
      </ClayCard>

      <ClayCard className="flex items-center gap-3 px-4 py-3 sm:w-56 shrink-0">
        <MapPin size={16} className="text-slate-400 shrink-0" />
        <input
          type="text"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          placeholder="Location (optional)"
          className="flex-1 bg-transparent outline-none text-[13.5px] text-slate-600 placeholder:text-slate-400 min-w-0"
        />
      </ClayCard>
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

function JobCard({ job, onSaved, onApplied }) {
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
    redirectUrl,
    savedStatus,
  } = job;

  const [saving, setSaving] = useState(false);
  const isSaved = savedStatus === "saved" || savedStatus === "applied";

  async function handleSave() {
    if (isSaved || saving) return;
    setSaving(true);
    try {
      await saveJob(job);
      onSaved(id);
    } finally {
      setSaving(false);
    }
  }

  async function handleView() {
    // Fire-and-forget - don't block opening the listing on this call.
    applyJob(job).then(() => onApplied(id));
    if (redirectUrl) window.open(redirectUrl, "_blank", "noopener,noreferrer");
  }

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
            {tags.length > 0 ? (
              tags.map((t) => <SkillTag key={t.label} label={t.label} matched={t.matched} />)
            ) : (
              <span className="text-[11.5px] text-slate-400">No specific skills detected in this posting</span>
            )}
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
              disabled={saving || isSaved}
              className="px-3.5 py-2 rounded-2xl border border-slate-200 text-[12.5px] font-semibold text-slate-600 flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50"
            >
              <Bookmark size={14} /> {isSaved ? "Saved" : saving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleView}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[12.5px] font-semibold shadow-[0_10px_20px_-8px_rgba(124,58,237,0.5)] whitespace-nowrap"
            >
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
  const { targetRole, setTargetRole, loading: roleLoading } = useTargetRole();
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ savedJobs: 0, appliedJobs: 0 });
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Refetches every time the target role (or location) changes - this
  // is the actual fix for jobs looking "stuck": there's no cached/mock
  // list, every change re-queries the backend for that exact role.
  useEffect(() => {
    if (!targetRole) return;
    let cancelled = false;

    async function loadJobsPage() {
      setLoading(true);
      setError("");
      try {
        const [jobsData, statsData] = await Promise.all([
          getJobs(targetRole, location),
          getJobStats(),
        ]);
        if (!cancelled) {
          setJobs(jobsData);
          setStats(statsData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Couldn't load jobs right now. Check your connection and try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadJobsPage();
    return () => {
      cancelled = true;
    };
  }, [targetRole, location]);

  const filteredJobs = useMemo(() => {
    if (!search.trim()) return jobs;
    const q = search.toLowerCase();
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.tags.some((t) => t.label.toLowerCase().includes(q))
    );
  }, [jobs, search]);

  function markSaved(id) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, savedStatus: "saved" } : j)));
    setStats((prev) => ({ ...prev, savedJobs: prev.savedJobs + 1 }));
  }

  function markApplied(id) {
    setJobs((prev) =>
      prev.map((j) => (j.id === id && j.savedStatus !== "applied" ? { ...j, savedStatus: "applied" } : j))
    );
    setStats((prev) => ({ ...prev, appliedJobs: prev.appliedJobs + 1 }));
  }

  if (roleLoading || (loading && jobs.length === 0 && !error)) {
    return <p className="text-[13px] text-slate-400">Loading jobs...</p>;
  }

  return (
    <>
      <JobsHeader targetRole={targetRole} onEditRole={() => setRoleModalOpen(true)} />

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        location={location}
        onLocationChange={setLocation}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SavedJobsCard count={stats.savedJobs} />
        <AppliedJobsCard count={stats.appliedJobs} />
      </div>

      {error ? (
        <ClayCard className="p-6 text-center">
          <p className="text-[13.5px] text-rose-500 font-medium">{error}</p>
          <p className="text-[12px] text-slate-400 mt-1">
            If this keeps happening, check that ADZUNA_APP_ID / ADZUNA_APP_KEY are set on the server.
          </p>
        </ClayCard>
      ) : filteredJobs.length === 0 ? (
        <ClayCard className="p-8 text-center">
          <p className="text-[13.5px] text-slate-400">
            No openings found for "{targetRole}" right now. Try a different target role or clear your filters.
          </p>
        </ClayCard>
      ) : (
        <div className="space-y-5">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} onSaved={markSaved} onApplied={markApplied} />
          ))}
        </div>
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
