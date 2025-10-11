'use strict';

/**
 * Add VIEWER and COUNSELOR roles to UserRole enum
 *
 * This migration adds two new user roles to support expanded access control:
 * - VIEWER: Read-only access to health records
 * - COUNSELOR: Access to student mental health and counseling records
 *
 * Corresponds to Prisma migration: 20251003162519_add_viewer_counselor_roles
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Add VIEWER and COUNSELOR values to UserRole enum
      // PostgreSQL doesn't support ALTER TYPE in a single statement for multiple values
      await queryInterface.sequelize.query(`
        ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'VIEWER';
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'COUNSELOR';
      `, { transaction });

      await transaction.commit();
      console.log('✓ Added VIEWER and COUNSELOR roles to UserRole enum');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // PostgreSQL doesn't support removing enum values
    // This is a one-way migration for safety
    // To rollback, you would need to:
    // 1. Ensure no users have VIEWER or COUNSELOR roles
    // 2. Drop and recreate the enum type
    // 3. Re-add all other values
    console.log('⚠ Cannot automatically rollback enum value additions in PostgreSQL');
    console.log('⚠ Manual intervention required if rollback is necessary');
  }
};
