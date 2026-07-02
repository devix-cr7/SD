import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid, Compass, Database, Plug, LayoutTemplate, Network,
  Waypoints, FolderTree, FileText, ChevronsLeft, Sparkles, Send,
} from "lucide-react";
import { NAV_ITEMS, GROUPS } from "../../data/nav";
import { useWorkspace } from "../../store/workspace";
import { useT } from "../../i18n";
import clsx from "clsx";

const ICONS: Record<string, React.ElementType> = {
  LayoutGrid, Compass, Database, Plug, LayoutTemplate, Network, Waypoints, FolderTree, FileText,
};

const GROUP_KEY: Record<string, string> = {
  Overview: "nav_overview", Design: "nav_design", Architecture: "nav_architecture", Output: "nav_output",
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { activeTab, openTab, locale } = useWorkspace();
  const t = useT();

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 244 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className="relative flex h-full flex-col border-r border-border bg-panel/60"
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-accent to-accent-2 text-[#0a0a10]">
          <Sparkles size={15} strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="truncate text-[13px] font-semibold tracking-tight text-text-primary"
          >
            {t("appName")}
          </motion.span>
        )}
      </div>

      <nav className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-2.5 py-4">
        {GROUPS.map((group) => (
          <div key={group}>
            {!collapsed && (
              <div className="mb-1.5 px-2 font-mono text-[10px] uppercase tracking-[0.14em] text-text-tertiary">
                {t(GROUP_KEY[group] as any)}
              </div>
            )}
            <div className="space-y-0.5">
              {NAV_ITEMS.filter((i) => i.group === group).map((item) => {
                const Icon = ICONS[item.icon];
                const active = activeTab === item.id;
                const label = t(item.id as any);
                return (
                  <button
                    key={item.id}
                    onClick={() => openTab({ id: item.id, label })}
                    title={collapsed ? label : undefined}
                    className={clsx(
                      "focus-ring group relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors duration-150",
                      active
                        ? "bg-accent-soft text-accent"
                        : "text-text-secondary hover:bg-elevated/70 hover:text-text-primary"
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className={clsx(
                          "absolute top-1 bottom-1 w-[2.5px] rounded-full bg-accent",
                          locale === "ar" ? "right-0" : "left-0"
                        )}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon size={16} strokeWidth={2} className="shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-2.5">
        <a
          href="https://t.me/SF8_9"
          target="_blank"
          rel="noreferrer"
          className="focus-ring flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-text-secondary transition-colors duration-150 hover:bg-elevated/70 hover:text-accent-2"
          title="Contact on Telegram"
        >
          <Send size={16} strokeWidth={2} className="shrink-0" />
          {!collapsed && <span className="truncate font-mono" dir="ltr">{t("contactTelegram")}</span>}
        </a>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="focus-ring mt-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-text-secondary transition-colors duration-150 hover:bg-elevated/70 hover:text-text-primary"
        >
          <motion.span
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="flex"
          >
            <ChevronsLeft size={16} strokeWidth={2} className={locale === "ar" ? "-scale-x-100" : ""} />
          </motion.span>
          {!collapsed && <span>{t("collapse")}</span>}
        </button>
      </div>
    </motion.aside>
  );
}
