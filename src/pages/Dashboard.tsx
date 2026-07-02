import { motion } from "framer-motion";
import { Database, Plug, Network, ArrowUpRight, Plus } from "lucide-react";
import { Card, Button, Badge, SectionHeading } from "../components/ui/Primitives";
import { useWorkspace } from "../store/workspace";
import { useT } from "../i18n";

const NODES = [
  { x: 60, y: 40 }, { x: 220, y: 20 }, { x: 380, y: 60 }, { x: 500, y: 30 },
  { x: 140, y: 120 }, { x: 320, y: 130 }, { x: 460, y: 140 }, { x: 40, y: 170 },
  { x: 240, y: 190 }, { x: 420, y: 190 },
];
const EDGES = [
  [0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 2], [5, 6], [3, 6],
  [4, 7], [4, 8], [8, 5], [8, 9], [6, 9],
];

function AmbientGraph() {
  return (
    <svg viewBox="0 0 540 220" className="absolute inset-0 h-full w-full opacity-[0.35]" preserveAspectRatio="xMidYMid slice">
      {EDGES.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y}
          stroke="url(#edgeGrad)" strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: i * 0.06, ease: "easeInOut" }}
        />
      ))}
      {NODES.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x} cy={n.y} r={i % 3 === 0 ? 4 : 2.6}
          fill={i % 3 === 0 ? "#6c8eff" : "#35d0ba"}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
        />
      ))}
      <defs>
        <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6c8eff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#35d0ba" stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Dashboard() {
  const { projects, tables, endpoints, openTab } = useWorkspace();
  const t = useT();

  const stats = [
    { label: t("dash_activeProjects"), value: projects.length, icon: Network, tone: "accent" as const },
    { label: t("dash_tablesDesigned"), value: tables.length, icon: Database, tone: "teal" as const },
    { label: t("dash_endpointsMapped"), value: endpoints.length, icon: Plug, tone: "amber" as const },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-8 overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-panel to-elevated/40 px-8 py-10"
      >
        <AmbientGraph />
        <div className="relative">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {t("dash_eyebrow")}
          </div>
          <h1 className="max-w-xl text-2xl font-semibold tracking-tight text-text-primary">
            {t("dash_title")}
          </h1>
          <p className="mt-2 max-w-md text-sm text-text-secondary">
            {t("dash_desc")}
          </p>
          <div className="mt-5 flex gap-2.5">
            <Button variant="primary" onClick={() => openTab({ id: "planner", label: t("planner") })}>
              <Plus size={15} /> {t("dash_newProject")}
            </Button>
            <Button variant="outline" onClick={() => openTab({ id: "architecture", label: t("architecture") })}>
              {t("dash_viewArch")}
            </Button>
          </div>
        </div>
      </motion.div>

      <SectionHeading eyebrow={t("dash_workspaceEyebrow")} title={t("dash_workspaceTitle")} description={t("dash_workspaceDesc")} />

      <div className="mb-8 grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <Card
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            <div className="flex items-center justify-between">
              <Badge tone={s.tone}>{s.label}</Badge>
              <s.icon size={15} className="text-text-tertiary" />
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-text-primary">{s.value}</div>
          </Card>
        ))}
      </div>

      <SectionHeading title={t("dash_recentProjects")} />
      <div className="grid grid-cols-3 gap-4">
        {projects.map((p, i) => (
          <Card
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="group cursor-pointer"
            onClick={() => openTab({ id: "database", label: t("database") })}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                <span className="text-sm font-medium text-text-primary">{p.name}</span>
              </div>
              <ArrowUpRight size={14} className="text-text-tertiary opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
            </div>
            <div className="mt-1 text-xs text-text-secondary">{p.type}</div>
            <div className="mt-4 flex items-center gap-4 font-mono text-[11px] text-text-tertiary">
              <span>{p.tables} {t("tables")}</span>
              <span>{p.endpoints} {t("endpoints")}</span>
              <span className="ms-auto">{p.updatedAt}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
