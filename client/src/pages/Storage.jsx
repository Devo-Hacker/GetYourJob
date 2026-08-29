import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Upload,
  Plus,
  Monitor,
  RefreshCw,
  Info,
  FileText,
  Image as ImageIcon,
  PlayCircle,
  Code2,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  FolderPlus,
  Lock,
  FolderOpen,
  Folder as FolderIcon,
  File as FileIcon,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { ClayCard } from "../components/ui";
import NewFolderModal from "../components/NewFolderModal";
import {
  getStorageData,
  uploadFiles,
  deleteFile,
  deleteFolder,
  formatBytes,
} from "../services/storageService";

const MAX_FILE_SIZE_MB = 100;

const TYPE_ICON = {
  document: FileText,
  image: ImageIcon,
  video: PlayCircle,
  code: Code2,
  other: FileIcon,
};

/* ---------------------------------------------
   Header + toolbar
--------------------------------------------- */

function StorageHeader({ search, onSearchChange, onUploadClick, onNewFolder }) {
  return (
    <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Storage</h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Store, organize and access your files from anywhere.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <ClayCard className="flex items-center gap-2.5 px-4 py-2.5 w-full sm:w-64">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search in Storage"
            className="w-full text-[13.5px] text-slate-700 placeholder:text-slate-400 outline-none bg-transparent"
          />
        </ClayCard>

        <button
          onClick={onUploadClick}
          className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold flex items-center justify-center gap-1.5 shrink-0"
        >
          <Upload size={15} /> Upload
        </button>

        <button
          onClick={onNewFolder}
          className="flex items-stretch rounded-2xl bg-indigo-600 text-white shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)] shrink-0 overflow-hidden"
        >
          <span className="px-4 py-2.5 text-[13px] font-semibold flex items-center gap-1.5">
            <Plus size={15} /> New
          </span>
          <span className="px-2.5 flex items-center border-l border-white/25">
            <ChevronDown size={14} />
          </span>
        </button>
      </div>
    </header>
  );
}

/* ---------------------------------------------
   Breadcrumbs
--------------------------------------------- */

function Breadcrumbs({ crumbs, onNavigate }) {
  return (
    <div className="flex items-center gap-1.5 text-[13px] px-1 flex-wrap">
      <button
        onClick={() => onNavigate(null)}
        className={`font-medium ${
          crumbs.length === 0 ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        My Storage
      </button>
      {crumbs.map((c, i) => (
        <React.Fragment key={c.id}>
          <ChevronRight size={13} className="text-slate-300 shrink-0" />
          <button
            onClick={() => onNavigate(c.id)}
            className={`font-medium ${
              i === crumbs.length - 1 ? "text-slate-800" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {c.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ---------------------------------------------
   Empty state
--------------------------------------------- */

function EmptyStateArt() {
  return (
    <svg viewBox="0 0 400 300" className="w-72 sm:w-80 h-auto mx-auto mb-2">
      {/* soft background blob */}
      <ellipse cx="200" cy="155" rx="175" ry="128" fill="#EFEDFB" />

      {/* faint dots */}
      <circle cx="52" cy="95" r="4" fill="#D9D5F6" />
      <circle cx="352" cy="120" r="4" fill="#D9D5F6" />
      <circle cx="60" cy="235" r="4" fill="#D9D5F6" />
      <circle cx="342" cy="228" r="3" fill="#D9D5F6" />
      <circle cx="315" cy="165" r="9" fill="none" stroke="#D9D5F6" strokeWidth="2" />

      {/* expand / focus icon, left side */}
      <g stroke="#B9B4E3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M82 150 L70 138 M70 138 L70 146 M70 138 L78 138" />
        <path d="M82 170 L70 182 M70 182 L70 174 M70 182 L78 182" />
      </g>

      {/* sparkles */}
      <path
        d="M298 68 L302 78 L312 82 L302 86 L298 96 L294 86 L284 82 L294 78 Z"
        fill="#C3BCF2"
      />
      <path
        d="M320 208 L323 215 L330 218 L323 221 L320 228 L317 221 L310 218 L317 215 Z"
        fill="#C3BCF2"
      />

      {/* document card (behind, top-left) */}
      <g transform="rotate(-9 130 135)">
        <rect x="85" y="78" width="92" height="114" rx="14" fill="#FFFFFF" />
        <rect x="102" y="102" width="58" height="7" rx="3.5" fill="#E2E5F0" />
        <rect x="102" y="118" width="58" height="7" rx="3.5" fill="#E2E5F0" />
        <rect x="102" y="134" width="40" height="7" rx="3.5" fill="#E2E5F0" />
      </g>

      {/* image card (behind, top-center) */}
      <g transform="rotate(-2 213 118)">
        <rect x="165" y="63" width="96" height="88" rx="14" fill="#FFFFFF" />
        <rect x="181" y="79" width="64" height="56" rx="8" fill="#DCEAFE" />
        <circle cx="196" cy="94" r="6" fill="#93C5FD" />
        <path d="M181 128 L200 105 L215 120 L228 108 L245 128 Z" fill="#5B9CF6" />
      </g>

      {/* play / video card (behind, top-right) */}
      <g transform="rotate(9 305 122)">
        <rect x="268" y="88" width="74" height="74" rx="14" fill="#FFFFFF" />
        <circle cx="305" cy="125" r="21" fill="#7C6FF0" />
        <path d="M299 115 L316 125 L299 135 Z" fill="#FFFFFF" />
      </g>

      {/* open folder (front-most) */}
      <g>
        <rect x="148" y="150" width="66" height="24" rx="9" fill="#6C5BD1" />
        <rect x="140" y="163" width="180" height="98" rx="18" fill="#6C5BD1" />
        <path
          d="M148 196 L168 234 Q171 240 178 240 L282 240 Q289 240 292 234 L312 196 Q316 188 308 188 L152 188 Q144 188 148 196 Z"
          fill="#8B80F7"
        />
      </g>
    </svg>
  );
}

function EmptyState({ onUploadClick, onNewFolder, inFolder }) {
  return (
    <div className="py-12 flex flex-col items-center text-center">
      <EmptyStateArt />
      <h3 className="text-[17px] font-bold text-slate-800">
        {inFolder ? "This folder is empty" : "Your storage is empty"}
      </h3>
      <p className="text-[13px] text-slate-400 mt-1">
        Upload files or{" "}
        <button onClick={onNewFolder} className="text-indigo-600 font-medium">
          create folders
        </button>{" "}
        to get started.
      </p>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={onUploadClick}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_10px_20px_-8px_rgba(79,70,229,0.5)]"
        >
          <Upload size={15} /> Upload Files
        </button>
        <button
          onClick={onNewFolder}
          className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold flex items-center gap-1.5"
        >
          <FolderPlus size={15} /> New Folder
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Folder row
--------------------------------------------- */

function FolderRow({ folder, onOpen, onDelete }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 cursor-pointer"
      onClick={() => onOpen(folder.id)}
    >
      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
        <FolderIcon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-medium text-slate-800 truncate">{folder.name}</p>
        <p className="text-[11.5px] text-slate-400">Folder</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(folder.id);
        }}
        className="text-slate-400 hover:text-red-500 shrink-0"
        aria-label="Delete folder"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

/* ---------------------------------------------
   File row
--------------------------------------------- */

function FileRow({ file, onDelete }) {
  const Icon = TYPE_ICON[file.type] || FileIcon;
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50">
      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-medium text-slate-800 truncate">{file.name}</p>
        <p className="text-[11.5px] text-slate-400">
          {formatBytes(file.sizeBytes)} · {new Date(file.updatedAt).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={() => onDelete(file.id)}
        className="text-slate-400 hover:text-red-500 shrink-0"
        aria-label="Delete file"
      >
        <Trash2 size={15} />
      </button>
      <button className="text-slate-400 hover:text-slate-600 shrink-0" aria-label="More options">
        <MoreHorizontal size={15} />
      </button>
    </div>
  );
}

/* ---------------------------------------------
   My Storage card
--------------------------------------------- */

function MyStorageCard({
  folders,
  files,
  search,
  crumbs,
  onNavigate,
  onOpenFolder,
  onUploadClick,
  onNewFolder,
  onRefresh,
  onDeleteFile,
  onDeleteFolder,
}) {
  const q = search.trim().toLowerCase();
  const filteredFolders = q ? folders.filter((f) => f.name.toLowerCase().includes(q)) : folders;
  const filteredFiles = q ? files.filter((f) => f.name.toLowerCase().includes(q)) : files;
  const isEmpty = filteredFolders.length === 0 && filteredFiles.length === 0;

  return (
    <ClayCard className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50 gap-3">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-[14px] min-w-0">
          {crumbs.length > 0 ? (
            <button
              onClick={() => onNavigate(crumbs.length > 1 ? crumbs[crumbs.length - 2].id : null)}
              className="text-slate-400 hover:text-slate-600 shrink-0"
              aria-label="Back"
            >
              <ArrowLeft size={16} />
            </button>
          ) : (
            <Monitor size={16} className="text-slate-400 shrink-0" />
          )}
          <Breadcrumbs crumbs={crumbs} onNavigate={onNavigate} />
        </div>
        <div className="flex items-center gap-3 text-slate-400 shrink-0">
          <button onClick={onRefresh} aria-label="Refresh" className="hover:text-slate-600">
            <RefreshCw size={15} />
          </button>
          <button aria-label="Storage info" className="hover:text-slate-600">
            <Info size={15} />
          </button>
        </div>
      </div>

      <div className="px-6 py-2">
        {isEmpty ? (
          <EmptyState
            onUploadClick={onUploadClick}
            onNewFolder={onNewFolder}
            inFolder={crumbs.length > 0}
          />
        ) : (
          <div className="py-2 flex flex-col divide-y divide-slate-50">
            {filteredFolders.map((f) => (
              <FolderRow key={f.id} folder={f} onOpen={onOpenFolder} onDelete={onDeleteFolder} />
            ))}
            {filteredFiles.map((f) => (
              <FileRow key={f.id} file={f} onDelete={onDeleteFile} />
            ))}
          </div>
        )}
      </div>
    </ClayCard>
  );
}

/* ---------------------------------------------
   How it works + Supported files
--------------------------------------------- */

function HowItWorksItem({ icon, iconBg, iconText, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-11 h-11 rounded-2xl ${iconBg} ${iconText} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-[13.5px] font-semibold text-slate-800">{title}</p>
        <p className="text-[12px] text-slate-400 leading-snug mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function HowItWorksCard() {
  return (
    <ClayCard className="p-6 flex-1">
      <p className="text-[14px] font-semibold text-slate-800 mb-5">How it works</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <HowItWorksItem
          icon={<Upload size={18} />}
          iconBg="bg-indigo-50"
          iconText="text-indigo-500"
          title="Upload"
          description="Upload your files and access them from anywhere."
        />
        <HowItWorksItem
          icon={<FolderOpen size={18} />}
          iconBg="bg-amber-50"
          iconText="text-amber-500"
          title="Organize"
          description="Create folders to keep your files organized."
        />
        <HowItWorksItem
          icon={<Lock size={18} />}
          iconBg="bg-emerald-50"
          iconText="text-emerald-500"
          title="Secure"
          description="Your files are safe and secure with us."
        />
      </div>
    </ClayCard>
  );
}

function SupportedFilesCard() {
  const icons = [FileText, FileText, ImageIcon, Code2, MoreHorizontal];
  return (
    <ClayCard className="p-6 w-full lg:w-72 shrink-0">
      <p className="text-[14px] font-semibold text-slate-800 mb-5">Supported Files</p>
      <div className="flex items-center gap-2 flex-wrap">
        {icons.map((Icon, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-500"
          >
            <Icon size={16} />
          </div>
        ))}
      </div>
      <p className="text-[11.5px] text-slate-400 mt-4">Max file size: {MAX_FILE_SIZE_MB} MB</p>
    </ClayCard>
  );
}

/* ---------------------------------------------
   Page
--------------------------------------------- */

export default function Storage() {
  const [data, setData] = useState(null);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  async function load(folderId = currentFolderId) {
    const result = await getStorageData(folderId);
    setData(result);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getStorageData(currentFolderId);
      if (!cancelled) setData(result);
    })();
    return () => {
      cancelled = true;
    };
  }, [currentFolderId]);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFilesSelected(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      await uploadFiles(files, currentFolderId);
      await load();
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function handleNewFolder() {
    setFolderModalOpen(true);
  }

  async function handleDeleteFile(id) {
    await deleteFile(id);
    await load();
  }

  async function handleDeleteFolder(id) {
    await deleteFolder(id);
    await load();
  }

  function handleNavigate(folderId) {
    setSearch("");
    setCurrentFolderId(folderId);
  }

  function handleOpenFolder(folderId) {
    setSearch("");
    setCurrentFolderId(folderId);
  }

  if (!data) {
    return <p className="text-[13px] text-slate-400">Loading your storage...</p>;
  }

  const usedPercent = data.usage.totalBytes
    ? Math.round((data.usage.usedBytes / data.usage.totalBytes) * 100)
    : 0;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      <NewFolderModal
        open={folderModalOpen}
        onClose={() => setFolderModalOpen(false)}
        onCreated={load}
        parentId={currentFolderId}
      />

      <StorageHeader
        search={search}
        onSearchChange={setSearch}
        onUploadClick={handleUploadClick}
        onNewFolder={handleNewFolder}
      />

      {uploading && (
        <ClayCard className="px-4 py-3 text-[12.5px] text-indigo-600 font-medium">
          Uploading files…
        </ClayCard>
      )}

      <MyStorageCard
        folders={data.folders}
        files={data.files}
        search={search}
        crumbs={data.breadcrumbs}
        onNavigate={handleNavigate}
        onOpenFolder={handleOpenFolder}
        onUploadClick={handleUploadClick}
        onNewFolder={handleNewFolder}
        onRefresh={() => load()}
        onDeleteFile={handleDeleteFile}
        onDeleteFolder={handleDeleteFolder}
      />

      <div className="flex flex-col lg:flex-row gap-5">
        <HowItWorksCard />
        <SupportedFilesCard />
      </div>

      <p className="text-[11px] text-slate-400 text-center">
        {formatBytes(data.usage.usedBytes)} of {formatBytes(data.usage.totalBytes)} used ·{" "}
        {usedPercent}%
      </p>
    </>
  );
}
