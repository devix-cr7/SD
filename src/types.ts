export type ToolId =
  | "dashboard"
  | "planner"
  | "database"
  | "api"
  | "ui-builder"
  | "architecture"
  | "folder-structure"
  | "documentation"
  | "flow-designer";

export interface NavItem {
  id: ToolId;
  label: string;
  group: "Overview" | "Design" | "Architecture" | "Output";
  icon: string; // lucide icon name key, resolved in Sidebar
  hint: string;
}

export interface Tab {
  id: ToolId;
  label: string;
  dirty?: boolean;
}

export interface Project {
  id: string;
  name: string;
  type: string;
  updatedAt: string;
  tables: number;
  endpoints: number;
  color: string;
}

export interface Column {
  id: string;
  name: string;
  type: string;
  pk?: boolean;
  nullable?: boolean;
  fk?: string; // "TableName.column"
}

export interface DbTable {
  id: string;
  name: string;
  columns: Column[];
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiParam {
  id: string;
  name: string;
  type: string;
  required?: boolean;
}

export interface ApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  summary: string;
  auth: boolean;
  params: ApiParam[];
}
