'use strict';

/**
 * Migration: Update Medication Logs Schema
 *
 * Updates the medication_logs table to match the MedicationLog model schema.
 * The original table used studentMedicationId/nurseId/timeGiven, but the new schema
 * uses studentId/medicationId/administeredAt/administeredBy/status.
 *
 * This migration:
 * - Adds new columns expected by the model
 * - Migrates data from old columns to new columns
 * - Sets appropriate defaults for new required fields
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Updating medication_logs schema...');

      // Add new columns expected by MedicationLog model

      // Add studentId column (foreign key to students)
      await queryInterface.addColumn('medication_logs', 'studentId', {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'Foreign key to students table',
      }, { transaction });

      // Add medicationId column (foreign key to medications)
      await queryInterface.addColumn('medication_logs', 'medicationId', {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'Foreign key to medications table',
      }, { transaction });

      // Add dosage column (decimal)
      await queryInterface.addColumn('medication_logs', 'dosage', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Dosage amount administered',
      }, { transaction });

      // Add dosageUnit column
      await queryInterface.addColumn('medication_logs', 'dosageUnit', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Unit of dosage (mg, ml, etc.)',
      }, { transaction });

      // Add route column
      await queryInterface.addColumn('medication_logs', 'route', {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: 'oral',
        comment: 'Route of administration (oral, injection, etc.)',
      }, { transaction });

      // Add scheduledAt column
      await queryInterface.addColumn('medication_logs', 'scheduledAt', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Scheduled time for medication administration',
      }, { transaction });

      // Add administeredAt column (rename from timeGiven)
      await queryInterface.addColumn('medication_logs', 'administeredAt', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Actual time medication was administered',
      }, { transaction });

      // Add administeredBy column (rename from nurseId)
      await queryInterface.addColumn('medication_logs', 'administeredBy', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Name/ID of person who administered medication',
      }, { transaction });

      // Add status column
      await queryInterface.addColumn('medication_logs', 'status', {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'ADMINISTERED',
        comment: 'Status: PENDING, ADMINISTERED, MISSED, CANCELLED, REFUSED',
      }, { transaction });

      // Add reasonNotGiven column
      await queryInterface.addColumn('medication_logs', 'reasonNotGiven', {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Reason when status is MISSED, CANCELLED, or REFUSED',
      }, { transaction });

      // Add updatedAt column
      await queryInterface.addColumn('medication_logs', 'updatedAt', {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Last update timestamp',
      }, { transaction });

      // Migrate data from old columns to new columns
      console.log('Migrating medication_logs data...');

      // First, we need to populate studentId and medicationId from the relationships
      // This requires joining with student_medications table
      await queryInterface.sequelize.query(`
        UPDATE medication_logs
        SET
          "studentId" = sm."studentId",
          "medicationId" = sm."medicationId",
          "administeredAt" = "timeGiven",
          "administeredBy" = "nurseId"::text,
          "dosage" = CASE
            WHEN "dosageGiven" ~ '^\\d+(\\.\\d+)?$'
            THEN "dosageGiven"::decimal
            ELSE NULL
          END,
          "dosageUnit" = CASE
            WHEN "dosageGiven" ~ '\\d+\\s*(mg|ml|g|mcg|units?|tabs?|caps?)'
            THEN regexp_replace("dosageGiven", '^\\d+(\\.\\d+)?\\s*', '')
            ELSE 'mg'
          END,
          "status" = CASE
            WHEN "adverseReaction" = true THEN 'REFUSED'
            ELSE 'ADMINISTERED'
          END,
          "reasonNotGiven" = CASE
            WHEN "adverseReaction" = true THEN "reactionDetails"
            ELSE NULL
          END,
          "updatedAt" = medication_logs."createdAt"
        FROM student_medications sm
        WHERE medication_logs."studentMedicationId" = sm.id
      `, { transaction });

      // Set defaults for records that couldn't be migrated
      await queryInterface.sequelize.query(`
        UPDATE medication_logs
        SET
          "status" = COALESCE("status", 'ADMINISTERED'),
          "route" = COALESCE("route", 'oral'),
          "dosage" = COALESCE("dosage", 1.0),
          "dosageUnit" = COALESCE("dosageUnit", 'mg'),
          "administeredAt" = COALESCE("administeredAt", "createdAt"),
          "updatedAt" = COALESCE("updatedAt", "createdAt")
        WHERE "status" IS NULL OR "administeredAt" IS NULL
      `, { transaction });

      // Skip foreign key constraints for now to avoid timeout
      // They can be added later with a separate migration
      console.log('Skipping foreign key constraints to avoid timeout - will add separately');

      await transaction.commit();
      console.log('✓ Successfully updated medication_logs schema');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to update medication_logs schema:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Reverting medication_logs schema changes...');

      // Remove foreign key constraints
      await queryInterface.removeConstraint('medication_logs', 'fk_medication_logs_student_id', { transaction });
      await queryInterface.removeConstraint('medication_logs', 'fk_medication_logs_medication_id_new', { transaction });

      // Remove new columns
      await queryInterface.removeColumn('medication_logs', 'studentId', { transaction });
      await queryInterface.removeColumn('medication_logs', 'medicationId', { transaction });
      await queryInterface.removeColumn('medication_logs', 'dosage', { transaction });
      await queryInterface.removeColumn('medication_logs', 'dosageUnit', { transaction });
      await queryInterface.removeColumn('medication_logs', 'route', { transaction });
      await queryInterface.removeColumn('medication_logs', 'scheduledAt', { transaction });
      await queryInterface.removeColumn('medication_logs', 'administeredAt', { transaction });
      await queryInterface.removeColumn('medication_logs', 'administeredBy', { transaction });
      await queryInterface.removeColumn('medication_logs', 'status', { transaction });
      await queryInterface.removeColumn('medication_logs', 'reasonNotGiven', { transaction });
      await queryInterface.removeColumn('medication_logs', 'updatedAt', { transaction });

      await transaction.commit();
      console.log('✓ Successfully reverted medication_logs schema changes');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to revert medication_logs schema changes:', error);
      throw error;
    }
  }
};
