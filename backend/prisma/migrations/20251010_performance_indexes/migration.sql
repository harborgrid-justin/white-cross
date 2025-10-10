-- Performance optimization indexes for health records service
-- Generated: 2025-10-10

-- Health Records table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_health_records_student_date"
  ON "health_records"("studentId", "date" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_health_records_student_type"
  ON "health_records"("studentId", "type");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_health_records_date_type"
  ON "health_records"("date" DESC, "type");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_health_records_provider"
  ON "health_records"("provider") WHERE "provider" IS NOT NULL;

-- GIN index for JSON vital fields (PostgreSQL specific)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_health_records_vital_gin"
  ON "health_records" USING GIN ("vital");

-- Allergies table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_allergies_student_severity"
  ON "allergies"("studentId", "severity" DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_allergies_allergen"
  ON "allergies"("allergen");

-- Chronic Conditions table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_chronic_conditions_student_status"
  ON "chronic_conditions"("studentId", "status");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_chronic_conditions_next_review"
  ON "chronic_conditions"("nextReviewDate")
  WHERE "nextReviewDate" IS NOT NULL AND "status" = 'ACTIVE';

-- Students table indexes (if not already present)
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_students_nurse"
  ON "students"("nurseId") WHERE "nurseId" IS NOT NULL;

-- Composite index for search operations
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_health_records_search"
  ON "health_records"
  USING GIN (to_tsvector('english',
    COALESCE("description", '') || ' ' ||
    COALESCE("notes", '') || ' ' ||
    COALESCE("provider", '')
  ));

-- Partial index for active records only
CREATE INDEX CONCURRENTLY IF NOT EXISTS "idx_students_active"
  ON "students"("isActive", "nurseId")
  WHERE "isActive" = true;

-- Analyze tables to update statistics
ANALYZE "health_records";
ANALYZE "allergies";
ANALYZE "chronic_conditions";
ANALYZE "students";
