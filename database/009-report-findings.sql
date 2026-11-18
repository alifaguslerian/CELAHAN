ALTER TABLE project_follow_up ADD COLUMN finding_numbers integer[] NOT NULL DEFAULT '{}',
  ADD COLUMN finding_results text[],
  DROP CONSTRAINT project_follow_up_check1,
  ADD CONSTRAINT follow_up_finding_numbers CHECK (
    (kind = 'retest' OR cardinality(finding_numbers) = 0)
    AND cardinality(finding_numbers) <= 6
    AND array_position(finding_numbers, NULL) IS NULL
    AND finding_numbers <@ ARRAY[1,2,3,4,5,6]
  ),
  ADD CONSTRAINT follow_up_results_match_state CHECK (
    CASE WHEN retest_state IS DISTINCT FROM 'completed' THEN
      retest_result IS NULL AND finding_results IS NULL
    WHEN cardinality(finding_numbers) = 0 THEN
      retest_result IS NOT NULL AND finding_results IS NULL
    ELSE
      retest_result IS NULL AND finding_results IS NOT NULL
      AND cardinality(finding_results) = cardinality(finding_numbers)
      AND array_position(finding_results, NULL) IS NULL
      AND finding_results <@ ARRAY['resolved_in_example','unresolved_in_example','not_verified']
    END
  );

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'celahan_app') THEN
    GRANT UPDATE (finding_results) ON project_follow_up TO celahan_app;
  END IF;
END $$;
