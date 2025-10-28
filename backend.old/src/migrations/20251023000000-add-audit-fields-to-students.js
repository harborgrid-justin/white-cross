'use strict';

/**
 * Migration: Add audit fields (createdBy, updatedBy) to students table
 * Purpose: Add HIPAA-compliant audit trail fields for tracking user who created/modified records
 *
 * Background:
 * - Student model uses AuditableModel which provides createdBy/updatedBy fields
 * - These fields were defined in the model but never added to the database schema
 * - This caused "column students.createdBy does not exist" errors
 *
 * Impact:
 * - Enables proper audit tracking for HIPAA compliance
 * - Allows User-Student associations for audit trail
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Adding audit fields to students table...');

    // Add createdBy column
    await queryInterface.addColumn('students', 'createdBy', {
      type: Sequelize.STRING(36),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'User who created this student record (HIPAA audit trail)',
    });

    // Add updatedBy column
    await queryInterface.addColumn('students', 'updatedBy', {
      type: Sequelize.STRING(36),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'User who last updated this student record (HIPAA audit trail)',
    });

    // Add indexes for audit fields (for querying which records a user created/modified)
    await queryInterface.addIndex('students', ['createdBy'], {
      name: 'students_created_by_idx',
    });

    await queryInterface.addIndex('students', ['updatedBy'], {
      name: 'students_updated_by_idx',
    });

    console.log('✅ Audit fields added to students table successfully');
  },

  async down(queryInterface, Sequelize) {
    console.log('Removing audit fields from students table...');

    // Remove indexes
    await queryInterface.removeIndex('students', 'students_updated_by_idx');
    await queryInterface.removeIndex('students', 'students_created_by_idx');

    // Remove columns
    await queryInterface.removeColumn('students', 'updatedBy');
    await queryInterface.removeColumn('students', 'createdBy');

    console.log('✅ Audit fields removed from students table');
  },
};
