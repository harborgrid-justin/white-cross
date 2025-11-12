'use strict';

/**
 * Create Screenings Table Migration
 *
 * This migration creates the screenings table for tracking student health screenings.
 * This is Part 4 of 6 in the complete health records schema migration.
 *
 * Changes:
 * - Creates screenings table for vision, hearing, scoliosis, and other health screenings
 * - Includes referral tracking and follow-up management
 * - Links to students and health_records tables
 *
 * Dependencies:
 * - 20251010000000-create-health-enums.js (ScreeningType, ScreeningOutcome, FollowUpStatus)
 * - students and health_records tables must exist
 *
 * Corresponds to Prisma migration: 20251010_complete_health_records_schema (Part 4)
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
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

      await transaction.commit();
      console.log('✓ Screenings table migration completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Screenings table migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('screenings', { transaction });

      await transaction.commit();
      console.log('✓ Screenings table rollback completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Screenings table rollback failed:', error);
      throw error;
    }
  }
};
