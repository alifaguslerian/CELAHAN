export type Locale = 'id' | 'en';
export const packageIds = ['scout', 'warden', 'nexus', 'atlas'] as const;
export type PackageId = typeof packageIds[number];

export function isPackageId(value: unknown): value is PackageId {
  return packageIds.some((id) => id === value);
}

export function isLocale(value: string): value is Locale {
  return value === 'id' || value === 'en';
}

export function localeHref(pathname: string, locale: Locale, hash = '', returnTo?: string | null, interest?: string | null): string {
  const match = /^\/(?:id|en)(?:\/(login|register|account(?:\/(?:verify-email|recovery|reset-password|two-factor))?|tickets|projects|admin|services(?:\/(?:scout|warden|nexus|atlas))?|process|report|about|privacy|request))?\/?$/.exec(pathname);
  if (!match) return `/${locale}/`;
  const destination = match[1] ? `${match[1]}/` : '';
  const homeAnchor = !destination && ['#about', '#boundaries', '#packages', '#process', '#report', '#faq', '#consultation'].includes(hash);
  const reportAnchor = destination === 'report/' && /^#finding-f-0[1-5]$/.test(hash);
  const anchor = homeAnchor || reportAnchor ? hash : '';
  const accountEntry = /^(?:login|register|account\/(?:verify-email|recovery|reset-password|two-factor))\/$/.test(destination);
  let intent = accountEntry && (returnTo === 'account' || returnTo === 'request') ? `?next=${returnTo}` : '';
  if (isPackageId(interest) && (destination === 'request/' || (accountEntry && returnTo === 'request'))) intent += `${intent ? '&' : '?'}package=${interest}`;
  return `/${locale}/${destination}${intent}${anchor}`;
}

export function requestHref(locale: Locale, interest?: unknown): string {
  return `/${locale}/request/${isPackageId(interest) ? `?package=${interest}` : ''}`;
}

export function loginDestination(next: unknown, locale: Locale, interest?: unknown): string {
  if (next === 'account') return `/${locale}/account/`;
  if (next === 'request') return requestHref(locale, interest);
  return `/${locale}/`;
}
