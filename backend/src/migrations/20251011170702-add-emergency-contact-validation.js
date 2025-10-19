/**
 * LOC: 1E6F850C3D
 * WC-GEN-029 | 20251011170702-add-emergency-contact-validation.js - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-029 | 20251011170702-add-emergency-contact-validation.js - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .js
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Migration: Add Emergency Contact Validation Constraints
 *
 * Adds database-level validation constraints to emergency_contacts table:
 * - Length constraints on name fields (100 chars)
 * - Length constraints on relationship (50 chars)
 * - Length constraints on phone number (20 chars)
 * - Length constraints on email (255 chars)
 * - Length constraints on address (500 chars via TEXT check)
 * - CHECK constraints for data integrity
 * - ContactPriority enum values
 * - Additional indexes for optimized queries
 *
 * These constraints ensure emergency contact data integrity
 * which is critical for student safety and emergency response.
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Modify column types to add length constraints
      await queryInterface.changeColumn('emergency_contacts', 'firstName', {
        type: Sequelize.STRING(100),
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('emergency_contacts', 'lastName', {
        type: Sequelize.STRING(100),
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('emergency_contacts', 'relationship', {
        type: Sequelize.STRING(50),
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('emergency_contacts', 'phoneNumber', {
        type: Sequelize.STRING(20),
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('emergency_contacts', 'email', {
        type: Sequelize.STRING(255),
        allowNull: true,
      }, { transaction });

      await queryInterface.changeColumn('emergency_contacts', 'studentId', {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'students',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }, { transaction });

      // Add CHECK constraint for firstName length (minimum 1 character)
      await queryInterface.sequelize.query(
        `ALTER TABLE emergency_contacts ADD CONSTRAINT emergency_contacts_first_name_length
         CHECK (LENGTH("firstName") >= 1 AND LENGTH("firstName") <= 100)`,
        { transaction }
      );

      // Add CHECK constraint for lastName length (minimum 1 character)
      await queryInterface.sequelize.query(
        `ALTER TABLE emergency_contacts ADD CONSTRAINT emergency_contacts_last_name_length
         CHECK (LENGTH("lastName") >= 1 AND LENGTH("lastName") <= 100)`,
        { transaction }
      );

      // Add CHECK constraint for relationship length (minimum 1 character)
      await queryInterface.sequelize.query(
        `ALTER TABLE emergency_contacts ADD CONSTRAINT emergency_contacts_relationship_length
         CHECK (LENGTH("relationship") >= 1 AND LENGTH("relationship") <= 50)`,
        { transaction }
      );

      // Add CHECK constraint for address length (maximum 500 characters)
      await queryInterface.sequelize.query(
        `ALTER TABLE emergency_contacts ADD CONSTRAINT emergency_contacts_address_length
         CHECK (address IS NULL OR LENGTH(address) <= 500)`,
        { transaction }
      );

      // Add CHECK constraint for email format (basic validation)
      await queryInterface.sequelize.query(
        `ALTER TABLE emergency_contacts ADD CONSTRAINT emergency_contacts_email_format
         CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$')`,
        { transaction }
      );

      // Add CHECK constraint for phone number format (US phone numbers)
      await queryInterface.sequelize.query(
        `ALTER TABLE emergency_contacts ADD CONSTRAINT emergency_contacts_phone_format
         CHECK ("phoneNumber" ~ '^(\\+?1[-\\.\\s]?)?(\\(?\\d{3}\\)?[-\\.\\s]?)?\\d{3}[-\\.\\s]?\\d{4}$')`,
        { transaction }
      );

      // Add composite index for student + priority queries
      await queryInterface.addIndex('emergency_contacts', ['studentId', 'priority'], {
        name: 'emergency_contacts_student_priority_idx',
        transaction,
      });

      // Add composite index for student + isActive queries
      await queryInterface.addIndex('emergency_contacts', ['studentId', 'isActive'], {
        name: 'emergency_contacts_student_active_idx',
        transaction,
      });

      await transaction.commit();
      console.log('✓ Emergency contact validation constraints added successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to add emergency contact validation constraints:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove composite indexes
      await queryInterface.removeIndex('emergency_contacts', 'emergency_contacts_student_active_idx', { transaction });
      await queryInterface.removeIndex('emergency_contacts', 'emergency_contacts_student_priority_idx', { transaction });

      // Remove CHECK constraints
      await queryInterface.sequelize.query(
        `ALTER TABLE emergency_contacts DROP CONSTRAINT IF EXISTS emergency_contacts_phone_format`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE emergency_contacts DROP CONSTRAINT IF EXISTS emergency_contacts_email_format`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE emergency_contacts DROP CONSTRAINT IF EXISTS emergency_contacts_address_length`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE emergency_contacts DROP CONSTRAINT IF EXISTS emergency_contacts_relationship_length`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE emergency_contacts DROP CONSTRAINT IF EXISTS emergency_contacts_last_name_length`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE emergency_contacts DROP CONSTRAINT IF EXISTS emergency_contacts_first_name_length`,
        { transaction }
      );

      // Revert column types to generic strings
      await queryInterface.changeColumn('emergency_contacts', 'studentId', {
        type: Sequelize.STRING,
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('emergency_contacts', 'email', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction });

      await queryInterface.changeColumn('emergency_contacts', 'phoneNumber', {
        type: Sequelize.STRING,
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('emergency_contacts', 'relationship', {
        type: Sequelize.STRING,
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('emergency_contacts', 'lastName', {
        type: Sequelize.STRING,
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('emergency_contacts', 'firstName', {
        type: Sequelize.STRING,
        allowNull: false,
      }, { transaction });

      await transaction.commit();
      console.log('✓ Emergency contact validation constraints removed');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to remove emergency contact validation constraints:', error);
      throw error;
    }
  }
};
