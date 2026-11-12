'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { usePortalSubmission } from '@/components/consultation/forms';
import { consultationCopy } from '@/content/consultation';
import { followUpCopy } from '@/content/follow-up';
import { disclaimer } from '@/content/shell';
import { isTicketId } from '@/lib/consultation';
import type { FollowUpKind } from '@/lib/follow-up';
import type { Locale } from '@/lib/routing';

export function FollowUpForm({ locale, accountId, projectId, reportId, canRetest }: {
  locale: Locale; accountId: string; projectId: string; reportId: string; canRetest: boolean;
}) {
  const copy = followUpCopy[locale];
  const shared = consultationCopy[locale];
  const endpoint = `/api/projects/${projectId}/follow-up/`;
  const router = useRouter();
  const write = usePortalSubmission(locale, accountId, endpoint, { ...shared, errors: copy.errors });
  const [choice, setChoice] = useState<FollowUpKind>('question');
  const kind = canRetest ? choice : 'question';

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    void write.submit({ kind, reportId, body: data.get('body') }, result => {
      if (!isTicketId(result.id)) throw new Error('Unexpected ticket response');
      write.clearDraft();
      router.push(`/${locale}/tickets/${result.id}/`);
    }, () => router.refresh());
  }

  return <form method="post" action={endpoint} className="consultation-form" onSubmit={submit}>
    <fieldset disabled={write.disabled}>
      {canRetest && <div role="group" aria-label={copy.requestType} className="follow-up-options">
        {(['question', 'retest'] as const).map(option => <label className="consultation-check" key={option}>
          <input type="radio" name="follow-up-kind" checked={kind === option} onChange={() => setChoice(option)} />{copy[option]}
        </label>)}
      </div>}
      <label>{kind === 'retest' ? copy.retestBody : copy.questionBody}
        <textarea name="body" required minLength={10} maxLength={3000} rows={4} onChange={write.markDirty} />
      </label>
      <p className="supporting-copy">{copy.demo}</p>
      <p className="disclaimer" lang="id">{disclaimer.id}</p>
      {locale === 'en' && <p className="disclaimer" lang="en">{disclaimer.en}</p>}
      <button className="primary-action" type="submit">{write.pending ? shared.save : copy[kind]}</button>
    </fieldset>
    {write.feedback}
    <noscript><p>{shared.js}</p></noscript>
  </form>;
}
