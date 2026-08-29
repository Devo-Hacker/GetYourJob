import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { navItems } from "../config/navItems";

export default function Sidebar({ collapsed, onToggleCollapse }) {
  return (
    <aside
      className={`hidden lg:flex shrink-0 flex-col bg-white border-r border-slate-100 sticky top-0 h-screen overflow-y-auto transition-[width] duration-200 relative ${
        collapsed ? "w-[76px] px-2.5" : "w-60 px-4"
      } py-6`}
    >
      <div className={`flex items-center gap-2 mb-8 ${collapsed ? "justify-center px-0" : "px-2"}`}>
        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
          DS
        </div>
        {!collapsed && (
          <span className="font-semibold text-slate-800 tracking-tight whitespace-nowrap">
            DevSphere
          </span>
        )}
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ icon: Icon, label, path, badge }) => (
          <NavLink
            key={label}
            to={path}
            end={path === "/"}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `group flex items-center gap-3 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                collapsed ? "justify-center px-0" : "px-3"
              } ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`
            }
          >
            <Icon size={17} strokeWidth={2.1} className="shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left whitespace-nowrap">{label}</span>
                {badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600 whitespace-nowrap">
                    {badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="mt-auto self-end w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-200 flex items-center justify-center shadow-sm shrink-0"
      >
        {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
      </button>
    </aside>
  );
}
