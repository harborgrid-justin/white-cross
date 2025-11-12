'use strict';

/**
 * Create Vaccinations Table Migration
 *
 * This migration creates the vaccinations table for tracking student immunization records.
 * This is Part 3 of 6 in the complete health records schema migration.
 *
 * Changes:
 * - Creates vaccinations table with comprehensive vaccination tracking
 * - Includes compliance status, exemptions, and adverse event tracking
 * - Links to students and health_records tables
 *
 * Dependencies:
 * - 20251010000000-create-health-enums.js (VaccineType, AdministrationSite, etc.)
 * - students and health_records tables must exist
 *
 * Corresponds to Prisma migration: 20251010_complete_health_records_schema (Part 3)
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
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

      await transaction.commit();
      console.log('✓ Vaccinations table migration completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Vaccinations table migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('vaccinations', { transaction });

      await transaction.commit();
      console.log('✓ Vaccinations table rollback completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Vaccinations table rollback failed:', error);
      throw error;
    }
  }
};
