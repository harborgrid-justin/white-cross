'use strict';

/**
 * Migration: Add Missing Emergency Contact Columns
 *
 * Adds columns that are expected by the EmergencyContact model but missing from the database:
 * - verificationStatus: Contact verification status (UNVERIFIED, PENDING, VERIFIED)
 * - lastVerifiedAt: Timestamp of last verification
 * - notificationChannels: JSON array of notification channels
 * - canPickupStudent: Whether contact is authorized to pickup student
 *
 * Also adds firstName/lastName columns to replace the single 'name' column
 * and phoneNumber to replace primaryPhone/secondaryPhone
 */

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Adding missing emergency contact columns...');

      // Add verificationStatus column
      await queryInterface.addColumn('emergency_contacts', 'verificationStatus', {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: 'UNVERIFIED',
        comment: 'Verification status: UNVERIFIED, PENDING, VERIFIED',
      }, { transaction });

      // Add lastVerifiedAt column
      await queryInterface.addColumn('emergency_contacts', 'lastVerifiedAt', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp of last contact verification',
      }, { transaction });

      // Add notificationChannels column
      await queryInterface.addColumn('emergency_contacts', 'notificationChannels', {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'JSON array of notification channels (sms, email, voice)',
      }, { transaction });

      // Add canPickupStudent column
      await queryInterface.addColumn('emergency_contacts', 'canPickupStudent', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        comment: 'Whether contact is authorized to pickup student',
      }, { transaction });

      // Add firstName and lastName columns (split from 'name' column)
      await queryInterface.addColumn('emergency_contacts', 'firstName', {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Contact first name',
      }, { transaction });

      await queryInterface.addColumn('emergency_contacts', 'lastName', {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Contact last name',
      }, { transaction });

      // Add phoneNumber column (primary phone)
      await queryInterface.addColumn('emergency_contacts', 'phoneNumber', {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'Primary phone number in E.164 format',
      }, { transaction });

      await transaction.commit();

      // Data migration in separate transaction after columns are created
      console.log('Migrating data from old columns to new columns...');
      const migrationTransaction = await queryInterface.sequelize.transaction();

      try {
        // Split name into firstName and lastName
        await queryInterface.sequelize.query(`
          UPDATE emergency_contacts
          SET
            "firstName" = CASE
              WHEN "name" IS NOT NULL AND POSITION(' ' IN "name") > 0
              THEN TRIM(SUBSTRING("name" FROM 1 FOR POSITION(' ' IN "name") - 1))
              ELSE "name"
            END,
            "lastName" = CASE
              WHEN "name" IS NOT NULL AND POSITION(' ' IN "name") > 0
              THEN TRIM(SUBSTRING("name" FROM POSITION(' ' IN "name") + 1))
              ELSE ''
            END,
            "phoneNumber" = "primaryPhone"
          WHERE "name" IS NOT NULL OR "primaryPhone" IS NOT NULL
        `, { transaction: migrationTransaction });

        // Set default values for new columns where data migration didn't apply
        await queryInterface.sequelize.query(`
          UPDATE emergency_contacts
          SET
            "verificationStatus" = 'UNVERIFIED',
            "canPickupStudent" = COALESCE("canPickUp", false),
            "notificationChannels" = '[]'
          WHERE "verificationStatus" IS NULL
        `, { transaction: migrationTransaction });

        await migrationTransaction.commit();
        console.log('✓ Successfully migrated emergency contact data');
      } catch (migrationError) {
        await migrationTransaction.rollback();
        throw migrationError;
      }

      console.log('✓ Successfully added missing emergency contact columns');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to add emergency contact columns:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Removing added emergency contact columns...');

      // Remove the new columns
      await queryInterface.removeColumn('emergency_contacts', 'verificationStatus', { transaction });
      await queryInterface.removeColumn('emergency_contacts', 'lastVerifiedAt', { transaction });
      await queryInterface.removeColumn('emergency_contacts', 'notificationChannels', { transaction });
      await queryInterface.removeColumn('emergency_contacts', 'canPickupStudent', { transaction });
      await queryInterface.removeColumn('emergency_contacts', 'firstName', { transaction });
      await queryInterface.removeColumn('emergency_contacts', 'lastName', { transaction });
      await queryInterface.removeColumn('emergency_contacts', 'phoneNumber', { transaction });

      await transaction.commit();
      console.log('✓ Successfully removed added emergency contact columns');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to remove emergency contact columns:', error);
      throw error;
    }
  }
};
