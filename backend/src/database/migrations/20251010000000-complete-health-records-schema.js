'use strict';

/**
 * Complete Health Records Schema Migration (FIXED VERSION)
 *
 * This migration implements a comprehensive health records system for the White Cross healthcare platform.
 * HIPAA compliant with full audit trails and proper indexing.
 *
 * FIXES APPLIED:
 * - Changed all ID columns from STRING to UUID for consistency
 * - Changed all foreign key columns from TEXT to UUID
 * - Removed unnecessary column rename logic (columns already have correct names)
 * - Fixed data type compatibility for foreign key constraints
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

      // Add new columns (columns already have correct names from original migration)
      const newHealthRecordColumns = [
        { name: 'provider', type: 'TEXT' },
        { name: 'providerNpi', type: 'TEXT' },
        { name: 'facility', type: 'TEXT' },
        { name: 'facilityNpi', type: 'TEXT' },
        { name: 'diagnosis', type: 'TEXT' },
        { name: 'diagnosisCode', type: 'TEXT' },
        { name: 'treatment', type: 'TEXT' },
        { name: 'followUpRequired', type: 'BOOLEAN', default: 'false' },
        { name: 'followUpDate', type: 'TIMESTAMP(3)' },
        { name: 'followUpCompleted', type: 'BOOLEAN', default: 'false' },
        { name: 'metadata', type: 'JSONB' },
        { name: 'isConfidential', type: 'BOOLEAN', default: 'false' },
        { name: 'createdBy', type: 'UUID' },
        { name: 'updatedBy', type: 'UUID' }
      ];

      for (const col of newHealthRecordColumns) {
        const defaultClause = col.default ? ` DEFAULT ${col.default}` : '';
        await queryInterface.sequelize.query(`
          ALTER TABLE "health_records" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type}${defaultClause};
        `, { transaction });
      }

      // =====================================================
      // STEP 4: Alter Existing allergies Table
      // =====================================================

      const allergyColumns = [
        { name: 'allergyType', type: '"AllergyType"', default: "'OTHER'" },
        { name: 'symptoms', type: 'TEXT' },
        { name: 'reactions', type: 'JSONB' },
        { name: 'treatment', type: 'TEXT' },
        { name: 'emergencyProtocol', type: 'TEXT' },
        { name: 'onsetDate', type: 'TIMESTAMP(3)' },
        { name: 'diagnosedDate', type: 'TIMESTAMP(3)' },
        { name: 'diagnosedBy', type: 'TEXT' },
        { name: 'verified', type: 'BOOLEAN', default: 'false' },
        { name: 'verifiedBy', type: 'TEXT' },
        { name: 'verificationDate', type: 'TIMESTAMP(3)' },
        { name: 'active', type: 'BOOLEAN', default: 'true' },
        { name: 'notes', type: 'TEXT' },
        { name: 'epiPenRequired', type: 'BOOLEAN', default: 'false' },
        { name: 'epiPenLocation', type: 'TEXT' },
        { name: 'epiPenExpiration', type: 'TIMESTAMP(3)' },
        { name: 'healthRecordId', type: 'UUID' },  // FIXED: Changed from TEXT to UUID
        { name: 'createdBy', type: 'UUID' },  // FIXED: Changed from TEXT to UUID
        { name: 'updatedBy', type: 'UUID' }   // FIXED: Changed from TEXT to UUID
      ];

      for (const col of allergyColumns) {
        const defaultClause = col.default ? ` DEFAULT ${col.default}` : '';
        await queryInterface.sequelize.query(`
          ALTER TABLE "allergies" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type}${defaultClause};
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
        { name: 'icdCode', type: 'TEXT' },
        { name: 'diagnosedBy', type: 'TEXT' },
        { name: 'severity', type: '"ConditionSeverity"', default: "'MODERATE'" },
        { name: 'medications', type: 'JSONB' },
        { name: 'treatments', type: 'TEXT' },
        { name: 'accommodationsRequired', type: 'BOOLEAN', default: 'false' },
        { name: 'accommodationDetails', type: 'TEXT' },
        { name: 'emergencyProtocol', type: 'TEXT' },
        { name: 'actionPlan', type: 'TEXT' },
        { name: 'reviewFrequency', type: 'TEXT' },
        { name: 'restrictions', type: 'JSONB' },
        { name: 'precautions', type: 'JSONB' },
        { name: 'triggers', type: 'TEXT[]' },
        { name: 'carePlan', type: 'TEXT' },
        { name: 'lastReviewDate', type: 'TIMESTAMP(3)' },
        { name: 'healthRecordId', type: 'UUID' },  // FIXED: Changed from TEXT to UUID
        { name: 'createdBy', type: 'UUID' },  // FIXED: Changed from TEXT to UUID
        { name: 'updatedBy', type: 'UUID' }   // FIXED: Changed from TEXT to UUID
      ];

      for (const col of chronicConditionColumns) {
        const defaultClause = col.default ? ` DEFAULT ${col.default}` : '';
        await queryInterface.sequelize.query(`
          ALTER TABLE "chronic_conditions" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.type}${defaultClause};
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
          type: Sequelize.UUID,  // FIXED: Changed from STRING to UUID
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
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
          type: Sequelize.UUID,  // FIXED: Changed from STRING to UUID
          allowNull: false,
          references: {
            model: 'students',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        healthRecordId: {
          type: Sequelize.UUID,  // FIXED: Changed from STRING to UUID
          allowNull: true,
          references: {
            model: 'health_records',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdBy: {
          type: Sequelize.UUID,  // FIXED: Changed from TEXT to UUID
          allowNull: true
        },
        updatedBy: {
          type: Sequelize.UUID,  // FIXED: Changed from TEXT to UUID
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
          type: Sequelize.UUID,  // FIXED: Changed from STRING to UUID
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
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
          type: Sequelize.UUID,  // FIXED: Changed from STRING to UUID
          allowNull: false,
          references: {
            model: 'students',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        healthRecordId: {
          type: Sequelize.UUID,  // FIXED: Changed from STRING to UUID
          allowNull: true,
          references: {
            model: 'health_records',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdBy: {
          type: Sequelize.UUID,  // FIXED: Changed from TEXT to UUID
          allowNull: true
        },
        updatedBy: {
          type: Sequelize.UUID,  // FIXED: Changed from TEXT to UUID
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
          type: Sequelize.UUID,  // FIXED: Changed from STRING to UUID
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
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
          type: Sequelize.UUID,  // FIXED: Changed from STRING to UUID
          allowNull: false,
          references: {
            model: 'students',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        healthRecordId: {
          type: Sequelize.UUID,  // FIXED: Changed from STRING to UUID
          allowNull: true,
          references: {
            model: 'health_records',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdBy: {
          type: Sequelize.UUID,  // FIXED: Changed from TEXT to UUID
          allowNull: true
        },
        updatedBy: {
          type: Sequelize.UUID,  // FIXED: Changed from TEXT to UUID
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
          type: Sequelize.UUID,  // FIXED: Changed from STRING to UUID
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
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
          type: Sequelize.UUID,  // FIXED: Changed from STRING to UUID
          allowNull: false,
          references: {
            model: 'students',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        healthRecordId: {
          type: Sequelize.UUID,  // FIXED: Changed from STRING to UUID
          allowNull: true,
          references: {
            model: 'health_records',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        appointmentId: {
          type: Sequelize.UUID,  // FIXED: Changed from STRING to UUID
          allowNull: true,
          references: {
            model: 'appointments',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdBy: {
          type: Sequelize.UUID,  // FIXED: Changed from TEXT to UUID
          allowNull: true
        },
        updatedBy: {
          type: Sequelize.UUID,  // FIXED: Changed from TEXT to UUID
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
      console.log('✓ Complete health records schema migration (FIXED) completed successfully');

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
      const columnsToRemove = [
        { table: 'health_records', columns: ['provider', 'providerNpi', 'facility', 'facilityNpi', 'diagnosis', 'diagnosisCode', 'treatment', 'followUpRequired', 'followUpDate', 'followUpCompleted', 'metadata', 'isConfidential', 'createdBy', 'updatedBy'] },
        { table: 'allergies', columns: ['allergyType', 'symptoms', 'reactions', 'treatment', 'emergencyProtocol', 'onsetDate', 'diagnosedDate', 'diagnosedBy', 'verified', 'verifiedBy', 'verificationDate', 'active', 'notes', 'epiPenRequired', 'epiPenLocation', 'epiPenExpiration', 'healthRecordId', 'createdBy', 'updatedBy'] },
        { table: 'chronic_conditions', columns: ['icdCode', 'diagnosedBy', 'severity', 'medications', 'treatments', 'accommodationsRequired', 'accommodationDetails', 'emergencyProtocol', 'actionPlan', 'reviewFrequency', 'restrictions', 'precautions', 'triggers', 'carePlan', 'lastReviewDate', 'healthRecordId', 'createdBy', 'updatedBy'] }
      ];

      for (const { table, columns } of columnsToRemove) {
        for (const column of columns) {
          await queryInterface.sequelize.query(`
            ALTER TABLE "${table}" DROP COLUMN IF EXISTS "${column}";
          `, { transaction });
        }
      }

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

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Rollback failed:', error);
      throw error;
    }
  }
};
