import { useCallback, useState } from "react";
import ReactFlow, {
  Background, Controls, addEdge, useEdgesState, useNodesState,
  type Connection, type Node, BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus } from "lucide-react";
import { Button, SectionHeading, Card } from "../components/ui/Primitives";
import { useT } from "../i18n";

function step(id: string, label: string, x: number, y: number): Node {
  return {
    id,
    position: { x, y },
    data: { label },
    style: {
      background: "#17171b", color: "#edeef1", border: "1px solid #6c8eff44",
      borderRadius: 999, padding: "10px 18px", fontSize: 12.5, fontFamily: "Inter, sans-serif",
    },
  };
}

const initialNodes: Node[] = [
  step("s1", "1. Visitor lands on homepage", 40, 80),
  step("s2", "2. Clicks Sign up", 320, 80),
  step("s3", "3. Fills onboarding form", 600, 80),
  step("s4", "4. Verifies email", 600, 220),
  step("s5", "5. Reaches Dashboard", 320, 220),
];

const initialEdges = [
  { id: "f1", source: "s1", target: "s2", animated: true, style: { stroke: "#6c8eff" } },
  { id: "f2", source: "s2", target: "s3", animated: true, style: { stroke: "#6c8eff" } },
  { id: "f3", source: "s3", target: "s4", style: { stroke: "#35d0ba" } },
  { id: "f4", source: "s4", target: "s5", style: { stroke: "#35d0ba" } },
  { id: "f5", source: "s2", target: "s5", style: { stroke: "#5f5f68" }, label: "already verified" },
];

export function FlowDesigner() {
  const t = useT();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [counter, setCounter] = useState(1);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, style: { stroke: "#6c8eff" } }, eds)),
    [setEdges]
  );

  const addStep = () => {
    const id = `s-new-${counter}`;
    setCounter((c) => c + 1);
    setNodes((n) => [...n, step(id, "New step", 200 + Math.random() * 400, 350)]);
  };

  return (
    <div>
      <SectionHeading
        eyebrow={t("flow_eyebrow")}
        title={t("flow_title")}
        description={t("flow_desc")}
        action={<Button variant="primary" size="sm" onClick={addStep}><Plus size={13} /> {t("flow_addStep")}</Button>}
      />
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
        </ReactFlow>
      </Card>
    </div>
  );
}
