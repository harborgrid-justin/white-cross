-- Performance Indexes Migration
-- Addresses N+1 query problems and missing indexes identified in audit
-- Date: 2025-10-11

-- ============================================
-- STUDENT-RELATED INDEXES
-- ============================================

-- Students by school (very common lookup)
CREATE INDEX IF NOT EXISTS "idx_students_school" ON "students"("schoolId") WHERE "isActive" = true;

-- Students by nurse (assignment queries)
CREATE INDEX IF NOT EXISTS "idx_students_nurse" ON "students"("nurseId") WHERE "isActive" = true;

-- Students by grade (filtering)
CREATE INDEX IF NOT EXISTS "idx_students_grade_active" ON "students"("grade", "isActive");

-- Student search (full-text search on names and student number)
CREATE INDEX IF NOT EXISTS "idx_students_search" ON "students"
  USING gin(to_tsvector('english', "firstName" || ' ' || "lastName" || ' ' || "studentNumber"));

-- ============================================
-- USER-RELATED INDEXES
-- ============================================

-- Users by school and district (multi-tenant queries)
CREATE INDEX IF NOT EXISTS "idx_users_school" ON "users"("schoolId") WHERE "isActive" = true;
CREATE INDEX IF NOT EXISTS "idx_users_district" ON "users"("districtId") WHERE "isActive" = true;

-- Users by role (permission checks)
CREATE INDEX IF NOT EXISTS "idx_users_role_active" ON "users"("role", "isActive");

-- User search
CREATE INDEX IF NOT EXISTS "idx_users_search" ON "users"
  USING gin(to_tsvector('english', "firstName" || ' ' || "lastName" || ' ' || "email"));

-- ============================================
-- MEDICATION-RELATED INDEXES
-- ============================================

-- Active student medications with date filtering
CREATE INDEX IF NOT EXISTS "idx_student_medications_active_dates" ON "student_medications"
  ("isActive", "startDate", "endDate") WHERE "isActive" = true;

-- Medications by student (very common query)
CREATE INDEX IF NOT EXISTS "idx_student_medications_student" ON "student_medications"("studentId", "isActive");

-- Medication administration logs by student and nurse
CREATE INDEX IF NOT EXISTS "idx_medication_logs_student" ON "medication_logs"("studentMedicationId", "timeGiven" DESC);
CREATE INDEX IF NOT EXISTS "idx_medication_logs_nurse" ON "medication_logs"("nurseId", "timeGiven" DESC);

-- Medication search
CREATE INDEX IF NOT EXISTS "idx_medications_search" ON "medications"
  USING gin(to_tsvector('english', "name" || ' ' || COALESCE("genericName", '')));

-- Medications by category
CREATE INDEX IF NOT EXISTS "idx_medications_category_active" ON "medications"("category", "isActive");

-- Low stock medications
CREATE INDEX IF NOT EXISTS "idx_medications_stock" ON "medications"("stockQuantity", "minimumStock")
  WHERE "isActive" = true AND "stockQuantity" <= "minimumStock";

-- Expiring medications
CREATE INDEX IF NOT EXISTS "idx_medications_expiration" ON "medications"("expirationDate", "isActive")
  WHERE "isActive" = true AND "expirationDate" IS NOT NULL;

-- ============================================
-- HEALTH RECORD INDEXES
-- ============================================

-- Health records by student and date (most common query pattern)
CREATE INDEX IF NOT EXISTS "idx_health_records_student_date" ON "health_records"
  ("studentId", "date" DESC, "recordType");

-- Health records by type
CREATE INDEX IF NOT EXISTS "idx_health_records_type_date" ON "health_records"
  ("recordType", "date" DESC);

-- Confidential health records (separate tracking)
CREATE INDEX IF NOT EXISTS "idx_health_records_confidential" ON "health_records"
  ("isConfidential", "studentId") WHERE "isConfidential" = true;

-- Health records by provider
CREATE INDEX IF NOT EXISTS "idx_health_records_provider" ON "health_records"
  ("providerNpi", "date" DESC) WHERE "providerNpi" IS NOT NULL;

-- ============================================
-- APPOINTMENT INDEXES
-- ============================================

-- Upcoming appointments by nurse
CREATE INDEX IF NOT EXISTS "idx_appointments_upcoming" ON "appointments"
  ("nurseId", "scheduledAt", "status")
  WHERE "status" IN ('SCHEDULED', 'IN_PROGRESS');

-- Appointments by student
CREATE INDEX IF NOT EXISTS "idx_appointments_student" ON "appointments"
  ("studentId", "scheduledAt" DESC, "status");

-- Appointments by date range
CREATE INDEX IF NOT EXISTS "idx_appointments_date_range" ON "appointments"
  ("scheduledAt", "status") WHERE "status" != 'CANCELLED';

-- ============================================
-- INCIDENT REPORT INDEXES
-- ============================================

-- Incident reports by student
CREATE INDEX IF NOT EXISTS "idx_incident_reports_student" ON "incident_reports"
  ("studentId", "occurredAt" DESC, "severity");

-- Incident reports by reporter
CREATE INDEX IF NOT EXISTS "idx_incident_reports_reporter" ON "incident_reports"
  ("reportedById", "occurredAt" DESC);

-- Incident reports by type and severity
CREATE INDEX IF NOT EXISTS "idx_incident_reports_filters" ON "incident_reports"
  ("type", "severity", "status", "occurredAt" DESC);

-- High/critical incidents
CREATE INDEX IF NOT EXISTS "idx_incident_reports_critical" ON "incident_reports"
  ("severity", "occurredAt" DESC, "status")
  WHERE "severity" IN ('HIGH', 'CRITICAL');

-- ============================================
-- EMERGENCY CONTACT INDEXES
-- ============================================

-- Emergency contacts by student
CREATE INDEX IF NOT EXISTS "idx_emergency_contacts_student" ON "emergency_contacts"
  ("studentId", "priority") WHERE "isActive" = true;

-- Primary emergency contacts
CREATE INDEX IF NOT EXISTS "idx_emergency_contacts_primary" ON "emergency_contacts"
  ("studentId", "isPrimary") WHERE "isPrimary" = true AND "isActive" = true;

-- ============================================
-- DOCUMENT INDEXES
-- ============================================

-- Documents by student
CREATE INDEX IF NOT EXISTS "idx_documents_student" ON "documents"
  ("studentId", "uploadedAt" DESC) WHERE "studentId" IS NOT NULL;

-- Documents by uploader
CREATE INDEX IF NOT EXISTS "idx_documents_uploader" ON "documents"
  ("uploadedById", "uploadedAt" DESC);

-- Documents by category
CREATE INDEX IF NOT EXISTS "idx_documents_category" ON "documents"
  ("category", "uploadedAt" DESC);

-- Expiring documents
CREATE INDEX IF NOT EXISTS "idx_documents_expiring" ON "documents"
  ("expirationDate", "category") WHERE "expirationDate" IS NOT NULL;

-- ============================================
-- AUDIT LOG INDEXES
-- ============================================

-- Audit logs by user (compliance queries)
CREATE INDEX IF NOT EXISTS "idx_audit_logs_user" ON "audit_logs"
  ("userId", "createdAt" DESC) WHERE "userId" IS NOT NULL;

-- Audit logs by entity (PHI access tracking)
CREATE INDEX IF NOT EXISTS "idx_audit_logs_entity" ON "audit_logs"
  ("entityType", "entityId", "action", "createdAt" DESC);

-- Audit logs by date range (compliance reporting)
CREATE INDEX IF NOT EXISTS "idx_audit_logs_date" ON "audit_logs"
  ("createdAt" DESC, "action", "entityType");

-- PHI export audits
CREATE INDEX IF NOT EXISTS "idx_audit_logs_export" ON "audit_logs"
  ("action", "createdAt" DESC) WHERE "action" = 'EXPORT';

-- ============================================
-- COMMUNICATION INDEXES
-- ============================================

-- Messages by sender
CREATE INDEX IF NOT EXISTS "idx_messages_sender" ON "messages"
  ("senderId", "sentAt" DESC);

-- Messages by recipient (many-to-many through junction table)
CREATE INDEX IF NOT EXISTS "idx_message_recipients_recipient" ON "message_recipients"
  ("recipientId", "status", "createdAt" DESC);

-- Unread messages
CREATE INDEX IF NOT EXISTS "idx_message_recipients_unread" ON "message_recipients"
  ("recipientId", "status") WHERE "status" = 'UNREAD';

-- ============================================
-- INVENTORY INDEXES
-- ============================================

-- Inventory by category and location
CREATE INDEX IF NOT EXISTS "idx_inventory_category" ON "inventory_items"
  ("category", "location", "isActive");

-- Low stock items
CREATE INDEX IF NOT EXISTS "idx_inventory_low_stock" ON "inventory_items"
  ("quantity", "minimumStock")
  WHERE "isActive" = true AND "quantity" <= "minimumStock";

-- Inventory transactions by item
CREATE INDEX IF NOT EXISTS "idx_inventory_transactions_item" ON "inventory_transactions"
  ("inventoryItemId", "transactionDate" DESC);

-- Inventory transactions by performer
CREATE INDEX IF NOT EXISTS "idx_inventory_transactions_performer" ON "inventory_transactions"
  ("performedBy", "transactionDate" DESC);

-- ============================================
-- COMPLIANCE INDEXES
-- ============================================

-- Compliance records by student
CREATE INDEX IF NOT EXISTS "idx_compliance_records_student" ON "compliance_records"
  ("studentId", "type", "status", "dueDate");

-- Compliance records by type and status
CREATE INDEX IF NOT EXISTS "idx_compliance_records_status" ON "compliance_records"
  ("type", "status", "dueDate") WHERE "status" != 'COMPLIANT';

-- Overdue compliance items
CREATE INDEX IF NOT EXISTS "idx_compliance_records_overdue" ON "compliance_records"
  ("dueDate", "status") WHERE "status" = 'PENDING' AND "dueDate" < CURRENT_DATE;

-- ============================================
-- SESSION INDEXES (Security)
-- ============================================

-- Active sessions by user
CREATE INDEX IF NOT EXISTS "idx_sessions_user_active" ON "sessions"
  ("userId", "lastActivity" DESC) WHERE "isActive" = true;

-- Session cleanup (expired sessions)
CREATE INDEX IF NOT EXISTS "idx_sessions_expired" ON "sessions"
  ("expiresAt") WHERE "isActive" = true AND "expiresAt" < CURRENT_TIMESTAMP;

-- ============================================
-- ALLERGIES AND CHRONIC CONDITIONS
-- ============================================

-- Allergies by student
CREATE INDEX IF NOT EXISTS "idx_allergies_student" ON "allergies"
  ("studentId", "severity") WHERE "isActive" = true;

-- Life-threatening allergies (critical for emergency response)
CREATE INDEX IF NOT EXISTS "idx_allergies_critical" ON "allergies"
  ("studentId", "severity")
  WHERE "isActive" = true AND "severity" = 'LIFE_THREATENING';

-- Chronic conditions by student
CREATE INDEX IF NOT EXISTS "idx_chronic_conditions_student" ON "chronic_conditions"
  ("studentId", "status") WHERE "status" = 'ACTIVE';

-- ============================================
-- VACCINATION INDEXES
-- ============================================

-- Vaccinations by student
CREATE INDEX IF NOT EXISTS "idx_vaccinations_student" ON "vaccinations"
  ("studentId", "administrationDate" DESC);

-- Vaccinations by type and compliance
CREATE INDEX IF NOT EXISTS "idx_vaccinations_compliance" ON "vaccinations"
  ("vaccineType", "complianceStatus", "administrationDate" DESC);

-- Upcoming vaccination due dates
CREATE INDEX IF NOT EXISTS "idx_vaccinations_due" ON "vaccinations"
  ("nextDueDate", "studentId")
  WHERE "nextDueDate" IS NOT NULL AND "nextDueDate" > CURRENT_DATE;

-- ============================================
-- PARTIAL INDEXES FOR PERFORMANCE
-- ============================================

-- Only index active records to reduce index size
-- Most queries filter by isActive=true anyway

-- Note: Many indexes above already include WHERE clauses
-- to create partial indexes for better performance

-- ============================================
-- COMPOSITE INDEXES FOR COMMON QUERY PATTERNS
-- ============================================

-- Multi-column indexes ordered by selectivity (most selective first)

-- Student health overview (dashboard query)
CREATE INDEX IF NOT EXISTS "idx_students_health_overview" ON "students"
  ("schoolId", "grade", "isActive", "nurseId");

-- Medication schedule query
CREATE INDEX IF NOT EXISTS "idx_medication_schedule" ON "student_medications"
  ("studentId", "isActive", "startDate", "endDate");

-- Appointment scheduling availability
CREATE INDEX IF NOT EXISTS "idx_appointment_availability" ON "appointments"
  ("nurseId", "scheduledAt", "status", "duration");

-- ============================================
-- ANALYZE TABLES AFTER INDEX CREATION
-- ============================================

-- Update table statistics for query planner
ANALYZE "students";
ANALYZE "users";
ANALYZE "student_medications";
ANALYZE "medications";
ANALYZE "medication_logs";
ANALYZE "health_records";
ANALYZE "appointments";
ANALYZE "incident_reports";
ANALYZE "emergency_contacts";
ANALYZE "documents";
ANALYZE "audit_logs";
ANALYZE "messages";
ANALYZE "inventory_items";
ANALYZE "inventory_transactions";
ANALYZE "compliance_records";
ANALYZE "sessions";
ANALYZE "allergies";
ANALYZE "chronic_conditions";
ANALYZE "vaccinations";

-- ============================================
-- INDEX MAINTENANCE NOTES
-- ============================================

-- Run REINDEX periodically to rebuild indexes and maintain performance:
-- REINDEX DATABASE white_cross;

-- Monitor index usage:
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- ORDER BY idx_scan ASC;

-- Remove unused indexes:
-- Indexes with idx_scan = 0 after significant usage period can be dropped

-- Check index size:
-- SELECT schemaname, tablename, indexname, pg_size_pretty(pg_relation_size(indexrelid))
-- FROM pg_stat_user_indexes
-- ORDER BY pg_relation_size(indexrelid) DESC;
