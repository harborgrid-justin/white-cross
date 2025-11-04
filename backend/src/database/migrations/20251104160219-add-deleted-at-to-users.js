'use strict';

/**
 * Migration: Add deletedAt column to users table
 * 
 * This migration adds the deletedAt column to support soft deletes (paranoid mode)
 * in the User model. The column is required when paranoid: true is set in Sequelize.
 * 
 * @module migrations/add-deleted-at-to-users
 * @category Database
 * @subcategory Migrations
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      comment: 'Soft delete timestamp for paranoid mode'
    });

    // Add index for better query performance when filtering out deleted records
    await queryInterface.addIndex('users', ['deletedAt'], {
      name: 'idx_users_deleted_at'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the index first
    await queryInterface.removeIndex('users', 'idx_users_deleted_at');
    
    // Remove the column
    await queryInterface.removeColumn('users', 'deletedAt');
  }
};
