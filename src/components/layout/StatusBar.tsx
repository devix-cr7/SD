import { GitBranch, Wifi, CheckCircle2 } from "lucide-react";
import { useWorkspace } from "../../store/workspace";

export function StatusBar() {
  const { tables, endpoints } = useWorkspace();

  return (
    <div className="flex h-7 shrink-0 items-center justify-between border-t border-border bg-panel/70 px-3 font-mono text-[11px] text-text-tertiary">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <GitBranch size={12} /> main
        </span>
        <span>{tables.length} tables</span>
        <span>{endpoints.length} endpoints</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-accent-2">
          <CheckCircle2 size={12} /> Autosaved
        </span>
        <span className="flex items-center gap-1.5">
          <Wifi size={12} /> Synced
        </span>
      </div>
    </div>
  );
}
