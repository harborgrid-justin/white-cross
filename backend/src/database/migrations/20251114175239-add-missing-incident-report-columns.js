'use strict';

/**
 * Migration: Add Missing Incident Report Columns
 *
 * Adds columns that are expected by the IncidentReport model but missing from the database:
 * - status: Incident status (DRAFT, PENDING_REVIEW, etc.)
 * - actionsTaken: Actions taken in response to incident
 * - parentNotificationMethod: Method used to notify parent
 * - evidencePhotos: Array of evidence photo URLs
 * - evidenceVideos: Array of evidence video URLs
 * - insuranceClaimNumber: Insurance claim number
 * - insuranceClaimStatus: Insurance claim status
 * - legalComplianceStatus: Legal compliance status
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Adding missing incident report columns...');

      // Add status column
      await queryInterface.addColumn('incident_reports', 'status', {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'PENDING_REVIEW',
        comment: 'Incident status: DRAFT, PENDING_REVIEW, UNDER_INVESTIGATION, etc.',
      }, { transaction });

      // Add actionsTaken column (rename from actionTaken)
      await queryInterface.addColumn('incident_reports', 'actionsTaken', {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Actions taken in response to the incident',
      }, { transaction });

      // Add parentNotificationMethod column
      await queryInterface.addColumn('incident_reports', 'parentNotificationMethod', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Method used to notify parent (phone, email, etc.)',
      }, { transaction });

      // Add evidencePhotos column
      await queryInterface.addColumn('incident_reports', 'evidencePhotos', {
        type: Sequelize.ARRAY(Sequelize.STRING(255)),
        allowNull: true,
        defaultValue: [],
        comment: 'Array of evidence photo URLs',
      }, { transaction });

      // Add evidenceVideos column
      await queryInterface.addColumn('incident_reports', 'evidenceVideos', {
        type: Sequelize.ARRAY(Sequelize.STRING(255)),
        allowNull: true,
        defaultValue: [],
        comment: 'Array of evidence video URLs',
      }, { transaction });

      // Add insuranceClaimNumber column
      await queryInterface.addColumn('incident_reports', 'insuranceClaimNumber', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Insurance claim number if applicable',
      }, { transaction });

      // Add insuranceClaimStatus column
      await queryInterface.addColumn('incident_reports', 'insuranceClaimStatus', {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Insurance claim status: NOT_FILED, FILED, PENDING, APPROVED, DENIED, CLOSED',
      }, { transaction });

      // Add legalComplianceStatus column
      await queryInterface.addColumn('incident_reports', 'legalComplianceStatus', {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'PENDING',
        comment: 'Legal compliance status: PENDING, COMPLIANT, NON_COMPLIANT, UNDER_REVIEW',
      }, { transaction });

      // Migrate data from old columns to new columns
      console.log('Migrating incident report data...');

      // Copy actionTaken to actionsTaken
      await queryInterface.sequelize.query(`
        UPDATE incident_reports
        SET
          "actionsTaken" = "actionTaken",
          "status" = 'PENDING_REVIEW',
          "evidencePhotos" = ARRAY[]::varchar[],
          "evidenceVideos" = ARRAY[]::varchar[],
          "legalComplianceStatus" = 'PENDING'
        WHERE "actionTaken" IS NOT NULL OR "actionTaken" IS NULL
      `, { transaction });

      await transaction.commit();
      console.log('✓ Successfully added missing incident report columns');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to add incident report columns:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Removing added incident report columns...');

      await queryInterface.removeColumn('incident_reports', 'status', { transaction });
      await queryInterface.removeColumn('incident_reports', 'actionsTaken', { transaction });
      await queryInterface.removeColumn('incident_reports', 'parentNotificationMethod', { transaction });
      await queryInterface.removeColumn('incident_reports', 'evidencePhotos', { transaction });
      await queryInterface.removeColumn('incident_reports', 'evidenceVideos', { transaction });
      await queryInterface.removeColumn('incident_reports', 'insuranceClaimNumber', { transaction });
      await queryInterface.removeColumn('incident_reports', 'insuranceClaimStatus', { transaction });
      await queryInterface.removeColumn('incident_reports', 'legalComplianceStatus', { transaction });

      await transaction.commit();
      console.log('✓ Successfully removed added incident report columns');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to remove incident report columns:', error);
      throw error;
    }
  }
};
