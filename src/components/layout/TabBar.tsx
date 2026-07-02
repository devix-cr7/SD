import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useWorkspace } from "../../store/workspace";
import { useT } from "../../i18n";
import clsx from "clsx";

export function TabBar() {
  const { tabs, activeTab, setActiveTab, closeTab } = useWorkspace();
  const t = useT();

  return (
    <div className="scrollbar-thin flex h-10 shrink-0 items-center gap-1 overflow-x-auto border-b border-border bg-base/60 px-2">
      <AnimatePresence initial={false}>
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <motion.button
              key={tab.id}
              layout
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "focus-ring group relative flex h-8 shrink-0 items-center gap-2 rounded-md px-3 text-[12.5px] transition-colors duration-150",
                active
                  ? "bg-elevated text-text-primary"
                  : "text-text-secondary hover:bg-elevated/50 hover:text-text-primary"
              )}
            >
              <span className="whitespace-nowrap">{t(tab.id as any)}</span>
              {tab.id !== "dashboard" && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="rounded p-0.5 opacity-0 transition-opacity duration-150 hover:bg-elevated-2 group-hover:opacity-100"
                >
                  <X size={12} />
                </span>
              )}
              {active && (
                <motion.div
                  layoutId="tab-active-line"
                  className="absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
