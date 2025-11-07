'use strict';

/**
 * Remove redundant wasGiven column from medication_logs table
 *
 * The wasGiven boolean field is redundant because the status enum
 * (ADMINISTERED, MISSED, CANCELLED, REFUSED) already indicates whether
 * the medication was given or not. This improves data integrity by
 * eliminating duplicate state tracking.
 *
 * Migration: Architecture Review Fix - Priority 1 Critical
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('[MIGRATION] Removing wasGiven column from medication_logs table...');

    // Check if the column exists
    const tableDescription = await queryInterface.describeTable('medication_logs');

    if (tableDescription.wasGiven) {
      // Before removing, let's ensure data consistency
      // Set any null status values based on wasGiven
      await queryInterface.sequelize.query(`
        UPDATE medication_logs
        SET status = CASE
          WHEN "wasGiven" = true THEN 'ADMINISTERED'
          WHEN "wasGiven" = false AND status IS NULL THEN 'MISSED'
          ELSE status
        END
        WHERE status IS NULL OR status = ''
      `);

      console.log('[MIGRATION] Updated null status values based on wasGiven field');

      // Now remove the wasGiven column
      await queryInterface.removeColumn('medication_logs', 'wasGiven');
      console.log('[MIGRATION] Successfully removed wasGiven column from medication_logs table');
    } else {
      console.log('[MIGRATION] wasGiven column does not exist in medication_logs table');
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('[MIGRATION] Rolling back: adding wasGiven column to medication_logs table...');

    // Check if the column already exists
    const tableDescription = await queryInterface.describeTable('medication_logs');

    if (!tableDescription.wasGiven) {
      await queryInterface.addColumn('medication_logs', 'wasGiven', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Deprecated: use status enum instead'
      });

      // Populate wasGiven based on status for rollback compatibility
      await queryInterface.sequelize.query(`
        UPDATE medication_logs
        SET "wasGiven" = CASE
          WHEN status = 'ADMINISTERED' THEN true
          ELSE false
        END
      `);

      console.log('[MIGRATION] Successfully added wasGiven column back to medication_logs table');
    } else {
      console.log('[MIGRATION] wasGiven column already exists in medication_logs table');
    }
  }
};
