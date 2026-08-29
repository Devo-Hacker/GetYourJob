import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  X,
  Camera,
  Pencil,
  CheckCircle2,
  Plus,
  LogOut,
} from "lucide-react";
import { getAccountData, updateProfile } from "../services/accountService";
import { useAuth } from "../context/AuthContext";

function Avatar({ initial, size = "w-24 h-24 text-3xl" }) {
  return (
    <div
      className={`${size} rounded-2xl bg-indigo-500 text-white flex items-center justify-center font-bold shrink-0`}
    >
      {initial}
    </div>
  );
}

function ProfileInformationCard({ profile, onSaved }) {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateProfile({ displayName });
      onSaved(updated);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-slate-100 rounded-2xl p-5">
      <p className="text-[14px] font-semibold text-slate-800">Profile Information</p>
      <p className="text-[12px] text-slate-400 mt-0.5 mb-5">Update your public profile details</p>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="relative">
            <Avatar initial={profile.displayName?.[0]?.toUpperCase() || "?"} />
            <button
              aria-label="Change avatar photo"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm"
            >
              <Camera size={13} />
            </button>
          </div>
          <button className="text-[12px] font-semibold text-indigo-600 border border-indigo-200 rounded-xl px-3 py-1.5">
            Change avatar
          </button>
        </div>

        <div className="flex-1 space-y-4 min-w-0">
          <div>
            <label className="text-[10.5px] font-semibold text-slate-400 tracking-wide">
              DISPLAY NAME
            </label>
            <div className="mt-1.5 flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5">
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 min-w-0 text-[13.5px] text-slate-800 outline-none bg-transparent"
              />
              <Pencil size={13} className="text-slate-400 shrink-0" />
            </div>
          </div>

          <div>
            <label className="text-[10.5px] font-semibold text-slate-400 tracking-wide">
              EMAIL
            </label>
            <div className="mt-1.5 flex items-center justify-between gap-2">
              <span className="text-[13.5px] text-slate-800">{profile.email}</span>
              {profile.emailVerified && (
                <span className="flex items-center gap-1 text-[12px] font-medium text-emerald-600 shrink-0">
                  <CheckCircle2 size={13} /> Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}

function AccountRow({ account }) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-2xl ${
        account.active ? "bg-indigo-50" : "border border-slate-100"
      }`}
    >
      <Avatar initial={account.name?.[0]?.toUpperCase() || "?"} size="w-10 h-10 text-[14px]" />
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold text-slate-800 truncate">{account.name}</p>
        <p className="text-[12px] text-slate-400 truncate">{account.email}</p>
      </div>
      {account.active && (
        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-100 px-2.5 py-1 rounded-full shrink-0">
          Active
        </span>
      )}
    </div>
  );
}

function AccountsCard({ accounts, onLogout, loggingOut }) {
  return (
    <div className="border border-slate-100 rounded-2xl p-5">
      <p className="text-[14px] font-semibold text-slate-800">Accounts</p>
      <p className="text-[12px] text-slate-400 mt-0.5 mb-4">
        Switch between accounts you've logged into on this device
      </p>

      <div className="space-y-2.5">
        {accounts.map((acc) => (
          <AccountRow key={acc.id} account={acc} />
        ))}

        <button className="w-full py-2.5 rounded-2xl border border-slate-200 text-[13px] font-semibold text-indigo-600 flex items-center justify-center gap-1.5">
          <Plus size={15} /> Add another account
        </button>

        <button
          onClick={onLogout}
          disabled={loggingOut}
          className="w-full py-2.5 rounded-2xl border border-rose-100 bg-rose-50 text-[13px] font-semibold text-rose-500 flex items-center justify-center gap-1.5 disabled:opacity-60"
        >
          <LogOut size={15} /> {loggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}

export default function ProfileSettingsModal({ open, onClose }) {
  const [data, setData] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const result = await getAccountData();
      if (!cancelled) setData(result);
    })();
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleProfileSaved(updatedProfile) {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, ...updatedProfile } }));
  }

  function handleLogout() {
    setLoggingOut(true);
    logout();
    onClose();
    navigate("/login");
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile Settings"
        className="relative w-full max-w-xl bg-white rounded-[28px] shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Profile Settings</h2>
            <p className="text-[13px] text-slate-400 mt-1">
              Manage your public identity and account settings.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {!data ? (
          <p className="px-6 pb-6 text-[13px] text-slate-400">Loading...</p>
        ) : (
          <div className="px-6 pb-6 space-y-5">
            <ProfileInformationCard profile={data.profile} onSaved={handleProfileSaved} />
            <AccountsCard
              accounts={data.accounts}
              onLogout={handleLogout}
              loggingOut={loggingOut}
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}