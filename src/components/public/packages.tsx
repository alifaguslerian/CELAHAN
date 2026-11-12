import Link from 'next/link';
import { packageCopy } from '@/content/packages';
import { packageCodes, packagePrices } from '@/lib/packages';
import { requestHref, type Locale } from '@/lib/routing';

export function PackageCards({ locale, detailed = false }: { locale: Locale; detailed?: boolean }) {
  const copy = packageCopy[locale];
  const price = new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en', { maximumFractionDigits: 0 });
  const Heading = detailed ? 'h2' : 'h3';

  return <div className="package-grid">
    {packageCodes.map(code => {
      const item = copy.items[code];
      const label = detailed ? copy.choose : copy.view;
      return <article className="package-card" key={code} id={detailed ? code : undefined}>
        <Heading>{item.name}</Heading>
        {detailed ? <>
          <p className="package-price">{locale === 'id' ? 'Rp' : 'IDR '}{price.format(packagePrices[code])}</p>
          <p className="package-audience">{item.audience}</p>
          <ul className="package-scope">{item.scope.map(line => <li key={line}>{line}</li>)}</ul>
        </> : <p>{item.summary}</p>}
        <Link className="primary-action" href={detailed ? requestHref(locale, code) : `/${locale}/packages/#${code}`}
          prefetch={detailed ? false : undefined} aria-label={`${label} — ${item.name}`}>{label}</Link>
      </article>;
    })}
  </div>;
}

export function PackagePreview({ locale }: { locale: Locale }) {
  const copy = packageCopy[locale];
  return <section className="package-preview section-space" aria-labelledby="package-preview-title">
    <div className="container">
      <h2 id="package-preview-title">{copy.previewTitle}</h2>
      <p className="package-intro">{copy.intro}</p>
      <PackageCards locale={locale} />
    </div>
  </section>;
}
