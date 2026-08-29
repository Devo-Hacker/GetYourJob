import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { createFolder } from "../services/storageService";

export default function NewFolderModal({ open, onClose, onCreated, parentId }) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createFolder(name.trim(), parentId);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create that folder. Try again.");
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
        aria-label="New folder"
        className="relative w-full max-w-sm bg-white rounded-[28px] shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-800">New Folder</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-[12.5px] text-slate-400 mb-4">
          Create a folder here to keep your files organized.
        </p>

        {error && (
          <div className="mb-3 text-[13px] text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-[10.5px] font-semibold text-slate-400 tracking-wide">FOLDER NAME</label>
            <input
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Resumes"
              className={`mt-1.5 ${inputClass}`}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="w-full py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Folder"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
