'use strict';

/**
 * Migration: Add Type Column to Appointments
 *
 * Adds the missing 'type' column to the appointments table that is expected by the Appointment model.
 * Sets default value to 'ROUTINE_CHECKUP' for existing records.
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Adding type column to appointments table...');

      await queryInterface.addColumn('appointments', 'type', {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'ROUTINE_CHECKUP',
        comment: 'Appointment type: ROUTINE_CHECKUP, MEDICATION_ADMINISTRATION, etc.',
      }, { transaction });

      // Add recurring appointment columns
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

      // Set default values for existing records
      await queryInterface.sequelize.query(`
        UPDATE appointments
        SET "type" = 'ROUTINE_CHECKUP'
        WHERE "type" IS NULL
      `, { transaction });

      // Make the type column NOT NULL after setting defaults
      await queryInterface.changeColumn('appointments', 'type', {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'ROUTINE_CHECKUP',
      }, { transaction });

      await transaction.commit();
      console.log('✓ Successfully added type column to appointments');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to add type column to appointments:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Removing added columns from appointments table...');

      await queryInterface.removeColumn('appointments', 'recurringEndDate', { transaction });
      await queryInterface.removeColumn('appointments', 'recurringFrequency', { transaction });
      await queryInterface.removeColumn('appointments', 'recurringGroupId', { transaction });
      await queryInterface.removeColumn('appointments', 'type', { transaction });

      await transaction.commit();
      console.log('✓ Successfully removed added columns from appointments');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to remove columns from appointments:', error);
      throw error;
    }
  }
};
