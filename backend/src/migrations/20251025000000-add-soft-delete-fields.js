/**
 * Migration: Add Soft Delete Fields to Multiple Tables
 *
 * Purpose: Implement consistent soft delete pattern across backend models
 * Pattern: isActive (boolean), deletedAt (timestamp), deletedBy (uuid FK to users)
 *
 * Tables Modified:
 * - medications: Add isActive, deletedAt, deletedBy
 * - documents: Add isActive, deletedAt, deletedBy
 * - health_records: Add isActive, deletedAt, deletedBy
 * - emergency_contacts: Add isActive, deletedAt, deletedBy (if exists)
 * - allergies: Add isActive, deletedAt, deletedBy (if exists)
 * - vaccinations: Add isActive, deletedAt, deletedBy (if exists)
 * - inventory_items: Add isActive, deletedAt, deletedBy (if exists)
 *
 * Note: This migration is idempotent - it checks if columns exist before adding them
 *
 * Agent: database-architect
 * Task ID: SD7K9M
 * Date: 2025-10-25
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Helper function to check if column exists
      const columnExists = async (tableName, columnName) => {
        const tableDescription = await queryInterface.describeTable(tableName);
        return tableDescription[columnName] !== undefined;
      };

      // Helper function to add soft delete columns to a table
      const addSoftDeleteColumns = async (tableName) => {
        console.log(`Adding soft delete columns to ${tableName}...`);

        // Add isActive column if it doesn't exist
        if (!(await columnExists(tableName, 'isActive'))) {
          await queryInterface.addColumn(
            tableName,
            'isActive',
            {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: true,
              comment: 'Soft delete flag - whether record is currently active'
            },
            { transaction }
          );
          console.log(`  ✓ Added isActive to ${tableName}`);
        } else {
          console.log(`  - isActive already exists in ${tableName}`);
        }

        // Add deletedAt column if it doesn't exist
        if (!(await columnExists(tableName, 'deletedAt'))) {
          await queryInterface.addColumn(
            tableName,
            'deletedAt',
            {
              type: Sequelize.DATE,
              allowNull: true,
              comment: 'Soft delete timestamp - when record was deactivated'
            },
            { transaction }
          );
          console.log(`  ✓ Added deletedAt to ${tableName}`);
        } else {
          console.log(`  - deletedAt already exists in ${tableName}`);
        }

        // Add deletedBy column if it doesn't exist
        if (!(await columnExists(tableName, 'deletedBy'))) {
          await queryInterface.addColumn(
            tableName,
            'deletedBy',
            {
              type: Sequelize.STRING,
              allowNull: true,
              references: {
                model: 'users',
                key: 'id'
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
              comment: 'User who deactivated this record (for audit trail)'
            },
            { transaction }
          );
          console.log(`  ✓ Added deletedBy to ${tableName}`);
        } else {
          console.log(`  - deletedBy already exists in ${tableName}`);
        }
      };

      // Helper function to add indexes
      const addSoftDeleteIndexes = async (tableName) => {
        console.log(`Adding soft delete indexes to ${tableName}...`);

        // Index on isActive for filtering queries
        await queryInterface.addIndex(
          tableName,
          ['isActive'],
          {
            name: `${tableName}_is_active_idx`,
            transaction
          }
        ).catch(() => {
          console.log(`  - Index ${tableName}_is_active_idx already exists`);
        });

        // Index on deletedAt for audit queries
        await queryInterface.addIndex(
          tableName,
          ['deletedAt'],
          {
            name: `${tableName}_deleted_at_idx`,
            transaction
          }
        ).catch(() => {
          console.log(`  - Index ${tableName}_deleted_at_idx already exists`);
        });

        // Index on deletedBy for audit queries
        await queryInterface.addIndex(
          tableName,
          ['deletedBy'],
          {
            name: `${tableName}_deleted_by_idx`,
            transaction
          }
        ).catch(() => {
          console.log(`  - Index ${tableName}_deleted_by_idx already exists`);
        });

        console.log(`  ✓ Indexes added to ${tableName}`);
      };

      // Tables to update (Priority 1: Critical PHI tables)
      const criticalTables = [
        'medications',
        'documents',
        'health_records'
      ];

      // Tables to update (Priority 2: Supporting tables - add if they exist)
      const supportingTables = [
        'emergency_contacts',
        'allergies',
        'vaccinations',
        'inventory_items'
      ];

      // Update critical tables
      for (const tableName of criticalTables) {
        await addSoftDeleteColumns(tableName);
        await addSoftDeleteIndexes(tableName);
      }

      // Update supporting tables if they exist
      for (const tableName of supportingTables) {
        try {
          await queryInterface.describeTable(tableName);
          await addSoftDeleteColumns(tableName);
          await addSoftDeleteIndexes(tableName);
        } catch (error) {
          console.log(`  ⚠ Table ${tableName} does not exist, skipping`);
        }
      }

      // Ensure all existing records have isActive = true (for backward compatibility)
      console.log('\nSetting default values for existing records...');

      for (const tableName of [...criticalTables, ...supportingTables]) {
        try {
          await queryInterface.sequelize.query(
            `UPDATE ${tableName} SET "isActive" = true WHERE "isActive" IS NULL`,
            { transaction }
          );
          console.log(`  ✓ Set isActive = true for existing records in ${tableName}`);
        } catch (error) {
          // Table might not exist, skip
          console.log(`  - Skipped ${tableName} (table may not exist)`);
        }
      }

      await transaction.commit();
      console.log('\n✅ Soft delete migration completed successfully!');

    } catch (error) {
      await transaction.rollback();
      console.error('\n❌ Soft delete migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Rolling back soft delete migration...');

      const tables = [
        'medications',
        'documents',
        'health_records',
        'emergency_contacts',
        'allergies',
        'vaccinations',
        'inventory_items'
      ];

      for (const tableName of tables) {
        try {
          console.log(`Removing soft delete columns from ${tableName}...`);

          // Remove indexes first
          await queryInterface.removeIndex(tableName, `${tableName}_is_active_idx`, { transaction })
            .catch(() => {});
          await queryInterface.removeIndex(tableName, `${tableName}_deleted_at_idx`, { transaction })
            .catch(() => {});
          await queryInterface.removeIndex(tableName, `${tableName}_deleted_by_idx`, { transaction })
            .catch(() => {});

          // Remove columns
          await queryInterface.removeColumn(tableName, 'isActive', { transaction })
            .catch(() => {});
          await queryInterface.removeColumn(tableName, 'deletedAt', { transaction })
            .catch(() => {});
          await queryInterface.removeColumn(tableName, 'deletedBy', { transaction })
            .catch(() => {});

          console.log(`  ✓ Removed soft delete columns from ${tableName}`);
        } catch (error) {
          console.log(`  - Skipped ${tableName} (table may not exist or columns not added)`);
        }
      }

      await transaction.commit();
      console.log('\n✅ Soft delete migration rollback completed successfully!');

    } catch (error) {
      await transaction.rollback();
      console.error('\n❌ Soft delete migration rollback failed:', error);
      throw error;
    }
  }
};
