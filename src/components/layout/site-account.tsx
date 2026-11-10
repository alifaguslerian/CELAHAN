'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type SiteAccount = { id: string; name: string; hasProjects: boolean; admin: boolean };

const SiteAccountContext = createContext<{
  account: SiteAccount | null | undefined;
  refreshAccount: () => Promise<void>;
} | null>(null);

export function SiteAccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<SiteAccount | null>();
  const current = useRef<SiteAccount | null | undefined>(undefined);
  const request = useRef<AbortController | null>(null);

  const refreshAccount = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    try {
      const response = await fetch('/api/account/', { cache: 'no-store', signal: controller.signal });
      if (!response.ok && response.status !== 401) return;
      const next: SiteAccount | null = response.ok ? (await response.json()).account : null;
      if (controller.signal.aborted) return;
      const previous = current.current;
      if (previous !== undefined && (previous?.id !== next?.id || previous?.admin !== next?.admin || previous?.hasProjects !== next?.hasProjects)) {
        window.location.reload();
        return;
      }
      current.current = next;
      setAccount(next);
    } catch { /* Protected routes still check the session if the account request fails. */ }
    finally { if (request.current === controller) request.current = null; }
  }, []);

  useEffect(() => {
    const initialCheck = window.setTimeout(refreshAccount, 0);
    const restore = (event: PageTransitionEvent) => { if (event.persisted) window.location.reload(); };
    window.addEventListener('pageshow', restore);
    window.addEventListener('focus', refreshAccount);
    return () => {
      window.clearTimeout(initialCheck);
      request.current?.abort();
      window.removeEventListener('pageshow', restore);
      window.removeEventListener('focus', refreshAccount);
    };
  }, [refreshAccount]);

  return <SiteAccountContext.Provider value={{ account, refreshAccount }}>{children}</SiteAccountContext.Provider>;
}

export function useSiteAccount() {
  const state = useContext(SiteAccountContext);
  if (!state) throw new Error('Site account provider is missing');
  return state;
}

export function PrivateAccountScope({ id, capability, children }: {
  id: string;
  capability?: 'admin' | 'hasProjects';
  children: ReactNode;
}) {
  const { account } = useSiteAccount();
  const changed = account !== undefined && (account?.id !== id || (capability !== undefined && !account[capability]));
  useEffect(() => {
    if (changed) window.location.reload();
  }, [changed]);
  return changed ? null : children;
}
