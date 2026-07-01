import { useMemo, useState } from "react";
import { Copy, FileText, Download } from "lucide-react";
import { Card, SectionHeading } from "../components/ui/Primitives";
import { useWorkspace } from "../store/workspace";
import { downloadTextFile } from "../lib/download";

export function Documentation() {
  const { projects, activeProjectId, tables, endpoints } = useWorkspace();
  const project = projects.find((p) => p.id === activeProjectId) ?? projects[0];
  const [copied, setCopied] = useState(false);

  const readme = useMemo(() => {
    const tableList = tables.map((t) => `- **${t.name}** — ${t.columns.length} columns`).join("\n");
    const endpointList = endpoints.map((e) => `- \`${e.method} ${e.path}\` — ${e.summary}`).join("\n");
    return `# ${project.name}

${project.type}

## Overview
This project was scoped with Full Stack Architect. It currently has ${tables.length} data models and ${endpoints.length} API endpoints defined.

## Data model
${tableList || "_No tables yet_"}

## API
${endpointList || "_No endpoints yet_"}

## Getting started
\`\`\`bash
npm install
npm run dev
\`\`\`

## License
Proprietary — all rights reserved.
`;
  }, [project, tables, endpoints]);

  return (
    <div>
      <SectionHeading
        eyebrow="Documentation"
        title="README & API docs"
        description="Generated live from your schema and endpoints — copy it straight into the repo."
      />

      <Card hover={false} className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
            <FileText size={14} className="text-accent" /> README.md
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                navigator.clipboard.writeText(readme);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }}
              className="focus-ring rounded p-1 text-text-tertiary hover:text-text-primary"
            >
              {copied ? <span className="text-[10px] text-accent-2">Copied</span> : <Copy size={13} />}
            </button>
            <button
              onClick={() => downloadTextFile("README.md", readme, "text/markdown")}
              className="focus-ring rounded p-1 text-text-tertiary hover:text-text-primary"
            >
              <Download size={13} />
            </button>
          </div>
        </div>
        <pre className="scrollbar-thin max-h-[600px] overflow-auto p-5 font-mono text-[12.5px] leading-relaxed text-text-secondary whitespace-pre-wrap">
          {readme}
        </pre>
      </Card>
    </div>
  );
}
