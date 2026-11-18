'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { projectCopy } from '@/content/projects';
import { disclaimer } from '@/content/shell';
import { isTicketId as isResourceId, maxFindings } from '@/lib/consultation';
import { findingFields, findingPriorities, reportOverview, type Finding, type StructuredReport } from '@/lib/projects';
import type { Locale } from '@/lib/routing';
import type { ReportVersion } from '@/server/data/projects';
import { usePortalSubmission } from '@/components/consultation/forms';

function Notice({ locale }: { locale: Locale }) {
  return <div>
    <p className="disclaimer" lang="id">{disclaimer.id}</p>
    {locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}
  </div>;
}

export function CreateProjectForm({ locale, accountId, ticketId, scopeVersion }: {
  locale: Locale; accountId: string; ticketId: string; scopeVersion: number;
}) {
  const copy = projectCopy[locale];
  const router = useRouter();
  const path = `/api/admin/tickets/${ticketId}/project/`;
  const write = usePortalSubmission(locale, accountId, path, copy);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void write.submit({ scopeVersion }, result => {
      if (!isResourceId(result.id)) throw new Error('Invalid project response');
      write.clearDraft();
      window.location.assign(`/${locale}/admin/projects/${result.id}/`);
    }, () => router.refresh());
  }
  return <section className="ticket-panel">
    <h2>{copy.create}</h2>
    <form className="consultation-form" method="post" action={path} onSubmit={submit}>
      <fieldset disabled={write.disabled}>
        <button type="submit" className="primary-action">{write.pending ? copy.saving : copy.create}</button>
        <Notice locale={locale} />
      </fieldset>
      {write.feedback}
    </form>
  </section>;
}

type ProjectFormProps = { locale: Locale; accountId: string; projectId: string };
type FindingDraft = Omit<Finding, 'priority'> & { priority: Finding['priority'] | '' };
const blankFinding: FindingDraft = { title: '', description: '', impact: '', recommendation: '', priority: '' };

export function ReportEditor({ locale, accountId, projectId, draft, example, correction }: ProjectFormProps & {
  draft?: ReportVersion; example: StructuredReport; correction: boolean;
}) {
  const copy = projectCopy[locale];
  const router = useRouter();
  const path = `/api/admin/projects/${projectId}/`;
  const write = usePortalSubmission(locale, accountId, path, copy);
  const saved = draft?.body;
  const [summary, setSummary] = useState(saved?.summary ?? '');
  const [scope, setScope] = useState(saved?.scope ?? '');
  const [findings, setFindings] = useState<FindingDraft[]>(() => !saved ? [blankFinding] : 'findings' in saved
    ? saved.findings : [{ ...blankFinding, description: saved.finding, impact: saved.impact, recommendation: saved.recommendation }]);
  const [changeNote, setChangeNote] = useState(draft?.change_note ?? '');
  const changed = !draft || !saved || !('findings' in saved) || summary !== saved.summary || scope !== saved.scope
    || findings.length !== saved.findings.length || findings.some((finding, index) =>
      [...findingFields, 'priority' as const].some(field => finding[field] !== saved.findings[index][field]))
    || changeNote !== draft.change_note;

  function updateFinding(index: number, fields: Partial<FindingDraft>) {
    setFindings(current => current.map((finding, position) => position === index ? { ...finding, ...fields } : finding));
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void write.submit({ kind: 'save', reportId: draft?.id ?? null, revision: draft?.revision ?? 0,
      body: { summary, scope, findings }, changeNote }, () => router.refresh());
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
        {reportOverview.map(field => <label key={field}>{copy.fields[field]}
          <textarea name={field} required maxLength={3000} rows={3} value={field === 'summary' ? summary : scope}
            onChange={event => (field === 'summary' ? setSummary : setScope)(event.target.value)} />
        </label>)}
        {findings.map((finding, index) => <div className="finding-editor" role="group" aria-labelledby={`finding-editor-${index}`} key={index}>
          <h3 id={`finding-editor-${index}`}>{copy.finding} {index + 1}</h3>
          <label>{copy.findingTitle}<input required maxLength={160} value={finding.title} onChange={event => updateFinding(index, { title: event.target.value })} /></label>
          <label>{copy.priority}<select required value={finding.priority} onChange={event => updateFinding(index, { priority: findingPriorities.find(priority => priority === event.target.value) ?? '' })}>
            <option value="" disabled>{copy.choosePriority}</option>
            {findingPriorities.map(priority => <option key={priority} value={priority}>{copy.priorities[priority]}</option>)}
          </select></label>
          {(['description', 'impact', 'recommendation'] as const).map(field => <label key={field}>{field === 'description' ? copy.description : copy.fields[field]}
            <textarea required maxLength={3000} rows={3} value={finding[field]} onChange={event => updateFinding(index, { [field]: event.target.value })} />
          </label>)}
          {findings.length > 1 && <button type="button" className="text-button" onClick={() => {
            setFindings(current => current.filter((_, position) => position !== index)); write.markDirty();
          }}>{copy.removeFinding} {index + 1}</button>}
        </div>)}
        {findings.length < maxFindings && <button type="button" className="text-button finding-add" onClick={() => {
          setFindings(current => [...current, blankFinding]); write.markDirty();
        }}>{copy.addFinding}</button>}
        {correction && <label>{copy.changeNote}<textarea name="changeNote" required maxLength={1000} rows={2}
          value={changeNote} onChange={event => setChangeNote(event.target.value)} /></label>}
        <div className="page-actions">
          <button type="submit" className="primary-action">{write.pending ? copy.saving : copy.save}</button>
          <button type="button" className="text-button" onClick={() => {
            setSummary(example.summary); setScope(example.scope); setFindings(example.findings); write.markDirty();
          }}>{copy.template}</button>
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
