import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, Folder as FolderIcon, ChevronRight, ChevronDown, Home } from "lucide-react";
import { getFolderTree } from "../services/storageService";

function buildTree(folders) {
  const map = {};
  const roots = [];
  folders.forEach((f) => (map[f.id] = { ...f, children: [] }));
  folders.forEach((f) => {
    if (f.parent && map[f.parent]) map[f.parent].children.push(map[f.id]);
    else roots.push(map[f.id]);
  });
  return roots;
}

function findNode(nodes, id) {
  for (const n of nodes) {
    if (n.id === id) return n;
    const found = findNode(n.children, id);
    if (found) return found;
  }
  return null;
}

function collectDescendantIds(node) {
  let ids = [node.id];
  node.children.forEach((c) => {
    ids = ids.concat(collectDescendantIds(c));
  });
  return ids;
}

function TreeItem({ node, depth, disabledIds, selectedId, onSelect, openIds, toggleOpen }) {
  const isDisabled = disabledIds.has(node.id);
  const isOpen = openIds.has(node.id);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div
        style={{ paddingLeft: `${depth * 18 + 8}px` }}
        className={`flex items-center gap-1.5 py-1.5 pr-2 rounded-lg text-[13px] ${
          isDisabled
            ? "text-slate-300 cursor-not-allowed"
            : selectedId === node.id
            ? "bg-indigo-50 text-indigo-600 cursor-pointer"
            : "text-slate-600 hover:bg-slate-50 cursor-pointer"
        }`}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleOpen(node.id);
            }}
            className="p-0.5 text-slate-400 shrink-0"
          >
            {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        ) : (
          <span className="w-[18px] shrink-0" />
        )}
        <FolderIcon size={14} className="text-amber-500 shrink-0" />
        <span className="truncate flex-1" onClick={() => !isDisabled && onSelect(node.id)}>
          {node.name}
        </span>
      </div>

      {hasChildren && isOpen && (
        <div>
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              disabledIds={disabledIds}
              selectedId={selectedId}
              onSelect={onSelect}
              openIds={openIds}
              toggleOpen={toggleOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MoveItemModal({ open, itemName, excludeFolderId, onClose, onMove }) {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null); // null = root ("My Storage")
  const [openIds, setOpenIds] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setSelectedId(null);
    setError("");
    getFolderTree().then((result) => {
      if (!cancelled) {
        setFolders(result);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const tree = useMemo(() => buildTree(folders), [folders]);

  const disabledIds = useMemo(() => {
    if (!excludeFolderId) return new Set();
    const node = findNode(tree, excludeFolderId);
    return node ? new Set(collectDescendantIds(node)) : new Set([excludeFolderId]);
  }, [tree, excludeFolderId]);

  function toggleOpen(id) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (!open) return null;

  async function handleConfirm() {
    setSubmitting(true);
    setError("");
    try {
      await onMove(selectedId);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't move that item. Try again.");
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
        aria-label="Move item"
        className="relative w-full max-w-sm bg-white rounded-[28px] shadow-2xl max-h-[80vh] overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-800">Move "{itemName}"</h2>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <p className="text-[12.5px] text-slate-400 mb-4">Choose a destination folder.</p>

        {error && (
          <div className="mb-3 text-[13px] text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3.5 py-2.5">
            {error}
          </div>
        )}

        <div className="border border-slate-200 rounded-xl p-2 max-h-64 overflow-y-auto">
          <div
            onClick={() => setSelectedId(null)}
            className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg text-[13px] cursor-pointer ${
              selectedId === null ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Home size={14} className="shrink-0" />
            My Storage (root)
          </div>

          {loading ? (
            <p className="text-[12px] text-slate-400 px-2 py-3">Loading folders...</p>
          ) : tree.length === 0 ? (
            <p className="text-[12px] text-slate-400 px-2 py-3">No folders yet.</p>
          ) : (
            tree.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                depth={0}
                disabledIds={disabledIds}
                selectedId={selectedId}
                onSelect={setSelectedId}
                openIds={openIds}
                toggleOpen={toggleOpen}
              />
            ))
          )}
        </div>

        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="w-full mt-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] disabled:opacity-60"
        >
          {submitting ? "Moving..." : "Move Here"}
        </button>
      </div>
    </div>,
    document.body
  );
}