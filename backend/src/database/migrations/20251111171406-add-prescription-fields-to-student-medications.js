'use strict';

/**
 * Add prescription fields to student_medications table
 * Adds prescriptionNumber and refillsRemaining columns that are defined in the model
 * but missing from the database schema.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Add prescriptionNumber column
      await queryInterface.addColumn('student_medications', 'prescriptionNumber', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Prescription number from the prescribing physician'
      }, { transaction });

      // Add refillsRemaining column
      await queryInterface.addColumn('student_medications', 'refillsRemaining', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Number of refills remaining on the prescription'
      }, { transaction });

      await transaction.commit();
      console.log('✓ Added prescription fields to student_medications table');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to add prescription fields:', error);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove the added columns
      await queryInterface.removeColumn('student_medications', 'prescriptionNumber', { transaction });
      await queryInterface.removeColumn('student_medications', 'refillsRemaining', { transaction });

      await transaction.commit();
      console.log('✓ Removed prescription fields from student_medications table');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to remove prescription fields:', error);
      throw error;
    }
  }
};
