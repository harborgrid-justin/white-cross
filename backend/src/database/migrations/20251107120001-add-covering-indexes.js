'use strict';

/**
 * Covering Indexes Migration
 *
 * This migration adds covering indexes (indexes with INCLUDE clause) to optimize
 * frequently-accessed queries by including additional columns in the index structure.
 * This allows PostgreSQL to satisfy queries using only the index without accessing
 * the table (index-only scans).
 *
 * Implements recommendations from SEQUELIZE_MODELS_REVIEW_FINDINGS.md Section 7.3
 *
 * Covering Indexes Added:
 * - Student Health Dashboard: Optimizes student list queries with demographic info
 * - Medication Administration History: Optimizes medication log queries with details
 * - Appointment Calendar View: Optimizes calendar queries with appointment details
 *
 * Benefits:
 * - Reduced disk I/O (index-only scans)
 * - Faster query response times for dashboard views
 * - Reduced buffer cache pressure
 * - Better performance for read-heavy workloads
 *
 * Performance Impact:
 * - Increased index size (trade-off: storage for speed)
 * - Slight increase in write time (index maintenance)
 * - Significant improvement in read performance (20-50% faster queries)
 *
 * PostgreSQL Feature: INCLUDE clause (PostgreSQL 11+)
 *
 * Migration ID: DB6C9F-002
 * Task Tracking: .temp/task-status-DB6C9F.json
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Adding covering indexes for query optimization...');

      // =====================================================
      // STUDENT HEALTH DASHBOARD INDEX
      // =====================================================

      console.log('Creating student health dashboard covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_students_health_dashboard"
        ON "students" ("id", "isActive")
        INCLUDE ("firstName", "lastName", "grade", "studentNumber", "nurseId", "schoolId", "dateOfBirth");
      `, { transaction });

      console.log('Creating student lookup by school covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_students_school_lookup"
        ON "students" ("schoolId", "isActive", "grade")
        INCLUDE ("id", "firstName", "lastName", "studentNumber", "nurseId");
      `, { transaction });

      // =====================================================
      // MEDICATION ADMINISTRATION HISTORY INDEX
      // =====================================================

      console.log('Creating medication logs history covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_medication_logs_history"
        ON "medication_logs" ("studentMedicationId", "administeredAt" DESC)
        INCLUDE ("status", "dosageGiven", "administeredBy", "notes", "witnessed", "witnessedBy");
      `, { transaction });

      console.log('Creating medication logs by student covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_medication_logs_by_student"
        ON "medication_logs" ("studentId", "administeredAt" DESC)
        INCLUDE ("studentMedicationId", "status", "dosageGiven", "administeredBy");
      `, { transaction });

      console.log('Creating medication logs by nurse covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_medication_logs_by_nurse"
        ON "medication_logs" ("administeredBy", "administeredAt" DESC)
        INCLUDE ("studentId", "studentMedicationId", "status", "dosageGiven");
      `, { transaction });

      // =====================================================
      // APPOINTMENT CALENDAR VIEW INDEX
      // =====================================================

      console.log('Creating appointment calendar covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_appointments_calendar"
        ON "appointments" ("nurseId", "scheduledAt" DESC, "status")
        INCLUDE ("studentId", "type", "duration", "reason", "location");
      `, { transaction });

      console.log('Creating appointment by student covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_appointments_by_student"
        ON "appointments" ("studentId", "scheduledAt" DESC)
        INCLUDE ("nurseId", "type", "status", "duration", "reason");
      `, { transaction });

      console.log('Creating appointment by school covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_appointments_by_school"
        ON "appointments" ("schoolId", "scheduledAt" DESC, "status")
        INCLUDE ("studentId", "nurseId", "type", "duration");
      `, { transaction });

      // =====================================================
      // HEALTH RECORDS COVERING INDEXES
      // =====================================================

      console.log('Creating health records by student covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_health_records_by_student"
        ON "health_records" ("studentId", "recordDate" DESC, "isActive")
        INCLUDE ("recordType", "diagnosis", "recordedBy", "id");
      `, { transaction });

      console.log('Creating health records by type covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_health_records_by_type"
        ON "health_records" ("recordType", "recordDate" DESC, "isActive")
        INCLUDE ("studentId", "diagnosis", "recordedBy");
      `, { transaction });

      // =====================================================
      // ALLERGIES AND CONDITIONS COVERING INDEXES
      // =====================================================

      console.log('Creating allergies by student covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_allergies_by_student"
        ON "allergies" ("studentId", "isActive")
        INCLUDE ("allergyType", "allergen", "severity", "reaction", "epiPenRequired", "epiPenLocation");
      `, { transaction });

      console.log('Creating chronic conditions by student covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_chronic_conditions_by_student"
        ON "chronic_conditions" ("studentId", "isActive")
        INCLUDE ("condition", "severity", "managementPlan", "emergencyProcedure");
      `, { transaction });

      // =====================================================
      // VACCINATIONS COVERING INDEX
      // =====================================================

      console.log('Creating vaccinations by student covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_vaccinations_by_student"
        ON "vaccinations" ("studentId", "administrationDate" DESC)
        INCLUDE ("vaccineType", "dosage", "complianceStatus", "administeredBy", "nextDueDate");
      `, { transaction });

      // =====================================================
      // INCIDENT REPORTS COVERING INDEX
      // =====================================================

      console.log('Creating incident reports covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_incident_reports_by_student"
        ON "incident_reports" ("studentId", "occurredAt" DESC)
        INCLUDE ("reporterId", "type", "status", "severity", "location");
      `, { transaction });

      console.log('Creating incident reports by reporter covering index...');
      await queryInterface.sequelize.query(`
        CREATE INDEX IF NOT EXISTS "idx_incident_reports_by_reporter"
        ON "incident_reports" ("reporterId", "occurredAt" DESC, "status")
        INCLUDE ("studentId", "type", "severity");
      `, { transaction });

      await transaction.commit();
      console.log('Covering indexes created successfully!');
      console.log('Index-only scans will now optimize dashboard and list queries.');

    } catch (error) {
      await transaction.rollback();
      console.error('Error creating covering indexes:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Removing covering indexes...');

      const indexes = [
        'idx_incident_reports_by_reporter',
        'idx_incident_reports_by_student',
        'idx_vaccinations_by_student',
        'idx_chronic_conditions_by_student',
        'idx_allergies_by_student',
        'idx_health_records_by_type',
        'idx_health_records_by_student',
        'idx_appointments_by_school',
        'idx_appointments_by_student',
        'idx_appointments_calendar',
        'idx_medication_logs_by_nurse',
        'idx_medication_logs_by_student',
        'idx_medication_logs_history',
        'idx_students_school_lookup',
        'idx_students_health_dashboard',
      ];

      for (const index of indexes) {
        console.log(`Dropping index ${index}...`);
        await queryInterface.sequelize.query(`
          DROP INDEX IF EXISTS "${index}";
        `, { transaction });
      }

      await transaction.commit();
      console.log('Covering indexes removed successfully!');

    } catch (error) {
      await transaction.rollback();
      console.error('Error removing covering indexes:', error);
      throw error;
    }
  }
};
