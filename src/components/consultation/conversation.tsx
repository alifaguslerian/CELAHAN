'use client';

import Link from 'next/link';
import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import { consultationCopy } from '@/content/consultation';
import { followUpCopy } from '@/content/follow-up';
import { ticketTimestamp, type ConversationEvent } from '@/lib/consultation';
import { TicketActionForm } from './forms';

type Props = Omit<ComponentProps<typeof TicketActionForm>, 'replyVersion'> & {
  events: ConversationEvent[]; live: boolean; olderHref: string | null; pagination: ReactNode;
};

export function TicketConversation({ events, live, olderHref, pagination, ...form }: Props) {
  const { accountId, endpoint, locale, version } = form;
  const [updates, setUpdates] = useState<{ events: ConversationEvent[]; version: number; interrupted: boolean }>({
    events: [], version: 0, interrupted: false,
  });
  const initialCursor = events.at(-1)?.id ?? '0';
  useEffect(() => {
    if (!live) return;
    let after = initialCursor;
    let timer: ReturnType<typeof setTimeout>;
    let current: AbortController | null = null;
    let disposed = false;
    let halted = false;

    async function check() {
      if (disposed || halted || current || document.hidden) return;
      const request = new AbortController();
      current = request;
      let delay = 4000;
      try {
        const response = await fetch(endpoint, {
          cache: 'no-store', redirect: 'error', signal: AbortSignal.any([request.signal, AbortSignal.timeout(8000)]),
          headers: { 'X-Celahan-Account': accountId, 'X-Celahan-Event-After': after },
        });
        if ([401, 403, 404].includes(response.status)) halted = true;
        if (!response.ok) throw new Error('Ticket updates unavailable');
        const batch = await response.json() as { events: ConversationEvent[]; version: number };
        if (disposed || request.signal.aborted) return;
        after = batch.events.at(-1)?.id ?? after;
        if (batch.events.length === 30) delay = 200;
        if (batch.events.some(event => event.kind === 'close')) halted = true;
        setUpdates(previous => {
          const version = batch.events.length < 30 ? batch.version : previous.version;
          if (!batch.events.length && version === previous.version && !previous.interrupted) return previous;
          const byId = new Map([...previous.events, ...batch.events].map(event => [event.id, event]));
          return {
            events: [...byId.values()].sort((a, b) => BigInt(a.id) < BigInt(b.id) ? -1 : 1).slice(-31),
            version,
            interrupted: false,
          };
        });
      } catch {
        delay = 12000;
        if (!disposed && !request.signal.aborted) setUpdates(previous => ({ ...previous, interrupted: true }));
      } finally {
        current = null;
        if (!disposed && !halted && !document.hidden) timer = setTimeout(check, request.signal.aborted ? 0 : delay);
      }
    }
    function onVisibility() {
      clearTimeout(timer);
      if (document.hidden) current?.abort();
      else void check();
    }
    timer = setTimeout(check, 1500);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      disposed = true;
      clearTimeout(timer);
      current?.abort();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [accountId, endpoint, initialCursor, live]);

  const copy = consultationCopy[locale];
  const newEvents = live ? updates.events.filter(event => BigInt(event.id) > BigInt(initialCursor)) : [];
  const recent = [...events, ...newEvents];
  return <>
    <ol className="ticket-events" aria-live={live ? 'polite' : undefined} aria-relevant="additions">
      {recent.slice(-30).map(event => <li key={event.id}>
        <div><strong>{copy.event[event.kind]}</strong><span>{copy.people[event.actor]} · <time dateTime={event.created_at}>{ticketTimestamp(locale, event.created_at)}</time></span></div>
        {event.body && <p className="ticket-text">{event.body}</p>}
        {event.schedule_at && event.schedule_zone && <p>{ticketTimestamp(locale, event.schedule_at, event.schedule_zone)}</p>}
      </li>)}
    </ol>
    {pagination ?? (recent.length > 30 && olderHref && <p className="page-actions"><Link prefetch={false} href={olderHref}>{copy.next}</Link></p>)}
    {live && updates.interrupted && <p role="status" className="supporting-copy">{followUpCopy[locale].liveInterrupted}</p>}
    {form.actions.length > 0 && <TicketActionForm {...form} replyVersion={live ? Math.max(version, updates.version) : version} />}
  </>;
}
