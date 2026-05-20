export interface WorkItem {
  id: number;
  title: string;
  state: string;
  severity: string;
  priority: string;
  assignedTo: string;
  tags: string;
  iterationPath: string;
  piReleaseDate: string;
  areaPath: string;
  workItemType: string;
  createdDate: string;
  changedDate: string;
  description?: string;
  reproSteps?: string;
  acceptanceCriteria?: string;
  comments?: WorkItemComment[];
}

export interface WorkItemComment {
  id: number;
  text: string;
  createdBy: string;
  createdDate: string;
}

export interface QueryResult {
  workItems: WorkItem[];
  queryId: string;
  queryUrl: string;
  error?: string;
}

export interface KPIData {
  total: number;
  open: number;
  closed: number;
  critical: number;
  high: number;
  unassigned: number;
}

export interface MatrixCell {
  severity: string;
  state: string;
  count: number;
  items: WorkItem[];
}

export type TabId = 'overview' | 'gbf' | 'regression' | 'rve' | 'osl' | 'prior' | 'enhancements';

export interface TabConfig {
  id: TabId;
  label: string;
  queryEnvVar: string;
  description: string;
}

export const TABS: TabConfig[] = [
  { id: 'overview', label: 'Overview', queryEnvVar: '', description: 'Aggregated view across all queries' },
  { id: 'gbf', label: 'GBFs', queryEnvVar: 'ADO_QUERY_GBF', description: 'Go-Back Fixes' },
  { id: 'regression', label: 'Regression Bugs', queryEnvVar: 'ADO_QUERY_RW', description: 'Regression Work Items' },
  { id: 'rve', label: 'RVE Issues', queryEnvVar: 'ADO_QUERY_RVE', description: 'RVE Issues' },
  { id: 'osl', label: 'OSL Bugs & Enhancements', queryEnvVar: 'ADO_QUERY_OSL', description: 'OSL Bugs and Enhancements' },
  { id: 'prior', label: 'Prior Year Pending', queryEnvVar: 'ADO_QUERY_PRIOR', description: 'Prior Year Pending Items' },
  { id: 'enhancements', label: 'Enhancements', queryEnvVar: 'ADO_QUERY_ENH', description: 'Enhancement Requests' },
];

export const SEVERITY_ORDER = ['1 - Critical', '2 - High', '3 - Medium', '4 - Low', 'Not Set'];
export const CLOSED_STATES = ['Closed', 'Resolved', 'Done', 'Removed', 'Completed'];

export function isClosed(state: string): boolean {
  return CLOSED_STATES.some(s => s.toLowerCase() === state.toLowerCase());
}

export function getSeverityLabel(severity: string): string {
  if (!severity) return 'Not Set';
  return severity;
}

export function normalizeSeverity(severity: string): string {
  if (!severity || severity.trim() === '') return 'Not Set';
  return severity.trim();
}
