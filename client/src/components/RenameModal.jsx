import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function RenameModal({ open, kind, currentName, onClose, onSave }) {
  const [name, setName] = useState(currentName || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(currentName || "");
      setError("");
    }
  }, [open, currentName]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await onSave(name.trim());
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || `Couldn't rename that ${kind}. Try again.`);
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
        aria-label={`Rename ${kind}`}
        className="relative w-full max-w-sm bg-white rounded-[28px] shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-800">
            Rename {kind === "folder" ? "Folder" : "File"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-[12.5px] text-slate-400 mb-4">Give this {kind} a new name.</p>

        {error && (
          <div className="mb-3 text-[13px] text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <input
            autoFocus
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-[13.5px] text-slate-800 outline-none focus:border-indigo-400"
          />

          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="w-full py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}