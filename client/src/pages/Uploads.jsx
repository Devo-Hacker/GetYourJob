import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  Trash2,
  Rocket,
  Upload,
  FileText,
  X,
} from "lucide-react";
import { SiGithub } from "react-icons/si";
import { ClayCard } from "../components/ui";
import { getProjectsData, createProject, deleteProject } from "../services/projectsService";
import { getProfile, uploadResume } from "../services/profileService";

const statusPillClasses = {
  Completed: "bg-emerald-50 text-emerald-600",
  "In Progress": "bg-amber-50 text-amber-600",
  Planned: "bg-sky-50 text-sky-600",
};

/* ---------------------------------------------
   Header
--------------------------------------------- */

function UploadsHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Uploads</h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Upload your resume and showcase your projects.
        </p>
      </div>
    </header>
  );
}

/* ---------------------------------------------
   Resume upload
--------------------------------------------- */

function ResumeUploadCard({ profile, onUpload, uploading, error }) {
  const fileInputRef = useRef(null);
  const resumeSkills = (profile?.skills || []).filter((s) => s.source === "resume");

  function handlePick(e) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  }

  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-slate-800 text-[15px]">Resume</h3>
        {profile?.resume?.fileName && (
          <span className="text-[11px] text-slate-400">
            Uploaded {new Date(profile.resume.uploadedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {error && (
        <p className="text-[12px] text-rose-500 mt-2 mb-1">{error}</p>
      )}

      {profile?.resume?.fileName ? (
        <div className="flex items-center gap-3 mt-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
            <FileText size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13.5px] font-medium text-slate-800 truncate">{profile.resume.fileName}</p>
            <p className="text-[11.5px] text-slate-400">{resumeSkills.length} skills extracted</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-[12.5px] font-semibold text-slate-600 shrink-0 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Replace"}
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mt-2 w-full py-8 rounded-2xl border-2 border-dashed border-indigo-100 flex flex-col items-center justify-center gap-2 text-slate-500 disabled:opacity-50"
        >
          <Upload size={20} className="text-indigo-400" />
          <span className="text-[13px] font-medium">
            {uploading ? "Uploading & analyzing..." : "Upload your resume (PDF)"}
          </span>
        </button>
      )}

      {resumeSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {resumeSkills.slice(0, 10).map((s) => (
            <span
              key={s.name}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600"
            >
              {s.name}
            </span>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handlePick}
      />
    </ClayCard>
  );
}

/* ---------------------------------------------
   Toolbar
--------------------------------------------- */

function ProjectsToolbar({ search, onSearchChange, view, onViewChange, onAddClick }) {
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

      <button
        onClick={onAddClick}
        className="px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] shrink-0"
      >
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

function AddProjectTile({ onClick }) {
  return (
    <ClayCard
      onClick={onClick}
      className="p-6 border-dashed border-2 border-indigo-100 flex flex-col items-center justify-center text-center gap-2 cursor-pointer"
    >
      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
        <Plus size={18} />
      </div>
      <p className="text-[13.5px] font-semibold text-slate-800">Add New Project</p>
      <p className="text-[11.5px] text-slate-400">Create a new project</p>
    </ClayCard>
  );
}

function StatTile({ icon, iconBg, iconText, value, label }) {
  return (
    <ClayCard className="p-5">
      <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconText} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
      <p className="text-[12.5px] text-slate-500">{label}</p>
    </ClayCard>
  );
}

function StatsRow({ stats, onAddClick }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
      <AddProjectTile onClick={onAddClick} />
      <StatTile icon={<FolderKanban size={18} />} iconBg="bg-indigo-50" iconText="text-indigo-500" value={stats.total} label="Total Projects" />
      <StatTile icon={<CheckCircle2 size={18} />} iconBg="bg-emerald-50" iconText="text-emerald-500" value={stats.completed} label="Completed" />
      <StatTile icon={<Clock size={18} />} iconBg="bg-amber-50" iconText="text-amber-500" value={stats.inProgress} label="In Progress" />
      <StatTile icon={<Code2 size={18} />} iconBg="bg-sky-50" iconText="text-sky-500" value={stats.planned} label="Planned" />
    </div>
  );
}

/* ---------------------------------------------
   Project card (grid + list variants)
--------------------------------------------- */

function ProjectActions({ project, onDelete }) {
  return (
    <div className="flex items-center gap-3 text-slate-400">
      {project.githubUrl && (
        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:text-slate-600" aria-label="GitHub repository">
          <SiGithub size={15} />
        </a>
      )}
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:text-slate-600" aria-label="Live preview">
          <ExternalLink size={15} />
        </a>
      )}
      <button onClick={() => onDelete(project.id)} aria-label="Delete project" className="hover:text-rose-500">
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function ProjectCard({ project, onDelete }) {
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

      <div className="mt-4 flex items-center gap-1.5 text-[12px] text-slate-400">
        <Calendar size={13} /> {project.dateLabel}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <span className="text-[12.5px] font-semibold text-slate-400">
          {project.fileName ? project.fileName : "No file attached"}
        </span>
        <ProjectActions project={project} onDelete={onDelete} />
      </div>
    </ClayCard>
  );
}

function ProjectListRow({ project, onDelete }) {
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

      <span className="text-[11.5px] text-slate-400 flex items-center gap-1.5 sm:w-36 shrink-0">
        <Calendar size={12} /> {project.dateLabel}
      </span>

      <div className="flex items-center justify-end gap-4 shrink-0">
        <ProjectActions project={project} onDelete={onDelete} />
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Add project modal
--------------------------------------------- */

function AddProjectModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    techStack: "",
    status: "In Progress",
    githubUrl: "",
    liveUrl: "",
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onCreate({ ...form, file });
      setForm({ name: "", description: "", techStack: "", status: "In Progress", githubUrl: "", liveUrl: "" });
      setFile(null);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not add project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-slate-800 outline-none focus:border-indigo-400";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add New Project"
        className="relative w-full max-w-md bg-white rounded-[28px] shadow-2xl max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Add New Project</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-3 text-[13px] text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <input
            required
            placeholder="Project name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
          <textarea
            placeholder="Description"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={inputClass}
          />
          <input
            placeholder="Tech stack (comma separated)"
            value={form.techStack}
            onChange={(e) => setForm({ ...form, techStack: e.target.value })}
            className={inputClass}
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className={inputClass}
          >
            <option>In Progress</option>
            <option>Completed</option>
            <option>Planned</option>
          </select>
          <input
            placeholder="GitHub URL (optional)"
            value={form.githubUrl}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            className={inputClass}
          />
          <input
            placeholder="Live URL (optional)"
            value={form.liveUrl}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            className={inputClass}
          />

          <div>
            <label className="text-[11.5px] font-medium text-slate-500">
              Attach a file (screenshot, zip, doc - optional)
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1.5 w-full text-[12.5px] text-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add Project"}
          </button>
        </form>
      </div>
    </div>,
    document.body
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
    </ClayCard>
  );
}

/* ---------------------------------------------
   Page
--------------------------------------------- */

export default function Uploads() {
  const [projectsData, setProjectsData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError, setResumeError] = useState("");

  async function loadAll() {
    const [projects, profileData] = await Promise.all([getProjectsData(), getProfile()]);
    setProjectsData(projects);
    setProfile(profileData);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [projects, profileData] = await Promise.all([getProjectsData(), getProfile()]);
      if (!cancelled) {
        setProjectsData(projects);
        setProfile(profileData);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProjects = useMemo(() => {
    if (!projectsData) return [];
    if (!search.trim()) return projectsData.projects;
    const q = search.toLowerCase();
    return projectsData.projects.filter(
      (p) => p.name.toLowerCase().includes(q) || p.techStack.some((t) => t.toLowerCase().includes(q))
    );
  }, [projectsData, search]);

  async function handleResumeUpload(file) {
    setResumeError("");
    setResumeUploading(true);
    try {
      const updatedProfile = await uploadResume(file);
      setProfile(updatedProfile);
    } catch (err) {
      setResumeError(err.response?.data?.message || "Resume upload failed. Please try again.");
    } finally {
      setResumeUploading(false);
    }
  }

  async function handleCreateProject(values) {
    await createProject(values);
    await loadAll();
  }

  async function handleDeleteProject(id) {
    await deleteProject(id);
    await loadAll();
  }

  if (!projectsData || profile === null) {
    return <p className="text-[13px] text-slate-400">Loading your uploads...</p>;
  }

  return (
    <>
      <UploadsHeader />

      <ResumeUploadCard
        profile={profile}
        onUpload={handleResumeUpload}
        uploading={resumeUploading}
        error={resumeError}
      />

      <ProjectsToolbar
        search={search}
        onSearchChange={setSearch}
        view={view}
        onViewChange={setView}
        onAddClick={() => setModalOpen(true)}
      />
      <StatsRow stats={projectsData.stats} onAddClick={() => setModalOpen(true)} />

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} onDelete={handleDeleteProject} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredProjects.map((p) => (
            <ProjectListRow key={p.id} project={p} onDelete={handleDeleteProject} />
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <ClayCard className="p-8 text-center">
          <p className="text-[13.5px] text-slate-400">
            {search ? `No projects match "${search}".` : "No projects yet - add your first one above."}
          </p>
        </ClayCard>
      )}

      <KeepBuildingBanner />

      <AddProjectModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreateProject} />
    </>
  );
}
