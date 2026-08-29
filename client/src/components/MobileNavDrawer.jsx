import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { navItems } from "../config/navItems";

export default function MobileNavDrawer({ open, onClose }) {
  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [open]);

  return (
    <div className={`lg:hidden fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sliding panel */}
      <div
        className={`absolute left-0 top-0 h-full w-72 max-w-[80%] bg-white shadow-2xl flex flex-col px-4 py-6 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
              DS
            </div>
            <span className="font-semibold text-slate-800 tracking-tight">DevSphere</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <X size={17} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, path, badge }, i) => (
            <NavLink
              key={label}
              to={path}
              end={path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`
              }
              style={{
                transitionProperty: "opacity, transform",
                transitionDelay: open ? `${i * 35}ms` : "0ms",
                opacity: open ? 1 : 0,
                transform: open ? "translateX(0)" : "translateX(-12px)",
              }}
            >
              <Icon size={17} strokeWidth={2.1} className="shrink-0" />
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
    </div>
  );
}
