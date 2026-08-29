import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  FolderKanban,
  CheckCircle2,
  Clock,
  Code2,
  Calendar,
  ExternalLink,
  MoreVertical,
  Rocket,
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import { ClayCard } from "../components/ui";
import { getProjectsData } from "../services/projectsService";

const statusPillClasses = {
  Completed: "bg-emerald-50 text-emerald-600",
  "In Progress": "bg-amber-50 text-amber-600",
  Planned: "bg-sky-50 text-sky-600",
};

/* ---------------------------------------------
   Header
--------------------------------------------- */

function ProjectsHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Projects</h1>
        <p className="text-[13px] text-slate-400 mt-1">Build, showcase and track your progress.</p>
      </div>
    </header>
  );
}

function ProjectsToolbar({ search, onSearchChange, view, onViewChange }) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <ClayCard className="flex-1 flex items-center gap-2.5 px-4 py-2.5">
        <Search size={16} className="text-slate-400 shrink-0" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects..."
          className="w-full text-[13.5px] text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
        />
      </ClayCard>

      <button className="px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] shrink-0">
        <Plus size={15} /> Add New Project
      </button>

      <div className="flex items-center gap-1 bg-white rounded-2xl border border-slate-100 p-1 shrink-0">
        <button
          onClick={() => onViewChange("grid")}
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${view === "grid" ? "bg-indigo-50 text-indigo-600" : "text-slate-400"}`}
        >
          <LayoutGrid size={16} />
        </button>
        <button
          onClick={() => onViewChange("list")}
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${view === "list" ? "bg-indigo-50 text-indigo-600" : "text-slate-400"}`}
        >
          <List size={16} />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Stats row
--------------------------------------------- */

function AddProjectTile() {
  return (
    <ClayCard className="p-6 border-dashed border-2 border-indigo-100 flex flex-col items-center justify-center text-center gap-2 cursor-pointer">
      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
        <Plus size={18} />
      </div>
      <p className="text-[13.5px] font-semibold text-slate-800">Add New Project</p>
      <p className="text-[11.5px] text-slate-400">Create a new project</p>
    </ClayCard>
  );
}

function StatTile({ icon, iconBg, iconText, value, label, sub }) {
  return (
    <ClayCard className="p-5">
      <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconText} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
      <p className="text-[12.5px] text-slate-500">{label}</p>
      <button className="text-[12px] font-semibold text-indigo-500 flex items-center gap-1 mt-2">
        View All <span aria-hidden>→</span>
      </button>
      {sub && <p className="text-[11px] text-slate-400">{sub}</p>}
    </ClayCard>
  );
}

function StatsRow({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
      <AddProjectTile />
      <StatTile icon={<FolderKanban size={18} />} iconBg="bg-indigo-50" iconText="text-indigo-500" value={stats.total} label="Total Projects" sub="Across all categories" />
      <StatTile icon={<CheckCircle2 size={18} />} iconBg="bg-emerald-50" iconText="text-emerald-500" value={stats.completed} label="Completed" sub="Keep up the good work!" />
      <StatTile icon={<Clock size={18} />} iconBg="bg-amber-50" iconText="text-amber-500" value={stats.inProgress} label="In Progress" sub="Don't stop now!" />
      <StatTile icon={<Code2 size={18} />} iconBg="bg-sky-50" iconText="text-sky-500" value={stats.planned} label="Planned" sub="Start building!" />
    </div>
  );
}

/* ---------------------------------------------
   Project card (grid + list variants)
--------------------------------------------- */

function ProjectActions({ project }) {
  return (
    <div className="flex items-center gap-3 text-slate-400">
      {project.githubUrl && (
        <a href={project.githubUrl} className="hover:text-slate-600" aria-label="GitHub repository">
          <SiGithub size={15} />
        </a>
      )}
      {project.liveUrl && (
        <a href={project.liveUrl} className="hover:text-slate-600" aria-label="Live preview">
          <ExternalLink size={15} />
        </a>
      )}
      <button aria-label="More options" className="hover:text-slate-600">
        <MoreVertical size={15} />
      </button>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <ClayCard className="p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-800 text-[15px]">{project.name}</h3>
        <span className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${statusPillClasses[project.status]}`}>
          {project.status}
        </span>
      </div>

      <p className="text-[12.5px] text-slate-500 mt-2 leading-snug flex-1">{project.description}</p>

      <div className="flex flex-wrap gap-2 mt-3.5">
        {project.techStack.map((t) => (
          <span key={t} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
            {t}
          </span>
        ))}
      </div>

      {project.progress !== null ? (
        <div className="mt-4">
          <div className="flex items-center justify-between text-[12px] mb-1.5">
            <span className="text-slate-500">Progress</span>
            <span className="font-semibold text-slate-700">{project.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${project.progress}%` }} />
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-1.5 text-[12px] text-slate-400">
          <Calendar size={13} /> {project.dateLabel}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <button className="text-[12.5px] font-semibold text-indigo-500">View Project</button>
        <ProjectActions project={project} />
      </div>
    </ClayCard>
  );
}

function ProjectListRow({ project }) {
  return (
    <ClayCard className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h3 className="font-semibold text-slate-800 text-[14.5px]">{project.name}</h3>
          <span className={`text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${statusPillClasses[project.status]}`}>
            {project.status}
          </span>
        </div>
        <p className="text-[12.5px] text-slate-500 mt-1 truncate">{project.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {project.techStack.map((t) => (
            <span key={t} className="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="sm:w-40 shrink-0">
        {project.progress !== null ? (
          <div>
            <div className="flex items-center justify-between text-[11.5px] mb-1">
              <span className="text-slate-500">Progress</span>
              <span className="font-semibold text-slate-700">{project.progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        ) : (
          <span className="text-[11.5px] text-slate-400 flex items-center gap-1.5">
            <Calendar size={12} /> {project.dateLabel}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
        <button className="text-[12.5px] font-semibold text-indigo-500">View Project</button>
        <ProjectActions project={project} />
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Bottom CTA banner
--------------------------------------------- */

function KeepBuildingBanner() {
  return (
    <ClayCard className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-violet-50 to-indigo-50 border-none">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
          <Rocket size={18} className="text-violet-500" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-slate-800">Keep building!</p>
          <p className="text-[12.5px] text-slate-500">
            Consistent projects help you stand out and land better opportunities.
          </p>
        </div>
      </div>
      <button className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(124,58,237,0.5)] shrink-0 flex items-center gap-1.5">
        View Suggested Ideas <span aria-hidden>→</span>
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Page
--------------------------------------------- */

export default function Projects() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      const result = await getProjectsData();
      if (!cancelled) setData(result);
    }

    loadProjects();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    if (!data) return [];
    if (!search.trim()) return data.projects;
    const q = search.toLowerCase();
    return data.projects.filter(
      (p) => p.name.toLowerCase().includes(q) || p.techStack.some((t) => t.toLowerCase().includes(q))
    );
  }, [data, search]);

  if (!data) {
    return <p className="text-[13px] text-slate-400">Loading your projects...</p>;
  }

  return (
    <>
      <ProjectsHeader />
      <ProjectsToolbar search={search} onSearchChange={setSearch} view={view} onViewChange={setView} />
      <StatsRow stats={data.stats} />

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredProjects.map((p) => (
            <ProjectListRow key={p.id} project={p} />
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <ClayCard className="p-8 text-center">
          <p className="text-[13.5px] text-slate-400">No projects match "{search}".</p>
        </ClayCard>
      )}

      <KeepBuildingBanner />
    </>
  );
}
