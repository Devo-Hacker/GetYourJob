import {
  LayoutDashboard,
  Briefcase,
  BarChart2,
  Map,
  FolderKanban,
  Link2,
  Database,
  Settings,
} from "lucide-react";

export const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Briefcase, label: "Jobs", path: "/jobs" },
  { icon: BarChart2, label: "Skill Gap", path: "/skill-gap" },
  { icon: Map, label: "Roadmap", path: "/roadmap" },
  { icon: FolderKanban, label: "Projects", path: "/projects" },
  { icon: Link2, label: "Connections", path: "/connections" },
  { icon: Database, label: "Storage", path: "/storage", badge: "New" },
  { icon: Settings, label: "Settings", path: "/settings" },
];
