import Image from 'next/image';
import Link from 'next/link';
import { homeCopy } from '@/content/home';
import { stages } from '@/content/public';
import type { Locale } from '@/lib/routing';
import { ConsultationLink } from './consultation-link';

function ChoiceIcon({ index }: { index: number }) {
  return <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    {index === 0 ? <><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7" /></> : index === 1 ? <><path d="m12 3 10 5-10 5L2 8zM3 12l9 5 9-5M3 16l9 5 9-5" /></> : <><circle cx="12" cy="12" r="10" /><path d="M9.5 8.5a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 16v1" /></>}
  </svg>;
}

export function Hero({ locale }: { locale: Locale }) {
  const copy = homeCopy[locale];
  return <section className="hero" aria-labelledby="intro-heading">
    <div className="hero-content container">
      <p className="hero-label">{copy.label}</p>
      <h1 id="intro-heading"><span>{copy.heading[0]}</span><span>{copy.heading[1]}</span></h1>
      <p className="hero-intro">{copy.intro}<br />{copy.introSecond}</p>
      <div className="hero-actions"><a className="primary-action" href="#context">{copy.explore}</a><a className="text-link" href="#process">{copy.processLink}</a></div>
    </div>
    <Image className="hero-scene" src="/artwork/glacier-steel-hero.webp" width={1600} height={533} alt="" loading="eager" fetchPriority="high" unoptimized />
  </section>;
}

export function ContextExplorer({ locale }: { locale: Locale }) {
  const copy = homeCopy[locale];
  return <section id="context" className="context-section section-space" aria-labelledby="context-heading">
    <div className="container context-layout">
      <h2 id="context-heading">{copy.contextHeading}</h2>
      <fieldset className="context-picker">
        <legend className="visually-hidden">{copy.contextHeading}</legend>
        <div className="context-options">{copy.choices.map(([label], index) => <div className="choice-item" key={label}>
          <input className="choice-input" type="radio" id={`context-choice-${index}`} name="context-choice" value={index} defaultChecked={index === 2} aria-controls={`context-panel-${index}`} />
          <label htmlFor={`context-choice-${index}`}><ChoiceIcon index={index} /><span>{label}</span></label>
        </div>)}</div>
        <div className="context-panels">{copy.choices.map(([label, title, body], index) => <div className="context-panel" id={`context-panel-${index}`} key={label} role="region" aria-label={label}>
          <p><strong>{title}</strong> {body}</p><div className="context-links"><Link className="inline-link" href={`/${locale}/privacy/`}>{copy.limitations}</Link>
            <ConsultationLink locale={locale} label={copy.consultation} /></div>
        </div>)}</div>
      </fieldset>
    </div>
  </section>;
}

export function ProcessExplorer({ locale }: { locale: Locale }) {
  const copy = homeCopy[locale];
  return <section id="process" className="home-process section-space" aria-labelledby="process-heading">
    <div className="container">
      <h2 id="process-heading">{copy.processHeading}</h2><p className="scope-note">{copy.processNote}</p>
      <fieldset className="process-picker">
        <legend className="visually-hidden">{copy.processHeading}</legend>
        <div className="stage-options">{stages.map((stage, index) => <div className="choice-item" key={stage.id[0]}>
          <input className="choice-input" type="radio" name="process-choice" id={`process-choice-${index}`} value={index} defaultChecked={index === 0} aria-controls={`process-panel-${index}`} />
          <label htmlFor={`process-choice-${index}`}><span className="stage-number">{String(index + 1).padStart(2, '0')}</span><span>{stage[locale][0]}</span></label>
        </div>)}</div>
        <div className="process-panels">{copy.stageDetails.map(([title, body], index) => <div className="process-panel" id={`process-panel-${index}`} key={title} role="region" aria-labelledby={`process-detail-${index}`}>
          <div className="process-detail-copy"><span className="detail-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3 id={`process-detail-${index}`}>{title}</h3><p>{body}</p></div>
        </div>)}<Image className="process-art" src="/artwork/glacier-steel-detail.webp" width={1000} height={333} alt="" unoptimized /></div>
      </fieldset>
    </div>
  </section>;
}

export function AccountInvitation({ locale }: { locale: Locale }) {
  const copy = homeCopy[locale];
  return <section className="account-invitation section-space" aria-labelledby="access-heading">
    <div className="container account-invitation-layout">
      <div className="access-copy"><h2 id="access-heading">{copy.accountHeading}</h2><p>{copy.accountBody}</p><p className="supporting-copy">{copy.accountNote}</p></div>
      <div className="access-actions"><Link className="primary-action" href={`/${locale}/login/`} prefetch={false}>{copy.accountAction}</Link><Link className="inline-link" href={`/${locale}/privacy/`}>{copy.privacy}</Link></div>
    </div>
    <Image className="account-art" src="/artwork/glacier-steel-account.webp" width={1000} height={667} alt="" unoptimized />
  </section>;
}

export function Closing({ locale }: { locale: Locale }) {
  const copy = homeCopy[locale];
  return <section className="closing section-space" aria-labelledby="closing-heading">
    <div className="container"><h2 id="closing-heading">{copy.closing}</h2><a className="primary-action" href="#context">{copy.explore}</a></div>
    <Image className="closing-art" src="/artwork/glacier-steel-detail.webp" width={1000} height={333} alt="" unoptimized />
  </section>;
}
