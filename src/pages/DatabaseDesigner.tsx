import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, KeyRound, Link2, Download, Copy } from "lucide-react";
import { Card, Button, SectionHeading, Badge } from "../components/ui/Primitives";
import { useWorkspace } from "../store/workspace";
import { downloadTextFile } from "../lib/download";
import type { Column } from "../types";

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function toSql(tables: ReturnType<typeof useWorkspace.getState>["tables"]) {
  return tables
    .map((t) => {
      const cols = t.columns
        .map((c) => {
          let line = `  ${c.name} ${c.type}`;
          if (c.pk) line += " PRIMARY KEY";
          if (!c.nullable && !c.pk) line += " NOT NULL";
          if (c.fk) line += ` REFERENCES ${c.fk.split(".")[0]}(${c.fk.split(".")[1]})`;
          return line;
        })
        .join(",\n");
      return `CREATE TABLE ${t.name} (\n${cols}\n);`;
    })
    .join("\n\n");
}

function toPrisma(tables: ReturnType<typeof useWorkspace.getState>["tables"]) {
  return tables
    .map((t) => {
      const cols = t.columns
        .map((c) => {
          const typeMap: Record<string, string> = {
            uuid: "String", text: "String", timestamp: "DateTime", boolean: "Boolean",
          };
          let type = typeMap[c.type] ?? (c.type.startsWith("varchar") || c.type.startsWith("numeric") ? "String" : "String");
          if (c.type.startsWith("numeric") || c.type === "int" || c.type === "integer") type = "Int";
          let line = `  ${c.name} ${type}`;
          if (c.pk) line += " @id @default(uuid())";
          return line;
        })
        .join("\n");
      return `model ${t.name[0].toUpperCase() + t.name.slice(1)} {\n${cols}\n}`;
    })
    .join("\n\n");
}

const COLUMN_TYPES = ["uuid", "varchar(255)", "text", "int", "numeric(10,2)", "boolean", "timestamp", "jsonb"];

export function DatabaseDesigner() {
  const { tables, addTable, updateTable, removeTable } = useWorkspace();
  const [exportMode, setExportMode] = useState<"sql" | "prisma">("sql");
  const [copied, setCopied] = useState(false);

  const exportText = useMemo(
    () => (exportMode === "sql" ? toSql(tables) : toPrisma(tables)),
    [tables, exportMode]
  );

  const handleAddTable = () => {
    addTable({
      id: genId(),
      name: `table_${tables.length + 1}`,
      columns: [{ id: genId(), name: "id", type: "uuid", pk: true }],
    });
  };

  const handleAddColumn = (tableId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;
    updateTable(tableId, {
      columns: [...table.columns, { id: genId(), name: "new_column", type: "varchar(255)" }],
    });
  };

  const updateColumn = (tableId: string, colId: string, patch: Partial<Column>) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;
    updateTable(tableId, {
      columns: table.columns.map((c) => (c.id === colId ? { ...c, ...patch } : c)),
    });
  };

  const removeColumn = (tableId: string, colId: string) => {
    const table = tables.find((t) => t.id === tableId);
    if (!table) return;
    updateTable(tableId, { columns: table.columns.filter((c) => c.id !== colId) });
  };

  return (
    <div>
      <SectionHeading
        eyebrow="Database Designer"
        title="Model your schema"
        description="Tables, columns and relationships — exported to SQL or Prisma on demand."
        action={
          <Button variant="primary" onClick={handleAddTable}>
            <Plus size={15} /> New table
          </Button>
        }
      />

      <div className="grid grid-cols-[1fr_360px] gap-6">
        <div className="space-y-4">
          <AnimatePresence>
            {tables.map((table) => (
              <motion.div
                key={table.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                <Card hover={false} className="p-0 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-border bg-elevated/30 px-4 py-2.5">
                    <input
                      value={table.name}
                      onChange={(e) => updateTable(table.id, { name: e.target.value })}
                      className="focus-ring rounded bg-transparent font-mono text-sm font-medium text-accent-2"
                    />
                    <div className="flex items-center gap-1.5">
                      <Badge>{table.columns.length} cols</Badge>
                      <button
                        onClick={() => removeTable(table.id)}
                        className="focus-ring rounded p-1.5 text-text-tertiary transition-colors duration-150 hover:bg-rose/10 hover:text-rose"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-border-soft">
                    {table.columns.map((col) => (
                      <div key={col.id} className="flex items-center gap-2 px-4 py-2 text-xs">
                        <button
                          onClick={() => updateColumn(table.id, col.id, { pk: !col.pk })}
                          className={`focus-ring rounded p-1 ${col.pk ? "text-amber" : "text-text-tertiary hover:text-text-secondary"}`}
                          title="Primary key"
                        >
                          <KeyRound size={12} />
                        </button>
                        <input
                          value={col.name}
                          onChange={(e) => updateColumn(table.id, col.id, { name: e.target.value })}
                          className="focus-ring w-32 rounded bg-transparent font-mono text-text-primary"
                        />
                        <select
                          value={col.type}
                          onChange={(e) => updateColumn(table.id, col.id, { type: e.target.value })}
                          className="focus-ring rounded border border-border bg-panel px-1.5 py-1 font-mono text-text-secondary"
                        >
                          {COLUMN_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        {col.fk && (
                          <span className="flex items-center gap-1 text-text-tertiary">
                            <Link2 size={11} /> {col.fk}
                          </span>
                        )}
                        <button
                          onClick={() => removeColumn(table.id, col.id)}
                          className="focus-ring ml-auto rounded p-1 text-text-tertiary transition-colors duration-150 hover:text-rose"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleAddColumn(table.id)}
                    className="focus-ring flex w-full items-center gap-1.5 px-4 py-2 text-xs text-text-tertiary transition-colors duration-150 hover:bg-elevated/40 hover:text-text-secondary"
                  >
                    <Plus size={12} /> Add column
                  </button>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Card hover={false} className="sticky top-0 flex h-fit flex-col p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div className="flex gap-1 rounded-lg bg-elevated/60 p-0.5">
              {(["sql", "prisma"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setExportMode(m)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors duration-150 ${
                    exportMode === m ? "bg-accent text-[#0a0a10]" : "text-text-secondary"
                  }`}
                >
                  {m === "sql" ? "SQL" : "Prisma"}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }}
                className="focus-ring rounded p-1.5 text-text-tertiary transition-colors duration-150 hover:bg-elevated/60 hover:text-text-primary"
              >
                {copied ? <span className="text-[10px] text-accent-2">Copied</span> : <Copy size={13} />}
              </button>
              <button
                onClick={() =>
                  downloadTextFile(
                    exportMode === "sql" ? "schema.sql" : "schema.prisma",
                    exportText,
                    "text/plain"
                  )
                }
                className="focus-ring rounded p-1.5 text-text-tertiary transition-colors duration-150 hover:bg-elevated/60 hover:text-text-primary"
              >
                <Download size={13} />
              </button>
            </div>
          </div>
          <pre className="scrollbar-thin max-h-[560px] overflow-auto p-4 font-mono text-[11.5px] leading-relaxed text-text-secondary">
            {exportText}
          </pre>
        </Card>
      </div>
    </div>
  );
}
