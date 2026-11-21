ALTER TABLE "user"
  ADD COLUMN profile_context text NOT NULL DEFAULT ''
    CHECK (profile_context IN ('', 'developer', 'security_researcher', 'client', 'owner')),
  ADD COLUMN preferred_locale text NOT NULL DEFAULT 'id'
    CHECK (preferred_locale IN ('id', 'en'));

CREATE FUNCTION public.reset_user_simulation_data(actor text)
RETURNS TABLE (result text, deleted_tickets integer)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
DECLARE
  project_ids uuid[];
  ticket_ids uuid[];
  removed integer := 0;
BEGIN
  PERFORM 1 FROM public."user"
    WHERE id = actor AND "accountEnabled" AND "emailVerified" FOR SHARE;
  IF NOT FOUND THEN
    RETURN QUERY SELECT 'denied'::text, 0;
    RETURN;
  END IF;

  SELECT COALESCE(array_agg(id), '{}'::uuid[]) INTO project_ids
    FROM public.project_access WHERE owner_id = actor;

  SELECT COALESCE(array_agg(id), '{}'::uuid[]) INTO ticket_ids
    FROM public.consultation_ticket
    WHERE owner_id = actor
       OR id IN (SELECT consultation_id FROM public.assessment_project WHERE id = ANY(project_ids));

  SET CONSTRAINTS public.assessment_project_first_report_fk DEFERRED;

  DELETE FROM public.project_follow_up
    WHERE project_id = ANY(project_ids) OR ticket_id = ANY(ticket_ids);
  DELETE FROM public.assessment_project_event WHERE project_id = ANY(project_ids);
  DELETE FROM public.assessment_project_command WHERE project_id = ANY(project_ids);
  DELETE FROM public.project_report_version WHERE project_id = ANY(project_ids);
  DELETE FROM public.assessment_project WHERE id = ANY(project_ids);
  DELETE FROM public.project_access WHERE id = ANY(project_ids);

  DELETE FROM public.consultation_scope_proposal WHERE ticket_id = ANY(ticket_ids);
  DELETE FROM public.consultation_command WHERE ticket_id = ANY(ticket_ids);
  DELETE FROM public.consultation_note WHERE ticket_id = ANY(ticket_ids);
  DELETE FROM public.consultation_event WHERE ticket_id = ANY(ticket_ids);
  DELETE FROM public.consultation_ticket WHERE id = ANY(ticket_ids);
  GET DIAGNOSTICS removed = ROW_COUNT;

  RETURN QUERY SELECT 'ok'::text, removed;
END $$;
REVOKE ALL ON FUNCTION public.reset_user_simulation_data(text) FROM PUBLIC;

CREATE FUNCTION public.delete_test_account(actor text)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
DECLARE
  target public."user"%ROWTYPE;
BEGIN
  SELECT * INTO target FROM public."user"
    WHERE id = actor AND "accountEnabled" AND "emailVerified" FOR UPDATE;
  IF NOT FOUND THEN RETURN 'denied'; END IF;
  IF target.role <> 'user' THEN RETURN 'admin_protected'; END IF;

  PERFORM * FROM public.reset_user_simulation_data(actor);

  DELETE FROM public.consultation_command WHERE actor_id = actor;
  DELETE FROM public.consultation_note WHERE author_id = actor;
  DELETE FROM public.assessment_project_command WHERE actor_id = actor;
  DELETE FROM public.assessment_project_event WHERE actor_id = actor;
  DELETE FROM public.privileged_audit WHERE subject_id = actor;
  DELETE FROM public.verification WHERE identifier LIKE '%' || lower(target.email);
  DELETE FROM public."rateLimit" WHERE key IN ('profile:' || actor, 'password:' || actor);
  DELETE FROM public."user" WHERE id = actor;

  RETURN 'ok';
END $$;
REVOKE ALL ON FUNCTION public.delete_test_account(text) FROM PUBLIC;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'celahan_app') THEN
    GRANT EXECUTE ON FUNCTION public.reset_user_simulation_data(text) TO celahan_app;
    GRANT EXECUTE ON FUNCTION public.delete_test_account(text) TO celahan_app;
  END IF;
END $$;
