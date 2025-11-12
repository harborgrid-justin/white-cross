'use strict';

/**
 * Alter Health Tables Migration
 *
 * This migration alters existing health-related tables to add new fields and functionality.
 * This is Part 2 of 6 in the complete health records schema migration.
 *
 * Changes:
 * - Alters existing health_records table (renames columns, adds new columns)
 * - Alters existing allergies table (adds new columns)
 * - Alters existing chronic_conditions table (adds new columns, updates status enum)
 *
 * Dependencies: 20251010000000-create-health-enums.js (enums must exist)
 * Corresponds to Prisma migration: 20251010_complete_health_records_schema (Part 2)
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // =====================================================
      // STEP 1: Alter Existing health_records Table
      // =====================================================

      // Check if table exists and has the old column names
      const [tables] = await queryInterface.sequelize.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'health_records' AND column_name IN ('type', 'date');
      `, { transaction });

      if (tables.length > 0) {
        // Rename columns if they exist
        const columns = tables.map(t => t.column_name);

        if (columns.includes('type')) {
          await queryInterface.renameColumn('health_records', 'type', 'recordType', { transaction });
        }

        if (columns.includes('date')) {
          await queryInterface.renameColumn('health_records', 'date', 'recordDate', { transaction });
        }
      }

      // Add new columns
      const newHealthRecordColumns = [
        { name: 'title', type: Sequelize.TEXT, allowNull: false, defaultValue: 'Health Record' },
        { name: 'provider', type: Sequelize.TEXT, allowNull: true },
        { name: 'providerNpi', type: Sequelize.TEXT, allowNull: true },
        { name: 'facility', type: Sequelize.TEXT, allowNull: true },
        { name: 'facilityNpi', type: Sequelize.TEXT, allowNull: true },
        { name: 'diagnosis', type: Sequelize.TEXT, allowNull: true },
        { name: 'diagnosisCode', type: Sequelize.TEXT, allowNull: true },
        { name: 'treatment', type: Sequelize.TEXT, allowNull: true },
        { name: 'followUpRequired', type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
        { name: 'followUpDate', type: Sequelize.DATE, allowNull: true },
        { name: 'followUpCompleted', type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
        { name: 'metadata', type: Sequelize.JSONB, allowNull: true },
        { name: 'isConfidential', type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
        { name: 'createdBy', type: Sequelize.TEXT, allowNull: true },
        { name: 'updatedBy', type: Sequelize.TEXT, allowNull: true }
      ];

      for (const col of newHealthRecordColumns) {
        await queryInterface.sequelize.query(`
          ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "${col.name}" ${
            col.type === Sequelize.TEXT ? 'TEXT' :
            col.type === Sequelize.BOOLEAN ? 'BOOLEAN' :
            col.type === Sequelize.DATE ? 'TIMESTAMP(3)' :
            col.type === Sequelize.JSONB ? 'JSONB' : 'TEXT'
          }${col.allowNull === false ? ' NOT NULL' : ''}${
            col.defaultValue !== undefined ?
              (typeof col.defaultValue === 'boolean' ? ` DEFAULT ${col.defaultValue}` :
               typeof col.defaultValue === 'string' ? ` DEFAULT '${col.defaultValue}'` : '') : ''
          };
        `, { transaction });
      }

      // Drop vital column if exists
      await queryInterface.sequelize.query(`
        ALTER TABLE "health_records" DROP COLUMN IF EXISTS "vital";
      `, { transaction });

      // Remove default from title after initial migration
      await queryInterface.sequelize.query(`
        ALTER TABLE "health_records" ALTER COLUMN "title" DROP DEFAULT;
      `, { transaction });

      // =====================================================
      // STEP 2: Alter Existing allergies Table
      // =====================================================

      const allergyColumns = [
        { name: 'allergyType', sql: '"AllergyType" NOT NULL DEFAULT \'OTHER\'' },
        { name: 'symptoms', sql: 'TEXT' },
        { name: 'reactions', sql: 'JSONB' },
        { name: 'treatment', sql: 'TEXT' },
        { name: 'emergencyProtocol', sql: 'TEXT' },
        { name: 'onsetDate', sql: 'TIMESTAMP(3)' },
        { name: 'diagnosedDate', sql: 'TIMESTAMP(3)' },
        { name: 'diagnosedBy', sql: 'TEXT' },
        { name: 'verified', sql: 'BOOLEAN NOT NULL DEFAULT false' },
        { name: 'verifiedBy', sql: 'TEXT' },
        { name: 'verificationDate', sql: 'TIMESTAMP(3)' },
        { name: 'active', sql: 'BOOLEAN NOT NULL DEFAULT true' },
        { name: 'notes', sql: 'TEXT' },
        { name: 'epiPenRequired', sql: 'BOOLEAN NOT NULL DEFAULT false' },
        { name: 'epiPenLocation', sql: 'TEXT' },
        { name: 'epiPenExpiration', sql: 'TIMESTAMP(3)' },
        { name: 'healthRecordId', sql: 'TEXT' },
        { name: 'createdBy', sql: 'TEXT' },
        { name: 'updatedBy', sql: 'TEXT' }
      ];

      for (const col of allergyColumns) {
        await queryInterface.sequelize.query(`
          ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.sql};
        `, { transaction });
      }

      // Drop allergyType default after initial migration
      await queryInterface.sequelize.query(`
        ALTER TABLE "allergies" ALTER COLUMN "allergyType" DROP DEFAULT;
      `, { transaction });

      // =====================================================
      // STEP 3: Alter Existing chronic_conditions Table
      // =====================================================

      const chronicConditionColumns = [
        { name: 'icdCode', sql: 'TEXT' },
        { name: 'diagnosedBy', sql: 'TEXT' },
        { name: 'severity', sql: '"ConditionSeverity" NOT NULL DEFAULT \'MODERATE\'' },
        { name: 'medications', sql: 'JSONB' },
        { name: 'treatments', sql: 'TEXT' },
        { name: 'accommodationsRequired', sql: 'BOOLEAN NOT NULL DEFAULT false' },
        { name: 'accommodationDetails', sql: 'TEXT' },
        { name: 'emergencyProtocol', sql: 'TEXT' },
        { name: 'actionPlan', sql: 'TEXT' },
        { name: 'reviewFrequency', sql: 'TEXT' },
        { name: 'restrictions', sql: 'JSONB' },
        { name: 'precautions', sql: 'JSONB' },
        { name: 'triggers', sql: 'TEXT[]' },
        { name: 'carePlan', sql: 'TEXT' },
        { name: 'lastReviewDate', sql: 'TIMESTAMP(3)' },
        { name: 'healthRecordId', sql: 'TEXT' },
        { name: 'createdBy', sql: 'TEXT' },
        { name: 'updatedBy', sql: 'TEXT' }
      ];

      for (const col of chronicConditionColumns) {
        await queryInterface.sequelize.query(`
          ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.sql};
        `, { transaction });
      }

      // Convert status column to use new enum if it exists as a different type
      await queryInterface.sequelize.query(`
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.columns
                     WHERE table_name = 'chronic_conditions' AND column_name = 'status') THEN
            ALTER TABLE "chronic_conditions" ALTER COLUMN "status" DROP DEFAULT;
            ALTER TABLE "chronic_conditions" ALTER COLUMN "status" TYPE "ConditionStatus"
              USING (
                CASE
                  WHEN "status"::text = 'ACTIVE' THEN 'ACTIVE'::"ConditionStatus"
                  WHEN "status"::text = 'MANAGED' THEN 'MANAGED'::"ConditionStatus"
                  WHEN "status"::text = 'RESOLVED' THEN 'RESOLVED'::"ConditionStatus"
                  WHEN "status"::text = 'MONITORING' THEN 'MONITORING'::"ConditionStatus"
                  ELSE 'ACTIVE'::"ConditionStatus"
                END
              );
            ALTER TABLE "chronic_conditions" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'::"ConditionStatus";
          END IF;
        END $$;
      `, { transaction });

      // Drop severity default after initial migration
      await queryInterface.sequelize.query(`
        ALTER TABLE "chronic_conditions" ALTER COLUMN "severity" DROP DEFAULT;
      `, { transaction });

      await transaction.commit();
      console.log('✓ Alter health tables migration completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Alter health tables migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove added columns from chronic_conditions
      const chronicConditionColumns = [
        'icdCode', 'diagnosedBy', 'severity', 'medications', 'treatments',
        'accommodationsRequired', 'accommodationDetails', 'emergencyProtocol',
        'actionPlan', 'reviewFrequency', 'restrictions', 'precautions',
        'triggers', 'carePlan', 'lastReviewDate', 'healthRecordId',
        'createdBy', 'updatedBy'
      ];

      for (const colName of chronicConditionColumns) {
        await queryInterface.sequelize.query(`
          ALTER TABLE "chronic_conditions" DROP COLUMN IF EXISTS "${colName}";
        `, { transaction });
      }

      // Remove added columns from allergies
      const allergyColumns = [
        'allergyType', 'symptoms', 'reactions', 'treatment', 'emergencyProtocol',
        'onsetDate', 'diagnosedDate', 'diagnosedBy', 'verified', 'verifiedBy',
        'verificationDate', 'active', 'notes', 'epiPenRequired', 'epiPenLocation',
        'epiPenExpiration', 'healthRecordId', 'createdBy', 'updatedBy'
      ];

      for (const colName of allergyColumns) {
        await queryInterface.sequelize.query(`
          ALTER TABLE "allergies" DROP COLUMN IF EXISTS "${colName}";
        `, { transaction });
      }

      // Remove added columns from health_records
      const healthRecordColumns = [
        'title', 'provider', 'providerNpi', 'facility', 'facilityNpi',
        'diagnosis', 'diagnosisCode', 'treatment', 'followUpRequired',
        'followUpDate', 'followUpCompleted', 'metadata', 'isConfidential',
        'createdBy', 'updatedBy'
      ];

      for (const colName of healthRecordColumns) {
        await queryInterface.sequelize.query(`
          ALTER TABLE "health_records" DROP COLUMN IF EXISTS "${colName}";
        `, { transaction });
      }

      // Rename columns back if needed
      const [tables] = await queryInterface.sequelize.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'health_records' AND column_name IN ('recordType', 'recordDate');
      `, { transaction });

      if (tables.length > 0) {
        const columns = tables.map(t => t.column_name);

        if (columns.includes('recordType')) {
          await queryInterface.renameColumn('health_records', 'recordType', 'type', { transaction });
        }

        if (columns.includes('recordDate')) {
          await queryInterface.renameColumn('health_records', 'recordDate', 'date', { transaction });
        }
      }

      await transaction.commit();
      console.log('✓ Alter health tables rollback completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Alter health tables rollback failed:', error);
      throw error;
    }
  }
};
