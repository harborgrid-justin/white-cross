'use strict';

/**
 * Enhance System Configuration
 *
 * This migration expands the system configuration capabilities:
 * - Creates new ConfigValueType and ConfigScope enums
 * - Adds additional values to ConfigCategory enum
 * - Enhances system_configurations table with advanced fields
 * - Creates configuration_history table for audit trail
 *
 * Corresponds to Prisma migration: 20251009013303_enhance_system_configuration
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // =====================================================
      // STEP 1: Create new enums
      // =====================================================

      await queryInterface.sequelize.query(`
        CREATE TYPE "ConfigValueType" AS ENUM (
          'STRING',
          'NUMBER',
          'BOOLEAN',
          'JSON',
          'ARRAY',
          'DATE',
          'TIME',
          'DATETIME',
          'EMAIL',
          'URL',
          'COLOR',
          'ENUM'
        );
      `, { transaction });

      await queryInterface.sequelize.query(`
        CREATE TYPE "ConfigScope" AS ENUM (
          'SYSTEM',
          'DISTRICT',
          'SCHOOL',
          'USER'
        );
      `, { transaction });

      // =====================================================
      // STEP 2: Add values to existing ConfigCategory enum
      // =====================================================

      await queryInterface.sequelize.query(`
        ALTER TYPE "ConfigCategory" ADD VALUE IF NOT EXISTS 'HEALTHCARE';
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TYPE "ConfigCategory" ADD VALUE IF NOT EXISTS 'MEDICATION';
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TYPE "ConfigCategory" ADD VALUE IF NOT EXISTS 'APPOINTMENTS';
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TYPE "ConfigCategory" ADD VALUE IF NOT EXISTS 'UI';
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TYPE "ConfigCategory" ADD VALUE IF NOT EXISTS 'QUERY';
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TYPE "ConfigCategory" ADD VALUE IF NOT EXISTS 'FILE_UPLOAD';
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TYPE "ConfigCategory" ADD VALUE IF NOT EXISTS 'RATE_LIMITING';
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TYPE "ConfigCategory" ADD VALUE IF NOT EXISTS 'SESSION';
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TYPE "ConfigCategory" ADD VALUE IF NOT EXISTS 'EMAIL';
      `, { transaction });

      await queryInterface.sequelize.query(`
        ALTER TYPE "ConfigCategory" ADD VALUE IF NOT EXISTS 'SMS';
      `, { transaction });

      // =====================================================
      // STEP 3: Enhance system_configurations table
      // =====================================================

      await queryInterface.addColumn('system_configurations', 'valueType', {
        type: Sequelize.ENUM(
          'STRING', 'NUMBER', 'BOOLEAN', 'JSON', 'ARRAY',
          'DATE', 'TIME', 'DATETIME', 'EMAIL', 'URL', 'COLOR', 'ENUM'
        ),
        allowNull: false,
        defaultValue: 'STRING'
      }, { transaction });

      await queryInterface.addColumn('system_configurations', 'subCategory', {
        type: Sequelize.TEXT,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('system_configurations', 'defaultValue', {
        type: Sequelize.TEXT,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('system_configurations', 'validValues', {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true,
        defaultValue: []
      }, { transaction });

      await queryInterface.addColumn('system_configurations', 'minValue', {
        type: Sequelize.DOUBLE,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('system_configurations', 'maxValue', {
        type: Sequelize.DOUBLE,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('system_configurations', 'isEditable', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }, { transaction });

      await queryInterface.addColumn('system_configurations', 'requiresRestart', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }, { transaction });

      await queryInterface.addColumn('system_configurations', 'scope', {
        type: Sequelize.ENUM('SYSTEM', 'DISTRICT', 'SCHOOL', 'USER'),
        allowNull: false,
        defaultValue: 'SYSTEM'
      }, { transaction });

      await queryInterface.addColumn('system_configurations', 'scopeId', {
        type: Sequelize.TEXT,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('system_configurations', 'tags', {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true,
        defaultValue: []
      }, { transaction });

      await queryInterface.addColumn('system_configurations', 'sortOrder', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }, { transaction });

      // =====================================================
      // STEP 4: Create configuration_history table
      // =====================================================

      await queryInterface.createTable('configuration_history', {
        id: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },
        configKey: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        oldValue: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        newValue: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        changedBy: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        changedByName: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        changeReason: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        ipAddress: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        userAgent: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        configurationId: {
          type: Sequelize.TEXT,
          allowNull: false,
          references: {
            model: 'system_configurations',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // =====================================================
      // STEP 5: Create indexes for performance
      // =====================================================

      await queryInterface.addIndex('system_configurations', ['category', 'subCategory'], {
        name: 'system_configurations_category_subCategory_idx',
        transaction
      });

      await queryInterface.addIndex('system_configurations', ['scope', 'scopeId'], {
        name: 'system_configurations_scope_scopeId_idx',
        transaction
      });

      await queryInterface.addIndex('system_configurations', ['tags'], {
        name: 'system_configurations_tags_idx',
        using: 'GIN',
        transaction
      });

      await queryInterface.addIndex('configuration_history', ['configKey', 'createdAt'], {
        name: 'configuration_history_configKey_createdAt_idx',
        transaction
      });

      await queryInterface.addIndex('configuration_history', ['changedBy', 'createdAt'], {
        name: 'configuration_history_changedBy_createdAt_idx',
        transaction
      });

      await queryInterface.addIndex('configuration_history', ['configurationId', 'createdAt'], {
        name: 'configuration_history_configurationId_createdAt_idx',
        transaction
      });

      await transaction.commit();
      console.log('✓ System configuration enhancements completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop indexes
      await queryInterface.removeIndex('configuration_history', 'configuration_history_configurationId_createdAt_idx', { transaction });
      await queryInterface.removeIndex('configuration_history', 'configuration_history_changedBy_createdAt_idx', { transaction });
      await queryInterface.removeIndex('configuration_history', 'configuration_history_configKey_createdAt_idx', { transaction });
      await queryInterface.removeIndex('system_configurations', 'system_configurations_tags_idx', { transaction });
      await queryInterface.removeIndex('system_configurations', 'system_configurations_scope_scopeId_idx', { transaction });
      await queryInterface.removeIndex('system_configurations', 'system_configurations_category_subCategory_idx', { transaction });

      // Drop configuration_history table
      await queryInterface.dropTable('configuration_history', { transaction });

      // Remove columns from system_configurations
      await queryInterface.removeColumn('system_configurations', 'sortOrder', { transaction });
      await queryInterface.removeColumn('system_configurations', 'tags', { transaction });
      await queryInterface.removeColumn('system_configurations', 'scopeId', { transaction });
      await queryInterface.removeColumn('system_configurations', 'scope', { transaction });
      await queryInterface.removeColumn('system_configurations', 'requiresRestart', { transaction });
      await queryInterface.removeColumn('system_configurations', 'isEditable', { transaction });
      await queryInterface.removeColumn('system_configurations', 'maxValue', { transaction });
      await queryInterface.removeColumn('system_configurations', 'minValue', { transaction });
      await queryInterface.removeColumn('system_configurations', 'validValues', { transaction });
      await queryInterface.removeColumn('system_configurations', 'defaultValue', { transaction });
      await queryInterface.removeColumn('system_configurations', 'subCategory', { transaction });
      await queryInterface.removeColumn('system_configurations', 'valueType', { transaction });

      // Drop enums
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "ConfigScope" CASCADE;', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "ConfigValueType" CASCADE;', { transaction });

      // Note: Cannot remove values from ConfigCategory enum in PostgreSQL
      console.log('⚠ Cannot remove added ConfigCategory enum values - requires manual intervention');

      await transaction.commit();
      console.log('✓ Rollback completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Rollback failed:', error);
      throw error;
    }
  }
};
