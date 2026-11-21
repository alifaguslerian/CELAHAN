'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { confirmationCopy } from '@/content/confirmation';
import { useActionConfirmation } from '@/components/layout/action-confirmation';
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
  const { confirm } = useActionConfirmation();
  const [revising, setRevising] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!admin && !scope) return;
    const payload = admin
      ? { kind: 'propose_scope', ...Object.fromEntries(scopeFields.map(field => [field, data.get(field)])) }
      : { kind: 'revise_scope', scopeVersion: scope?.version, body: data.get('body') };
    void write.submit({ ...payload, version }, () => {
      form.reset();
      router.refresh();
    }, () => router.refresh(), 'ticket-scope-heading');
  }

  function approve() {
    if (!scope) return;
    const prompt = confirmationCopy[locale].approve;
    confirm({ ...prompt, title: `${copy.approve} ${copy.versionWord} ${scope.version}?` }, () => {
      void write.submit({ kind: 'approve_scope', scopeVersion: scope.version, version },
        () => router.refresh(), () => router.refresh(), 'ticket-scope-heading');
    });
  }

  return <form className="consultation-form" method="post" action={endpoint} onSubmit={submit}>
    <fieldset disabled={write.disabled} onChange={write.markDirty}>
      {admin ? <>
        <label>{copy.fields.title}<input name="title" defaultValue={scope?.title} required minLength={2} maxLength={120} /></label>
        {scopeFields.slice(1).map(field => <label key={field}>{copy.fields[field]}
          <textarea name={field} defaultValue={scope?.[field]} required minLength={field === 'included' ? 10 : 1} maxLength={2000} rows={3} />
        </label>)}
        <button className="primary-action" type="submit">{scope ? copy.revise : copy.send}</button>
      </> : revising ? <>
        <label>{copy.reason}<textarea name="body" required maxLength={3000} rows={3} autoFocus /></label>
        <div className="scope-actions">
          <button className="primary-action" type="submit">{copy.sendRequest}</button>
          <button className="text-button" type="button" onClick={() => write.changeAction(() => setRevising(false))}>{confirmationCopy[locale].cancel}</button>
        </div>
      </> : <div className="scope-actions">
        <button className="primary-action" type="button" onClick={approve}>{copy.approve} {copy.versionWord} {scope?.version}</button>
        <button className="text-button" type="button" onClick={() => setRevising(true)}>{copy.request}</button>
      </div>}
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
