CREATE TABLE consultation_ticket (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  owner_id text NOT NULL REFERENCES "user"(id),
  request_key uuid NOT NULL,
  request_hash text NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 80),
  company text NOT NULL CHECK (char_length(company) <= 120),
  website text NOT NULL CHECK (char_length(website) BETWEEN 1 AND 2048),
  need text NOT NULL CHECK (need IN ('reactive', 'preventive', 'unsure_mixed')),
  reason text NOT NULL CHECK (char_length(reason) BETWEEN 1 AND 160),
  description text NOT NULL CHECK (char_length(description) BETWEEN 10 AND 3000),
  authority_declared boolean NOT NULL CHECK (authority_declared),
  status text NOT NULL DEFAULT 'review' CHECK (status IN ('review', 'awaiting_owner', 'answered', 'closed')),
  outcome text,
  close_reason text,
  schedule_at timestamptz,
  schedule_zone text,
  schedule_state text CHECK (schedule_state IN ('proposed', 'agreed', 'confirmed')),
  schedule_by text CHECK (schedule_by IN ('owner', 'admin')),
  schedule_admin_id text REFERENCES "user"(id),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id, request_key),
  CHECK ((status = 'closed') = (close_reason IS NOT NULL)),
  CHECK (num_nonnulls(schedule_at, schedule_zone, schedule_state, schedule_by) IN (0, 4)),
  CHECK ((schedule_state IS NOT DISTINCT FROM 'confirmed') = (schedule_admin_id IS NOT NULL))
);

CREATE INDEX consultation_ticket_owner_order ON consultation_ticket (owner_id, updated_at DESC, id DESC);
CREATE INDEX consultation_ticket_queue_order ON consultation_ticket (updated_at DESC, id DESC);
CREATE UNIQUE INDEX consultation_ticket_owner_slot ON consultation_ticket (owner_id, schedule_at)
  WHERE schedule_state = 'confirmed' AND status <> 'closed';
CREATE UNIQUE INDEX consultation_ticket_admin_slot ON consultation_ticket (schedule_admin_id, schedule_at)
  WHERE schedule_state = 'confirmed' AND status <> 'closed';

CREATE TABLE consultation_event (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ticket_id uuid NOT NULL REFERENCES consultation_ticket(id),
  actor text NOT NULL CHECK (actor IN ('owner', 'admin')),
  kind text NOT NULL CHECK (kind IN ('created', 'reply', 'clarify', 'outcome', 'propose', 'agree', 'confirm', 'close')),
  body text CHECK (char_length(body) <= 3000),
  schedule_at timestamptz,
  schedule_zone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX consultation_event_history ON consultation_event (ticket_id, id DESC);

CREATE TABLE consultation_note (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ticket_id uuid NOT NULL REFERENCES consultation_ticket(id),
  author_id text NOT NULL REFERENCES "user"(id),
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 3000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX consultation_note_history ON consultation_note (ticket_id, id DESC);

CREATE TABLE consultation_command (
  ticket_id uuid NOT NULL REFERENCES consultation_ticket(id),
  actor_id text NOT NULL REFERENCES "user"(id),
  view text NOT NULL CHECK (view IN ('owner', 'admin')),
  request_key uuid NOT NULL,
  request_hash text NOT NULL,
  PRIMARY KEY (ticket_id, actor_id, view, request_key)
);

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'celahan_app') THEN
    GRANT SELECT, INSERT ON consultation_ticket, consultation_event, consultation_note, consultation_command TO celahan_app;
    GRANT UPDATE (status, outcome, close_reason, schedule_at, schedule_zone, schedule_state, schedule_by, schedule_admin_id, version, updated_at) ON consultation_ticket TO celahan_app;
    GRANT USAGE ON SEQUENCE consultation_event_id_seq, consultation_note_id_seq TO celahan_app;
  END IF;
END $$;
