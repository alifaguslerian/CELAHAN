ALTER TABLE public.privileged_audit
  DROP CONSTRAINT IF EXISTS privileged_audit_action_check;

ALTER TABLE public.privileged_audit
  ADD CONSTRAINT privileged_audit_action_check
  CHECK (action IN ('grant_admin', 'revoke_admin', 'disable_account', 'enable_account', 'revoke_sessions'));

CREATE INDEX IF NOT EXISTS privileged_audit_created_idx
  ON public.privileged_audit (created_at DESC, id DESC);

CREATE FUNCTION public.admin_list_accounts(actor_id text)
RETURNS TABLE (
  id text,
  name text,
  email text,
  role text,
  account_enabled boolean,
  email_verified boolean,
  created_at timestamptz,
  providers text[],
  active_sessions integer,
  ticket_count integer
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
BEGIN
  PERFORM 1 FROM public."user" u
    WHERE u.id = actor_id AND u.role = 'admin' AND u."accountEnabled" AND u."emailVerified";
  IF NOT FOUND THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.name,
    u.email,
    u.role,
    u."accountEnabled" AS account_enabled,
    u."emailVerified" AS email_verified,
    u."createdAt" AS created_at,
    COALESCE(
      (SELECT array_agg(DISTINCT a."providerId" ORDER BY a."providerId")
         FROM public.account a WHERE a."userId" = u.id),
      '{}'::text[]
    ) AS providers,
    (SELECT count(*)::integer FROM public.session s
       WHERE s."userId" = u.id AND s."expiresAt" > now()) AS active_sessions,
    (SELECT count(*)::integer FROM public.consultation_ticket t
       WHERE t.owner_id = u.id) AS ticket_count
  FROM public."user" u
  ORDER BY (u.role = 'admin') DESC, u."createdAt" DESC
  LIMIT 100;
END $$;
REVOKE ALL ON FUNCTION public.admin_list_accounts(text) FROM PUBLIC;

CREATE FUNCTION public.admin_list_audit_log(actor_id text)
RETURNS TABLE (
  id uuid,
  actor text,
  action text,
  subject_id text,
  subject_email text,
  created_at timestamptz
)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
BEGIN
  PERFORM 1 FROM public."user" u
    WHERE u.id = actor_id AND u.role = 'admin' AND u."accountEnabled" AND u."emailVerified";
  IF NOT FOUND THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    pa.id,
    pa.actor,
    pa.action,
    pa.subject_id,
    COALESCE(u.email, '[deleted]') AS subject_email,
    pa.created_at
  FROM public.privileged_audit pa
  LEFT JOIN public."user" u ON u.id = pa.subject_id
  ORDER BY pa.created_at DESC, pa.id DESC
  LIMIT 50;
END $$;
REVOKE ALL ON FUNCTION public.admin_list_audit_log(text) FROM PUBLIC;

CREATE FUNCTION public.admin_update_account_access(actor_id text, target_id text, requested_action text)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
DECLARE
  target public."user"%ROWTYPE;
BEGIN
  PERFORM 1 FROM public."user" u
    WHERE u.id = actor_id AND u.role = 'admin' AND u."accountEnabled" AND u."emailVerified"
    FOR SHARE;
  IF NOT FOUND THEN
    RETURN 'denied';
  END IF;

  IF requested_action NOT IN ('disable_account', 'enable_account', 'revoke_sessions') THEN
    RETURN 'invalid_action';
  END IF;

  IF actor_id = target_id THEN
    RETURN 'self_protected';
  END IF;

  SELECT * INTO target FROM public."user" u WHERE u.id = target_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN 'not_found';
  END IF;

  IF target.role <> 'user' THEN
    RETURN 'admin_protected';
  END IF;

  IF requested_action = 'disable_account' THEN
    UPDATE public."user" SET "accountEnabled" = false, "updatedAt" = now() WHERE id = target_id;
    DELETE FROM public.session WHERE "userId" = target_id;
  ELSIF requested_action = 'enable_account' THEN
    UPDATE public."user" SET "accountEnabled" = true, "updatedAt" = now() WHERE id = target_id;
  ELSIF requested_action = 'revoke_sessions' THEN
    DELETE FROM public.session WHERE "userId" = target_id;
  END IF;

  INSERT INTO public.privileged_audit(actor, action, subject_id)
  VALUES ('admin:' || actor_id, requested_action, target_id);

  RETURN 'ok';
END $$;
REVOKE ALL ON FUNCTION public.admin_update_account_access(text, text, text) FROM PUBLIC;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'celahan_app') THEN
    GRANT EXECUTE ON FUNCTION public.admin_list_accounts(text) TO celahan_app;
    GRANT EXECUTE ON FUNCTION public.admin_list_audit_log(text) TO celahan_app;
    GRANT EXECUTE ON FUNCTION public.admin_update_account_access(text, text, text) TO celahan_app;
  END IF;
END $$;
