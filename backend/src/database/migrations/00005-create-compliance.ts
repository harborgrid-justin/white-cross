/**
 * WC-GEN-020 | 00005-create-compliance.ts - General utility functions and operations
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
  // Create audit_logs table
  await queryInterface.createTable('audit_logs', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    action: {
      type: DataTypes.ENUM('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT', 'BACKUP', 'RESTORE'),
      allowNull: false,
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    changes: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Create compliance_reports table
  await queryInterface.createTable('compliance_reports', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    reportType: {
      type: DataTypes.ENUM('HIPAA', 'FERPA', 'STATE_HEALTH', 'MEDICATION_AUDIT', 'SAFETY_INSPECTION', 'TRAINING_COMPLIANCE', 'DATA_PRIVACY', 'CUSTOM'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'COMPLIANT', 'NON_COMPLIANT', 'UNDER_REVIEW'),
      allowNull: false,
    },
    period: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    findings: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    recommendations: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    submittedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdById: {
      type: DataTypes.STRING,
      allowNull: false,
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

  // Create compliance_checklist_items table
  await queryInterface.createTable('compliance_checklist_items', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    reportId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'compliance_reports',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    requirement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM('PRIVACY', 'SECURITY', 'DOCUMENTATION', 'TRAINING', 'SAFETY', 'MEDICATION', 'HEALTH_RECORDS', 'CONSENT'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'NOT_APPLICABLE', 'FAILED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    evidence: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
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

  // Create consent_forms table
  await queryInterface.createTable('consent_forms', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.ENUM('MEDICAL_TREATMENT', 'MEDICATION_ADMINISTRATION', 'EMERGENCY_CARE', 'PHOTO_RELEASE', 'DATA_SHARING', 'TELEHEALTH', 'RESEARCH', 'OTHER'),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1.0',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    expiresAt: {
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

  // Create consent_signatures table
  await queryInterface.createTable('consent_signatures', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    consentFormId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'consent_forms',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    relationship: {
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
    withdrawnAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    withdrawnBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  // Create policy_documents table
  await queryInterface.createTable('policy_documents', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('HIPAA', 'FERPA', 'MEDICATION', 'EMERGENCY', 'SAFETY', 'DATA_SECURITY', 'OPERATIONAL', 'TRAINING'),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '1.0',
    },
    effectiveDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('DRAFT', 'UNDER_REVIEW', 'ACTIVE', 'ARCHIVED', 'SUPERSEDED'),
      allowNull: false,
      defaultValue: 'DRAFT',
    },
    approvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    approvedAt: {
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

  // Create policy_acknowledgments table
  await queryInterface.createTable('policy_acknowledgments', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    policyId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'policy_documents',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    acknowledgedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  // Add indexes
  await queryInterface.addIndex('audit_logs', ['userId', 'createdAt']);
  await queryInterface.addIndex('audit_logs', ['entityType', 'entityId']);
  await queryInterface.addIndex('audit_logs', ['createdAt']);

  await queryInterface.addIndex('compliance_reports', ['reportType', 'status']);
  await queryInterface.addIndex('compliance_reports', ['period']);
  await queryInterface.addIndex('compliance_reports', ['createdById']);

  await queryInterface.addIndex('compliance_checklist_items', ['reportId']);
  await queryInterface.addIndex('compliance_checklist_items', ['category', 'status']);

  await queryInterface.addIndex('consent_forms', ['type', 'isActive']);
  await queryInterface.addIndex('consent_forms', ['expiresAt']);

  await queryInterface.addIndex('consent_signatures', ['consentFormId', 'studentId'], { unique: true });
  await queryInterface.addIndex('consent_signatures', ['studentId']);
  await queryInterface.addIndex('consent_signatures', ['signedAt']);

  await queryInterface.addIndex('policy_documents', ['category', 'status']);
  await queryInterface.addIndex('policy_documents', ['effectiveDate']);

  await queryInterface.addIndex('policy_acknowledgments', ['policyId', 'userId'], { unique: true });
  await queryInterface.addIndex('policy_acknowledgments', ['userId']);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('policy_acknowledgments');
  await queryInterface.dropTable('policy_documents');
  await queryInterface.dropTable('consent_signatures');
  await queryInterface.dropTable('consent_forms');
  await queryInterface.dropTable('compliance_checklist_items');
  await queryInterface.dropTable('compliance_reports');
  await queryInterface.dropTable('audit_logs');
}
