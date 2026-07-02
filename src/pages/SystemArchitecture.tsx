import { useCallback, useState } from "react";
import ReactFlow, {
  Background, Controls, MiniMap, addEdge, useEdgesState, useNodesState,
  type Connection, type Node, BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus } from "lucide-react";
import { Button, SectionHeading, Card } from "../components/ui/Primitives";
import { useT } from "../i18n";

const LAYER_COLOR: Record<string, string> = {
  frontend: "#6c8eff", backend: "#35d0ba", database: "#f5a623",
  cache: "#f0577a", storage: "#a78bfa", auth: "#6c8eff", queue: "#35d0ba",
};

function makeNode(id: string, label: string, kind: string, x: number, y: number): Node {
  return {
    id,
    position: { x, y },
    data: { label },
    style: {
      background: "#17171b",
      color: "#edeef1",
      border: `1px solid ${LAYER_COLOR[kind]}55`,
      borderRadius: 10,
      padding: "10px 16px",
      fontSize: 12.5,
      fontFamily: "Inter, sans-serif",
      boxShadow: `0 0 0 1px ${LAYER_COLOR[kind]}22`,
    },
  };
}

const initialNodes: Node[] = [
  makeNode("frontend", "Frontend — React SPA", "frontend", 40, 40),
  makeNode("gateway", "API Gateway", "backend", 320, 40),
  makeNode("auth", "Auth Service", "auth", 600, -40),
  makeNode("backend", "Backend — Node/Nest", "backend", 600, 100),
  makeNode("db", "PostgreSQL", "database", 880, 40),
  makeNode("cache", "Redis Cache", "cache", 880, 180),
  makeNode("queue", "Job Queue", "queue", 600, 260),
  makeNode("storage", "Object Storage (S3)", "storage", 880, -80),
];

const initialEdges = [
  { id: "e1", source: "frontend", target: "gateway", animated: true, style: { stroke: "#6c8eff" } },
  { id: "e2", source: "gateway", target: "auth", style: { stroke: "#5f5f68" } },
  { id: "e3", source: "gateway", target: "backend", animated: true, style: { stroke: "#35d0ba" } },
  { id: "e4", source: "backend", target: "db", style: { stroke: "#f5a623" } },
  { id: "e5", source: "backend", target: "cache", style: { stroke: "#f0577a" } },
  { id: "e6", source: "backend", target: "queue", style: { stroke: "#35d0ba" } },
  { id: "e7", source: "backend", target: "storage", style: { stroke: "#a78bfa" } },
];

export function SystemArchitecture() {
  const t = useT();
  const PALETTE = [
    { kind: "frontend", label: t("arch_frontend") },
    { kind: "backend", label: t("arch_service") },
    { kind: "database", label: t("arch_database") },
    { kind: "cache", label: t("arch_cache") },
    { kind: "storage", label: t("arch_storage") },
    { kind: "queue", label: t("arch_queue") },
  ];
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [counter, setCounter] = useState(1);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, style: { stroke: "#6c8eff" } }, eds)),
    [setEdges]
  );

  const addNode = (kind: string, label: string) => {
    const id = `${kind}-${counter}`;
    setCounter((c) => c + 1);
    setNodes((n) => [...n, makeNode(id, label, kind, 200 + Math.random() * 400, 300 + Math.random() * 150)]);
  };

  return (
    <div>
      <SectionHeading
        eyebrow={t("arch_eyebrow")}
        title={t("arch_title")}
        description={t("arch_desc")}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {PALETTE.map((p) => (
          <Button key={p.kind} variant="outline" size="sm" onClick={() => addNode(p.kind, p.label)}>
            <Plus size={12} /> {p.label}
          </Button>
        ))}
      </div>

      <Card hover={false} className="h-[560px] overflow-hidden p-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1} color="#232328" />
          <Controls className="!bg-elevated !border-border [&>button]:!bg-elevated [&>button]:!border-border [&>button]:!fill-text-secondary" />
          <MiniMap
            style={{ background: "#101013", border: "1px solid #232328" }}
            maskColor="rgba(9,9,11,0.7)"
            nodeColor={(n) => (n.style?.border as string)?.slice(0, 7) || "#6c8eff"}
          />
        </ReactFlow>
      </Card>
    </div>
  );
}
