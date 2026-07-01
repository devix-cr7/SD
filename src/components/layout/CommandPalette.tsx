import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useWorkspace } from "../../store/workspace";
import { NAV_ITEMS } from "../../data/nav";

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, openTab } = useWorkspace();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === "Escape") setCommandPaletteOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandPaletteOpen]);

  const results = useMemo(
    () =>
      NAV_ITEMS.filter(
        (i) =>
          i.label.toLowerCase().includes(query.toLowerCase()) ||
          i.hint.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[14vh]"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-lg overflow-hidden rounded-xl border border-border shadow-2xl"
          >
            <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
              <Search size={15} className="text-text-tertiary" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a tool…"
                className="focus-ring flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary">
                ESC
              </kbd>
            </div>
            <div className="scrollbar-thin max-h-72 overflow-y-auto p-1.5">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    openTab({ id: item.id, label: item.label });
                    setCommandPaletteOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full flex-col items-start rounded-lg px-3 py-2 text-left transition-colors duration-150 hover:bg-elevated/70"
                >
                  <span className="text-sm text-text-primary">{item.label}</span>
                  <span className="text-xs text-text-tertiary">{item.hint}</span>
                </button>
              ))}
              {results.length === 0 && (
                <div className="px-3 py-6 text-center text-sm text-text-tertiary">No matches</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
