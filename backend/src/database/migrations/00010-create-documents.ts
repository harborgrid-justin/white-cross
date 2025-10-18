/**
 * WC-GEN-025 | 00010-create-documents.ts - General utility functions and operations
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
  // Create documents table
  await queryInterface.createTable('documents', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('MEDICAL_RECORD', 'INCIDENT_REPORT', 'CONSENT_FORM', 'POLICY', 'TRAINING', 'ADMINISTRATIVE', 'STUDENT_FILE', 'INSURANCE', 'OTHER'),
      allowNull: false,
    },
    fileType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'ARCHIVED', 'EXPIRED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    isTemplate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    templateData: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    retentionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    accessLevel: {
      type: DataTypes.ENUM('PUBLIC', 'STAFF_ONLY', 'ADMIN_ONLY', 'RESTRICTED'),
      allowNull: false,
      defaultValue: 'STAFF_ONLY',
    },
    uploadedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.STRING,
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

  // Create document_signatures table
  await queryInterface.createTable('document_signatures', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    documentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'documents',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    signedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signedByRole: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signatureData: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    signedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  // Create document_audit_trail table
  await queryInterface.createTable('document_audit_trail', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    documentId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'documents',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    action: {
      type: DataTypes.ENUM('CREATED', 'VIEWED', 'DOWNLOADED', 'UPDATED', 'DELETED', 'SHARED', 'SIGNED'),
      allowNull: false,
    },
    performedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    changes: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Add indexes
  await queryInterface.addIndex('documents', ['category', 'status']);
  await queryInterface.addIndex('documents', ['studentId']);
  await queryInterface.addIndex('documents', ['createdAt']);
  await queryInterface.addIndex('documents', ['uploadedBy']);
  await queryInterface.addIndex('documents', ['parentId']);
  await queryInterface.addIndex('documents', ['retentionDate']);
  await queryInterface.addIndex('documents', ['isTemplate']);

  await queryInterface.addIndex('document_signatures', ['documentId']);
  await queryInterface.addIndex('document_signatures', ['signedBy']);
  await queryInterface.addIndex('document_signatures', ['signedAt']);

  await queryInterface.addIndex('document_audit_trail', ['documentId', 'createdAt']);
  await queryInterface.addIndex('document_audit_trail', ['performedBy']);
  await queryInterface.addIndex('document_audit_trail', ['action']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('document_audit_trail');
  await queryInterface.dropTable('document_signatures');
  await queryInterface.dropTable('documents');
}
