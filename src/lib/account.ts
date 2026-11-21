export const accountTabs = ['profile', 'tickets', 'security', 'settings'] as const;
export type AccountTab = typeof accountTabs[number];

export const profileContexts = ['', 'developer', 'security_researcher', 'client', 'owner'] as const;
export type ProfileContext = typeof profileContexts[number];

export function isAccountTab(value: unknown): value is AccountTab {
  return typeof value === 'string' && accountTabs.some((tab) => tab === value);
}

export function isProfileContext(value: unknown): value is ProfileContext {
  return typeof value === 'string' && profileContexts.some((item) => item === value);
}

export function accountTabHref(locale: 'id' | 'en', tab: AccountTab): string {
  return tab === 'profile' ? `/${locale}/account/` : `/${locale}/account/${tab}/`;
}

export function parseUserAgent(userAgent: string | null): { browser: string; os: string } {
  if (!userAgent) return { browser: '', os: '' };
  const browser = /Edg\//.test(userAgent) ? 'Microsoft Edge'
    : /OPR\/|Opera/.test(userAgent) ? 'Opera'
    : /Firefox\//.test(userAgent) ? 'Firefox'
    : /Chrome\//.test(userAgent) && !/Chromium\//.test(userAgent) ? 'Chrome'
    : /Safari\//.test(userAgent) && !/Chrome\//.test(userAgent) ? 'Safari'
    : /Chromium\//.test(userAgent) ? 'Chromium'
    : 'Browser';
  const os = /Windows NT/.test(userAgent) ? 'Windows'
    : /Mac OS X|Macintosh/.test(userAgent) ? 'macOS'
    : /Android/.test(userAgent) ? 'Android'
    : /iPhone|iPad|iOS/.test(userAgent) ? 'iOS'
    : /Linux/.test(userAgent) ? 'Linux'
    : '';
  return { browser, os };
}

export function accountDate(locale: 'id' | 'en', value: Date | string) {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    dateStyle: 'medium', timeZone: 'Asia/Jakarta',
  }).format(new Date(value));
}

export function accountDateTime(locale: 'id' | 'en', value: Date | string) {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta',
  }).format(new Date(value));
}
