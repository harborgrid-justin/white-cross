/**
 * Document Model
 * Comprehensive document management with HIPAA compliance, versioning, and access control
 *
 * Features:
 * - Multi-category document support (medical, incident, consent, policy, etc.)
 * - Version control with parent-child relationships
 * - Access level control (PUBLIC, STAFF_ONLY, ADMIN_ONLY, RESTRICTED)
 * - PHI (Protected Health Information) flagging and compliance
 * - Electronic signature support and tracking
 * - Document retention policy enforcement
 * - Template support with JSON metadata
 * - Access auditing (last accessed, access count)
 * - Comprehensive audit trail
 */

import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  DeletedAt,
  ForeignKey,
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DocumentSignature } from './document-signature.model';
import { DocumentAuditTrail } from './document-audit-trail.model';
import {
  DocumentAccessLevel,
  DocumentCategory,
  DocumentStatus,
} from '../../document/enums/document.enums';

@Table({
  tableName: 'documents',
  timestamps: true,
  paranoid: true, // Soft deletes
  indexes: [
    { fields: ['category', 'status'] },
    { fields: ['studentId'] },
    { fields: ['createdAt'] },
    { fields: ['uploadedBy'] },
    { fields: ['parentId'] },
    { fields: ['retentionDate'] },
    { fields: ['isTemplate'] },
    { fields: ['containsPHI'] },
    { fields: ['requiresSignature'] },
    { fields: ['lastAccessedAt'] },
    { fields: ['accessLevel'] },
    { fields: ['deletedAt'] },
  ],
})
export class Document extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Document title cannot be empty' },
      len: {
        args: [3, 255],
        msg: 'Document title must be between 3 and 255 characters',
      },
    },
  })
  @Index
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 5000],
        msg: 'Document description must not exceed 5000 characters',
      },
    },
  })
  description?: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      isIn: {
        args: [Object.values(DocumentCategory)],
        msg: 'Invalid document category',
      },
    },
  })
  @Index
  category: DocumentCategory;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'File type is required' },
    },
  })
  fileType: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'File name is required' },
      len: {
        args: [1, 255],
        msg: 'File name must not exceed 255 characters',
      },
    },
  })
  fileName: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    validate: {
      min: {
        args: [1024],
        msg: 'File size must be at least 1KB',
      },
      max: {
        args: [52428800],
        msg: 'File size must not exceed 50MB',
      },
    },
  })
  fileSize: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'File URL is required' },
      isUrl: { msg: 'File URL must be a valid URL' },
    },
  })
  fileUrl: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'User ID who uploaded the document',
  })
  @Index
  uploadedBy: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Student ID if document is student-specific',
  })
  @Index
  studentId?: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    defaultValue: [],
    validate: {
      isValidTagArray(value: string[]) {
        if (value && !Array.isArray(value)) {
          throw new Error('Tags must be an array');
        }
        if (value && value.length > 10) {
          throw new Error('Maximum of 10 tags allowed');
        }
      },
    },
  })
  tags?: string[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether this document is a template for creating others',
  })
  @Index
  isTemplate: boolean;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    comment: 'Template metadata and field definitions',
  })
  templateData?: any;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: DocumentStatus.DRAFT,
    validate: {
      isIn: {
        args: [Object.values(DocumentStatus)],
        msg: 'Invalid document status',
      },
    },
  })
  @Index
  status: DocumentStatus;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: {
        args: [1],
        msg: 'Version must be at least 1',
      },
      max: {
        args: [100],
        msg: 'Version cannot exceed 100',
      },
    },
  })
  declare version: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    defaultValue: DocumentAccessLevel.STAFF_ONLY,
    validate: {
      isIn: {
        args: [Object.values(DocumentAccessLevel)],
        msg: 'Invalid access level',
      },
    },
  })
  @Index
  accessLevel: DocumentAccessLevel;

  @ForeignKey(() => Document)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Parent document ID for versioning',
  })
  @Index
  parentId?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Date when document retention period ends',
  })
  @Index
  retentionDate?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Indicates if document contains Protected Health Information (HIPAA)',
  })
  @Index
  containsPHI: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Indicates if document requires electronic signature',
  })
  @Index
  requiresSignature: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Last time document was viewed or downloaded (for audit)',
  })
  @Index
  lastAccessedAt?: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of times document has been accessed (for compliance)',
    validate: {
      min: {
        args: [0],
        msg: 'Access count cannot be negative',
      },
    },
  })
  accessCount: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Soft delete flag - whether document is currently active',
  })
  isActive: boolean;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'Soft delete timestamp',
  })
  declare deletedAt?: Date;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    comment: 'User who deleted this document (for audit trail)',
  })
  deletedBy?: string;

  // Associations

  @BelongsTo(() => Document, 'parentId')
  parent?: Document;

  @HasMany(() => Document, 'parentId')
  versions?: Document[];

  @HasMany(() => 'DocumentSignature', 'documentId')
  signatures?: DocumentSignature[];

  @HasMany(() => 'DocumentAuditTrail', 'documentId')
  auditTrail?: DocumentAuditTrail[];

  // Hooks

  /**
   * Before create hook: Auto-set PHI flag and signature requirement based on category
   */
  @BeforeCreate
  static autoSetComplianceFlags(instance: Document) {
    // Auto-set PHI flag based on category
    const phiCategories = [
      DocumentCategory.MEDICAL_RECORD,
      DocumentCategory.INCIDENT_REPORT,
      DocumentCategory.CONSENT_FORM,
      DocumentCategory.INSURANCE,
    ];
    if (phiCategories.includes(instance.category)) {
      instance.containsPHI = true;
    }

    // Auto-set signature requirement based on category
    const signatureCategories = [
      DocumentCategory.MEDICAL_RECORD,
      DocumentCategory.CONSENT_FORM,
      DocumentCategory.INCIDENT_REPORT,
    ];
    if (signatureCategories.includes(instance.category)) {
      instance.requiresSignature = true;
    }

    // Ensure PHI documents have appropriate access level
    if (instance.containsPHI && instance.accessLevel === DocumentAccessLevel.PUBLIC) {
      instance.accessLevel = DocumentAccessLevel.STAFF_ONLY;
    }

    // Validate HTTPS for PHI documents
    if (instance.containsPHI && instance.fileUrl && !instance.fileUrl.startsWith('https://')) {
      throw new Error(
        'PHI documents must use HTTPS protocol for secure transmission (HIPAA requirement)',
      );
    }
  }

  /**
   * Before update hook: Prevent downgrading access level for PHI documents
   */
  @BeforeUpdate
  static preventPHIDowngrade(instance: Document) {
    if (instance.containsPHI && instance.changed('accessLevel')) {
      const newAccessLevel = instance.getDataValue('accessLevel');
      if (newAccessLevel === DocumentAccessLevel.PUBLIC) {
        throw new Error('Cannot change access level to PUBLIC for documents containing PHI');
      }
    }

    // Validate HTTPS for PHI documents
    if (instance.containsPHI && instance.changed('fileUrl')) {
      const newFileUrl = instance.getDataValue('fileUrl');
      if (newFileUrl && !newFileUrl.startsWith('https://')) {
        throw new Error(
          'PHI documents must use HTTPS protocol for secure transmission (HIPAA requirement)',
        );
      }
    }
  }
}
