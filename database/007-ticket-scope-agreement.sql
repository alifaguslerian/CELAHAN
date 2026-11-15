CREATE TABLE consultation_scope_proposal (
  ticket_id uuid NOT NULL REFERENCES consultation_ticket(id),
  version integer NOT NULL CHECK (version > 0),
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 120),
  included text NOT NULL CHECK (char_length(included) BETWEEN 10 AND 2000),
  excluded text NOT NULL CHECK (char_length(excluded) BETWEEN 1 AND 2000),
  deliverables text NOT NULL CHECK (char_length(deliverables) BETWEEN 1 AND 2000),
  proposed_by text NOT NULL REFERENCES "user"(id),
  proposed_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  decision text CHECK (decision IN ('approved', 'changes_requested')),
  decision_note text CHECK (char_length(decision_note) BETWEEN 1 AND 3000),
  decided_by text REFERENCES "user"(id),
  decided_at timestamptz,
  PRIMARY KEY (ticket_id, version),
  CHECK (num_nonnulls(decision, decided_by, decided_at) IN (0, 3)),
  CHECK ((decision IS NOT DISTINCT FROM 'changes_requested') = (decision_note IS NOT NULL))
);

ALTER TABLE assessment_project ADD COLUMN scope_version integer,
  ADD CONSTRAINT assessment_project_scope_agreement_fk
  FOREIGN KEY (consultation_id, scope_version) REFERENCES consultation_scope_proposal(ticket_id, version);

ALTER TABLE consultation_event DROP CONSTRAINT consultation_event_kind_check;
ALTER TABLE consultation_event ADD CONSTRAINT consultation_event_kind_check
  CHECK (kind IN ('created', 'reply', 'clarify', 'outcome', 'propose', 'agree', 'confirm', 'close',
    'accept_retest', 'finish_retest', 'propose_scope', 'approve_scope', 'revise_scope'));

DROP FUNCTION public.create_assessment_project(text, uuid, text, text);
CREATE FUNCTION public.create_assessment_project(actor text, source_id uuid, approved_version integer)
RETURNS TABLE (result text, project_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
DECLARE
  source public.consultation_ticket%ROWTYPE;
  existing public.assessment_project%ROWTYPE;
  proposal public.consultation_scope_proposal%ROWTYPE;
  new_id uuid;
BEGIN
  PERFORM 1 FROM public."user" WHERE id = actor AND "accountEnabled" AND "emailVerified"
    AND role = 'admin' AND "twoFactorEnabled" FOR SHARE;
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
REVOKE ALL ON FUNCTION public.create_assessment_project(text, uuid, integer) FROM PUBLIC;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'celahan_app') THEN
    GRANT SELECT, INSERT ON consultation_scope_proposal TO celahan_app;
    GRANT UPDATE (decision, decision_note, decided_by, decided_at) ON consultation_scope_proposal TO celahan_app;
    GRANT EXECUTE ON FUNCTION public.create_assessment_project(text, uuid, integer) TO celahan_app;
  END IF;
END $$;
