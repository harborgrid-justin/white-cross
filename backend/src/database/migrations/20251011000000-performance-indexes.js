'use strict';

/**
 * Performance Indexes Migration
 *
 * This migration addresses N+1 query problems and missing indexes identified in audit.
 * Adds comprehensive indexes across all major tables to optimize query performance.
 *
 * Focus areas:
 * - Student-related queries
 * - User and authentication queries
 * - Medication management queries
 * - Health records queries
 * - Appointment scheduling queries
 * - Incident reporting queries
 * - Emergency contacts
 * - Documents and audit logs
 * - Communication queries
 * - Inventory management
 * - Compliance tracking
 * - Session management
 * - Allergies and chronic conditions
 * - Vaccination tracking
 *
 * Corresponds to Prisma migration: 20251011_performance_indexes
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Creating performance indexes...');

      // ============================================
      // STUDENT-RELATED INDEXES
      // ============================================

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_students_school" ON "students"("schoolId") WHERE "isActive" = true;
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_students_nurse" ON "students"("nurseId") WHERE "isActive" = true;
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_students_grade_active" ON "students"("grade", "isActive");
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_students_search" ON "students"
          USING gin(to_tsvector('english', "firstName" || ' ' || "lastName" || ' ' || "studentNumber"));
      `, { transaction });

      // ============================================
      // USER-RELATED INDEXES
      // ============================================

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_users_school" ON "users"("schoolId") WHERE "isActive" = true;
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_users_district" ON "users"("districtId") WHERE "isActive" = true;
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_users_role_active" ON "users"("role", "isActive");
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_users_search" ON "users"
          USING gin(to_tsvector('english', "firstName" || ' ' || "lastName" || ' ' || "email"));
      `, { transaction });

      // ============================================
      // MEDICATION-RELATED INDEXES
      // ============================================

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_student_medications_active_dates" ON "student_medications"
          ("isActive", "startDate", "endDate") WHERE "isActive" = true;
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_student_medications_student" ON "student_medications"("studentId", "isActive");
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_medication_logs_student" ON "medication_logs"("studentMedicationId", "timeGiven" DESC);
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_medication_logs_nurse" ON "medication_logs"("nurseId", "timeGiven" DESC);
      `, { transaction });

      // Check if medications table has the expected columns before creating indexes
      const medicationColumns = await queryInterface.sequelize.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'medications' AND column_name IN ('category', 'isActive', 'stockQuantity', 'minimumStock', 'expirationDate');
      `, { transaction });

      const medColNames = medicationColumns.map(c => c.column_name);

      if (medColNames.includes('category') && medColNames.includes('isActive')) {
        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_medications_category_active" ON "medications"("category", "isActive");
        `, { transaction });
      }

      if (medColNames.includes('stockQuantity') && medColNames.includes('minimumStock') && medColNames.includes('isActive')) {
        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_medications_stock" ON "medications"("stockQuantity", "minimumStock")
            WHERE "isActive" = true AND "stockQuantity" <= "minimumStock";
        `, { transaction });
      }

      if (medColNames.includes('expirationDate') && medColNames.includes('isActive')) {
        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_medications_expiration" ON "medications"("expirationDate", "isActive")
            WHERE "isActive" = true AND "expirationDate" IS NOT NULL;
        `, { transaction });
      }

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_medications_search" ON "medications"
          USING gin(to_tsvector('english', "name" || ' ' || COALESCE("genericName", '')));
      `, { transaction });

      // ============================================
      // HEALTH RECORD INDEXES
      // ============================================

      // Check if health_records uses new column names
      const hrColumns = await queryInterface.sequelize.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'health_records' AND column_name IN ('recordDate', 'recordType', 'isConfidential', 'providerNpi', 'date');
      `, { transaction });

      const hrColNames = hrColumns.map(c => c.column_name);
      const dateCol = hrColNames.includes('recordDate') ? 'recordDate' : 'date';
      const typeCol = hrColNames.includes('recordType') ? 'recordType' : 'type';

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_health_records_student_date" ON "health_records"
          ("studentId", "recordDate" DESC, "recordType");
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_health_records_type_date" ON "health_records"
          ("recordType", "recordDate" DESC);
      `, { transaction });

      if (hrColNames.includes('isConfidential')) {
        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_health_records_confidential" ON "health_records"
            ("isConfidential", "studentId") WHERE "isConfidential" = true;
        `, { transaction });
      }

      if (hrColNames.includes('providerNpi')) {
        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_health_records_provider" ON "health_records"
            ("providerNpi", "${dateCol}" DESC) WHERE "providerNpi" IS NOT NULL;
        `, { transaction });
      }

      // ============================================
      // APPOINTMENT INDEXES
      // ============================================

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_appointments_upcoming" ON "appointments"
          ("nurseId", "scheduledAt", "status")
          WHERE "status" IN ('SCHEDULED', 'IN_PROGRESS');
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_appointments_student" ON "appointments"
          ("studentId", "scheduledAt" DESC, "status");
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_appointments_date_range" ON "appointments"
          ("scheduledAt", "status") WHERE "status" != 'CANCELLED';
      `, { transaction });

      // ============================================
      // INCIDENT REPORT INDEXES
      // ============================================

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_incident_reports_student" ON "incident_reports"
          ("studentId", "occurredAt" DESC, "severity");
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_incident_reports_reporter" ON "incident_reports"
          ("reportedById", "occurredAt" DESC);
      `, { transaction });

      // Check if status column exists
      const irColumns = await queryInterface.sequelize.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'incident_reports' AND column_name = 'status';
      `, { transaction });

      const hasStatus = irColumns.length > 0;

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_incident_reports_filters" ON "incident_reports"
          ("type", "severity", "occurredAt" DESC);
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_incident_reports_critical" ON "incident_reports"
          ("severity", "occurredAt" DESC)
          WHERE "severity" IN ('HIGH', 'CRITICAL');
      `, { transaction });

      // ============================================
      // EMERGENCY CONTACT INDEXES
      // ============================================

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_emergency_contacts_student" ON "emergency_contacts"
          ("studentId", "priority") WHERE "isActive" = true;
      `, { transaction });

      // Check if isPrimary column exists
      const ecColumns = await queryInterface.sequelize.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'emergency_contacts' AND column_name = 'isPrimary';
      `, { transaction });

      if (ecColumns.length > 0) {
        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_emergency_contacts_primary" ON "emergency_contacts"
            ("studentId", "isPrimary") WHERE "isPrimary" = true AND "isActive" = true;
        `, { transaction });
      }

      // ============================================
      // DOCUMENT INDEXES (if table exists)
      // ============================================

      const docTablesResult = await queryInterface.sequelize.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_name = 'documents';
      `, { transaction });

      const docTables = Array.isArray(docTablesResult) ? docTablesResult[0] : docTablesResult;

      if (docTables && docTables.length > 0) {
        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_documents_student" ON "documents"
            ("studentId", "uploadedAt" DESC) WHERE "studentId" IS NOT NULL;
        `, { transaction });

        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_documents_uploader" ON "documents"
            ("uploadedById", "uploadedAt" DESC);
        `, { transaction });

        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_documents_category" ON "documents"
            ("category", "uploadedAt" DESC);
        `, { transaction });

        const docCols = await queryInterface.sequelize.query(`
          SELECT column_name FROM information_schema.columns
          WHERE table_name = 'documents' AND column_name = 'expirationDate';
        `, { transaction });

        if (docCols.length > 0) {
          await queryInterface.sequelize.query(`
            CREATE INDEX IF NOT EXISTS "idx_documents_expiring" ON "documents"
              ("expirationDate", "category") WHERE "expirationDate" IS NOT NULL;
          `, { transaction });
        }
      }

      // ============================================
      // AUDIT LOG INDEXES (if table exists)
      // ============================================

      const auditTables = await queryInterface.sequelize.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_name = 'audit_logs';
      `, { transaction });

      if (auditTables.length > 0) {
        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_audit_logs_user" ON "audit_logs"
            ("userId", "createdAt" DESC) WHERE "userId" IS NOT NULL;
        `, { transaction });

        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_audit_logs_entity" ON "audit_logs"
            ("entityType", "entityId", "action", "createdAt" DESC);
        `, { transaction });

        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_audit_logs_date" ON "audit_logs"
            ("createdAt" DESC, "action", "entityType");
        `, { transaction });

        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_audit_logs_export" ON "audit_logs"
            ("action", "createdAt" DESC) WHERE "action" = 'EXPORT';
        `, { transaction });
      }

      // ============================================
      // COMMUNICATION INDEXES (if tables exist)
      // ============================================

      const msgTables = await queryInterface.sequelize.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_name IN ('messages', 'message_recipients');
      `, { transaction });

      const msgTableNames = (Array.isArray(msgTables) ? msgTables : []).map(t => t.table_name);

      if (msgTableNames.includes('messages')) {
        const msgCols = await queryInterface.sequelize.query(`
          SELECT column_name FROM information_schema.columns
          WHERE table_name = 'messages' AND column_name = 'sentAt';
        `, { transaction });

        if (msgCols.length > 0) {
          await queryInterface.sequelize.query(`
            CREATE INDEX IF NOT EXISTS "idx_messages_sender" ON "messages"
              ("senderId", "sentAt" DESC);
          `, { transaction });
        }
      }

      if (msgTableNames.includes('message_recipients')) {
        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_message_recipients_recipient" ON "message_recipients"
            ("recipientId", "status", "createdAt" DESC);
        `, { transaction });

        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_message_recipients_unread" ON "message_recipients"
            ("recipientId", "status") WHERE "status" = 'UNREAD';
        `, { transaction });
      }

      // ============================================
      // INVENTORY INDEXES (if tables exist)
      // ============================================

      const invTables = await queryInterface.sequelize.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_name IN ('inventory_items', 'inventory_transactions');
      `, { transaction });

      const invTableNames = invTables.map(t => t.table_name);

      if (invTableNames.includes('inventory_items')) {
        const invCols = await queryInterface.sequelize.query(`
          SELECT column_name FROM information_schema.columns
          WHERE table_name = 'inventory_items' AND column_name IN ('category', 'location', 'quantity', 'minimumStock');
        `, { transaction });

        const invColNames = invCols.map(c => c.column_name);

        if (invColNames.includes('category')) {
          await queryInterface.sequelize.query(`
            CREATE INDEX IF NOT EXISTS "idx_inventory_category" ON "inventory_items"
              ("category", "location", "isActive");
          `, { transaction });
        }

        if (invColNames.includes('quantity') && invColNames.includes('minimumStock')) {
          await queryInterface.sequelize.query(`
            CREATE INDEX IF NOT EXISTS "idx_inventory_low_stock" ON "inventory_items"
              ("quantity", "minimumStock")
              WHERE "isActive" = true AND "quantity" <= "minimumStock";
          `, { transaction });
        }
      }

      if (invTableNames.includes('inventory_transactions')) {
        const invTransCols = await queryInterface.sequelize.query(`
          SELECT column_name FROM information_schema.columns
          WHERE table_name = 'inventory_transactions' AND column_name IN ('transactionDate', 'performedBy');
        `, { transaction });

        const invTransColNames = invTransCols.map(c => c.column_name);

        if (invTransColNames.includes('transactionDate')) {
          await queryInterface.sequelize.query(`
            CREATE INDEX IF NOT EXISTS "idx_inventory_transactions_item" ON "inventory_transactions"
              ("inventoryItemId", "transactionDate" DESC);
          `, { transaction });
        }

        if (invTransColNames.includes('performedBy') && invTransColNames.includes('transactionDate')) {
          await queryInterface.sequelize.query(`
            CREATE INDEX IF NOT EXISTS "idx_inventory_transactions_performer" ON "inventory_transactions"
              ("performedBy", "transactionDate" DESC);
          `, { transaction });
        }
      }

      // ============================================
      // COMPLIANCE INDEXES (if table exists)
      // ============================================

      const compTables = await queryInterface.sequelize.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_name = 'compliance_records';
      `, { transaction });

      if (compTables.length > 0) {
        const compCols = await queryInterface.sequelize.query(`
          SELECT column_name FROM information_schema.columns
          WHERE table_name = 'compliance_records' AND column_name IN ('type', 'status', 'dueDate');
        `, { transaction });

        const compColNames = compCols.map(c => c.column_name);

        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_compliance_records_student" ON "compliance_records"
            ("studentId"${compColNames.includes('type') ? ', "type"' : ''}${compColNames.includes('status') ? ', "status"' : ''}${compColNames.includes('dueDate') ? ', "dueDate"' : ''});
        `, { transaction });

        if (compColNames.includes('type') && compColNames.includes('status') && compColNames.includes('dueDate')) {
          await queryInterface.sequelize.query(`
            CREATE INDEX IF NOT EXISTS "idx_compliance_records_status" ON "compliance_records"
              ("type", "status", "dueDate") WHERE "status" != 'COMPLIANT';
          `, { transaction });

          await queryInterface.sequelize.query(`
            CREATE INDEX IF NOT EXISTS "idx_compliance_records_overdue" ON "compliance_records"
              ("dueDate", "status") WHERE "status" = 'PENDING' AND "dueDate" < CURRENT_DATE;
          `, { transaction });
        }
      }

      // ============================================
      // SESSION INDEXES (if table exists)
      // ============================================

      const sessTables = await queryInterface.sequelize.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_name = 'sessions';
      `, { transaction });

      if (sessTables.length > 0) {
        const sessCols = await queryInterface.sequelize.query(`
          SELECT column_name FROM information_schema.columns
          WHERE table_name = 'sessions' AND column_name IN ('lastActivity', 'isActive', 'expiresAt');
        `, { transaction });

        const sessColNames = sessCols.map(c => c.column_name);

        if (sessColNames.includes('lastActivity') && sessColNames.includes('isActive')) {
          await queryInterface.sequelize.query(`
            CREATE INDEX IF NOT EXISTS "idx_sessions_user_active" ON "sessions"
              ("userId", "lastActivity" DESC) WHERE "isActive" = true;
          `, { transaction });
        }

        if (sessColNames.includes('expiresAt') && sessColNames.includes('isActive')) {
          await queryInterface.sequelize.query(`
            CREATE INDEX IF NOT EXISTS "idx_sessions_expired" ON "sessions"
              ("expiresAt") WHERE "isActive" = true AND "expiresAt" < CURRENT_TIMESTAMP;
          `, { transaction });
        }
      }

      // ============================================
      // ALLERGIES AND CHRONIC CONDITIONS (already have some indexes from health records migration)
      // ============================================

      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_allergies_student" ON "allergies"
          ("studentId", "severity") WHERE "isActive" = true;
      `, { transaction });

      const allergyCols = await queryInterface.sequelize.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'allergies' AND column_name = 'active';
      `, { transaction });

      if (allergyCols.length > 0) {
        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_allergies_critical" ON "allergies"
            ("studentId", "severity")
            WHERE "active" = true AND "severity" = 'LIFE_THREATENING';
        `, { transaction });
      }

      const ccCols = await queryInterface.sequelize.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'chronic_conditions' AND column_name = 'status';
      `, { transaction });

      if (ccCols.length > 0) {
        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_chronic_conditions_student" ON "chronic_conditions"
            ("studentId", "status") WHERE "status" = 'ACTIVE';
        `, { transaction });
      }

      // ============================================
      // VACCINATION INDEXES (if table exists)
      // ============================================

      const vacTables = await queryInterface.sequelize.query(`
        SELECT table_name FROM information_schema.tables
        WHERE table_name = 'vaccinations';
      `, { transaction });

      if (vacTables.length > 0) {
        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_vaccinations_student" ON "vaccinations"
            ("studentId", "administrationDate" DESC);
        `, { transaction });

        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_vaccinations_compliance" ON "vaccinations"
            ("vaccineType", "complianceStatus", "administrationDate" DESC);
        `, { transaction });

        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_vaccinations_due" ON "vaccinations"
            ("nextDueDate", "studentId")
            WHERE "nextDueDate" IS NOT NULL;
        `, { transaction });
      }

      // ============================================
      // COMPOSITE INDEXES FOR COMMON QUERY PATTERNS
      // ============================================

      // Student health overview (dashboard query)
      const studentCols = await queryInterface.sequelize.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'students' AND column_name = 'schoolId';
      `, { transaction });

      if (studentCols.length > 0) {
        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "idx_students_health_overview" ON "students"
            ("schoolId", "grade", "isActive", "nurseId");
        `, { transaction });
      }

      // Medication schedule query
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_medication_schedule" ON "student_medications"
          ("studentId", "isActive", "startDate", "endDate");
      `, { transaction });

      // Appointment scheduling availability
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_appointment_availability" ON "appointments"
          ("nurseId", "scheduledAt", "status", "duration");
      `, { transaction });

      // ============================================
      // ANALYZE TABLES AFTER INDEX CREATION
      // ============================================

      const tablesToAnalyze = [
        'students', 'users', 'student_medications', 'medications', 'medication_logs',
        'health_records', 'appointments', 'incident_reports', 'emergency_contacts',
        'allergies', 'chronic_conditions'
      ];

      for (const table of tablesToAnalyze) {
        await queryInterface.sequelize.query(`ANALYZE "${table}";`, { transaction });
      }

      await transaction.commit();
      console.log('✓ Performance indexes created successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop all created indexes
      const indexNames = [
        // Student indexes
        'idx_students_school', 'idx_students_nurse', 'idx_students_grade_active',
        'idx_students_search', 'idx_students_health_overview',

        // User indexes
        'idx_users_school', 'idx_users_district', 'idx_users_role_active', 'idx_users_search',

        // Medication indexes
        'idx_student_medications_active_dates', 'idx_student_medications_student',
        'idx_medication_logs_student', 'idx_medication_logs_nurse', 'idx_medications_category_active',
        'idx_medications_stock', 'idx_medications_expiration', 'idx_medications_search',
        'idx_medication_schedule',

        // Health record indexes
        'idx_health_records_student_date', 'idx_health_records_type_date',
        'idx_health_records_confidential', 'idx_health_records_provider',

        // Appointment indexes
        'idx_appointments_upcoming', 'idx_appointments_student', 'idx_appointments_date_range',
        'idx_appointment_availability',

        // Incident report indexes
        'idx_incident_reports_student', 'idx_incident_reports_reporter',
        'idx_incident_reports_filters', 'idx_incident_reports_critical',

        // Emergency contact indexes
        'idx_emergency_contacts_student', 'idx_emergency_contacts_primary',

        // Document indexes
        'idx_documents_student', 'idx_documents_uploader', 'idx_documents_category',
        'idx_documents_expiring',

        // Audit log indexes
        'idx_audit_logs_user', 'idx_audit_logs_entity', 'idx_audit_logs_date',
        'idx_audit_logs_export',

        // Communication indexes
        'idx_messages_sender', 'idx_message_recipients_recipient', 'idx_message_recipients_unread',

        // Inventory indexes
        'idx_inventory_category', 'idx_inventory_low_stock',
        'idx_inventory_transactions_item', 'idx_inventory_transactions_performer',

        // Compliance indexes
        'idx_compliance_records_student', 'idx_compliance_records_status',
        'idx_compliance_records_overdue',

        // Session indexes
        'idx_sessions_user_active', 'idx_sessions_expired',

        // Allergy and chronic condition indexes
        'idx_allergies_student', 'idx_allergies_critical', 'idx_chronic_conditions_student',

        // Vaccination indexes
        'idx_vaccinations_student', 'idx_vaccinations_compliance', 'idx_vaccinations_due'
      ];

      for (const indexName of indexNames) {
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${indexName}";`, { transaction });
      }

      await transaction.commit();
      console.log('✓ Performance indexes removed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Rollback failed:', error);
      throw error;
    }
  }
};
