ALTER TABLE consultation_ticket
  ADD COLUMN package_code text CHECK (package_code IN ('website-public-v1', 'account-data-v1', 'application-admin-v1'));
