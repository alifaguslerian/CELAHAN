'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { consultationCopy } from '@/content/consultation';
import { disclaimer } from '@/content/shell';
import { consultationNeeds, isTicketId, type TicketAction } from '@/lib/consultation';
import type { Locale } from '@/lib/routing';

const subscribe = () => () => {};
const zones = ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura', 'UTC'];

function useTicketSubmission(locale: Locale, accountId: string, endpoint: string) {
  const copy = consultationCopy[locale];
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const busy = useRef(false);
  const dirty = useRef(false);
  const status = useRef<HTMLParagraphElement>(null);
  const attempt = useRef<{ body: string; id: string } | null>(null);

  useEffect(() => {
    const beforeLeave = (event: BeforeUnloadEvent) => { if (dirty.current) event.preventDefault(); };
    const beforeLink = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      if (!dirty.current || !link?.href || link.target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href);
      if (url.pathname === location.pathname && url.search === location.search && url.origin === location.origin && url.hash) return;
      if (!window.confirm(copy.discard)) { event.preventDefault(); event.stopPropagation(); }
      else dirty.current = false;
    };
    window.addEventListener('beforeunload', beforeLeave);
    document.addEventListener('click', beforeLink, true);
    return () => { window.removeEventListener('beforeunload', beforeLeave); document.removeEventListener('click', beforeLink, true); };
  }, [copy.discard]);

  async function submit(payload: Record<string, unknown>, complete: (data: Record<string, unknown>) => void, conflict?: () => void, successFocus?: string) {
    if (busy.current || !hydrated) return;
    busy.current = true;
    setPending(true);
    setMessage('');
    let saved = false;
    try {
      const body = JSON.stringify(payload);
      if (attempt.current?.body !== body) attempt.current = { body, id: crypto.randomUUID() };
      const response = await fetch(endpoint, {
        method: 'POST', cache: 'no-store', redirect: 'error',
        headers: { 'Content-Type': 'application/json', 'X-Celahan-Account': accountId },
        body: JSON.stringify({ ...payload, requestId: attempt.current.id }),
      });
      const data = await response.json();
      if (!response.ok) {
        const code = typeof data.error === 'string' && Object.hasOwn(copy.errors, data.error) ? data.error as keyof typeof copy.errors : 'UNAVAILABLE';
        setFailed(true);
        setMessage(copy.errors[code]);
        if (code === 'CONFLICT') conflict?.();
        return;
      }
      complete(data);
      saved = true;
      dirty.current = false;
      attempt.current = null;
      setFailed(false);
      setMessage(copy.saved);
    } catch {
      setFailed(true);
      setMessage(copy.errors.UNAVAILABLE);
    } finally {
      busy.current = false;
      setPending(false);
      requestAnimationFrame(() => (saved && successFocus ? document.getElementById(successFocus) : status.current)?.focus());
    }
  }

  function discardDraft() {
    if (dirty.current && !window.confirm(copy.discard)) return false;
    dirty.current = false;
    return true;
  }

  return { disabled: pending || !hydrated, pending, submit, discardDraft,
    markDirty: () => { dirty.current = true; }, clearDraft: () => { dirty.current = false; },
    feedback: <p className="form-status" tabIndex={-1} ref={status} role={failed ? 'alert' : 'status'}>{message}</p> };
}

export function ConsultationForm({ locale, name, accountId }: { locale: Locale; name: string; accountId: string }) {
  const copy = consultationCopy[locale];
  const write = useTicketSubmission(locale, accountId, '/api/tickets/');

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    void write.submit({ ...Object.fromEntries(data), authority: data.get('authority') === 'on' }, result => {
      if (!isTicketId(result.id)) throw new Error('Unexpected ticket response');
      write.clearDraft();
      window.location.assign(`/${locale}/tickets/${result.id}/`);
    });
  }

  return <form method="post" action="/api/tickets/" onSubmit={onSubmit} className="consultation-form">
    <fieldset disabled={write.disabled} onChange={write.markDirty}>
      <div className="consultation-fields">
        <label>{copy.name}<input name="name" defaultValue={name} required minLength={2} maxLength={80} /></label>
        <label>{copy.company}<input name="company" maxLength={120} /></label>
      </div>
      <label>{copy.website}<input name="website" type="url" placeholder="https://demo.example.invalid" required maxLength={2048} /></label>
      <div className="consultation-fields">
        <label>{copy.need}<select name="need" defaultValue="unsure_mixed">{consultationNeeds.map(need => <option key={need} value={need}>{copy.needs[need]}</option>)}</select></label>
        <label>{copy.reason}<input name="reason" required maxLength={160} /></label>
      </div>
      <label>{copy.description}<textarea name="description" required minLength={10} maxLength={3000} rows={5} /></label>
      <label className="consultation-check"><input name="authority" type="checkbox" required />{copy.authority}</label>
      <p className="disclaimer" lang="id">{disclaimer.id}</p>
      {locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}
      <button className="primary-action" type="submit">{write.pending ? copy.save : copy.send}</button>
    </fieldset>
    {write.feedback}
    <noscript><p>{copy.js}</p></noscript>
  </form>;
}

export function TicketActionForm({ locale, accountId, endpoint, version, actions, recommended, scheduleLabel }: {
  locale: Locale; accountId: string; endpoint: string; version: number; actions: TicketAction[]; recommended: TicketAction; scheduleLabel: string | null;
}) {
  const copy = consultationCopy[locale];
  const router = useRouter();
  const write = useTicketSubmission(locale, accountId, endpoint);
  const [choice, setChoice] = useState<TicketAction | null>(null);
  const action = choice && actions.includes(choice) ? choice : recommended;
  const form = useRef<HTMLFormElement>(null);
  const bodyLabel = action in copy.bodies ? copy.bodies[action as keyof typeof copy.bodies] : null;
  const localZone = useSyncExternalStore(subscribe, () => Intl.DateTimeFormat().resolvedOptions().timeZone, () => 'Asia/Jakarta');
  const zoneOptions = [...new Set([...zones, localZone])];

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = action === 'propose' ? { wallTime: data.get('wallTime'), zone: data.get('zone') } : bodyLabel ? { body: data.get('body') } : {};
    void write.submit({ kind: action, version, ...payload }, () => {
      form.current?.reset();
      setChoice(null);
      router.refresh();
    }, () => router.refresh(), action === 'close' ? 'ticket-next' : undefined);
  }

  return <form ref={form} id="ticket-action" method="post" action={endpoint} className="consultation-form" onSubmit={onSubmit}>
    <fieldset disabled={write.disabled}>
      <label>{copy.action}<select value={action} onChange={event => {
        if (write.discardDraft()) setChoice(event.target.value as TicketAction);
      }}>{actions.map(item => <option key={item} value={item}>{copy.actions[item]}</option>)}</select></label>
      {bodyLabel && <label key={action}>{bodyLabel}<textarea name="body" required maxLength={3000} rows={4} aria-describedby="ticket-visibility" onChange={write.markDirty} />
        <span id="ticket-visibility" className="supporting-copy">{action === 'note' ? copy.privateHint : copy.sharedHint}</span>
      </label>}
      {action === 'propose' && <>
        <div className="consultation-fields" onChange={write.markDirty}>
          <label>{copy.when}<input type="datetime-local" name="wallTime" required /></label>
          <label>{copy.zone}<select name="zone" defaultValue="Asia/Jakarta">{zoneOptions.map(zone => <option key={zone}>{zone}</option>)}</select></label>
        </div>
        <p className="supporting-copy">{copy.scheduleHint}</p>
      </>}
      {(action === 'agree' || action === 'confirm') && scheduleLabel && <p>{scheduleLabel}</p>}
      <button className="primary-action" type="submit">{write.pending ? copy.save : copy.actions[action]}</button>
    </fieldset>
    {write.feedback}
    <noscript><p>{copy.js}</p></noscript>
  </form>;
}
