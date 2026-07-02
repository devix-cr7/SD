import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Lock, Unlock, Copy, Download } from "lucide-react";
import { Card, Button, SectionHeading, Badge } from "../components/ui/Primitives";
import { useWorkspace } from "../store/workspace";
import { downloadTextFile } from "../lib/download";
import { useT } from "../i18n";
import type { HttpMethod } from "../types";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const METHOD_TONE: Record<HttpMethod, "accent" | "teal" | "amber" | "rose"> = {
  GET: "teal", POST: "accent", PUT: "amber", PATCH: "amber", DELETE: "rose",
};

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function toOpenApi(endpoints: ReturnType<typeof useWorkspace.getState>["endpoints"]) {
  const paths: Record<string, any> = {};
  endpoints.forEach((e) => {
    paths[e.path] = {
      ...(paths[e.path] ?? {}),
      [e.method.toLowerCase()]: {
        summary: e.summary,
        security: e.auth ? [{ bearerAuth: [] }] : [],
        parameters: e.params.map((p) => ({ name: p.name, required: !!p.required, schema: { type: p.type } })),
      },
    };
  });
  return JSON.stringify({ openapi: "3.0.3", info: { title: "API", version: "1.0.0" }, paths }, null, 2);
}

export function ApiDesigner() {
  const { endpoints, addEndpoint, updateEndpoint, removeEndpoint } = useWorkspace();
  const t = useT();
  const [selectedId, setSelectedId] = useState(endpoints[0]?.id);
  const [copied, setCopied] = useState(false);
  const selected = endpoints.find((e) => e.id === selectedId) ?? endpoints[0];
  const openApiText = useMemo(() => toOpenApi(endpoints), [endpoints]);

  const handleAdd = () => {
    const e = { id: genId(), method: "GET" as HttpMethod, path: "/api/resource", summary: "New endpoint", auth: false, params: [] };
    addEndpoint(e);
    setSelectedId(e.id);
  };

  return (
    <div>
      <SectionHeading
        eyebrow={t("api_eyebrow")}
        title={t("api_title")}
        description={t("api_desc")}
        action={<Button variant="primary" onClick={handleAdd}><Plus size={15} /> {t("api_newEndpoint")}</Button>}
      />

      <div className="grid grid-cols-[300px_1fr_320px] gap-6">
        <Card hover={false} className="p-0 overflow-hidden">
          <div className="border-b border-border px-3 py-2 text-xs font-medium text-text-secondary">{t("api_endpointsPanel")}</div>
          <div className="scrollbar-thin max-h-[560px] overflow-y-auto">
            <AnimatePresence>
              {endpoints.map((e) => (
                <motion.button
                  key={e.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedId(e.id)}
                  className={`flex w-full items-center gap-2 border-b border-border-soft px-3 py-2.5 text-left transition-colors duration-150 ${
                    selectedId === e.id ? "bg-accent-soft" : "hover:bg-elevated/40"
                  }`}
                >
                  <Badge tone={METHOD_TONE[e.method]}>{e.method}</Badge>
                  <span className="truncate font-mono text-xs text-text-primary">{e.path}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </Card>

        {selected ? (
          <Card hover={false} className="p-5">
            <div className="flex items-center gap-2">
              <select
                value={selected.method}
                onChange={(e) => updateEndpoint(selected.id, { method: e.target.value as HttpMethod })}
                className="focus-ring rounded-lg border border-border bg-elevated px-2 py-1.5 font-mono text-xs text-text-primary"
              >
                {METHODS.map((m) => <option key={m}>{m}</option>)}
              </select>
              <input
                value={selected.path}
                onChange={(e) => updateEndpoint(selected.id, { path: e.target.value })}
                className="focus-ring flex-1 rounded-lg border border-border bg-elevated/50 px-3 py-1.5 font-mono text-sm text-text-primary"
              />
              <button
                onClick={() => removeEndpoint(selected.id)}
                className="focus-ring rounded-lg p-2 text-text-tertiary transition-colors duration-150 hover:bg-rose/10 hover:text-rose"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <input
              value={selected.summary}
              onChange={(e) => updateEndpoint(selected.id, { summary: e.target.value })}
              placeholder={t("api_summaryPlaceholder")}
              className="focus-ring mt-3 w-full rounded-lg border border-border bg-elevated/30 px-3 py-1.5 text-sm text-text-secondary"
            />

            <button
              onClick={() => updateEndpoint(selected.id, { auth: !selected.auth })}
              className={`focus-ring mt-3 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors duration-150 ${
                selected.auth ? "border-accent/40 bg-accent-soft text-accent" : "border-border text-text-secondary"
              }`}
            >
              {selected.auth ? <Lock size={12} /> : <Unlock size={12} />}
              {selected.auth ? t("api_requiresAuth") : t("api_public")}
            </button>

            <div className="mt-5 flex items-center justify-between">
              <div className="text-xs font-medium text-text-secondary">{t("api_parameters")}</div>
              <button
                onClick={() =>
                  updateEndpoint(selected.id, {
                    params: [...selected.params, { id: genId(), name: "param", type: "string" }],
                  })
                }
                className="focus-ring flex items-center gap-1 text-xs text-accent hover:text-accent/80"
              >
                <Plus size={12} /> {t("api_add")}
              </button>
            </div>
            <div className="mt-2 space-y-1.5">
              {selected.params.map((p) => (
                <div key={p.id} className="flex items-center gap-2 rounded-lg border border-border bg-elevated/20 px-2.5 py-1.5 text-xs">
                  <input
                    value={p.name}
                    onChange={(e) =>
                      updateEndpoint(selected.id, {
                        params: selected.params.map((pp) => (pp.id === p.id ? { ...pp, name: e.target.value } : pp)),
                      })
                    }
                    className="focus-ring w-28 rounded bg-transparent font-mono text-text-primary"
                  />
                  <span className="font-mono text-text-tertiary">{p.type}</span>
                  <Badge tone={p.required ? "amber" : "neutral"} className="ml-auto">
                    {p.required ? t("api_required") : t("api_optional")}
                  </Badge>
                </div>
              ))}
              {selected.params.length === 0 && (
                <div className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-xs text-text-tertiary">
                  {t("api_noParams")}
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card hover={false} className="flex items-center justify-center p-10 text-sm text-text-tertiary">
            {t("api_selectOrCreate")}
          </Card>
        )}

        <Card hover={false} className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="text-xs font-medium text-text-secondary">{t("api_openApiPreview")}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(openApiText);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }}
                className="focus-ring rounded p-1 text-text-tertiary hover:text-text-primary"
              >
                {copied ? <span className="text-[10px] text-accent-2">{t("db_copied")}</span> : <Copy size={12} />}
              </button>
              <button
                onClick={() => downloadTextFile("openapi.json", openApiText, "application/json")}
                className="focus-ring rounded p-1 text-text-tertiary hover:text-text-primary"
              >
                <Download size={12} />
              </button>
            </div>
          </div>
          <pre className="scrollbar-thin max-h-[560px] overflow-auto p-4 font-mono text-[11px] leading-relaxed text-text-secondary">
            {openApiText}
          </pre>
        </Card>
      </div>
    </div>
  );
}
