// import React, { useEffect, useState } from "react";
// import { Plus, Flame, TrendingUp, Trophy, Clock, Code2, ChevronRight, ChevronDown, ShieldCheck, Settings2, CheckCircle2, ArrowUpRight } from "lucide-react";
// import {
//   SiGithub,
//   SiLeetcode,
//   SiGeeksforgeeks,
//   SiCodechef,
//   SiHackerrank,
//   SiCodeforces,
//   SiKaggle,
//   SiGitlab,
//   SiHackerearth,
// } from "react-icons/si";
// import { ClayCard, LineChart } from "../components/ui";
// import { getConnectionsData } from "../services/connectionsService";
// import AddPlatformModal from "../components/AddPlatformModal";

// const platformIcons = {
//   github: { Icon: SiGithub, bg: "bg-slate-900", text: "text-white" },
//   leetcode: { Icon: SiLeetcode, bg: "bg-orange-50", text: "text-orange-500" },
//   gfg: { Icon: SiGeeksforgeeks, bg: "bg-emerald-50", text: "text-emerald-600" },
//   geeksforgeeks: { Icon: SiGeeksforgeeks, bg: "bg-emerald-50", text: "text-emerald-600" },
//   codechef: { Icon: SiCodechef, bg: "bg-amber-50", text: "text-amber-700" },
//   hackerrank: { Icon: SiHackerrank, bg: "bg-emerald-50", text: "text-emerald-600" },
//   codeforces: { Icon: SiCodeforces, bg: "bg-indigo-50", text: "text-indigo-600" },
//   kaggle: { Icon: SiKaggle, bg: "bg-sky-50", text: "text-sky-600" },
//   gitlab: { Icon: SiGitlab, bg: "bg-orange-50", text: "text-orange-600" },
//   hackerearth: { Icon: SiHackerearth, bg: "bg-indigo-50", text: "text-indigo-600" },
// };

// /* ---------------------------------------------
//    Header
// --------------------------------------------- */

// function ConnectionsHeader({ onAddClick }) {
//   return (
//     <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//       <div>
//         <h1 className="text-2xl font-bold text-slate-800">Developer Progress</h1>
//         <p className="text-[13px] text-slate-400 mt-1">
//           Track your activity across all your developer platforms in one place.
//         </p>
//       </div>
//       <button
//         onClick={onAddClick}
//         className="px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] shrink-0"
//       >
//         <Plus size={15} /> Add Platform
//       </button>
//     </header>
//   );
// }

// /* ---------------------------------------------
//    Stats row
// --------------------------------------------- */

// function StatItem({ icon, iconBg, iconText, value, label, sub, subTone = "slate" }) {
//   const subToneClasses = {
//     slate: "text-slate-400",
//     emerald: "text-emerald-500",
//   };
//   return (
//     <div className="flex items-center gap-3">
//       <div className={`w-11 h-11 rounded-2xl ${iconBg} ${iconText} flex items-center justify-center shrink-0`}>
//         {icon}
//       </div>
//       <div>
//         <p className="text-xl font-bold text-slate-800 leading-tight">{value}</p>
//         <p className="text-[12px] text-slate-500">{label}</p>
//         {sub && <p className={`text-[11px] ${subToneClasses[subTone]}`}>{sub}</p>}
//       </div>
//     </div>
//   );
// }

// function StatsRow({ stats }) {
//   return (
//     <ClayCard className="p-5">
//       <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-6">
//         <StatItem icon={<Flame size={19} />} iconBg="bg-violet-50" iconText="text-violet-500" value={stats.dayStreak} label="Day Streak" sub="Keep it up! 🔥" />
//         <StatItem icon={<TrendingUp size={19} />} iconBg="bg-emerald-50" iconText="text-emerald-500" value={`${stats.activeThisMonth}%`} label="Active This Month" sub={`↑ ${stats.activeChange}% from last month`} subTone="emerald" />
//         <StatItem icon={<Trophy size={19} />} iconBg="bg-amber-50" iconText="text-amber-500" value={stats.achievements} label="Achievements" sub="Across all platforms" />
//         <StatItem icon={<Clock size={19} />} iconBg="bg-sky-50" iconText="text-sky-500" value={`${stats.totalCodingHours} hrs`} label="Total Coding Time" sub="This month" />
//         <StatItem icon={<Code2 size={19} />} iconBg="bg-indigo-50" iconText="text-indigo-500" value={stats.totalContributions.toLocaleString()} label="Total Contributions" sub="This month" />
//       </div>
//     </ClayCard>
//   );
// }

// /* ---------------------------------------------
//    Connected / available platform cards
// --------------------------------------------- */

// function ConnectedPlatformCard({ platform }) {
//   const { Icon, bg, text } = platformIcons[platform.id] || {};
//   return (
//     <ClayCard className="p-5">
//       <div className="flex items-start justify-between">
//         <div className="flex items-center gap-3">
//           <div className={`w-10 h-10 rounded-xl ${bg} ${text} flex items-center justify-center shrink-0`}>
//             {Icon && <Icon size={18} />}
//           </div>
//           <div>
//             <p className="font-semibold text-slate-800 text-[14px]">{platform.name}</p>
//           </div>
//         </div>
//         <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
//           {platform.status}
//         </span>
//       </div>
//       <p className="text-[12px] text-slate-400 mt-2">{platform.tagline}</p>

//       {platform.stats.length > 0 ? (
//         <div className="grid grid-cols-3 gap-2 mt-4">
//           {platform.stats.map((s) => (
//             <div key={s.label}>
//               <p className="text-[15px] font-bold text-slate-800 leading-tight">{s.value}</p>
//               <p className="text-[10.5px] text-slate-400 leading-snug">{s.label}</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-[11.5px] text-slate-400 mt-4">No stats synced yet.</p>
//       )}

//       <button className="mt-4 text-[12.5px] font-semibold text-indigo-500 flex items-center gap-1">
//         View Stats <ChevronRight size={13} />
//       </button>
//     </ClayCard>
//   );
// }

// function AvailablePlatformCard({ platform, onConnect }) {
//   const { Icon, bg, text } = platformIcons[platform.id] || {};
//   return (
//     <ClayCard className="p-5">
//       <div className="flex items-start justify-between">
//         <div className="flex items-center gap-3">
//           <div className={`w-10 h-10 rounded-xl ${bg} ${text} flex items-center justify-center shrink-0`}>
//             {Icon && <Icon size={18} />}
//           </div>
//           <p className="font-semibold text-slate-800 text-[14px]">{platform.name}</p>
//         </div>
//         <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 shrink-0">
//           Available
//         </span>
//       </div>
//       <p className="text-[12px] text-slate-400 mt-2 mb-4">{platform.tagline}</p>
//       <button
//         onClick={() => onConnect(platform.id)}
//         className="w-full py-2 rounded-xl border border-indigo-200 text-indigo-600 text-[12.5px] font-semibold"
//       >
//         Connect
//       </button>
//     </ClayCard>
//   );
// }

// function ConnectedPlatformsSection({ connected, available, onConnect }) {
//   return (
//     <ClayCard className="p-5">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="font-semibold text-slate-800 text-[15px]">Connected Platforms</h3>
//         <button className="text-[12.5px] font-semibold text-indigo-500 flex items-center gap-1.5">
//           Manage Connections <Settings2 size={13} />
//         </button>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//         {connected.map((p) => (
//           <ConnectedPlatformCard key={p.id} platform={p} />
//         ))}
//         {available.map((p) => (
//           <AvailablePlatformCard key={p.id} platform={p} onConnect={onConnect} />
//         ))}
//       </div>

//       <p className="text-[12px] text-slate-400 mt-4">
//         Don't see a platform you use?{" "}
//         <button className="font-semibold text-indigo-500">Request Integration</button>
//       </p>
//     </ClayCard>
//   );
// }

// /* ---------------------------------------------
//    Activity overview chart
// --------------------------------------------- */

// function ActivityOverviewCard({ activityOverview }) {
//   return (
//     <ClayCard className="p-5">
//       <div className="flex items-center justify-between mb-1">
//         <h3 className="font-semibold text-slate-800 text-[15px]">Activity Overview</h3>
//         <button className="flex items-center gap-1 text-[12px] font-medium text-slate-500 border border-slate-200 rounded-xl px-2.5 py-1.5">
//           {activityOverview.range} <ChevronDown size={13} />
//         </button>
//       </div>

//       {activityOverview.series.length > 0 ? (
//         <>
//           <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 mb-2">
//             {activityOverview.series.map((s) => (
//               <span key={s.id} className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
//                 <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
//                 {s.name}
//               </span>
//             ))}
//           </div>
//           <LineChart series={activityOverview.series} labels={activityOverview.labels} height={200} maxValue={100} />
//         </>
//       ) : (
//         <p className="text-[12.5px] text-slate-400 mt-4">
//           Connect a platform to start tracking activity here.
//         </p>
//       )}

//       <button className="mt-3 text-[12.5px] font-semibold text-indigo-500 flex items-center gap-1">
//         View Detailed Analytics <ChevronRight size={13} />
//       </button>
//     </ClayCard>
//   );
// }

// /* ---------------------------------------------
//    Recent activity
// --------------------------------------------- */

// function RecentActivityCard({ recentActivity }) {
//   return (
//     <ClayCard className="p-5">
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="font-semibold text-slate-800 text-[15px]">Recent Activity</h3>
//         <button className="text-[12.5px] font-semibold text-indigo-500">View All</button>
//       </div>
//       {recentActivity.length > 0 ? (
//         <div className="divide-y divide-slate-100">
//           {recentActivity.map((a, i) => {
//             const { Icon, bg, text } = platformIcons[a.platform] || {};
//             return (
//               <div key={i} className="flex items-center gap-3 py-2.5">
//                 <div className={`w-8 h-8 rounded-lg ${bg} ${text} flex items-center justify-center shrink-0`}>
//                   {Icon && <Icon size={14} />}
//                 </div>
//                 <p className="text-[12.5px] text-slate-600 flex-1 min-w-0">{a.title}</p>
//                 <div className="flex items-center gap-1.5 shrink-0">
//                   <span className="text-[11px] text-slate-400 whitespace-nowrap">{a.time}</span>
//                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <p className="text-[12.5px] text-slate-400">Nothing here yet.</p>
//       )}
//     </ClayCard>
//   );
// }

// /* ---------------------------------------------
//    Page
// --------------------------------------------- */

// export default function Connections() {
//   const [data, setData] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [presetPlatform, setPresetPlatform] = useState(null);

//   async function loadConnections() {
//     const result = await getConnectionsData();
//     setData(result);
//   }

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       const result = await getConnectionsData();
//       if (!cancelled) setData(result);
//     })();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   function openModal(platformId) {
//     setPresetPlatform(platformId || null);
//     setModalOpen(true);
//   }

//   if (!data) {
//     return <p className="text-[13px] text-slate-400">Loading your connections...</p>;
//   }

//   return (
//     <>
//       <ConnectionsHeader onAddClick={() => openModal(null)} />
//       <StatsRow stats={data.stats} />

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
//         <div className="xl:col-span-2">
//           <ConnectedPlatformsSection
//             connected={data.connectedPlatforms}
//             available={data.availablePlatforms}
//             onConnect={openModal}
//           />
//         </div>
//         <div className="space-y-5">
//           <ActivityOverviewCard activityOverview={data.activityOverview} />
//           <RecentActivityCard recentActivity={data.recentActivity} />
//         </div>
//       </div>

//       <p className="text-[11.5px] text-slate-400 flex items-center gap-1.5">
//         <ShieldCheck size={14} className="text-slate-400" />
//         We only read public data. Your credentials are encrypted and never stored.
//       </p>

//       <AddPlatformModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onConnected={loadConnections}
//         presetPlatform={presetPlatform}
//       />
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  Flame,
  TrendingUp,
  Trophy,
  Clock,
  Code2,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Settings2,
  X,
  ExternalLink,
  Pencil,
  BarChart3,
} from "lucide-react";
import {
  SiGithub,
  SiLeetcode,
  SiGeeksforgeeks,
  SiCodechef,
  SiHackerrank,
  SiCodeforces,
  SiKaggle,
  SiGitlab,
  SiHackerearth,
} from "react-icons/si";
import { ClayCard, LineChart } from "../components/ui";
import { getConnectionsData } from "../services/connectionsService";
import AddPlatformModal from "../components/AddPlatformModal";
import ManualStatsModal from "../components/ManualStatsModal";

const platformIcons = {
  github: { Icon: SiGithub, bg: "bg-slate-900", text: "text-white" },
  leetcode: { Icon: SiLeetcode, bg: "bg-orange-50", text: "text-orange-500" },
  gfg: {
    Icon: SiGeeksforgeeks,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  geeksforgeeks: {
    Icon: SiGeeksforgeeks,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  codechef: { Icon: SiCodechef, bg: "bg-amber-50", text: "text-amber-700" },
  hackerrank: {
    Icon: SiHackerrank,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  codeforces: {
    Icon: SiCodeforces,
    bg: "bg-indigo-50",
    text: "text-indigo-600",
  },
  kaggle: { Icon: SiKaggle, bg: "bg-sky-50", text: "text-sky-600" },
  gitlab: { Icon: SiGitlab, bg: "bg-orange-50", text: "text-orange-600" },
  hackerearth: {
    Icon: SiHackerearth,
    bg: "bg-indigo-50",
    text: "text-indigo-600",
  },
};

/* ---------------------------------------------
   Header
--------------------------------------------- */

function ConnectionsHeader({ onAddClick }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Developer Progress
        </h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Track your activity across all your developer platforms in one place.
        </p>
      </div>

      <button
        onClick={onAddClick}
        className="px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] shrink-0"
      >
        <Plus size={15} /> Add Platform
      </button>
    </header>
  );
}

/* ---------------------------------------------
   Stats row
--------------------------------------------- */

function StatItem({
  icon,
  iconBg,
  iconText,
  value,
  label,
  sub,
  subTone = "slate",
}) {
  const subToneClasses = {
    slate: "text-slate-400",
    emerald: "text-emerald-500",
  };

  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-11 h-11 rounded-2xl ${iconBg} ${iconText} flex items-center justify-center shrink-0`}
      >
        {icon}
      </div>

      <div>
        <p className="text-xl font-bold text-slate-800 leading-tight">
          {value}
        </p>
        <p className="text-[12px] text-slate-500">{label}</p>

        {sub && (
          <p className={`text-[11px] ${subToneClasses[subTone]}`}>{sub}</p>
        )}
      </div>
    </div>
  );
}

function StatsRow({ stats }) {
  return (
    <ClayCard className="p-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatItem
          icon={<Flame size={19} />}
          iconBg="bg-violet-50"
          iconText="text-violet-500"
          value={stats.dayStreak}
          label="Day Streak"
          sub={
            stats.dayStreak > 0
              ? "Keep it up! 🔥"
              : "Sync a platform today"
          }
        />

        <StatItem
          icon={<TrendingUp size={19} />}
          iconBg="bg-emerald-50"
          iconText="text-emerald-500"
          value={`${stats.activeThisMonth}%`}
          label="Active This Month"
          sub={`↑ ${stats.activeChange}% from last month`}
          subTone="emerald"
        />

        <StatItem
          icon={<Trophy size={19} />}
          iconBg="bg-amber-50"
          iconText="text-amber-500"
          value={stats.achievements}
          label="Achievements"
          sub="Across all platforms"
        />

        <StatItem
          icon={<Clock size={19} />}
          iconBg="bg-sky-50"
          iconText="text-sky-500"
          value={`${stats.totalCodingHours} hrs`}
          label="Total Coding Time"
          sub="This month"
        />

        <StatItem
          icon={<Code2 size={19} />}
          iconBg="bg-indigo-50"
          iconText="text-indigo-500"
          value={stats.totalContributions.toLocaleString()}
          label="Total Contributions"
          sub="This month"
        />
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Platform stats detail modal
--------------------------------------------- */

function PlatformStatsModal({ open, platform, onClose, onEdit, onUpdateStats }) {
  if (!open || !platform) return null;

  const { Icon, bg, text } = platformIcons[platform.id] || {};
  const isGithub = platform.id === "github";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${platform.name} stats`}
        className="relative w-full max-w-md bg-white rounded-[28px] shadow-2xl max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl ${bg} ${text} flex items-center justify-center shrink-0`}
            >
              {Icon && <Icon size={20} />}
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {platform.name}
              </h2>

              <p className="text-[12px] text-slate-400">
                {platform.tagline}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {platform.stats.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {platform.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-slate-50 p-3 text-center"
              >
                <p className="text-[18px] font-bold text-slate-800 leading-tight">
                  {s.value}
                </p>

                <p className="text-[10.5px] text-slate-400 mt-0.5 leading-snug">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 p-5 text-center mb-4">
            <p className="text-[13px] text-slate-500">
              No stats synced yet for this platform.
            </p>

            <p className="text-[11.5px] text-slate-400 mt-1">
              {isGithub
                ? "Stats sync automatically once your connected account has activity."
                : "We don't auto-fetch this platform - add your own stats below."}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2">
          {platform.tagline && (
            <a
              href={
                platform.tagline.startsWith("http")
                  ? platform.tagline
                  : `https://${platform.tagline}`
              }
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-slate-200 text-[12.5px] font-semibold text-slate-600"
            >
              View profile <ExternalLink size={13} />
            </a>
          )}

          <button
            onClick={() => onEdit(platform)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-slate-200 text-[12.5px] font-semibold text-indigo-600"
          >
            <Pencil size={13} /> Edit URL
          </button>
        </div>

        {!isGithub && (
          <button
            onClick={() => onUpdateStats(platform)}
            className="w-full mt-2 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-indigo-50 text-[12.5px] font-semibold text-indigo-600"
          >
            <BarChart3 size={13} />
            {platform.stats.length > 0 ? "Update Stats" : "Add Your Stats"}
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}

/* ---------------------------------------------
   Connected / available platform cards
--------------------------------------------- */

function ConnectedPlatformCard({ platform, onViewStats }) {
  const { Icon, bg, text } = platformIcons[platform.id] || {};

  return (
    <ClayCard className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${bg} ${text} flex items-center justify-center shrink-0`}
          >
            {Icon && <Icon size={18} />}
          </div>

          <div>
            <p className="font-semibold text-slate-800 text-[14px]">
              {platform.name}
            </p>
          </div>
        </div>

        <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
          {platform.status}
        </span>
      </div>

      <p className="text-[12px] text-slate-400 mt-2">
        {platform.tagline}
      </p>

      {platform.stats.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 mt-4">
          {platform.stats.map((s) => (
            <div key={s.label}>
              <p className="text-[15px] font-bold text-slate-800 leading-tight">
                {s.value}
              </p>

              <p className="text-[10.5px] text-slate-400 leading-snug">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[11.5px] text-slate-400 mt-4">
          No stats synced yet.
        </p>
      )}

      <button
        onClick={() => onViewStats(platform)}
        className="mt-4 text-[12.5px] font-semibold text-indigo-500 flex items-center gap-1"
      >
        View Stats <ChevronRight size={13} />
      </button>
    </ClayCard>
  );
}

function AvailablePlatformCard({ platform, onConnect }) {
  const { Icon, bg, text } = platformIcons[platform.id] || {};

  return (
    <ClayCard className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl ${bg} ${text} flex items-center justify-center shrink-0`}
          >
            {Icon && <Icon size={18} />}
          </div>

          <p className="font-semibold text-slate-800 text-[14px]">
            {platform.name}
          </p>
        </div>

        <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 shrink-0">
          Available
        </span>
      </div>

      <p className="text-[12px] text-slate-400 mt-2 mb-4">
        {platform.tagline}
      </p>

      <button
        onClick={() => onConnect(platform.id)}
        className="w-full py-2 rounded-xl border border-indigo-200 text-indigo-600 text-[12.5px] font-semibold"
      >
        Connect
      </button>
    </ClayCard>
  );
}

function ConnectedPlatformsSection({
  connected,
  available,
  onConnect,
  onViewStats,
}) {
  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 text-[15px]">
          Connected Platforms
        </h3>

        <button className="text-[12.5px] font-semibold text-indigo-500 flex items-center gap-1.5">
          Manage Connections <Settings2 size={13} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {connected.map((p) => (
          <ConnectedPlatformCard
            key={p.id}
            platform={p}
            onViewStats={onViewStats}
          />
        ))}

        {available.map((p) => (
          <AvailablePlatformCard
            key={p.id}
            platform={p}
            onConnect={onConnect}
          />
        ))}
      </div>

      <p className="text-[12px] text-slate-400 mt-4">
        Don't see a platform you use?{" "}
        <button className="font-semibold text-indigo-500">
          Request Integration
        </button>
      </p>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Activity overview chart
--------------------------------------------- */

function ActivityOverviewCard({ activityOverview }) {
  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-slate-800 text-[15px]">
          Activity Overview
        </h3>

        <button className="flex items-center gap-1 text-[12px] font-medium text-slate-500 border border-slate-200 rounded-xl px-2.5 py-1.5">
          {activityOverview.range} <ChevronDown size={13} />
        </button>
      </div>

      {activityOverview.series.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 mb-2">
            {activityOverview.series.map((s) => (
              <span
                key={s.id}
                className="flex items-center gap-1.5 text-[11.5px] text-slate-500"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                {s.name}
              </span>
            ))}
          </div>

          <LineChart
            series={activityOverview.series}
            labels={activityOverview.labels}
            height={200}
            maxValue={100}
          />
        </>
      ) : (
        <p className="text-[12.5px] text-slate-400 mt-4">
          Connect a platform to start tracking activity here.
        </p>
      )}

      <button className="mt-3 text-[12.5px] font-semibold text-indigo-500 flex items-center gap-1">
        View Detailed Analytics <ChevronRight size={13} />
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Recent activity
--------------------------------------------- */

function RecentActivityCard({ recentActivity }) {
  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800 text-[15px]">
          Recent Activity
        </h3>

        <button className="text-[12.5px] font-semibold text-indigo-500">
          View All
        </button>
      </div>

      {recentActivity.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {recentActivity.map((a, i) => {
            const { Icon, bg, text } = platformIcons[a.platform] || {};

            return (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5"
              >
                <div
                  className={`w-8 h-8 rounded-lg ${bg} ${text} flex items-center justify-center shrink-0`}
                >
                  {Icon && <Icon size={14} />}
                </div>

                <p className="text-[12.5px] text-slate-600 flex-1 min-w-0">
                  {a.title}
                </p>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">
                    {a.time}
                  </span>

                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[12.5px] text-slate-400">
          Nothing here yet.
        </p>
      )}
    </ClayCard>
  );
}

/* ---------------------------------------------
   Page
--------------------------------------------- */

export default function Connections() {
  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [presetPlatform, setPresetPlatform] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const [statsModalPlatform, setStatsModalPlatform] = useState(null);
  const [manualStatsPlatform, setManualStatsPlatform] = useState(null);

  async function loadConnections() {
    const result = await getConnectionsData();
    setData(result);
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const result = await getConnectionsData();

      if (!cancelled) {
        setData(result);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function openModal(platformId) {
    setPresetPlatform(platformId || null);
    setEditingValue(null);
    setModalOpen(true);
  }

  function openEditModal(platform) {
    setPresetPlatform(platform.id);
    setEditingValue(platform.tagline || "");
    setStatsModalPlatform(null);
    setModalOpen(true);
  }

  function openStatsModal(platform) {
    setStatsModalPlatform(platform);
  }

  function closeStatsModal() {
    setStatsModalPlatform(null);
  }

  function openManualStats(platform) {
    setManualStatsPlatform(platform);
    setStatsModalPlatform(null);
  }

  if (!data) {
    return (
      <p className="text-[13px] text-slate-400">
        Loading your connections...
      </p>
    );
  }

  return (
    <>
      <ConnectionsHeader onAddClick={() => openModal(null)} />

      <StatsRow stats={data.stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        <div className="xl:col-span-2">
          <ConnectedPlatformsSection
            connected={data.connectedPlatforms}
            available={data.availablePlatforms}
            onConnect={openModal}
            onViewStats={openStatsModal}
          />
        </div>

        <div className="space-y-5">
          <ActivityOverviewCard
            activityOverview={data.activityOverview}
          />

          <RecentActivityCard
            recentActivity={data.recentActivity}
          />
        </div>
      </div>

      <p className="text-[11.5px] text-slate-400 flex items-center gap-1.5">
        <ShieldCheck size={14} className="text-slate-400" />
        We only read public data. Your credentials are encrypted and never
        stored.
      </p>

      <AddPlatformModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConnected={loadConnections}
        presetPlatform={presetPlatform}
        initialValue={editingValue}
      />

      <PlatformStatsModal
        open={!!statsModalPlatform}
        platform={statsModalPlatform}
        onClose={closeStatsModal}
        onEdit={openEditModal}
        onUpdateStats={openManualStats}
      />

      <ManualStatsModal
        open={!!manualStatsPlatform}
        platform={manualStatsPlatform}
        onClose={() => setManualStatsPlatform(null)}
        onSaved={loadConnections}
      />
    </>
  );
}