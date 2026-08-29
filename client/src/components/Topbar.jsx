import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, ChevronDown, LogOut } from "lucide-react";
import { ThemeToggle } from "./ui";
import ProfileSettingsModal from "./ProfileSettingsModal";
import { useAuth } from "../context/AuthContext";

function NotificationBell() {
  return (
    <button
      aria-label="Notifications"
      className="relative w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-indigo-500 shrink-0"
    >
      <Bell size={17} />
      <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] h-[18px] rounded-full bg-rose-500 text-white text-[10px] font-semibold flex items-center justify-center">
        3
      </span>
    </button>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.displayName || "Account";
  const role = user?.role || "";
  const initial = displayName[0]?.toUpperCase() || "?";

  function handleLogout() {
    setOpen(false);
    logout();
    navigate("/login");
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-2xl hover:bg-white/60"
      >
        <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[13px] font-bold shrink-0">
          {initial}
        </div>
        <span className="hidden sm:block text-[13.5px] font-semibold text-slate-700">{displayName}</span>
        <ChevronDown size={15} className="text-slate-400 shrink-0" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-[0_10px_30px_-10px_rgba(76,29,149,0.2)] p-2 z-20">
            <p className="px-2.5 py-1.5 text-[13px] font-semibold text-slate-800">{displayName}</p>
            {role && <p className="px-2.5 pb-2 text-[11.5px] text-slate-400">{role}</p>}
            <div className="border-t border-slate-100 my-1" />
            <button
              onClick={() => {
                setModalOpen(true);
                setOpen(false);
              }}
              className="w-full text-left px-2.5 py-2 rounded-xl text-[13px] text-slate-600 hover:bg-slate-50"
            >
              Profile Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-1.5 text-left px-2.5 py-2 rounded-xl text-[13px] text-rose-500 hover:bg-rose-50"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </>
      )}

      <ProfileSettingsModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default function Topbar({ onOpenMobileNav }) {
  return (
    <header className="flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-30 bg-[#F4F3FA]/90 dark:bg-[#0d0f1a]/90 backdrop-blur">
      <div className="flex items-center gap-2 lg:hidden">
        <button
          onClick={onOpenMobileNav}
          aria-label="Open menu"
          className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 shrink-0"
        >
          <Menu size={18} />
        </button>
        <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
          DS
        </div>
        <span className="font-semibold text-slate-800 tracking-tight text-[15px]">DevSphere</span>
      </div>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <NotificationBell />
        <ProfileMenu />
      </div>
    </header>
  );
}