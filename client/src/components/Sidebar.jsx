import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  BarChart2,
  Map,
  FolderKanban,
  Link2,
  Database,
  Settings,
} from "lucide-react";
import { ClayCard } from "./ui";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Briefcase, label: "Jobs", path: "/jobs" },
  { icon: BarChart2, label: "Skill Gap", path: "/skill-gap" },
  { icon: Map, label: "Roadmap", path: "/roadmap" },
  { icon: FolderKanban, label: "Projects", path: "/projects" },
  { icon: Link2, label: "Connections", path: "/connections" },
  { icon: Database, label: "Storage", path: "/storage", badge: "New" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-56 shrink-0 flex-col justify-between bg-white/70 px-4 py-6 min-h-screen">
      <div>
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
            DS
          </div>
          <span className="font-semibold text-slate-800 tracking-tight">
            DevSphere
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, path, badge }) => (
            <NavLink
              key={label}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`
              }
            >
              <Icon size={17} strokeWidth={2.1} />
              <span className="flex-1 text-left">{label}</span>
              {badge && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <ClayCard className="p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0" />
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-slate-800 truncate">
            Sanjay
          </p>
          <p className="text-[11px] text-slate-400 truncate">
            Aspiring Full-Stack Developer
          </p>
          <button className="text-[11px] font-semibold text-indigo-500 mt-0.5">
            View Profile →
          </button>
        </div>
      </ClayCard>
    </aside>
  );
}
