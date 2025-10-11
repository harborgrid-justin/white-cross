/**
 * Migration: Add Document Validation Constraints
 *
 * Adds database-level validation constraints to documents table:
 * - Length constraints on title (3-255 chars)
 * - Length constraints on description (0-5000 chars)
 * - Length constraints on fileType (100 chars)
 * - Length constraints on fileName (255 chars)
 * - Length constraints on fileUrl (500 chars)
 * - CHECK constraints for file size (min 1KB, max 50MB)
 * - CHECK constraints for version number (1-100)
 * - Additional indexes for optimized queries
 *
 * These constraints ensure document data integrity and security
 * which is critical for HIPAA compliance and document management.
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Modify column types to add length constraints
      await queryInterface.changeColumn('documents', 'title', {
        type: Sequelize.STRING(255),
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('documents', 'fileType', {
        type: Sequelize.STRING(100),
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('documents', 'fileName', {
        type: Sequelize.STRING(255),
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('documents', 'fileUrl', {
        type: Sequelize.STRING(500),
        allowNull: false,
      }, { transaction });

      // Add CHECK constraint for title length (minimum 3 characters)
      await queryInterface.sequelize.query(
        `ALTER TABLE documents ADD CONSTRAINT documents_title_length
         CHECK (LENGTH(title) >= 3 AND LENGTH(title) <= 255)`,
        { transaction }
      );

      // Add CHECK constraint for description length (maximum 5000 characters)
      await queryInterface.sequelize.query(
        `ALTER TABLE documents ADD CONSTRAINT documents_description_length
         CHECK (description IS NULL OR LENGTH(description) <= 5000)`,
        { transaction }
      );

      // Add CHECK constraint for file size (minimum 1KB, maximum 50MB)
      await queryInterface.sequelize.query(
        `ALTER TABLE documents ADD CONSTRAINT documents_file_size_range
         CHECK ("fileSize" >= 1024 AND "fileSize" <= 52428800)`,
        { transaction }
      );

      // Add CHECK constraint for version number (1-100)
      await queryInterface.sequelize.query(
        `ALTER TABLE documents ADD CONSTRAINT documents_version_range
         CHECK (version >= 1 AND version <= 100)`,
        { transaction }
      );

      // Add CHECK constraint for retention date (must be in future if set)
      await queryInterface.sequelize.query(
        `ALTER TABLE documents ADD CONSTRAINT documents_retention_date_future
         CHECK ("retentionDate" IS NULL OR "retentionDate" >= CURRENT_DATE)`,
        { transaction }
      );

      // Add CHECK constraint for file name format (alphanumeric, dots, hyphens, underscores, spaces only)
      await queryInterface.sequelize.query(
        `ALTER TABLE documents ADD CONSTRAINT documents_filename_format
         CHECK ("fileName" ~ '^[a-zA-Z0-9._\\-\\s]+$')`,
        { transaction }
      );

      // Add CHECK constraint for title to prevent malicious content
      await queryInterface.sequelize.query(
        `ALTER TABLE documents ADD CONSTRAINT documents_title_no_script
         CHECK (title !~* '<script|<iframe|javascript:')`,
        { transaction }
      );

      // Add CHECK constraint for description to prevent malicious content
      await queryInterface.sequelize.query(
        `ALTER TABLE documents ADD CONSTRAINT documents_description_no_script
         CHECK (description IS NULL OR description !~* '<script|<iframe|javascript:')`,
        { transaction }
      );

      // Add composite indexes for common query patterns
      await queryInterface.addIndex('documents', ['category', 'status', 'isActive'], {
        name: 'documents_category_status_active_idx',
        transaction,
      });

      await queryInterface.addIndex('documents', ['studentId', 'category'], {
        name: 'documents_student_category_idx',
        transaction,
      });

      await queryInterface.addIndex('documents', ['uploadedBy', 'createdAt'], {
        name: 'documents_uploaded_by_created_idx',
        transaction,
      });

      await queryInterface.addIndex('documents', ['status', 'retentionDate'], {
        name: 'documents_status_retention_idx',
        transaction,
      });

      // Add index for version control queries
      await queryInterface.addIndex('documents', ['parentId', 'version'], {
        name: 'documents_parent_version_idx',
        transaction,
      });

      await transaction.commit();
      console.log('✓ Document validation constraints added successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to add document validation constraints:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove indexes
      await queryInterface.removeIndex('documents', 'documents_parent_version_idx', { transaction });
      await queryInterface.removeIndex('documents', 'documents_status_retention_idx', { transaction });
      await queryInterface.removeIndex('documents', 'documents_uploaded_by_created_idx', { transaction });
      await queryInterface.removeIndex('documents', 'documents_student_category_idx', { transaction });
      await queryInterface.removeIndex('documents', 'documents_category_status_active_idx', { transaction });

      // Remove CHECK constraints
      await queryInterface.sequelize.query(
        `ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_description_no_script`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_title_no_script`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_filename_format`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_retention_date_future`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_version_range`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_file_size_range`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_description_length`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE documents DROP CONSTRAINT IF EXISTS documents_title_length`,
        { transaction }
      );

      // Revert column types to generic strings
      await queryInterface.changeColumn('documents', 'fileUrl', {
        type: Sequelize.STRING,
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('documents', 'fileName', {
        type: Sequelize.STRING,
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('documents', 'fileType', {
        type: Sequelize.STRING,
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('documents', 'title', {
        type: Sequelize.STRING,
        allowNull: false,
      }, { transaction });

      await transaction.commit();
      console.log('✓ Document validation constraints removed');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to remove document validation constraints:', error);
      throw error;
    }
  }
};
