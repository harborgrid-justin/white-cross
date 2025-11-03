'use strict';

/**
 * Create Additional Critical Tables Migration
 *
 * This migration creates supporting tables for the White Cross healthcare platform:
 * - medications: Medication inventory
 * - student_medications: Student medication assignments
 * - medication_logs: Medication administration tracking
 * - incident_reports: Health incident reporting
 * - emergency_contacts: Emergency contact information
 *
 * HIPAA Compliance: Medication logs and incident reports include full audit trails
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Creating additional critical tables...');

      // =====================================================
      // STEP 1: Create Additional ENUMs
      // =====================================================

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE "IncidentSeverity" AS ENUM (
            'LOW',
            'MEDIUM',
            'HIGH',
            'CRITICAL'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE "IncidentType" AS ENUM (
            'INJURY',
            'ILLNESS',
            'ALLERGIC_REACTION',
            'MEDICATION_ERROR',
            'BEHAVIORAL',
            'ENVIRONMENTAL',
            'OTHER'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      // =====================================================
      // STEP 2: Create medications Table
      // =====================================================

      await queryInterface.createTable('medications', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        name: {
          type: Sequelize.STRING(200),
          allowNull: false
        },
        genericName: {
          type: Sequelize.STRING(200),
          allowNull: true
        },
        category: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        dosageForm: {
          type: Sequelize.STRING(100),
          allowNull: true,
          comment: 'e.g., tablet, capsule, liquid, injection'
        },
        strength: {
          type: Sequelize.STRING(50),
          allowNull: true,
          comment: 'e.g., 500mg, 10ml'
        },
        stockQuantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        minimumStock: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        expirationDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        manufacturer: {
          type: Sequelize.STRING(200),
          allowNull: true
        },
        ndcCode: {
          type: Sequelize.STRING(20),
          allowNull: true,
          comment: 'National Drug Code'
        },
        lotNumber: {
          type: Sequelize.STRING(50),
          allowNull: true
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        requiresRefrigeration: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        controlledSubstance: {
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
        }
      }, { transaction });

      // =====================================================
      // STEP 3: Create student_medications Table
      // =====================================================

      await queryInterface.createTable('student_medications', {
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
        medicationId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'medications',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        dosage: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        frequency: {
          type: Sequelize.STRING(100),
          allowNull: false,
          comment: 'e.g., "twice daily", "every 6 hours"'
        },
        route: {
          type: Sequelize.STRING(50),
          allowNull: true,
          comment: 'e.g., oral, topical, injection'
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: false
        },
        endDate: {
          type: Sequelize.DATE,
          allowNull: true
        },
        prescribedBy: {
          type: Sequelize.STRING(200),
          allowNull: false
        },
        prescribedByNpi: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        instructions: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        sideEffects: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        requiresParentConsent: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        consentObtained: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        consentDate: {
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
        }
      }, { transaction });

      // =====================================================
      // STEP 4: Create medication_logs Table
      // =====================================================

      await queryInterface.createTable('medication_logs', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        studentMedicationId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'student_medications',
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
        timeGiven: {
          type: Sequelize.DATE,
          allowNull: false,
          comment: 'Exact time medication was administered'
        },
        dosageGiven: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        reasonForAdministration: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        studentResponse: {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: 'How student responded to medication'
        },
        adverseReaction: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        reactionDetails: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        witnessedBy: {
          type: Sequelize.UUID,
          allowNull: true,
          comment: 'User ID of witness if required'
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // =====================================================
      // STEP 5: Create incident_reports Table
      // =====================================================

      await queryInterface.createTable('incident_reports', {
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
        reportedById: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        type: {
          type: Sequelize.ENUM('INJURY', 'ILLNESS', 'ALLERGIC_REACTION', 'MEDICATION_ERROR', 'BEHAVIORAL', 'ENVIRONMENTAL', 'OTHER'),
          allowNull: false
        },
        severity: {
          type: Sequelize.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
          allowNull: false
        },
        occurredAt: {
          type: Sequelize.DATE,
          allowNull: false,
          comment: 'When the incident occurred'
        },
        location: {
          type: Sequelize.STRING(200),
          allowNull: true,
          comment: 'Where the incident occurred'
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        actionTaken: {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: 'Immediate action taken in response'
        },
        parentNotified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        parentNotifiedAt: {
          type: Sequelize.DATE,
          allowNull: true
        },
        parentNotifiedBy: {
          type: Sequelize.UUID,
          allowNull: true
        },
        emergencyServicesContacted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        emergencyDetails: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        followUpRequired: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        followUpNotes: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        witnesses: {
          type: Sequelize.JSON,
          allowNull: true,
          comment: 'Array of witness information'
        },
        attachments: {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: []
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
      // STEP 6: Create emergency_contacts Table
      // =====================================================

      await queryInterface.createTable('emergency_contacts', {
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
        name: {
          type: Sequelize.STRING(200),
          allowNull: false
        },
        relationship: {
          type: Sequelize.STRING(100),
          allowNull: false,
          comment: 'e.g., Parent, Guardian, Grandparent'
        },
        primaryPhone: {
          type: Sequelize.STRING(20),
          allowNull: false
        },
        secondaryPhone: {
          type: Sequelize.STRING(20),
          allowNull: true
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        priority: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
          comment: 'Contact priority order (1 = primary)'
        },
        canPickUp: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          comment: 'Authorized to pick up student'
        },
        canMakeDecisions: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: 'Authorized to make medical decisions'
        },
        isPrimary: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
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
        }
      }, { transaction });

      // =====================================================
      // STEP 7: Create Indexes
      // =====================================================

      // Medications indexes
      await queryInterface.addIndex('medications', ['name'], {
        name: 'medications_name_idx',
        transaction
      });

      await queryInterface.addIndex('medications', ['category'], {
        name: 'medications_category_idx',
        transaction
      });

      await queryInterface.addIndex('medications', ['isActive'], {
        name: 'medications_isActive_idx',
        transaction
      });

      // Student Medications indexes
      await queryInterface.addIndex('student_medications', ['studentId'], {
        name: 'student_medications_student_idx',
        transaction
      });

      await queryInterface.addIndex('student_medications', ['medicationId'], {
        name: 'student_medications_medication_idx',
        transaction
      });

      await queryInterface.addIndex('student_medications', ['isActive'], {
        name: 'student_medications_isActive_idx',
        transaction
      });

      // Medication Logs indexes
      await queryInterface.addIndex('medication_logs', ['studentMedicationId', 'timeGiven'], {
        name: 'medication_logs_student_med_time_idx',
        transaction
      });

      await queryInterface.addIndex('medication_logs', ['nurseId'], {
        name: 'medication_logs_nurse_idx',
        transaction
      });

      // Incident Reports indexes
      await queryInterface.addIndex('incident_reports', ['studentId'], {
        name: 'incident_reports_student_idx',
        transaction
      });

      await queryInterface.addIndex('incident_reports', ['type'], {
        name: 'incident_reports_type_idx',
        transaction
      });

      await queryInterface.addIndex('incident_reports', ['severity'], {
        name: 'incident_reports_severity_idx',
        transaction
      });

      await queryInterface.addIndex('incident_reports', ['occurredAt'], {
        name: 'incident_reports_occurred_idx',
        transaction
      });

      // Emergency Contacts indexes
      await queryInterface.addIndex('emergency_contacts', ['studentId'], {
        name: 'emergency_contacts_student_idx',
        transaction
      });

      await queryInterface.addIndex('emergency_contacts', ['priority'], {
        name: 'emergency_contacts_priority_idx',
        transaction
      });

      await queryInterface.addIndex('emergency_contacts', ['isActive'], {
        name: 'emergency_contacts_isActive_idx',
        transaction
      });

      await transaction.commit();
      console.log('✓ Additional critical tables migration completed successfully');

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
      await queryInterface.dropTable('emergency_contacts', { transaction });
      await queryInterface.dropTable('incident_reports', { transaction });
      await queryInterface.dropTable('medication_logs', { transaction });
      await queryInterface.dropTable('student_medications', { transaction });
      await queryInterface.dropTable('medications', { transaction });

      // Drop enums
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "IncidentType" CASCADE;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "IncidentSeverity" CASCADE;', { transaction });

      await transaction.commit();
      console.log('✓ Additional critical tables rollback completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Rollback failed:', error);
      throw error;
    }
  }
};
