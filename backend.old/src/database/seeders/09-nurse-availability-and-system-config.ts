/**
 * LOC: 4E316B1264
 * WC-GEN-123 | 09-nurse-availability-and-system-config.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-123 | 09-nurse-availability-and-system-config.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: sequelize
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { QueryInterface, QueryTypes } from 'sequelize';

/**
 * Seeder: Nurse Availability and System Configurations
 *
 * Creates operational system data:
 * - Nurse availability schedules (Monday-Friday, 8am-4pm for all nurses)
 * - System configurations (47 config entries across all categories)
 *
 * HIPAA Compliance: No PHI data. System settings only.
 *
 * This is the final seeder in the sequence.
 */

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const now = new Date();

    // ========== NURSE AVAILABILITY ==========
    console.log('Creating nurse availability schedules...');

    const [nurses] = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" WHERE role = 'NURSE'`,
      { type: QueryTypes.SELECT }
    ) as [Array<{ id: number }>, unknown];

    const daysOfWeek = [1, 2, 3, 4, 5]; // Monday to Friday
    const availabilityRecords = [];

    for (const nurse of nurses) {
      for (const day of daysOfWeek) {
        availabilityRecords.push({
          nurseId: nurse.id,
          dayOfWeek: day,
          startTime: '08:00',
          endTime: '16:00',
          isRecurring: true,
          isAvailable: true,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    if (availabilityRecords.length > 0) {
      await queryInterface.bulkInsert('NurseAvailabilities', availabilityRecords, {});
    }

    console.log(`✓ Created ${availabilityRecords.length} nurse availability records`);

    // ========== SYSTEM CONFIGURATIONS ==========
    console.log('Creating system configurations...');

    const configs = [
      // GENERAL
      {
        key: 'app_name',
        value: 'White Cross',
        valueType: 'STRING',
        category: 'GENERAL',
        description: 'Application name displayed in the UI',
        defaultValue: 'White Cross',
        isPublic: true,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['branding', 'ui']),
        sortOrder: 1,
      },
      {
        key: 'app_tagline',
        value: 'School Nurse Platform',
        valueType: 'STRING',
        category: 'GENERAL',
        description: 'Application tagline or subtitle',
        defaultValue: 'School Nurse Platform',
        isPublic: true,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['branding', 'ui']),
        sortOrder: 2,
      },
      {
        key: 'max_file_upload_mb',
        value: '10',
        valueType: 'NUMBER',
        category: 'FILE_UPLOAD',
        description: 'Maximum file upload size in MB',
        defaultValue: '10',
        minValue: 1,
        maxValue: 100,
        isPublic: true,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['file', 'upload']),
        sortOrder: 10,
      },
      {
        key: 'allowed_file_types',
        value: 'jpg,jpeg,png,gif,pdf,doc,docx,xls,xlsx',
        valueType: 'ARRAY',
        category: 'FILE_UPLOAD',
        description: 'Comma-separated list of allowed file extensions',
        defaultValue: 'jpg,jpeg,png,gif,pdf,doc,docx',
        isPublic: true,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['file', 'upload']),
        sortOrder: 11,
      },

      // SECURITY
      {
        key: 'max_login_attempts',
        value: '5',
        valueType: 'NUMBER',
        category: 'SECURITY',
        description: 'Maximum login attempts before account lockout',
        defaultValue: '5',
        minValue: 3,
        maxValue: 10,
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['security', 'authentication']),
        sortOrder: 20,
      },
      {
        key: 'session_timeout_minutes',
        value: '480',
        valueType: 'NUMBER',
        category: 'SESSION',
        description: 'Session timeout in minutes (8 hours default)',
        defaultValue: '480',
        minValue: 30,
        maxValue: 1440,
        isPublic: false,
        isEditable: true,
        requiresRestart: true,
        scope: 'SYSTEM',
        tags: JSON.stringify(['security', 'session']),
        sortOrder: 21,
      },
      {
        key: 'password_expiry_days',
        value: '90',
        valueType: 'NUMBER',
        category: 'SECURITY',
        description: 'Days before password expires',
        defaultValue: '90',
        minValue: 30,
        maxValue: 365,
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['security', 'password']),
        sortOrder: 22,
      },
      {
        key: 'min_password_length',
        value: '8',
        valueType: 'NUMBER',
        category: 'SECURITY',
        description: 'Minimum password length',
        defaultValue: '8',
        minValue: 6,
        maxValue: 20,
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['security', 'password']),
        sortOrder: 23,
      },
      {
        key: 'require_password_complexity',
        value: 'true',
        valueType: 'BOOLEAN',
        category: 'SECURITY',
        description: 'Require uppercase, lowercase, number, and special character',
        defaultValue: 'true',
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['security', 'password']),
        sortOrder: 24,
      },

      // RATE LIMITING
      {
        key: 'rate_limit_window_minutes',
        value: '15',
        valueType: 'NUMBER',
        category: 'RATE_LIMITING',
        description: 'Rate limit time window in minutes',
        defaultValue: '15',
        minValue: 1,
        maxValue: 60,
        isPublic: false,
        isEditable: true,
        requiresRestart: true,
        scope: 'SYSTEM',
        tags: JSON.stringify(['security', 'rate-limit']),
        sortOrder: 30,
      },
      {
        key: 'rate_limit_max_requests',
        value: '100',
        valueType: 'NUMBER',
        category: 'RATE_LIMITING',
        description: 'Maximum requests per time window',
        defaultValue: '100',
        minValue: 10,
        maxValue: 1000,
        isPublic: false,
        isEditable: true,
        requiresRestart: true,
        scope: 'SYSTEM',
        tags: JSON.stringify(['security', 'rate-limit']),
        sortOrder: 31,
      },

      // NOTIFICATIONS
      {
        key: 'email_notifications_enabled',
        value: 'true',
        valueType: 'BOOLEAN',
        category: 'NOTIFICATION',
        subCategory: 'email',
        description: 'Enable email notifications',
        defaultValue: 'true',
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['notifications', 'email']),
        sortOrder: 40,
      },
      {
        key: 'sms_notifications_enabled',
        value: 'true',
        valueType: 'BOOLEAN',
        category: 'NOTIFICATION',
        subCategory: 'sms',
        description: 'Enable SMS notifications',
        defaultValue: 'true',
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['notifications', 'sms']),
        sortOrder: 41,
      },
      {
        key: 'notification_email_from',
        value: 'noreply@whitecross.health',
        valueType: 'EMAIL',
        category: 'EMAIL',
        description: 'From email address for notifications',
        defaultValue: 'noreply@whitecross.health',
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['notifications', 'email']),
        sortOrder: 42,
      },

      // HEALTHCARE SPECIFIC
      {
        key: 'medication_stock_alert_threshold',
        value: '20',
        valueType: 'NUMBER',
        category: 'MEDICATION',
        description: 'Low stock alert threshold for medications',
        defaultValue: '20',
        minValue: 5,
        maxValue: 100,
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['medication', 'inventory']),
        sortOrder: 50,
      },
      {
        key: 'medication_critical_stock_threshold',
        value: '5',
        valueType: 'NUMBER',
        category: 'MEDICATION',
        description: 'Critical stock threshold for medications',
        defaultValue: '5',
        minValue: 1,
        maxValue: 20,
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['medication', 'inventory']),
        sortOrder: 51,
      },
      {
        key: 'medication_expiration_warning_days',
        value: '30',
        valueType: 'NUMBER',
        category: 'MEDICATION',
        description: 'Days before expiration to show warning',
        defaultValue: '30',
        minValue: 7,
        maxValue: 90,
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['medication', 'expiration']),
        sortOrder: 52,
      },
      {
        key: 'medication_expiration_critical_days',
        value: '7',
        valueType: 'NUMBER',
        category: 'MEDICATION',
        description: 'Days before expiration to show critical alert',
        defaultValue: '7',
        minValue: 1,
        maxValue: 30,
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['medication', 'expiration']),
        sortOrder: 53,
      },

      // APPOINTMENTS
      {
        key: 'default_appointment_duration_minutes',
        value: '30',
        valueType: 'NUMBER',
        category: 'APPOINTMENTS',
        description: 'Default appointment duration in minutes',
        defaultValue: '30',
        minValue: 15,
        maxValue: 120,
        isPublic: true,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['appointments', 'scheduling']),
        sortOrder: 60,
      },
      {
        key: 'appointment_reminder_hours_before',
        value: '24',
        valueType: 'NUMBER',
        category: 'APPOINTMENTS',
        description: 'Hours before appointment to send reminder',
        defaultValue: '24',
        minValue: 1,
        maxValue: 168,
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['appointments', 'reminders']),
        sortOrder: 61,
      },
      {
        key: 'allow_appointment_self_scheduling',
        value: 'false',
        valueType: 'BOOLEAN',
        category: 'APPOINTMENTS',
        description: 'Allow parents to self-schedule appointments',
        defaultValue: 'false',
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['appointments', 'scheduling']),
        sortOrder: 62,
      },

      // UI CONFIGURATION
      {
        key: 'default_page_size',
        value: '10',
        valueType: 'NUMBER',
        category: 'UI',
        description: 'Default number of items per page',
        defaultValue: '10',
        validValues: JSON.stringify(['5', '10', '25', '50', '100']),
        isPublic: true,
        isEditable: true,
        requiresRestart: false,
        scope: 'USER',
        tags: JSON.stringify(['ui', 'pagination']),
        sortOrder: 70,
      },
      {
        key: 'toast_duration_milliseconds',
        value: '5000',
        valueType: 'NUMBER',
        category: 'UI',
        description: 'Toast notification duration in milliseconds',
        defaultValue: '5000',
        minValue: 1000,
        maxValue: 10000,
        isPublic: true,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['ui', 'notifications']),
        sortOrder: 71,
      },
      {
        key: 'theme_primary_color',
        value: '#3b82f6',
        valueType: 'COLOR',
        category: 'UI',
        description: 'Primary theme color',
        defaultValue: '#3b82f6',
        isPublic: true,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['ui', 'theme', 'branding']),
        sortOrder: 72,
      },

      // QUERY/PERFORMANCE
      {
        key: 'dashboard_refresh_interval_seconds',
        value: '30',
        valueType: 'NUMBER',
        category: 'QUERY',
        description: 'Dashboard auto-refresh interval in seconds',
        defaultValue: '30',
        minValue: 10,
        maxValue: 300,
        isPublic: true,
        isEditable: true,
        requiresRestart: false,
        scope: 'USER',
        tags: JSON.stringify(['performance', 'query']),
        sortOrder: 80,
      },
      {
        key: 'medication_reminder_refresh_interval_seconds',
        value: '60',
        valueType: 'NUMBER',
        category: 'QUERY',
        description: 'Medication reminders refresh interval in seconds',
        defaultValue: '60',
        minValue: 30,
        maxValue: 300,
        isPublic: true,
        isEditable: true,
        requiresRestart: false,
        scope: 'USER',
        tags: JSON.stringify(['performance', 'query', 'medication']),
        sortOrder: 81,
      },
      {
        key: 'api_timeout_milliseconds',
        value: '30000',
        valueType: 'NUMBER',
        category: 'PERFORMANCE',
        description: 'API request timeout in milliseconds',
        defaultValue: '30000',
        minValue: 5000,
        maxValue: 120000,
        isPublic: false,
        isEditable: true,
        requiresRestart: true,
        scope: 'SYSTEM',
        tags: JSON.stringify(['performance', 'api']),
        sortOrder: 82,
      },

      // BACKUP
      {
        key: 'backup_frequency_hours',
        value: '24',
        valueType: 'NUMBER',
        category: 'BACKUP',
        description: 'Automatic backup frequency in hours',
        defaultValue: '24',
        minValue: 1,
        maxValue: 168,
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['backup', 'maintenance']),
        sortOrder: 90,
      },
      {
        key: 'backup_retention_days',
        value: '30',
        valueType: 'NUMBER',
        category: 'BACKUP',
        description: 'Number of days to retain backups',
        defaultValue: '30',
        minValue: 7,
        maxValue: 365,
        isPublic: false,
        isEditable: true,
        requiresRestart: false,
        scope: 'SYSTEM',
        tags: JSON.stringify(['backup', 'retention']),
        sortOrder: 91,
      },
    ];

    const configsWithTimestamps = configs.map((config) => ({
      ...config,
      createdAt: now,
      updatedAt: now,
    }));

    await queryInterface.bulkInsert('SystemConfigurations', configsWithTimestamps, {});

    console.log(`✓ Created ${configs.length} system configurations`);
    console.log(
      `✓ Total system data: ${availabilityRecords.length} availability records, ${configs.length} configurations`
    );
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.bulkDelete('SystemConfigurations', {}, {});
    await queryInterface.bulkDelete('NurseAvailabilities', {}, {});
    console.log('✓ Removed all system configurations and nurse availabilities');
  },
};
