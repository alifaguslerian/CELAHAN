import { isTicketId } from './consultation.ts';
import { isPackageCode } from './packages.ts';

export type Locale = 'id' | 'en';
export function isLocale(value: string): value is Locale {
  return value === 'id' || value === 'en';
}

export function localeHref(pathname: string, locale: Locale, hash = '', returnTo?: string | null, packageCode?: unknown): string {
  const detail = /^\/(?:id|en)\/(tickets|projects|admin\/(?:tickets|projects))\/([^/]+)\/?$/.exec(pathname);
  if (detail && isTicketId(detail[2])) return `/${locale}/${detail[1]}/${detail[2]}/`;
  const match = /^\/(?:id|en)(?:\/(login|register|account(?:\/(?:verify-email|recovery|reset-password|two-factor))?|tickets|projects|admin|process|about|privacy|request|packages))?\/?$/.exec(pathname);
  if (!match) return `/${locale}/`;
  const destination = match[1] ? `${match[1]}/` : '';
  const anchor = (!destination && ['#about', '#boundaries', '#process', '#faq', '#consultation', '#context'].includes(hash))
    || (destination === 'packages/' && isPackageCode(hash.slice(1)) && hash.startsWith('#')) ? hash : '';
  const accountEntry = /^(?:login|register|account\/(?:verify-email|recovery|reset-password|two-factor))\/$/.test(destination);
  const intent = accountEntry && (returnTo === 'account' || returnTo === 'request') ? `?next=${returnTo}` : '';
  if (destination === 'request/') return requestHref(locale, packageCode);
  const selected = intent === '?next=request' && isPackageCode(packageCode) ? `&package=${packageCode}` : '';
  return `/${locale}/${destination}${intent}${selected}${anchor}`;
}

export function requestHref(locale: Locale, packageCode?: unknown): string {
  return `/${locale}/request/${isPackageCode(packageCode) ? `?package=${packageCode}` : ''}`;
}

export function loginDestination(next: unknown, locale: Locale, packageCode?: unknown): string {
  if (next === 'account') return `/${locale}/account/`;
  if (next === 'request') return requestHref(locale, packageCode);
  return `/${locale}/`;
}
