import { stages } from '@/content/public';
import { homeCopy } from '@/content/home';
import type { Locale } from '@/lib/routing';

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
  return <div className="faq-list">{homeCopy[locale].faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary><span>{question}</span><span className="faq-toggle" aria-hidden="true" /></summary><div className="faq-answer"><p>{answer}</p></div></details>)}</div>;
}
