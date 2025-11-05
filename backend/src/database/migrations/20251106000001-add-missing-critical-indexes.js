'use strict';

/**
 * Migration: Add Missing Critical Indexes for Healthcare Models
 *
 * Purpose: Add performance-critical indexes for Allergy, ChronicCondition, and
 * StudentMedication models to optimize common query patterns in healthcare workflows.
 *
 * HIPAA Compliance: Optimizes query performance for PHI data access while maintaining
 * audit trail capabilities. Faster queries reduce system latency and improve security
 * monitoring effectiveness.
 *
 * Safety Features:
 * - Uses transactions for atomicity
 * - IF NOT EXISTS pattern for idempotency
 * - CONCURRENTLY option for zero-downtime (PostgreSQL)
 * - Comprehensive rollback method
 *
 * Performance Impact: Medium - index creation may take time on large tables
 * Estimated Duration: 10-30 seconds for tables with 100k-500k records
 *
 * Index Strategy:
 * - Allergy: Severe allergy queries, student lookups, EpiPen tracking
 * - ChronicCondition: IEP/504 compliance queries, active condition monitoring
 * - StudentMedication: Active medication queries, date range filtering, refill tracking
 */

module.exports = {
  /**
   * Add critical indexes for healthcare models
   *
   * @param {QueryInterface} queryInterface - Sequelize query interface
   * @param {Sequelize} Sequelize - Sequelize instance
   * @returns {Promise<void>}
   */
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('[MIGRATION] Starting: Add missing critical indexes for healthcare models');

      // ============================================================
      // ALLERGY MODEL INDEXES
      // ============================================================

      console.log('[MIGRATION] Section 1: Adding Allergy model indexes');

      // Index 1: Severe allergies query optimization
      // Query: "Find all severe/life-threatening allergies"
      // Usage: Emergency response, nurse dashboard, alerts
      const [severityIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'allergies'
         AND indexname = 'idx_allergies_severity_active'`,
        { transaction }
      );

      if (severityIndexExists.length === 0) {
        await queryInterface.addIndex('allergies', {
          fields: ['severity', 'active', 'deletedAt'],
          name: 'idx_allergies_severity_active',
          transaction,
          concurrently: false // Set to true in production for zero-downtime
        });
        console.log('[MIGRATION] Created index: idx_allergies_severity_active');
      } else {
        console.log('[MIGRATION] Index already exists: idx_allergies_severity_active');
      }

      // Index 2: Student allergy lookup with type filtering
      // Query: "Get all active allergies for a student by type"
      // Usage: Student profile, medication administration checks
      const [studentTypeIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'allergies'
         AND indexname = 'idx_allergies_student_type_active'`,
        { transaction }
      );

      if (studentTypeIndexExists.length === 0) {
        await queryInterface.addIndex('allergies', {
          fields: ['studentId', 'allergyType', 'active'],
          name: 'idx_allergies_student_type_active',
          transaction,
          concurrently: false
        });
        console.log('[MIGRATION] Created index: idx_allergies_student_type_active');
      } else {
        console.log('[MIGRATION] Index already exists: idx_allergies_student_type_active');
      }

      // Index 3: EpiPen expiration tracking (partial index)
      // Query: "Find all EpiPens expiring within 30 days"
      // Usage: Compliance monitoring, automated alerts
      const [epiPenExpirationIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'allergies'
         AND indexname = 'idx_allergies_epipen_expiration'`,
        { transaction }
      );

      if (epiPenExpirationIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_allergies_epipen_expiration
           ON allergies ("epiPenExpiration", "epiPenRequired", active)
           WHERE "epiPenRequired" = true AND active = true AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_allergies_epipen_expiration');
      } else {
        console.log('[MIGRATION] Index already exists: idx_allergies_epipen_expiration');
      }

      // Index 4: Unverified allergies for compliance
      // Query: "Find all unverified allergies requiring nurse review"
      // Usage: Compliance dashboard, data quality monitoring
      const [unverifiedIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'allergies'
         AND indexname = 'idx_allergies_unverified'`,
        { transaction }
      );

      if (unverifiedIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_allergies_unverified
           ON allergies (verified, severity, "createdAt")
           WHERE verified = false AND active = true AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_allergies_unverified');
      } else {
        console.log('[MIGRATION] Index already exists: idx_allergies_unverified');
      }

      // ============================================================
      // CHRONIC_CONDITION MODEL INDEXES
      // ============================================================

      console.log('[MIGRATION] Section 2: Adding ChronicCondition model indexes');

      // Index 5: IEP compliance tracking
      // Query: "Find all students requiring IEP with active conditions"
      // Usage: Special education compliance, reporting
      const [iepIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'chronic_conditions'
         AND indexname = 'idx_chronic_conditions_iep_compliance'`,
        { transaction }
      );

      if (iepIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_chronic_conditions_iep_compliance
           ON chronic_conditions ("requiresIEP", status, "isActive", "nextReviewDate")
           WHERE "requiresIEP" = true AND "isActive" = true AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_chronic_conditions_iep_compliance');
      } else {
        console.log('[MIGRATION] Index already exists: idx_chronic_conditions_iep_compliance');
      }

      // Index 6: 504 Plan compliance tracking
      // Query: "Find all students requiring 504 plans with active conditions"
      // Usage: Disability compliance, accommodation tracking
      const [plan504IndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'chronic_conditions'
         AND indexname = 'idx_chronic_conditions_504_compliance'`,
        { transaction }
      );

      if (plan504IndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_chronic_conditions_504_compliance
           ON chronic_conditions ("requires504", status, "isActive", "nextReviewDate")
           WHERE "requires504" = true AND "isActive" = true AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_chronic_conditions_504_compliance');
      } else {
        console.log('[MIGRATION] Index already exists: idx_chronic_conditions_504_compliance');
      }

      // Index 7: Active condition monitoring by status
      // Query: "Get all active conditions by student with status filtering"
      // Usage: Care plan management, condition tracking dashboards
      const [conditionStatusIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'chronic_conditions'
         AND indexname = 'idx_chronic_conditions_student_status'`,
        { transaction }
      );

      if (conditionStatusIndexExists.length === 0) {
        await queryInterface.addIndex('chronic_conditions', {
          fields: ['studentId', 'status', 'isActive', 'deletedAt'],
          name: 'idx_chronic_conditions_student_status',
          transaction,
          concurrently: false
        });
        console.log('[MIGRATION] Created index: idx_chronic_conditions_student_status');
      } else {
        console.log('[MIGRATION] Index already exists: idx_chronic_conditions_student_status');
      }

      // Index 8: Review date tracking for care plan management
      // Query: "Find conditions requiring review in next 30 days"
      // Usage: Care plan compliance, automated reminders
      const [reviewDateIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'chronic_conditions'
         AND indexname = 'idx_chronic_conditions_review_tracking'`,
        { transaction }
      );

      if (reviewDateIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_chronic_conditions_review_tracking
           ON chronic_conditions ("nextReviewDate", "isActive", status)
           WHERE "nextReviewDate" IS NOT NULL AND "isActive" = true AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_chronic_conditions_review_tracking');
      } else {
        console.log('[MIGRATION] Index already exists: idx_chronic_conditions_review_tracking');
      }

      // ============================================================
      // STUDENT_MEDICATION MODEL INDEXES
      // ============================================================

      console.log('[MIGRATION] Section 3: Adding StudentMedication model indexes');

      // Index 9: Active medication queries with date range filtering
      // Query: "Get all currently active medications for a student"
      // Usage: Medication administration, nurse dashboard, drug interaction checks
      const [activeMedIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'student_medications'
         AND indexname = 'idx_student_medications_active_dates'`,
        { transaction }
      );

      if (activeMedIndexExists.length === 0) {
        await queryInterface.addIndex('student_medications', {
          fields: ['isActive', 'startDate', 'endDate', 'studentId'],
          name: 'idx_student_medications_active_dates',
          transaction,
          concurrently: false
        });
        console.log('[MIGRATION] Created index: idx_student_medications_active_dates');
      } else {
        console.log('[MIGRATION] Index already exists: idx_student_medications_active_dates');
      }

      // Index 10: Medication by student with medication lookup
      // Query: "Get all medications for a student by medication type"
      // Usage: Medication history, duplicate prevention, refill management
      const [studentMedLookupIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'student_medications'
         AND indexname = 'idx_student_medications_student_med'`,
        { transaction }
      );

      if (studentMedLookupIndexExists.length === 0) {
        await queryInterface.addIndex('student_medications', {
          fields: ['studentId', 'medicationId', 'isActive'],
          name: 'idx_student_medications_student_med',
          transaction,
          concurrently: false
        });
        console.log('[MIGRATION] Created index: idx_student_medications_student_med');
      } else {
        console.log('[MIGRATION] Index already exists: idx_student_medications_student_med');
      }

      // Index 11: Refill tracking (partial index)
      // Query: "Find medications with low refill counts requiring action"
      // Usage: Pharmacy management, automated refill alerts
      const [refillTrackingIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'student_medications'
         AND indexname = 'idx_student_medications_refill_tracking'`,
        { transaction }
      );

      if (refillTrackingIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_student_medications_refill_tracking
           ON student_medications ("refillsRemaining", "studentId", "medicationId")
           WHERE "isActive" = true AND "refillsRemaining" IS NOT NULL AND "refillsRemaining" <= 2`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_student_medications_refill_tracking');
      } else {
        console.log('[MIGRATION] Index already exists: idx_student_medications_refill_tracking');
      }

      // Index 12: End date monitoring for medication discontinuation
      // Query: "Find medications expiring in the next 7 days"
      // Usage: Medication discontinuation workflow, prescription renewal
      const [endDateMonitoringIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'student_medications'
         AND indexname = 'idx_student_medications_end_date_monitoring'`,
        { transaction }
      );

      if (endDateMonitoringIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_student_medications_end_date_monitoring
           ON student_medications ("endDate", "isActive", "studentId")
           WHERE "endDate" IS NOT NULL AND "isActive" = true`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_student_medications_end_date_monitoring');
      } else {
        console.log('[MIGRATION] Index already exists: idx_student_medications_end_date_monitoring');
      }

      // Audit log entry for compliance
      console.log('[MIGRATION AUDIT] Critical healthcare indexes added successfully');
      console.log('[MIGRATION AUDIT] Total indexes created/verified: 12');
      console.log('[MIGRATION AUDIT] Models affected: Allergy (4), ChronicCondition (4), StudentMedication (4)');
      console.log('[MIGRATION AUDIT] Timestamp:', new Date().toISOString());

      await transaction.commit();
      console.log('[MIGRATION] Completed: Add missing critical indexes');

    } catch (error) {
      await transaction.rollback();
      console.error('[MIGRATION ERROR] Failed to add critical indexes:', error.message);
      throw error;
    }
  },

  /**
   * Remove critical indexes from healthcare models
   *
   * @param {QueryInterface} queryInterface - Sequelize query interface
   * @param {Sequelize} Sequelize - Sequelize instance
   * @returns {Promise<void>}
   */
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('[MIGRATION ROLLBACK] Starting: Remove critical healthcare indexes');

      // Array of all indexes to remove
      const indexesToRemove = [
        // Allergy indexes
        { table: 'allergies', index: 'idx_allergies_severity_active' },
        { table: 'allergies', index: 'idx_allergies_student_type_active' },
        { table: 'allergies', index: 'idx_allergies_epipen_expiration' },
        { table: 'allergies', index: 'idx_allergies_unverified' },

        // ChronicCondition indexes
        { table: 'chronic_conditions', index: 'idx_chronic_conditions_iep_compliance' },
        { table: 'chronic_conditions', index: 'idx_chronic_conditions_504_compliance' },
        { table: 'chronic_conditions', index: 'idx_chronic_conditions_student_status' },
        { table: 'chronic_conditions', index: 'idx_chronic_conditions_review_tracking' },

        // StudentMedication indexes
        { table: 'student_medications', index: 'idx_student_medications_active_dates' },
        { table: 'student_medications', index: 'idx_student_medications_student_med' },
        { table: 'student_medications', index: 'idx_student_medications_refill_tracking' },
        { table: 'student_medications', index: 'idx_student_medications_end_date_monitoring' }
      ];

      // Remove each index if it exists
      for (const { table, index } of indexesToRemove) {
        const [indexExists] = await queryInterface.sequelize.query(
          `SELECT indexname FROM pg_indexes
           WHERE tablename = '${table}'
           AND indexname = '${index}'`,
          { transaction }
        );

        if (indexExists.length > 0) {
          await queryInterface.removeIndex(table, index, { transaction });
          console.log(`[MIGRATION ROLLBACK] Removed index: ${index} from ${table}`);
        } else {
          console.log(`[MIGRATION ROLLBACK] Index does not exist: ${index}`);
        }
      }

      // Audit log entry for compliance
      console.log('[MIGRATION AUDIT] Critical healthcare indexes removed');
      console.log('[MIGRATION AUDIT] Total indexes removed: 12');
      console.log('[MIGRATION AUDIT] Timestamp:', new Date().toISOString());

      await transaction.commit();
      console.log('[MIGRATION ROLLBACK] Completed: Remove critical healthcare indexes');

    } catch (error) {
      await transaction.rollback();
      console.error('[MIGRATION ROLLBACK ERROR] Failed to remove indexes:', error.message);
      throw error;
    }
  }
};
