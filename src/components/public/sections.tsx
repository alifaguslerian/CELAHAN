import Link from 'next/link';
import { publicCopy, stages } from '@/content/public';
import type { Locale } from '@/lib/routing';
import { requestHref } from '@/lib/routing';

export function SectionHeading({ lines, id }: { lines: readonly [string, string]; id?: string }) {
  return <h2 className="section-heading" id={id}><span>{lines[0]}</span>{' '}<em>{lines[1]}</em></h2>;
}

export function ProcessSteps({ locale, headingLevel = 'h3' }: { locale: Locale; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel;
  return <ol className="process-grid">{stages.map((stage, index) => <li key={stage.id[0]} id={`stage-${index + 1}`}>
    <span className="step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    <Heading>{stage[locale][0]}</Heading><p>{stage[locale][1]}</p>
  </li>)}</ol>;
}

export function FAQ({ locale }: { locale: Locale }) {
  return <div className="faq-list">{publicCopy[locale].faqs.map(([question, answer], index) => <details key={question} name="common-questions"><summary><span className="faq-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{question}</span><span className="faq-toggle" aria-hidden="true" /></summary><div className="faq-answer"><p>{answer}</p></div></details>)}</div>;
}

export function ConsultationInvitation({ locale }: { locale: Locale }) {
  const copy = publicCopy[locale];
  return <section id="consultation" className="consultation-invitation" aria-labelledby="consultation-heading">
    <div><p className="eyebrow">{copy.requestTitle}</p><SectionHeading lines={copy.invitation} id="consultation-heading" /><p>{copy.invitationBody}</p></div>
    <div className="consultation-action"><Link className="primary-action" href={requestHref(locale)} prefetch={false}>{copy.consultation}<span aria-hidden="true">↗</span></Link><p>{copy.requestPending}</p></div>
  </section>;
}
