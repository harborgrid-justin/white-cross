/**
 * LOC: 3F16336DFB
 * WC-GEN-030 | 20251011170703-add-emergency-contact-enhanced-fields.js - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-030 | 20251011170703-add-emergency-contact-enhanced-fields.js - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .js
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Migration: Add Emergency Contact Enhanced Fields
 *
 * Adds advanced communication and verification fields to emergency_contacts:
 * - preferredContactMethod enum (SMS, EMAIL, VOICE, ANY)
 * - verificationStatus enum (UNVERIFIED, PENDING, VERIFIED, FAILED)
 * - lastVerifiedAt timestamp for tracking verification
 * - notificationChannels JSON array for multi-channel communication
 * - canPickupStudent boolean flag for pickup authorization
 * - notes TEXT field for additional information
 *
 * These enhancements support improved emergency communication
 * and contact verification workflows.
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Add preferred contact method enum
      await queryInterface.addColumn('emergency_contacts', 'preferredContactMethod', {
        type: Sequelize.ENUM('SMS', 'EMAIL', 'VOICE', 'ANY'),
        allowNull: true,
        defaultValue: 'ANY',
        comment: 'Preferred method for contacting this emergency contact',
      }, { transaction });

      // Add verification status enum
      await queryInterface.addColumn('emergency_contacts', 'verificationStatus', {
        type: Sequelize.ENUM('UNVERIFIED', 'PENDING', 'VERIFIED', 'FAILED'),
        allowNull: true,
        defaultValue: 'UNVERIFIED',
        comment: 'Status of contact information verification',
      }, { transaction });

      // Add last verified timestamp
      await queryInterface.addColumn('emergency_contacts', 'lastVerifiedAt', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp of last successful verification',
      }, { transaction });

      // Add notification channels as JSON array
      await queryInterface.addColumn('emergency_contacts', 'notificationChannels', {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'JSON array of notification channels (sms, email, voice)',
      }, { transaction });

      // Add pickup authorization flag
      await queryInterface.addColumn('emergency_contacts', 'canPickupStudent', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        comment: 'Whether this contact is authorized to pick up the student',
      }, { transaction });

      // Add notes field
      await queryInterface.addColumn('emergency_contacts', 'notes', {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Additional notes about this emergency contact',
      }, { transaction });

      // Add indexes for new fields
      await queryInterface.addIndex('emergency_contacts', ['verificationStatus'], {
        name: 'emergency_contacts_verification_status_idx',
        transaction,
      });

      await queryInterface.addIndex('emergency_contacts', ['canPickupStudent'], {
        name: 'emergency_contacts_can_pickup_idx',
        transaction,
      });

      await queryInterface.addIndex('emergency_contacts', ['lastVerifiedAt'], {
        name: 'emergency_contacts_last_verified_idx',
        transaction,
      });

      await transaction.commit();
      console.log('✓ Emergency contact enhanced fields added successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to add emergency contact enhanced fields:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove indexes
      await queryInterface.removeIndex('emergency_contacts', 'emergency_contacts_last_verified_idx', { transaction });
      await queryInterface.removeIndex('emergency_contacts', 'emergency_contacts_can_pickup_idx', { transaction });
      await queryInterface.removeIndex('emergency_contacts', 'emergency_contacts_verification_status_idx', { transaction });

      // Remove columns
      await queryInterface.removeColumn('emergency_contacts', 'notes', { transaction });
      await queryInterface.removeColumn('emergency_contacts', 'canPickupStudent', { transaction });
      await queryInterface.removeColumn('emergency_contacts', 'notificationChannels', { transaction });
      await queryInterface.removeColumn('emergency_contacts', 'lastVerifiedAt', { transaction });
      await queryInterface.removeColumn('emergency_contacts', 'verificationStatus', { transaction });
      await queryInterface.removeColumn('emergency_contacts', 'preferredContactMethod', { transaction });

      // Drop enum types (PostgreSQL specific)
      await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "enum_emergency_contacts_verificationStatus"`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `DROP TYPE IF EXISTS "enum_emergency_contacts_preferredContactMethod"`,
        { transaction }
      );

      await transaction.commit();
      console.log('✓ Emergency contact enhanced fields removed');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to remove emergency contact enhanced fields:', error);
      throw error;
    }
  }
};
