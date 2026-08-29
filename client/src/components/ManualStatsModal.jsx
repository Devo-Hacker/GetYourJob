import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Trash2 } from "lucide-react";
import { updateManualStats } from "../services/connectionsService";

function rowsFromStats(rawStats) {
  const entries = Object.entries(rawStats || {}).filter(
    ([, v]) => typeof v === "number" || typeof v === "string"
  );
  if (entries.length === 0) return [{ label: "", value: "" }];
  return entries.map(([label, value]) => ({ label, value: String(value) }));
}

export default function ManualStatsModal({ open, platform, onClose, onSaved }) {
  const [rows, setRows] = useState([{ label: "", value: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && platform) {
      setRows(rowsFromStats(platform.rawStats));
      setError("");
    }
  }, [open, platform]);

  if (!open || !platform) return null;

  function updateRow(index, field, value) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { label: "", value: "" }]);
  }

  function removeRow(index) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const stats = {};
    rows.forEach(({ label, value }) => {
      const trimmedLabel = label.trim();
      if (!trimmedLabel || value === "") return;
      const numeric = Number(value);
      stats[trimmedLabel] = value.trim() !== "" && !isNaN(numeric) ? numeric : value;
    });

    if (Object.keys(stats).length === 0) {
      setError("Add at least one stat with a label and a value.");
      return;
    }

    setSubmitting(true);
    try {
      await updateManualStats(platform.id, stats);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save those stats. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "border border-slate-200 rounded-xl px-3 py-2 text-[13px] text-slate-800 outline-none focus:border-indigo-400";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Update ${platform.name} stats`}
        className="relative w-full max-w-md bg-white rounded-[28px] shadow-2xl max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-800">Update {platform.name} Stats</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-[12.5px] text-slate-400 mb-4">
          We don't scrape this platform automatically - paste in your own numbers
          (e.g. "Problems Solved" / "230", "Contest Rating" / "1850").
        </p>

        {error && (
          <div className="mb-3 text-[13px] text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            {rows.map((row, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={row.label}
                  onChange={(e) => updateRow(i, "label", e.target.value)}
                  placeholder="Label (e.g. Problems Solved)"
                  className={`${inputClass} flex-[1.4]`}
                />
                <input
                  value={row.value}
                  onChange={(e) => updateRow(i, "value", e.target.value)}
                  placeholder="Value (e.g. 230)"
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  aria-label="Remove stat"
                  className="text-slate-400 hover:text-red-500 shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1.5 text-[12.5px] font-semibold text-indigo-600"
          >
            <Plus size={14} /> Add another stat
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Stats"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
