import { findings } from '@/content/findings';
import { publicCopy } from '@/content/public';
import type { Locale } from '@/lib/routing';

export function Findings({ locale }: { locale: Locale }) {
  const copy = publicCopy[locale];
  return <div className="findings">
    <div className="finding-columns" aria-hidden="true">{[copy.finding, copy.category, copy.location, copy.score, copy.status].map((label) => <span key={label}>{label}</span>)}</div>
    <ol className="finding-list">
      {findings.map((item) => <li key={item.id}>
        <details id={`finding-${item.id.toLowerCase()}`}>
          <summary className="finding-row">
            <span className="finding-title"><span className="finding-id">{item.id}</span>{item.title[locale]}<span className="finding-toggle" aria-hidden="true">+</span></span>
            <span><span className="field-label">{copy.category}</span>{item.category}</span>
            <span><span className="field-label">{copy.location}</span><code>{item.location[locale]}</code></span>
            <span><span className="field-label">{copy.score}</span><span className="severity">{new Intl.NumberFormat(locale, { minimumFractionDigits: 1 }).format(item.score)} {item.severity}</span></span>
            <span><span className="field-label">{copy.status}</span><span className="finding-status">{item.status[locale]}</span></span>
          </summary>
          <div className="finding-explanation">
            <h3>{copy.explanation}</h3><p>{item.explanation[locale]}</p>
            <h3>{copy.guidance}</h3><p>{item.guidance[locale]}</p>
            {locale === 'en' && <p className="source-title">{copy.original}: <span lang="id">{item.title.id}</span></p>}
            <p className="field-help">{copy.reportLabel}</p>
          </div>
        </details>
      </li>)}
    </ol>
  </div>;
}
