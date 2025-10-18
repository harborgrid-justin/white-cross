/**
 * LOC: 70BDB3C415
 * WC-GEN-026 | 20250111000000-add-medication-enhanced-fields.js - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-026 | 20250111000000-add-medication-enhanced-fields.js - General utility functions and operations
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
 * Migration: Add Enhanced Medication Fields
 *
 * Adds healthcare-specific validation fields to medication tables:
 * - DEA Schedule classification for controlled substances
 * - Witness requirements for Schedule I-II medications
 * - Prescription tracking fields
 * - Five Rights validation fields in medication logs
 *
 * These enhancements support full medication safety protocols
 * and regulatory compliance requirements.
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add fields to medications table
    await queryInterface.addColumn('medications', 'deaSchedule', {
      type: Sequelize.STRING(3),
      allowNull: true,
      comment: 'DEA Schedule classification for controlled substances (I-V)',
    });

    await queryInterface.addColumn('medications', 'requiresWitness', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether medication administration requires a witness (typically Schedule I-II)',
    });

    // Add index for deaSchedule
    await queryInterface.addIndex('medications', ['deaSchedule'], {
      name: 'medications_dea_schedule_idx',
    });

    // Add fields to student_medications table
    await queryInterface.addColumn('student_medications', 'prescriptionNumber', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Prescription number for tracking and verification',
    });

    await queryInterface.addColumn('student_medications', 'refillsRemaining', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: 'Number of refills remaining for this prescription',
    });

    // Add fields to medication_logs table for Five Rights validation
    await queryInterface.addColumn('medication_logs', 'deviceId', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Device ID used for administration (for idempotency)',
    });

    await queryInterface.addColumn('medication_logs', 'witnessId', {
      type: Sequelize.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      comment: 'User ID of witness (required for controlled substances Schedule I-II)',
    });

    await queryInterface.addColumn('medication_logs', 'witnessName', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Name of witness who verified administration',
    });

    await queryInterface.addColumn('medication_logs', 'patientVerified', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether patient identity was verified (Right Patient)',
    });

    await queryInterface.addColumn('medication_logs', 'allergyChecked', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether allergies were checked before administration',
    });

    // Add index for witnessId for performance
    await queryInterface.addIndex('medication_logs', ['witnessId'], {
      name: 'medication_logs_witness_id_idx',
    });

    console.log('✓ Enhanced medication fields added successfully');
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex('medications', 'medications_dea_schedule_idx');
    await queryInterface.removeIndex('medication_logs', 'medication_logs_witness_id_idx');

    // Remove fields from medication_logs
    await queryInterface.removeColumn('medication_logs', 'allergyChecked');
    await queryInterface.removeColumn('medication_logs', 'patientVerified');
    await queryInterface.removeColumn('medication_logs', 'witnessName');
    await queryInterface.removeColumn('medication_logs', 'witnessId');
    await queryInterface.removeColumn('medication_logs', 'deviceId');

    // Remove fields from student_medications
    await queryInterface.removeColumn('student_medications', 'refillsRemaining');
    await queryInterface.removeColumn('student_medications', 'prescriptionNumber');

    // Remove fields from medications
    await queryInterface.removeColumn('medications', 'requiresWitness');
    await queryInterface.removeColumn('medications', 'deaSchedule');

    console.log('✓ Enhanced medication fields removed');
  }
};
