import Link from 'next/link';
import { findings } from '@/content/findings';
import { publicCopy } from '@/content/public';
import { SectionHeading } from '@/components/public/sections';
import type { Locale } from '@/lib/routing';

export function ReportPreview({ locale }: { locale: Locale }) {
  const copy = publicCopy[locale];
  const rows = [findings[1], findings[3], findings[2]];
  const severities = ['High', 'Medium', 'Low'] as const;
  const score = new Intl.NumberFormat(locale, { minimumFractionDigits: 1 });

  return <section id="report" className="home-report" aria-labelledby="report-heading">
    <div className="report-preview-copy">
      <SectionHeading lines={copy.reportHeading} id="report-heading" />
      <p className="report-preview-intro">{copy.reportIntro}</p>
      <p className="preview-disclaimer">{copy.reportLabel}</p>
      <Link className="primary-action" href={`/${locale}/report/`}>{copy.viewReport}<span aria-hidden="true">→</span></Link>
    </div>
    <div className="report-preview-panel" aria-labelledby="preview-title">
      <header className="report-preview-header">
        <div><h3 id="preview-title">{copy.previewTitle}</h3><p>{rows.length} / {findings.length} {copy.previewShown}</p></div>
        <dl className="preview-risk-summary">{severities.map((severity) => <div key={severity} data-severity={severity}>
          <dt>{copy.riskLabels[severity]}</dt><dd>{rows.filter((item) => item.severity === severity).length}</dd>
        </div>)}</dl>
      </header>
      <ol className="preview-findings">{rows.map((item) => <li className="preview-finding" key={item.id}>
        <div className="preview-finding-main">
          <div className="preview-finding-title"><span className="finding-id">{item.id}</span><h4><Link href={`/${locale}/report/#finding-${item.id.toLowerCase()}`}>{item.title[locale]}</Link></h4></div>
          <dl className="preview-finding-meta">
            <div><dt className="visually-hidden">{copy.category}</dt><dd>{item.category}</dd></div>
            <div><dt className="visually-hidden">{copy.location}</dt><dd><code>{item.location[locale]}</code></dd></div>
          </dl>
        </div>
        <div className="preview-finding-result">
          <span className="preview-score" data-severity={item.severity}><span className="visually-hidden">{copy.score}: </span>{score.format(item.score)} <small>{item.severity}</small></span>
          <span className="preview-status" data-fixed={item.status.en === 'Fixed'}><span className="visually-hidden">{copy.status}: </span>{item.status[locale]}</span>
        </div>
      </li>)}</ol>
    </div>
  </section>;
}
