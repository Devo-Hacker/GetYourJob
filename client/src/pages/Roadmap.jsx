import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  Sparkles,
  Calendar,
  CalendarDays,
  Flame,
  Trophy,
  Folder,
  FolderOpen,
  Video,
  ExternalLink,
  FolderPlus,
  FilePlus,
  Trash2,
  Edit2,
  Check,
  X,
  Percent,
} from "lucide-react";
import { ClayCard, CircularProgress } from "../components/ui";
import {
  getRoadmapData,
  createPlaylistItem,
  updatePlaylistItem,
  deletePlaylistItem,
  updateTaskProgress,
} from "../services/roadmapService";

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
   Tree Node Component (VS Code File/Folder Tree)
--------------------------------------------- */
function TreeNode({ node, depth = 0, openFolders, toggleFolder, onDataUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const [editUrl, setEditUrl] = useState(node.url || "");
  const [editProgress, setEditProgress] = useState(node.progress || 0);

  const [addingType, setAddingType] = useState(null); // 'folder' | 'video' | null
  const [newItemName, setNewItemName] = useState("");
  const [newItemUrl, setNewItemUrl] = useState("");

  const isOpen = openFolders.has(node._id);
  const isFolder = node.type === "folder";

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    const updated = await updatePlaylistItem(node._id, {
      name: editName,
      url: editUrl,
      progress: editProgress,
    });
    onDataUpdate(updated);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${node.name}"?`)) {
      const updated = await deletePlaylistItem(node._id);
      onDataUpdate(updated);
    }
  };

  const handleCreateChild = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const updated = await createPlaylistItem(
      newItemName,
      addingType,
      node._id,
      addingType === "video" ? newItemUrl : ""
    );
    onDataUpdate(updated);
    setAddingType(null);
    setNewItemName("");
    setNewItemUrl("");
    if (!isOpen) toggleFolder(node._id);
  };

  return (
    <div className="select-none">
      {/* Node Main Row */}
      <div
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        className="group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-100/80 transition text-[13px]"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
          {isFolder ? (
            <button
              onClick={() => toggleFolder(node._id)}
              className="p-0.5 rounded hover:bg-slate-200/60 text-slate-500"
            >
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-3.5 shrink-0" />
          )}

          {isFolder ? (
            isOpen ? (
              <FolderOpen size={16} className="text-violet-500 shrink-0" />
            ) : (
              <Folder size={16} className="text-violet-500 shrink-0" />
            )
          ) : (
            <Video size={15} className="text-sky-500 shrink-0" />
          )}

          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="px-2 py-0.5 rounded border border-slate-300 text-[12px] bg-white focus:outline-violet-500 flex-1"
                placeholder="Name"
              />
              {!isFolder && (
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="px-2 py-0.5 rounded border border-slate-300 text-[12px] bg-white focus:outline-violet-500 flex-1"
                  placeholder="URL"
                />
              )}
              <button onClick={handleSaveEdit} className="text-emerald-600 hover:text-emerald-700">
                <Check size={14} />
              </button>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            </div>
          ) : (
            <span
              onClick={() => isFolder && toggleFolder(node._id)}
              className={`truncate font-medium cursor-pointer ${
                isFolder ? "text-slate-700" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {node.name}
            </span>
          )}
        </div>

        {/* Right Side Controls & Status */}
        {!isEditing && (
          <div className="flex items-center gap-2 opacity-90 group-hover:opacity-100 shrink-0">
            {isFolder && (
              <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[11px] font-semibold text-slate-600">
                <Percent size={10} className="text-slate-400" />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={node.progress || 0}
                  onChange={async (e) => {
                    const updated = await updatePlaylistItem(node._id, {
                      progress: e.target.value,
                    });
                    onDataUpdate(updated);
                  }}
                  className="w-7 text-center bg-transparent focus:outline-none"
                />
                <span>%</span>
              </div>
            )}

            {!isFolder && node.url && (
              <a
                href={node.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded text-slate-400 hover:text-violet-600 hover:bg-slate-200/50"
                title="Open Link"
              >
                <ExternalLink size={13} />
              </a>
            )}

            {/* Sub-item Action buttons */}
            <div className="hidden group-hover:flex items-center gap-0.5">
              {isFolder && (
                <>
                  <button
                    onClick={() => setAddingType("folder")}
                    className="p-1 rounded text-slate-500 hover:text-violet-600 hover:bg-slate-200/60"
                    title="New Subfolder"
                  >
                    <FolderPlus size={13} />
                  </button>
                  <button
                    onClick={() => setAddingType("video")}
                    className="p-1 rounded text-slate-500 hover:text-violet-600 hover:bg-slate-200/60"
                    title="New Video Link"
                  >
                    <FilePlus size={13} />
                  </button>
                </>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 rounded text-slate-500 hover:text-violet-600 hover:bg-slate-200/60"
                title="Edit"
              >
                <Edit2 size={13} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Creation form sub-row */}
      {addingType && (
        <form
          onSubmit={handleCreateChild}
          style={{ paddingLeft: `${(depth + 1) * 20 + 8}px` }}
          className="my-1 py-1.5 px-2 bg-violet-50/70 rounded-lg flex flex-wrap items-center gap-2 border border-violet-100"
        >
          <span className="text-[11px] font-semibold text-violet-700">
            Add {addingType === "folder" ? "Folder" : "Video"}:
          </span>
          <input
            type="text"
            placeholder={addingType === "folder" ? "Folder Name" : "Video Title"}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="px-2 py-1 rounded border border-slate-200 text-[12px] bg-white focus:outline-violet-500 flex-1 min-w-[120px]"
            autoFocus
          />
          {addingType === "video" && (
            <input
              type="url"
              placeholder="https://..."
              value={newItemUrl}
              onChange={(e) => setNewItemUrl(e.target.value)}
              className="px-2 py-1 rounded border border-slate-200 text-[12px] bg-white focus:outline-violet-500 flex-1 min-w-[150px]"
            />
          )}
          <button type="submit" className="px-2.5 py-1 bg-violet-600 text-white rounded text-[11px] font-medium">
            Save
          </button>
          <button
            type="button"
            onClick={() => setAddingType(null)}
            className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-[11px]"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Render Subtree */}
      {isFolder && isOpen && node.children && node.children.length > 0 && (
        <div>
          {node.children.map((childNode) => (
            <TreeNode
              key={childNode._id}
              node={childNode}
              depth={depth + 1}
              openFolders={openFolders}
              toggleFolder={toggleFolder}
              onDataUpdate={onDataUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------
   Custom Dynamic Playlists Component
--------------------------------------------- */
function PlaylistManager({ playlists, onDataUpdate }) {
  const [openFolders, setOpenFolders] = useState(new Set());
  const [isCreatingRoot, setIsCreatingRoot] = useState(false);
  const [rootFolderName, setRootFolderName] = useState("");

  const toggleFolder = (folderId) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  };

  const handleCreateRootFolder = async (e) => {
    e.preventDefault();
    if (!rootFolderName.trim()) return;
    const updated = await createPlaylistItem(rootFolderName, "folder", null, "");
    onDataUpdate(updated);
    setRootFolderName("");
    setIsCreatingRoot(false);
  };

  // Convert Flat Array -> Hierarchical Tree
  const buildTree = (items = []) => {
    const map = {};
    const roots = [];

    items.forEach((item) => {
      map[item._id] = { ...item, children: [] };
    });

    items.forEach((item) => {
      if (item.parentId && map[item.parentId]) {
        map[item.parentId].children.push(map[item._id]);
      } else {
        roots.push(map[item._id]);
      }
    });

    return roots;
  };

  const tree = buildTree(playlists);

  return (
    <ClayCard className="p-5 my-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-[15px]">Saved Learning Playlists</h3>
          <p className="text-[12px] text-slate-400">
            Nested file explorer structure to organize your learning materials.
          </p>
        </div>
        <button
          onClick={() => setIsCreatingRoot(!isCreatingRoot)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 text-white text-[12px] font-medium shadow-sm hover:bg-violet-700 transition"
        >
          <FolderPlus size={15} /> New Root Folder
        </button>
      </div>

      {isCreatingRoot && (
        <form onSubmit={handleCreateRootFolder} className="bg-slate-50 p-3 rounded-xl mb-4 border border-slate-200 flex gap-2">
          <input
            type="text"
            placeholder="Root Folder Name (e.g. Frontend Mastery)"
            value={rootFolderName}
            onChange={(e) => setRootFolderName(e.target.value)}
            className="flex-1 text-[13px] px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-violet-500 bg-white"
            autoFocus
          />
          <button type="submit" className="px-3.5 py-1.5 bg-slate-800 text-white rounded-lg text-[12px] font-medium">
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingRoot(false)}
            className="px-3.5 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-[12px] font-medium"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Directory Explorer Box */}
      <div className="border border-slate-200/80 bg-white rounded-xl p-3 min-h-[140px] shadow-xs">
        {tree.length > 0 ? (
          tree.map((node) => (
            <TreeNode
              key={node._id}
              node={node}
              depth={0}
              openFolders={openFolders}
              toggleFolder={toggleFolder}
              onDataUpdate={onDataUpdate}
            />
          ))
        ) : (
          <p className="text-[12.5px] text-slate-400 italic py-8 text-center">
            No folders created yet. Click above to create your first root directory!
          </p>
        )}
      </div>
    </ClayCard>
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
    <ClayCard className="p-6 mb-5">
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
        <div className={`w-8 h-8 rounded-full ${tone.badge} text-white text-[13px] font-bold flex items-center justify-center shrink-0`}>
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
                  <span key={skill} className="text-[11.5px] font-medium px-2.5 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
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
  if (!phases || phases.length === 0) return null;
  return (
    <ClayCard className="p-5">
      <h3 className="font-semibold text-slate-800 text-[15px] mb-4">Roadmap Phases</h3>
      <div className="flex flex-col">
        {phases.map((phase, i) => (
          <PhaseCard key={phase.id} phase={phase} isLast={i === phases.length - 1} />
        ))}
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Daily Goal Card
--------------------------------------------- */
function DailyGoalCard({ dailyGoal, onUpdateTask }) {
  if (!dailyGoal) return null;
  const completedTasks = dailyGoal.tasks.reduce((acc, task) => acc + (task.done >= task.total ? 1 : 0), 0);
  const pct = Math.round((completedTasks / dailyGoal.tasks.length) * 100) || 0;

  return (
    <ClayCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-2.5">
          <Calendar size={17} className="text-indigo-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-slate-800 text-[14.5px]">Daily Goal</h3>
            <p className="text-[13px] font-semibold text-indigo-600">
              {completedTasks}/{dailyGoal.tasks.length} tasks completed
            </p>
          </div>
        </div>
        <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
          <CircularProgress percentage={pct} size={44} stroke={4} trackColor="#f1f5f9" barColor="#7c3aed" />
          <span className="absolute text-[10.5px] font-bold text-slate-800">{pct}%</span>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        {dailyGoal.tasks.map((task) => (
          <div key={task._id || task.label} className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2.5 text-[12.5px] text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 accent-indigo-500"
                checked={task.done >= task.total}
                onChange={(e) => onUpdateTask(task._id, e.target.checked)}
              />
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
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Weekly Goal & Milestones
--------------------------------------------- */
function WeeklyGoalCard({ weeklyGoal }) {
  if (!weeklyGoal) return null;
  return (
    <ClayCard className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-2.5">
          <CalendarDays size={17} className="text-indigo-500 mt-0.5" />
          <h3 className="font-semibold text-slate-800 text-[14.5px]">Weekly Goal</h3>
        </div>
      </div>
      <div className="flex justify-between mt-3.5">
        {weeklyGoal.days?.map((day, i) => (
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
    </ClayCard>
  );
}

function MilestonesCard({ milestones }) {
  if (!milestones) return null;
  return (
    <ClayCard className="p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <Trophy size={17} className="text-amber-500" />
        <h3 className="font-semibold text-slate-800 text-[14.5px]">Milestones</h3>
      </div>
      <div className="space-y-3">
        {milestones.map((m) => (
          <div key={m.label} className="flex items-center justify-between gap-2">
            <span className="text-[12.5px] text-slate-600">{m.label}</span>
            <span className="text-[11.5px] text-slate-400">{m.progress}%</span>
          </div>
        ))}
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Main Roadmap Component
--------------------------------------------- */
export default function Roadmap() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadRoadmap() {
      try {
        const result = await getRoadmapData();
        if (!cancelled) setData(result);
      } catch (err) {
        console.error("Failed to load roadmap:", err);
      }
    }
    loadRoadmap();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleTaskUpdate = async (taskId, isCompleted) => {
    try {
      const updatedRoadmap = await updateTaskProgress(taskId, isCompleted);
      setData(updatedRoadmap);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  if (!data) {
    return <p className="text-[13px] text-slate-400 p-8">Loading your roadmap...</p>;
  }

  return (
    <>
      <RoadmapHeader targetRole={data.targetRole} />

      <PlaylistManager playlists={data.playlists} onDataUpdate={(updated) => setData(updated)} />

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
          <DailyGoalCard dailyGoal={data.dailyGoal} onUpdateTask={handleTaskUpdate} />
          <WeeklyGoalCard weeklyGoal={data.weeklyGoal} />
          <MilestonesCard milestones={data.milestones} />
        </div>
      </div>
    </>
  );
}