CREATE OR REPLACE FUNCTION public.create_assessment_project(actor text, source_id uuid, approved_version integer)
RETURNS TABLE (result text, project_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
DECLARE
  source public.consultation_ticket%ROWTYPE;
  existing public.assessment_project%ROWTYPE;
  proposal public.consultation_scope_proposal%ROWTYPE;
  new_id uuid;
BEGIN
  PERFORM 1 FROM public."user" WHERE id = actor AND "accountEnabled" AND "emailVerified"
    AND role = 'admin' FOR SHARE;
  IF NOT FOUND THEN RETURN QUERY SELECT 'denied'::text, NULL::uuid; RETURN; END IF;

  SELECT * INTO source FROM public.consultation_ticket WHERE id = source_id FOR UPDATE;
  IF NOT FOUND THEN RETURN QUERY SELECT 'missing'::text, NULL::uuid; RETURN; END IF;
  PERFORM 1 FROM public."user" WHERE id = source.owner_id AND "accountEnabled" AND "emailVerified" FOR SHARE;
  IF NOT FOUND THEN RETURN QUERY SELECT 'denied'::text, NULL::uuid; RETURN; END IF;

  SELECT * INTO existing FROM public.assessment_project WHERE consultation_id = source_id;
  IF FOUND THEN
    IF existing.scope_version = approved_version THEN RETURN QUERY SELECT 'ok'::text, existing.id;
    ELSE RETURN QUERY SELECT 'conflict'::text, NULL::uuid;
    END IF;
    RETURN;
  END IF;
  IF source.status = 'closed' OR EXISTS (SELECT 1 FROM public.project_follow_up WHERE ticket_id = source_id) THEN
    RETURN QUERY SELECT 'conflict'::text, NULL::uuid; RETURN;
  END IF;

  SELECT * INTO proposal FROM public.consultation_scope_proposal
    WHERE ticket_id = source_id ORDER BY version DESC LIMIT 1;
  IF NOT FOUND OR proposal.version IS DISTINCT FROM approved_version OR proposal.decision IS DISTINCT FROM 'approved'
    OR proposal.decided_by IS DISTINCT FROM source.owner_id THEN
    RETURN QUERY SELECT 'conflict'::text, NULL::uuid; RETURN;
  END IF;

  INSERT INTO public.project_access(owner_id) VALUES (source.owner_id) RETURNING id INTO new_id;
  INSERT INTO public.assessment_project(id, consultation_id, title, scope, scope_version)
    VALUES (new_id, source_id, proposal.title, proposal.included, proposal.version);
  INSERT INTO public.assessment_project_event(project_id, actor_id, kind) VALUES (new_id, actor, 'created');
  RETURN QUERY SELECT 'ok'::text, new_id;
END $$;
-- Existing passwords, sessions and authorization data are retained.
DELETE FROM verification WHERE left(identifier, 4) = '2fa-' OR left(identifier, 13) = 'trust-device-';
DELETE FROM "rateLimit" WHERE split_part(key, '|', 2) LIKE '/two-factor/%';
DROP TABLE "twoFactor";
ALTER TABLE "user" DROP COLUMN "twoFactorEnabled";
