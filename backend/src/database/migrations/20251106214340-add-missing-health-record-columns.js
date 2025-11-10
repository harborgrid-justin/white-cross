'use strict';

/**
 * Add missing columns to health_records table
 * These columns were supposed to be added by the complete-health-records-schema migration
 * but appear to be missing from the actual database table.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Add missing columns to health_records table
      const missingColumns = [
        { name: 'provider', type: Sequelize.STRING(200) },
        { name: 'providerNpi', type: Sequelize.STRING(20) },
        { name: 'facility', type: Sequelize.STRING(200) },
        { name: 'facilityNpi', type: Sequelize.STRING(20) },
        { name: 'diagnosis', type: Sequelize.TEXT },
        { name: 'diagnosisCode', type: Sequelize.STRING(20) },
        { name: 'treatment', type: Sequelize.TEXT },
        { name: 'followUpRequired', type: Sequelize.BOOLEAN, defaultValue: false },
        { name: 'followUpDate', type: Sequelize.DATE },
        { name: 'followUpCompleted', type: Sequelize.BOOLEAN, defaultValue: false },
        { name: 'metadata', type: Sequelize.JSONB },
        { name: 'isConfidential', type: Sequelize.BOOLEAN, defaultValue: false },
        { name: 'createdBy', type: Sequelize.UUID },
        { name: 'updatedBy', type: Sequelize.UUID }
      ];

      for (const col of missingColumns) {
        // Check if column exists before adding
        const [results] = await queryInterface.sequelize.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'health_records' AND column_name = '${col.name}';
        `, { transaction });

        if (results.length === 0) {
          console.log(`Adding missing column: ${col.name}`);
          await queryInterface.addColumn('health_records', col.name, {
            type: col.type,
            allowNull: true,
            defaultValue: col.defaultValue || null
          }, { transaction });
        } else {
          console.log(`Column ${col.name} already exists, skipping`);
        }
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove the added columns
      const columnsToRemove = [
        'provider', 'providerNpi', 'facility', 'facilityNpi', 
        'diagnosis', 'diagnosisCode', 'treatment', 'followUpRequired', 
        'followUpDate', 'followUpCompleted', 'metadata', 'isConfidential', 
        'createdBy', 'updatedBy'
      ];

      for (const columnName of columnsToRemove) {
        try {
          await queryInterface.removeColumn('health_records', columnName, { transaction });
        } catch (error) {
          // Ignore errors if column doesn't exist
          console.log(`Column ${columnName} doesn't exist or couldn't be removed`);
        }
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
