'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { projectCopy } from '@/content/projects';
import { disclaimer } from '@/content/shell';
import { isTicketId as isResourceId } from '@/lib/consultation';
import { reportFields, type ReportBody } from '@/lib/projects';
import type { Locale } from '@/lib/routing';
import type { ReportVersion } from '@/server/data/projects';
import { usePortalSubmission } from '@/components/consultation/forms';

function Notice({ locale }: { locale: Locale }) {
  return <div>
    <p className="disclaimer" lang="id">{disclaimer.id}</p>
    {locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}
  </div>;
}

export function CreateProjectForm({ locale, accountId, ticketId }: { locale: Locale; accountId: string; ticketId: string }) {
  const copy = projectCopy[locale];
  const path = `/api/admin/tickets/${ticketId}/project/`;
  const write = usePortalSubmission(locale, accountId, path, copy);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    void write.submit({ title: data.get('title'), scope: data.get('scope'), agreed: data.get('agreed') === 'on' }, result => {
      if (!isResourceId(result.id)) throw new Error('Invalid project response');
      write.clearDraft();
      window.location.assign(`/${locale}/admin/projects/${result.id}/`);
    });
  }
  return <section className="ticket-panel">
    <h2>{copy.create}</h2>
    <form className="consultation-form" method="post" action={path} onSubmit={submit}>
      <fieldset disabled={write.disabled} onChange={write.markDirty}>
        <label>{copy.projectTitle}<input name="title" required minLength={2} maxLength={120} /></label>
        <label>{copy.scope}<textarea name="scope" required minLength={10} maxLength={2000} rows={4} /></label>
        <label className="consultation-check"><input type="checkbox" name="agreed" required />{copy.agreement}</label>
        <button type="submit" className="primary-action">{write.pending ? copy.saving : copy.create}</button>
        <Notice locale={locale} />
      </fieldset>
      {write.feedback}
    </form>
  </section>;
}

type ProjectFormProps = { locale: Locale; accountId: string; projectId: string };
const blankReport: ReportBody = { summary: '', scope: '', finding: '', impact: '', recommendation: '' };

export function ReportEditor({ locale, accountId, projectId, draft, example, correction }: ProjectFormProps & {
  draft?: ReportVersion; example: ReportBody; correction: boolean;
}) {
  const copy = projectCopy[locale];
  const router = useRouter();
  const path = `/api/admin/projects/${projectId}/`;
  const write = usePortalSubmission(locale, accountId, path, copy);
  const [body, setBody] = useState(draft?.body ?? blankReport);
  const [changeNote, setChangeNote] = useState(draft?.change_note ?? '');
  const changed = !draft || reportFields.some(field => body[field] !== draft.body[field]) || changeNote !== draft.change_note;

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void write.submit({ kind: 'save', reportId: draft?.id ?? null, revision: draft?.revision ?? 0, body, changeNote }, () => router.refresh());
  }

  function publish() {
    if (!draft || changed || !window.confirm(copy.publishConfirm)) return;
    void write.submit({ kind: 'publish', reportId: draft.id, revision: draft.revision }, () => router.refresh());
  }

  return <section className="ticket-panel">
    <h2>{copy.editor}{draft ? ` · ${copy.version} ${draft.version}` : ''}</h2>
    <p className="supporting-copy">{copy.illustrative}</p>
    <form className="consultation-form" method="post" action={path} onSubmit={save}>
      <fieldset disabled={write.disabled} onChange={write.markDirty}>
        {reportFields.map(field => <label key={field}>{copy.fields[field]}
          <textarea name={field} required maxLength={3000} rows={3} value={body[field]}
            onChange={event => setBody({ ...body, [field]: event.target.value })} />
        </label>)}
        {correction && <label>{copy.changeNote}<textarea name="changeNote" required maxLength={1000} rows={2}
          value={changeNote} onChange={event => setChangeNote(event.target.value)} /></label>}
        <div className="page-actions">
          <button type="submit" className="primary-action">{write.pending ? copy.saving : copy.save}</button>
          <button type="button" className="text-button" onClick={() => { setBody(example); write.markDirty(); }}>{copy.template}</button>
          {draft && <button type="button" className="text-button" disabled={changed} onClick={publish}>{copy.publish}</button>}
        </div>
        {draft && changed && <p className="supporting-copy">{copy.saveFirst}</p>}
        <Notice locale={locale} />
      </fieldset>
      {write.feedback}
    </form>
  </section>;
}

export function ProjectActionForm({ locale, accountId, projectId, reportId }: ProjectFormProps & { reportId?: string }) {
  const copy = projectCopy[locale];
  const router = useRouter();
  const path = `/api/admin/projects/${projectId}/`;
  const write = usePortalSubmission(locale, accountId, path, copy);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (reportId && !window.confirm(copy.withdrawConfirm)) return;
    void write.submit(reportId ? { kind: 'withdraw', reportId } : { kind: 'prepare' }, () => router.refresh());
  }
  return <form method="post" action={path} onSubmit={submit} className="consultation-form">
    <button type="submit" className="text-button" disabled={write.disabled}>{reportId ? copy.withdraw : copy.prepare}</button>
    <Notice locale={locale} />
    {write.feedback}
  </form>;
}
