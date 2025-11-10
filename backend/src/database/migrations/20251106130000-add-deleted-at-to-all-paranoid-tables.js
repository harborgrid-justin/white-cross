'use strict';

/**
 * Add deletedAt columns to all paranoid tables
 * 
 * This migration ensures all tables with paranoid: true models have the required deletedAt column.
 * Many tables were created before paranoid mode was enabled and are missing this column.
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('[MIGRATION] Adding deletedAt columns to all paranoid tables...');
    
    // List of tables that should have deletedAt column based on paranoid models
    const paranoidTables = [
      'users',
      'students', 
      'contacts',
      'districts',
      'schools',
      'allergies',
      'appointments',
      'conversations',
      'clinical_notes',
      'growth_tracking',
      'health_records',
      'health_screenings',
      'immunizations',
      'incident_reports',
      'lab_results',
      'clinic_visits',
      'medical_history',
      'chronic_conditions',
      'medication_logs',
      'mental_health_records',
      'medications',
      'message_deliveries',
      'message_templates'
    ];

    for (const tableName of paranoidTables) {
      try {
        // Check if table exists
        const tableExists = await queryInterface.sequelize.query(
          `SELECT EXISTS (
             SELECT FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name = '${tableName}'
           );`,
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (!tableExists[0].exists) {
          console.log(`[MIGRATION] Table ${tableName} does not exist, skipping...`);
          continue;
        }

        // Check if deletedAt column already exists
        const columnExists = await queryInterface.sequelize.query(
          `SELECT column_name 
           FROM information_schema.columns 
           WHERE table_name = '${tableName}' 
           AND column_name = 'deletedAt';`,
          { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (columnExists.length === 0) {
          // Add deletedAt column
          await queryInterface.addColumn(tableName, 'deletedAt', {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Timestamp when the record was soft deleted (paranoid delete)'
          });

          // Add index for performance
          try {
            await queryInterface.addIndex(tableName, ['deletedAt'], {
              name: `idx_${tableName}_deleted_at`
            });
            console.log(`[MIGRATION] Added deletedAt column and index to ${tableName}`);
          } catch (indexError) {
            console.log(`[MIGRATION] Added deletedAt column to ${tableName} (index may already exist)`);
          }
        } else {
          console.log(`[MIGRATION] deletedAt column already exists in ${tableName}`);
        }
      } catch (error) {
        console.warn(`[MIGRATION] Warning: Could not process table ${tableName}:`, error.message);
      }
    }

    console.log('[MIGRATION] Completed adding deletedAt columns to paranoid tables');
  },

  down: async (queryInterface, Sequelize) => {
    console.log('[MIGRATION] Rolling back: removing deletedAt columns...');
    
    const paranoidTables = [
      'users',
      'students', 
      'contacts',
      'districts',
      'schools',
      'allergies',
      'appointments',
      'conversations',
      'clinical_notes',
      'growth_tracking',
      'health_records',
      'health_screenings',
      'immunizations',
      'incident_reports',
      'lab_results',
      'clinic_visits',
      'medical_history',
      'chronic_conditions',
      'medication_logs',
      'mental_health_records',
      'medications',
      'message_deliveries',
      'message_templates'
    ];

    for (const tableName of paranoidTables) {
      try {
        // Remove index first
        try {
          await queryInterface.removeIndex(tableName, `idx_${tableName}_deleted_at`);
        } catch (error) {
          // Index might not exist, continue
        }

        // Remove column
        try {
          await queryInterface.removeColumn(tableName, 'deletedAt');
          console.log(`[MIGRATION] Removed deletedAt column from ${tableName}`);
        } catch (error) {
          // Column might not exist, continue
        }
      } catch (error) {
        console.warn(`[MIGRATION] Warning: Could not rollback table ${tableName}:`, error.message);
      }
    }
  }
};