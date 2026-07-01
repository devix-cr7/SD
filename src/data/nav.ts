import type { NavItem } from "../types";

export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", group: "Overview", icon: "LayoutGrid", hint: "Overview & recent activity" },
  { id: "planner", label: "Project Planner", group: "Overview", icon: "Compass", hint: "Scope a new project" },
  { id: "database", label: "Database Designer", group: "Design", icon: "Database", hint: "Tables, relations, SQL" },
  { id: "api", label: "API Designer", group: "Design", icon: "Plug", hint: "Endpoints & contracts" },
  { id: "ui-builder", label: "UI Builder", group: "Design", icon: "LayoutTemplate", hint: "Screens & components" },
  { id: "architecture", label: "System Architecture", group: "Architecture", icon: "Network", hint: "Full system map" },
  { id: "flow-designer", label: "Flow Designer", group: "Architecture", icon: "Waypoints", hint: "User & system flows" },
  { id: "folder-structure", label: "Folder Structure", group: "Output", icon: "FolderTree", hint: "Generate project scaffold" },
  { id: "documentation", label: "Documentation", group: "Output", icon: "FileText", hint: "README & API docs" },
];

export const GROUPS: NavItem["group"][] = ["Overview", "Design", "Architecture", "Output"];
