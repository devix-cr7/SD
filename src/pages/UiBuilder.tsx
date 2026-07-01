import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, LayoutTemplate, Trash2, Eye, EyeOff } from "lucide-react";
import { Card, Button, Input, SectionHeading, Badge } from "../components/ui/Primitives";

interface Screen {
  id: string;
  name: string;
  components: string[];
}

const STARTER: Screen[] = [
  { id: "sc1", name: "Landing Page", components: ["Navbar", "Hero", "Pricing", "Footer"] },
  { id: "sc2", name: "Dashboard", components: ["Sidebar", "StatsGrid", "ActivityFeed"] },
  { id: "sc3", name: "Settings", components: ["Tabs", "ProfileForm", "BillingCard"] },
];

// Rough wireframe shape per known component name — falls back to a generic block.
const SHAPE: Record<string, { h: string; w?: string; label?: string }> = {
  Navbar: { h: "h-6", w: "w-full" },
  Sidebar: { h: "h-full", w: "w-1/4" },
  Hero: { h: "h-16", w: "w-full" },
  Footer: { h: "h-8", w: "w-full" },
  Pricing: { h: "h-20", w: "w-full" },
  StatsGrid: { h: "h-12", w: "w-full" },
  ActivityFeed: { h: "h-24", w: "w-full" },
  Tabs: { h: "h-6", w: "w-2/3" },
  ProfileForm: { h: "h-20", w: "w-full" },
  BillingCard: { h: "h-14", w: "w-2/3" },
};

function Wireframe({ components }: { components: string[] }) {
  const hasSidebar = components.includes("Sidebar");
  const rest = components.filter((c) => c !== "Sidebar");
  return (
    <div className="flex h-40 gap-1.5 rounded-lg border border-border bg-base/60 p-2">
      {hasSidebar && (
        <div className="w-1/5 rounded bg-accent-soft border border-accent/20" />
      )}
      <div className="flex flex-1 flex-col gap-1.5">
        {rest.length === 0 && (
          <div className="flex flex-1 items-center justify-center text-[10px] text-text-tertiary">
            empty screen
          </div>
        )}
        {rest.map((c, i) => {
          const shape = SHAPE[c];
          return (
            <motion.div
              key={c + i}
              initial={{ opacity: 0, scaleY: 0.6 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className={`${shape?.h ?? "h-10"} ${shape?.w ?? "w-full"} rounded border border-border-soft bg-elevated/70 flex items-center px-2`}
            >
              <span className="truncate font-mono text-[9px] text-text-tertiary">{c}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function UiBuilder() {
  const [screens, setScreens] = useState(STARTER);
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<Record<string, boolean>>({ sc1: true, sc2: true, sc3: true });

  const addScreen = () => {
    if (!name.trim()) return;
    const id = `sc-${Date.now()}`;
    setScreens((s) => [...s, { id, name: name.trim(), components: [] }]);
    setPreview((p) => ({ ...p, [id]: true }));
    setName("");
  };

  const addComponent = (screenId: string, comp: string) => {
    setScreens((s) => s.map((sc) => (sc.id === screenId ? { ...sc, components: [...sc.components, comp] } : sc)));
  };

  return (
    <div>
      <SectionHeading
        eyebrow="UI Builder"
        title="Sketch your screens"
        description="Block out screens and the components each one needs — with a live wireframe preview."
      />

      <div className="mb-5 flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New screen name" onKeyDown={(e) => e.key === "Enter" && addScreen()} />
        <Button variant="primary" onClick={addScreen}><Plus size={15} /> Add screen</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <AnimatePresence>
          {screens.map((s, i) => (
            <motion.div key={s.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05, duration: 0.25 }}>
              <Card hover={false} className="p-0 overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-elevated/30 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <LayoutTemplate size={14} className="text-accent" />
                    <span className="text-sm font-medium text-text-primary">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreview((p) => ({ ...p, [s.id]: !p[s.id] }))}
                      className="focus-ring rounded p-1 text-text-tertiary hover:text-text-primary"
                    >
                      {preview[s.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button
                      onClick={() => setScreens((cur) => cur.filter((sc) => sc.id !== s.id))}
                      className="focus-ring rounded p-1 text-text-tertiary hover:text-rose"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {preview[s.id] && (
                  <div className="p-3">
                    <Wireframe components={s.components} />
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 px-3 pb-3">
                  {s.components.map((c) => (
                    <Badge key={c} tone="accent">{c}</Badge>
                  ))}
                  {s.components.length === 0 && <span className="text-xs text-text-tertiary">No components yet</span>}
                </div>
                <div className="border-t border-border p-2">
                  <input
                    placeholder="+ component name, Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        addComponent(s.id, e.currentTarget.value.trim());
                        e.currentTarget.value = "";
                      }
                    }}
                    className="focus-ring w-full rounded bg-transparent px-2 py-1 text-xs text-text-secondary placeholder:text-text-tertiary"
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
