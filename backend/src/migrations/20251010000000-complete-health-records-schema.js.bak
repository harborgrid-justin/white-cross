'use strict';

/**
 * Complete Health Records Schema Migration
 *
 * This migration implements a comprehensive health records system for the White Cross healthcare platform.
 * HIPAA compliant with full audit trails and proper indexing.
 *
 * Changes:
 * - Creates new health-related enums (AllergyType, ConditionSeverity, VaccineType, etc.)
 * - Enhances HealthRecordType enum with additional values
 * - Alters existing health_records, allergies, and chronic_conditions tables
 * - Creates new tables: vaccinations, screenings, growth_measurements, vital_signs
 * - Adds comprehensive indexes for performance
 *
 * Corresponds to Prisma migration: 20251010_complete_health_records_schema
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // =====================================================
      // STEP 1: Create New Enums
      // =====================================================

      await queryInterface.sequelize.query(`
        CREATE TYPE "AllergyType" AS ENUM (
          'FOOD',
          'MEDICATION',
          'ENVIRONMENTAL',
          'INSECT',
          'LATEX',
          'ANIMAL',
          'CHEMICAL',
          'SEASONAL',
          'OTHER'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ConditionSeverity" AS ENUM (
          'MILD',
          'MODERATE',
          'SEVERE',
          'CRITICAL'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ConditionStatus" AS ENUM (
          'ACTIVE',
          'MANAGED',
          'RESOLVED',
          'MONITORING',
          'INACTIVE'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "VaccineType" AS ENUM (
          'COVID_19',
          'FLU',
          'MEASLES',
          'MUMPS',
          'RUBELLA',
          'MMR',
          'POLIO',
          'HEPATITIS_A',
          'HEPATITIS_B',
          'VARICELLA',
          'TETANUS',
          'DIPHTHERIA',
          'PERTUSSIS',
          'TDAP',
          'DTaP',
          'HIB',
          'PNEUMOCOCCAL',
          'ROTAVIRUS',
          'MENINGOCOCCAL',
          'HPV',
          'OTHER'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "AdministrationSite" AS ENUM (
          'ARM_LEFT',
          'ARM_RIGHT',
          'THIGH_LEFT',
          'THIGH_RIGHT',
          'DELTOID_LEFT',
          'DELTOID_RIGHT',
          'BUTTOCK_LEFT',
          'BUTTOCK_RIGHT',
          'ORAL',
          'NASAL',
          'OTHER'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "AdministrationRoute" AS ENUM (
          'INTRAMUSCULAR',
          'SUBCUTANEOUS',
          'INTRADERMAL',
          'ORAL',
          'INTRANASAL',
          'INTRAVENOUS',
          'OTHER'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "VaccineComplianceStatus" AS ENUM (
          'COMPLIANT',
          'OVERDUE',
          'PARTIALLY_COMPLIANT',
          'EXEMPT',
          'NON_COMPLIANT'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ScreeningType" AS ENUM (
          'VISION',
          'HEARING',
          'SCOLIOSIS',
          'DENTAL',
          'BMI',
          'BLOOD_PRESSURE',
          'DEVELOPMENTAL',
          'SPEECH',
          'MENTAL_HEALTH',
          'TUBERCULOSIS',
          'LEAD',
          'ANEMIA',
          'OTHER'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ScreeningOutcome" AS ENUM (
          'PASS',
          'REFER',
          'FAIL',
          'INCONCLUSIVE',
          'INCOMPLETE'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "FollowUpStatus" AS ENUM (
          'PENDING',
          'SCHEDULED',
          'COMPLETED',
          'CANCELLED',
          'OVERDUE',
          'NOT_NEEDED'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ConsciousnessLevel" AS ENUM (
          'ALERT',
          'VERBAL',
          'PAIN',
          'UNRESPONSIVE',
          'DROWSY',
          'CONFUSED',
          'LETHARGIC'
        );
      `, { transaction });

      // =====================================================
      // STEP 2: Update Existing Enums
      // =====================================================

      const healthRecordTypeValues = [
        'EXAMINATION', 'ALLERGY_DOCUMENTATION', 'CHRONIC_CONDITION_REVIEW',
        'GROWTH_ASSESSMENT', 'VITAL_SIGNS_CHECK', 'EMERGENCY_VISIT',
        'FOLLOW_UP', 'CONSULTATION', 'DIAGNOSTIC_TEST', 'PROCEDURE',
        'HOSPITALIZATION', 'SURGERY', 'COUNSELING', 'THERAPY',
        'NUTRITION', 'MEDICATION_REVIEW', 'IMMUNIZATION', 'LAB_RESULT',
        'RADIOLOGY', 'OTHER'
      ];

      for (const value of healthRecordTypeValues) {
        await queryInterface.sequelize.query(`
          ALTER TYPE "HealthRecordType" ADD VALUE IF NOT EXISTS '${value}';
        `, { transaction });
      }

      // =====================================================
      // STEP 3: Alter Existing health_records Table
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
      // STEP 4: Alter Existing allergies Table
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
      // STEP 5: Alter Existing chronic_conditions Table
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

      // =====================================================
      // STEP 6: Create vaccinations Table
      // =====================================================

      await queryInterface.createTable('vaccinations', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },
        vaccineName: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        vaccineType: {
          type: Sequelize.ENUM(
            'COVID_19', 'FLU', 'MEASLES', 'MUMPS', 'RUBELLA', 'MMR', 'POLIO',
            'HEPATITIS_A', 'HEPATITIS_B', 'VARICELLA', 'TETANUS', 'DIPHTHERIA',
            'PERTUSSIS', 'TDAP', 'DTaP', 'HIB', 'PNEUMOCOCCAL', 'ROTAVIRUS',
            'MENINGOCOCCAL', 'HPV', 'OTHER'
          ),
          allowNull: true
        },
        manufacturer: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        lotNumber: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        cvxCode: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        ndcCode: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        doseNumber: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        totalDoses: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        seriesComplete: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        administrationDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        administeredBy: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        administeredByRole: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        facility: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        siteOfAdministration: {
          type: Sequelize.ENUM(
            'ARM_LEFT', 'ARM_RIGHT', 'THIGH_LEFT', 'THIGH_RIGHT',
            'DELTOID_LEFT', 'DELTOID_RIGHT', 'BUTTOCK_LEFT', 'BUTTOCK_RIGHT',
            'ORAL', 'NASAL', 'OTHER'
          ),
          allowNull: true
        },
        routeOfAdministration: {
          type: Sequelize.ENUM(
            'INTRAMUSCULAR', 'SUBCUTANEOUS', 'INTRADERMAL',
            'ORAL', 'INTRANASAL', 'INTRAVENOUS', 'OTHER'
          ),
          allowNull: true
        },
        dosageAmount: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        expirationDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        nextDueDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        reactions: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        adverseEvents: {
          type: Sequelize.JSONB,
          allowNull: true
        },
        exemptionStatus: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        exemptionReason: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        exemptionDocument: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        complianceStatus: {
          type: Sequelize.ENUM(
            'COMPLIANT', 'OVERDUE', 'PARTIALLY_COMPLIANT', 'EXEMPT', 'NON_COMPLIANT'
          ),
          allowNull: false,
          defaultValue: 'COMPLIANT'
        },
        vfcEligibility: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        visProvided: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        visDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        consentObtained: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        consentBy: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        studentId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'students',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        healthRecordId: {
          type: Sequelize.STRING,
          allowNull: true,
          references: {
            model: 'health_records',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdBy: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        updatedBy: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // =====================================================
      // STEP 7: Create screenings Table
      // =====================================================

      await queryInterface.createTable('screenings', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },
        screeningType: {
          type: Sequelize.ENUM(
            'VISION', 'HEARING', 'SCOLIOSIS', 'DENTAL', 'BMI', 'BLOOD_PRESSURE',
            'DEVELOPMENTAL', 'SPEECH', 'MENTAL_HEALTH', 'TUBERCULOSIS', 'LEAD',
            'ANEMIA', 'OTHER'
          ),
          allowNull: false
        },
        screeningDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        screenedBy: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        screenedByRole: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        results: {
          type: Sequelize.JSONB,
          allowNull: true
        },
        outcome: {
          type: Sequelize.ENUM('PASS', 'REFER', 'FAIL', 'INCONCLUSIVE', 'INCOMPLETE'),
          allowNull: false,
          defaultValue: 'PASS'
        },
        referralRequired: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        referralTo: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        referralDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        referralReason: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        followUpRequired: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        followUpDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        followUpStatus: {
          type: Sequelize.ENUM(
            'PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'OVERDUE', 'NOT_NEEDED'
          ),
          allowNull: true
        },
        equipmentUsed: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        testDetails: {
          type: Sequelize.JSONB,
          allowNull: true
        },
        rightEye: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        leftEye: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        rightEar: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        leftEar: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        passedCriteria: {
          type: Sequelize.BOOLEAN,
          allowNull: true
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        studentId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'students',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        healthRecordId: {
          type: Sequelize.STRING,
          allowNull: true,
          references: {
            model: 'health_records',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdBy: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        updatedBy: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // =====================================================
      // STEP 8: Create growth_measurements Table
      // =====================================================

      await queryInterface.createTable('growth_measurements', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },
        measurementDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        measuredBy: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        measuredByRole: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        height: {
          type: Sequelize.DECIMAL(65, 30),
          allowNull: true
        },
        heightUnit: {
          type: Sequelize.TEXT,
          allowNull: false,
          defaultValue: 'cm'
        },
        weight: {
          type: Sequelize.DECIMAL(65, 30),
          allowNull: true
        },
        weightUnit: {
          type: Sequelize.TEXT,
          allowNull: false,
          defaultValue: 'kg'
        },
        bmi: {
          type: Sequelize.DECIMAL(65, 30),
          allowNull: true
        },
        bmiPercentile: {
          type: Sequelize.DECIMAL(65, 30),
          allowNull: true
        },
        headCircumference: {
          type: Sequelize.DECIMAL(65, 30),
          allowNull: true
        },
        heightPercentile: {
          type: Sequelize.DECIMAL(65, 30),
          allowNull: true
        },
        weightPercentile: {
          type: Sequelize.DECIMAL(65, 30),
          allowNull: true
        },
        growthPercentiles: {
          type: Sequelize.JSONB,
          allowNull: true
        },
        nutritionalStatus: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        concerns: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        studentId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'students',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        healthRecordId: {
          type: Sequelize.STRING,
          allowNull: true,
          references: {
            model: 'health_records',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdBy: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        updatedBy: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // =====================================================
      // STEP 9: Create vital_signs Table
      // =====================================================

      await queryInterface.createTable('vital_signs', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },
        measurementDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        measuredBy: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        measuredByRole: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        temperature: {
          type: Sequelize.DECIMAL(65, 30),
          allowNull: true
        },
        temperatureUnit: {
          type: Sequelize.TEXT,
          allowNull: false,
          defaultValue: 'F'
        },
        temperatureSite: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        bloodPressureSystolic: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        bloodPressureDiastolic: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        bloodPressurePosition: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        heartRate: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        heartRhythm: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        respiratoryRate: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        oxygenSaturation: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        oxygenSupplemental: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        painLevel: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        painLocation: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        consciousness: {
          type: Sequelize.ENUM(
            'ALERT', 'VERBAL', 'PAIN', 'UNRESPONSIVE',
            'DROWSY', 'CONFUSED', 'LETHARGIC'
          ),
          allowNull: true
        },
        glucoseLevel: {
          type: Sequelize.DECIMAL(65, 30),
          allowNull: true
        },
        peakFlow: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        studentId: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'students',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        healthRecordId: {
          type: Sequelize.STRING,
          allowNull: true,
          references: {
            model: 'health_records',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        appointmentId: {
          type: Sequelize.STRING,
          allowNull: true,
          references: {
            model: 'appointments',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdBy: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        updatedBy: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // =====================================================
      // STEP 10: Add Foreign Key Constraints to existing tables
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
      // STEP 11: Create Indexes for Performance Optimization
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
      // STEP 12: Add Table and Column Comments
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
      console.log('✓ Complete health records schema migration completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop tables in reverse order
      await queryInterface.dropTable('vital_signs', { transaction });
      await queryInterface.dropTable('growth_measurements', { transaction });
      await queryInterface.dropTable('screenings', { transaction });
      await queryInterface.dropTable('vaccinations', { transaction });

      // Remove foreign key constraints
      await queryInterface.sequelize.query(`
        ALTER TABLE "chronic_conditions" DROP CONSTRAINT IF EXISTS "chronic_conditions_healthRecordId_fkey";
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TABLE "allergies" DROP CONSTRAINT IF EXISTS "allergies_healthRecordId_fkey";
      `, { transaction });

      // Remove added columns from existing tables
      // (Complex - would need to list all columns added)

      // Drop enums
      const enums = [
        'ConsciousnessLevel', 'FollowUpStatus', 'ScreeningOutcome', 'ScreeningType',
        'VaccineComplianceStatus', 'AdministrationRoute', 'AdministrationSite',
        'VaccineType', 'ConditionStatus', 'ConditionSeverity', 'AllergyType'
      ];

      for (const enumName of enums) {
        await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "${enumName}" CASCADE;`, { transaction });
      }

      await transaction.commit();
      console.log('✓ Rollback completed successfully');
      console.log('⚠ Note: Some column removals and enum value removals may require manual intervention');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Rollback failed:', error);
      throw error;
    }
  }
};
