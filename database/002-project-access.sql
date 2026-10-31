CREATE TABLE project_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id text NOT NULL REFERENCES "user"(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX project_access_owner_idx ON project_access(owner_id);

CREATE TABLE privileged_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor text NOT NULL,
  action text NOT NULL CHECK (action IN ('grant_admin', 'revoke_admin', 'disable_account', 'enable_account')),
  subject_id text NOT NULL REFERENCES "user"(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
