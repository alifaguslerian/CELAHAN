import { scopeCopy } from '@/content/scope';
import { scopeFields, ticketTimestamp, type ScopeProposal } from '@/lib/consultation';
import type { Locale } from '@/lib/routing';
import { ScopeForm, ScopeRefresh } from './scope-forms';

export function ScopeSummary({ locale, proposal, agreement = false }: { locale: Locale; proposal: ScopeProposal; agreement?: boolean }) {
  const copy = scopeCopy[locale];
  return <div className="scope-summary">
    <div className="scope-status">
      <strong>{agreement ? copy.agreedVersion : copy.version} {proposal.version}</strong>
      {proposal.decision && <span className="ticket-state">{copy[proposal.decision]}</span>}
    </div>
    <dl className="ticket-summary reading-fields">
      {scopeFields.filter(field => !agreement || field !== 'title').map(field => <div key={field}>
        <dt>{copy.fields[field]}</dt><dd className="ticket-text">{proposal[field]}</dd>
      </div>)}
    </dl>
    {proposal.decision_note && <p className="scope-response ticket-text">{proposal.decision_note}</p>}
    <div className="scope-dates supporting-copy">
      <p>{copy.proposedAt} <time dateTime={new Date(proposal.proposed_at).toISOString()}>{ticketTimestamp(locale, proposal.proposed_at)}</time></p>
      {proposal.decided_at && <p>{copy.decidedAt} <time dateTime={new Date(proposal.decided_at).toISOString()}>{ticketTimestamp(locale, proposal.decided_at)}</time></p>}
    </div>
  </div>;
}

export function TicketScope({ locale, accountId, endpoint, version, proposals, admin, editable, latest }: {
  locale: Locale; accountId: string; endpoint: string; version: number; proposals: ScopeProposal[];
  admin: boolean; editable: boolean; latest: boolean;
}) {
  const copy = scopeCopy[locale];
  const current = latest ? proposals[0] : undefined;
  const history = latest ? proposals.slice(1) : proposals;
  if (!latest && !history.length) return null;
  return <section className="ticket-panel" aria-labelledby="ticket-scope-heading">
    <h2 id="ticket-scope-heading" tabIndex={-1}>{copy.heading}</h2>
    {current && <ScopeSummary locale={locale} proposal={current} />}
    {latest && !current && <p>{copy.waiting}</p>}
    {editable && current && !current.decision && <p>{copy.awaiting}</p>}
    {editable && (admin || (current && !current.decision)) && (admin && current
      ? <details className="scope-history"><summary>{copy.edit}</summary>
        <ScopeForm locale={locale} accountId={accountId} endpoint={endpoint} version={version} scope={current} admin />
      </details>
      : <ScopeForm locale={locale} accountId={accountId} endpoint={endpoint} version={version} scope={current} admin={admin} />)}
    {editable && <ScopeRefresh locale={locale} />}
    {history.length > 0 && <div className="scope-history">
      <h3>{copy.previous}</h3>
      {history.map(proposal => <details key={proposal.version}>
        <summary>{copy.version} {proposal.version} · {proposal.decision ? copy[proposal.decision] : copy.pendingHistory}</summary>
        <ScopeSummary locale={locale} proposal={proposal} />
      </details>)}
    </div>}
  </section>;
}
