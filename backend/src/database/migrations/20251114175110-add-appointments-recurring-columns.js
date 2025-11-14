'use strict';

/**
 * Migration: Add Recurring Columns to Appointments
 *
 * Adds recurring appointment columns that are expected by the Appointment model:
 * - recurringGroupId: Group ID for recurring appointments
 * - recurringFrequency: Frequency (DAILY, WEEKLY, MONTHLY, YEARLY)
 * - recurringEndDate: End date for recurring appointments
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Adding recurring columns to appointments table...');

      await queryInterface.addColumn('appointments', 'recurringGroupId', {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'Group ID for recurring appointments',
      }, { transaction });

      await queryInterface.addColumn('appointments', 'recurringFrequency', {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Frequency: DAILY, WEEKLY, MONTHLY, YEARLY',
      }, { transaction });

      await queryInterface.addColumn('appointments', 'recurringEndDate', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'End date for recurring appointments',
      }, { transaction });

      await transaction.commit();
      console.log('✓ Successfully added recurring columns to appointments');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to add recurring columns to appointments:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Removing recurring columns from appointments table...');

      await queryInterface.removeColumn('appointments', 'recurringEndDate', { transaction });
      await queryInterface.removeColumn('appointments', 'recurringFrequency', { transaction });
      await queryInterface.removeColumn('appointments', 'recurringGroupId', { transaction });

      await transaction.commit();
      console.log('✓ Successfully removed recurring columns from appointments');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to remove recurring columns from appointments:', error);
      throw error;
    }
  }
};
