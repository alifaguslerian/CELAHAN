import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { consultationCopy } from '@/content/consultation';
import { followUpCopy } from '@/content/follow-up';
import { packageCopy } from '@/content/packages';
import { isLocale, localeHref, type Locale } from '@/lib/routing';
import type { PackageCode } from '@/lib/packages';
import { isTicketId, ticketActions, ticketPage, ticketTimestamp as timestamp, type TicketAction, type TicketView, type TicketWorkflow } from '@/lib/consultation';
import { followUpActions } from '@/lib/follow-up';
import { currentPageIdentity } from '@/server/auth/session';
import { listTickets, ticketAgenda, ticketDetails } from '@/server/data/tickets';
import { TicketConversation } from './conversation';
import { projectCopy } from '@/content/projects';
import { CreateProjectForm } from '@/components/projects/forms';
import { PrivateAccountScope } from '@/components/layout/site-account';

export async function ticketViewer(locale: Locale, view: TicketView, returnTo?: 'request', packageCode?: PackageCode) {
  const account = await currentPageIdentity().catch(() => null);
  if (!account) redirect(localeHref(`/${locale}/login/`, locale, '', returnTo, packageCode));
  if (view === 'admin' && !account.admin) notFound();
  return account;
}

function ticketListPath(locale: Locale, view: TicketView) {
  return view === 'admin' ? `/${locale}/admin/` : `/${locale}/tickets/`;
}

function Pagination({ locale, path, page, more }: { locale: Locale; path: string; page: number; more: boolean }) {
  const copy = consultationCopy[locale];
  if (page === 1 && !more) return null;
  return <nav className="page-actions" aria-label={locale === 'id' ? 'Halaman tiket' : 'Ticket pages'}>
    {page > 1 && <Link href={page === 2 ? path : `${path}?page=${page - 1}`} prefetch={false}>{copy.previous}</Link>}
    {more && page < 999 && <Link href={`${path}?page=${page + 1}`} prefetch={false}>{copy.next}</Link>}
  </nav>;
}

export async function TicketListPage({ locale, view, page: requestedPage, agenda: requestedAgenda }: {
  locale: string; view: TicketView; page: unknown; agenda: unknown;
}) {
  if (!isLocale(locale)) notFound();
  const actor = await ticketViewer(locale, view);
  const copy = consultationCopy[locale];
  const follow = followUpCopy[locale];
  const path = ticketListPath(locale, view);
  const page = ticketPage(requestedPage);
  const agendaPage = ticketPage(requestedAgenda);
  const [tickets, agenda] = await Promise.all([
    listTickets(actor, view, page).catch(() => null),
    ticketAgenda(actor, view, agendaPage).catch(() => null),
  ]);
  const detailPath = view === 'admin' ? `${path}tickets/` : path;
  const agendaHref = (target: number) => `${path}?${page > 1 ? `page=${page}&` : ''}agenda=${target}#agenda`;
  const title = view === 'admin' ? copy.queue : copy.myTickets;
  return <PrivateAccountScope id={actor.id} capability={view === 'admin' ? 'admin' : undefined}><main id="main-content" className="ticket-page" tabIndex={-1}>
    <header className="ticket-page-head"><div><p className="eyebrow">CELAHAN / {locale === 'id' ? 'Konsultasi' : 'Consultation'}</p><h1>{title}</h1></div>
      {view === 'owner' && <Link className="primary-action" href={`/${locale}/request/`} prefetch={false}>{copy.title}</Link>}
    </header>
    {view === 'admin' && <p className="scope-note">{copy.queueIntro}</p>}
    <p className="page-actions"><a href="#agenda">{follow.agenda}</a></p>
    {!tickets ? <p role="status" className="ticket-panel">{copy.unavailable}</p> : tickets.rows.length === 0 ? <p className="ticket-panel">{copy.empty}</p> :
      <ul className="ticket-list">{tickets.rows.map(ticket => <li key={ticket.id}>
        <Link prefetch={false} href={`${detailPath}${ticket.id}/`}>
          <span className="ticket-list-name">
            <strong>{ticket.reference}</strong>
            <span>{ticket.follow_up_kind ? follow.kinds[ticket.follow_up_kind] : copy.needs[ticket.need]}</span>
            {ticket.package_code && <span>{packageCopy[locale].items[ticket.package_code].name}</span>}
          </span>
          <span className="ticket-state">{copy.statuses[ticket.status]}</span>
          <time dateTime={ticket.updated_at.toISOString()}>{timestamp(locale, ticket.updated_at)}</time>
        </Link>
      </li>)}</ul>}
    {tickets && <Pagination locale={locale} path={path} page={page} more={tickets.more} />}
    <section id="agenda" className="ticket-panel" aria-labelledby="agenda-heading">
      <h2 id="agenda-heading">{follow.agenda}</h2>
      {!agenda ? <p role="status">{follow.agendaUnavailable}</p> : !agenda.rows.length ? <p>{follow.noAgenda}</p> :
        <ul className="ticket-events">{agenda.rows.map(item => <li key={item.id}>
          <div><Link prefetch={false} href={`${detailPath}${item.id}/`}>{item.reference}</Link>
            <time dateTime={item.schedule_at.toISOString()}>{timestamp(locale, item.schedule_at, item.schedule_zone)}</time></div>
        </li>)}</ul>}
      {(agendaPage > 1 || agenda?.more) && <nav className="page-actions" aria-label={follow.agenda}>
        {agendaPage > 1 && <Link prefetch={false} href={agendaHref(agendaPage - 1)}>{copy.previous}</Link>}
        {agenda?.more && agendaPage < 999 && <Link prefetch={false} href={agendaHref(agendaPage + 1)}>{copy.next}</Link>}
      </nav>}
    </section>
  </main></PrivateAccountScope>;
}

function nextStep(workflow: TicketWorkflow, view: TicketView): [keyof typeof consultationCopy.en.nextSteps, TicketAction] {
  const { status, schedule } = workflow;
  if (status === 'closed') return ['closed', 'reply'];
  if (status === 'awaiting_owner') return view === 'owner' ? ['waiting', 'reply'] : ['waitingAdmin', 'reply'];
  if (status === 'review') return view === 'owner' ? ['review', 'reply'] : ['reviewAdmin', 'outcome'];
  if (schedule?.state === 'confirmed') return ['confirmed', 'reply'];
  if (schedule?.state === 'agreed') return view === 'admin' ? ['confirm', 'confirm'] : ['agreed', 'reply'];
  if (schedule?.state === 'proposed') {
    if (schedule.by === 'owner') return view === 'admin' ? ['confirm', 'confirm'] : ['ownerProposed', 'propose'];
    return view === 'owner' ? ['agree', 'agree'] : ['adminProposed', 'propose'];
  }
  return view === 'owner' ? ['answered', 'reply'] : ['answeredAdmin', 'reply'];
}

export async function TicketDetailPage({ locale, view, id, page: requestedPage }: { locale: string; view: TicketView; id: string; page: unknown }) {
  if (!isLocale(locale) || !isTicketId(id)) notFound();
  const actor = await ticketViewer(locale, view);
  const copy = consultationCopy[locale];
  const follow = followUpCopy[locale];
  const listPath = ticketListPath(locale, view);
  const path = `${view === 'admin' ? `${listPath}tickets/` : listPath}${id}/`;
  const page = ticketPage(requestedPage);
  const detail = await ticketDetails(actor, view, id, page).catch(() => undefined);
  if (detail === null) notFound();
  if (!detail) return <main id="main-content" className="ticket-page" tabIndex={-1}>
    <h1>{view === 'admin' ? copy.queue : copy.myTickets}</h1><p role="status">{copy.unavailable}</p><Link href={listPath}>{copy.back}</Link>
  </main>;
  const { ticket, schedule, events, notes, more } = detail;
  const projectId = ticket.project_id;
  const workflow = { ...ticket, schedule };
  const retestActions = followUpActions(ticket.retest_state, view, ticket.status !== 'closed' && ticket.reviewable);
  const actions = [...ticketActions(workflow, view), ...retestActions];
  const [step, defaultAction] = nextStep(workflow, view);
  const recommended = ticket.status === 'awaiting_owner' ? defaultAction : (retestActions[0] ?? defaultAction);
  const scheduleLabel = schedule && timestamp(locale, schedule.at, schedule.zone);
  const endpoint = view === 'admin' ? `/api/admin/tickets/${id}/` : `/api/tickets/${id}/`;
  return <PrivateAccountScope id={actor.id} capability={view === 'admin' ? 'admin' : undefined}><main id="main-content" className="ticket-page" tabIndex={-1}>
    <Link href={listPath} className="inline-link" prefetch={false}>{copy.back}</Link>
    <header className="ticket-page-head"><div><p className="eyebrow">CELAHAN / {ticket.follow_up_kind ? follow.kinds[ticket.follow_up_kind] : copy.needs[ticket.need]}</p><h1>{ticket.reference}</h1></div>
      <span className="ticket-state">{copy.statuses[ticket.status]}</span>
    </header>
    <section className="ticket-next ticket-panel" aria-labelledby="ticket-next">
      <div><h2 id="ticket-next" tabIndex={-1}>{copy.nextStep}</h2><p>{ticket.retest_state && step !== 'waiting' && step !== 'waitingAdmin'
        ? follow.states[ticket.retest_state] : copy.nextSteps[step]}</p></div>
      {actions.length > 0 && <a className="primary-action" href="#ticket-action">{copy.act}</a>}
    </section>
    {projectId && <p className="page-actions">
      <Link prefetch={false} href={`/${locale}/${view === 'admin' ? 'admin/' : ''}projects/${projectId}/`}>
        {projectCopy[locale].open}
      </Link>
    </p>}
    <div className="ticket-detail-grid">
      <div className="ticket-detail-main">
        {ticket.retest_result && <section className="ticket-panel">
          <h2>{follow.result}</h2><p>{follow.results[ticket.retest_result]}</p>
        </section>}
        {view === 'admin' && !ticket.reviewable && (ticket.retest_state === 'pending' || ticket.retest_state === 'accepted')
          && <p className="ticket-panel">{follow.withdrawn}</p>}
        {(ticket.outcome || ticket.close_reason) && <section className="ticket-panel">
          {ticket.outcome && <><h2>{copy.outcome}</h2><p className="ticket-text">{ticket.outcome}</p></>}
          {ticket.close_reason && <><h2>{copy.closeReason}</h2><p className="ticket-text">{ticket.close_reason}</p></>}
        </section>}
        <section className="ticket-panel">
          <h2>{copy.history}</h2>
          <TicketConversation key={`${id}:${page}`} locale={locale} accountId={actor.id} endpoint={endpoint} version={ticket.version}
            actions={actions} recommended={recommended} scheduleLabel={scheduleLabel} live={page === 1 && ticket.status !== 'closed'}
            events={events.map(event => ({ ...event, created_at: event.created_at.toISOString(), schedule_at: event.schedule_at?.toISOString() ?? null }))}
            pagination={page > 1 || more ? <Pagination locale={locale} path={path} page={page} more={more} /> : null}
            olderHref={page === 1 ? `${path}?page=2` : null} />
        </section>
      </div>
      <aside className="ticket-detail-side">
        {view === 'admin' && !projectId && ticket.status !== 'closed' && ticket.outcome &&
          <CreateProjectForm locale={locale} accountId={actor.id} ticketId={id} />}
        <section className="ticket-panel"><h2>{copy.schedule}</h2>
          {schedule ? <><p className="ticket-state">{copy.scheduleStates[schedule.state]}</p><p>{scheduleLabel}</p></> : <p>{copy.noSchedule}</p>}
        </section>
        <section className="ticket-panel"><h2>{copy.submission}</h2>
          <dl className="ticket-summary">
            <dt>{copy.name}</dt><dd>{ticket.name}</dd>
            {ticket.company && <><dt>{copy.company}</dt><dd>{ticket.company}</dd></>}
            <dt>{copy.website}</dt><dd>{ticket.website}</dd>
            {ticket.package_code && <><dt>{packageCopy[locale].selected}</dt><dd>{packageCopy[locale].items[ticket.package_code].name}</dd></>}
            {ticket.follow_up_kind ? <><dt>{follow.reportVersion}</dt><dd>{ticket.report_version}</dd></>
              : <><dt>{copy.reason}</dt><dd>{ticket.reason}</dd></>}
            <dt>{copy.description}</dt><dd className="ticket-text">{ticket.description}</dd>
          </dl>
        </section>
        {view === 'admin' && notes && <section className="ticket-panel ticket-notes">
          <h2>{copy.notes}</h2><p className="supporting-copy">{copy.notesHint}</p>
          {notes.length === 0 ? <p>{copy.noNotes}</p> : <ul className="ticket-events">{notes.map(note => <li key={note.id}>
            <time dateTime={note.created_at.toISOString()}>{timestamp(locale, note.created_at)}</time><p className="ticket-text">{note.body}</p>
          </li>)}</ul>}
        </section>}
      </aside>
    </div>
  </main></PrivateAccountScope>;
}
