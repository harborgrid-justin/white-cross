'use strict';

/**
 * Create Core Health Records Migration
 *
 * This migration creates the essential health records infrastructure:
 * - health_records: Main health records table
 * - allergies: Student allergy tracking
 * - chronic_conditions: Chronic condition management
 * - appointments: Healthcare appointments
 *
 * NOTE: This is a foundational migration. Additional health tables (vaccinations,
 * screenings, vital_signs, growth_measurements) are created in the comprehensive
 * health records migration (20251010000000-complete-health-records-schema.js)
 *
 * HIPAA Compliance: All tables include soft deletes and audit fields
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Creating core health records tables...');

      // =====================================================
      // STEP 1: Create Health Record ENUMs
      // =====================================================

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE "HealthRecordType" AS ENUM (
            'CHECKUP',
            'VACCINATION',
            'ILLNESS',
            'INJURY',
            'SCREENING',
            'PHYSICAL_EXAM',
            'MENTAL_HEALTH',
            'DENTAL',
            'VISION',
            'HEARING',
            'EXAMINATION',
            'ALLERGY_DOCUMENTATION',
            'CHRONIC_CONDITION_REVIEW',
            'GROWTH_ASSESSMENT',
            'VITAL_SIGNS_CHECK',
            'EMERGENCY_VISIT',
            'FOLLOW_UP',
            'CONSULTATION',
            'DIAGNOSTIC_TEST',
            'PROCEDURE',
            'HOSPITALIZATION',
            'SURGERY',
            'COUNSELING',
            'THERAPY',
            'NUTRITION',
            'MEDICATION_REVIEW',
            'IMMUNIZATION',
            'LAB_RESULT',
            'RADIOLOGY',
            'OTHER'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE "AllergySeverity" AS ENUM (
            'MILD',
            'MODERATE',
            'SEVERE',
            'LIFE_THREATENING'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE "AppointmentStatus" AS ENUM (
            'SCHEDULED',
            'IN_PROGRESS',
            'COMPLETED',
            'CANCELLED',
            'NO_SHOW',
            'RESCHEDULED'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      // =====================================================
      // STEP 2: Create health_records Table
      // =====================================================

      await queryInterface.createTable('health_records', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        studentId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'students',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        recordType: {
          type: Sequelize.ENUM(
            'CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING',
            'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING',
            'EXAMINATION', 'ALLERGY_DOCUMENTATION', 'CHRONIC_CONDITION_REVIEW',
            'GROWTH_ASSESSMENT', 'VITAL_SIGNS_CHECK', 'EMERGENCY_VISIT',
            'FOLLOW_UP', 'CONSULTATION', 'DIAGNOSTIC_TEST', 'PROCEDURE',
            'HOSPITALIZATION', 'SURGERY', 'COUNSELING', 'THERAPY', 'NUTRITION',
            'MEDICATION_REVIEW', 'IMMUNIZATION', 'LAB_RESULT', 'RADIOLOGY', 'OTHER'
          ),
          allowNull: false
        },
        title: {
          type: Sequelize.STRING(200),
          allowNull: false
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        recordDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        provider: {
          type: Sequelize.STRING(200),
          allowNull: true
        },
        providerNpi: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        facility: {
          type: Sequelize.STRING(200),
          allowNull: true
        },
        facilityNpi: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        diagnosis: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        diagnosisCode: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        treatment: {
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
        followUpCompleted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        attachments: {
          type: Sequelize.JSON,
          allowNull: false,
          defaultValue: []
        },
        metadata: {
          type: Sequelize.JSONB,
          allowNull: true
        },
        isConfidential: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdBy: {
          type: Sequelize.UUID,
          allowNull: true
        },
        updatedBy: {
          type: Sequelize.UUID,
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
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true,
          comment: 'Soft delete timestamp for HIPAA compliance'
        }
      }, { transaction });

      // =====================================================
      // STEP 3: Create allergies Table
      // =====================================================

      await queryInterface.createTable('allergies', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        studentId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'students',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        allergen: {
          type: Sequelize.STRING(200),
          allowNull: false,
          comment: 'Name of the allergen'
        },
        severity: {
          type: Sequelize.ENUM('MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'),
          allowNull: false,
          defaultValue: 'MODERATE'
        },
        reaction: {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: 'Description of allergic reaction'
        },
        diagnosedDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        diagnosedBy: {
          type: Sequelize.STRING(200),
          allowNull: true
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        createdBy: {
          type: Sequelize.UUID,
          allowNull: true
        },
        updatedBy: {
          type: Sequelize.UUID,
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
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true
        }
      }, { transaction });

      // =====================================================
      // STEP 4: Create chronic_conditions Table
      // =====================================================

      await queryInterface.createTable('chronic_conditions', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        studentId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'students',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        conditionName: {
          type: Sequelize.STRING(200),
          allowNull: false
        },
        diagnosedDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        managementPlan: {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: 'Management and treatment plan'
        },
        status: {
          type: Sequelize.STRING(50),
          allowNull: false,
          defaultValue: 'ACTIVE'
        },
        nextReviewDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdBy: {
          type: Sequelize.UUID,
          allowNull: true
        },
        updatedBy: {
          type: Sequelize.UUID,
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
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true
        }
      }, { transaction });

      // =====================================================
      // STEP 5: Create appointments Table
      // =====================================================

      await queryInterface.createTable('appointments', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        studentId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'students',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        nurseId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        scheduledAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        duration: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 30,
          comment: 'Duration in minutes'
        },
        status: {
          type: Sequelize.ENUM('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED'),
          allowNull: false,
          defaultValue: 'SCHEDULED'
        },
        reason: {
          type: Sequelize.STRING(200),
          allowNull: false
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        completedAt: {
          type: Sequelize.DATE,
          allowNull: true
        },
        cancelledAt: {
          type: Sequelize.DATE,
          allowNull: true
        },
        cancellationReason: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdBy: {
          type: Sequelize.UUID,
          allowNull: true
        },
        updatedBy: {
          type: Sequelize.UUID,
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
      // STEP 6: Create Basic Indexes
      // =====================================================

      // Health Records indexes
      await queryInterface.addIndex('health_records', ['studentId', 'recordDate'], {
        name: 'health_records_student_date_idx',
        transaction
      });

      await queryInterface.addIndex('health_records', ['recordType'], {
        name: 'health_records_type_idx',
        transaction
      });

      // Allergies indexes
      await queryInterface.addIndex('allergies', ['studentId'], {
        name: 'allergies_student_idx',
        transaction
      });

      await queryInterface.addIndex('allergies', ['severity'], {
        name: 'allergies_severity_idx',
        transaction
      });

      await queryInterface.addIndex('allergies', ['isActive'], {
        name: 'allergies_isActive_idx',
        transaction
      });

      // Chronic Conditions indexes
      await queryInterface.addIndex('chronic_conditions', ['studentId'], {
        name: 'chronic_conditions_student_idx',
        transaction
      });

      await queryInterface.addIndex('chronic_conditions', ['status'], {
        name: 'chronic_conditions_status_idx',
        transaction
      });

      // Appointments indexes
      await queryInterface.addIndex('appointments', ['studentId'], {
        name: 'appointments_student_idx',
        transaction
      });

      await queryInterface.addIndex('appointments', ['nurseId', 'scheduledAt'], {
        name: 'appointments_nurse_scheduled_idx',
        transaction
      });

      await queryInterface.addIndex('appointments', ['status'], {
        name: 'appointments_status_idx',
        transaction
      });

      await transaction.commit();
      console.log('✓ Core health records migration completed successfully');

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
      await queryInterface.dropTable('appointments', { transaction });
      await queryInterface.dropTable('chronic_conditions', { transaction });
      await queryInterface.dropTable('allergies', { transaction });
      await queryInterface.dropTable('health_records', { transaction });

      // Drop enums
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "AppointmentStatus" CASCADE;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "AllergySeverity" CASCADE;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "HealthRecordType" CASCADE;', { transaction });

      await transaction.commit();
      console.log('✓ Core health records rollback completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Rollback failed:', error);
      throw error;
    }
  }
};
