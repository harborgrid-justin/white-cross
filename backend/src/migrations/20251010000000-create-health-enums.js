'use strict';

/**
 * Create Health Enums Migration
 *
 * This migration creates all enum types needed for the health records system.
 * This is Part 1 of 6 in the complete health records schema migration.
 *
 * Changes:
 * - Creates new health-related enums (AllergyType, ConditionSeverity, VaccineType, etc.)
 * - Enhances HealthRecordType enum with additional values
 *
 * Dependencies: None (must run first)
 * Corresponds to Prisma migration: 20251010_complete_health_records_schema (Part 1)
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

      await transaction.commit();
      console.log('✓ Health enums migration completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Health enums migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop enums in reverse order
      const enums = [
        'ConsciousnessLevel', 'FollowUpStatus', 'ScreeningOutcome', 'ScreeningType',
        'VaccineComplianceStatus', 'AdministrationRoute', 'AdministrationSite',
        'VaccineType', 'ConditionStatus', 'ConditionSeverity', 'AllergyType'
      ];

      for (const enumName of enums) {
        await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "${enumName}" CASCADE;`, { transaction });
      }

      await transaction.commit();
      console.log('✓ Health enums rollback completed successfully');
      console.log('⚠ Note: HealthRecordType enum values cannot be easily removed');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Health enums rollback failed:', error);
      throw error;
    }
  }
};
