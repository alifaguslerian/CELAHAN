CREATE TABLE assessment_project (
  id uuid PRIMARY KEY REFERENCES project_access(id),
  consultation_id uuid NOT NULL UNIQUE REFERENCES consultation_ticket(id),
  title text NOT NULL CHECK (char_length(title) BETWEEN 2 AND 120),
  scope text NOT NULL CHECK (char_length(scope) BETWEEN 10 AND 2000),
  stage text NOT NULL DEFAULT 'created' CHECK (stage IN ('created', 'preparing', 'published')),
  first_report_id uuid,
  support_started_at timestamptz,
  support_expires_at timestamptz,
  support_policy text,
  CHECK (num_nonnulls(first_report_id, support_started_at, support_expires_at, support_policy) IN (0, 4)),
  CHECK (support_expires_at > support_started_at)
);

CREATE TABLE project_report_version (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES assessment_project(id),
  version integer NOT NULL CHECK (version > 0),
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  state text NOT NULL DEFAULT 'draft' CHECK (state IN ('draft', 'published', 'superseded', 'withdrawn')),
  body jsonb NOT NULL CHECK (jsonb_typeof(body) = 'object'),
  change_note text NOT NULL CHECK (char_length(change_note) <= 1000),
  published_at timestamptz,
  UNIQUE (project_id, version),
  UNIQUE (project_id, id),
  CHECK ((state = 'draft') = (published_at IS NULL))
);

CREATE UNIQUE INDEX project_one_draft ON project_report_version(project_id) WHERE state = 'draft';
CREATE UNIQUE INDEX project_one_published_report ON project_report_version(project_id) WHERE state = 'published';
ALTER TABLE assessment_project ADD CONSTRAINT assessment_project_first_report_fk
  FOREIGN KEY (id, first_report_id) REFERENCES project_report_version(project_id, id) DEFERRABLE;

CREATE TABLE assessment_project_event (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES assessment_project(id),
  actor_id text NOT NULL REFERENCES "user"(id),
  kind text NOT NULL CHECK (kind IN ('created', 'preparing', 'published', 'withdrawn')),
  report_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (project_id, report_id) REFERENCES project_report_version(project_id, id),
  CHECK ((kind IN ('published', 'withdrawn')) = (report_id IS NOT NULL))
);
CREATE INDEX assessment_project_event_history ON assessment_project_event(project_id, id DESC);

CREATE TABLE assessment_project_command (
  project_id uuid NOT NULL REFERENCES assessment_project(id),
  actor_id text NOT NULL REFERENCES "user"(id),
  request_id uuid NOT NULL,
  request_hash text NOT NULL,
  PRIMARY KEY (project_id, actor_id, request_id)
);

CREATE FUNCTION public.w5a_support_expiry(started_at timestamptz) RETURNS timestamptz
LANGUAGE sql STABLE STRICT SET search_path = pg_catalog AS $$
  SELECT date_add(started_at, interval '3 months', 'Asia/Jakarta')
$$;

CREATE FUNCTION public.guard_report_version() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
  IF OLD.state <> 'draft' AND (
    OLD.body IS DISTINCT FROM NEW.body OR OLD.change_note IS DISTINCT FROM NEW.change_note
    OR OLD.revision IS DISTINCT FROM NEW.revision OR OLD.published_at IS DISTINCT FROM NEW.published_at
    OR (NEW.state <> OLD.state AND (OLD.state <> 'published' OR NEW.state NOT IN ('superseded', 'withdrawn')))
  ) THEN RAISE EXCEPTION 'Published report content is immutable';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER guard_report_version BEFORE UPDATE ON project_report_version
FOR EACH ROW EXECUTE FUNCTION public.guard_report_version();

CREATE FUNCTION public.guard_first_report() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
  IF OLD.first_report_id IS NOT NULL AND ROW(OLD.first_report_id, OLD.support_started_at, OLD.support_expires_at, OLD.support_policy)
     IS DISTINCT FROM ROW(NEW.first_report_id, NEW.support_started_at, NEW.support_expires_at, NEW.support_policy)
  THEN RAISE EXCEPTION 'The first report and support period are immutable';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER guard_first_report BEFORE UPDATE ON assessment_project
FOR EACH ROW EXECUTE FUNCTION public.guard_first_report();

-- Runtime can assign access only through this checked operation.
CREATE FUNCTION public.create_assessment_project(actor text, source_id uuid, project_title text, project_scope text)
RETURNS TABLE (result text, project_id uuid)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
DECLARE
  source public.consultation_ticket%ROWTYPE;
  existing public.assessment_project%ROWTYPE;
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
    IF existing.title = project_title AND existing.scope = project_scope THEN
      RETURN QUERY SELECT 'ok'::text, existing.id;
    ELSE RETURN QUERY SELECT 'conflict'::text, NULL::uuid;
    END IF;
    RETURN;
  END IF;
  IF source.status = 'closed' OR source.outcome IS NULL THEN
    RETURN QUERY SELECT 'conflict'::text, NULL::uuid; RETURN;
  END IF;

  INSERT INTO public.project_access(owner_id) VALUES (source.owner_id) RETURNING id INTO new_id;
  INSERT INTO public.assessment_project(id, consultation_id, title, scope)
    VALUES (new_id, source_id, project_title, project_scope);
  INSERT INTO public.assessment_project_event(project_id, actor_id, kind) VALUES (new_id, actor, 'created');
  RETURN QUERY SELECT 'ok'::text, new_id;
END $$;
REVOKE ALL ON FUNCTION public.create_assessment_project(text, uuid, text, text) FROM PUBLIC;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'celahan_app') THEN
    GRANT EXECUTE ON FUNCTION public.create_assessment_project(text, uuid, text, text) TO celahan_app;
    GRANT SELECT ON assessment_project, project_report_version, assessment_project_event, assessment_project_command TO celahan_app;
    GRANT INSERT (project_id, version, body, change_note) ON project_report_version TO celahan_app;
    GRANT INSERT (project_id, actor_id, kind, report_id) ON assessment_project_event TO celahan_app;
    GRANT INSERT ON assessment_project_command TO celahan_app;
    GRANT UPDATE (stage, first_report_id, support_started_at, support_expires_at, support_policy) ON assessment_project TO celahan_app;
    GRANT UPDATE (revision, state, body, change_note, published_at) ON project_report_version TO celahan_app;
    GRANT USAGE ON SEQUENCE assessment_project_event_id_seq TO celahan_app;
  END IF;
END $$;
