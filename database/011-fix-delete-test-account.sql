CREATE OR REPLACE FUNCTION public.delete_test_account(actor text)
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
DECLARE
  target public."user"%ROWTYPE;
BEGIN
  SELECT * INTO target FROM public."user"
    WHERE id = delete_test_account.actor AND "accountEnabled" AND "emailVerified" FOR UPDATE;
  IF NOT FOUND THEN RETURN 'denied'; END IF;
  IF target.role <> 'user' THEN RETURN 'admin_protected'; END IF;

  PERFORM * FROM public.reset_user_simulation_data(delete_test_account.actor);

  DELETE FROM public.consultation_command WHERE actor_id = delete_test_account.actor;
  DELETE FROM public.consultation_note WHERE author_id = delete_test_account.actor;
  DELETE FROM public.assessment_project_command WHERE actor_id = delete_test_account.actor;
  DELETE FROM public.assessment_project_event WHERE actor_id = delete_test_account.actor;
  DELETE FROM public.privileged_audit WHERE subject_id = delete_test_account.actor;
  DELETE FROM public.verification WHERE identifier LIKE '%' || lower(target.email);
  DELETE FROM public."rateLimit" WHERE key IN ('profile:' || delete_test_account.actor, 'password:' || delete_test_account.actor);
  DELETE FROM public."user" WHERE id = delete_test_account.actor;

  RETURN 'ok';
END $$;
