'use client';

import { useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { consultationCopy } from '@/content/consultation';
import { followUpCopy } from '@/content/follow-up';
import { disclaimer } from '@/content/shell';
import { confirmationCopy } from '@/content/confirmation';
import { useActionConfirmation, useUnsavedDraft } from '@/components/layout/action-confirmation';
import { consultationNeeds, consultationWebsite, isTicketId, retestResults, text, type TicketAction } from '@/lib/consultation';
import type { Locale } from '@/lib/routing';
import type { PackageCode } from '@/lib/packages';

const subscribe = () => () => {};
const zones = ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura', 'UTC'];

export function usePortalSubmission(locale: Locale, accountId: string, endpoint: string,
  copy: { saved: string; errors: Record<string, string> } = consultationCopy[locale], draftKind: 'leave' | 'intake' = 'leave') {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const busy = useRef(false);
  const { isDirty, markDirty, clearDraft } = useUnsavedDraft(confirmationCopy[locale][draftKind]);
  const { confirm } = useActionConfirmation();
  const status = useRef<HTMLParagraphElement>(null);
  const attempt = useRef<{ key: string; payload: Record<string, unknown>; id: string } | null>(null);

  async function submit(payload: Record<string, unknown>, complete: (data: Record<string, unknown>) => void, conflict?: () => void, successFocus?: string) {
    if (busy.current || !hydrated) return;
    busy.current = true;
    setPending(true);
    setMessage('');
    let saved = false;
    try {
      const key = JSON.stringify(payload.kind === 'reply' ? { kind: payload.kind, body: payload.body } : payload);
      if (attempt.current?.key !== key) attempt.current = { key, payload, id: crypto.randomUUID() };
      const response = await fetch(endpoint, {
        method: 'POST', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(16000),
        headers: { 'Content-Type': 'application/json', 'X-Celahan-Account': accountId },
        body: JSON.stringify({ ...attempt.current.payload, requestId: attempt.current.id }),
      });
      const data = await response.json();
      if (!response.ok) {
        const code = typeof data.error === 'string' && Object.hasOwn(copy.errors, data.error) ? data.error : 'UNAVAILABLE';
        setFailed(true);
        setMessage(copy.errors[code]);
        if (code === 'CONFLICT') { attempt.current = null; conflict?.(); }
        return;
      }
      complete(data);
      saved = true;
      clearDraft();
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

  function changeAction(change: () => void) {
    if (!isDirty()) return change();
    confirm(confirmationCopy[locale].changeAction, () => {
      clearDraft();
      change();
    });
  }

  return { disabled: pending || !hydrated, pending, submit, changeAction,
    markDirty, clearDraft,
    feedback: <p className="form-status" tabIndex={-1} ref={status} role={failed ? 'alert' : 'status'}>{message}</p> };
}

export function ConsultationForm({ locale, name, accountId, packageCode }: {
  locale: Locale; name: string; accountId: string; packageCode?: PackageCode;
}) {
  const copy = consultationCopy[locale];
  const write = usePortalSubmission(locale, accountId, '/api/tickets/', copy, 'intake');
  const [invalid, setInvalid] = useState<string[]>([]);

  function fieldError(field: keyof typeof copy.validation) {
    return invalid.includes(field) ? <span className="field-error" id={`intake-error-${field}`}>{copy.validation[field]}</span> : null;
  }

  function fieldState(field: keyof typeof copy.validation, hint?: string) {
    const hasError = invalid.includes(field);
    return { 'aria-invalid': hasError || undefined, 'aria-describedby': [hint, hasError ? `intake-error-${field}` : null].filter(Boolean).join(' ') || undefined };
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const errors = [
      !text(data.get('name'), 2, 80) && 'name',
      text(data.get('company'), 0, 120) === null && 'company',
      !consultationWebsite(data.get('website')) && 'website',
      !text(data.get('reason'), 1, 160) && 'reason',
      !text(data.get('description'), 10, 3000) && 'description',
      data.get('authority') !== 'on' && 'authority',
    ].filter((field): field is string => typeof field === 'string');
    setInvalid(errors);
    if (errors.length) {
      const control = event.currentTarget.elements.namedItem(errors[0]);
      requestAnimationFrame(() => { if (control instanceof HTMLElement) control.focus(); });
      return;
    }
    void write.submit({ ...Object.fromEntries(data), authority: data.get('authority') === 'on', ...(packageCode && { packageCode }) }, result => {
      if (!isTicketId(result.id)) throw new Error('Unexpected ticket response');
      write.clearDraft();
      window.location.assign(`/${locale}/tickets/${result.id}/`);
    });
  }

  return <form method="post" action="/api/tickets/" onSubmit={onSubmit} className="consultation-form" noValidate>
    <fieldset disabled={write.disabled} onChange={event => {
      write.markDirty();
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        setInvalid(fields => fields.includes(target.name) ? fields.filter(field => field !== target.name) : fields);
      }
    }}>
      <div className="consultation-fields">
        <label>{copy.name}<input name="name" defaultValue={name} required minLength={2} maxLength={80} {...fieldState('name')} />{fieldError('name')}</label>
        <label>{copy.company}<input name="company" maxLength={120} {...fieldState('company')} />{fieldError('company')}</label>
      </div>
      <label>{copy.website}<input name="website" type="url" placeholder="https://demo.example.invalid" required maxLength={2048}
        {...fieldState('website', invalid.includes('website') ? undefined : 'intake-website-hint')} />
        {fieldError('website') ?? <span className="supporting-copy" id="intake-website-hint">{copy.websiteHint}</span>}
      </label>
      <div className="consultation-fields">
        <label>{copy.need}<select name="need" defaultValue="unsure_mixed">{consultationNeeds.map(need => <option key={need} value={need}>{copy.needs[need]}</option>)}</select></label>
        <label>{copy.reason}<input name="reason" required maxLength={160} {...fieldState('reason')} />{fieldError('reason')}</label>
      </div>
      <label>{copy.description}<textarea name="description" required minLength={10} maxLength={3000} rows={5} {...fieldState('description')} />{fieldError('description')}</label>
      <div><label className="consultation-check"><input name="authority" type="checkbox" required {...fieldState('authority')} />{copy.authority}</label>{fieldError('authority')}</div>
      <p className="disclaimer" lang="id">{disclaimer.id}</p>
      {locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}
      <button className="primary-action" type="submit">{write.pending ? copy.save : copy.send}</button>
    </fieldset>
    {write.feedback}
    <noscript><p>{copy.js}</p></noscript>
  </form>;
}

export function TicketActionForm({ locale, accountId, endpoint, version, replyVersion, actions, recommended, scheduleLabel, retestFindings }: {
  locale: Locale; accountId: string; endpoint: string; version: number; replyVersion: number; actions: TicketAction[]; recommended: TicketAction; scheduleLabel: string | null;
  retestFindings: { number: number; title: string }[];
}) {
  const copy = consultationCopy[locale];
  const follow = followUpCopy[locale];
  const prompts = confirmationCopy[locale];
  const { confirm } = useActionConfirmation();
  const router = useRouter();
  const write = usePortalSubmission(locale, accountId, endpoint);
  const [choice, setChoice] = useState<TicketAction | null>(null);
  const action = choice && actions.includes(choice) ? choice : actions.includes(recommended) ? recommended : actions[0];
  const form = useRef<HTMLFormElement>(null);
  const bodyLabel = action in copy.bodies ? copy.bodies[action as keyof typeof copy.bodies] : null;
  const localZone = useSyncExternalStore(subscribe, () => Intl.DateTimeFormat().resolvedOptions().timeZone, () => 'Asia/Jakarta');
  const zoneOptions = [...new Set([...zones, localZone])];

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = action === 'propose' ? { wallTime: data.get('wallTime'), zone: data.get('zone') } : bodyLabel ? { body: data.get('body') } : {};
    const result = action === 'finish_retest' ? retestFindings.length
      ? { outcomes: retestFindings.map(finding => ({ finding: finding.number, result: data.get(`result-${finding.number}`) })) }
      : { result: data.get('result') } : {};
    const save = () => {
      void write.submit({ kind: action, version: action === 'reply' ? replyVersion : version, ...payload, ...result }, () => {
        form.current?.reset();
        setChoice(null);
        router.refresh();
      }, () => router.refresh(), action === 'close' ? 'ticket-next' : undefined);
    };
    if (action === 'close') confirm(prompts.closeTicket, save);
    else if (action === 'finish_retest') confirm(prompts.finishRetest, save);
    else if (action === 'confirm') {
      const prompt = prompts.confirmTime;
      confirm({ ...prompt, description: scheduleLabel ? `${scheduleLabel}. ${prompt.description}` : prompt.description }, save);
    } else save();
  }

  return <form ref={form} id="ticket-action" method="post" action={endpoint} className="consultation-form" onSubmit={onSubmit}>
    <fieldset disabled={write.disabled}>
      <label>{copy.action}<select value={action} onChange={event => {
        const next = event.target.value as TicketAction;
        write.changeAction(() => setChoice(next));
      }}>{actions.map(item => <option key={item} value={item}>{copy.actions[item]}</option>)}</select></label>
      {action === 'finish_retest' && <div className="retest-findings">
        {(retestFindings.length ? retestFindings : [{ number: 0, title: '' }]).map(({ number, title }) =>
          <label key={number}>{number ? `${number}. ${title}` : follow.result}
            <select name={number ? `result-${number}` : 'result'} required defaultValue="" onChange={write.markDirty}>
              <option value="" disabled>{follow.selectResult}</option>
              {retestResults.map(result => <option key={result} value={result}>{follow.results[result]}</option>)}
            </select>
          </label>)}
      </div>}
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
