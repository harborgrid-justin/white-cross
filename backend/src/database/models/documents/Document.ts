/**
 * @fileoverview Document Database Model
 * @module database/models/documents/Document
 * @description Sequelize model for managing all healthcare-related documents including medical records,
 * consent forms, incident reports, policies, and administrative documents with comprehensive version control,
 * access control, and compliance tracking.
 *
 * Key Features:
 * - Multi-category document management (medical, incident, consent, policy, etc.)
 * - Version control with parent-child relationships
 * - Access level control (PUBLIC, STAFF_ONLY, ADMIN_ONLY, RESTRICTED)
 * - PHI (Protected Health Information) flag and compliance
 * - Electronic signature support and tracking
 * - Document retention policy enforcement
 * - Template support with JSON metadata
 * - File validation (type, size, extension matching)
 * - Access auditing (last accessed, access count)
 * - Comprehensive tag system
 *
 * Document Categories & Retention:
 * - MEDICAL_RECORD: 7 years retention, auto-PHI, signature required
 * - INCIDENT_REPORT: 7 years retention, auto-PHI, signature required
 * - CONSENT_FORM: 7 years retention, auto-PHI, signature required
 * - INSURANCE: 7 years retention, auto-PHI
 * - STUDENT_FILE: 7 years retention
 * - POLICY: 5 years retention
 * - TRAINING: 5 years retention
 * - ADMINISTRATIVE: 3 years retention
 * - OTHER: 3 years retention
 *
 * @compliance HIPAA - Protected Health Information handling and access control
 * @compliance FERPA - Educational records privacy requirements
 * @compliance 21 CFR Part 11 - Electronic signatures for medical documents
 * @compliance State regulations - Document retention requirements
 *
 * @legal Retention requirements vary by category (3-7 years)
 * @legal Electronic signatures legally binding for consent forms
 * @legal Must maintain audit trail of all access and modifications
 * @legal PHI documents require staff-only or higher access levels
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 *
 * LOC: 5CE9998FE1
 * Last Updated: 2025-10-17
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { DocumentCategory, DocumentStatus, DocumentAccessLevel } from '../../types/enums';

interface DocumentAttributes {
  id: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  fileType: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  version: number;
  status: DocumentStatus;
  tags: string[];
  isTemplate: boolean;
  templateData?: any;
  parentId?: string;
  retentionDate?: Date;
  accessLevel: DocumentAccessLevel;
  uploadedBy: string;
  studentId?: string;
  containsPHI: boolean;
  requiresSignature: boolean;
  lastAccessedAt?: Date;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface DocumentCreationAttributes
 * @description Defines optional fields when creating a new document
 * @extends DocumentAttributes
 */
interface DocumentCreationAttributes
  extends Optional<
    DocumentAttributes,
    | 'id'
    | 'description'
    | 'version'
    | 'status'
    | 'tags'
    | 'isTemplate'
    | 'templateData'
    | 'parentId'
    | 'retentionDate'
    | 'accessLevel'
    | 'studentId'
    | 'containsPHI'
    | 'requiresSignature'
    | 'lastAccessedAt'
    | 'accessCount'
    | 'createdAt'
    | 'updatedAt'
  > {}

/**
 * @class Document
 * @extends Model
 * @description Sequelize model class for document management
 *
 * Workflow Summary:
 * 1. Document uploaded → File validated (type, size, extension)
 * 2. Category assigned → Auto-sets PHI flag and signature requirement
 * 3. Access level determined → PUBLIC downgraded to STAFF_ONLY for PHI
 * 4. Retention date calculated → Based on category requirements
 * 5. Document saved → Audit trail created
 * 6. Access tracked → lastAccessedAt and accessCount updated on view/download
 * 7. Version control → New versions reference parentId
 * 8. Retention enforced → Archived after retention date
 *
 * Access Levels:
 * - PUBLIC: Accessible to all (policies, general information)
 * - STAFF_ONLY: School staff only (most documents)
 * - ADMIN_ONLY: Administrators only (sensitive records)
 * - RESTRICTED: Specific authorization required (legal, personnel)
 *
 * PHI (Protected Health Information) Rules:
 * - Auto-flagged for: MEDICAL_RECORD, INCIDENT_REPORT, CONSENT_FORM, INSURANCE
 * - Cannot have PUBLIC access level
 * - Requires encryption at rest and in transit
 * - Access automatically audited
 * - Must follow HIPAA minimum necessary standard
 *
 * Electronic Signature Requirements:
 * - Auto-required for: MEDICAL_RECORD, CONSENT_FORM, INCIDENT_REPORT
 * - Must comply with 21 CFR Part 11 for medical documents
 * - Signature binding and non-repudiable
 * - Linked via DocumentSignature model
 *
 * File Type Restrictions:
 * - Documents: PDF, DOC, DOCX, TXT, CSV
 * - Spreadsheets: XLS, XLSX
 * - Images: JPG, JPEG, PNG, GIF, WEBP
 * - Maximum size: 50MB
 * - Minimum size: 1KB
 * - HTTPS required for all file URLs
 *
 * Retention Policies:
 * - 7 years: Medical records, incidents, consent forms, insurance, student files
 * - 5 years: Policies, training materials
 * - 3 years: Administrative documents, other
 * - System warns 90 days before retention expiration
 * - Documents archived (not deleted) after retention period
 *
 * Associations:
 * - belongsTo: User (uploadedBy - uploader)
 * - belongsTo: Student (optional - if student-specific)
 * - belongsTo: Document (parentId - for versions)
 * - hasMany: Document (as parent - child versions)
 * - hasMany: DocumentSignature (electronic signatures)
 * - hasMany: DocumentAuditTrail (access history)
 *
 * Hooks:
 * - beforeCreate: Auto-set PHI flag, signature requirement, access level
 * - beforeUpdate: Prevent PUBLIC access for PHI documents
 *
 * @example
 * // Create a medical record document
 * const doc = await Document.create({
 *   title: 'Annual Physical Examination 2024',
 *   description: 'Complete physical exam results',
 *   category: DocumentCategory.MEDICAL_RECORD,
 *   fileType: 'application/pdf',
 *   fileName: 'physical_exam_2024.pdf',
 *   fileSize: 524288, // 512KB
 *   fileUrl: 'https://secure.storage/docs/abc123.pdf',
 *   uploadedBy: 'nurse-uuid',
 *   studentId: 'student-uuid',
 *   tags: ['physical', 'annual', '2024'],
 *   retentionDate: new Date('2031-01-15') // 7 years
 * });
 * // containsPHI = true, requiresSignature = true auto-set
 * // accessLevel defaults to STAFF_ONLY
 */
export class Document extends Model<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  public id!: string;
  public title!: string;
  public description?: string;
  public category!: DocumentCategory;
  public fileType!: string;
  public fileName!: string;
  public fileSize!: number;
  public fileUrl!: string;
  public version!: number;
  public status!: DocumentStatus;
  public tags!: string[];
  public isTemplate!: boolean;
  public templateData?: any;
  public parentId?: string;
  public retentionDate?: Date;
  public accessLevel!: DocumentAccessLevel;
  public uploadedBy!: string;
  public studentId?: string;
  public containsPHI!: boolean;
  public requiresSignature!: boolean;
  public lastAccessedAt?: Date;
  public accessCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Document.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      validate: {
        isUUID: {
          args: 4,
          msg: 'Document ID must be a valid UUID',
        },
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Document title is required',
        },
        notEmpty: {
          msg: 'Document title cannot be empty',
        },
        len: {
          args: [3, 255],
          msg: 'Document title must be between 3 and 255 characters',
        },
        noMaliciousContent(value: string) {
          if (/<script|<iframe|javascript:/i.test(value)) {
            throw new Error('Document title contains potentially malicious content');
          }
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 5000],
          msg: 'Document description must not exceed 5000 characters',
        },
        noMaliciousContent(value: string) {
          if (value && /<script|<iframe|javascript:/i.test(value)) {
            throw new Error('Document description contains potentially malicious content');
          }
        },
      },
    },
    category: {
      type: DataTypes.ENUM(...Object.values(DocumentCategory)),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Document category is required',
        },
        isIn: {
          args: [Object.values(DocumentCategory)],
          msg: `Document category must be one of: ${Object.values(DocumentCategory).join(', ')}`,
        },
      },
    },
    fileType: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'File type is required',
        },
        notEmpty: {
          msg: 'File type cannot be empty',
        },
        isValidMimeType(value: string) {
          const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'text/csv',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
          ];
          if (!allowedTypes.includes(value.toLowerCase().trim())) {
            throw new Error(
              `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
            );
          }
        },
      },
    },
    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'File name is required',
        },
        notEmpty: {
          msg: 'File name cannot be empty',
        },
        len: {
          args: [1, 255],
          msg: 'File name must not exceed 255 characters',
        },
        isValidFileName(value: string) {
          if (!/^[a-zA-Z0-9._\-\s]+$/.test(value)) {
            throw new Error(
              'File name contains invalid characters. Only letters, numbers, spaces, dots, hyphens, and underscores are allowed'
            );
          }
        },
      },
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'File size is required',
        },
        isInt: {
          msg: 'File size must be an integer',
        },
        min: {
          args: [1024],
          msg: 'File size must be at least 1KB',
        },
        max: {
          args: [52428800],
          msg: 'File size must not exceed 50MB',
        },
      },
    },
    /**
     * File URL for accessing the document
     *
     * @type {string}
     * @description URL pointing to the document file location (cloud storage, CDN, etc.)
     *
     * Validation:
     * - Must be a valid URL format
     * - Cannot be null or empty
     * - HIPAA Requirement: PHI documents MUST use HTTPS protocol
     *
     * @security HIPAA Compliance: PHI documents must be transmitted over secure channels
     * @security All PHI document URLs must start with 'https://'
     * @security Non-HTTPS URLs for PHI documents will be rejected at model validation
     *
     * @example
     * ```typescript
     * // Valid PHI document URL
     * fileUrl: "https://secure-storage.example.com/documents/patient-123/record.pdf"
     *
     * // Invalid PHI document URL (will throw validation error)
     * fileUrl: "http://storage.example.com/documents/patient-123/record.pdf"
     *
     * // Valid non-PHI document URL
     * fileUrl: "http://storage.example.com/documents/public/form.pdf"
     * ```
     */
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'File URL is required',
        },
        notEmpty: {
          msg: 'File URL cannot be empty',
        },
        isUrl: {
          msg: 'File URL must be a valid URL',
        },
        httpsForPHI(value: string) {
          // HIPAA Compliance: PHI documents must use HTTPS for secure transmission
          if ((this as any).containsPHI && !value.startsWith('https://')) {
            throw new Error('PHI documents must use HTTPS protocol for secure transmission (HIPAA requirement)');
          }
        },
      },
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isInt: {
          msg: 'Version must be an integer',
        },
        min: {
          args: [1],
          msg: 'Version must be at least 1',
        },
        max: {
          args: [100],
          msg: 'Version cannot exceed 100',
        },
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(DocumentStatus)),
      allowNull: false,
      defaultValue: DocumentStatus.DRAFT,
      validate: {
        notNull: {
          msg: 'Document status is required',
        },
        isIn: {
          args: [Object.values(DocumentStatus)],
          msg: `Document status must be one of: ${Object.values(DocumentStatus).join(', ')}`,
        },
      },
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidTagArray(value: string[]) {
          if (!Array.isArray(value)) {
            throw new Error('Tags must be an array');
          }
          if (value.length > 10) {
            throw new Error('Maximum of 10 tags allowed');
          }
          value.forEach((tag, index) => {
            if (typeof tag !== 'string') {
              throw new Error(`Tag at index ${index} must be a string`);
            }
            const trimmedTag = tag.trim();
            if (trimmedTag.length < 2) {
              throw new Error(`Tag at index ${index} must be at least 2 characters`);
            }
            if (trimmedTag.length > 50) {
              throw new Error(`Tag at index ${index} must not exceed 50 characters`);
            }
            if (!/^[a-zA-Z0-9\-_\s]+$/.test(trimmedTag)) {
              throw new Error(
                `Tag at index ${index} contains invalid characters. Only letters, numbers, spaces, hyphens, and underscores are allowed`
              );
            }
          });
          // Check for duplicates
          const uniqueTags = new Set(value.map(t => t.trim().toLowerCase()));
          if (uniqueTags.size < value.length) {
            throw new Error('Duplicate tags are not allowed');
          }
        },
      },
    },
    isTemplate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        isBoolean(value: any) {
          if (typeof value !== 'boolean') {
            throw new Error('isTemplate must be a boolean value');
          }
        },
      },
    },
    templateData: {
      type: DataTypes.JSONB,
      allowNull: true,
      validate: {
        isValidJSON(value: any) {
          if (value !== null && value !== undefined) {
            try {
              JSON.stringify(value);
            } catch (error) {
              throw new Error('Template data must be valid JSON');
            }
          }
        },
      },
    },
    parentId: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUUID: {
          args: 4,
          msg: 'Parent ID must be a valid UUID',
        },
      },
    },
    retentionDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: {
          msg: 'Retention date must be a valid date',
          args: true,
        },
        isInFuture(value: Date) {
          if (value && new Date(value) < new Date()) {
            throw new Error('Retention date cannot be in the past');
          }
        },
      },
    },
    accessLevel: {
      type: DataTypes.ENUM(...Object.values(DocumentAccessLevel)),
      allowNull: false,
      defaultValue: DocumentAccessLevel.STAFF_ONLY,
      validate: {
        notNull: {
          msg: 'Access level is required',
        },
        isIn: {
          args: [Object.values(DocumentAccessLevel)],
          msg: `Access level must be one of: ${Object.values(DocumentAccessLevel).join(', ')}`,
        },
      },
    },
    /**
     * Foreign key reference to User who uploaded this document
     *
     * @type {string|null}
     * @description Links to the user who uploaded/created this document. Preserves audit trail even if user is deleted.
     * @foreignKey references users(id) ON DELETE SET NULL
     * @security Maintains audit trail and document ownership history even after user account deletion
     * @security Critical for compliance and forensic tracking of document sources
     * @compliance HIPAA - Audit trail preservation required for PHI documents
     */
    uploadedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'Foreign key to users table - document uploader (nullable for audit trail)',
      validate: {
        isUUID: {
          args: 4,
          msg: 'Uploader ID must be a valid UUID',
        },
      },
    },
    /**
     * Foreign key reference to Student this document belongs to
     *
     * @type {string|null}
     * @description Links document to specific student. When student is deleted, all their documents are removed.
     * @foreignKey references students(id) ON DELETE CASCADE
     * @security Student documents automatically removed when student record is deleted
     * @compliance FERPA - Student educational records tied to student lifecycle
     * @compliance HIPAA - Student health documents removed with student record
     */
    studentId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'students',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      comment: 'Foreign key to students table - document owner (nullable for non-student documents)',
      validate: {
        isUUID: {
          args: 4,
          msg: 'Student ID must be a valid UUID',
        },
      },
    },
    containsPHI: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indicates if document contains Protected Health Information (HIPAA)',
      validate: {
        isBoolean(value: any) {
          if (typeof value !== 'boolean') {
            throw new Error('containsPHI must be a boolean value');
          }
        },
      },
    },
    requiresSignature: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Indicates if document requires electronic signature',
      validate: {
        isBoolean(value: any) {
          if (typeof value !== 'boolean') {
            throw new Error('requiresSignature must be a boolean value');
          }
        },
      },
    },
    lastAccessedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last time document was viewed or downloaded (for audit)',
    },
    accessCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Number of times document has been accessed (for compliance)',
      validate: {
        isInt: {
          msg: 'Access count must be an integer',
        },
        min: {
          args: [0],
          msg: 'Access count cannot be negative',
        },
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'documents',
    timestamps: true,
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
    ],
    validate: {
      // Cross-field validation
      retentionDateMatchesCategory(this: Document) {
        if (this.retentionDate && this.category) {
          const retentionYears: Record<string, number> = {
            MEDICAL_RECORD: 7,
            INCIDENT_REPORT: 7,
            CONSENT_FORM: 7,
            POLICY: 5,
            TRAINING: 5,
            ADMINISTRATIVE: 3,
            STUDENT_FILE: 7,
            INSURANCE: 7,
            OTHER: 3,
          };

          const expectedYears = retentionYears[this.category as string] || 3;
          const maxRetentionDate = new Date();
          maxRetentionDate.setFullYear(maxRetentionDate.getFullYear() + expectedYears + 1);

          if (new Date(this.retentionDate) > maxRetentionDate) {
            throw new Error(
              `Retention date exceeds recommended retention period of ${expectedYears} years for ${this.category} category`
            );
          }
        }
      },
      fileExtensionMatchesMimeType(this: Document) {
        if (this.fileName && this.fileType) {
          const extension = this.fileName.substring(this.fileName.lastIndexOf('.')).toLowerCase();
          const extensionMap: Record<string, string[]> = {
            '.pdf': ['application/pdf'],
            '.doc': ['application/msword'],
            '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
            '.xls': ['application/vnd.ms-excel'],
            '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
            '.txt': ['text/plain'],
            '.csv': ['text/csv'],
            '.jpg': ['image/jpeg', 'image/jpg'],
            '.jpeg': ['image/jpeg', 'image/jpg'],
            '.png': ['image/png'],
            '.gif': ['image/gif'],
            '.webp': ['image/webp'],
          };

          const allowedMimeTypes = extensionMap[extension];
          if (allowedMimeTypes && !allowedMimeTypes.includes(this.fileType.toLowerCase().trim())) {
            throw new Error(
              `File type "${this.fileType}" does not match extension "${extension}". Expected: ${allowedMimeTypes.join(', ')}`
            );
          }
        }
      },
      templateDataRequiredForTemplates(this: Document) {
        if (this.isTemplate && !this.templateData) {
          throw new Error('Template data is required for template documents');
        }
      },
      phiCategoriesRequireStaffAccess(this: Document) {
        // Documents containing PHI must have staff-only or higher access
        const phiCategories: DocumentCategory[] = [
          DocumentCategory.MEDICAL_RECORD,
          DocumentCategory.INCIDENT_REPORT,
          DocumentCategory.CONSENT_FORM,
          DocumentCategory.INSURANCE,
        ];
        if (
          this.containsPHI ||
          phiCategories.includes(this.category)
        ) {
          if (this.accessLevel === DocumentAccessLevel.PUBLIC) {
            throw new Error(
              'Documents containing PHI cannot have PUBLIC access level. Must be STAFF_ONLY, ADMIN_ONLY, or RESTRICTED.'
            );
          }
        }
      },
      signatureRequiredForCriticalCategories(this: Document) {
        // Certain categories require signature approval
        const signatureCategories: DocumentCategory[] = [
          DocumentCategory.MEDICAL_RECORD,
          DocumentCategory.CONSENT_FORM,
          DocumentCategory.INCIDENT_REPORT,
        ];
        if (signatureCategories.includes(this.category) && !this.requiresSignature) {
          // Set default to true for these categories
          this.requiresSignature = true;
        }
      },
    },
    hooks: {
      beforeCreate: (document: Document) => {
        // Auto-set PHI flag based on category
        const phiCategories = [
          DocumentCategory.MEDICAL_RECORD,
          DocumentCategory.INCIDENT_REPORT,
          DocumentCategory.CONSENT_FORM,
          DocumentCategory.INSURANCE,
        ];
        if (phiCategories.includes(document.category)) {
          document.containsPHI = true;
        }

        // Auto-set signature requirement based on category
        const signatureCategories = [
          DocumentCategory.MEDICAL_RECORD,
          DocumentCategory.CONSENT_FORM,
          DocumentCategory.INCIDENT_REPORT,
        ];
        if (signatureCategories.includes(document.category)) {
          document.requiresSignature = true;
        }

        // Ensure PHI documents have appropriate access level
        if (document.containsPHI && document.accessLevel === DocumentAccessLevel.PUBLIC) {
          document.accessLevel = DocumentAccessLevel.STAFF_ONLY;
        }
      },
      beforeUpdate: (document: Document) => {
        // Prevent downgrading access level for PHI documents
        if (document.containsPHI && document.changed('accessLevel')) {
          const newAccessLevel = document.getDataValue('accessLevel');
          if (newAccessLevel === DocumentAccessLevel.PUBLIC) {
            throw new Error(
              'Cannot change access level to PUBLIC for documents containing PHI'
            );
          }
        }
      },
    },
  }
);
