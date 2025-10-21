/**
 * LOC: EC9B2B1795
 * WC-GEN-148 | 20251009011130-add-administration-features.js - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-148 | 20251009011130-add-administration-features.js - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: None
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .js
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

'use strict';

/**
 * Add Administration Features
 *
 * This migration enhances district and school management capabilities:
 * - Adds additional fields to districts table (description, phoneNumber, status, superintendent)
 * - Adds additional fields to schools table (phoneNumber, principalName, schoolType, status, totalEnrollment)
 * - Adds school and district assignment to users table
 *
 * Corresponds to Prisma migration: 20251009011130_add_administration_features
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // =====================================================
      // STEP 1: Alter districts table
      // =====================================================

      await queryInterface.addColumn('districts', 'description', {
        type: Sequelize.TEXT,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('districts', 'phoneNumber', {
        type: Sequelize.TEXT,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('districts', 'status', {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'Active'
      }, { transaction });

      await queryInterface.addColumn('districts', 'superintendent', {
        type: Sequelize.TEXT,
        allowNull: true
      }, { transaction });

      // =====================================================
      // STEP 2: Alter schools table
      // =====================================================

      await queryInterface.addColumn('schools', 'phoneNumber', {
        type: Sequelize.TEXT,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('schools', 'principalName', {
        type: Sequelize.TEXT,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('schools', 'schoolType', {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: 'Elementary'
      }, { transaction });

      await queryInterface.addColumn('schools', 'status', {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: 'Active'
      }, { transaction });

      await queryInterface.addColumn('schools', 'totalEnrollment', {
        type: Sequelize.INTEGER,
        allowNull: true
      }, { transaction });

      // =====================================================
      // STEP 3: Alter users table - add school and district assignments
      // =====================================================

      await queryInterface.addColumn('users', 'schoolId', {
        type: Sequelize.TEXT,
        allowNull: true,
        references: {
          model: 'schools',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }, { transaction });

      await queryInterface.addColumn('users', 'districtId', {
        type: Sequelize.TEXT,
        allowNull: true,
        references: {
          model: 'districts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }, { transaction });

      // =====================================================
      // STEP 4: Create indexes for performance
      // =====================================================

      await queryInterface.addIndex('users', ['schoolId'], {
        name: 'users_schoolId_idx',
        transaction
      });

      await queryInterface.addIndex('users', ['districtId'], {
        name: 'users_districtId_idx',
        transaction
      });

      await transaction.commit();
      console.log('✓ Administration features added successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove indexes first
      await queryInterface.removeIndex('users', 'users_schoolId_idx', { transaction });
      await queryInterface.removeIndex('users', 'users_districtId_idx', { transaction });

      // Remove foreign keys and columns from users
      await queryInterface.removeColumn('users', 'districtId', { transaction });
      await queryInterface.removeColumn('users', 'schoolId', { transaction });

      // Remove columns from schools
      await queryInterface.removeColumn('schools', 'totalEnrollment', { transaction });
      await queryInterface.removeColumn('schools', 'status', { transaction });
      await queryInterface.removeColumn('schools', 'schoolType', { transaction });
      await queryInterface.removeColumn('schools', 'principalName', { transaction });
      await queryInterface.removeColumn('schools', 'phoneNumber', { transaction });

      // Remove columns from districts
      await queryInterface.removeColumn('districts', 'superintendent', { transaction });
      await queryInterface.removeColumn('districts', 'status', { transaction });
      await queryInterface.removeColumn('districts', 'phoneNumber', { transaction });
      await queryInterface.removeColumn('districts', 'description', { transaction });

      await transaction.commit();
      console.log('✓ Rollback completed successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Rollback failed:', error);
      throw error;
    }
  }
};
