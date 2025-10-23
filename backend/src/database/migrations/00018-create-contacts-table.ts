/**
 * LOC: CONTACT-MIG-001
 * WC-MIG-018 | Create contacts table migration
 * 
 * Purpose: Create contacts table for CRM-style contact management
 * Supports: Guardians, staff, vendors, healthcare providers
 * Features: HIPAA audit fields, soft deletes, custom fields
 * 
 * UPSTREAM (imports from):
 *   - sequelize
 * 
 * DOWNSTREAM (imported by):
 *   - Contact model
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('contacts', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('guardian', 'staff', 'vendor', 'provider', 'other'),
      allowNull: false,
    },
    organization: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    zip: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    relationTo: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'UUID of related student or user',
    },
    relationshipType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Type of relationship (parent, emergency, etc.)',
    },
    customFields: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
      comment: 'Custom healthcare-specific fields',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who created this contact',
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'User who last updated this contact',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Soft delete timestamp',
    },
  });

  // Create indexes for performance
  await queryInterface.addIndex('contacts', ['email'], {
    name: 'contacts_email_idx',
  });

  await queryInterface.addIndex('contacts', ['type'], {
    name: 'contacts_type_idx',
  });

  await queryInterface.addIndex('contacts', ['relationTo'], {
    name: 'contacts_relation_to_idx',
  });

  await queryInterface.addIndex('contacts', ['isActive'], {
    name: 'contacts_is_active_idx',
  });

  await queryInterface.addIndex('contacts', ['createdAt'], {
    name: 'contacts_created_at_idx',
  });

  // Composite index for full-text search on names
  await queryInterface.addIndex('contacts', ['firstName', 'lastName'], {
    name: 'contacts_name_idx',
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  // Remove indexes first
  await queryInterface.removeIndex('contacts', 'contacts_email_idx');
  await queryInterface.removeIndex('contacts', 'contacts_type_idx');
  await queryInterface.removeIndex('contacts', 'contacts_relation_to_idx');
  await queryInterface.removeIndex('contacts', 'contacts_is_active_idx');
  await queryInterface.removeIndex('contacts', 'contacts_created_at_idx');
  await queryInterface.removeIndex('contacts', 'contacts_name_idx');

  // Drop table
  await queryInterface.dropTable('contacts');
}
