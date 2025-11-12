'use strict';

/**
 * Add Indexes and Constraints Migration
 *
 * This migration adds foreign key constraints, performance indexes, and table comments.
 * This is Part 6 of 6 in the complete health records schema migration.
 *
 * Changes:
 * - Adds foreign key constraints to existing tables (allergies, chronic_conditions)
 * - Creates comprehensive indexes for performance optimization
 * - Adds table and column comments for documentation
 *
 * Dependencies:
 * - All previous migrations (20251010000000 through 20251010000004)
 * - All tables must exist before adding constraints and indexes
 *
 * Corresponds to Prisma migration: 20251010_complete_health_records_schema (Part 6)
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // =====================================================
      // STEP 1: Add Foreign Key Constraints to existing tables
      // =====================================================

      await queryInterface.sequelize.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE constraint_name = 'allergies_healthRecordId_fkey'
          ) THEN
            ALTER TABLE "allergies" ADD CONSTRAINT "allergies_healthRecordId_fkey"
              FOREIGN KEY ("healthRecordId") REFERENCES "health_records"("id")
              ON DELETE SET NULL ON UPDATE CASCADE;
          END IF;
        END $$;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE constraint_name = 'chronic_conditions_healthRecordId_fkey'
          ) THEN
            ALTER TABLE "chronic_conditions" ADD CONSTRAINT "chronic_conditions_healthRecordId_fkey"
              FOREIGN KEY ("healthRecordId") REFERENCES "health_records"("id")
              ON DELETE SET NULL ON UPDATE CASCADE;
          END IF;
        END $$;
      `, { transaction });

      // =====================================================
      // STEP 2: Create Indexes for Performance Optimization
      // =====================================================

      const indexes = [
        // health_records indexes
        { table: 'health_records', fields: ['studentId', 'recordDate'], name: 'health_records_studentId_recordDate_idx' },
        { table: 'health_records', fields: ['recordType', 'recordDate'], name: 'health_records_recordType_recordDate_idx' },
        { table: 'health_records', fields: ['createdBy'], name: 'health_records_createdBy_idx' },
        { table: 'health_records', fields: ['followUpRequired', 'followUpDate'], name: 'health_records_followUpRequired_followUpDate_idx' },

        // allergies indexes
        { table: 'allergies', fields: ['studentId', 'active'], name: 'allergies_studentId_active_idx' },
        { table: 'allergies', fields: ['allergyType', 'severity'], name: 'allergies_allergyType_severity_idx' },
        { table: 'allergies', fields: ['epiPenExpiration'], name: 'allergies_epiPenExpiration_idx' },

        // chronic_conditions indexes
        { table: 'chronic_conditions', fields: ['studentId', 'status'], name: 'chronic_conditions_studentId_status_idx' },
        { table: 'chronic_conditions', fields: ['severity', 'status'], name: 'chronic_conditions_severity_status_idx' },
        { table: 'chronic_conditions', fields: ['nextReviewDate'], name: 'chronic_conditions_nextReviewDate_idx' },

        // vaccinations indexes
        { table: 'vaccinations', fields: ['studentId', 'administrationDate'], name: 'vaccinations_studentId_administrationDate_idx' },
        { table: 'vaccinations', fields: ['vaccineType', 'complianceStatus'], name: 'vaccinations_vaccineType_complianceStatus_idx' },
        { table: 'vaccinations', fields: ['nextDueDate'], name: 'vaccinations_nextDueDate_idx' },
        { table: 'vaccinations', fields: ['expirationDate'], name: 'vaccinations_expirationDate_idx' },

        // screenings indexes
        { table: 'screenings', fields: ['studentId', 'screeningDate'], name: 'screenings_studentId_screeningDate_idx' },
        { table: 'screenings', fields: ['screeningType', 'outcome'], name: 'screenings_screeningType_outcome_idx' },
        { table: 'screenings', fields: ['referralRequired', 'followUpRequired'], name: 'screenings_referralRequired_followUpRequired_idx' },
        { table: 'screenings', fields: ['followUpDate'], name: 'screenings_followUpDate_idx' },

        // growth_measurements indexes
        { table: 'growth_measurements', fields: ['studentId', 'measurementDate'], name: 'growth_measurements_studentId_measurementDate_idx' },
        { table: 'growth_measurements', fields: ['measurementDate'], name: 'growth_measurements_measurementDate_idx' },

        // vital_signs indexes
        { table: 'vital_signs', fields: ['studentId', 'measurementDate'], name: 'vital_signs_studentId_measurementDate_idx' },
        { table: 'vital_signs', fields: ['measurementDate'], name: 'vital_signs_measurementDate_idx' },
        { table: 'vital_signs', fields: ['appointmentId'], name: 'vital_signs_appointmentId_idx' }
      ];

      for (const index of indexes) {
        await queryInterface.sequelize.query(`
          CREATE INDEX IF NOT EXISTS "${index.name}" ON "${index.table}"(${index.fields.map(f => `"${f}"`).join(', ')});
        `, { transaction });
      }

      // =====================================================
      // STEP 3: Add Table and Column Comments
      // =====================================================

      await queryInterface.sequelize.query(`
        COMMENT ON TABLE "health_records" IS 'Main health records table storing comprehensive student health information. HIPAA compliant with audit trails.';
        COMMENT ON TABLE "allergies" IS 'Student allergy records with detailed tracking including EpiPen management and emergency protocols.';
        COMMENT ON TABLE "chronic_conditions" IS 'Chronic health conditions with care plans, accommodations, and emergency protocols.';
        COMMENT ON TABLE "vaccinations" IS 'Comprehensive vaccination records tracking compliance, exemptions, and adverse events.';
        COMMENT ON TABLE "screenings" IS 'Health screening records for vision, hearing, scoliosis, and other assessments.';
        COMMENT ON TABLE "growth_measurements" IS 'Growth tracking including height, weight, BMI, and percentiles.';
        COMMENT ON TABLE "vital_signs" IS 'Vital signs measurements taken during appointments or health assessments.';
      `, { transaction });

      await transaction.commit();
      console.log('✓ Indexes and constraints migration completed successfully');
      console.log('✓ Complete health records schema migration finished (6/6)');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Indexes and constraints migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove foreign key constraints
      await queryInterface.sequelize.query(`
        ALTER TABLE "chronic_conditions" DROP CONSTRAINT IF EXISTS "chronic_conditions_healthRecordId_fkey";
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TABLE "allergies" DROP CONSTRAINT IF EXISTS "allergies_healthRecordId_fkey";
      `, { transaction });

      // Drop all indexes
      const indexes = [
        'health_records_studentId_recordDate_idx',
        'health_records_recordType_recordDate_idx',
        'health_records_createdBy_idx',
        'health_records_followUpRequired_followUpDate_idx',
        'allergies_studentId_active_idx',
        'allergies_allergyType_severity_idx',
        'allergies_epiPenExpiration_idx',
        'chronic_conditions_studentId_status_idx',
        'chronic_conditions_severity_status_idx',
        'chronic_conditions_nextReviewDate_idx',
        'vaccinations_studentId_administrationDate_idx',
        'vaccinations_vaccineType_complianceStatus_idx',
        'vaccinations_nextDueDate_idx',
        'vaccinations_expirationDate_idx',
        'screenings_studentId_screeningDate_idx',
        'screenings_screeningType_outcome_idx',
        'screenings_referralRequired_followUpRequired_idx',
        'screenings_followUpDate_idx',
        'growth_measurements_studentId_measurementDate_idx',
        'growth_measurements_measurementDate_idx',
        'vital_signs_studentId_measurementDate_idx',
        'vital_signs_measurementDate_idx',
        'vital_signs_appointmentId_idx'
      ];

      for (const indexName of indexes) {
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS "${indexName}";`, { transaction });
      }

      await transaction.commit();
      console.log('✓ Indexes and constraints rollback completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Indexes and constraints rollback failed:', error);
      throw error;
    }
  }
};
