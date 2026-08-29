import React, { useEffect, useState } from "react";
import { Plus, Flame, TrendingUp, Trophy, Clock, Code2, ChevronRight, ChevronDown, ShieldCheck, Settings2, CheckCircle2, ArrowUpRight } from "lucide-react";
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

const platformIcons = {
  github: { Icon: SiGithub, bg: "bg-slate-900", text: "text-white" },
  leetcode: { Icon: SiLeetcode, bg: "bg-orange-50", text: "text-orange-500" },
  gfg: { Icon: SiGeeksforgeeks, bg: "bg-emerald-50", text: "text-emerald-600" },
  codechef: { Icon: SiCodechef, bg: "bg-amber-50", text: "text-amber-700" },
  hackerrank: { Icon: SiHackerrank, bg: "bg-emerald-50", text: "text-emerald-600" },
  codeforces: { Icon: SiCodeforces, bg: "bg-indigo-50", text: "text-indigo-600" },
  kaggle: { Icon: SiKaggle, bg: "bg-sky-50", text: "text-sky-600" },
  gitlab: { Icon: SiGitlab, bg: "bg-orange-50", text: "text-orange-600" },
  hackerearth: { Icon: SiHackerearth, bg: "bg-indigo-50", text: "text-indigo-600" },
};

/* ---------------------------------------------
   Header
--------------------------------------------- */

function ConnectionsHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Developer Progress</h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Track your activity across all your developer platforms in one place.
        </p>
      </div>
      <button className="px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] shrink-0">
        <Plus size={15} /> Add Platform
      </button>
    </header>
  );
}

/* ---------------------------------------------
   Stats row
--------------------------------------------- */

function StatItem({ icon, iconBg, iconText, value, label, sub, subTone = "slate" }) {
  const subToneClasses = {
    slate: "text-slate-400",
    emerald: "text-emerald-500",
  };
  return (
    <div className="flex items-center gap-3">
      <div className={`w-11 h-11 rounded-2xl ${iconBg} ${iconText} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-slate-800 leading-tight">{value}</p>
        <p className="text-[12px] text-slate-500">{label}</p>
        {sub && <p className={`text-[11px] ${subToneClasses[subTone]}`}>{sub}</p>}
      </div>
    </div>
  );
}

function StatsRow({ stats }) {
  return (
    <ClayCard className="p-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatItem icon={<Flame size={19} />} iconBg="bg-violet-50" iconText="text-violet-500" value={stats.dayStreak} label="Day Streak" sub="Keep it up! 🔥" />
        <StatItem icon={<TrendingUp size={19} />} iconBg="bg-emerald-50" iconText="text-emerald-500" value={`${stats.activeThisMonth}%`} label="Active This Month" sub={`↑ ${stats.activeChange}% from last month`} subTone="emerald" />
        <StatItem icon={<Trophy size={19} />} iconBg="bg-amber-50" iconText="text-amber-500" value={stats.achievements} label="Achievements" sub="Across all platforms" />
        <StatItem icon={<Clock size={19} />} iconBg="bg-sky-50" iconText="text-sky-500" value={`${stats.totalCodingHours} hrs`} label="Total Coding Time" sub="This month" />
        <StatItem icon={<Code2 size={19} />} iconBg="bg-indigo-50" iconText="text-indigo-500" value={stats.totalContributions.toLocaleString()} label="Total Contributions" sub="This month" />
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Connected / available platform cards
--------------------------------------------- */

function ConnectedPlatformCard({ platform }) {
  const { Icon, bg, text } = platformIcons[platform.id] || {};
  return (
    <ClayCard className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${bg} ${text} flex items-center justify-center shrink-0`}>
            {Icon && <Icon size={18} />}
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-[14px]">{platform.name}</p>
          </div>
        </div>
        <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
          {platform.status}
        </span>
      </div>
      <p className="text-[12px] text-slate-400 mt-2">{platform.tagline}</p>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {platform.stats.map((s) => (
          <div key={s.label}>
            <p className="text-[15px] font-bold text-slate-800 leading-tight">{s.value}</p>
            <p className="text-[10.5px] text-slate-400 leading-snug">{s.label}</p>
          </div>
        ))}
      </div>

      <button className="mt-4 text-[12.5px] font-semibold text-indigo-500 flex items-center gap-1">
        View Stats <ChevronRight size={13} />
      </button>
    </ClayCard>
  );
}

function AvailablePlatformCard({ platform }) {
  const { Icon, bg, text } = platformIcons[platform.id] || {};
  return (
    <ClayCard className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${bg} ${text} flex items-center justify-center shrink-0`}>
            {Icon && <Icon size={18} />}
          </div>
          <p className="font-semibold text-slate-800 text-[14px]">{platform.name}</p>
        </div>
        <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 shrink-0">
          Available
        </span>
      </div>
      <p className="text-[12px] text-slate-400 mt-2 mb-4">{platform.tagline}</p>
      <button className="w-full py-2 rounded-xl border border-indigo-200 text-indigo-600 text-[12.5px] font-semibold">
        Connect
      </button>
    </ClayCard>
  );
}

function ConnectedPlatformsSection({ connected, available }) {
  return (
    <ClayCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 text-[15px]">Connected Platforms</h3>
        <button className="text-[12.5px] font-semibold text-indigo-500 flex items-center gap-1.5">
          Manage Connections <Settings2 size={13} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {connected.map((p) => (
          <ConnectedPlatformCard key={p.id} platform={p} />
        ))}
        {available.map((p) => (
          <AvailablePlatformCard key={p.id} platform={p} />
        ))}
      </div>

      <p className="text-[12px] text-slate-400 mt-4">
        Don't see a platform you use?{" "}
        <button className="font-semibold text-indigo-500">Request Integration</button>
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
        <h3 className="font-semibold text-slate-800 text-[15px]">Activity Overview</h3>
        <button className="flex items-center gap-1 text-[12px] font-medium text-slate-500 border border-slate-200 rounded-xl px-2.5 py-1.5">
          {activityOverview.range} <ChevronDown size={13} />
        </button>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 mb-2">
        {activityOverview.series.map((s) => (
          <span key={s.id} className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
            {s.name}
          </span>
        ))}
      </div>

      <LineChart series={activityOverview.series} labels={activityOverview.labels} height={200} maxValue={100} />

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
        <h3 className="font-semibold text-slate-800 text-[15px]">Recent Activity</h3>
        <button className="text-[12.5px] font-semibold text-indigo-500">View All</button>
      </div>
      <div className="divide-y divide-slate-100">
        {recentActivity.map((a, i) => {
          const { Icon, bg, text } = platformIcons[a.platform] || {};
          return (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <div className={`w-8 h-8 rounded-lg ${bg} ${text} flex items-center justify-center shrink-0`}>
                {Icon && <Icon size={14} />}
              </div>
              <p className="text-[12.5px] text-slate-600 flex-1 min-w-0">{a.title}</p>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] text-slate-400 whitespace-nowrap">{a.time}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          );
        })}
      </div>
      <button className="mt-3 text-[12.5px] font-semibold text-indigo-500 flex items-center gap-1">
        View All Activity <ChevronRight size={13} />
      </button>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Profile impact strip
--------------------------------------------- */

const impactToneClasses = {
  emerald: "bg-emerald-50 text-emerald-600",
  sky: "bg-sky-50 text-sky-600",
  indigo: "bg-indigo-50 text-indigo-600",
};

function ProfileImpactCard({ profileImpact }) {
  return (
    <ClayCard className="p-5">
      <h3 className="font-semibold text-slate-800 text-[15px] mb-4">How your activity improves your DevSphere profile</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {profileImpact.map((item, i) => (
          <div key={i} className="rounded-2xl bg-slate-50/70 p-4">
            <div className={`w-8 h-8 rounded-lg ${impactToneClasses[item.tone]} flex items-center justify-center mb-3`}>
              <CheckCircle2 size={15} />
            </div>
            <p className="text-[12.5px] text-slate-700 leading-snug">{item.title}</p>
            {item.delta && (
              <p className="text-[12px] font-semibold text-emerald-500 mt-1.5 flex items-center gap-1">
                <ArrowUpRight size={12} /> {item.delta}
              </p>
            )}
            <p className="text-[11px] text-slate-400 mt-1">{item.note}</p>
          </div>
        ))}
      </div>
    </ClayCard>
  );
}

function TrustNote() {
  return (
    <p className="text-[11.5px] text-slate-400 flex items-center gap-1.5">
      <ShieldCheck size={14} className="text-slate-400" />
      We only read public data. Your credentials are encrypted and never stored.{" "}
      <button className="font-semibold text-indigo-500">Learn more</button>
    </p>
  );
}

/* ---------------------------------------------
   Page
--------------------------------------------- */

export default function Connections() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadConnections() {
      const result = await getConnectionsData();
      if (!cancelled) setData(result);
    }

    loadConnections();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return <p className="text-[13px] text-slate-400">Loading your connections...</p>;
  }

  return (
    <>
      <ConnectionsHeader />
      <StatsRow stats={data.stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        <div className="xl:col-span-2">
          <ConnectedPlatformsSection connected={data.connectedPlatforms} available={data.availablePlatforms} />
        </div>
        <div className="space-y-5">
          <ActivityOverviewCard activityOverview={data.activityOverview} />
          <RecentActivityCard recentActivity={data.recentActivity} />
        </div>
      </div>

      <ProfileImpactCard profileImpact={data.profileImpact} />
      <TrustNote />
    </>
  );
}
