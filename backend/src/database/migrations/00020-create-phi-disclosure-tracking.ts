import { QueryInterface, DataTypes } from 'sequelize';

/**
 * Migration: PHI Disclosure Tracking Tables
 * Feature 30: HIPAA §164.528 Accounting of Disclosures
 *
 * Creates tables for tracking all PHI disclosures:
 * - phi_disclosures: Main disclosure records
 * - phi_disclosure_recipients: Recipient details
 * - phi_disclosure_audit: Immutable audit trail
 */

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Create ENUM types for disclosure tracking
      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE disclosure_type AS ENUM (
            'TREATMENT',
            'PAYMENT',
            'HEALTHCARE_OPERATIONS',
            'PUBLIC_HEALTH',
            'LEGAL_REQUIREMENT',
            'PARENTAL_REQUEST',
            'STUDENT_REQUEST',
            'RESEARCH',
            'EMERGENCY',
            'OTHER'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE disclosure_purpose AS ENUM (
            'TREATMENT_COORDINATION',
            'BILLING_CLAIMS',
            'QUALITY_IMPROVEMENT',
            'PUBLIC_HEALTH_REPORTING',
            'COURT_ORDER',
            'SUBPOENA',
            'PARENTAL_ACCESS',
            'STUDENT_ACCESS',
            'RESEARCH_STUDY',
            'MEDICAL_EMERGENCY',
            'STATE_REGISTRY',
            'MEDICAID_BILLING',
            'OTHER'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE disclosure_method AS ENUM (
            'EMAIL',
            'FAX',
            'MAIL',
            'IN_PERSON',
            'PHONE',
            'SECURE_MESSAGE',
            'PORTAL',
            'EHR_INTEGRATION',
            'OTHER'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE recipient_type AS ENUM (
            'PARENT_GUARDIAN',
            'HEALTHCARE_PROVIDER',
            'INSURANCE_COMPANY',
            'GOVERNMENT_AGENCY',
            'SCHOOL_OFFICIAL',
            'LEGAL_REPRESENTATIVE',
            'STUDENT',
            'RESEARCHER',
            'OTHER'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      // Create main PHI disclosures table
      await queryInterface.createTable('phi_disclosures', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        studentId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'students',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
          field: 'student_id',
        },
        disclosureType: {
          type: 'disclosure_type',
          allowNull: false,
          field: 'disclosure_type',
        },
        purpose: {
          type: 'disclosure_purpose',
          allowNull: false,
        },
        method: {
          type: 'disclosure_method',
          allowNull: false,
        },
        disclosureDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'disclosure_date',
        },
        informationDisclosed: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          comment: 'Array of PHI categories disclosed (e.g., DEMOGRAPHICS, HEALTH_HISTORY)',
          field: 'information_disclosed',
        },
        minimumNecessary: {
          type: DataTypes.TEXT,
          allowNull: false,
          comment: 'Justification for minimum necessary standard',
          field: 'minimum_necessary',
        },
        recipientType: {
          type: 'recipient_type',
          allowNull: false,
          field: 'recipient_type',
        },
        recipientName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'recipient_name',
        },
        recipientOrganization: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'recipient_organization',
        },
        recipientAddress: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'recipient_address',
        },
        recipientPhone: {
          type: DataTypes.STRING(20),
          allowNull: true,
          field: 'recipient_phone',
        },
        recipientEmail: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'recipient_email',
        },
        authorizationObtained: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'authorization_obtained',
        },
        authorizationDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'authorization_date',
        },
        authorizationExpiryDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'authorization_expiry_date',
        },
        patientRequested: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'patient_requested',
        },
        followUpRequired: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'follow_up_required',
        },
        followUpDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'follow_up_date',
        },
        followUpCompleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'follow_up_completed',
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        disclosedBy: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
          field: 'disclosed_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      }, { transaction });

      // Create indexes for performance
      await queryInterface.addIndex('phi_disclosures', ['student_id'], {
        name: 'idx_phi_disclosures_student',
        transaction,
      });

      await queryInterface.addIndex('phi_disclosures', ['disclosure_date'], {
        name: 'idx_phi_disclosures_date',
        transaction,
      });

      await queryInterface.addIndex('phi_disclosures', ['disclosure_type', 'purpose'], {
        name: 'idx_phi_disclosures_type_purpose',
        transaction,
      });

      await queryInterface.addIndex('phi_disclosures', ['disclosed_by'], {
        name: 'idx_phi_disclosures_user',
        transaction,
      });

      await queryInterface.addIndex('phi_disclosures', ['follow_up_required', 'follow_up_completed'], {
        name: 'idx_phi_disclosures_followup',
        where: { follow_up_required: true },
        transaction,
      });

      // Create audit trail table (immutable)
      await queryInterface.createTable('phi_disclosure_audit', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        disclosureId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'phi_disclosures',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
          field: 'disclosure_id',
        },
        action: {
          type: DataTypes.ENUM('CREATED', 'UPDATED', 'VIEWED', 'DELETED'),
          allowNull: false,
        },
        changes: {
          type: DataTypes.JSONB,
          allowNull: true,
          comment: 'JSON object of field changes (before/after)',
        },
        performedBy: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
          field: 'performed_by',
        },
        ipAddress: {
          type: DataTypes.INET,
          allowNull: true,
          field: 'ip_address',
        },
        userAgent: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'user_agent',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
      }, { transaction });

      // Index audit table
      await queryInterface.addIndex('phi_disclosure_audit', ['disclosure_id'], {
        name: 'idx_phi_audit_disclosure',
        transaction,
      });

      await queryInterface.addIndex('phi_disclosure_audit', ['performed_by'], {
        name: 'idx_phi_audit_user',
        transaction,
      });

      await queryInterface.addIndex('phi_disclosure_audit', ['created_at'], {
        name: 'idx_phi_audit_date',
        transaction,
      });

      // Create trigger to prevent modification/deletion of audit records
      await queryInterface.sequelize.query(`
        CREATE OR REPLACE FUNCTION prevent_phi_audit_modification()
        RETURNS TRIGGER AS $$
        BEGIN
          RAISE EXCEPTION 'PHI disclosure audit records are immutable and cannot be modified or deleted';
          RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;

        DROP TRIGGER IF EXISTS trg_prevent_phi_audit_update ON phi_disclosure_audit;
        CREATE TRIGGER trg_prevent_phi_audit_update
          BEFORE UPDATE OR DELETE ON phi_disclosure_audit
          FOR EACH ROW
          EXECUTE FUNCTION prevent_phi_audit_modification();
      `, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop triggers
      await queryInterface.sequelize.query(`
        DROP TRIGGER IF EXISTS trg_prevent_phi_audit_update ON phi_disclosure_audit;
        DROP FUNCTION IF EXISTS prevent_phi_audit_modification();
      `, { transaction });

      // Drop tables
      await queryInterface.dropTable('phi_disclosure_audit', { transaction });
      await queryInterface.dropTable('phi_disclosures', { transaction });

      // Drop ENUM types
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS recipient_type;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS disclosure_method;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS disclosure_purpose;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS disclosure_type;', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
