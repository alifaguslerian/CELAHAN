import Link from 'next/link';
import { packages } from '@/content/packages';
import { publicCopy } from '@/content/public';
import { requestHref, type Locale, type PackageId } from '@/lib/routing';
import { Pet } from './pet';
import { PetMotion } from './pet-motion';

export function ServicePage({ locale, selected }: { locale: Locale; selected: PackageId }) {
  const copy = publicCopy[locale];
  const item = packages.find((item) => item.id === selected)!;
  return <main id="main-content" className="public-page services-page" tabIndex={-1}>
    <section className="service-detail" aria-labelledby="package-heading">
      <div className="service-stage">
        <div className={`selected-pet selected-${item.id}`}><button type="button" className="pet-greet" aria-label={`${locale === 'id' ? 'Sapa' : 'Greet'} ${item.name}`} title={`${locale === 'id' ? 'Sapa' : 'Greet'} ${item.name}`}><PetMotion id={item.id} entrance /></button></div>
        <nav className="package-tabs" aria-label={copy.explore}>{packages.map((pack) => <a key={pack.id} href={`/${locale}/services/${pack.id}/`} aria-current={selected === pack.id ? 'page' : undefined}><Pet id={pack.id} /><span>{pack.name}</span></a>)}</nav>
      </div>
      <article className="package-sheet" aria-labelledby="package-heading">
        <h1 id="package-heading">{item.name}</h1>
        <p className="package-description">{item.description[locale]}{' '}{item.boundary[locale]}</p>
        <div className="package-actions"><Link className="primary-action" href={requestHref(locale, item.id)} prefetch={false}>{copy.consultation}<span aria-hidden="true">↗</span></Link>
        <a className="text-link" href="#compare">{copy.compare}<span aria-hidden="true">↓</span></a></div>
      </article>
    </section>
    <section id="compare" className="comparison-section" aria-labelledby="compare-heading"><h2 className="section-heading" id="compare-heading">{copy.compare}</h2>
      <p className="comparison-intro">{copy.sharedBody}</p>
      <div className="comparison-grid">{packages.map((pack) => <article key={pack.id}><h3><Link href={`/${locale}/services/${pack.id}/`}>{pack.name}<span aria-hidden="true">↗</span></Link></h3><p>{pack.fit[locale]}</p></article>)}</div>
      <div className="service-policies">
        <details><summary>{copy.scopeDetails}<span aria-hidden="true">+</span></summary><div><p>{copy.packageTerms}</p><p>{copy.numberHold}</p><p>{copy.unsureBody}</p></div></details>
        <details><summary>{copy.supportDetails}<span aria-hidden="true">+</span></summary><div><p>{copy.support}</p></div></details>
      </div>
    </section>
  </main>;
}
