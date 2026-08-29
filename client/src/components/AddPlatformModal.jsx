import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { PLATFORM_CATALOG, addConnection } from "../services/connectionsService";

export default function AddPlatformModal({ open, onClose, onConnected, presetPlatform, initialValue }) {
  const [platform, setPlatform] = useState(presetPlatform || "");
  const [usernameOrUrl, setUsernameOrUrl] = useState(initialValue || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!initialValue;

  useEffect(() => {
    if (open) {
      setPlatform(presetPlatform || "");
      setUsernameOrUrl(initialValue || "");
      setError("");
    }
  }, [open, presetPlatform, initialValue]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await addConnection({ platform, usernameOrUrl });
      onConnected();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't connect that platform. Check the username and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-slate-800 outline-none focus:border-indigo-400";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Connect a platform"
        className="relative w-full max-w-sm bg-white rounded-[28px] shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-800">
            {isEditing ? "Update Username or URL" : "Connect a Platform"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-[12.5px] text-slate-400 mb-4">
          {isEditing
            ? "Made a typo the first time? Fix it here - this replaces the saved value."
            : "GitHub stats are fetched automatically. Other platforms are saved as-is for now."}
        </p>

        {error && (
          <div className="mb-3 text-[13px] text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[10.5px] font-semibold text-slate-400 tracking-wide">PLATFORM</label>
            <select
              required
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              disabled={!!presetPlatform}
              className={`mt-1.5 ${inputClass} disabled:bg-slate-50 disabled:text-slate-400`}
            >
              <option value="" disabled>
                Select a platform
              </option>
              {PLATFORM_CATALOG.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10.5px] font-semibold text-slate-400 tracking-wide">
              USERNAME OR PROFILE URL
            </label>
            <input
              required
              value={usernameOrUrl}
              onChange={(e) => setUsernameOrUrl(e.target.value)}
              placeholder={platform === "github" ? "e.g. torvalds or github.com/torvalds" : "your username or profile link"}
              className={`mt-1.5 ${inputClass}`}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !platform}
            className="w-full py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] disabled:opacity-60"
          >
            {submitting ? "Saving..." : isEditing ? "Save Changes" : "Connect"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
