'use strict';

/**
 * Migration: Add Foreign Key Constraint to MedicationLog
 *
 * Purpose: Add foreign key constraint from medication_logs.medicationId to medications.id
 * to ensure referential integrity for medication administration records.
 *
 * HIPAA Compliance: This migration enhances data integrity for medication administration
 * records, which are critical PHI data requiring accurate audit trails.
 *
 * Safety Features:
 * - Uses transactions for atomicity
 * - Checks for existing constraint before adding
 * - Validates data integrity before adding constraint
 * - Includes comprehensive rollback method
 *
 * Performance Impact: Low - constraint creation is fast, but may briefly lock table
 * Estimated Duration: < 5 seconds for tables with < 100k records
 */

module.exports = {
  /**
   * Add foreign key constraint to medication_logs table
   *
   * @param {QueryInterface} queryInterface - Sequelize query interface
   * @param {Sequelize} Sequelize - Sequelize instance
   * @returns {Promise<void>}
   */
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('[MIGRATION] Starting: Add medication_logs foreign key constraint');

      // Step 1: Verify both tables exist
      const [medicationLogsTable] = await queryInterface.sequelize.query(
        `SELECT table_name FROM information_schema.tables
         WHERE table_schema = 'public'
         AND table_name = 'medication_logs'`,
        { transaction }
      );

      const [medicationsTable] = await queryInterface.sequelize.query(
        `SELECT table_name FROM information_schema.tables
         WHERE table_schema = 'public'
         AND table_name = 'medications'`,
        { transaction }
      );

      if (medicationLogsTable.length === 0 || medicationsTable.length === 0) {
        throw new Error(
          'Required tables (medication_logs, medications) do not exist. ' +
          'Please run base schema migrations first.'
        );
      }

      // Step 2: Check if constraint already exists (idempotent)
      const [existingConstraints] = await queryInterface.sequelize.query(
        `SELECT constraint_name
         FROM information_schema.table_constraints
         WHERE table_name = 'medication_logs'
         AND constraint_name = 'fk_medication_logs_medication_id'
         AND constraint_type = 'FOREIGN KEY'`,
        { transaction }
      );

      if (existingConstraints.length > 0) {
        console.log('[MIGRATION] Foreign key constraint already exists - skipping');
        await transaction.commit();
        return;
      }

      // Step 3: Validate data integrity - identify orphaned records
      const [orphanedRecords] = await queryInterface.sequelize.query(
        `SELECT ml.id, ml."medicationId"
         FROM medication_logs ml
         LEFT JOIN medications m ON ml."medicationId" = m.id
         WHERE m.id IS NULL
         AND ml."medicationId" IS NOT NULL
         LIMIT 10`,
        { transaction }
      );

      if (orphanedRecords.length > 0) {
        console.error(
          '[MIGRATION ERROR] Found orphaned medication_logs records with invalid medicationId:',
          orphanedRecords.map(r => ({ id: r.id, medicationId: r.medicationId }))
        );
        throw new Error(
          `Data integrity violation: ${orphanedRecords.length} medication_logs records ` +
          'reference non-existent medications. Please fix data before adding constraint.'
        );
      }

      // Step 4: Add foreign key constraint
      console.log('[MIGRATION] Adding foreign key constraint: medication_logs.medicationId -> medications.id');

      await queryInterface.addConstraint('medication_logs', {
        fields: ['medicationId'],
        type: 'foreign key',
        name: 'fk_medication_logs_medication_id',
        references: {
          table: 'medications',
          field: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // Prevent deletion of medications with existing logs
        transaction
      });

      // Step 5: Audit log entry for compliance
      console.log('[MIGRATION AUDIT] Foreign key constraint added successfully');
      console.log('[MIGRATION AUDIT] Constraint: fk_medication_logs_medication_id');
      console.log('[MIGRATION AUDIT] Behavior: ON UPDATE CASCADE, ON DELETE RESTRICT');
      console.log('[MIGRATION AUDIT] Timestamp:', new Date().toISOString());

      await transaction.commit();
      console.log('[MIGRATION] Completed: Add medication_logs foreign key constraint');

    } catch (error) {
      await transaction.rollback();
      console.error('[MIGRATION ERROR] Failed to add foreign key constraint:', error.message);
      throw error;
    }
  },

  /**
   * Remove foreign key constraint from medication_logs table
   *
   * @param {QueryInterface} queryInterface - Sequelize query interface
   * @param {Sequelize} Sequelize - Sequelize instance
   * @returns {Promise<void>}
   */
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('[MIGRATION ROLLBACK] Starting: Remove medication_logs foreign key constraint');

      // Check if constraint exists before attempting removal
      const [existingConstraints] = await queryInterface.sequelize.query(
        `SELECT constraint_name
         FROM information_schema.table_constraints
         WHERE table_name = 'medication_logs'
         AND constraint_name = 'fk_medication_logs_medication_id'
         AND constraint_type = 'FOREIGN KEY'`,
        { transaction }
      );

      if (existingConstraints.length === 0) {
        console.log('[MIGRATION ROLLBACK] Foreign key constraint does not exist - skipping');
        await transaction.commit();
        return;
      }

      // Remove the foreign key constraint
      console.log('[MIGRATION ROLLBACK] Removing foreign key constraint: fk_medication_logs_medication_id');

      await queryInterface.removeConstraint(
        'medication_logs',
        'fk_medication_logs_medication_id',
        { transaction }
      );

      // Audit log entry for compliance
      console.log('[MIGRATION AUDIT] Foreign key constraint removed');
      console.log('[MIGRATION AUDIT] Constraint: fk_medication_logs_medication_id');
      console.log('[MIGRATION AUDIT] Timestamp:', new Date().toISOString());

      await transaction.commit();
      console.log('[MIGRATION ROLLBACK] Completed: Remove medication_logs foreign key constraint');

    } catch (error) {
      await transaction.rollback();
      console.error('[MIGRATION ROLLBACK ERROR] Failed to remove foreign key constraint:', error.message);
      throw error;
    }
  }
};
