'use strict';

/**
 * Fix Allergies Active Column Migration
 *
 * This migration fixes the schema mismatch in the allergies table:
 * - Renames 'isActive' column to 'active' to match the model definition
 * - Updates the corresponding index to match the model's expectation
 * - Ensures consistency between database schema and Sequelize model
 *
 * ISSUE: The model defines 'active' column but the database has 'isActive'
 * This was causing "column active does not exist" errors during index creation
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Fixing allergies table schema mismatch...');

      // Step 1: Check if allergies table exists
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('allergies')) {
        console.log('Allergies table does not exist, skipping migration');
        await transaction.commit();
        return;
      }

      // Step 2: Check if isActive column exists and active column doesn't
      const allergyColumns = await queryInterface.describeTable('allergies');
      
      if (allergyColumns.isActive && !allergyColumns.active) {
        console.log('Renaming isActive column to active...');
        
        // Drop the existing isActive index before renaming
        try {
          await queryInterface.removeIndex('allergies', 'allergies_isActive_idx', { transaction });
          console.log('✓ Removed old allergies_isActive_idx index');
        } catch (error) {
          console.log('Index allergies_isActive_idx may not exist, continuing...');
        }

        // Rename the column
        await queryInterface.renameColumn('allergies', 'isActive', 'active', { transaction });
        console.log('✓ Renamed isActive column to active');

        // Create the new index that the model expects
        await queryInterface.addIndex('allergies', ['studentId', 'active'], {
          name: 'allergies_student_id_active',
          transaction
        });
        console.log('✓ Created new index allergies_student_id_active');

      } else if (allergyColumns.active) {
        console.log('Active column already exists, checking indexes...');
        
        // Ensure the correct index exists
        try {
          await queryInterface.addIndex('allergies', ['studentId', 'active'], {
            name: 'allergies_student_id_active',
            transaction
          });
          console.log('✓ Created allergies_student_id_active index');
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log('Index allergies_student_id_active already exists');
          } else {
            throw error;
          }
        }
      } else {
        console.log('Neither isActive nor active column found, something is wrong');
        throw new Error('Expected isActive or active column not found in allergies table');
      }

      // Step 3: Verify the schema is now correct
      const updatedColumns = await queryInterface.describeTable('allergies');
      if (!updatedColumns.active) {
        throw new Error('Active column was not created successfully');
      }

      await transaction.commit();
      console.log('✓ Allergies schema fix completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Reverting allergies schema fix...');

      const allergyColumns = await queryInterface.describeTable('allergies');
      
      if (allergyColumns.active && !allergyColumns.isActive) {
        // Drop the current index
        try {
          await queryInterface.removeIndex('allergies', 'allergies_student_id_active', { transaction });
          console.log('✓ Removed allergies_student_id_active index');
        } catch (error) {
          console.log('Index may not exist, continuing...');
        }

        // Rename back to isActive
        await queryInterface.renameColumn('allergies', 'active', 'isActive', { transaction });
        console.log('✓ Renamed active column back to isActive');

        // Recreate the original index
        await queryInterface.addIndex('allergies', ['isActive'], {
          name: 'allergies_isActive_idx',
          transaction
        });
        console.log('✓ Recreated allergies_isActive_idx index');
      }

      await transaction.commit();
      console.log('✓ Allergies schema revert completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Rollback failed:', error);
      throw error;
    }
  }
};
