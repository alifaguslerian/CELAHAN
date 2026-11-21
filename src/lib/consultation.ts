import { isPackageCode, type PackageCode } from './packages.ts';

export const consultationNeeds = ['reactive', 'preventive', 'unsure_mixed'] as const;
export type Need = typeof consultationNeeds[number];
export type TicketView = 'owner' | 'admin';
export type TicketStatus = 'review' | 'awaiting_owner' | 'answered' | 'closed';
export type ScheduleState = 'proposed' | 'agreed' | 'confirmed';
type TextAction = 'reply' | 'clarify' | 'outcome' | 'close' | 'note';
export type TicketAction = TextAction | 'propose' | 'agree' | 'confirm' | 'accept_retest' | 'finish_retest';
export const retestResults = ['resolved_in_example', 'unresolved_in_example', 'not_verified'] as const;
export const scopeFields = ['title', 'included', 'excluded', 'deliverables'] as const;
export type ScopeAction = 'propose_scope' | 'approve_scope' | 'revise_scope';
export type ScopeContent = Record<typeof scopeFields[number], string>;
export type ScopeProposal = ScopeContent & {
  version: number; decision: 'approved' | 'changes_requested' | null;
  decision_note: string | null; proposed_at: string; decided_at: string | null;
};
export type RetestResult = typeof retestResults[number];
export const maxFindings = 6;
export type FindingOutcome = { finding: number; result: RetestResult };

export function findingNumbers(value: unknown): number[] | null {
  if (!Array.isArray(value) || !value.length || value.length > maxFindings
    || !value.every(item => isPositiveVersion(item) && item <= maxFindings)
    || new Set(value).size !== value.length) return null;
  return [...value].sort((a, b) => a - b);
}
export type ConversationEvent = {
  id: string; actor: TicketView; kind: Exclude<TicketAction, 'note'> | ScopeAction | 'created';
  body: string | null; created_at: string; schedule_at: string | null; schedule_zone: string | null;
};

export function ticketTimestamp(locale: 'id' | 'en', value: Date | string, zone = 'Asia/Jakarta') {
  const time = new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: zone,
  }).format(new Date(value));
  return `${time} · ${zone}`;
}

export type ConsultationInput = {
  requestId: string; name: string; company: string; website: string; need: Need;
  reason: string; description: string; authority: true; packageCode?: PackageCode;
};

type CommandBase = { requestId: string; version: number };
export type TicketCommand = CommandBase & (
  { kind: TextAction; body: string } |
  { kind: 'propose'; at: string; zone: string } |
  { kind: 'agree' | 'confirm' | 'accept_retest' } |
  ({ kind: 'finish_retest'; body: string } & ({ result: RetestResult; outcomes?: never } | { outcomes: FindingOutcome[]; result?: never })) |
  ({ kind: 'propose_scope' } & ScopeContent) |
  { kind: 'approve_scope'; scopeVersion: number } |
  { kind: 'revise_scope'; scopeVersion: number; body: string }
);

export type Schedule = { at: string; zone: string; state: ScheduleState; by: TicketView };
export type TicketWorkflow = { status: TicketStatus; outcome: string | null; schedule: Schedule | null };

export function isTicketId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(value);
}

export function objectWith(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key)));
}

export function text(value: unknown, min: number, max: number): string | null {
  if (typeof value !== 'string' || /[\p{Cc}\p{Cs}]/u.test(value.replace(/[\t\n\r]/g, ''))) return null;
  const normalized = value.trim();
  return normalized.length >= min && normalized.length <= max ? normalized : null;
}

export function isPositiveVersion(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 && value <= 2147483647;
}

export function consultationWebsite(value: unknown): string | null {
  const website = text(value, 1, 2048);
  if (!website || !/^https?:\/\/[^/]/i.test(website) || /[\s?#\\]/u.test(website)) return null;
  try {
    const address = new URL(website);
    return address.hostname && !address.username && !address.password && !website.split('/')[2].includes('@') ? website : null;
  } catch { return null; }
}

export function parseConsultation(value: unknown): ConsultationInput | null {
  const fields = ['requestId', 'name', 'company', 'website', 'need', 'reason', 'description', 'authority'];
  if (!objectWith(value, fields) && !objectWith(value, [...fields, 'packageCode'])) return null;
  const packageCode = isPackageCode(value.packageCode) ? value.packageCode : null;
  if (Object.hasOwn(value, 'packageCode') && !packageCode) return null;
  const { requestId, need, authority } = value;
  const name = text(value.name, 2, 80);
  const company = text(value.company, 0, 120);
  const website = consultationWebsite(value.website);
  const reason = text(value.reason, 1, 160);
  const description = text(value.description, 10, 3000);
  if (!isTicketId(requestId) || authority !== true || !name || company === null || !website || !reason || !description
    || typeof need !== 'string' || !consultationNeeds.some(option => option === need)) return null;
  return { requestId, name, company, website, need: need as Need, reason, description, authority, ...(packageCode && { packageCode }) };
}

export function scheduleInstant(wallTime: unknown, zone: unknown): string | null {
  if (typeof wallTime !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(wallTime)
    || typeof zone !== 'string' || zone.length > 64 || !/^(UTC|[A-Za-z_]+(?:\/[A-Za-z0-9_+-]+)+)$/.test(zone)) return null;
  const naive = Date.parse(`${wallTime}:00Z`);
  if (!Number.isFinite(naive) || new Date(naive).toISOString().slice(0, 16) !== wallTime) return null;
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: zone, calendar: 'gregory', numberingSystem: 'latn', hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
    });
    const local = (instant: number) => {
      const parts = Object.fromEntries(formatter.formatToParts(instant).map(({ type, value }) => [type, value]));
      return `${parts.year.padStart(4, '0')}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
    };
    const day = 86_400_000;
    const candidates = new Set([naive - day, naive, naive + day].map(sample => naive - (Date.parse(`${local(sample)}:00Z`) - sample)));
    const matches = [...candidates].filter(candidate => local(candidate) === wallTime);
    return matches.length === 1 ? new Date(matches[0]).toISOString() : null;
  } catch { return null; }
}

export function parseTicketCommand(value: unknown): TicketCommand | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const { requestId, version, kind } = value as Record<string, unknown>;
  if (!isTicketId(requestId) || !isPositiveVersion(version)) return null;
  const base = ['requestId', 'version', 'kind'];
  switch (kind) {
    case 'propose_scope': {
      if (!objectWith(value, [...base, ...scopeFields])) return null;
      const title = text(value.title, 2, 120);
      const included = text(value.included, 10, 2000);
      const excluded = text(value.excluded, 1, 2000);
      const deliverables = text(value.deliverables, 1, 2000);
      return title && included && excluded && deliverables ? { requestId, version, kind, title, included, excluded, deliverables } : null;
    }
    case 'approve_scope':
      return objectWith(value, [...base, 'scopeVersion']) && isPositiveVersion(value.scopeVersion)
        ? { requestId, version, kind, scopeVersion: value.scopeVersion } : null;
    case 'revise_scope': {
      if (!objectWith(value, [...base, 'scopeVersion', 'body']) || !isPositiveVersion(value.scopeVersion)) return null;
      const body = text(value.body, 1, 3000);
      return body ? { requestId, version, kind, scopeVersion: value.scopeVersion, body } : null;
    }
    case 'reply': case 'clarify': case 'outcome': case 'close': case 'note': {
      if (!objectWith(value, [...base, 'body'])) return null;
      const body = text(value.body, 1, 3000);
      return body ? { requestId, version, kind, body } : null;
    }
    case 'propose': {
      if (!objectWith(value, [...base, 'wallTime', 'zone'])) return null;
      const at = scheduleInstant(value.wallTime, value.zone);
      return at && typeof value.zone === 'string' ? { requestId, version, kind, at, zone: value.zone } : null;
    }
    case 'finish_retest': {
      if (!objectWith(value, [...base, 'result', 'body']) && !objectWith(value, [...base, 'outcomes', 'body'])) return null;
      const body = text(value.body, 1, 3000);
      if (!body) return null;
      if (Object.hasOwn(value, 'outcomes')) {
        if (!Array.isArray(value.outcomes) || value.outcomes.length > maxFindings) return null;
        const outcomes: FindingOutcome[] = [];
        for (const item of value.outcomes) {
          if (!objectWith(item, ['finding', 'result']) || !isPositiveVersion(item.finding)) return null;
          const result = retestResults.find(option => option === item.result);
          if (!result) return null;
          outcomes.push({ finding: item.finding, result });
        }
        return findingNumbers(outcomes.map(item => item.finding))
          ? { requestId, version, kind, body, outcomes: outcomes.sort((a, b) => a.finding - b.finding) } : null;
      }
      const result = retestResults.find(option => option === value.result);
      return result ? { requestId, version, kind, result, body } : null;
    }
    case 'agree': case 'confirm': case 'accept_retest':
      return objectWith(value, base) ? { requestId, version, kind } : null;
    default: return null;
  }
}

export function ticketActions(ticket: TicketWorkflow, view: TicketView): TicketAction[] {
  if (ticket.status === 'closed') return [];
  const actions: TicketAction[] = ['reply'];
  if (view === 'admin') actions.push('clarify', 'outcome', 'note', 'close');
  if (ticket.outcome && ticket.schedule?.state !== 'confirmed') actions.push('propose');
  if (view === 'owner' && ticket.schedule?.state === 'proposed' && ticket.schedule.by === 'admin') actions.push('agree');
  if (view === 'admin' && (ticket.schedule?.state === 'agreed'
    || (ticket.schedule?.state === 'proposed' && ticket.schedule.by === 'owner'))) actions.push('confirm');
  return actions;
}

export function ticketPage(value: unknown): number {
  return typeof value === 'string' && /^[1-9]\d{0,2}$/.test(value) ? Number(value) : 1;
}
