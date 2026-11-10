import { isTicketId } from './consultation.ts';

export type Locale = 'id' | 'en';
export function isLocale(value: string): value is Locale {
  return value === 'id' || value === 'en';
}

export function localeHref(pathname: string, locale: Locale, hash = '', returnTo?: string | null): string {
  const detail = /^\/(?:id|en)\/(tickets|admin\/tickets)\/([^/]+)\/?$/.exec(pathname);
  if (detail && isTicketId(detail[2])) return `/${locale}/${detail[1]}/${detail[2]}/`;
  const match = /^\/(?:id|en)(?:\/(login|register|account(?:\/(?:verify-email|recovery|reset-password|two-factor))?|tickets|projects|admin|process|about|privacy|request))?\/?$/.exec(pathname);
  if (!match) return `/${locale}/`;
  const destination = match[1] ? `${match[1]}/` : '';
  const anchor = !destination && ['#about', '#boundaries', '#process', '#faq', '#consultation', '#context'].includes(hash) ? hash : '';
  const accountEntry = /^(?:login|register|account\/(?:verify-email|recovery|reset-password|two-factor))\/$/.test(destination);
  const intent = accountEntry && (returnTo === 'account' || returnTo === 'request') ? `?next=${returnTo}` : '';
  return `/${locale}/${destination}${intent}${anchor}`;
}

export function requestHref(locale: Locale): string {
  return `/${locale}/request/`;
}

export function loginDestination(next: unknown, locale: Locale): string {
  if (next === 'account') return `/${locale}/account/`;
  if (next === 'request') return requestHref(locale);
  return `/${locale}/`;
}
