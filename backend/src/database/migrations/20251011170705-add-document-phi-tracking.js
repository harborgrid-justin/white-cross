/**
 * Migration: Add Document PHI and Audit Tracking Fields
 *
 * Adds HIPAA compliance and audit tracking fields to documents table:
 * - containsPHI (BOOLEAN) - Flags documents with Protected Health Information
 * - requiresSignature (BOOLEAN) - Indicates signature requirement
 * - lastAccessedAt (DATE) - Last access timestamp for audit trail
 * - accessCount (INTEGER) - Number of times document was accessed
 *
 * These fields support HIPAA compliance requirements for PHI tracking,
 * access auditing, and electronic signature workflows.
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Add PHI flag
      await queryInterface.addColumn('documents', 'containsPHI', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indicates if document contains Protected Health Information (HIPAA)',
      }, { transaction });

      // Add signature requirement flag
      await queryInterface.addColumn('documents', 'requiresSignature', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Indicates if document requires electronic signature',
      }, { transaction });

      // Add last accessed timestamp
      await queryInterface.addColumn('documents', 'lastAccessedAt', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Last time document was viewed or downloaded (for audit)',
      }, { transaction });

      // Add access count
      await queryInterface.addColumn('documents', 'accessCount', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of times document has been accessed (for compliance)',
      }, { transaction });

      // Add CHECK constraint for access count (cannot be negative)
      await queryInterface.sequelize.query(
        `ALTER TABLE documents ADD CONSTRAINT documents_access_count_positive
         CHECK ("accessCount" >= 0)`,
        { transaction }
      );

      // Add CHECK constraint: PHI documents cannot have PUBLIC access
      await queryInterface.sequelize.query(
        `ALTER TABLE documents ADD CONSTRAINT documents_phi_access_restriction
         CHECK (NOT ("containsPHI" = true AND "accessLevel" = 'PUBLIC'))`,
        { transaction }
      );

      // Create indexes for audit and compliance queries
      await queryInterface.addIndex('documents', ['containsPHI'], {
        name: 'documents_contains_phi_idx',
        transaction,
      });

      await queryInterface.addIndex('documents', ['requiresSignature'], {
        name: 'documents_requires_signature_idx',
        transaction,
      });

      await queryInterface.addIndex('documents', ['lastAccessedAt'], {
        name: 'documents_last_accessed_idx',
        transaction,
      });

      // Composite index for PHI audit queries
      await queryInterface.addIndex('documents', ['containsPHI', 'lastAccessedAt'], {
        name: 'documents_phi_access_audit_idx',
        transaction,
      });

      // Composite index for signature workflow queries
      await queryInterface.addIndex('documents', ['requiresSignature', 'status'], {
        name: 'documents_signature_status_idx',
        transaction,
      });

      // Update existing records: Set containsPHI=true for medical/incident/consent/insurance categories
      await queryInterface.sequelize.query(
        `UPDATE documents
         SET "containsPHI" = true
         WHERE category IN ('MEDICAL_RECORD', 'INCIDENT_REPORT', 'CONSENT_FORM', 'INSURANCE')`,
        { transaction }
      );

      // Update existing records: Set requiresSignature=true for critical categories
      await queryInterface.sequelize.query(
        `UPDATE documents
         SET "requiresSignature" = true
         WHERE category IN ('MEDICAL_RECORD', 'CONSENT_FORM', 'INCIDENT_REPORT')`,
        { transaction }
      );

      // Ensure PHI documents don't have PUBLIC access (upgrade to STAFF_ONLY)
      await queryInterface.sequelize.query(
        `UPDATE documents
         SET "accessLevel" = 'STAFF_ONLY'
         WHERE "containsPHI" = true AND "accessLevel" = 'PUBLIC'`,
        { transaction }
      );

      await transaction.commit();
      console.log('✓ Document PHI and audit tracking fields added successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to add document PHI tracking fields:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove composite indexes
      await queryInterface.removeIndex('documents', 'documents_signature_status_idx', { transaction });
      await queryInterface.removeIndex('documents', 'documents_phi_access_audit_idx', { transaction });
      await queryInterface.removeIndex('documents', 'documents_last_accessed_idx', { transaction });
      await queryInterface.removeIndex('documents', 'documents_requires_signature_idx', { transaction });
      await queryInterface.removeIndex('documents', 'documents_contains_phi_idx', { transaction });

      // Remove CHECK constraints
      await queryInterface.sequelize.query(
        `ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_phi_access_restriction`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_access_count_positive`,
        { transaction }
      );

      // Remove columns
      await queryInterface.removeColumn('documents', 'accessCount', { transaction });
      await queryInterface.removeColumn('documents', 'lastAccessedAt', { transaction });
      await queryInterface.removeColumn('documents', 'requiresSignature', { transaction });
      await queryInterface.removeColumn('documents', 'containsPHI', { transaction });

      await transaction.commit();
      console.log('✓ Document PHI and audit tracking fields removed');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to remove document PHI tracking fields:', error);
      throw error;
    }
  }
};
