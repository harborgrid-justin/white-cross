/**
 * Migration: Add Additional Performance Indexes
 * Created: 2025-10-25
 *
 * @description Adds comprehensive indexes for remaining tables to optimize query performance
 *
 * Indexes Added:
 * - medications (name, category, studentId, expirationDate, isActive)
 * - health_records (type, recordedAt, isActive)
 * - emergency_contacts (relationship, isPrimary, isActive)
 * - students (lastName, firstName, grade, status, enrollmentDate)
 * - contacts (email, phone, type)
 * - inventory_items (name, category, location, isActive)
 * - inventory_transactions (type, createdAt, inventoryItemId)
 * - incidents (type, status, reportedAt, studentId)
 * - compliance_reports (type, status, createdAt)
 * - messages (recipientType, status, createdAt, senderId)
 * - templates (category, type, isActive)
 * - roles (name, isSystemRole)
 * - permissions (resource, action)
 *
 * @performance Covers most common query patterns for all major tables
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Medications table indexes
      console.log('Adding indexes to medications table...');
      await queryInterface.addIndex('medications', ['name'], {
        name: 'idx_medications_name',
        transaction
      });
      await queryInterface.addIndex('medications', ['category'], {
        name: 'idx_medications_category',
        transaction
      });
      await queryInterface.addIndex('medications', ['studentId'], {
        name: 'idx_medications_student_id',
        transaction
      });
      await queryInterface.addIndex('medications', ['expirationDate'], {
        name: 'idx_medications_expiration_date',
        transaction
      });
      await queryInterface.addIndex('medications', ['isActive'], {
        name: 'idx_medications_is_active',
        transaction
      });

      // Health Records table indexes
      console.log('Adding indexes to health_records table...');
      await queryInterface.addIndex('health_records', ['type'], {
        name: 'idx_health_records_type',
        transaction
      });
      await queryInterface.addIndex('health_records', ['recordedAt'], {
        name: 'idx_health_records_recorded_at',
        transaction
      });
      await queryInterface.addIndex('health_records', ['isActive'], {
        name: 'idx_health_records_is_active',
        transaction
      });

      // Students table indexes
      console.log('Adding indexes to students table...');
      await queryInterface.addIndex('students', ['lastName', 'firstName'], {
        name: 'idx_students_name',
        transaction
      });
      await queryInterface.addIndex('students', ['grade'], {
        name: 'idx_students_grade',
        transaction
      });
      await queryInterface.addIndex('students', ['status'], {
        name: 'idx_students_status',
        transaction
      });
      await queryInterface.addIndex('students', ['enrollmentDate'], {
        name: 'idx_students_enrollment_date',
        transaction
      });

      // Emergency Contacts table indexes
      console.log('Adding indexes to emergency_contacts table...');
      await queryInterface.addIndex('emergency_contacts', ['relationship'], {
        name: 'idx_emergency_contacts_relationship',
        transaction
      });
      await queryInterface.addIndex('emergency_contacts', ['isPrimary'], {
        name: 'idx_emergency_contacts_is_primary',
        transaction
      });
      await queryInterface.addIndex('emergency_contacts', ['isActive'], {
        name: 'idx_emergency_contacts_is_active',
        transaction
      });

      // Contacts table indexes
      console.log('Adding indexes to contacts table...');
      await queryInterface.addIndex('contacts', ['email'], {
        name: 'idx_contacts_email',
        transaction
      });
      await queryInterface.addIndex('contacts', ['phone'], {
        name: 'idx_contacts_phone',
        transaction
      });
      await queryInterface.addIndex('contacts', ['type'], {
        name: 'idx_contacts_type',
        transaction
      });

      // Inventory Items table indexes
      console.log('Adding indexes to inventory_items table...');
      await queryInterface.addIndex('inventory_items', ['name'], {
        name: 'idx_inventory_items_name',
        transaction
      });
      await queryInterface.addIndex('inventory_items', ['category'], {
        name: 'idx_inventory_items_category',
        transaction
      });
      await queryInterface.addIndex('inventory_items', ['location'], {
        name: 'idx_inventory_items_location',
        transaction
      });
      await queryInterface.addIndex('inventory_items', ['isActive'], {
        name: 'idx_inventory_items_is_active',
        transaction
      });

      // Inventory Transactions table indexes
      console.log('Adding indexes to inventory_transactions table...');
      await queryInterface.addIndex('inventory_transactions', ['type'], {
        name: 'idx_inventory_transactions_type',
        transaction
      });
      await queryInterface.addIndex('inventory_transactions', ['createdAt'], {
        name: 'idx_inventory_transactions_created_at',
        transaction
      });
      await queryInterface.addIndex('inventory_transactions', ['inventoryItemId'], {
        name: 'idx_inventory_transactions_item_id',
        transaction
      });
      await queryInterface.addIndex('inventory_transactions', ['inventoryItemId', 'type'], {
        name: 'idx_inventory_transactions_item_type',
        transaction
      });

      // Incidents table indexes
      console.log('Adding indexes to incidents table...');
      await queryInterface.addIndex('incidents', ['type'], {
        name: 'idx_incidents_type',
        transaction
      });
      await queryInterface.addIndex('incidents', ['status'], {
        name: 'idx_incidents_status',
        transaction
      });
      await queryInterface.addIndex('incidents', ['reportedAt'], {
        name: 'idx_incidents_reported_at',
        transaction
      });
      await queryInterface.addIndex('incidents', ['studentId'], {
        name: 'idx_incidents_student_id',
        transaction
      });
      await queryInterface.addIndex('incidents', ['studentId', 'status'], {
        name: 'idx_incidents_student_status',
        transaction
      });

      // Check if tables exist before creating indexes
      const tables = await queryInterface.showAllTables();

      // Compliance Reports indexes (if table exists)
      if (tables.includes('compliance_reports')) {
        console.log('Adding indexes to compliance_reports table...');
        await queryInterface.addIndex('compliance_reports', ['type'], {
          name: 'idx_compliance_reports_type',
          transaction
        });
        await queryInterface.addIndex('compliance_reports', ['status'], {
          name: 'idx_compliance_reports_status',
          transaction
        });
        await queryInterface.addIndex('compliance_reports', ['createdAt'], {
          name: 'idx_compliance_reports_created_at',
          transaction
        });
      }

      // Messages indexes (if table exists)
      if (tables.includes('messages')) {
        console.log('Adding indexes to messages table...');
        await queryInterface.addIndex('messages', ['recipientType'], {
          name: 'idx_messages_recipient_type',
          transaction
        });
        await queryInterface.addIndex('messages', ['status'], {
          name: 'idx_messages_status',
          transaction
        });
        await queryInterface.addIndex('messages', ['createdAt'], {
          name: 'idx_messages_created_at',
          transaction
        });
        await queryInterface.addIndex('messages', ['senderId'], {
          name: 'idx_messages_sender_id',
          transaction
        });
      }

      // Templates indexes (if table exists)
      if (tables.includes('templates')) {
        console.log('Adding indexes to templates table...');
        await queryInterface.addIndex('templates', ['category'], {
          name: 'idx_templates_category',
          transaction
        });
        await queryInterface.addIndex('templates', ['type'], {
          name: 'idx_templates_type',
          transaction
        });
        await queryInterface.addIndex('templates', ['isActive'], {
          name: 'idx_templates_is_active',
          transaction
        });
      }

      // Roles indexes
      console.log('Adding indexes to roles table...');
      await queryInterface.addIndex('roles', ['name'], {
        name: 'idx_roles_name',
        unique: true,
        transaction
      });
      await queryInterface.addIndex('roles', ['isSystemRole'], {
        name: 'idx_roles_is_system_role',
        transaction
      });

      // Permissions indexes
      console.log('Adding indexes to permissions table...');
      await queryInterface.addIndex('permissions', ['resource'], {
        name: 'idx_permissions_resource',
        transaction
      });
      await queryInterface.addIndex('permissions', ['action'], {
        name: 'idx_permissions_action',
        transaction
      });
      await queryInterface.addIndex('permissions', ['resource', 'action'], {
        name: 'idx_permissions_resource_action',
        unique: true,
        transaction
      });

      await transaction.commit();
      console.log('✓ All additional performance indexes added successfully');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Error adding additional indexes:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Helper function to safely remove index
      const safeRemoveIndex = async (table, indexName) => {
        try {
          await queryInterface.removeIndex(table, indexName, { transaction });
          console.log(`✓ Removed index: ${indexName}`);
        } catch (error) {
          console.warn(`Warning: Could not remove index ${indexName}:`, error.message);
        }
      };

      // Remove indexes in reverse order
      await safeRemoveIndex('permissions', 'idx_permissions_resource_action');
      await safeRemoveIndex('permissions', 'idx_permissions_action');
      await safeRemoveIndex('permissions', 'idx_permissions_resource');
      await safeRemoveIndex('roles', 'idx_roles_is_system_role');
      await safeRemoveIndex('roles', 'idx_roles_name');

      // Conditional tables
      const tables = await queryInterface.showAllTables();
      if (tables.includes('templates')) {
        await safeRemoveIndex('templates', 'idx_templates_is_active');
        await safeRemoveIndex('templates', 'idx_templates_type');
        await safeRemoveIndex('templates', 'idx_templates_category');
      }
      if (tables.includes('messages')) {
        await safeRemoveIndex('messages', 'idx_messages_sender_id');
        await safeRemoveIndex('messages', 'idx_messages_created_at');
        await safeRemoveIndex('messages', 'idx_messages_status');
        await safeRemoveIndex('messages', 'idx_messages_recipient_type');
      }
      if (tables.includes('compliance_reports')) {
        await safeRemoveIndex('compliance_reports', 'idx_compliance_reports_created_at');
        await safeRemoveIndex('compliance_reports', 'idx_compliance_reports_status');
        await safeRemoveIndex('compliance_reports', 'idx_compliance_reports_type');
      }

      await safeRemoveIndex('incidents', 'idx_incidents_student_status');
      await safeRemoveIndex('incidents', 'idx_incidents_student_id');
      await safeRemoveIndex('incidents', 'idx_incidents_reported_at');
      await safeRemoveIndex('incidents', 'idx_incidents_status');
      await safeRemoveIndex('incidents', 'idx_incidents_type');
      await safeRemoveIndex('inventory_transactions', 'idx_inventory_transactions_item_type');
      await safeRemoveIndex('inventory_transactions', 'idx_inventory_transactions_item_id');
      await safeRemoveIndex('inventory_transactions', 'idx_inventory_transactions_created_at');
      await safeRemoveIndex('inventory_transactions', 'idx_inventory_transactions_type');
      await safeRemoveIndex('inventory_items', 'idx_inventory_items_is_active');
      await safeRemoveIndex('inventory_items', 'idx_inventory_items_location');
      await safeRemoveIndex('inventory_items', 'idx_inventory_items_category');
      await safeRemoveIndex('inventory_items', 'idx_inventory_items_name');
      await safeRemoveIndex('contacts', 'idx_contacts_type');
      await safeRemoveIndex('contacts', 'idx_contacts_phone');
      await safeRemoveIndex('contacts', 'idx_contacts_email');
      await safeRemoveIndex('emergency_contacts', 'idx_emergency_contacts_is_active');
      await safeRemoveIndex('emergency_contacts', 'idx_emergency_contacts_is_primary');
      await safeRemoveIndex('emergency_contacts', 'idx_emergency_contacts_relationship');
      await safeRemoveIndex('students', 'idx_students_enrollment_date');
      await safeRemoveIndex('students', 'idx_students_status');
      await safeRemoveIndex('students', 'idx_students_grade');
      await safeRemoveIndex('students', 'idx_students_name');
      await safeRemoveIndex('health_records', 'idx_health_records_is_active');
      await safeRemoveIndex('health_records', 'idx_health_records_recorded_at');
      await safeRemoveIndex('health_records', 'idx_health_records_type');
      await safeRemoveIndex('medications', 'idx_medications_is_active');
      await safeRemoveIndex('medications', 'idx_medications_expiration_date');
      await safeRemoveIndex('medications', 'idx_medications_student_id');
      await safeRemoveIndex('medications', 'idx_medications_category');
      await safeRemoveIndex('medications', 'idx_medications_name');

      await transaction.commit();
      console.log('✓ All additional indexes removed');

    } catch (error) {
      await transaction.rollback();
      console.error('✗ Error removing additional indexes:', error);
      throw error;
    }
  }
};
