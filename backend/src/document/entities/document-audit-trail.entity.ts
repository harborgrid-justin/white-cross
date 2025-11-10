/**
 * DocumentAuditTrail Entity
 * Maintains comprehensive audit trail of all document operations
 * Required for HIPAA compliance and security monitoring
 *
 * Features:
 * - Complete operation tracking (CREATE, UPDATE, DELETE, SIGN, SHARE, VIEW, DOWNLOAD)
 * - User identification for accountability
 * - Timestamp for temporal analysis
 * - Change details in JSONB for flexibility
 * - IP address tracking for security
 * - Immutable records (no updates, only inserts)
 */

import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import type { Document } from './document.entity';
import { DocumentAction } from '../enums/document.enums';

@Table({
  tableName: 'document_audit_trails',
  timestamps: true,
  updatedAt: false, // Audit trail entries are immutable
  indexes: [
    { fields: ['documentId', 'createdAt'] }, // Primary query pattern
    { fields: ['performedBy'] },
    { fields: ['action'] },
    { fields: ['createdAt'] },
    { fields: ['documentId', 'action'] }, // Common filter combination
  ],
})
export class DocumentAuditTrail extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Document)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Document being audited',
  })
  @Index
  documentId: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    comment: 'Action performed on the document',
    validate: {
      isIn: {
        args: [Object.values(DocumentAction)],
        msg: 'Invalid document action',
      },
    },
  })
  @Index
  action: DocumentAction;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'User ID who performed the action',
    validate: {
      notEmpty: { msg: 'Performer ID is required' },
    },
  })
  @Index
  performedBy: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Detailed changes or action metadata',
  })
  changes?: any;

  @Column({
    type: DataType.STRING(45),
    allowNull: true,
    comment: 'IP address where action was performed',
    validate: {
      isIP: {
        msg: 'Invalid IP address format',
      },
    },
  })
  ipAddress?: string;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
    comment: 'Timestamp when action was performed (immutable)',
  })
  @Index
  declare createdAt: Date;

  // Associations

  @BelongsTo(() => Document)
  document: Document;
}
