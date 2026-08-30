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
  FolderPlus,
  Video,
  ExternalLink,
  Plus,
  Percent,
} from "lucide-react";
import { ClayCard, CircularProgress } from "../components/ui";
import {
  getRoadmapData,
  createPlaylistFolder,
  addVideoToPlaylist,
  updateFolderProgress,
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
   Custom Dynamic Playlists Component
--------------------------------------------- */
function PlaylistManager({ playlists, onDataUpdate }) {
  const [folderName, setFolderName] = useState("");
  const [folderProgress, setFolderProgress] = useState(0);
  const [showFolderForm, setShowFolderForm] = useState(false);

  const [activeFolderId, setActiveFolderId] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    const updated = await createPlaylistFolder(folderName, folderProgress);
    onDataUpdate(updated);
    setFolderName("");
    setFolderProgress(0);
    setShowFolderForm(false);
  };

  const handleAddVideo = async (e, folderId) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) return;
    const updated = await addVideoToPlaylist(folderId, videoTitle, videoUrl);
    onDataUpdate(updated);
    setVideoTitle("");
    setVideoUrl("");
    setActiveFolderId(null);
  };

  const handleProgressChange = async (folderId, newProgress) => {
    const updated = await updateFolderProgress(folderId, newProgress);
    onDataUpdate(updated);
  };

  return (
    <ClayCard className="p-5 my-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-[15px]">Saved Learning Playlists</h3>
          <p className="text-[12px] text-slate-400">Organize your video resources and track individual playlist progress.</p>
        </div>
        <button
          onClick={() => setShowFolderForm(!showFolderForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 text-white text-[12px] font-medium shadow-sm hover:bg-violet-700 transition"
        >
          <FolderPlus size={15} /> New Playlist Folder
        </button>
      </div>

      {showFolderForm && (
        <form onSubmit={handleCreateFolder} className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200 flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="text-[11px] font-medium text-slate-500 mb-1 block">Folder Name</label>
            <input
              type="text"
              placeholder="e.g. React & Node.js Tutorials"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full text-[13px] px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div className="w-full sm:w-32">
            <label className="text-[11px] font-medium text-slate-500 mb-1 block">Progress (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={folderProgress}
              onChange={(e) => setFolderProgress(e.target.value)}
              className="w-full text-[13px] px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-lg text-[12.5px] font-medium w-full sm:w-auto">
            Save
          </button>
        </form>
      )}

      <div className="space-y-4">
        {playlists && playlists.length > 0 ? (
          playlists.map((folder) => (
            <div key={folder._id} className="border border-slate-100 rounded-xl p-4 bg-white shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <h4 className="font-semibold text-slate-700 text-[14px] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                  {folder.name}
                </h4>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                    <Percent size={12} className="text-slate-400" />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={folder.progress}
                      onChange={(e) => handleProgressChange(folder._id, e.target.value)}
                      className="w-10 text-[12px] font-semibold text-slate-700 bg-transparent focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-400">%</span>
                  </div>
                  <button
                    onClick={() => setActiveFolderId(activeFolderId === folder._id ? null : folder._id)}
                    className="flex items-center gap-1 text-[12px] text-violet-600 font-medium hover:underline"
                  >
                    <Plus size={14} /> Add Link
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-3">
                <div className="bg-violet-500 h-full transition-all duration-300" style={{ width: `${folder.progress}%` }} />
              </div>

              {/* Add Video Form */}
              {activeFolderId === folder._id && (
                <form onSubmit={(e) => handleAddVideo(e, folder._id)} className="bg-violet-50/50 p-3 rounded-lg mb-3 flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Video Title"
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    className="flex-1 text-[12px] px-3 py-1.5 rounded-md border border-slate-200 focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1 text-[12px] px-3 py-1.5 rounded-md border border-slate-200 focus:outline-none"
                  />
                  <button type="submit" className="px-3 py-1.5 bg-violet-600 text-white text-[12px] rounded-md font-medium">
                    Add
                  </button>
                </form>
              )}

              {/* Video Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {folder.videos && folder.videos.length > 0 ? (
                  folder.videos.map((vid) => (
                    <a
                      key={vid._id}
                      href={vid.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-violet-50/60 hover:border-violet-200 transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Video size={14} className="text-slate-400 group-hover:text-violet-600 shrink-0" />
                        <span className="text-[12px] font-medium text-slate-600 group-hover:text-slate-800 truncate">
                          {vid.title}
                        </span>
                      </div>
                      <ExternalLink size={13} className="text-slate-300 group-hover:text-violet-500 shrink-0" />
                    </a>
                  ))
                ) : (
                  <p className="text-[11.5px] text-slate-400 italic col-span-full">No videos saved yet.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-[12.5px] text-slate-400 italic">No playlist folders created yet. Click above to create one!</p>
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
          <div key={i} className={`w-7 h-7 rounded-full border flex items-center justify-center text-[11px] font-semibold ${day.done ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-200 text-slate-400"}`}>
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