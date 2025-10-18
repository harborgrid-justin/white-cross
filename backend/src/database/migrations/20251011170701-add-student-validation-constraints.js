/**
 * WC-GEN-028 | 20251011170701-add-student-validation-constraints.js - General utility functions and operations
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
 * Migration: Add Student Validation Constraints
 *
 * Adds database-level validation constraints to the students table:
 * - Length constraints on name fields (100 chars)
 * - Length constraints on student number (20 chars)
 * - Length constraints on medical record number (20 chars)
 * - Length constraints on grade field (10 chars)
 * - Length constraints on photo URL (500 chars)
 * - CHECK constraints for data integrity
 * - Additional indexes for optimized queries
 *
 * These constraints enforce data validation at the database level,
 * providing a safety net beyond application-level validation.
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Modify column types to add length constraints
      await queryInterface.changeColumn('students', 'studentNumber', {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      }, { transaction });

      await queryInterface.changeColumn('students', 'firstName', {
        type: Sequelize.STRING(100),
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('students', 'lastName', {
        type: Sequelize.STRING(100),
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('students', 'grade', {
        type: Sequelize.STRING(10),
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('students', 'photo', {
        type: Sequelize.STRING(500),
        allowNull: true,
      }, { transaction });

      await queryInterface.changeColumn('students', 'medicalRecordNum', {
        type: Sequelize.STRING(20),
        allowNull: true,
        unique: true,
      }, { transaction });

      await queryInterface.changeColumn('students', 'nurseId', {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }, { transaction });

      // Add CHECK constraint for date of birth to ensure it's in the past
      // PostgreSQL specific syntax
      await queryInterface.sequelize.query(
        `ALTER TABLE students ADD CONSTRAINT students_dob_in_past
         CHECK ("dateOfBirth" < CURRENT_DATE)`,
        { transaction }
      );

      // Add CHECK constraint to ensure enrollment date is reasonable (after year 2000)
      await queryInterface.sequelize.query(
        `ALTER TABLE students ADD CONSTRAINT students_enrollment_date_valid
         CHECK ("enrollmentDate" >= '2000-01-01' AND "enrollmentDate" <= CURRENT_DATE + INTERVAL '1 year')`,
        { transaction }
      );

      // Add CHECK constraint for student number length (minimum 4 characters)
      await queryInterface.sequelize.query(
        `ALTER TABLE students ADD CONSTRAINT students_student_number_length
         CHECK (LENGTH("studentNumber") >= 4)`,
        { transaction }
      );

      // Add CHECK constraint for medical record number length (minimum 5 characters when provided)
      await queryInterface.sequelize.query(
        `ALTER TABLE students ADD CONSTRAINT students_medical_record_length
         CHECK ("medicalRecordNum" IS NULL OR LENGTH("medicalRecordNum") >= 5)`,
        { transaction }
      );

      await transaction.commit();
      console.log('✓ Student validation constraints added successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to add student validation constraints:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove CHECK constraints
      await queryInterface.sequelize.query(
        `ALTER TABLE students DROP CONSTRAINT IF EXISTS students_medical_record_length`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE students DROP CONSTRAINT IF EXISTS students_student_number_length`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE students DROP CONSTRAINT IF EXISTS students_enrollment_date_valid`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE students DROP CONSTRAINT IF EXISTS students_dob_in_past`,
        { transaction }
      );

      // Revert column types to generic strings (no length constraints)
      await queryInterface.changeColumn('students', 'nurseId', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction });

      await queryInterface.changeColumn('students', 'medicalRecordNum', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      }, { transaction });

      await queryInterface.changeColumn('students', 'photo', {
        type: Sequelize.STRING,
        allowNull: true,
      }, { transaction });

      await queryInterface.changeColumn('students', 'grade', {
        type: Sequelize.STRING,
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('students', 'lastName', {
        type: Sequelize.STRING,
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('students', 'firstName', {
        type: Sequelize.STRING,
        allowNull: false,
      }, { transaction });

      await queryInterface.changeColumn('students', 'studentNumber', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      }, { transaction });

      await transaction.commit();
      console.log('✓ Student validation constraints removed');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to remove student validation constraints:', error);
      throw error;
    }
  }
};
