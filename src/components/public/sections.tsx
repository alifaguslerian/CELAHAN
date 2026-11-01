import Link from 'next/link';
import { publicCopy, stages } from '@/content/public';
import type { Locale } from '@/lib/routing';
import { requestHref } from '@/lib/routing';

export function SectionHeading({ lines, id }: { lines: readonly [string, string]; id?: string }) {
  return <h2 className="section-heading" id={id}><span>{lines[0]}</span>{' '}<em>{lines[1]}</em></h2>;
}

export function ProcessSteps({ locale }: { locale: Locale }) {
  return <ol className="process-grid">{stages.map((stage, index) => <li key={stage.id[0]} id={`stage-${index + 1}`}>
    <span className="step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    <h3>{stage[locale][0]}</h3><p>{stage[locale][1]}</p>
  </li>)}</ol>;
}

export function FAQ({ locale }: { locale: Locale }) {
  return <div className="faq-list">{publicCopy[locale].faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>;
}

export function ConsultationInvitation({ locale }: { locale: Locale }) {
  const copy = publicCopy[locale];
  return <section id="consultation" className="consultation-invitation" aria-labelledby="consultation-heading">
    <div><SectionHeading lines={copy.invitation} id="consultation-heading" /><p>{copy.invitationBody}</p></div>
    <Link className="primary-action" href={requestHref(locale)} prefetch={false}>{copy.consultation}<span aria-hidden="true">↗</span></Link>
  </section>;
}
