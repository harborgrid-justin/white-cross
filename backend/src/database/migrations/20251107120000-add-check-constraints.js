'use strict';

/**
 * Database CHECK Constraints Migration
 *
 * This migration adds database-level CHECK constraints to enforce data integrity
 * and business logic rules at the database layer. These constraints complement
 * application-level validation and provide an additional layer of data protection.
 *
 * Implements recommendations from SEQUELIZE_MODELS_REVIEW_FINDINGS.md Section 7.3
 *
 * Constraints Added:
 * - Students: Valid grade values (K-12)
 * - Students: Valid age range (4-25 years old)
 * - Medications: Controlled substance schedule consistency
 * - Medications: Witness requirement for Schedule II/III drugs
 * - VitalSigns: Valid temperature, heart rate, and blood pressure ranges
 * - Appointments: Valid duration range (15-240 minutes)
 * - Allergies: EpiPen location required when EpiPen is needed
 *
 * Benefits:
 * - Data integrity enforced at database level
 * - Protection against invalid data from any source (app, direct SQL, imports)
 * - Self-documenting business rules
 * - Performance benefit: constraints checked during write operations
 *
 * Migration ID: DB6C9F-001
 * Task Tracking: .temp/task-status-DB6C9F.json
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Adding database CHECK constraints...');

      // =====================================================
      // STUDENTS TABLE CONSTRAINTS
      // =====================================================

      console.log('Adding student grade validation constraint...');
      await queryInterface.sequelize.query(`
        ALTER TABLE "students"
        ADD CONSTRAINT "chk_students_grade_valid"
        CHECK (
          "grade" IN ('K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12')
        );
      `, { transaction });

      console.log('Adding student age range constraint...');
      await queryInterface.sequelize.query(`
        ALTER TABLE "students"
        ADD CONSTRAINT "chk_students_age_range"
        CHECK (
          "dateOfBirth" IS NULL OR (
            "dateOfBirth" > CURRENT_DATE - INTERVAL '25 years' AND
            "dateOfBirth" < CURRENT_DATE - INTERVAL '4 years'
          )
        );
      `, { transaction });

      // =====================================================
      // MEDICATIONS TABLE CONSTRAINTS
      // =====================================================

      console.log('Adding medication controlled schedule consistency constraint...');
      await queryInterface.sequelize.query(`
        ALTER TABLE "medications"
        ADD CONSTRAINT "chk_medications_controlled_schedule"
        CHECK (
          ("isControlled" = true AND "deaSchedule" IS NOT NULL) OR
          ("isControlled" = false AND "deaSchedule" IS NULL) OR
          ("isControlled" IS NULL)
        );
      `, { transaction });

      console.log('Adding medication witness requirement constraint...');
      await queryInterface.sequelize.query(`
        ALTER TABLE "medications"
        ADD CONSTRAINT "chk_medications_witness_requirement"
        CHECK (
          ("deaSchedule" IN ('II', 'III') AND "requiresWitness" = true) OR
          ("deaSchedule" NOT IN ('II', 'III')) OR
          ("deaSchedule" IS NULL)
        );
      `, { transaction });

      // =====================================================
      // VITAL SIGNS TABLE CONSTRAINTS
      // =====================================================

      console.log('Adding vital signs temperature range constraint...');
      await queryInterface.sequelize.query(`
        ALTER TABLE "vital_signs"
        ADD CONSTRAINT "chk_vital_signs_temperature_range"
        CHECK (
          "temperature" IS NULL OR
          ("temperature" >= 90.0 AND "temperature" <= 110.0)
        );
      `, { transaction });

      console.log('Adding vital signs heart rate range constraint...');
      await queryInterface.sequelize.query(`
        ALTER TABLE "vital_signs"
        ADD CONSTRAINT "chk_vital_signs_heart_rate_range"
        CHECK (
          "heartRate" IS NULL OR
          ("heartRate" >= 40 AND "heartRate" <= 220)
        );
      `, { transaction });

      console.log('Adding vital signs blood pressure range constraint...');
      await queryInterface.sequelize.query(`
        ALTER TABLE "vital_signs"
        ADD CONSTRAINT "chk_vital_signs_blood_pressure_range"
        CHECK (
          "systolic" IS NULL OR
          ("systolic" >= 60 AND "systolic" <= 250)
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TABLE "vital_signs"
        ADD CONSTRAINT "chk_vital_signs_diastolic_range"
        CHECK (
          "diastolic" IS NULL OR
          ("diastolic" >= 40 AND "diastolic" <= 150)
        );
      `, { transaction });

      // =====================================================
      // APPOINTMENTS TABLE CONSTRAINTS
      // =====================================================

      console.log('Adding appointment duration range constraint...');
      await queryInterface.sequelize.query(`
        ALTER TABLE "appointments"
        ADD CONSTRAINT "chk_appointments_duration_range"
        CHECK (
          "duration" IS NULL OR
          ("duration" >= 15 AND "duration" <= 240)
        );
      `, { transaction });

      // =====================================================
      // ALLERGIES TABLE CONSTRAINTS
      // =====================================================

      console.log('Adding allergy EpiPen location constraint...');
      await queryInterface.sequelize.query(`
        ALTER TABLE "allergies"
        ADD CONSTRAINT "chk_allergies_epipen_location"
        CHECK (
          ("epiPenRequired" = false OR "epiPenRequired" IS NULL) OR
          ("epiPenRequired" = true AND "epiPenLocation" IS NOT NULL)
        );
      `, { transaction });

      // =====================================================
      // ADDITIONAL BUSINESS LOGIC CONSTRAINTS
      // =====================================================

      console.log('Adding medication dosage positive constraint...');
      await queryInterface.sequelize.query(`
        ALTER TABLE "student_medications"
        ADD CONSTRAINT "chk_student_medications_dosage_positive"
        CHECK (
          "dosage" IS NULL OR
          "dosage" ~ '^[0-9]'
        );
      `, { transaction });

      console.log('Adding health record valid date constraint...');
      await queryInterface.sequelize.query(`
        ALTER TABLE "health_records"
        ADD CONSTRAINT "chk_health_records_record_date"
        CHECK (
          "recordDate" <= CURRENT_DATE + INTERVAL '1 day'
        );
      `, { transaction });

      console.log('Adding vaccination administration date constraint...');
      await queryInterface.sequelize.query(`
        ALTER TABLE "vaccinations"
        ADD CONSTRAINT "chk_vaccinations_administration_date"
        CHECK (
          "administrationDate" IS NULL OR
          "administrationDate" <= CURRENT_DATE + INTERVAL '1 day'
        );
      `, { transaction });

      await transaction.commit();
      console.log('CHECK constraints added successfully!');

    } catch (error) {
      await transaction.rollback();
      console.error('Error adding CHECK constraints:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Removing database CHECK constraints...');

      // Remove all CHECK constraints in reverse order
      const constraints = [
        { table: 'vaccinations', constraint: 'chk_vaccinations_administration_date' },
        { table: 'health_records', constraint: 'chk_health_records_record_date' },
        { table: 'student_medications', constraint: 'chk_student_medications_dosage_positive' },
        { table: 'allergies', constraint: 'chk_allergies_epipen_location' },
        { table: 'appointments', constraint: 'chk_appointments_duration_range' },
        { table: 'vital_signs', constraint: 'chk_vital_signs_diastolic_range' },
        { table: 'vital_signs', constraint: 'chk_vital_signs_blood_pressure_range' },
        { table: 'vital_signs', constraint: 'chk_vital_signs_heart_rate_range' },
        { table: 'vital_signs', constraint: 'chk_vital_signs_temperature_range' },
        { table: 'medications', constraint: 'chk_medications_witness_requirement' },
        { table: 'medications', constraint: 'chk_medications_controlled_schedule' },
        { table: 'students', constraint: 'chk_students_age_range' },
        { table: 'students', constraint: 'chk_students_grade_valid' },
      ];

      for (const { table, constraint } of constraints) {
        console.log(`Dropping constraint ${constraint} from ${table}...`);
        await queryInterface.sequelize.query(`
          ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${constraint}";
        `, { transaction });
      }

      await transaction.commit();
      console.log('CHECK constraints removed successfully!');

    } catch (error) {
      await transaction.rollback();
      console.error('Error removing CHECK constraints:', error);
      throw error;
    }
  }
};
