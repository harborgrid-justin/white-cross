/**
 * LOC: 0428ABF328
 * WC-GEN-058 | DocumentAuditTrail.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

/**
 * WC-GEN-058 | DocumentAuditTrail.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize, ../../types/enums | Dependencies: sequelize, ../../config/sequelize, ../../types/enums
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { DocumentAction } from '../../types/enums';

/**
 * DocumentAuditTrail Model
 * Maintains comprehensive audit trail of all document operations
 * Required for HIPAA compliance and security monitoring
 */

interface DocumentAuditTrailAttributes {
  id: string;
  action: DocumentAction;
  performedBy: string;
  changes?: any;
  ipAddress?: string;
  documentId: string;
  createdAt: Date;
}

interface DocumentAuditTrailCreationAttributes
  extends Optional<DocumentAuditTrailAttributes, 'id' | 'changes' | 'ipAddress' | 'createdAt'> {}

export class DocumentAuditTrail
  extends Model<DocumentAuditTrailAttributes, DocumentAuditTrailCreationAttributes>
  implements DocumentAuditTrailAttributes
{
  public id!: string;
  public action!: DocumentAction;
  public performedBy!: string;
  public changes?: any;
  public ipAddress?: string;
  public documentId!: string;
  public readonly createdAt!: Date;
}

DocumentAuditTrail.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    action: {
      type: DataTypes.ENUM(...Object.values(DocumentAction)),
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
    documentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'document_audit_trail',
    timestamps: false,
    indexes: [
      { fields: ['documentId', 'createdAt'] },
      { fields: ['performedBy'] },
      { fields: ['action'] },
    ],
  }
);
