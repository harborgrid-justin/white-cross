'use strict';

/**
 * Create System Configuration Tables Migration
 *
 * This migration creates the base system configuration infrastructure for the White Cross platform:
 * - ConfigCategory enum for configuration categorization
 * - system_configurations table for storing system-wide settings
 * - Basic indexes for configuration queries
 *
 * PREREQUISITE for: 20251009013303-enhance-system-configuration.js
 *
 * HIPAA Compliance: System configurations may affect PHI handling, so all changes
 * must be tracked (see enhancement migration for configuration_history table)
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Creating system configuration base schema...');

      // =====================================================
      // STEP 1: Create ConfigCategory ENUM
      // =====================================================

      await queryInterface.sequelize.query(`
        DO $$ BEGIN
          CREATE TYPE "ConfigCategory" AS ENUM (
            'GENERAL',
            'SECURITY',
            'NOTIFICATION'
          );
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `, { transaction });

      // =====================================================
      // STEP 2: Create system_configurations Table
      // =====================================================

      await queryInterface.createTable('system_configurations', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('gen_random_uuid()'),
          comment: 'Unique identifier for configuration entry'
        },
        key: {
          type: Sequelize.STRING(200),
          allowNull: false,
          unique: true,
          comment: 'Unique configuration key (e.g., "MAX_LOGIN_ATTEMPTS")'
        },
        value: {
          type: Sequelize.TEXT,
          allowNull: false,
          comment: 'Configuration value (stored as string, parsed by application)'
        },
        category: {
          type: Sequelize.ENUM('GENERAL', 'SECURITY', 'NOTIFICATION'),
          allowNull: false,
          defaultValue: 'GENERAL',
          comment: 'Configuration category for organization'
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: 'Human-readable description of configuration purpose'
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          comment: 'Whether this configuration is currently active'
        },
        displayName: {
          type: Sequelize.STRING(200),
          allowNull: true,
          comment: 'User-friendly display name for configuration UI'
        },
        validationRules: {
          type: Sequelize.JSONB,
          allowNull: true,
          defaultValue: {},
          comment: 'JSON validation rules for configuration value'
        },
        lastModifiedBy: {
          type: Sequelize.UUID,
          allowNull: true,
          comment: 'User ID who last modified this configuration',
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }, { transaction });

      // =====================================================
      // STEP 3: Create Basic Indexes
      // =====================================================

      await queryInterface.addIndex('system_configurations', ['key'], {
        unique: true,
        name: 'system_configurations_key_unique',
        transaction
      });

      await queryInterface.addIndex('system_configurations', ['category'], {
        name: 'system_configurations_category_idx',
        transaction
      });

      await queryInterface.addIndex('system_configurations', ['isActive'], {
        name: 'system_configurations_isActive_idx',
        transaction
      });

      await queryInterface.addIndex('system_configurations', ['category', 'isActive'], {
        name: 'system_configurations_category_active_idx',
        where: { isActive: true },
        transaction
      });

      // =====================================================
      // STEP 4: Seed Default Configuration Values
      // =====================================================

      const defaultConfigurations = [
        {
          key: 'MAX_LOGIN_ATTEMPTS',
          value: '5',
          category: 'SECURITY',
          description: 'Maximum number of failed login attempts before account lockout',
          displayName: 'Maximum Login Attempts',
          validationRules: JSON.stringify({ type: 'number', min: 1, max: 10 })
        },
        {
          key: 'LOCKOUT_DURATION_MINUTES',
          value: '30',
          category: 'SECURITY',
          description: 'Duration in minutes for account lockout after max failed attempts',
          displayName: 'Lockout Duration (minutes)',
          validationRules: JSON.stringify({ type: 'number', min: 5, max: 1440 })
        },
        {
          key: 'SESSION_TIMEOUT_MINUTES',
          value: '60',
          category: 'SECURITY',
          description: 'User session timeout in minutes of inactivity',
          displayName: 'Session Timeout (minutes)',
          validationRules: JSON.stringify({ type: 'number', min: 15, max: 480 })
        },
        {
          key: 'PASSWORD_MIN_LENGTH',
          value: '12',
          category: 'SECURITY',
          description: 'Minimum password length requirement',
          displayName: 'Minimum Password Length',
          validationRules: JSON.stringify({ type: 'number', min: 8, max: 128 })
        },
        {
          key: 'PASSWORD_REQUIRE_SPECIAL_CHAR',
          value: 'true',
          category: 'SECURITY',
          description: 'Whether passwords must contain special characters',
          displayName: 'Require Special Characters',
          validationRules: JSON.stringify({ type: 'boolean' })
        },
        {
          key: 'PASSWORD_EXPIRY_DAYS',
          value: '90',
          category: 'SECURITY',
          description: 'Number of days before password expires and must be changed',
          displayName: 'Password Expiry (days)',
          validationRules: JSON.stringify({ type: 'number', min: 0, max: 365 })
        },
        {
          key: 'EMAIL_NOTIFICATION_ENABLED',
          value: 'true',
          category: 'NOTIFICATION',
          description: 'Enable email notifications for system events',
          displayName: 'Email Notifications',
          validationRules: JSON.stringify({ type: 'boolean' })
        },
        {
          key: 'SMS_NOTIFICATION_ENABLED',
          value: 'false',
          category: 'NOTIFICATION',
          description: 'Enable SMS notifications for system events',
          displayName: 'SMS Notifications',
          validationRules: JSON.stringify({ type: 'boolean' })
        },
        {
          key: 'SYSTEM_NAME',
          value: 'White Cross Healthcare Platform',
          category: 'GENERAL',
          description: 'Display name for the healthcare platform',
          displayName: 'System Name',
          validationRules: JSON.stringify({ type: 'string', maxLength: 200 })
        },
        {
          key: 'SUPPORT_EMAIL',
          value: 'support@whitecross.health',
          category: 'GENERAL',
          description: 'Support contact email address',
          displayName: 'Support Email',
          validationRules: JSON.stringify({ type: 'email' })
        },
        {
          key: 'MAINTENANCE_MODE',
          value: 'false',
          category: 'GENERAL',
          description: 'Enable maintenance mode to restrict system access',
          displayName: 'Maintenance Mode',
          validationRules: JSON.stringify({ type: 'boolean' })
        },
        {
          key: 'MAX_FILE_UPLOAD_SIZE_MB',
          value: '10',
          category: 'GENERAL',
          description: 'Maximum file upload size in megabytes',
          displayName: 'Max Upload Size (MB)',
          validationRules: JSON.stringify({ type: 'number', min: 1, max: 100 })
        }
      ];

      for (const config of defaultConfigurations) {
        await queryInterface.sequelize.query(`
          INSERT INTO "system_configurations"
            ("id", "key", "value", "category", "description", "displayName", "validationRules", "isActive", "createdAt", "updatedAt")
          VALUES
            (gen_random_uuid(), :key, :value, :category, :description, :displayName, :validationRules::jsonb, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `, {
          replacements: {
            key: config.key,
            value: config.value,
            category: config.category,
            description: config.description,
            displayName: config.displayName,
            validationRules: config.validationRules
          },
          transaction
        });
      }

      // =====================================================
      // STEP 5: Add Table Comments
      // =====================================================

      await queryInterface.sequelize.query(`
        COMMENT ON TABLE "system_configurations" IS 'System-wide configuration settings with validation and audit tracking. HIPAA relevant as configurations may affect PHI handling.';
      `, { transaction });

      await transaction.commit();
      console.log('✓ System configuration base schema migration completed successfully');
      console.log(`✓ Seeded ${defaultConfigurations.length} default configuration values`);

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Drop table
      await queryInterface.dropTable('system_configurations', { transaction });

      // Drop enum
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "ConfigCategory" CASCADE;', { transaction });

      await transaction.commit();
      console.log('✓ System configuration rollback completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Rollback failed:', error);
      throw error;
    }
  }
};
