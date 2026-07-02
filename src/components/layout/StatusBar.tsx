import { GitBranch, Wifi, CheckCircle2 } from "lucide-react";
import { useWorkspace } from "../../store/workspace";
import { useT } from "../../i18n";

export function StatusBar() {
  const { tables, endpoints } = useWorkspace();
  const t = useT();

  return (
    <div className="flex h-7 shrink-0 items-center justify-between border-t border-border bg-panel/70 px-3 font-mono text-[11px] text-text-tertiary">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <GitBranch size={12} /> main
        </span>
        <span>{tables.length} {t("tables")}</span>
        <span>{endpoints.length} {t("endpoints")}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-accent-2">
          <CheckCircle2 size={12} /> {t("status_autosaved")}
        </span>
        <span className="flex items-center gap-1.5">
          <Wifi size={12} /> {t("status_synced")}
        </span>
      </div>
    </div>
  );
}
