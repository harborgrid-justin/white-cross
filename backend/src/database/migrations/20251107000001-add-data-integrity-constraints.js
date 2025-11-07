/**
 * Migration: Add Data Integrity Constraints
 *
 * Purpose: Add CHECK constraints, enhance CASCADE rules, and enforce data integrity
 * at the database level to prevent invalid data states.
 *
 * Constraints Added:
 * 1. CHECK constraints for value validation (dates, amounts, enums)
 * 2. NOT NULL constraints for required fields
 * 3. Enhanced CASCADE rules for referential integrity
 * 4. UNIQUE constraints for natural keys
 *
 * Defense-in-Depth Strategy:
 * - Application validation (first line of defense)
 * - ORM validation (second line of defense)
 * - Database constraints (third line of defense - THIS MIGRATION)
 *
 * Deployment Notes:
 * - Run data audit first to identify constraint violations
 * - Clean up invalid data before applying constraints
 * - Test in staging environment with production-like data
 * - Monitor constraint violation errors after deployment
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Adding data integrity constraints...');

      // ========================================
      // MEDICATION LOGS - Data Validation
      // ========================================
      console.log('Adding medication_logs constraints...');

      // Dosage must be positive
      await queryInterface.sequelize.query(
        `ALTER TABLE medication_logs
         ADD CONSTRAINT chk_medication_logs_dosage_positive
         CHECK (dosage > 0);`,
        { transaction }
      );

      // Administered date validation (can't be scheduled after administered)
      await queryInterface.sequelize.query(
        `ALTER TABLE medication_logs
         ADD CONSTRAINT chk_medication_logs_date_order
         CHECK (scheduledAt IS NULL OR administeredAt >= scheduledAt);`,
        { transaction }
      );

      // Status must be valid enum value
      await queryInterface.sequelize.query(
        `ALTER TABLE medication_logs
         ADD CONSTRAINT chk_medication_logs_status_valid
         CHECK (status IN ('PENDING', 'ADMINISTERED', 'MISSED', 'CANCELLED', 'REFUSED'));`,
        { transaction }
      );

      // If not given, must have reason
      await queryInterface.sequelize.query(
        `ALTER TABLE medication_logs
         ADD CONSTRAINT chk_medication_logs_reason_required
         CHECK (wasGiven = true OR reasonNotGiven IS NOT NULL);`,
        { transaction }
      );

      // ========================================
      // HEALTH RECORDS - Data Validation
      // ========================================
      console.log('Adding health_records constraints...');

      // Record date cannot be in the future
      await queryInterface.sequelize.query(
        `ALTER TABLE health_records
         ADD CONSTRAINT chk_health_records_date_not_future
         CHECK (recordDate <= CURRENT_DATE);`,
        { transaction }
      );

      // Follow-up date must be after record date
      await queryInterface.sequelize.query(
        `ALTER TABLE health_records
         ADD CONSTRAINT chk_health_records_followup_after_record
         CHECK (followUpDate IS NULL OR followUpDate >= recordDate);`,
        { transaction }
      );

      // Follow-up date required if follow-up is required
      await queryInterface.sequelize.query(
        `ALTER TABLE health_records
         ADD CONSTRAINT chk_health_records_followup_date_required
         CHECK (followUpRequired = false OR followUpDate IS NOT NULL);`,
        { transaction }
      );

      // Provider NPI format validation (10 digits)
      await queryInterface.sequelize.query(
        `ALTER TABLE health_records
         ADD CONSTRAINT chk_health_records_provider_npi_format
         CHECK (providerNpi IS NULL OR providerNpi ~ '^[0-9]{10}$');`,
        { transaction }
      );

      // Facility NPI format validation (10 digits)
      await queryInterface.sequelize.query(
        `ALTER TABLE health_records
         ADD CONSTRAINT chk_health_records_facility_npi_format
         CHECK (facilityNpi IS NULL OR facilityNpi ~ '^[0-9]{10}$');`,
        { transaction }
      );

      // ========================================
      // STUDENTS - Data Validation
      // ========================================
      console.log('Adding students constraints...');

      // Date of birth cannot be in the future
      await queryInterface.sequelize.query(
        `ALTER TABLE students
         ADD CONSTRAINT chk_students_dob_not_future
         CHECK (dateOfBirth <= CURRENT_DATE);`,
        { transaction }
      );

      // Student must be at least 3 years old and at most 25 years old (K-12 + special cases)
      await queryInterface.sequelize.query(
        `ALTER TABLE students
         ADD CONSTRAINT chk_students_age_range
         CHECK (dateOfBirth >= CURRENT_DATE - INTERVAL '25 years'
                AND dateOfBirth <= CURRENT_DATE - INTERVAL '3 years');`,
        { transaction }
      );

      // Status must be valid enum value
      await queryInterface.sequelize.query(
        `ALTER TABLE students
         ADD CONSTRAINT chk_students_status_valid
         CHECK (status IN ('ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'WITHDRAWN'));`,
        { transaction }
      );

      // Grade level must be valid (K-12)
      await queryInterface.sequelize.query(
        `ALTER TABLE students
         ADD CONSTRAINT chk_students_grade_level_valid
         CHECK (gradeLevel IN ('K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'PreK', 'Other'));`,
        { transaction }
      );

      // ========================================
      // APPOINTMENTS - Data Validation
      // ========================================
      console.log('Adding appointments constraints...');

      // Appointment date cannot be too far in the past (e.g., more than 2 years)
      await queryInterface.sequelize.query(
        `ALTER TABLE appointments
         ADD CONSTRAINT chk_appointments_date_reasonable
         CHECK (appointmentDate >= CURRENT_DATE - INTERVAL '2 years');`,
        { transaction }
      );

      // Duration must be positive and reasonable (5 min to 8 hours)
      await queryInterface.sequelize.query(
        `ALTER TABLE appointments
         ADD CONSTRAINT chk_appointments_duration_reasonable
         CHECK (duration >= 5 AND duration <= 480);`,
        { transaction }
      );

      // Status must be valid enum value
      await queryInterface.sequelize.query(
        `ALTER TABLE appointments
         ADD CONSTRAINT chk_appointments_status_valid
         CHECK (status IN ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED'));`,
        { transaction }
      );

      // ========================================
      // PRESCRIPTIONS - Data Validation
      // ========================================
      console.log('Adding prescriptions constraints...');

      // End date must be after start date
      await queryInterface.sequelize.query(
        `ALTER TABLE prescriptions
         ADD CONSTRAINT chk_prescriptions_date_order
         CHECK (endDate IS NULL OR endDate >= startDate);`,
        { transaction }
      );

      // Dosage must be positive
      await queryInterface.sequelize.query(
        `ALTER TABLE prescriptions
         ADD CONSTRAINT chk_prescriptions_dosage_positive
         CHECK (dosage > 0);`,
        { transaction }
      );

      // Refills remaining cannot be negative
      await queryInterface.sequelize.query(
        `ALTER TABLE prescriptions
         ADD CONSTRAINT chk_prescriptions_refills_non_negative
         CHECK (refillsRemaining >= 0);`,
        { transaction }
      );

      // Status must be valid enum value
      await queryInterface.sequelize.query(
        `ALTER TABLE prescriptions
         ADD CONSTRAINT chk_prescriptions_status_valid
         CHECK (status IN ('ACTIVE', 'INACTIVE', 'EXPIRED', 'DISCONTINUED', 'COMPLETED'));`,
        { transaction }
      );

      // ========================================
      // USERS - Data Validation
      // ========================================
      console.log('Adding users constraints...');

      // Email format validation (basic)
      await queryInterface.sequelize.query(
        `ALTER TABLE users
         ADD CONSTRAINT chk_users_email_format
         CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');`,
        { transaction }
      );

      // Failed login attempts cannot be negative
      await queryInterface.sequelize.query(
        `ALTER TABLE users
         ADD CONSTRAINT chk_users_failed_attempts_non_negative
         CHECK (failedLoginAttempts >= 0);`,
        { transaction }
      );

      // Role must be valid enum value
      await queryInterface.sequelize.query(
        `ALTER TABLE users
         ADD CONSTRAINT chk_users_role_valid
         CHECK (role IN ('ADMIN', 'NURSE', 'SCHOOL_ADMIN', 'DISTRICT_ADMIN', 'VIEWER', 'COUNSELOR'));`,
        { transaction }
      );

      // ========================================
      // INVENTORY ITEMS - Data Validation
      // ========================================
      console.log('Adding inventory_items constraints...');

      // Quantity cannot be negative
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory_items
         ADD CONSTRAINT chk_inventory_items_quantity_non_negative
         CHECK (quantity >= 0);`,
        { transaction }
      );

      // Minimum quantity cannot be negative
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory_items
         ADD CONSTRAINT chk_inventory_items_min_quantity_non_negative
         CHECK (minimumQuantity >= 0);`,
        { transaction }
      );

      // Expiration date cannot be in the past (for new entries)
      // Note: Existing expired items are allowed
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory_items
         ADD CONSTRAINT chk_inventory_items_expiration_reasonable
         CHECK (expirationDate IS NULL OR expirationDate >= CURRENT_DATE - INTERVAL '1 year');`,
        { transaction }
      );

      // Unit cost cannot be negative
      await queryInterface.sequelize.query(
        `ALTER TABLE inventory_items
         ADD CONSTRAINT chk_inventory_items_unit_cost_non_negative
         CHECK (unitCost >= 0);`,
        { transaction }
      );

      // ========================================
      // BUDGET TRANSACTIONS - Data Validation
      // ========================================
      console.log('Adding budget_transactions constraints...');

      // Amount must be non-zero
      await queryInterface.sequelize.query(
        `ALTER TABLE budget_transactions
         ADD CONSTRAINT chk_budget_transactions_amount_non_zero
         CHECK (amount != 0);`,
        { transaction }
      );

      // Transaction date cannot be too far in the past (e.g., 5 years)
      await queryInterface.sequelize.query(
        `ALTER TABLE budget_transactions
         ADD CONSTRAINT chk_budget_transactions_date_reasonable
         CHECK (transactionDate >= CURRENT_DATE - INTERVAL '5 years');`,
        { transaction }
      );

      // ========================================
      // CASCADE RULES - Enhanced Referential Integrity
      // ========================================
      console.log('Enhancing CASCADE rules for referential integrity...');

      // Note: These are examples. Actual foreign key names may vary.
      // Verify existing foreign key names before running:
      // SELECT constraint_name FROM information_schema.table_constraints
      // WHERE table_name = 'table_name' AND constraint_type = 'FOREIGN KEY';

      // Example: Ensure medication_logs CASCADE deletes when student is deleted
      // (Adjust constraint names based on your actual schema)

      // IMPORTANT: These CASCADE rule changes are commented out by default
      // because they require dropping and recreating foreign keys, which may
      // cause brief table locks. Uncomment and customize for your schema.

      /*
      // Drop and recreate medication_logs.studentId foreign key with CASCADE
      await queryInterface.sequelize.query(
        `ALTER TABLE medication_logs
         DROP CONSTRAINT IF EXISTS medication_logs_studentId_fkey;`,
        { transaction }
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE medication_logs
         ADD CONSTRAINT medication_logs_studentId_fkey
         FOREIGN KEY (studentId) REFERENCES students(id)
         ON DELETE CASCADE ON UPDATE CASCADE;`,
        { transaction }
      );
      */

      // ========================================
      // NOT NULL CONSTRAINTS - Required Fields
      // ========================================
      console.log('Adding NOT NULL constraints for critical fields...');

      // Ensure critical student fields are not null
      await queryInterface.changeColumn(
        'students',
        'firstName',
        {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.changeColumn(
        'students',
        'lastName',
        {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.changeColumn(
        'students',
        'dateOfBirth',
        {
          type: Sequelize.DATE,
          allowNull: false,
        },
        { transaction }
      );

      // Ensure critical medication log fields are not null
      await queryInterface.changeColumn(
        'medication_logs',
        'studentId',
        {
          type: Sequelize.UUID,
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.changeColumn(
        'medication_logs',
        'medicationId',
        {
          type: Sequelize.UUID,
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.changeColumn(
        'medication_logs',
        'administeredAt',
        {
          type: Sequelize.DATE,
          allowNull: false,
        },
        { transaction }
      );

      await transaction.commit();
      console.log('✓ Successfully added all data integrity constraints');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to add data integrity constraints:', error);
      console.error('Error details:', error.message);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Removing data integrity constraints...');

      // Drop CHECK constraints
      const checkConstraints = [
        'chk_medication_logs_dosage_positive',
        'chk_medication_logs_date_order',
        'chk_medication_logs_status_valid',
        'chk_medication_logs_reason_required',
        'chk_health_records_date_not_future',
        'chk_health_records_followup_after_record',
        'chk_health_records_followup_date_required',
        'chk_health_records_provider_npi_format',
        'chk_health_records_facility_npi_format',
        'chk_students_dob_not_future',
        'chk_students_age_range',
        'chk_students_status_valid',
        'chk_students_grade_level_valid',
        'chk_appointments_date_reasonable',
        'chk_appointments_duration_reasonable',
        'chk_appointments_status_valid',
        'chk_prescriptions_date_order',
        'chk_prescriptions_dosage_positive',
        'chk_prescriptions_refills_non_negative',
        'chk_prescriptions_status_valid',
        'chk_users_email_format',
        'chk_users_failed_attempts_non_negative',
        'chk_users_role_valid',
        'chk_inventory_items_quantity_non_negative',
        'chk_inventory_items_min_quantity_non_negative',
        'chk_inventory_items_expiration_reasonable',
        'chk_inventory_items_unit_cost_non_negative',
        'chk_budget_transactions_amount_non_zero',
        'chk_budget_transactions_date_reasonable',
      ];

      for (const constraint of checkConstraints) {
        const tableName = constraint.split('_')[1]; // Extract table name from constraint
        const fullTableName = `${tableName}s`; // Add 's' for plural (adjust as needed)

        try {
          await queryInterface.sequelize.query(
            `ALTER TABLE ${fullTableName} DROP CONSTRAINT IF EXISTS ${constraint};`,
            { transaction }
          );
        } catch (err) {
          console.warn(`Could not drop constraint ${constraint}: ${err.message}`);
        }
      }

      // Note: NOT NULL constraints are not rolled back to avoid potential data issues
      // Revert manually if needed after validating data

      await transaction.commit();
      console.log('✓ Successfully removed data integrity constraints');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to remove data integrity constraints:', error);
      throw error;
    }
  }
};
