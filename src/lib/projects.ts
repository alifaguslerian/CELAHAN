import { isTicketId as isResourceId, isPositiveVersion, maxFindings, objectWith, text } from './consultation.ts';

export const reportFields = ['summary', 'scope', 'finding', 'impact', 'recommendation'] as const;
export const reportOverview = ['summary', 'scope'] as const;
export const findingFields = ['title', 'description', 'impact', 'recommendation'] as const;
export const findingPriorities = ['high', 'medium', 'low'] as const;
export type Finding = Record<typeof findingFields[number], string> & { priority: typeof findingPriorities[number] };
export type StructuredReport = Record<typeof reportOverview[number], string> & { findings: Finding[] };
export type ReportBody = StructuredReport | Record<typeof reportFields[number], string>;
export type ProjectStage = 'created' | 'preparing' | 'published';
export type ProjectEvent = 'created' | 'preparing' | 'published' | 'withdrawn';
export type ReportState = 'draft' | 'published' | 'superseded' | 'withdrawn';

export type ProjectCommand = { requestId: string } & (
  { kind: 'prepare' } |
  { kind: 'save'; reportId: string | null; revision: number; body: StructuredReport; changeNote: string } |
  { kind: 'publish'; reportId: string; revision: number } |
  { kind: 'withdraw'; reportId: string }
);

export function parseProjectCreation(value: unknown) {
  return objectWith(value, ['requestId', 'scopeVersion']) && isResourceId(value.requestId) && isPositiveVersion(value.scopeVersion)
    ? { scopeVersion: value.scopeVersion } : null;
}

function parseReport(value: unknown): StructuredReport | null {
  if (!objectWith(value, [...reportOverview, 'findings']) || !Array.isArray(value.findings)
    || !value.findings.length || value.findings.length > maxFindings) return null;
  const summary = text(value.summary, 1, 3000);
  const scope = text(value.scope, 1, 3000);
  const findings: Finding[] = [];
  for (const item of value.findings) {
    if (!objectWith(item, [...findingFields, 'priority'])) return null;
    const title = text(item.title, 1, 160);
    const description = text(item.description, 1, 3000);
    const impact = text(item.impact, 1, 3000);
    const recommendation = text(item.recommendation, 1, 3000);
    const priority = findingPriorities.find(option => option === item.priority);
    if (!title || !description || !impact || !recommendation || !priority) return null;
    findings.push({ title, description, impact, recommendation, priority });
  }
  return summary && scope ? { summary, scope, findings } : null;
}

export function parseProjectCommand(value: unknown): ProjectCommand | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const { kind, requestId } = input;
  if (!isResourceId(requestId)) return null;
  if (kind === 'prepare') return objectWith(input, ['kind', 'requestId']) ? { kind, requestId } : null;
  if (kind === 'withdraw') {
    return objectWith(input, ['kind', 'requestId', 'reportId']) && isResourceId(input.reportId)
      ? { kind, requestId, reportId: input.reportId } : null;
  }
  if (kind !== 'save' && kind !== 'publish') return null;
  const fields = kind === 'save' ? ['kind', 'requestId', 'reportId', 'revision', 'body', 'changeNote'] : ['kind', 'requestId', 'reportId', 'revision'];
  if (!objectWith(input, fields) || typeof input.revision !== 'number' || !Number.isInteger(input.revision)
    || input.revision < 0 || input.revision > 2147483647) return null;
  const { reportId, revision } = input;
  if (kind === 'publish') return revision > 0 && isResourceId(reportId) ? { kind, requestId, reportId, revision } : null;
  if (!(revision === 0 && reportId === null) && !(revision > 0 && isResourceId(reportId))) return null;
  const body = parseReport(input.body);
  const changeNote = text(input.changeNote, 0, 1000);
  return body && changeNote !== null ? { kind, requestId, reportId, revision, body, changeNote } : null;
}
