-- =============================================================================
-- Audit Logs Table Migration
-- Created: 2025-10-28
-- Purpose: HIPAA and FERPA compliant audit logging
-- =============================================================================

-- Create enum types
CREATE TYPE audit_action AS ENUM (
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
  'EXPORT',
  'IMPORT',
  'BULK_DELETE',
  'BULK_UPDATE',
  'TRANSACTION_COMMIT',
  'TRANSACTION_ROLLBACK',
  'CACHE_READ',
  'CACHE_WRITE',
  'CACHE_DELETE'
);

CREATE TYPE compliance_type AS ENUM (
  'HIPAA',
  'FERPA',
  'GDPR',
  'GENERAL'
);

CREATE TYPE audit_severity AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
);

-- Create audit_logs table
CREATE TABLE audit_logs (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Action Information
  action audit_action NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id UUID,

  -- User Information
  user_id UUID,
  user_name VARCHAR(200),

  -- Change Tracking
  changes JSONB,
  previous_values JSONB,
  new_values JSONB,

  -- Request Context
  ip_address VARCHAR(45),
  user_agent TEXT,
  request_id VARCHAR(100),
  session_id VARCHAR(100),

  -- Compliance and Security
  is_phi BOOLEAN NOT NULL DEFAULT false,
  compliance_type compliance_type NOT NULL DEFAULT 'GENERAL',
  severity audit_severity NOT NULL DEFAULT 'LOW',

  -- Status
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,

  -- Additional Context
  metadata JSONB,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],

  -- Timestamp (immutable - no updated_at)
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add comments for documentation
COMMENT ON TABLE audit_logs IS 'HIPAA and FERPA compliant audit logging for all system operations';
COMMENT ON COLUMN audit_logs.action IS 'Type of action performed (CREATE, READ, UPDATE, DELETE, etc.)';
COMMENT ON COLUMN audit_logs.entity_type IS 'Type of entity affected (Student, HealthRecord, User, etc.)';
COMMENT ON COLUMN audit_logs.entity_id IS 'ID of the entity affected (null for bulk operations)';
COMMENT ON COLUMN audit_logs.user_id IS 'ID of user who performed the action (null for system operations)';
COMMENT ON COLUMN audit_logs.user_name IS 'Name of user who performed the action (denormalized for reporting)';
COMMENT ON COLUMN audit_logs.changes IS 'Complete change data (for backward compatibility)';
COMMENT ON COLUMN audit_logs.previous_values IS 'Previous values before the change (for UPDATE operations)';
COMMENT ON COLUMN audit_logs.new_values IS 'New values after the change (for CREATE/UPDATE operations)';
COMMENT ON COLUMN audit_logs.ip_address IS 'IP address of the client making the request';
COMMENT ON COLUMN audit_logs.user_agent IS 'User agent string of the client';
COMMENT ON COLUMN audit_logs.request_id IS 'Request correlation ID for tracing related operations';
COMMENT ON COLUMN audit_logs.session_id IS 'Session ID for grouping operations by user session';
COMMENT ON COLUMN audit_logs.is_phi IS 'Flag indicating if this audit log involves Protected Health Information';
COMMENT ON COLUMN audit_logs.compliance_type IS 'Compliance regulation this audit log relates to';
COMMENT ON COLUMN audit_logs.severity IS 'Severity level of the audited action';
COMMENT ON COLUMN audit_logs.success IS 'Whether the operation completed successfully';
COMMENT ON COLUMN audit_logs.error_message IS 'Error message if operation failed';
COMMENT ON COLUMN audit_logs.metadata IS 'Additional metadata for context (query params, filter criteria, etc.)';
COMMENT ON COLUMN audit_logs.tags IS 'Tags for categorization and filtering';
COMMENT ON COLUMN audit_logs.created_at IS 'Timestamp when the action was performed';

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Single-column indexes for common filters
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_is_phi ON audit_logs(is_phi);
CREATE INDEX idx_audit_logs_compliance_type ON audit_logs(compliance_type);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX idx_audit_logs_success ON audit_logs(success);
CREATE INDEX idx_audit_logs_session_id ON audit_logs(session_id);
CREATE INDEX idx_audit_logs_request_id ON audit_logs(request_id);

-- Composite indexes for common query patterns
CREATE INDEX idx_audit_logs_entity_history ON audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX idx_audit_logs_user_activity ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_action_entity_time ON audit_logs(action, entity_type, created_at DESC);
CREATE INDEX idx_audit_logs_phi_time ON audit_logs(is_phi, created_at DESC);
CREATE INDEX idx_audit_logs_compliance_time ON audit_logs(compliance_type, created_at DESC);
CREATE INDEX idx_audit_logs_severity_time ON audit_logs(severity, created_at DESC);

-- GIN indexes for JSONB and array fields (PostgreSQL specific)
CREATE INDEX idx_audit_logs_tags_gin ON audit_logs USING gin(tags);
CREATE INDEX idx_audit_logs_metadata_gin ON audit_logs USING gin(metadata);
CREATE INDEX idx_audit_logs_changes_gin ON audit_logs USING gin(changes);

-- =============================================================================
-- RETENTION POLICY FUNCTION (Optional - for automated cleanup)
-- =============================================================================

-- Function to execute retention policy
CREATE OR REPLACE FUNCTION execute_audit_retention_policy()
RETURNS TABLE(deleted_count INTEGER, details JSONB) AS $$
DECLARE
  hipaa_expired INTEGER;
  ferpa_expired INTEGER;
  general_expired INTEGER;
  total_deleted INTEGER;
BEGIN
  -- HIPAA: 7 years retention
  DELETE FROM audit_logs
  WHERE compliance_type = 'HIPAA'
    AND created_at < CURRENT_DATE - INTERVAL '7 years';
  GET DIAGNOSTICS hipaa_expired = ROW_COUNT;

  -- FERPA: 5 years retention
  DELETE FROM audit_logs
  WHERE compliance_type = 'FERPA'
    AND created_at < CURRENT_DATE - INTERVAL '5 years';
  GET DIAGNOSTICS ferpa_expired = ROW_COUNT;

  -- General: 3 years retention
  DELETE FROM audit_logs
  WHERE compliance_type = 'GENERAL'
    AND created_at < CURRENT_DATE - INTERVAL '3 years';
  GET DIAGNOSTICS general_expired = ROW_COUNT;

  total_deleted := hipaa_expired + ferpa_expired + general_expired;

  RETURN QUERY
  SELECT
    total_deleted,
    jsonb_build_object(
      'HIPAA_expired', hipaa_expired,
      'FERPA_expired', ferpa_expired,
      'GENERAL_expired', general_expired
    );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION execute_audit_retention_policy() IS 'Execute retention policy based on compliance requirements';

-- =============================================================================
-- SECURITY
-- =============================================================================

-- Prevent updates to audit logs (immutability)
CREATE OR REPLACE FUNCTION prevent_audit_log_updates()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable and cannot be updated';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_audit_log_updates
BEFORE UPDATE ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_log_updates();

COMMENT ON TRIGGER trigger_prevent_audit_log_updates ON audit_logs IS 'Prevents updates to audit logs to ensure immutability';

-- =============================================================================
-- TABLE STATISTICS
-- =============================================================================

-- Analyze the table for query optimization
ANALYZE audit_logs;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'audit_logs'
) AS table_exists;

-- Verify indexes exist
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'audit_logs'
ORDER BY indexname;

-- Verify trigger exists
SELECT
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'audit_logs';

-- =============================================================================
-- SAMPLE QUERIES FOR TESTING
-- =============================================================================

-- Test insert (should work)
-- INSERT INTO audit_logs (
--   action,
--   entity_type,
--   entity_id,
--   user_id,
--   user_name,
--   is_phi,
--   compliance_type,
--   severity,
--   success,
--   tags
-- ) VALUES (
--   'CREATE',
--   'Student',
--   gen_random_uuid(),
--   gen_random_uuid(),
--   'test@example.com',
--   true,
--   'HIPAA',
--   'LOW',
--   true,
--   ARRAY['test', 'student']
-- );

-- Test update (should fail with "Audit logs are immutable" error)
-- UPDATE audit_logs SET action = 'UPDATE' WHERE id = (SELECT id FROM audit_logs LIMIT 1);

-- Test query performance
-- EXPLAIN ANALYZE
-- SELECT * FROM audit_logs
-- WHERE user_id = 'some-uuid'
--   AND created_at >= CURRENT_DATE - INTERVAL '30 days'
-- ORDER BY created_at DESC
-- LIMIT 100;

-- =============================================================================
-- PARTITIONING SETUP (Optional - for high-volume systems)
-- =============================================================================

-- For systems with >1M audit logs, consider time-based partitioning
-- This is an example - adjust based on your retention and volume requirements

-- 1. Create partitioned table (replace the original CREATE TABLE with this)
-- CREATE TABLE audit_logs (
--   ... (same columns as above)
-- ) PARTITION BY RANGE (created_at);

-- 2. Create partitions (one per month)
-- CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs
--   FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- CREATE TABLE audit_logs_2024_02 PARTITION OF audit_logs
--   FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- etc...

-- 3. Create automated partition management function
-- (See PostgreSQL documentation for pg_partman extension)

-- =============================================================================
-- ROLLBACK SCRIPT (in case you need to undo this migration)
-- =============================================================================

-- DROP TRIGGER IF EXISTS trigger_prevent_audit_log_updates ON audit_logs;
-- DROP FUNCTION IF EXISTS prevent_audit_log_updates();
-- DROP FUNCTION IF EXISTS execute_audit_retention_policy();
-- DROP TABLE IF EXISTS audit_logs;
-- DROP TYPE IF EXISTS audit_severity;
-- DROP TYPE IF EXISTS compliance_type;
-- DROP TYPE IF EXISTS audit_action;

-- =============================================================================
-- COMPLETION
-- =============================================================================

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Audit logs table created successfully!';
  RAISE NOTICE 'Table: audit_logs';
  RAISE NOTICE 'Indexes: 19 indexes created';
  RAISE NOTICE 'Triggers: 1 trigger created';
  RAISE NOTICE 'Functions: 1 function created';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Verify table exists: SELECT * FROM audit_logs LIMIT 1;';
  RAISE NOTICE '2. Test insert: See sample queries above';
  RAISE NOTICE '3. Verify immutability: Try updating a record (should fail)';
  RAISE NOTICE '4. Start using audit service in your application';
END $$;
