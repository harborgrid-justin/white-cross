/**
 * Migration: Add Performance Indexes
 * Created: 2025-10-25
 *
 * @description Adds critical database indexes for query performance optimization
 * Based on comprehensive CRUD audit findings.
 *
 * Indexes Added:
 * 1. users.email - Fast user lookup by email (authentication)
 * 2. emergency_contacts.studentId - Fast emergency contact retrieval
 * 3. health_records.studentId - Fast health record queries
 * 4. appointments.studentId - Fast appointment lookup by student
 * 5. appointments.nurseId - Fast appointment lookup by nurse
 * 6. appointments.scheduledDate - Fast date-based queries
 * 7. sessions.userId - Fast session lookup by user
 * 8. sessions.token - Fast session validation
 * 9. documents.studentId - Fast document retrieval by student
 * 10. documents.uploadedBy - Fast audit queries by uploader
 * 11. audit_logs.userId - Fast audit trail queries
 * 12. audit_logs.timestamp - Fast time-based audit queries
 *
 * @performance Significantly improves query performance for common access patterns
 * @security Faster authentication and session validation
 * @compliance Faster audit log retrieval for compliance reporting
 */

'use strict';

module.exports = {
  /**
   * Add performance indexes
   */
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Users table indexes
      console.log('Adding index: users.email');
      await queryInterface.addIndex('users', ['email'], {
        name: 'idx_users_email',
        unique: true,
        transaction
      });

      // 2. Emergency Contacts table indexes
      console.log('Adding index: emergency_contacts.studentId');
      await queryInterface.addIndex('emergency_contacts', ['studentId'], {
        name: 'idx_emergency_contacts_student_id',
        transaction
      });

      // 3. Health Records table indexes
      console.log('Adding index: health_records.studentId');
      await queryInterface.addIndex('health_records', ['studentId'], {
        name: 'idx_health_records_student_id',
        transaction
      });

      // 4. Appointments table indexes
      console.log('Adding index: appointments.studentId');
      await queryInterface.addIndex('appointments', ['studentId'], {
        name: 'idx_appointments_student_id',
        transaction
      });

      console.log('Adding index: appointments.nurseId');
      await queryInterface.addIndex('appointments', ['nurseId'], {
        name: 'idx_appointments_nurse_id',
        transaction
      });

      console.log('Adding index: appointments.scheduledDate');
      await queryInterface.addIndex('appointments', ['scheduledDate'], {
        name: 'idx_appointments_scheduled_date',
        transaction
      });

      // 5. Sessions table indexes
      console.log('Adding index: sessions.userId');
      await queryInterface.addIndex('sessions', ['userId'], {
        name: 'idx_sessions_user_id',
        transaction
      });

      console.log('Adding index: sessions.token');
      await queryInterface.addIndex('sessions', ['token'], {
        name: 'idx_sessions_token',
        unique: true,
        transaction
      });

      // 6. Documents table indexes
      console.log('Adding index: documents.studentId');
      await queryInterface.addIndex('documents', ['studentId'], {
        name: 'idx_documents_student_id',
        transaction
      });

      console.log('Adding index: documents.uploadedBy');
      await queryInterface.addIndex('documents', ['uploadedBy'], {
        name: 'idx_documents_uploaded_by',
        transaction
      });

      // 7. Audit Logs table indexes (if table exists)
      const tables = await queryInterface.showAllTables();
      if (tables.includes('audit_logs') || tables.includes('AuditLogs')) {
        const auditTableName = tables.includes('audit_logs') ? 'audit_logs' : 'AuditLogs';

        console.log(`Adding index: ${auditTableName}.userId`);
        await queryInterface.addIndex(auditTableName, ['userId'], {
          name: 'idx_audit_logs_user_id',
          transaction
        });

        console.log(`Adding index: ${auditTableName}.timestamp`);
        await queryInterface.addIndex(auditTableName, ['timestamp'], {
          name: 'idx_audit_logs_timestamp',
          transaction
        });
      }

      // Composite indexes for common query patterns
      console.log('Adding composite index: appointments(studentId, scheduledDate)');
      await queryInterface.addIndex('appointments', ['studentId', 'scheduledDate'], {
        name: 'idx_appointments_student_date',
        transaction
      });

      await transaction.commit();
      console.log('✓ All performance indexes added successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Error adding indexes:', error);
      throw error;
    }
  },

  /**
   * Remove performance indexes
   */
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove indexes in reverse order
      const indexes = [
        { table: 'appointments', name: 'idx_appointments_student_date' },
        { table: 'audit_logs', name: 'idx_audit_logs_timestamp' },
        { table: 'audit_logs', name: 'idx_audit_logs_user_id' },
        { table: 'documents', name: 'idx_documents_uploaded_by' },
        { table: 'documents', name: 'idx_documents_student_id' },
        { table: 'sessions', name: 'idx_sessions_token' },
        { table: 'sessions', name: 'idx_sessions_user_id' },
        { table: 'appointments', name: 'idx_appointments_scheduled_date' },
        { table: 'appointments', name: 'idx_appointments_nurse_id' },
        { table: 'appointments', name: 'idx_appointments_student_id' },
        { table: 'health_records', name: 'idx_health_records_student_id' },
        { table: 'emergency_contacts', name: 'idx_emergency_contacts_student_id' },
        { table: 'users', name: 'idx_users_email' }
      ];

      for (const index of indexes) {
        try {
          console.log(`Removing index: ${index.name}`);
          await queryInterface.removeIndex(index.table, index.name, { transaction });
        } catch (error) {
          console.warn(`Warning: Could not remove index ${index.name}:`, error.message);
          // Continue with other indexes even if one fails
        }
      }

      await transaction.commit();
      console.log('✓ All performance indexes removed');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Error removing indexes:', error);
      throw error;
    }
  }
};
