/**
 * LOC: 88BD6EE115
 * WC-GEN-059 | DocumentSignature.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 */

/**
 * WC-GEN-059 | DocumentSignature.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../config/sequelize | Dependencies: sequelize, ../../config/sequelize
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: classes | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * DocumentSignature Model
 * Tracks digital signatures on documents for consent forms,
 * policies, and other documents requiring acknowledgment
 */

interface DocumentSignatureAttributes {
  id: string;
  signedBy: string;
  signedByRole: string;
  signatureData?: string;
  signedAt: Date;
  ipAddress?: string;
  documentId: string;
}

interface DocumentSignatureCreationAttributes
  extends Optional<DocumentSignatureAttributes, 'id' | 'signatureData' | 'signedAt' | 'ipAddress'> {}

export class DocumentSignature
  extends Model<DocumentSignatureAttributes, DocumentSignatureCreationAttributes>
  implements DocumentSignatureAttributes
{
  public id!: string;
  public signedBy!: string;
  public signedByRole!: string;
  public signatureData?: string;
  public signedAt!: Date;
  public ipAddress?: string;
  public documentId!: string;
}

DocumentSignature.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
    documentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'document_signatures',
    timestamps: false,
    indexes: [
      { fields: ['documentId'] },
      { fields: ['signedBy'] },
      { fields: ['signedAt'] },
    ],
  }
);
