'use strict';

/**
 * Convert abnormalFlags from JSON to JSONB in vital_signs table
 *
 * JSONB provides better query performance and indexing capabilities compared
 * to JSON type. This is especially important for array fields like abnormalFlags
 * that may be queried frequently for alert systems and reporting.
 *
 * Migration: Architecture Review Fix - Priority 2 High
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('[MIGRATION] Converting abnormalFlags from JSON to JSONB in vital_signs table...');

    const tableDescription = await queryInterface.describeTable('vital_signs');

    if (tableDescription.abnormalFlags) {
      // PostgreSQL allows this conversion directly
      await queryInterface.changeColumn('vital_signs', 'abnormalFlags', {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Array of abnormal vital sign flags - stored as JSONB for better query performance'
      });

      console.log('[MIGRATION] Successfully converted abnormalFlags to JSONB in vital_signs table');

      // Add GIN index for efficient JSONB queries
      try {
        await queryInterface.addIndex('vital_signs', ['abnormalFlags'], {
          name: 'idx_vital_signs_abnormal_flags_gin',
          using: 'GIN'
        });
        console.log('[MIGRATION] Added GIN index on vital_signs.abnormalFlags');
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('[MIGRATION] Index idx_vital_signs_abnormal_flags_gin already exists');
        } else {
          throw error;
        }
      }
    } else {
      console.log('[MIGRATION] abnormalFlags column does not exist in vital_signs table');
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('[MIGRATION] Rolling back: converting abnormalFlags from JSONB to JSON in vital_signs table...');

    // Remove GIN index first
    try {
      await queryInterface.removeIndex('vital_signs', 'idx_vital_signs_abnormal_flags_gin');
      console.log('[MIGRATION] Removed GIN index idx_vital_signs_abnormal_flags_gin');
    } catch (error) {
      console.log('[MIGRATION] Index idx_vital_signs_abnormal_flags_gin does not exist or already removed');
    }

    const tableDescription = await queryInterface.describeTable('vital_signs');

    if (tableDescription.abnormalFlags) {
      // Convert back to JSON
      await queryInterface.changeColumn('vital_signs', 'abnormalFlags', {
        type: Sequelize.JSON,
        allowNull: true
      });

      console.log('[MIGRATION] Successfully converted abnormalFlags back to JSON in vital_signs table');
    } else {
      console.log('[MIGRATION] abnormalFlags column does not exist in vital_signs table');
    }
  }
};
