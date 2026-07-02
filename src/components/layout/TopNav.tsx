import { motion } from "framer-motion";
import { Search, ChevronDown, Bell, Command, Languages } from "lucide-react";
import { useState } from "react";
import { useWorkspace } from "../../store/workspace";
import { useT } from "../../i18n";
import clsx from "clsx";

export function TopNav() {
  const { projects, activeProjectId, setActiveProject, setCommandPaletteOpen, locale, toggleLocale } = useWorkspace();
  const t = useT();
  const [open, setOpen] = useState(false);
  const active = projects.find((p) => p.id === activeProjectId) ?? projects[0];

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-panel/50 px-4">
      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="focus-ring flex items-center gap-2.5 rounded-lg border border-transparent px-2 py-1.5 text-sm transition-colors duration-150 hover:border-border hover:bg-elevated/60"
        >
          <span className="h-2 w-2 rounded-full" style={{ background: active.color }} />
          <span className="font-medium text-text-primary">{active.name}</span>
          <span className="text-text-tertiary">·</span>
          <span className="text-text-secondary">{active.type}</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} className="text-text-tertiary" />
          </motion.span>
        </button>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="glass absolute start-0 top-11 z-30 w-72 rounded-xl border border-border p-1.5 shadow-2xl"
          >
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setActiveProject(p.id);
                  setOpen(false);
                }}
                className={clsx(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-start text-sm transition-colors duration-150 hover:bg-elevated/70",
                  p.id === activeProjectId ? "text-accent" : "text-text-primary"
                )}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                <span className="flex-1 truncate">{p.name}</span>
                <span className="font-mono text-[11px] text-text-tertiary">{p.updatedAt}</span>
              </button>
            ))}
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleLocale}
          className="focus-ring flex items-center gap-1.5 rounded-lg border border-border bg-elevated/50 px-2.5 py-1.5 text-xs text-text-secondary transition-colors duration-150 hover:border-elevated-2 hover:text-text-primary"
          title="Switch language / تبديل اللغة"
        >
          <Languages size={13} />
          <span className="font-mono">{locale === "en" ? "AR" : "EN"}</span>
        </button>
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="focus-ring flex items-center gap-2 rounded-lg border border-border bg-elevated/50 px-3 py-1.5 text-xs text-text-secondary transition-colors duration-150 hover:border-elevated-2 hover:text-text-primary"
        >
          <Search size={13} />
          <span>{t("quickJump")}</span>
          <span className="ms-3 flex items-center gap-0.5 rounded border border-border bg-panel px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary">
            <Command size={10} />K
          </span>
        </button>
        <button className="focus-ring flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-colors duration-150 hover:bg-elevated/70 hover:text-text-primary">
          <Bell size={16} />
        </button>
        <div className="ms-1 h-7 w-7 rounded-full bg-gradient-to-br from-accent to-accent-2" />
      </div>
    </header>
  );
}
