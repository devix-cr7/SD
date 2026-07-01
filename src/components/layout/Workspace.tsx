import { AnimatePresence, motion } from "framer-motion";
import { useWorkspace } from "../../store/workspace";
import { Dashboard } from "../../pages/Dashboard";
import { ProjectPlanner } from "../../pages/ProjectPlanner";
import { DatabaseDesigner } from "../../pages/DatabaseDesigner";
import { ApiDesigner } from "../../pages/ApiDesigner";
import { SystemArchitecture } from "../../pages/SystemArchitecture";
import { UiBuilder } from "../../pages/UiBuilder";
import { FolderStructure } from "../../pages/FolderStructure";
import { Documentation } from "../../pages/Documentation";
import { FlowDesigner } from "../../pages/FlowDesigner";
import type { ToolId } from "../../types";

const PAGES: Record<ToolId, React.ComponentType> = {
  dashboard: Dashboard,
  planner: ProjectPlanner,
  database: DatabaseDesigner,
  api: ApiDesigner,
  architecture: SystemArchitecture,
  "ui-builder": UiBuilder,
  "folder-structure": FolderStructure,
  documentation: Documentation,
  "flow-designer": FlowDesigner,
};

export function Workspace() {
  const { activeTab } = useWorkspace();
  const Page = PAGES[activeTab];

  return (
    <div className="scrollbar-thin relative flex-1 overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[1180px] px-8 py-8"
        >
          <Page />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
