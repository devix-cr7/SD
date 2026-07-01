import { useMemo, useState } from "react";
import { Copy, FolderTree, Download, Loader2 } from "lucide-react";
import { Card, Button, SectionHeading } from "../components/ui/Primitives";
import { useWorkspace } from "../store/workspace";

const STACKS = ["Next.js (App Router)", "React + Vite", "Node/Express API", "NestJS API"] as const;
type Stack = (typeof STACKS)[number];

function buildTree(stack: Stack, tableCount: number) {
  if (stack === "Next.js (App Router)") {
    return `project/
├─ app/
│  ├─ (marketing)/
│  ├─ dashboard/
│  ├─ api/
│  └─ layout.tsx
├─ components/
├─ lib/
├─ prisma/
│  └─ schema.prisma   (${tableCount} models)
├─ public/
└─ package.json`;
  }
  if (stack === "React + Vite") {
    return `project/
├─ src/
│  ├─ components/
│  ├─ pages/
│  ├─ store/
│  ├─ lib/
│  └─ main.tsx
├─ public/
├─ index.html
└─ package.json`;
  }
  if (stack === "Node/Express API") {
    return `project/
├─ src/
│  ├─ routes/
│  ├─ controllers/
│  ├─ services/
│  ├─ models/          (${tableCount} models)
│  ├─ middleware/
│  └─ index.ts
├─ tests/
└─ package.json`;
  }
  return `project/
├─ src/
│  ├─ modules/
│  │  └─ <feature>/
│  │     ├─ *.controller.ts
│  │     ├─ *.service.ts
│  │     └─ *.module.ts
│  ├─ common/
│  └─ main.ts
├─ test/
└─ package.json`;
}

function buildPaths(stack: Stack, tableNames: string[]): { path: string; content: string }[] {
  const pkg = (name: string) =>
    JSON.stringify({ name, version: "0.1.0", private: true, scripts: { dev: "vite" } }, null, 2);

  if (stack === "Next.js (App Router)") {
    return [
      { path: "app/layout.tsx", content: "export default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <body>{children}</body>\n    </html>\n  );\n}\n" },
      { path: "app/(marketing)/.gitkeep", content: "" },
      { path: "app/dashboard/.gitkeep", content: "" },
      { path: "app/api/.gitkeep", content: "" },
      { path: "components/.gitkeep", content: "" },
      { path: "lib/.gitkeep", content: "" },
      { path: "prisma/schema.prisma", content: tableNames.map((t) => `model ${t} {\n  id String @id @default(uuid())\n}`).join("\n\n") },
      { path: "public/.gitkeep", content: "" },
      { path: "package.json", content: pkg("project") },
    ];
  }
  if (stack === "React + Vite") {
    return [
      { path: "src/components/.gitkeep", content: "" },
      { path: "src/pages/.gitkeep", content: "" },
      { path: "src/store/.gitkeep", content: "" },
      { path: "src/lib/.gitkeep", content: "" },
      { path: "src/main.tsx", content: "// entry point\n" },
      { path: "public/.gitkeep", content: "" },
      { path: "index.html", content: "<!doctype html>\n<html><body><div id=\"root\"></div></body></html>\n" },
      { path: "package.json", content: pkg("project") },
    ];
  }
  if (stack === "Node/Express API") {
    return [
      { path: "src/routes/.gitkeep", content: "" },
      { path: "src/controllers/.gitkeep", content: "" },
      { path: "src/services/.gitkeep", content: "" },
      ...tableNames.map((t) => ({ path: `src/models/${t}.ts`, content: `export interface ${t} {\n  id: string;\n}\n` })),
      { path: "src/middleware/.gitkeep", content: "" },
      { path: "src/index.ts", content: "// server entry\n" },
      { path: "tests/.gitkeep", content: "" },
      { path: "package.json", content: pkg("api") },
    ];
  }
  return [
    { path: "src/modules/.gitkeep", content: "" },
    { path: "src/common/.gitkeep", content: "" },
    { path: "src/main.ts", content: "// nest entry\n" },
    { path: "test/.gitkeep", content: "" },
    { path: "package.json", content: pkg("api") },
  ];
}

export function FolderStructure() {
  const { tables } = useWorkspace();
  const [stack, setStack] = useState<Stack>("Next.js (App Router)");
  const [copied, setCopied] = useState(false);
  const [zipping, setZipping] = useState(false);
  const tree = useMemo(() => buildTree(stack, tables.length), [stack, tables.length]);
  const tableNames = tables.map((t) => t.name[0].toUpperCase() + t.name.slice(1));

  const handleDownloadZip = async () => {
    setZipping(true);
    try {
      const [{ default: JSZip }, { saveAs }] = await Promise.all([
        import("jszip"),
        import("file-saver"),
      ]);
      const zip = new JSZip();
      const files = buildPaths(stack, tableNames);
      files.forEach((f) => zip.file(f.path, f.content));
      zip.file("STRUCTURE.txt", tree);
      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "project-scaffold.zip");
    } finally {
      setZipping(false);
    }
  };

  return (
    <div>
      <SectionHeading
        eyebrow="Folder Structure"
        title="Generate a project scaffold"
        description="Pick a stack — the structure reflects the schema you've already designed."
        action={
          <Button variant="primary" onClick={handleDownloadZip} disabled={zipping}>
            {zipping ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
            {zipping ? "Zipping…" : "Download ZIP"}
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {STACKS.map((s) => (
          <Button key={s} variant={stack === s ? "primary" : "outline"} size="sm" onClick={() => setStack(s)}>
            {s}
          </Button>
        ))}
      </div>

      <Card hover={false} className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
            <FolderTree size={14} className="text-accent" /> {stack}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(tree);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            className="focus-ring rounded p-1 text-text-tertiary hover:text-text-primary"
          >
            {copied ? <span className="text-[10px] text-accent-2">Copied</span> : <Copy size={13} />}
          </button>
        </div>
        <pre className="p-5 font-mono text-[12.5px] leading-relaxed text-text-secondary">{tree}</pre>
      </Card>
    </div>
  );
}
