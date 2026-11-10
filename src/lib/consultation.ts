export const consultationNeeds = ['reactive', 'preventive', 'unsure_mixed'] as const;
export type Need = typeof consultationNeeds[number];
export type TicketView = 'owner' | 'admin';
export type TicketStatus = 'review' | 'awaiting_owner' | 'answered' | 'closed';
export type ScheduleState = 'proposed' | 'agreed' | 'confirmed';
type TextAction = 'reply' | 'clarify' | 'outcome' | 'close' | 'note';
export type TicketAction = TextAction | 'propose' | 'agree' | 'confirm';

export type ConsultationInput = {
  requestId: string; name: string; company: string; website: string; need: Need;
  reason: string; description: string; authority: true;
};

type CommandBase = { requestId: string; version: number };
export type TicketCommand = CommandBase & (
  { kind: TextAction; body: string } |
  { kind: 'propose'; at: string; zone: string } |
  { kind: 'agree' | 'confirm' }
);

export type Schedule = { at: string; zone: string; state: ScheduleState; by: TicketView };
export type TicketWorkflow = { status: TicketStatus; outcome: string | null; schedule: Schedule | null };

export function isTicketId(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(value);
}

function objectWith(value: unknown, keys: readonly string[]): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key)));
}

function text(value: unknown, min: number, max: number): string | null {
  if (typeof value !== 'string' || /[\p{Cc}\p{Cs}]/u.test(value.replace(/[\t\n\r]/g, ''))) return null;
  const normalized = value.trim();
  return normalized.length >= min && normalized.length <= max ? normalized : null;
}

export function parseConsultation(value: unknown): ConsultationInput | null {
  if (!objectWith(value, ['requestId', 'name', 'company', 'website', 'need', 'reason', 'description', 'authority'])) return null;
  const { requestId, need, authority } = value;
  const name = text(value.name, 2, 80);
  const company = text(value.company, 0, 120);
  const website = text(value.website, 1, 2048);
  const reason = text(value.reason, 1, 160);
  const description = text(value.description, 10, 3000);
  if (!isTicketId(requestId) || authority !== true || !name || company === null || !website || !reason || !description
    || typeof need !== 'string' || !consultationNeeds.some(option => option === need)
    || !/^https?:\/\/[^/]/i.test(website) || /[\s?#\\]/u.test(website)) return null;
  try {
    const address = new URL(website);
    if (!address.hostname || address.username || address.password || website.split('/')[2].includes('@')) return null;
  } catch { return null; }
  return { requestId, name, company, website, need: need as Need, reason, description, authority };
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
  if (!isTicketId(requestId) || typeof version !== 'number' || !Number.isInteger(version) || version < 1 || version > 2147483647) return null;
  const base = ['requestId', 'version', 'kind'];
  switch (kind) {
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
    case 'agree': case 'confirm':
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
