import { isTicketId as isResourceId, objectWith, text } from './consultation.ts';

export const reportFields = ['summary', 'scope', 'finding', 'impact', 'recommendation'] as const;
export type ReportBody = Record<typeof reportFields[number], string>;
export type ProjectStage = 'created' | 'preparing' | 'published';
export type ProjectEvent = 'created' | 'preparing' | 'published' | 'withdrawn';
export type ReportState = 'draft' | 'published' | 'superseded' | 'withdrawn';

export type ProjectCommand = { requestId: string } & (
  { kind: 'prepare' } |
  { kind: 'save'; reportId: string | null; revision: number; body: ReportBody; changeNote: string } |
  { kind: 'publish'; reportId: string; revision: number } |
  { kind: 'withdraw'; reportId: string }
);

export function parseProjectCreation(value: unknown) {
  if (!objectWith(value, ['requestId', 'title', 'scope', 'agreed']) || !isResourceId(value.requestId) || value.agreed !== true) return null;
  const title = text(value.title, 2, 120);
  const scope = text(value.scope, 10, 2000);
  return title && scope ? { title, scope } : null;
}

function parseReport(value: unknown): ReportBody | null {
  if (!objectWith(value, reportFields)) return null;
  const summary = text(value.summary, 1, 3000);
  const scope = text(value.scope, 1, 3000);
  const finding = text(value.finding, 1, 3000);
  const impact = text(value.impact, 1, 3000);
  const recommendation = text(value.recommendation, 1, 3000);
  return summary && scope && finding && impact && recommendation ? { summary, scope, finding, impact, recommendation } : null;
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
