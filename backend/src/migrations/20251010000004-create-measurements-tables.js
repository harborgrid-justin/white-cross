'use strict';

/**
 * Create Measurements Tables Migration
 *
 * This migration creates tables for tracking growth measurements and vital signs.
 * This is Part 5 of 6 in the complete health records schema migration.
 *
 * Changes:
 * - Creates growth_measurements table for tracking height, weight, BMI, percentiles
 * - Creates vital_signs table for tracking temperature, blood pressure, heart rate, etc.
 * - Links to students, health_records, and appointments tables
 *
 * Dependencies:
 * - 20251010000000-create-health-enums.js (ConsciousnessLevel)
 * - students, health_records, and appointments tables must exist
 *
 * Corresponds to Prisma migration: 20251010_complete_health_records_schema (Part 5)
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // =====================================================
      // Create growth_measurements Table
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
      // Create vital_signs Table
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

      await transaction.commit();
      console.log('✓ Growth measurements and vital signs tables migration completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Growth measurements and vital signs tables migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('vital_signs', { transaction });
      await queryInterface.dropTable('growth_measurements', { transaction });

      await transaction.commit();
      console.log('✓ Growth measurements and vital signs tables rollback completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Growth measurements and vital signs tables rollback failed:', error);
      throw error;
    }
  }
};
