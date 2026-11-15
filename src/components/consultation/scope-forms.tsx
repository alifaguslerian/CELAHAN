'use client';

import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { scopeCopy } from '@/content/scope';
import { disclaimer } from '@/content/shell';
import { scopeFields, type ScopeProposal } from '@/lib/consultation';
import type { Locale } from '@/lib/routing';
import { usePortalSubmission } from './forms';

type Props = { locale: Locale; accountId: string; endpoint: string; version: number; scope?: ScopeProposal };

export function ScopeForm({ locale, accountId, endpoint, version, scope, admin }: Props & { admin: boolean }) {
  const copy = scopeCopy[locale];
  const router = useRouter();
  const write = usePortalSubmission(locale, accountId, endpoint);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const requestChanges = submitter?.getAttribute('value') === 'revise_scope';
    if (!admin && !scope) return;
    const payload = admin
      ? { kind: 'propose_scope', ...Object.fromEntries(scopeFields.map(field => [field, data.get(field)])) }
      : requestChanges
        ? { kind: 'revise_scope', scopeVersion: scope?.version, body: data.get('body') }
        : { kind: 'approve_scope', scopeVersion: scope?.version };
    void write.submit({ ...payload, version }, () => {
      form.reset();
      router.refresh();
    }, () => router.refresh(), 'ticket-scope-heading');
  }

  return <form className="consultation-form" method="post" action={endpoint} onSubmit={submit}>
    <fieldset disabled={write.disabled} onChange={write.markDirty}>
      {admin ? <>
        <label>{copy.fields.title}<input name="title" defaultValue={scope?.title} required minLength={2} maxLength={120} /></label>
        {scopeFields.slice(1).map(field => <label key={field}>{copy.fields[field]}
          <textarea name={field} defaultValue={scope?.[field]} required minLength={field === 'included' ? 10 : 1} maxLength={2000} rows={3} />
        </label>)}
        <button className="primary-action" type="submit">{scope ? copy.revise : copy.send}</button>
      </> : <>
        <label>{copy.reason}<textarea name="body" required maxLength={3000} rows={3} /></label>
        <div className="scope-actions">
          <button className="primary-action" type="submit" value="approve_scope" formNoValidate>{copy.approve}</button>
          <button className="primary-action" type="submit" value="revise_scope">{copy.request}</button>
        </div>
      </>}
      <p className="disclaimer" lang="id">{disclaimer.id}</p>
      {locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}
    </fieldset>
    {write.feedback}
  </form>;
}

export function ScopeRefresh({ locale }: { locale: Locale }) {
  const router = useRouter();
  return <button type="button" className="text-button" onClick={() => router.refresh()}>{scopeCopy[locale].refresh}</button>;
}
