import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card, Button, Input, SectionHeading, Badge } from "../components/ui/Primitives";
import { useWorkspace } from "../store/workspace";
import { useT } from "../i18n";

const COLORS = ["#6c8eff", "#35d0ba", "#f5a623", "#f0577a", "#a78bfa"];

export function ProjectPlanner() {
  const { addProject, openTab } = useWorkspace();
  const t = useT();
  const [name, setName] = useState("");
  const [type, setType] = useState("saas");
  const [color, setColor] = useState(COLORS[0]);
  const [created, setCreated] = useState(false);

  const PROJECT_TYPES = [
    { id: "saas", label: t("type_saas"), desc: t("type_saas_desc") },
    { id: "mobile", label: t("type_mobile"), desc: t("type_mobile_desc") },
    { id: "internal", label: t("type_internal"), desc: t("type_internal_desc") },
    { id: "marketplace", label: t("type_marketplace"), desc: t("type_marketplace_desc") },
  ];

  const handleCreate = () => {
    if (!name.trim()) return;
    addProject({
      id: `p${Date.now()}`,
      name: name.trim(),
      type: PROJECT_TYPES.find((tp) => tp.id === type)?.label ?? "Project",
      updatedAt: "Just now",
      tables: 0,
      endpoints: 0,
      color,
    });
    setCreated(true);
    setTimeout(() => {
      openTab({ id: "database", label: t("database") });
    }, 700);
  };

  return (
    <div>
      <SectionHeading
        eyebrow={t("planner_eyebrow")}
        title={t("planner_title")}
        description={t("planner_desc")}
      />

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <Card className="p-6" hover={false}>
          <label className="mb-1.5 block text-xs font-medium text-text-secondary">{t("planner_nameLabel")}</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("planner_namePlaceholder")}
          />

          <label className="mb-1.5 mt-5 block text-xs font-medium text-text-secondary">{t("planner_typeLabel")}</label>
          <div className="grid grid-cols-2 gap-2.5">
            {PROJECT_TYPES.map((tp) => (
              <button
                key={tp.id}
                onClick={() => setType(tp.id)}
                className={`focus-ring rounded-lg border p-3 text-start transition-colors duration-150 ${
                  type === tp.id ? "border-accent/50 bg-accent-soft" : "border-border hover:bg-elevated/50"
                }`}
              >
                <div className={`text-sm font-medium ${type === tp.id ? "text-accent" : "text-text-primary"}`}>
                  {tp.label}
                </div>
                <div className="mt-0.5 text-xs text-text-secondary">{tp.desc}</div>
              </button>
            ))}
          </div>

          <label className="mb-1.5 mt-5 block text-xs font-medium text-text-secondary">{t("planner_colorLabel")}</label>
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
              {created ? t("planner_created") : t("planner_create")}
            </motion.span>
          </Button>
        </Card>

        <Card className="p-5" hover={false}>
          <div className="mb-3 text-xs font-medium text-text-secondary">{t("planner_nextTitle")}</div>
          <ol className="space-y-3">
            {[t("planner_step1"), t("planner_step2"), t("planner_step3"), t("planner_step4")].map((step, i) => (
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
