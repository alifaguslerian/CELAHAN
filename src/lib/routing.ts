export type Locale = 'id' | 'en';

export function isLocale(value: string): value is Locale {
  return value === 'id' || value === 'en';
}

export function localeHref(pathname: string, locale: Locale, hash = ''): string {
  const match = /^\/(?:id|en)(?:\/(login|register))?\/?$/.exec(pathname);
  if (!match) return `/${locale}/`;
  const destination = match[1] ? `${match[1]}/` : '';
  const anchor = !destination && ['#about', '#boundaries'].includes(hash) ? hash : '';
  return `/${locale}/${destination}${anchor}`;
}
