export type Locale = 'id' | 'en';

export function isLocale(value: string): value is Locale {
  return value === 'id' || value === 'en';
}

export function localeHref(pathname: string, locale: Locale, hash = '', returnTo?: string | null): string {
  const match = /^\/(?:id|en)(?:\/(login|register|account(?:\/(?:verify-email|recovery|reset-password|two-factor))?|tickets|projects|admin))?\/?$/.exec(pathname);
  if (!match) return `/${locale}/`;
  const destination = match[1] ? `${match[1]}/` : '';
  const anchor = !destination && ['#about', '#boundaries'].includes(hash) ? hash : '';
  const intent = destination === 'login/' && returnTo === 'account' ? '?next=account' : '';
  return `/${locale}/${destination}${intent}${anchor}`;
}
