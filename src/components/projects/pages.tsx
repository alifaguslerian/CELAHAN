import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { projectCopy } from '@/content/projects';
import { followUpCopy } from '@/content/follow-up';
import { disclaimer } from '@/content/shell';
import { isTicketId as isResourceId, ticketPage } from '@/lib/consultation';
import { reportFields } from '@/lib/projects';
import { isLocale, type Locale } from '@/lib/routing';
import { currentPageAccount, currentPageIdentity } from '@/server/auth/session';
import { adminProject, listOwnedProjects, ownedProject, type ReportVersion } from '@/server/data/projects';
import { reportExample } from '@/server/data/report-example';
import { PrivateAccountScope } from '@/components/layout/site-account';
import { ProjectActionForm, ReportEditor } from './forms';
import { FollowUpForm } from './follow-up-form';

function dateLabel(locale: Locale, date: Date | string) {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta',
  }).format(new Date(date)) + ' WIB';
}

function Pages({ locale, path, page, more }: { locale: Locale; path: string; page: number; more: boolean }) {
  if (page === 1 && !more) return null;
  const copy = projectCopy[locale];
  return <nav className="page-actions" aria-label={locale === 'id' ? 'Halaman proyek' : 'Project pages'}>
    {page > 1 && <Link prefetch={false} href={page === 2 ? path : `${path}?page=${page - 1}`}>{copy.previous}</Link>}
    {more && page < 999 && <Link prefetch={false} href={`${path}?page=${page + 1}`}>{copy.next}</Link>}
  </nav>;
}

function ReportText({ locale, version }: { locale: Locale; version: ReportVersion }) {
  const copy = projectCopy[locale];
  return <>
    <p className="supporting-copy">{copy.illustrative}</p>
    {version.published_at && <p className="supporting-copy">{dateLabel(locale, version.published_at)}</p>}
    {version.change_note && <p className="ticket-text"><strong>{copy.changeNote}</strong> · {version.change_note}</p>}
    <dl className="ticket-summary">
      {reportFields.map(field => <div key={field}>
        <dt>{copy.fields[field]}</dt><dd className="ticket-text">{version.body[field]}</dd>
      </div>)}
    </dl>
    <p className="disclaimer" lang="id">{disclaimer.id}</p>
    {locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}
  </>;
}

export async function ProjectIndex({ locale, requestedPage }: { locale: Locale; requestedPage: unknown }) {
  const account = await currentPageAccount().catch(() => null);
  if (!account) redirect(`/${locale}/login/`);
  if (!account.hasProjects) notFound();
  const copy = projectCopy[locale];
  const page = ticketPage(requestedPage);
  const list = await listOwnedProjects(account, page);
  const path = `/${locale}/projects/`;
  return <PrivateAccountScope id={account.id} capability="hasProjects">
    <main id="main-content" className="ticket-page" tabIndex={-1}>
      <h1>{copy.title}</h1><p className="scope-note">{copy.illustrative}</p>
      {list.rows.length ? <ul className="ticket-list">{list.rows.map(project => <li key={project.id}>
        <Link prefetch={false} href={`${path}${project.id}/`}>
          <strong>{project.title}</strong><span className="ticket-state">{copy.stages[project.stage]}</span>
        </Link>
      </li>)}</ul> : <p className="ticket-panel">{copy.empty}</p>}
      <Pages locale={locale} path={path} page={page} more={list.more} />
    </main>
  </PrivateAccountScope>;
}

export async function ProjectDetail({ locale, id }: { locale: string; id: string }) {
  if (!isLocale(locale) || !isResourceId(id)) notFound();
  const account = await currentPageIdentity().catch(() => null);
  if (!account) redirect(`/${locale}/login/`);
  const data = await ownedProject(account, id);
  if (!data) notFound();
  const { project, events, followUps } = data;
  const copy = projectCopy[locale];
  const follow = followUpCopy[locale];
  const active = project.support_active;
  return <PrivateAccountScope id={account.id} capability="hasProjects">
    <main id="main-content" className="ticket-page" tabIndex={-1}>
      <Link prefetch={false} className="inline-link" href={`/${locale}/projects/`}>{copy.title}</Link>
      <header className="ticket-page-head"><h1>{project.title}</h1><span className="ticket-state">{copy.stages[project.stage]}</span></header>
      <p className="scope-note">{copy.illustrative}</p>
      <section className="ticket-panel">
        <h2>{copy.scope}</h2><p className="ticket-text">{project.scope}</p>
        <Link prefetch={false} className="text-link" href={`/${locale}/tickets/${project.consultation_id}/`}>{copy.source}</Link>
      </section>
      <section className="ticket-panel">
        <h2>{copy.report}{project.report ? ` · ${copy.version} ${project.report.version}` : ''}</h2>
        {project.report ? <ReportText locale={locale} version={project.report} /> : <p>{copy.missingReport}</p>}
      </section>
      <section className="ticket-panel">
        <h2>{copy.support}</h2>
        <p>{project.support_started_at && project.support_expires_at
          ? `${dateLabel(locale, project.support_started_at)} – ${dateLabel(locale, project.support_expires_at)}`
          : copy.waitingSupport}</p>
        {project.support_expires_at && <p><strong>{active ? follow.active : follow.expired}</strong></p>}
        {followUps?.cycle ? <p>{follow.states[followUps.cycle]}</p> : active && project.report && followUps && <p>{follow.available}</p>}
        {!active && project.support_expires_at && <Link className="text-link" prefetch={false} href={`/${locale}/request/`}>{follow.newReview}</Link>}
      </section>
      {(project.report || Boolean(followUps?.rows.length)) && <section className="ticket-panel">
        <h2>{follow.title}</h2>
        {!followUps ? <p role="status">{follow.unavailable}</p> : <>
          {project.report && <FollowUpForm locale={locale} accountId={account.id} projectId={id} reportId={project.report.id}
            canRetest={active && !followUps.cycle} />}
          {followUps.rows.length > 0 && <ul className="ticket-events">{followUps.rows.map(row => <li key={row.id}>
            <div><Link prefetch={false} href={`/${locale}/tickets/${row.id}/`}>{follow.kinds[row.kind]} · {row.reference}</Link>
              {row.retest_state && <span>{follow.states[row.retest_state]}</span>}</div>
            {row.retest_result && <p>{follow.results[row.retest_result]}</p>}
          </li>)}</ul>}
        </>}
      </section>}
      <section className="ticket-panel">
        <h2>{copy.progress}</h2>
        <ol className="ticket-events">{events.map(event => <li key={event.id}>
          <strong>{copy.events[event.kind]}</strong><p>{dateLabel(locale, event.created_at)}</p>
        </li>)}</ol>
      </section>
    </main>
  </PrivateAccountScope>;
}

export async function AdminProjectDetail({ locale, id, requestedPage }: { locale: string; id: string; requestedPage: unknown }) {
  if (!isLocale(locale) || !isResourceId(id)) notFound();
  const account = await currentPageIdentity().catch(() => null);
  if (!account) redirect(`/${locale}/login/`);
  if (!account.admin) notFound();
  const page = ticketPage(requestedPage);
  const data = await adminProject(account, id, page);
  if (!data) notFound();
  const { project, draft, published, versions, more } = data;
  const copy = projectCopy[locale];
  const form = { locale, accountId: account.id, projectId: id };
  return <PrivateAccountScope id={account.id} capability="admin">
    <main id="main-content" className="ticket-page" tabIndex={-1}>
      <Link prefetch={false} className="inline-link" href={`/${locale}/admin/tickets/${project.consultation_id}/`}>{copy.source}</Link>
      <header className="ticket-page-head"><div><p className="eyebrow">{copy.admin}</p><h1>{project.title}</h1></div>
        <span className="ticket-state">{copy.stages[project.stage]}</span>
      </header>
      <section className="ticket-panel">
        <h2>{copy.scope}</h2><p className="ticket-text">{project.scope}</p>
        {project.stage === 'created' && <ProjectActionForm {...form} />}
        {published && <ProjectActionForm {...form} reportId={published.id} />}
      </section>
      <ReportEditor key={draft ? `${draft.id}:${draft.revision}` : 'new'} {...form}
        draft={draft} example={reportExample[locale]} correction={project.support_started_at !== null} />
      <section className="ticket-panel">
        <h2>{copy.history}</h2>
        {versions.map(version => <details key={version.id}>
          <summary>{copy.version} {version.version} · {copy.states[version.state]}</summary>
          <ReportText locale={locale} version={version} />
        </details>)}
        <Pages locale={locale} path={`/${locale}/admin/projects/${id}/`} page={page} more={more} />
      </section>
    </main>
  </PrivateAccountScope>;
}
