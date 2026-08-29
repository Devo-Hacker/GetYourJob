import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { setTargetRole } from "../services/profileService";

const SUGGESTED_ROLES = [
  "Full-Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Mobile Developer",
  "Data Scientist",
  "DevOps Engineer",
  "UI/UX Designer",
  "Machine Learning Engineer",
];

export default function TargetRoleModal({ open, currentRole, onClose, onSaved }) {
  const [role, setRole] = useState(currentRole || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setRole(currentRole || "");
      setError("");
    }
  }, [open, currentRole]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!role.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      const profile = await setTargetRole(role.trim());
      onSaved(profile.targetRole);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save that role. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Set target role"
        className="relative w-full max-w-sm bg-white rounded-[28px] shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-800">Target Role</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-[12.5px] text-slate-400 mb-4">
          Which role are you aiming for? This drives your skill match and gap analysis.
        </p>

        {error && (
          <div className="mb-3 text-[13px] text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <input
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Backend Developer"
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-slate-800 outline-none focus:border-indigo-400"
          />

          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`px-2.5 py-1 rounded-full text-[11.5px] font-medium border ${
                  role === r
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting || !role.trim()}
            className="w-full py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Target Role"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
