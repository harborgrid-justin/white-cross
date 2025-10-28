/**
 * LOC: 47385DDAE5
 * WC-GEN-022 | 00007-create-incidents-extended.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-022 | 00007-create-incidents-extended.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: Independent module | Dependencies: sequelize
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Create emergency_contacts table
  await queryInterface.createTable('emergency_contacts', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    relationship: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM('PRIMARY', 'SECONDARY', 'EMERGENCY_ONLY'),
      allowNull: false,
      defaultValue: 'PRIMARY',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
  });

  // Create incident_reports table
  await queryInterface.createTable('incident_reports', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    reportedById: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    type: {
      type: DataTypes.ENUM('INJURY', 'ILLNESS', 'BEHAVIORAL', 'MEDICATION_ERROR', 'ALLERGIC_REACTION', 'EMERGENCY', 'OTHER'),
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    witnesses: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    actionsTaken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    parentNotified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    parentNotificationMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parentNotifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    parentNotifiedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    followUpRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    followUpNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    evidencePhotos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    evidenceVideos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    occurredAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    insuranceClaimNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insuranceClaimStatus: {
      type: DataTypes.ENUM('NOT_FILED', 'FILED', 'PENDING', 'APPROVED', 'DENIED', 'CLOSED'),
      allowNull: true,
    },
    legalComplianceStatus: {
      type: DataTypes.ENUM('PENDING', 'COMPLIANT', 'NON_COMPLIANT', 'UNDER_REVIEW'),
      allowNull: false,
      defaultValue: 'PENDING',
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
  });

  // Create witness_statements table
  await queryInterface.createTable('witness_statements', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    incidentReportId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'incident_reports',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    witnessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    witnessType: {
      type: DataTypes.ENUM('STUDENT', 'STAFF', 'PARENT', 'OTHER'),
      allowNull: false,
    },
    witnessContact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    statement: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verifiedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
  });

  // Create follow_up_actions table
  await queryInterface.createTable('follow_up_actions', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    incidentReportId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'incident_reports',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    action: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    priority: {
      type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT'),
      allowNull: false,
      defaultValue: 'MEDIUM',
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    assignedTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
  });

  // Add indexes
  await queryInterface.addIndex('emergency_contacts', ['studentId']);
  await queryInterface.addIndex('emergency_contacts', ['priority']);
  await queryInterface.addIndex('emergency_contacts', ['isActive']);

  await queryInterface.addIndex('incident_reports', ['studentId']);
  await queryInterface.addIndex('incident_reports', ['reportedById']);
  await queryInterface.addIndex('incident_reports', ['type', 'severity']);
  await queryInterface.addIndex('incident_reports', ['occurredAt']);
  await queryInterface.addIndex('incident_reports', ['parentNotified']);

  await queryInterface.addIndex('witness_statements', ['incidentReportId']);
  await queryInterface.addIndex('witness_statements', ['verified']);

  await queryInterface.addIndex('follow_up_actions', ['incidentReportId']);
  await queryInterface.addIndex('follow_up_actions', ['status', 'dueDate']);
  await queryInterface.addIndex('follow_up_actions', ['assignedTo']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('follow_up_actions');
  await queryInterface.dropTable('witness_statements');
  await queryInterface.dropTable('incident_reports');
  await queryInterface.dropTable('emergency_contacts');
}
