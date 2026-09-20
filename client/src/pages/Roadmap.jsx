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
  Plus,
} from "lucide-react";
import { ClayCard, CircularProgress } from "../components/ui";
import {
  getRoadmapData,
  createPlaylistItem,
  updatePlaylistItem,
  deletePlaylistItem,
  addDailyTask,
  updateDailyTask,
  deleteDailyTask,
  updateStreak,
  toggleWeeklyDay,
  addWeeklyTask,
  updateWeeklyTask,
  deleteWeeklyTask,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  updateRoadmapStats,
} from "../services/roadmapService";

/* ---------------------------------------------
   Header
--------------------------------------------- */
function RoadmapHeader({ targetRole, onDataUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [roleInput, setRoleInput] = useState(targetRole);

  const handleSaveRole = async () => {
    if (!roleInput.trim()) return;
    const updated = await updateRoadmapStats({ targetRole: roleInput });
    onDataUpdate(updated);
    setIsEditing(false);
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Your Personalized Roadmap</h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Step-by-step plan to build the skills you need and land better opportunities.
        </p>
      </div>
      <ClayCard className="px-4 py-2.5 min-w-[220px]">
        <p className="text-[11px] font-medium text-slate-400 mb-0.5">Target Role</p>
        {isEditing ? (
          <div className="flex items-center gap-1 mt-1">
            <input
              type="text"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              className="w-full text-[13px] px-2 py-1 rounded border border-slate-300 focus:outline-violet-500"
              autoFocus
            />
            <button onClick={handleSaveRole} className="text-emerald-600 p-1">
              <Check size={15} />
            </button>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 p-1">
              <X size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-between w-full text-[13.5px] font-semibold text-slate-700 hover:text-violet-600"
          >
            {targetRole}
            <Edit2 size={13} className="text-slate-400 ml-2 shrink-0" />
          </button>
        )}
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

  const [addingType, setAddingType] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemUrl, setNewItemUrl] = useState("");

  const isOpen = openFolders.has(node._id);
  const isFolder = node.type === "folder";

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    const updated = await updatePlaylistItem(node._id, { name: editName, url: editUrl });
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
      <div
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        className="group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-100/80 transition text-[13px]"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
          {isFolder ? (
            <button onClick={() => toggleFolder(node._id)} className="p-0.5 text-slate-500">
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-3.5 shrink-0" />
          )}

          {isFolder ? (
            isOpen ? <FolderOpen size={16} className="text-violet-500 shrink-0" /> : <Folder size={16} className="text-violet-500 shrink-0" />
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
              />
              {!isFolder && (
                <input
                  type="url"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="px-2 py-0.5 rounded border border-slate-300 text-[12px] bg-white focus:outline-violet-500 flex-1"
                />
              )}
              <button onClick={handleSaveEdit} className="text-emerald-600">
                <Check size={14} />
              </button>
              <button onClick={() => setIsEditing(false)} className="text-slate-400">
                <X size={14} />
              </button>
            </div>
          ) : (
            <span
              onClick={() => isFolder && toggleFolder(node._id)}
              className={`truncate font-medium cursor-pointer ${isFolder ? "text-slate-700" : "text-slate-600 hover:text-slate-900"}`}
            >
              {node.name}
            </span>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center gap-2 shrink-0">
            {isFolder && (
              <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[11px] font-semibold text-slate-600">
                <Percent size={10} className="text-slate-400" />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={node.progress || 0}
                  onChange={async (e) => {
                    const updated = await updatePlaylistItem(node._id, { progress: e.target.value });
                    onDataUpdate(updated);
                  }}
                  className="w-7 text-center bg-transparent focus:outline-none"
                />
                <span>%</span>
              </div>
            )}

            {!isFolder && node.url && (
              <a href={node.url} target="_blank" rel="noopener noreferrer" className="p-1 text-slate-400 hover:text-violet-600">
                <ExternalLink size={13} />
              </a>
            )}

            <div className="hidden group-hover:flex items-center gap-0.5">
              {isFolder && (
                <>
                  <button onClick={() => setAddingType("folder")} className="p-1 text-slate-500 hover:text-violet-600" title="New Folder">
                    <FolderPlus size={13} />
                  </button>
                  <button onClick={() => setAddingType("video")} className="p-1 text-slate-500 hover:text-violet-600" title="New Link">
                    <FilePlus size={13} />
                  </button>
                </>
              )}
              <button onClick={() => setIsEditing(true)} className="p-1 text-slate-500 hover:text-violet-600" title="Edit">
                <Edit2 size={13} />
              </button>
              <button onClick={handleDelete} className="p-1 text-slate-500 hover:text-rose-600" title="Delete">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {addingType && (
        <form onSubmit={handleCreateChild} style={{ paddingLeft: `${(depth + 1) * 20 + 8}px` }} className="my-1 py-1.5 px-2 bg-violet-50/70 rounded-lg flex flex-wrap items-center gap-2 border border-violet-100">
          <input
            type="text"
            placeholder={addingType === "folder" ? "Folder Name" : "Video Title"}
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="px-2 py-1 rounded border text-[12px] bg-white flex-1 min-w-[120px]"
            autoFocus
          />
          {addingType === "video" && (
            <input
              type="url"
              placeholder="https://..."
              value={newItemUrl}
              onChange={(e) => setNewItemUrl(e.target.value)}
              className="px-2 py-1 rounded border text-[12px] bg-white flex-1 min-w-[150px]"
            />
          )}
          <button type="submit" className="px-2.5 py-1 bg-violet-600 text-white rounded text-[11px] font-medium">
            Save
          </button>
          <button type="button" onClick={() => setAddingType(null)} className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-[11px]">
            Cancel
          </button>
        </form>
      )}

      {isFolder && isOpen && node.children && node.children.length > 0 && (
        <div>
          {node.children.map((childNode) => (
            <TreeNode key={childNode._id} node={childNode} depth={depth + 1} openFolders={openFolders} toggleFolder={toggleFolder} onDataUpdate={onDataUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------
   Playlists Component
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
          <p className="text-[12px] text-slate-400">Organize video links inside nested folders.</p>
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
            placeholder="Root Folder Name"
            value={rootFolderName}
            onChange={(e) => setRootFolderName(e.target.value)}
            className="flex-1 text-[13px] px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-violet-500 bg-white"
            autoFocus
          />
          <button type="submit" className="px-3.5 py-1.5 bg-slate-800 text-white rounded-lg text-[12px] font-medium">
            Create
          </button>
          <button type="button" onClick={() => setIsCreatingRoot(false)} className="px-3.5 py-1.5 bg-slate-200 text-slate-600 rounded-lg text-[12px] font-medium">
            Cancel
          </button>
        </form>
      )}

      <div className="border border-slate-200/80 bg-white rounded-xl p-3 min-h-[120px]">
        {tree.length > 0 ? (
          tree.map((node) => (
            <TreeNode key={node._id} node={node} depth={0} openFolders={openFolders} toggleFolder={toggleFolder} onDataUpdate={onDataUpdate} />
          ))
        ) : (
          <p className="text-[12.5px] text-slate-400 italic py-6 text-center">No folders created yet. Click above to add one!</p>
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
        <div key={i} className={`w-1.5 rounded-full ${i < level + 1 ? "bg-emerald-400" : "bg-slate-200"}`} style={{ height: h }} />
      ))}
    </div>
  );
}

/* ---------------------------------------------
   Dynamic Top Stats Row
--------------------------------------------- */
function StatsRow({ overallProgress, skillsToImprove, estimatedHours, difficulty, onDataUpdate }) {
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [hoursInput, setHoursInput] = useState(estimatedHours);

  const handleSaveHours = async () => {
    const updated = await updateRoadmapStats({ estimatedHours: hoursInput });
    onDataUpdate(updated);
    setIsEditingHours(false);
  };

  return (
    <ClayCard className="p-6 mb-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 gap-6 items-center">
        <div className="flex items-center gap-4 col-span-2 sm:col-span-1">
          <div className="relative w-[72px] h-[72px] shrink-0 flex items-center justify-center">
            <CircularProgress percentage={overallProgress} size={72} stroke={7} trackColor="#ede9fe" barColor="#7c3aed" />
            <span className="absolute text-[15px] font-bold text-slate-800">{overallProgress}%</span>
          </div>
          <p className="text-[12px] font-medium text-slate-400">Overall Dynamic Progress</p>
        </div>

        <div>
          <p className="text-[12px] text-slate-400 mb-1">Skills to Improve</p>
          <input
            type="number"
            value={skillsToImprove}
            onChange={async (e) => {
              const updated = await updateRoadmapStats({ skillsToImprove: e.target.value });
              onDataUpdate(updated);
            }}
            className="text-2xl font-bold text-slate-800 bg-transparent w-20 focus:outline-violet-500"
          />
          <p className="text-[11.5px] text-slate-400">high priority skills</p>
        </div>

        <div>
          <p className="text-[12px] text-slate-400 mb-1">Estimated Time</p>
          {isEditingHours ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={hoursInput}
                onChange={(e) => setHoursInput(e.target.value)}
                className="w-16 text-lg font-bold border rounded px-1"
                autoFocus
              />
              <button onClick={handleSaveHours} className="text-emerald-600"><Check size={14} /></button>
            </div>
          ) : (
            <p onClick={() => setIsEditingHours(true)} className="text-2xl font-bold text-slate-800 flex items-center gap-1.5 cursor-pointer">
              <Clock size={16} className="text-indigo-500" />
              {estimatedHours} <span className="text-slate-300 text-base font-semibold">hrs</span>
            </p>
          )}
          <p className="text-[11.5px] text-slate-400">to reach your goal</p>
        </div>

        <div>
          <p className="text-[12px] text-slate-400 mb-1">Roadmap Difficulty</p>
          <select
            value={difficulty}
            onChange={async (e) => {
              const updated = await updateRoadmapStats({ difficulty: e.target.value });
              onDataUpdate(updated);
            }}
            className="text-[12px] font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard</option>
          </select>
          <DifficultyBars difficulty={difficulty} />
        </div>

        <div className="col-span-2 sm:col-span-4 xl:col-span-1 bg-indigo-50/60 rounded-2xl p-4 flex gap-2.5">
          <Sparkles size={16} className="text-violet-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[12.5px] font-semibold text-slate-700 mb-1">Stay Consistent!</p>
            <p className="text-[11.5px] text-slate-500 leading-snug">Goals auto-calculate your overall progress.</p>
          </div>
        </div>
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Dynamic Daily Goal Card
--------------------------------------------- */
function DailyGoalCard({ dailyGoal, onDataUpdate }) {
  if (!dailyGoal) return null;
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newTotal, setNewTotal] = useState(1);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editLabel, setEditLabel] = useState("");

  const completedTasks = dailyGoal.tasks.reduce((acc, task) => acc + (task.done >= task.total ? 1 : 0), 0);
  const pct = Math.round((completedTasks / dailyGoal.tasks.length) * 100) || 0;

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    const updated = await addDailyTask(newLabel, newTotal);
    onDataUpdate(updated);
    setNewLabel("");
    setNewTotal(1);
    setShowAddForm(false);
  };

  const handleToggleTask = async (taskId, isChecked) => {
    const updated = await updateDailyTask(taskId, { completed: isChecked });
    onDataUpdate(updated);
  };

  const handleDeleteTask = async (taskId) => {
    const updated = await deleteDailyTask(taskId);
    onDataUpdate(updated);
  };

  const handleSaveEditLabel = async (taskId) => {
    const updated = await updateDailyTask(taskId, { label: editLabel });
    onDataUpdate(updated);
    setEditingTaskId(null);
  };

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
          <div key={task._id} className="group flex items-center justify-between gap-2 py-1">
            {editingTaskId === task._id ? (
              <div className="flex items-center gap-1 flex-1">
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="px-2 py-0.5 text-[12px] border rounded flex-1"
                />
                <button onClick={() => handleSaveEditLabel(task._id)} className="text-emerald-600"><Check size={14} /></button>
                <button onClick={() => setEditingTaskId(null)} className="text-slate-400"><X size={14} /></button>
              </div>
            ) : (
              <>
                <label className="flex items-center gap-2.5 text-[12.5px] text-slate-600 cursor-pointer flex-1 min-w-0">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 accent-indigo-500 shrink-0"
                    checked={task.done >= task.total}
                    onChange={(e) => handleToggleTask(task._id, e.target.checked)}
                  />
                  <span className={`truncate ${task.done >= task.total ? "line-through text-slate-400" : ""}`}>{task.label}</span>
                </label>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11.5px] text-slate-400">
                    {task.done}/{task.total}
                  </span>
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button onClick={() => { setEditingTaskId(task._id); setEditLabel(task.label); }} className="text-slate-400 hover:text-violet-600">
                      <Edit2 size={12} />
                    </button>
                    <button onClick={() => handleDeleteTask(task._id)} className="text-slate-400 hover:text-rose-600">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {showAddForm ? (
        <form onSubmit={handleAddTask} className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            placeholder="New Task"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="flex-1 text-[12px] px-2 py-1 border rounded"
            autoFocus
          />
          <input
            type="number"
            min="1"
            value={newTotal}
            onChange={(e) => setNewTotal(e.target.value)}
            className="w-12 text-[12px] px-2 py-1 border rounded"
          />
          <button type="submit" className="p-1 bg-violet-600 text-white rounded"><Check size={14} /></button>
          <button type="button" onClick={() => setShowAddForm(false)} className="p-1 bg-slate-200 text-slate-600 rounded"><X size={14} /></button>
        </form>
      ) : (
        <button onClick={() => setShowAddForm(true)} className="mt-3 flex items-center gap-1 text-[12px] text-violet-600 font-medium hover:underline">
          <Plus size={13} /> Add Task
        </button>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
          <Flame size={14} className="text-orange-400" />
          <input
            type="number"
            value={dailyGoal.streak}
            onChange={async (e) => {
              const updated = await updateStreak(e.target.value);
              onDataUpdate(updated);
            }}
            className="w-10 text-center font-bold bg-slate-100 rounded"
          />
          <span>day streak</span>
        </div>
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Dynamic Weekly Goal Component
--------------------------------------------- */
function WeeklyGoalCard({ weeklyGoal, onDataUpdate }) {
  if (!weeklyGoal) return null;
  const [showAdd, setShowAdd] = useState(false);
  const [label, setLabel] = useState("");
  const [total, setTotal] = useState(1);
  const [unit, setUnit] = useState("tasks");

  const handleToggleDay = async (index) => {
    const updated = await toggleWeeklyDay(index);
    onDataUpdate(updated);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    const updated = await addWeeklyTask(label, total, unit);
    onDataUpdate(updated);
    setLabel("");
    setShowAdd(false);
  };

  const handleDeleteTask = async (taskId) => {
    const updated = await deleteWeeklyTask(taskId);
    onDataUpdate(updated);
  };

  return (
    <ClayCard className="p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <CalendarDays size={17} className="text-indigo-500" />
        <h3 className="font-semibold text-slate-800 text-[14.5px]">Weekly Goal</h3>
      </div>

      {/* Days Interactive Pills */}
      <div className="flex justify-between my-3">
        {weeklyGoal.days?.map((day, i) => (
          <button
            key={i}
            onClick={() => handleToggleDay(i)}
            className={`w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-semibold transition ${
              day.done ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-200 text-slate-400 hover:border-indigo-300"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Dynamic Weekly Target Tasks */}
      <div className="space-y-2 mt-3 pt-3 border-t border-slate-100">
        {weeklyGoal.tasks?.map((task) => (
          <div key={task._id} className="group flex items-center justify-between text-[12.5px] text-slate-600">
            <span className="truncate">{task.label}</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max={task.total}
                value={task.done}
                onChange={async (e) => {
                  const updated = await updateWeeklyTask(task._id, { done: e.target.value });
                  onDataUpdate(updated);
                }}
                className="w-8 text-center bg-slate-100 rounded"
              />
              <span className="text-[11px] text-slate-400">/ {task.total} {task.unit}</span>
              <button onClick={() => handleDeleteTask(task._id)} className="hidden group-hover:block text-rose-500">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAdd ? (
        <form onSubmit={handleAddTask} className="mt-3 flex gap-1 items-center">
          <input
            type="text"
            placeholder="Target Goal"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="text-[11px] px-2 py-1 border rounded flex-1"
            autoFocus
          />
          <input
            type="number"
            min="1"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="text-[11px] w-10 px-1 py-1 border rounded"
          />
          <button type="submit" className="text-emerald-600"><Check size={14} /></button>
          <button type="button" onClick={() => setShowAdd(false)} className="text-slate-400"><X size={14} /></button>
        </form>
      ) : (
        <button onClick={() => setShowAdd(true)} className="mt-3 flex items-center gap-1 text-[12px] text-indigo-600 font-medium hover:underline">
          <Plus size={13} /> Add Weekly Target
        </button>
      )}
    </ClayCard>
  );
}

/* ---------------------------------------------
   Dynamic Milestones Component
--------------------------------------------- */
function MilestonesCard({ milestones, onDataUpdate }) {
  if (!milestones) return null;
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newProgress, setNewProgress] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState("");

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    const updated = await addMilestone(newLabel, newProgress);
    onDataUpdate(updated);
    setNewLabel("");
    setNewProgress(0);
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    const updated = await deleteMilestone(id);
    onDataUpdate(updated);
  };

  const handleSaveEdit = async (id) => {
    const updated = await updateMilestone(id, { label: editLabel });
    onDataUpdate(updated);
    setEditingId(null);
  };

  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Trophy size={17} className="text-amber-500" />
          <h3 className="font-semibold text-slate-800 text-[14.5px]">Milestones</h3>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="text-[12px] text-violet-600 font-medium hover:underline flex items-center gap-0.5">
          <Plus size={13} /> Add
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddMilestone} className="mb-3 bg-slate-50 p-2 rounded-lg border border-slate-200 flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Milestone Title"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="text-[12px] px-2 py-1 border rounded flex-1"
            autoFocus
          />
          <input
            type="number"
            min="0"
            max="100"
            placeholder="%"
            value={newProgress}
            onChange={(e) => setNewProgress(e.target.value)}
            className="text-[12px] w-12 px-2 py-1 border rounded"
          />
          <button type="submit" className="px-2 py-1 bg-violet-600 text-white text-[11px] rounded">Save</button>
        </form>
      )}

      <div className="space-y-3">
        {milestones.map((m) => (
          <div key={m._id} className="group flex flex-col gap-1">
            <div className="flex items-center justify-between gap-2 text-[12.5px]">
              {editingId === m._id ? (
                <div className="flex items-center gap-1 flex-1">
                  <input
                    type="text"
                    value={editLabel}
                    onChange={(e) => setEditLabel(e.target.value)}
                    className="text-[12px] px-2 py-0.5 border rounded flex-1"
                  />
                  <button onClick={() => handleSaveEdit(m._id)} className="text-emerald-600"><Check size={14} /></button>
                </div>
              ) : (
                <span className="text-slate-700 font-medium truncate flex-1">{m.label}</span>
              )}

              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={m.progress}
                  onChange={async (e) => {
                    const updated = await updateMilestone(m._id, { progress: e.target.value });
                    onDataUpdate(updated);
                  }}
                  className="w-10 text-center font-semibold text-[11.5px] bg-slate-50 rounded border"
                />
                <span className="text-[11.5px] text-slate-400">%</span>

                <div className="hidden group-hover:flex items-center gap-1">
                  <button onClick={() => { setEditingId(m._id); setEditLabel(m.label); }} className="text-slate-400 hover:text-violet-600">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => handleDelete(m._id)} className="text-slate-400 hover:text-rose-600">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${m.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Roadmap Phases Component
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
                {phase.skills?.map((skill) => (
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
   Main Roadmap Page Component
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

  if (!data) {
    return <p className="text-[13px] text-slate-400 p-8">Loading your roadmap...</p>;
  }

  return (
    <>
      <RoadmapHeader targetRole={data.targetRole} onDataUpdate={(updated) => setData(updated)} />

      <PlaylistManager playlists={data.playlists} onDataUpdate={(updated) => setData(updated)} />

      <StatsRow
        overallProgress={data.overallProgress}
        skillsToImprove={data.skillsToImprove}
        estimatedHours={data.estimatedHours}
        difficulty={data.difficulty}
        onDataUpdate={(updated) => setData(updated)}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        <div className="xl:col-span-2">
          <RoadmapPhasesCard phases={data.phases} />
        </div>
        <div className="space-y-5">
          <DailyGoalCard dailyGoal={data.dailyGoal} onDataUpdate={(updated) => setData(updated)} />
          <WeeklyGoalCard weeklyGoal={data.weeklyGoal} onDataUpdate={(updated) => setData(updated)} />
          <MilestonesCard milestones={data.milestones} onDataUpdate={(updated) => setData(updated)} />
        </div>
      </div>
    </>
  );
}