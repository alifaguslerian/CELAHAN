import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { consultationCopy } from '@/content/consultation';
import { isLocale, type Locale } from '@/lib/routing';
import { isTicketId, ticketActions, ticketPage, type TicketAction, type TicketView, type TicketWorkflow } from '@/lib/consultation';
import { currentPageIdentity } from '@/server/auth/session';
import { listTickets, ticketDetails } from '@/server/data/tickets';
import { TicketActionForm } from './forms';
import { PrivateAccountScope } from '@/components/layout/site-account';

const localeFormat = { id: 'id-ID', en: 'en-GB' } as const;

function timestamp(locale: Locale, value: Date | string, zone = 'Asia/Jakarta') {
  return `${new Intl.DateTimeFormat(localeFormat[locale], { dateStyle: 'medium', timeStyle: 'short', timeZone: zone }).format(new Date(value))} · ${zone}`;
}

export async function ticketViewer(locale: Locale, view: TicketView, returnTo?: 'request') {
  const account = await currentPageIdentity().catch(() => null);
  if (!account) redirect(`/${locale}/login/${returnTo ? '?next=request' : ''}`);
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

export async function TicketListPage({ locale, view, page: requestedPage }: { locale: string; view: TicketView; page: unknown }) {
  if (!isLocale(locale)) notFound();
  const actor = await ticketViewer(locale, view);
  const copy = consultationCopy[locale];
  const path = ticketListPath(locale, view);
  const page = ticketPage(requestedPage);
  const tickets = await listTickets(actor, view, page).catch(() => null);
  const title = view === 'admin' ? copy.queue : copy.myTickets;
  return <PrivateAccountScope id={actor.id} capability={view === 'admin' ? 'admin' : undefined}><main id="main-content" className="ticket-page" tabIndex={-1}>
    <header className="ticket-page-head"><div><p className="eyebrow">CELAHAN / {locale === 'id' ? 'Konsultasi' : 'Consultation'}</p><h1>{title}</h1></div>
      {view === 'owner' && <Link className="primary-action" href={`/${locale}/request/`} prefetch={false}>{copy.title}</Link>}
    </header>
    {view === 'admin' && <p className="scope-note">{copy.queueIntro}</p>}
    {!tickets ? <p role="status" className="ticket-panel">{copy.unavailable}</p> : tickets.rows.length === 0 ? <p className="ticket-panel">{copy.empty}</p> :
      <ul className="ticket-list">{tickets.rows.map(ticket => <li key={ticket.id}>
        <Link prefetch={false} href={`${view === 'admin' ? `${path}tickets/` : path}${ticket.id}/`}>
          <span className="ticket-list-name"><strong>{ticket.reference}</strong><span>{copy.needs[ticket.need]}</span></span>
          <span className="ticket-state">{copy.statuses[ticket.status]}</span>
          <time dateTime={ticket.updated_at.toISOString()}>{timestamp(locale, ticket.updated_at)}</time>
        </Link>
      </li>)}</ul>}
    {tickets && <Pagination locale={locale} path={path} page={page} more={tickets.more} />}
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
  const listPath = ticketListPath(locale, view);
  const path = `${view === 'admin' ? `${listPath}tickets/` : listPath}${id}/`;
  const page = ticketPage(requestedPage);
  const detail = await ticketDetails(actor, view, id, page).catch(() => undefined);
  if (detail === null) notFound();
  if (!detail) return <main id="main-content" className="ticket-page" tabIndex={-1}>
    <h1>{view === 'admin' ? copy.queue : copy.myTickets}</h1><p role="status">{copy.unavailable}</p><Link href={listPath}>{copy.back}</Link>
  </main>;
  const { ticket, schedule, events, notes, more } = detail;
  const workflow = { ...ticket, schedule };
  const actions = ticketActions(workflow, view);
  const [step, recommended] = nextStep(workflow, view);
  const scheduleLabel = schedule && timestamp(locale, schedule.at, schedule.zone);
  const endpoint = view === 'admin' ? `/api/admin/tickets/${id}/` : `/api/tickets/${id}/`;
  return <PrivateAccountScope id={actor.id} capability={view === 'admin' ? 'admin' : undefined}><main id="main-content" className="ticket-page" tabIndex={-1}>
    <Link href={listPath} className="inline-link" prefetch={false}>{copy.back}</Link>
    <header className="ticket-page-head"><div><p className="eyebrow">CELAHAN / {copy.needs[ticket.need]}</p><h1>{ticket.reference}</h1></div>
      <span className="ticket-state">{copy.statuses[ticket.status]}</span>
    </header>
    <section className="ticket-next ticket-panel" aria-labelledby="ticket-next">
      <div><h2 id="ticket-next" tabIndex={-1}>{copy.nextStep}</h2><p>{copy.nextSteps[step]}</p></div>
      {actions.length > 0 && <a className="primary-action" href="#ticket-action">{copy.act}</a>}
    </section>
    <div className="ticket-detail-grid">
      <div className="ticket-detail-main">
        {(ticket.outcome || ticket.close_reason) && <section className="ticket-panel">
          {ticket.outcome && <><h2>{copy.outcome}</h2><p className="ticket-text">{ticket.outcome}</p></>}
          {ticket.close_reason && <><h2>{copy.closeReason}</h2><p className="ticket-text">{ticket.close_reason}</p></>}
        </section>}
        <section className="ticket-panel">
          <h2>{copy.history}</h2>
          <ol className="ticket-events">{events.map(event => <li key={event.id}>
            <div><strong>{copy.event[event.kind]}</strong><span>{copy.people[event.actor]} · <time dateTime={event.created_at.toISOString()}>{timestamp(locale, event.created_at)}</time></span></div>
            {event.body && <p className="ticket-text">{event.body}</p>}
            {event.schedule_at && event.schedule_zone && <p>{timestamp(locale, event.schedule_at, event.schedule_zone)}</p>}
          </li>)}</ol>
          <Pagination locale={locale} path={path} page={page} more={more} />
          {actions.length > 0 && <TicketActionForm locale={locale} accountId={actor.id} endpoint={endpoint} version={ticket.version} actions={actions} recommended={recommended} scheduleLabel={scheduleLabel} />}
        </section>
      </div>
      <aside className="ticket-detail-side">
        <section className="ticket-panel"><h2>{copy.schedule}</h2>
          {schedule ? <><p className="ticket-state">{copy.scheduleStates[schedule.state]}</p><p>{scheduleLabel}</p></> : <p>{copy.noSchedule}</p>}
        </section>
        <section className="ticket-panel"><h2>{copy.submission}</h2>
          <dl className="ticket-summary">
            <dt>{copy.name}</dt><dd>{ticket.name}</dd>
            {ticket.company && <><dt>{copy.company}</dt><dd>{ticket.company}</dd></>}
            <dt>{copy.website}</dt><dd>{ticket.website}</dd>
            <dt>{copy.reason}</dt><dd>{ticket.reason}</dd>
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
