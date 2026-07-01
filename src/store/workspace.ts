import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApiEndpoint, DbTable, Project, Tab, ToolId } from "../types";

interface WorkspaceState {
  tabs: Tab[];
  activeTab: ToolId;
  openTab: (tab: Tab) => void;
  closeTab: (id: ToolId) => void;
  setActiveTab: (id: ToolId) => void;

  projects: Project[];
  activeProjectId: string;
  setActiveProject: (id: string) => void;
  addProject: (p: Project) => void;

  tables: DbTable[];
  setTables: (t: DbTable[]) => void;
  addTable: (t: DbTable) => void;
  updateTable: (id: string, t: Partial<DbTable>) => void;
  removeTable: (id: string) => void;

  endpoints: ApiEndpoint[];
  setEndpoints: (e: ApiEndpoint[]) => void;
  addEndpoint: (e: ApiEndpoint) => void;
  updateEndpoint: (id: string, e: Partial<ApiEndpoint>) => void;
  removeEndpoint: (id: string) => void;

  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
}

const TAB_LABELS: Record<ToolId, string> = {
  dashboard: "Dashboard",
  planner: "Project Planner",
  database: "Database Designer",
  api: "API Designer",
  "ui-builder": "UI Builder",
  architecture: "System Architecture",
  "folder-structure": "Folder Structure",
  documentation: "Documentation",
  "flow-designer": "Flow Designer",
};

export const useWorkspace = create<WorkspaceState>()(
  persist(
    (set, get) => ({
  tabs: [{ id: "dashboard", label: "Dashboard" }],
  activeTab: "dashboard",
  openTab: (tab) => {
    const exists = get().tabs.find((t) => t.id === tab.id);
    set({
      tabs: exists ? get().tabs : [...get().tabs, tab],
      activeTab: tab.id,
    });
  },
  closeTab: (id) => {
    if (id === "dashboard") return;
    const tabs = get().tabs.filter((t) => t.id !== id);
    const wasActive = get().activeTab === id;
    set({
      tabs,
      activeTab: wasActive ? tabs[tabs.length - 1]?.id ?? "dashboard" : get().activeTab,
    });
  },
  setActiveTab: (id) => set({ activeTab: id }),

  projects: [
    { id: "p1", name: "Nova Commerce", type: "SaaS · E-commerce", updatedAt: "2h ago", tables: 12, endpoints: 34, color: "#6c8eff" },
    { id: "p2", name: "Pulse Analytics", type: "Internal Dashboard", updatedAt: "Yesterday", tables: 7, endpoints: 21, color: "#35d0ba" },
    { id: "p3", name: "Wayfarer Mobile API", type: "Mobile Backend", updatedAt: "3 days ago", tables: 15, endpoints: 48, color: "#f5a623" },
  ],
  activeProjectId: "p1",
  setActiveProject: (id) => set({ activeProjectId: id }),
  addProject: (p) => set({ projects: [p, ...get().projects], activeProjectId: p.id }),

  tables: [
    {
      id: "t1",
      name: "users",
      columns: [
        { id: "c1", name: "id", type: "uuid", pk: true },
        { id: "c2", name: "email", type: "varchar(255)" },
        { id: "c3", name: "password_hash", type: "text" },
        { id: "c4", name: "created_at", type: "timestamp" },
      ],
    },
    {
      id: "t2",
      name: "orders",
      columns: [
        { id: "c5", name: "id", type: "uuid", pk: true },
        { id: "c6", name: "user_id", type: "uuid", fk: "users.id" },
        { id: "c7", name: "total", type: "numeric(10,2)" },
        { id: "c8", name: "status", type: "varchar(32)" },
      ],
    },
  ],
  setTables: (t) => set({ tables: t }),
  addTable: (t) => set({ tables: [...get().tables, t] }),
  updateTable: (id, t) =>
    set({ tables: get().tables.map((tb) => (tb.id === id ? { ...tb, ...t } : tb)) }),
  removeTable: (id) => set({ tables: get().tables.filter((t) => t.id !== id) }),

  endpoints: [
    { id: "e1", method: "GET", path: "/api/users", summary: "List users", auth: true, params: [] },
    { id: "e2", method: "POST", path: "/api/orders", summary: "Create order", auth: true, params: [
      { id: "p1", name: "userId", type: "string", required: true },
      { id: "p2", name: "items", type: "array", required: true },
    ] },
  ],
  setEndpoints: (e) => set({ endpoints: e }),
  addEndpoint: (e) => set({ endpoints: [...get().endpoints, e] }),
  updateEndpoint: (id, e) =>
    set({ endpoints: get().endpoints.map((ep) => (ep.id === id ? { ...ep, ...e } : ep)) }),
  removeEndpoint: (id) => set({ endpoints: get().endpoints.filter((e) => e.id !== id) }),

      commandPaletteOpen: false,
      setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
    }),
    {
      name: "fsa-workspace-v1",
      partialize: (state) => ({
        projects: state.projects,
        activeProjectId: state.activeProjectId,
        tables: state.tables,
        endpoints: state.endpoints,
        tabs: state.tabs,
        activeTab: state.activeTab,
      }),
    }
  )
);

export { TAB_LABELS };
