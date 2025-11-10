'use strict';

/**
 * Add deletedAt column to medications table for soft delete support
 * 
 * This migration adds the deletedAt column that is required for the 
 * Sequelize paranoid (soft delete) functionality configured in the model.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('[MIGRATION] Adding deletedAt column to medications table...');
    
    // Check if the column already exists
    const tableDescription = await queryInterface.describeTable('medications');
    
    if (!tableDescription.deletedAt) {
      await queryInterface.addColumn('medications', 'deletedAt', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp when the medication was soft deleted (paranoid delete)'
      });
      console.log('[MIGRATION] Successfully added deletedAt column to medications table');
    } else {
      console.log('[MIGRATION] deletedAt column already exists in medications table');
    }

    // Add index for performance on queries that filter by deletedAt
    try {
      await queryInterface.addIndex('medications', ['deletedAt'], {
        name: 'idx_medications_deleted_at'
      });
      console.log('[MIGRATION] Added index on medications.deletedAt');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('[MIGRATION] Index idx_medications_deleted_at already exists');
      } else {
        throw error;
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('[MIGRATION] Rolling back: removing deletedAt column from medications table...');
    
    // Remove the index first
    try {
      await queryInterface.removeIndex('medications', 'idx_medications_deleted_at');
      console.log('[MIGRATION] Removed index idx_medications_deleted_at');
    } catch (error) {
      console.log('[MIGRATION] Index idx_medications_deleted_at does not exist or already removed');
    }

    // Remove the column
    try {
      await queryInterface.removeColumn('medications', 'deletedAt');
      console.log('[MIGRATION] Successfully removed deletedAt column from medications table');
    } catch (error) {
      console.log('[MIGRATION] deletedAt column does not exist or already removed');
    }
  }
};