import { isTicketId, objectWith, text, type TicketView } from './consultation.ts';

export type FollowUpKind = 'question' | 'retest';
export type RetestState = 'pending' | 'accepted' | 'completed' | 'canceled';
export type FollowUpInput = { requestId: string; reportId: string; kind: FollowUpKind; body: string };

export function parseFollowUp(value: unknown): FollowUpInput | null {
  if (!objectWith(value, ['requestId', 'reportId', 'kind', 'body'])) return null;
  const { requestId, reportId, kind } = value;
  const body = text(value.body, 10, 3000);
  if (!isTicketId(requestId) || !isTicketId(reportId) || (kind !== 'question' && kind !== 'retest') || !body) return null;
  return { requestId, reportId, kind, body };
}

export function followUpActions(state: RetestState | null, view: TicketView, reviewable: boolean) {
  if (view !== 'admin' || !reviewable) return [];
  if (state === 'pending') return ['accept_retest'] as const;
  if (state === 'accepted') return ['finish_retest'] as const;
  return [];
}
