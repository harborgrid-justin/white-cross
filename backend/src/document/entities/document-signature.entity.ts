/**
 * DocumentSignature Entity
 * Tracks digital signatures on documents for compliance with 21 CFR Part 11
 * Used for consent forms, medical records, policies, and other documents requiring acknowledgment
 *
 * Features:
 * - Electronic signature compliance (21 CFR Part 11)
 * - Signer identity and role tracking
 * - IP address tracking for audit
 * - Timestamp (non-repudiable)
 * - Optional signature data (image/encrypted signature)
 * - Association with document
 */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import type { Document } from './document.entity';

@Table({
  tableName: 'document_signatures',
  timestamps: true,
  updatedAt: false, // Signatures are immutable once created
  indexes: [
    { fields: ['documentId'] },
    { fields: ['signedBy'] },
    { fields: ['signedAt'] },
    { fields: ['documentId', 'signedBy'] }, // Compound index for common queries
  ],
})
export class DocumentSignature extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Document)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Document being signed',
  })
  @Index
  documentId: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'User ID of the signer',
    validate: {
      notEmpty: { msg: 'Signer ID is required' },
    },
  })
  @Index
  signedBy: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: 'Role of the signer (e.g., Nurse, Parent, Administrator)',
    validate: {
      notEmpty: { msg: 'Signer role is required' },
      len: {
        args: [2, 100],
        msg: 'Signer role must be between 2 and 100 characters',
      },
    },
  })
  signedByRole: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Optional signature data (image, encrypted signature, etc.)',
  })
  signatureData?: string;

  @Column({
    type: DataType.STRING(45),
    allowNull: true,
    comment: 'IP address of signer for audit trail',
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
    field: 'signed_at',
    comment: 'Timestamp when signature was applied (immutable)',
  })
  @Index
  signedAt: Date;

  // Associations

  @BelongsTo(() => Document)
  document: Document;
}
