/**
 * Migration: Add Critical Performance Indexes
 *
 * Purpose: Add composite and single-column indexes to improve query performance
 * for frequently accessed patterns identified in code review.
 *
 * Priority Indexes:
 * 1. medication_logs(studentId, administeredAt DESC, status) - Medication audit queries
 * 2. health_records composite indexes - Student health record queries
 * 3. Missing foreign key indexes across tables
 *
 * Performance Impact:
 * - Expected 50-70% reduction in query time for medication log queries
 * - Eliminates full table scans on large datasets
 * - Improves JOIN performance for foreign key relationships
 *
 * Deployment Notes:
 * - Use CREATE INDEX CONCURRENTLY for production (PostgreSQL)
 * - May require maintenance window for MySQL on large tables
 * - Monitor index creation progress and disk space
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Use a transaction for all index creations
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Adding critical performance indexes...');

      // ========================================
      // PRIORITY 1: Medication Logs Composite Index
      // ========================================
      // Query Pattern: SELECT * FROM medication_logs
      //   WHERE studentId = ? AND status IN (?)
      //   ORDER BY administeredAt DESC
      // Impact: Medication audit reports, student medication history
      console.log('Creating medication_logs composite index (studentId, administeredAt DESC, status)...');
      await queryInterface.addIndex(
        'medication_logs',
        ['studentId', 'administeredAt', 'status'],
        {
          name: 'idx_medication_logs_student_date_status',
          using: 'BTREE',
          transaction
        }
      );

      // Alternative query pattern: status filter first, then date range
      console.log('Creating medication_logs composite index (status, studentId, administeredAt DESC)...');
      await queryInterface.addIndex(
        'medication_logs',
        ['status', 'studentId', 'administeredAt'],
        {
          name: 'idx_medication_logs_status_student_date',
          using: 'BTREE',
          transaction
        }
      );

      // ========================================
      // PRIORITY 2: Medication Logs - Scheduled vs Administered Queries
      // ========================================
      // Query Pattern: Find missed/late medications
      console.log('Creating medication_logs index for scheduled queries...');
      await queryInterface.addIndex(
        'medication_logs',
        ['scheduledAt', 'status'],
        {
          name: 'idx_medication_logs_scheduled_status',
          using: 'BTREE',
          transaction
        }
      );

      // ========================================
      // PRIORITY 3: Health Records - Additional Query Patterns
      // ========================================
      // Note: health_records already has many indexes, adding remaining patterns

      // Query Pattern: Find records by student and follow-up status
      console.log('Creating health_records index for follow-up queries...');
      await queryInterface.addIndex(
        'health_records',
        ['studentId', 'followUpRequired', 'followUpCompleted', 'followUpDate'],
        {
          name: 'idx_health_records_student_followup_status',
          using: 'BTREE',
          transaction
        }
      );

      // Query Pattern: Filter by record type and date range for reporting
      // (Already exists but adding status-based variant)
      console.log('Creating health_records index for confidential record queries...');
      await queryInterface.addIndex(
        'health_records',
        ['isConfidential', 'recordDate'],
        {
          name: 'idx_health_records_confidential_date',
          using: 'BTREE',
          transaction
        }
      );

      // ========================================
      // PRIORITY 4: Foreign Key Indexes Audit
      // ========================================
      // Ensure all foreign keys have supporting indexes

      // Students table - parent foreign keys
      console.log('Verifying student foreign key indexes...');
      // schoolId already indexed
      // grade for filtering (corrected column name)
      await queryInterface.addIndex(
        'students',
        ['grade'],
        {
          name: 'idx_students_grade',
          using: 'BTREE',
          transaction
        }
      );

      // Student isActive for active/inactive filtering (corrected column name)
      await queryInterface.addIndex(
        'students',
        ['isActive'],
        {
          name: 'idx_students_is_active',
          using: 'BTREE',
          transaction
        }
      );

      // Composite for common query: active students by school and grade
      await queryInterface.addIndex(
        'students',
        ['schoolId', 'isActive', 'grade'],
        {
          name: 'idx_students_school_active_grade',
          using: 'BTREE',
          transaction
        }
      );

      // ========================================
      // PRIORITY 5: Appointments - Query Optimization
      // ========================================
      console.log('Adding appointment query indexes...');

      // Query Pattern: Appointments by student and date range
      // Check if index already exists before creating
      try {
        await queryInterface.addIndex(
          'appointments',
          ['studentId', 'scheduledAt', 'status'],
          {
            name: 'idx_appointments_student_scheduled_status',
            using: 'BTREE',
            transaction
          }
        );
      } catch (error) {
        if (!error.message.includes('already exists')) {
          throw error;
        }
        console.log('Index idx_appointments_student_scheduled_status already exists, skipping...');
      }

      // Query Pattern: Nurse schedule view
      // Check if index already exists before creating  
      try {
        await queryInterface.addIndex(
          'appointments',
          ['nurseId', 'scheduledAt', 'status'],
          {
            name: 'idx_appointments_nurse_scheduled_status',
            using: 'BTREE',
            transaction
          }
        );
      } catch (error) {
        if (!error.message.includes('already exists')) {
          throw error;
        }
        console.log('Index idx_appointments_nurse_scheduled_status already exists, skipping...');
      }

      // ========================================
      // PRIORITY 6: Clinical Notes - Query Optimization
      // ========================================
      console.log('Adding clinical notes query indexes...');

      // Query Pattern: Notes by student and date
      await queryInterface.addIndex(
        'clinical_notes',
        ['studentId', 'noteDate'],
        {
          name: 'idx_clinical_notes_student_date',
          using: 'BTREE',
          transaction
        }
      );

      // Query Pattern: Notes by creator (for audit/review)
      await queryInterface.addIndex(
        'clinical_notes',
        ['createdBy', 'noteDate'],
        {
          name: 'idx_clinical_notes_creator_date',
          using: 'BTREE',
          transaction
        }
      );

      // ========================================
      // PRIORITY 7: Prescriptions - Query Optimization
      // ========================================
      console.log('Adding prescription query indexes...');

      // Query Pattern: Active prescriptions by student
      await queryInterface.addIndex(
        'prescriptions',
        ['studentId', 'status', 'endDate'],
        {
          name: 'idx_prescriptions_student_status_end',
          using: 'BTREE',
          transaction
        }
      );

      // Query Pattern: Expiring prescriptions
      await queryInterface.addIndex(
        'prescriptions',
        ['status', 'endDate'],
        {
          name: 'idx_prescriptions_status_end_date',
          using: 'BTREE',
          transaction
        }
      );

      // ========================================
      // PRIORITY 8: Audit Logs - Query Optimization
      // ========================================
      console.log('Adding audit log query indexes...');

      // Query Pattern: Audit by user and date range
      await queryInterface.addIndex(
        'audit_logs',
        ['userId', 'timestamp'],
        {
          name: 'idx_audit_logs_user_timestamp',
          using: 'BTREE',
          transaction
        }
      );

      // Query Pattern: Audit by action type
      await queryInterface.addIndex(
        'audit_logs',
        ['action', 'timestamp'],
        {
          name: 'idx_audit_logs_action_timestamp',
          using: 'BTREE',
          transaction
        }
      );

      // Query Pattern: PHI access audit
      await queryInterface.addIndex(
        'audit_logs',
        ['resourceType', 'resourceId', 'timestamp'],
        {
          name: 'idx_audit_logs_resource_timestamp',
          using: 'BTREE',
          transaction
        }
      );

      await transaction.commit();
      console.log('✓ Successfully added all critical performance indexes');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to add performance indexes:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('Removing critical performance indexes...');

      // Remove indexes in reverse order
      await queryInterface.removeIndex('audit_logs', 'idx_audit_logs_resource_timestamp', { transaction });
      await queryInterface.removeIndex('audit_logs', 'idx_audit_logs_action_timestamp', { transaction });
      await queryInterface.removeIndex('audit_logs', 'idx_audit_logs_user_timestamp', { transaction });

      await queryInterface.removeIndex('prescriptions', 'idx_prescriptions_status_end_date', { transaction });
      await queryInterface.removeIndex('prescriptions', 'idx_prescriptions_student_status_end', { transaction });

      await queryInterface.removeIndex('clinical_notes', 'idx_clinical_notes_creator_date', { transaction });
      await queryInterface.removeIndex('clinical_notes', 'idx_clinical_notes_student_date', { transaction });

      await queryInterface.removeIndex('appointments', 'idx_appointments_nurse_scheduled_status', { transaction });
      await queryInterface.removeIndex('appointments', 'idx_appointments_student_scheduled_status', { transaction });

      await queryInterface.removeIndex('students', 'idx_students_school_active_grade', { transaction });
      await queryInterface.removeIndex('students', 'idx_students_is_active', { transaction });
      await queryInterface.removeIndex('students', 'idx_students_grade', { transaction });

      await queryInterface.removeIndex('health_records', 'idx_health_records_confidential_date', { transaction });
      await queryInterface.removeIndex('health_records', 'idx_health_records_student_followup_status', { transaction });

      await queryInterface.removeIndex('medication_logs', 'idx_medication_logs_scheduled_status', { transaction });
      await queryInterface.removeIndex('medication_logs', 'idx_medication_logs_status_student_date', { transaction });
      await queryInterface.removeIndex('medication_logs', 'idx_medication_logs_student_date_status', { transaction });

      await transaction.commit();
      console.log('✓ Successfully removed all critical performance indexes');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to remove performance indexes:', error);
      throw error;
    }
  }
};
