'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { confirmationCopy } from '@/content/confirmation';
import type { Locale } from '@/lib/routing';

type Prompt = { title: string; description: string; action: string; caution?: boolean };
type Request = Prompt & { accept: () => void };
type Confirmation = {
  confirm: (prompt: Prompt, accept: () => void) => void;
  hasDraft: (key: symbol) => boolean;
  setDraft: (key: symbol, prompt?: Prompt) => void;
  clearDrafts: () => void;
};

const ConfirmationContext = createContext<Confirmation | null>(null);

export function useActionConfirmation() {
  const context = useContext(ConfirmationContext);
  if (!context) throw new Error('ActionConfirmationProvider is required');
  return context;
}

export function useUnsavedDraft(prompt: Prompt) {
  const key = useRef(Symbol());
  const { hasDraft, setDraft } = useActionConfirmation();
  useEffect(() => {
    const draftKey = key.current;
    return () => setDraft(draftKey);
  }, [setDraft]);
  return {
    isDirty: () => hasDraft(key.current),
    markDirty: () => setDraft(key.current, prompt),
    clearDraft: () => setDraft(key.current),
  };
}

export function ActionConfirmationProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  const [request, setRequest] = useState<Request | null>(null);
  const [hasUnsavedDrafts, setHasUnsavedDrafts] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const drafts = useRef(new Map<symbol, Prompt>());
  const trigger = useRef<HTMLElement | null>(null);
  const confirm = useCallback<Confirmation['confirm']>((prompt, accept) => {
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setRequest({ ...prompt, accept });
  }, []);
  const hasDraft = useCallback<Confirmation['hasDraft']>(key => drafts.current.has(key), []);
  const setDraft = useCallback<Confirmation['setDraft']>((key, prompt) => {
    const registered = drafts.current;
    const hadDrafts = registered.size !== 0;
    if (prompt) registered.set(key, prompt);
    else registered.delete(key);
    const hasDrafts = registered.size !== 0;
    if (hadDrafts !== hasDrafts) setHasUnsavedDrafts(hasDrafts);
  }, []);
  const clearDrafts = useCallback(() => {
    if (!drafts.current.size) return;
    drafts.current.clear();
    setHasUnsavedDrafts(false);
  }, []);
  const controls = useMemo(() => ({ confirm, hasDraft, setDraft, clearDrafts }), [confirm, hasDraft, setDraft, clearDrafts]);

  useEffect(() => {
    if (request && !dialog.current?.open) {
      dialog.current?.showModal();
      cancel.current?.focus();
    }
  }, [request]);

  useEffect(() => {
    if (!hasUnsavedDrafts) return;

    function beforeUnload(event: BeforeUnloadEvent) {
      if (!drafts.current.size) return;
      event.preventDefault();
      event.returnValue = true;
    }

    function beforeLink(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      const url = new URL(link.href);
      if (url.href === location.href || (url.origin === location.origin && url.pathname === location.pathname
        && url.search === location.search && url.hash)) return;
      const unsaved = [...drafts.current.values()];
      if (!unsaved.length) return;
      event.preventDefault();
      event.stopPropagation();
      confirm(unsaved.length === 1 ? unsaved[0] : confirmationCopy[locale].leave, () => {
        if (!link.isConnected) return;
        clearDrafts();
        link.click();
      });
    }

    window.addEventListener('beforeunload', beforeUnload);
    document.addEventListener('click', beforeLink, true);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      document.removeEventListener('click', beforeLink, true);
    };
  }, [clearDrafts, confirm, hasUnsavedDrafts, locale]);

  function dismiss(accepted: boolean) {
    dialog.current?.close();
    setRequest(null);
    trigger.current?.focus({ preventScroll: true });
    trigger.current = null;
    if (accepted) request?.accept();
  }

  const copy = confirmationCopy[locale];
  return <ConfirmationContext.Provider value={controls}>
    {children}
    <dialog ref={dialog} className="action-dialog" aria-labelledby="action-dialog-title" aria-describedby="action-dialog-description"
      onCancel={event => { event.preventDefault(); dismiss(false); }}>
      {request && <>
        <h2 id="action-dialog-title">{request.title}</h2>
        <p id="action-dialog-description">{request.description}</p>
        <div className="dialog-actions">
          <button ref={cancel} type="button" className="text-button" onClick={() => dismiss(false)}>{request.caution ? copy.stay : copy.cancel}</button>
          <button type="button" className="primary-action" onClick={() => dismiss(true)}>{request.action}</button>
        </div>
      </>}
    </dialog>
  </ConfirmationContext.Provider>;
}
