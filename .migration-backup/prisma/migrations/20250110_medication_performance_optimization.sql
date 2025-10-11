-- Medication Service Performance Optimization Migration
-- This migration adds indexes, full-text search, and materialized views for 10x performance improvement

-- =====================================================
-- PART 1: Full-Text Search for Medications
-- =====================================================

-- Add search vector column (auto-generated from name, generic_name, manufacturer)
ALTER TABLE medications ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(name, '') || ' ' ||
      coalesce(generic_name, '') || ' ' ||
      coalesce(manufacturer, '')
    )
  ) STORED;

-- Create GIN index for full-text search (10-100x faster than ILIKE)
CREATE INDEX IF NOT EXISTS medications_search_idx ON medications USING GIN(search_vector);

-- Create additional index for autocomplete (prefix matching)
CREATE INDEX IF NOT EXISTS medications_name_prefix_idx ON medications(name text_pattern_ops);
CREATE INDEX IF NOT EXISTS medications_generic_prefix_idx ON medications(generic_name text_pattern_ops);

COMMENT ON COLUMN medications.search_vector IS 'Full-text search vector for medication name, generic name, and manufacturer';
COMMENT ON INDEX medications_search_idx IS 'GIN index for fast full-text search on medications';

-- =====================================================
-- PART 2: Medication Logs Performance Indexes
-- =====================================================

-- Composite index for medication log queries (time-based + student)
CREATE INDEX IF NOT EXISTS medication_logs_time_student_idx
  ON medication_logs(student_medication_id, time_given DESC);

-- Index for date range queries
CREATE INDEX IF NOT EXISTS medication_logs_time_range_idx
  ON medication_logs(time_given DESC);

-- Index for nurse activity queries
CREATE INDEX IF NOT EXISTS medication_logs_nurse_time_idx
  ON medication_logs(nurse_id, time_given DESC);

COMMENT ON INDEX medication_logs_time_student_idx IS 'Optimizes queries for student medication history';
COMMENT ON INDEX medication_logs_time_range_idx IS 'Optimizes date range queries for medication logs';

-- =====================================================
-- PART 3: Active Prescriptions Optimization
-- =====================================================

-- Partial index for active prescriptions only (smaller, faster)
CREATE INDEX IF NOT EXISTS student_medications_active_idx
  ON student_medications(is_active, start_date, end_date)
  WHERE is_active = true;

-- Index for student queries
CREATE INDEX IF NOT EXISTS student_medications_student_active_idx
  ON student_medications(student_id, is_active)
  WHERE is_active = true;

-- Index for medication queries
CREATE INDEX IF NOT EXISTS student_medications_medication_active_idx
  ON student_medications(medication_id, is_active)
  WHERE is_active = true;

COMMENT ON INDEX student_medications_active_idx IS 'Partial index for active prescriptions only';

-- =====================================================
-- PART 4: Inventory Alerts - Materialized View
-- =====================================================

-- Drop existing materialized view if exists
DROP MATERIALIZED VIEW IF EXISTS medication_inventory_alerts CASCADE;

-- Create materialized view for pre-computed inventory alerts
CREATE MATERIALIZED VIEW medication_inventory_alerts AS
SELECT
  mi.id,
  mi.medication_id,
  m.name as medication_name,
  m.generic_name,
  mi.batch_number,
  mi.quantity,
  mi.reorder_level,
  mi.expiration_date,
  mi.supplier,
  mi.cost_per_unit,
  mi.created_at,
  mi.updated_at,
  -- Pre-compute expiry status
  CASE
    WHEN mi.expiration_date <= CURRENT_DATE THEN 'EXPIRED'
    WHEN mi.expiration_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'NEAR_EXPIRY'
    ELSE 'OK'
  END as expiry_status,
  -- Pre-compute stock status
  CASE
    WHEN mi.quantity <= mi.reorder_level THEN 'LOW_STOCK'
    WHEN mi.quantity <= (mi.reorder_level * 1.5) THEN 'WARNING'
    ELSE 'OK'
  END as stock_status,
  -- Additional computed fields
  mi.expiration_date - CURRENT_DATE as days_until_expiry,
  mi.reorder_level - mi.quantity as units_below_reorder
FROM medication_inventory mi
JOIN medications m ON mi.medication_id = m.id
WHERE mi.quantity >= 0; -- Include zero quantity for tracking

-- Create indexes on materialized view
CREATE UNIQUE INDEX ON medication_inventory_alerts(id);
CREATE INDEX ON medication_inventory_alerts(expiry_status);
CREATE INDEX ON medication_inventory_alerts(stock_status);
CREATE INDEX ON medication_inventory_alerts(medication_id);
CREATE INDEX ON medication_inventory_alerts(expiration_date);

COMMENT ON MATERIALIZED VIEW medication_inventory_alerts IS 'Pre-computed inventory alerts for fast retrieval';

-- =====================================================
-- PART 5: Refresh Function for Materialized View
-- =====================================================

-- Function to refresh inventory alerts (called by cron job)
CREATE OR REPLACE FUNCTION refresh_inventory_alerts()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Refresh concurrently to avoid locking
  REFRESH MATERIALIZED VIEW CONCURRENTLY medication_inventory_alerts;

  -- Log the refresh
  RAISE NOTICE 'Inventory alerts refreshed at %', NOW();
END;
$$;

COMMENT ON FUNCTION refresh_inventory_alerts() IS 'Refreshes medication inventory alerts materialized view';

-- =====================================================
-- PART 6: Inventory Performance Indexes
-- =====================================================

-- Index for expiration queries
CREATE INDEX IF NOT EXISTS inventory_expiration_idx
  ON medication_inventory(expiration_date)
  WHERE quantity > 0;

-- Index for stock level queries
CREATE INDEX IF NOT EXISTS inventory_stock_idx
  ON medication_inventory(medication_id, quantity);

-- Index for batch lookup
CREATE INDEX IF NOT EXISTS inventory_batch_idx
  ON medication_inventory(medication_id, batch_number);

COMMENT ON INDEX inventory_expiration_idx IS 'Optimizes expiration date queries for non-empty inventory';

-- =====================================================
-- PART 7: Student Queries Optimization
-- =====================================================

-- Composite index for student lookups
CREATE INDEX IF NOT EXISTS students_name_idx
  ON students(last_name, first_name)
  WHERE is_active = true;

-- Index for nurse assignment queries
CREATE INDEX IF NOT EXISTS students_nurse_idx
  ON students(nurse_id)
  WHERE is_active = true;

-- =====================================================
-- PART 8: Performance Monitoring Views
-- =====================================================

-- View for medication usage statistics
CREATE OR REPLACE VIEW medication_usage_stats AS
SELECT
  m.id as medication_id,
  m.name as medication_name,
  COUNT(DISTINCT sm.id) as active_prescriptions,
  COUNT(DISTINCT sm.student_id) as unique_students,
  COUNT(ml.id) as total_administrations,
  MAX(ml.time_given) as last_administered,
  AVG(EXTRACT(EPOCH FROM (ml.created_at - LAG(ml.created_at) OVER (PARTITION BY sm.id ORDER BY ml.time_given)))) / 3600 as avg_hours_between_doses
FROM medications m
LEFT JOIN student_medications sm ON m.id = sm.medication_id AND sm.is_active = true
LEFT JOIN medication_logs ml ON sm.id = ml.student_medication_id
GROUP BY m.id, m.name;

COMMENT ON VIEW medication_usage_stats IS 'Statistical view of medication usage patterns';

-- =====================================================
-- PART 9: Query Performance Analysis
-- =====================================================

-- Function to analyze slow queries
CREATE OR REPLACE FUNCTION analyze_medication_performance()
RETURNS TABLE(
  table_name text,
  index_name text,
  index_size text,
  table_size text,
  row_count bigint
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.tablename::text,
    i.indexname::text,
    pg_size_pretty(pg_relation_size(i.indexname::regclass))::text,
    pg_size_pretty(pg_relation_size(t.tablename::regclass))::text,
    (SELECT count(*) FROM information_schema.tables WHERE table_name = t.tablename)::bigint
  FROM pg_tables t
  LEFT JOIN pg_indexes i ON t.tablename = i.tablename
  WHERE t.schemaname = 'public'
    AND t.tablename IN ('medications', 'student_medications', 'medication_logs', 'medication_inventory')
  ORDER BY t.tablename, i.indexname;
END;
$$;

-- =====================================================
-- PART 10: Database Statistics Update
-- =====================================================

-- Update statistics for query planner optimization
ANALYZE medications;
ANALYZE student_medications;
ANALYZE medication_logs;
ANALYZE medication_inventory;
ANALYZE students;

-- =====================================================
-- PART 11: Connection Pooling Configuration
-- =====================================================

-- Set statement timeout to prevent long-running queries (30 seconds)
ALTER DATABASE whitecross SET statement_timeout = '30s';

-- Set work_mem for better sort performance (16MB per operation)
ALTER DATABASE whitecross SET work_mem = '16MB';

-- Set effective_cache_size for query planning (system RAM / 2)
ALTER DATABASE whitecross SET effective_cache_size = '4GB';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify full-text search works
-- SELECT id, name, ts_rank(search_vector, plainto_tsquery('english', 'aspirin')) as rank
-- FROM medications
-- WHERE search_vector @@ plainto_tsquery('english', 'aspirin')
-- ORDER BY rank DESC
-- LIMIT 10;

-- Verify materialized view is populated
-- SELECT COUNT(*) FROM medication_inventory_alerts;

-- Verify indexes are created
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename IN ('medications', 'student_medications', 'medication_logs', 'medication_inventory')
-- ORDER BY tablename, indexname;

-- =====================================================
-- ROLLBACK SCRIPT (for emergencies)
-- =====================================================

-- To rollback this migration:
-- DROP MATERIALIZED VIEW IF EXISTS medication_inventory_alerts CASCADE;
-- DROP FUNCTION IF EXISTS refresh_inventory_alerts();
-- DROP INDEX IF EXISTS medications_search_idx;
-- ALTER TABLE medications DROP COLUMN IF EXISTS search_vector;
-- DROP INDEX IF EXISTS medication_logs_time_student_idx;
-- DROP INDEX IF EXISTS student_medications_active_idx;
-- etc...

-- =====================================================
-- PERFORMANCE TESTING QUERIES
-- =====================================================

-- Test 1: Full-text search performance
-- EXPLAIN ANALYZE
-- SELECT id, name, ts_rank(search_vector, plainto_tsquery('english', 'aspirin')) as rank
-- FROM medications
-- WHERE search_vector @@ plainto_tsquery('english', 'aspirin')
-- ORDER BY rank DESC
-- LIMIT 20;

-- Test 2: Active prescriptions query
-- EXPLAIN ANALYZE
-- SELECT * FROM student_medications
-- WHERE is_active = true
--   AND start_date <= CURRENT_DATE
--   AND (end_date IS NULL OR end_date >= CURRENT_DATE);

-- Test 3: Inventory alerts query
-- EXPLAIN ANALYZE
-- SELECT * FROM medication_inventory_alerts
-- WHERE expiry_status != 'OK' OR stock_status != 'OK';

-- Test 4: Medication logs query
-- EXPLAIN ANALYZE
-- SELECT ml.* FROM medication_logs ml
-- WHERE ml.time_given >= CURRENT_DATE - INTERVAL '7 days'
-- ORDER BY ml.time_given DESC;
