CREATE TABLE project_follow_up (
  ticket_id uuid PRIMARY KEY REFERENCES consultation_ticket(id) ON DELETE CASCADE,
  project_id uuid NOT NULL,
  report_id uuid NOT NULL,
  kind text NOT NULL CHECK (kind IN ('question', 'retest')),
  retest_state text CHECK (retest_state IN ('pending', 'accepted', 'completed', 'canceled')),
  retest_result text CHECK (retest_result IN ('resolved_in_example', 'unresolved_in_example', 'not_verified')),
  FOREIGN KEY (project_id, report_id) REFERENCES project_report_version(project_id, id) ON DELETE CASCADE,
  CHECK ((kind = 'retest') = (retest_state IS NOT NULL)),
  CHECK ((retest_state IS NOT DISTINCT FROM 'completed') = (retest_result IS NOT NULL))
);

CREATE INDEX project_follow_up_project ON project_follow_up (project_id, ticket_id);
CREATE UNIQUE INDEX project_one_retest_cycle ON project_follow_up(project_id)
  WHERE retest_state IN ('pending', 'accepted', 'completed');

ALTER TABLE consultation_event DROP CONSTRAINT consultation_event_kind_check;
ALTER TABLE consultation_event ADD CONSTRAINT consultation_event_kind_check
  CHECK (kind IN ('created', 'reply', 'clarify', 'outcome', 'propose', 'agree', 'confirm', 'close', 'accept_retest', 'finish_retest'));

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'celahan_app') THEN
    GRANT SELECT, INSERT ON project_follow_up TO celahan_app;
    GRANT UPDATE (retest_state, retest_result) ON project_follow_up TO celahan_app;
  END IF;
END $$;
