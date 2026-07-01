import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card, Button, Input, SectionHeading, Badge } from "../components/ui/Primitives";
import { useWorkspace } from "../store/workspace";

const PROJECT_TYPES = [
  { id: "saas", label: "SaaS Product", desc: "Multi-tenant web app with billing" },
  { id: "mobile", label: "Mobile Backend", desc: "REST/GraphQL API for iOS & Android" },
  { id: "internal", label: "Internal Tool", desc: "Dashboard for a team or org" },
  { id: "marketplace", label: "Marketplace", desc: "Two-sided platform with payments" },
];

const COLORS = ["#6c8eff", "#35d0ba", "#f5a623", "#f0577a", "#a78bfa"];

export function ProjectPlanner() {
  const { addProject, openTab } = useWorkspace();
  const [name, setName] = useState("");
  const [type, setType] = useState(PROJECT_TYPES[0].id);
  const [color, setColor] = useState(COLORS[0]);
  const [created, setCreated] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) return;
    addProject({
      id: `p${Date.now()}`,
      name: name.trim(),
      type: PROJECT_TYPES.find((t) => t.id === type)?.label ?? "Project",
      updatedAt: "Just now",
      tables: 0,
      endpoints: 0,
      color,
    });
    setCreated(true);
    setTimeout(() => {
      openTab({ id: "database", label: "Database Designer" });
    }, 700);
  };

  return (
    <div>
      <SectionHeading
        eyebrow="Project Planner"
        title="Scope your next build"
        description="Set the frame once — every other tool inherits it."
      />

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <Card className="p-6" hover={false}>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">Project name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Horizon Booking Platform"
          />

          <label className="mb-1.5 mt-5 block text-xs font-medium text-text-secondary">Project type</label>
          <div className="grid grid-cols-2 gap-2.5">
            {PROJECT_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`focus-ring rounded-lg border p-3 text-left transition-colors duration-150 ${
                  type === t.id ? "border-accent/50 bg-accent-soft" : "border-border hover:bg-elevated/50"
                }`}
              >
                <div className={`text-sm font-medium ${type === t.id ? "text-accent" : "text-text-primary"}`}>
                  {t.label}
                </div>
                <div className="mt-0.5 text-xs text-text-secondary">{t.desc}</div>
              </button>
            ))}
          </div>

          <label className="mb-1.5 mt-5 block text-xs font-medium text-text-secondary">Accent color</label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="focus-ring flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110"
                style={{ background: c }}
              >
                {color === c && <Check size={14} className="text-black/70" />}
              </button>
            ))}
          </div>

          <Button variant="primary" className="mt-6 w-full" onClick={handleCreate} disabled={!name.trim()}>
            <motion.span animate={created ? { scale: [1, 1.15, 1] } : {}} className="flex items-center gap-2">
              {created ? <Check size={15} /> : null}
              {created ? "Created — opening Database Designer…" : "Create project"}
            </motion.span>
          </Button>
        </Card>

        <Card className="p-5" hover={false}>
          <div className="mb-3 text-xs font-medium text-text-secondary">What happens next</div>
          <ol className="space-y-3">
            {[
              "Design your data model in Database Designer",
              "Define contracts in API Designer",
              "Map infrastructure in System Architecture",
              "Generate the folder scaffold & docs",
            ].map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-text-secondary">
                <Badge tone="accent" className="h-5 w-5 shrink-0 items-center justify-center rounded-full p-0">
                  {i + 1}
                </Badge>
                {step}
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
