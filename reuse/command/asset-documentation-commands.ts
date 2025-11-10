/**
 * ASSET DOCUMENTATION COMMAND FUNCTIONS
 *
 * Enterprise-grade asset documentation management system providing comprehensive
 * functionality for document management, manuals, procedures, SDS sheets, technical
 * drawings, version control, search, linking, and document lifecycle management.
 * Competes with SharePoint and Documentum solutions.
 *
 * Features:
 * - Technical documentation management
 * - Operating manuals and procedures
 * - Safety Data Sheets (SDS) management
 * - Engineering drawings and CAD files
 * - Version control and revision history
 * - Document approval workflows
 * - Full-text search and indexing
 * - Document linking and relationships
 * - Expiration and renewal tracking
 * - Compliance and regulatory documentation
 *
 * @module AssetDocumentationCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createDocument,
 *   createDocumentVersion,
 *   linkDocumentToAsset,
 *   searchDocuments,
 *   DocumentType,
 *   DocumentStatus
 * } from './asset-documentation-commands';
 *
 * // Create technical document
 * const doc = await createDocument({
 *   assetId: 'asset-123',
 *   documentType: DocumentType.OPERATING_MANUAL,
 *   title: 'CNC Machine Operating Manual',
 *   description: 'Complete operating procedures',
 *   fileUrl: 's3://docs/manual-v1.pdf',
 *   version: '1.0',
 *   createdBy: 'user-456'
 * });
 *
 * // Search documents
 * const results = await searchDocuments('safety procedures', {
 *   documentTypes: [DocumentType.SOP, DocumentType.SDS]
 * });
 * ```
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeCreate,
} from 'sequelize-typescript';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  IsArray,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions, FindOptions } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * Document Type
 */
export enum DocumentType {
  OPERATING_MANUAL = 'operating_manual',
  MAINTENANCE_MANUAL = 'maintenance_manual',
  SERVICE_MANUAL = 'service_manual',
  PARTS_CATALOG = 'parts_catalog',
  SOP = 'sop',
  WORK_INSTRUCTION = 'work_instruction',
  SDS = 'sds',
  TECHNICAL_DRAWING = 'technical_drawing',
  CAD_FILE = 'cad_file',
  SPECIFICATION = 'specification',
  CERTIFICATE = 'certificate',
  WARRANTY = 'warranty',
  COMPLIANCE_DOC = 'compliance_doc',
  INSPECTION_REPORT = 'inspection_report',
  TEST_REPORT = 'test_report',
  TRAINING_MATERIAL = 'training_material',
  POLICY = 'policy',
  PROCEDURE = 'procedure',
  OTHER = 'other',
}

/**
 * Document Status
 */
export enum DocumentStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  OBSOLETE = 'obsolete',
  EXPIRED = 'expired',
}

/**
 * Review Status
 */
export enum ReviewStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CHANGES_REQUESTED = 'changes_requested',
}

/**
 * Document Access Level
 */
export enum AccessLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
  CLASSIFIED = 'classified',
}

/**
 * File Format
 */
export enum FileFormat {
  PDF = 'pdf',
  DOCX = 'docx',
  XLSX = 'xlsx',
  PPTX = 'pptx',
  DWG = 'dwg',
  DXF = 'dxf',
  STEP = 'step',
  IGES = 'iges',
  JPG = 'jpg',
  PNG = 'png',
  MP4 = 'mp4',
  HTML = 'html',
  XML = 'xml',
  JSON = 'json',
}

/**
 * Document Data
 */
export interface DocumentData {
  assetId?: string;
  documentType: DocumentType;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileFormat: FileFormat;
  fileSize?: number;
  version: string;
  createdBy: string;
  accessLevel?: AccessLevel;
  tags?: string[];
  metadata?: Record<string, any>;
  expirationDate?: Date;
  reviewDate?: Date;
  language?: string;
}

/**
 * Document Version Data
 */
export interface DocumentVersionData {
  documentId: string;
  version: string;
  fileUrl: string;
  fileName: string;
  changes: string;
  createdBy: string;
  releaseNotes?: string;
}

/**
 * Document Link Data
 */
export interface DocumentLinkData {
  documentId: string;
  linkedDocumentId: string;
  linkType: string;
  description?: string;
}

/**
 * Review Data
 */
export interface ReviewData {
  documentId: string;
  reviewerId: string;
  dueDate: Date;
  instructions?: string;
}

/**
 * SDS Data
 */
export interface SDSData {
  documentId: string;
  chemicalName: string;
  casNumber?: string;
  manufacturer: string;
  hazards: string[];
  handlingInstructions: string;
  storageRequirements: string;
  disposalRequirements: string;
  emergencyProcedures: string;
  exposureLimits?: Record<string, any>;
}

/**
 * Drawing Data
 */
export interface DrawingData {
  documentId: string;
  drawingNumber: string;
  revision: string;
  sheetNumber?: string;
  scale?: string;
  dimensions?: Record<string, any>;
  materials?: string[];
  tolerances?: string;
}

/**
 * Search Options
 */
export interface SearchOptions {
  query?: string;
  documentTypes?: DocumentType[];
  status?: DocumentStatus[];
  assetId?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  accessLevel?: AccessLevel[];
  limit?: number;
  offset?: number;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Document Model
 */
@Table({
  tableName: 'documents',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['document_number'], unique: true },
    { fields: ['asset_id'] },
    { fields: ['document_type'] },
    { fields: ['status'] },
    { fields: ['expiration_date'] },
    { fields: ['created_by'] },
    { fields: ['tags'], using: 'gin' },
  ],
})
export class Document extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Document number' })
  @Column({ type: DataType.STRING(50), unique: true })
  @Index
  documentNumber!: string;

  @ApiProperty({ description: 'Asset ID' })
  @Column({ type: DataType.UUID })
  @Index
  assetId?: string;

  @ApiProperty({ description: 'Document type' })
  @Column({ type: DataType.ENUM(...Object.values(DocumentType)), allowNull: false })
  @Index
  documentType!: DocumentType;

  @ApiProperty({ description: 'Title' })
  @Column({ type: DataType.STRING(500), allowNull: false })
  title!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(DocumentStatus)), defaultValue: DocumentStatus.DRAFT })
  @Index
  status!: DocumentStatus;

  @ApiProperty({ description: 'File URL' })
  @Column({ type: DataType.STRING(1000), allowNull: false })
  fileUrl!: string;

  @ApiProperty({ description: 'File name' })
  @Column({ type: DataType.STRING(500), allowNull: false })
  fileName!: string;

  @ApiProperty({ description: 'File format' })
  @Column({ type: DataType.ENUM(...Object.values(FileFormat)), allowNull: false })
  fileFormat!: FileFormat;

  @ApiProperty({ description: 'File size in bytes' })
  @Column({ type: DataType.BIGINT })
  fileSize?: number;

  @ApiProperty({ description: 'Version' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  version!: string;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  createdBy!: string;

  @ApiProperty({ description: 'Last modified by user ID' })
  @Column({ type: DataType.UUID })
  lastModifiedBy?: string;

  @ApiProperty({ description: 'Approved by user ID' })
  @Column({ type: DataType.UUID })
  approvedBy?: string;

  @ApiProperty({ description: 'Approval date' })
  @Column({ type: DataType.DATE })
  approvalDate?: Date;

  @ApiProperty({ description: 'Published date' })
  @Column({ type: DataType.DATE })
  publishedDate?: Date;

  @ApiProperty({ description: 'Access level' })
  @Column({ type: DataType.ENUM(...Object.values(AccessLevel)), defaultValue: AccessLevel.INTERNAL })
  accessLevel!: AccessLevel;

  @ApiProperty({ description: 'Tags' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  tags?: string[];

  @ApiProperty({ description: 'Metadata' })
  @Column({ type: DataType.JSONB })
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Expiration date' })
  @Column({ type: DataType.DATE })
  @Index
  expirationDate?: Date;

  @ApiProperty({ description: 'Review date' })
  @Column({ type: DataType.DATE })
  reviewDate?: Date;

  @ApiProperty({ description: 'Last reviewed date' })
  @Column({ type: DataType.DATE })
  lastReviewedDate?: Date;

  @ApiProperty({ description: 'Language code' })
  @Column({ type: DataType.STRING(10) })
  language?: string;

  @ApiProperty({ description: 'Download count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  downloadCount!: number;

  @ApiProperty({ description: 'View count' })
  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  viewCount!: number;

  @ApiProperty({ description: 'Full text content for search' })
  @Column({ type: DataType.TEXT })
  fullTextContent?: string;

  @ApiProperty({ description: 'Checksum' })
  @Column({ type: DataType.STRING(100) })
  checksum?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @HasMany(() => DocumentVersion)
  versions?: DocumentVersion[];

  @HasMany(() => DocumentReview)
  reviews?: DocumentReview[];

  @HasMany(() => DocumentLink, 'documentId')
  outgoingLinks?: DocumentLink[];

  @HasMany(() => DocumentLink, 'linkedDocumentId')
  incomingLinks?: DocumentLink[];

  @BeforeCreate
  static async generateDocumentNumber(instance: Document) {
    if (!instance.documentNumber) {
      const count = await Document.count();
      const year = new Date().getFullYear();
      const prefix = instance.documentType.toUpperCase().substring(0, 3);
      instance.documentNumber = `DOC-${prefix}-${year}-${String(count + 1).padStart(6, '0')}`;
    }
  }
}

/**
 * Document Version Model
 */
@Table({
  tableName: 'document_versions',
  timestamps: true,
  indexes: [
    { fields: ['document_id'] },
    { fields: ['version'] },
    { fields: ['created_at'] },
  ],
})
export class DocumentVersion extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Document ID' })
  @ForeignKey(() => Document)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  documentId!: string;

  @ApiProperty({ description: 'Version' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  version!: string;

  @ApiProperty({ description: 'Previous version' })
  @Column({ type: DataType.STRING(50) })
  previousVersion?: string;

  @ApiProperty({ description: 'File URL' })
  @Column({ type: DataType.STRING(1000), allowNull: false })
  fileUrl!: string;

  @ApiProperty({ description: 'File name' })
  @Column({ type: DataType.STRING(500), allowNull: false })
  fileName!: string;

  @ApiProperty({ description: 'File size' })
  @Column({ type: DataType.BIGINT })
  fileSize?: number;

  @ApiProperty({ description: 'Changes description' })
  @Column({ type: DataType.TEXT, allowNull: false })
  changes!: string;

  @ApiProperty({ description: 'Release notes' })
  @Column({ type: DataType.TEXT })
  releaseNotes?: string;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  createdBy!: string;

  @ApiProperty({ description: 'Checksum' })
  @Column({ type: DataType.STRING(100) })
  checksum?: string;

  @CreatedAt
  @Index
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Document)
  document?: Document;
}

/**
 * Document Link Model
 */
@Table({
  tableName: 'document_links',
  timestamps: true,
  indexes: [
    { fields: ['document_id'] },
    { fields: ['linked_document_id'] },
    { fields: ['link_type'] },
  ],
})
export class DocumentLink extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Document ID' })
  @ForeignKey(() => Document)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  documentId!: string;

  @ApiProperty({ description: 'Linked document ID' })
  @ForeignKey(() => Document)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  linkedDocumentId!: string;

  @ApiProperty({ description: 'Link type' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  linkType!: string;

  @ApiProperty({ description: 'Description' })
  @Column({ type: DataType.TEXT })
  description?: string;

  @ApiProperty({ description: 'Created by user ID' })
  @Column({ type: DataType.UUID })
  createdBy?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Document, 'documentId')
  sourceDocument?: Document;

  @BelongsTo(() => Document, 'linkedDocumentId')
  targetDocument?: Document;
}

/**
 * Document Review Model
 */
@Table({
  tableName: 'document_reviews',
  timestamps: true,
  indexes: [
    { fields: ['document_id'] },
    { fields: ['reviewer_id'] },
    { fields: ['status'] },
    { fields: ['due_date'] },
  ],
})
export class DocumentReview extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Document ID' })
  @ForeignKey(() => Document)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  documentId!: string;

  @ApiProperty({ description: 'Reviewer user ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  reviewerId!: string;

  @ApiProperty({ description: 'Status' })
  @Column({ type: DataType.ENUM(...Object.values(ReviewStatus)), defaultValue: ReviewStatus.PENDING })
  @Index
  status!: ReviewStatus;

  @ApiProperty({ description: 'Due date' })
  @Column({ type: DataType.DATE, allowNull: false })
  @Index
  dueDate!: Date;

  @ApiProperty({ description: 'Started date' })
  @Column({ type: DataType.DATE })
  startedDate?: Date;

  @ApiProperty({ description: 'Completed date' })
  @Column({ type: DataType.DATE })
  completedDate?: Date;

  @ApiProperty({ description: 'Instructions' })
  @Column({ type: DataType.TEXT })
  instructions?: string;

  @ApiProperty({ description: 'Comments' })
  @Column({ type: DataType.TEXT })
  comments?: string;

  @ApiProperty({ description: 'Changes requested' })
  @Column({ type: DataType.TEXT })
  changesRequested?: string;

  @ApiProperty({ description: 'Approved' })
  @Column({ type: DataType.BOOLEAN })
  approved?: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Document)
  document?: Document;
}

/**
 * SDS (Safety Data Sheet) Model
 */
@Table({
  tableName: 'safety_data_sheets',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['document_id'], unique: true },
    { fields: ['chemical_name'] },
    { fields: ['cas_number'] },
    { fields: ['manufacturer'] },
  ],
})
export class SafetyDataSheet extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Document ID' })
  @ForeignKey(() => Document)
  @Column({ type: DataType.UUID, unique: true, allowNull: false })
  @Index
  documentId!: string;

  @ApiProperty({ description: 'Chemical name' })
  @Column({ type: DataType.STRING(300), allowNull: false })
  @Index
  chemicalName!: string;

  @ApiProperty({ description: 'CAS number' })
  @Column({ type: DataType.STRING(50) })
  @Index
  casNumber?: string;

  @ApiProperty({ description: 'Manufacturer' })
  @Column({ type: DataType.STRING(300), allowNull: false })
  @Index
  manufacturer!: string;

  @ApiProperty({ description: 'Hazards' })
  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  hazards!: string[];

  @ApiProperty({ description: 'Handling instructions' })
  @Column({ type: DataType.TEXT, allowNull: false })
  handlingInstructions!: string;

  @ApiProperty({ description: 'Storage requirements' })
  @Column({ type: DataType.TEXT, allowNull: false })
  storageRequirements!: string;

  @ApiProperty({ description: 'Disposal requirements' })
  @Column({ type: DataType.TEXT, allowNull: false })
  disposalRequirements!: string;

  @ApiProperty({ description: 'Emergency procedures' })
  @Column({ type: DataType.TEXT, allowNull: false })
  emergencyProcedures!: string;

  @ApiProperty({ description: 'Exposure limits' })
  @Column({ type: DataType.JSONB })
  exposureLimits?: Record<string, any>;

  @ApiProperty({ description: 'PPE requirements' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  ppeRequirements?: string[];

  @ApiProperty({ description: 'First aid measures' })
  @Column({ type: DataType.TEXT })
  firstAidMeasures?: string;

  @ApiProperty({ description: 'Fire fighting measures' })
  @Column({ type: DataType.TEXT })
  fireFightingMeasures?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => Document)
  document?: Document;
}

/**
 * Technical Drawing Model
 */
@Table({
  tableName: 'technical_drawings',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['document_id'], unique: true },
    { fields: ['drawing_number'], unique: true },
    { fields: ['revision'] },
  ],
})
export class TechnicalDrawing extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Document ID' })
  @ForeignKey(() => Document)
  @Column({ type: DataType.UUID, unique: true, allowNull: false })
  @Index
  documentId!: string;

  @ApiProperty({ description: 'Drawing number' })
  @Column({ type: DataType.STRING(100), unique: true, allowNull: false })
  @Index
  drawingNumber!: string;

  @ApiProperty({ description: 'Revision' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  revision!: string;

  @ApiProperty({ description: 'Sheet number' })
  @Column({ type: DataType.STRING(50) })
  sheetNumber?: string;

  @ApiProperty({ description: 'Scale' })
  @Column({ type: DataType.STRING(50) })
  scale?: string;

  @ApiProperty({ description: 'Dimensions' })
  @Column({ type: DataType.JSONB })
  dimensions?: Record<string, any>;

  @ApiProperty({ description: 'Materials' })
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  materials?: string[];

  @ApiProperty({ description: 'Tolerances' })
  @Column({ type: DataType.STRING(500) })
  tolerances?: string;

  @ApiProperty({ description: 'Drawing type' })
  @Column({ type: DataType.STRING(100) })
  drawingType?: string;

  @ApiProperty({ description: 'Created in CAD software' })
  @Column({ type: DataType.STRING(100) })
  cadSoftware?: string;

  @ApiProperty({ description: 'Designed by' })
  @Column({ type: DataType.UUID })
  designedBy?: string;

  @ApiProperty({ description: 'Checked by' })
  @Column({ type: DataType.UUID })
  checkedBy?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;

  @BelongsTo(() => Document)
  document?: Document;
}

/**
 * Document Access Log Model
 */
@Table({
  tableName: 'document_access_logs',
  timestamps: true,
  indexes: [
    { fields: ['document_id'] },
    { fields: ['user_id'] },
    { fields: ['action'] },
    { fields: ['accessed_at'] },
  ],
})
export class DocumentAccessLog extends Model {
  @ApiProperty({ description: 'Unique identifier' })
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ApiProperty({ description: 'Document ID' })
  @ForeignKey(() => Document)
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  documentId!: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ type: DataType.UUID, allowNull: false })
  @Index
  userId!: string;

  @ApiProperty({ description: 'Action' })
  @Column({ type: DataType.STRING(50), allowNull: false })
  @Index
  action!: string;

  @ApiProperty({ description: 'Accessed at' })
  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  @Index
  accessedAt!: Date;

  @ApiProperty({ description: 'IP address' })
  @Column({ type: DataType.STRING(50) })
  ipAddress?: string;

  @ApiProperty({ description: 'User agent' })
  @Column({ type: DataType.STRING(500) })
  userAgent?: string;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @BelongsTo(() => Document)
  document?: Document;
}

// ============================================================================
// DOCUMENT MANAGEMENT FUNCTIONS
// ============================================================================

/**
 * Creates a document
 *
 * @param data - Document data
 * @param transaction - Optional database transaction
 * @returns Created document
 *
 * @example
 * ```typescript
 * const doc = await createDocument({
 *   assetId: 'asset-123',
 *   documentType: DocumentType.OPERATING_MANUAL,
 *   title: 'Machine Operating Manual',
 *   fileUrl: 's3://docs/manual.pdf',
 *   fileName: 'manual.pdf',
 *   fileFormat: FileFormat.PDF,
 *   version: '1.0',
 *   createdBy: 'user-456',
 *   tags: ['manual', 'operations']
 * });
 * ```
 */
export async function createDocument(
  data: DocumentData,
  transaction?: Transaction
): Promise<Document> {
  const doc = await Document.create(
    {
      ...data,
      status: DocumentStatus.DRAFT,
    },
    { transaction }
  );

  // Create initial version
  await DocumentVersion.create({
    documentId: doc.id,
    version: data.version,
    fileUrl: data.fileUrl,
    fileName: data.fileName,
    fileSize: data.fileSize,
    changes: 'Initial version',
    createdBy: data.createdBy,
  }, { transaction });

  return doc;
}

/**
 * Updates document
 *
 * @param documentId - Document ID
 * @param updates - Fields to update
 * @param userId - User making update
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await updateDocument('doc-123', {
 *   title: 'Updated Manual Title',
 *   tags: ['manual', 'operations', 'safety']
 * }, 'user-456');
 * ```
 */
export async function updateDocument(
  documentId: string,
  updates: Partial<Document>,
  userId: string,
  transaction?: Transaction
): Promise<Document> {
  const doc = await Document.findByPk(documentId, { transaction });
  if (!doc) {
    throw new NotFoundException(`Document ${documentId} not found`);
  }

  await doc.update({ ...updates, lastModifiedBy: userId }, { transaction });
  return doc;
}

/**
 * Gets document by ID
 *
 * @param documentId - Document ID
 * @param includeVersions - Include version history
 * @returns Document
 *
 * @example
 * ```typescript
 * const doc = await getDocument('doc-123', true);
 * ```
 */
export async function getDocument(
  documentId: string,
  includeVersions: boolean = false
): Promise<Document> {
  const include: any[] = [];
  if (includeVersions) {
    include.push({ model: DocumentVersion, as: 'versions' });
  }

  const doc = await Document.findByPk(documentId, { include });
  if (!doc) {
    throw new NotFoundException(`Document ${documentId} not found`);
  }

  return doc;
}

/**
 * Gets documents by asset
 *
 * @param assetId - Asset ID
 * @param documentType - Optional document type filter
 * @returns Documents
 *
 * @example
 * ```typescript
 * const docs = await getDocumentsByAsset('asset-123', DocumentType.SDS);
 * ```
 */
export async function getDocumentsByAsset(
  assetId: string,
  documentType?: DocumentType
): Promise<Document[]> {
  const where: WhereOptions = { assetId };
  if (documentType) {
    where.documentType = documentType;
  }

  return Document.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });
}

/**
 * Publishes document
 *
 * @param documentId - Document ID
 * @param userId - User publishing
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await publishDocument('doc-123', 'user-456');
 * ```
 */
export async function publishDocument(
  documentId: string,
  userId: string,
  transaction?: Transaction
): Promise<Document> {
  const doc = await Document.findByPk(documentId, { transaction });
  if (!doc) {
    throw new NotFoundException(`Document ${documentId} not found`);
  }

  if (doc.status !== DocumentStatus.APPROVED) {
    throw new BadRequestException('Document must be approved before publishing');
  }

  await doc.update({
    status: DocumentStatus.PUBLISHED,
    publishedDate: new Date(),
    lastModifiedBy: userId,
  }, { transaction });

  return doc;
}

/**
 * Archives document
 *
 * @param documentId - Document ID
 * @param userId - User archiving
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await archiveDocument('doc-123', 'user-456');
 * ```
 */
export async function archiveDocument(
  documentId: string,
  userId: string,
  transaction?: Transaction
): Promise<Document> {
  const doc = await Document.findByPk(documentId, { transaction });
  if (!doc) {
    throw new NotFoundException(`Document ${documentId} not found`);
  }

  await doc.update({
    status: DocumentStatus.ARCHIVED,
    lastModifiedBy: userId,
  }, { transaction });

  return doc;
}

/**
 * Deletes document (soft delete)
 *
 * @param documentId - Document ID
 * @param userId - User deleting
 * @param transaction - Optional database transaction
 * @returns Deleted document
 *
 * @example
 * ```typescript
 * await deleteDocument('doc-123', 'user-456');
 * ```
 */
export async function deleteDocument(
  documentId: string,
  userId: string,
  transaction?: Transaction
): Promise<Document> {
  const doc = await Document.findByPk(documentId, { transaction });
  if (!doc) {
    throw new NotFoundException(`Document ${documentId} not found`);
  }

  await doc.update({ lastModifiedBy: userId }, { transaction });
  await doc.destroy({ transaction });

  return doc;
}

// ============================================================================
// VERSION CONTROL FUNCTIONS
// ============================================================================

/**
 * Creates document version
 *
 * @param data - Version data
 * @param transaction - Optional database transaction
 * @returns Created version
 *
 * @example
 * ```typescript
 * const version = await createDocumentVersion({
 *   documentId: 'doc-123',
 *   version: '2.0',
 *   fileUrl: 's3://docs/manual-v2.pdf',
 *   fileName: 'manual-v2.pdf',
 *   changes: 'Updated safety procedures',
 *   createdBy: 'user-456',
 *   releaseNotes: 'Major update with new safety guidelines'
 * });
 * ```
 */
export async function createDocumentVersion(
  data: DocumentVersionData,
  transaction?: Transaction
): Promise<DocumentVersion> {
  const doc = await Document.findByPk(data.documentId, { transaction });
  if (!doc) {
    throw new NotFoundException(`Document ${data.documentId} not found`);
  }

  // Get previous version
  const previousVersion = await DocumentVersion.findOne({
    where: { documentId: data.documentId },
    order: [['createdAt', 'DESC']],
    transaction,
  });

  const version = await DocumentVersion.create(
    {
      ...data,
      previousVersion: previousVersion?.version,
    },
    { transaction }
  );

  // Update document
  await doc.update({
    version: data.version,
    fileUrl: data.fileUrl,
    fileName: data.fileName,
    lastModifiedBy: data.createdBy,
  }, { transaction });

  return version;
}

/**
 * Gets version history
 *
 * @param documentId - Document ID
 * @returns Version history
 *
 * @example
 * ```typescript
 * const history = await getVersionHistory('doc-123');
 * ```
 */
export async function getVersionHistory(
  documentId: string
): Promise<DocumentVersion[]> {
  return DocumentVersion.findAll({
    where: { documentId },
    order: [['createdAt', 'DESC']],
  });
}

/**
 * Reverts to previous version
 *
 * @param documentId - Document ID
 * @param versionId - Version to revert to
 * @param userId - User performing revert
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await revertToVersion('doc-123', 'version-456', 'user-789');
 * ```
 */
export async function revertToVersion(
  documentId: string,
  versionId: string,
  userId: string,
  transaction?: Transaction
): Promise<Document> {
  const version = await DocumentVersion.findByPk(versionId, { transaction });
  if (!version || version.documentId !== documentId) {
    throw new NotFoundException('Version not found');
  }

  const doc = await Document.findByPk(documentId, { transaction });
  if (!doc) {
    throw new NotFoundException(`Document ${documentId} not found`);
  }

  // Create new version marking revert
  await DocumentVersion.create({
    documentId,
    version: `${doc.version}-revert`,
    previousVersion: doc.version,
    fileUrl: version.fileUrl,
    fileName: version.fileName,
    fileSize: version.fileSize,
    changes: `Reverted to version ${version.version}`,
    createdBy: userId,
  }, { transaction });

  await doc.update({
    fileUrl: version.fileUrl,
    fileName: version.fileName,
    version: `${doc.version}-revert`,
    lastModifiedBy: userId,
  }, { transaction });

  return doc;
}

/**
 * Compares two versions
 *
 * @param documentId - Document ID
 * @param version1 - First version
 * @param version2 - Second version
 * @returns Comparison data
 *
 * @example
 * ```typescript
 * const diff = await compareVersions('doc-123', '1.0', '2.0');
 * ```
 */
export async function compareVersions(
  documentId: string,
  version1: string,
  version2: string
): Promise<{
  version1: DocumentVersion;
  version2: DocumentVersion;
  timeDiff: number;
  sizeDiff: number;
}> {
  const v1 = await DocumentVersion.findOne({
    where: { documentId, version: version1 },
  });

  const v2 = await DocumentVersion.findOne({
    where: { documentId, version: version2 },
  });

  if (!v1 || !v2) {
    throw new NotFoundException('One or both versions not found');
  }

  const timeDiff = v2.createdAt.getTime() - v1.createdAt.getTime();
  const sizeDiff = (v2.fileSize || 0) - (v1.fileSize || 0);

  return {
    version1: v1,
    version2: v2,
    timeDiff,
    sizeDiff,
  };
}

// ============================================================================
// DOCUMENT LINKING FUNCTIONS
// ============================================================================

/**
 * Links documents
 *
 * @param data - Link data
 * @param transaction - Optional database transaction
 * @returns Created link
 *
 * @example
 * ```typescript
 * await linkDocuments({
 *   documentId: 'doc-123',
 *   linkedDocumentId: 'doc-456',
 *   linkType: 'references',
 *   description: 'Operating manual references SDS'
 * });
 * ```
 */
export async function linkDocuments(
  data: DocumentLinkData,
  transaction?: Transaction
): Promise<DocumentLink> {
  const doc1 = await Document.findByPk(data.documentId, { transaction });
  const doc2 = await Document.findByPk(data.linkedDocumentId, { transaction });

  if (!doc1 || !doc2) {
    throw new NotFoundException('One or both documents not found');
  }

  // Check for existing link
  const existing = await DocumentLink.findOne({
    where: {
      documentId: data.documentId,
      linkedDocumentId: data.linkedDocumentId,
      linkType: data.linkType,
    },
    transaction,
  });

  if (existing) {
    throw new ConflictException('Link already exists');
  }

  const link = await DocumentLink.create(data, { transaction });
  return link;
}

/**
 * Unlinks documents
 *
 * @param linkId - Link ID
 * @param transaction - Optional database transaction
 * @returns Deleted link
 *
 * @example
 * ```typescript
 * await unlinkDocuments('link-123');
 * ```
 */
export async function unlinkDocuments(
  linkId: string,
  transaction?: Transaction
): Promise<DocumentLink> {
  const link = await DocumentLink.findByPk(linkId, { transaction });
  if (!link) {
    throw new NotFoundException(`Link ${linkId} not found`);
  }

  await link.destroy({ transaction });
  return link;
}

/**
 * Gets linked documents
 *
 * @param documentId - Document ID
 * @param direction - 'outgoing', 'incoming', or 'both'
 * @returns Linked documents
 *
 * @example
 * ```typescript
 * const links = await getLinkedDocuments('doc-123', 'both');
 * ```
 */
export async function getLinkedDocuments(
  documentId: string,
  direction: 'outgoing' | 'incoming' | 'both' = 'both'
): Promise<DocumentLink[]> {
  const where: WhereOptions = {};

  if (direction === 'outgoing') {
    where.documentId = documentId;
  } else if (direction === 'incoming') {
    where.linkedDocumentId = documentId;
  } else {
    where[Op.or] = [
      { documentId },
      { linkedDocumentId: documentId },
    ];
  }

  return DocumentLink.findAll({
    where,
    include: [
      { model: Document, as: 'sourceDocument' },
      { model: Document, as: 'targetDocument' },
    ],
  });
}

/**
 * Links document to asset
 *
 * @param documentId - Document ID
 * @param assetId - Asset ID
 * @param userId - User creating link
 * @param transaction - Optional database transaction
 * @returns Updated document
 *
 * @example
 * ```typescript
 * await linkDocumentToAsset('doc-123', 'asset-456', 'user-789');
 * ```
 */
export async function linkDocumentToAsset(
  documentId: string,
  assetId: string,
  userId: string,
  transaction?: Transaction
): Promise<Document> {
  const doc = await Document.findByPk(documentId, { transaction });
  if (!doc) {
    throw new NotFoundException(`Document ${documentId} not found`);
  }

  await doc.update({
    assetId,
    lastModifiedBy: userId,
  }, { transaction });

  return doc;
}

// ============================================================================
// REVIEW WORKFLOW FUNCTIONS
// ============================================================================

/**
 * Creates document review
 *
 * @param data - Review data
 * @param transaction - Optional database transaction
 * @returns Created review
 *
 * @example
 * ```typescript
 * const review = await createDocumentReview({
 *   documentId: 'doc-123',
 *   reviewerId: 'reviewer-456',
 *   dueDate: new Date('2024-12-31'),
 *   instructions: 'Please review for technical accuracy'
 * });
 * ```
 */
export async function createDocumentReview(
  data: ReviewData,
  transaction?: Transaction
): Promise<DocumentReview> {
  const doc = await Document.findByPk(data.documentId, { transaction });
  if (!doc) {
    throw new NotFoundException(`Document ${data.documentId} not found`);
  }

  const review = await DocumentReview.create(
    {
      ...data,
      status: ReviewStatus.PENDING,
    },
    { transaction }
  );

  // Update document status
  await doc.update({
    status: DocumentStatus.IN_REVIEW,
  }, { transaction });

  return review;
}

/**
 * Starts review
 *
 * @param reviewId - Review ID
 * @param transaction - Optional database transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await startReview('review-123');
 * ```
 */
export async function startReview(
  reviewId: string,
  transaction?: Transaction
): Promise<DocumentReview> {
  const review = await DocumentReview.findByPk(reviewId, { transaction });
  if (!review) {
    throw new NotFoundException(`Review ${reviewId} not found`);
  }

  await review.update({
    status: ReviewStatus.IN_PROGRESS,
    startedDate: new Date(),
  }, { transaction });

  return review;
}

/**
 * Approves document in review
 *
 * @param reviewId - Review ID
 * @param comments - Approval comments
 * @param transaction - Optional database transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await approveDocumentReview('review-123', 'Approved - looks good');
 * ```
 */
export async function approveDocumentReview(
  reviewId: string,
  comments?: string,
  transaction?: Transaction
): Promise<DocumentReview> {
  const review = await DocumentReview.findByPk(reviewId, {
    include: [{ model: Document }],
    transaction,
  });

  if (!review) {
    throw new NotFoundException(`Review ${reviewId} not found`);
  }

  await review.update({
    status: ReviewStatus.APPROVED,
    approved: true,
    completedDate: new Date(),
    comments,
  }, { transaction });

  // Update document
  const doc = review.document!;
  await doc.update({
    status: DocumentStatus.APPROVED,
    approvedBy: review.reviewerId,
    approvalDate: new Date(),
    lastReviewedDate: new Date(),
  }, { transaction });

  return review;
}

/**
 * Rejects document in review
 *
 * @param reviewId - Review ID
 * @param reason - Rejection reason
 * @param changesRequested - Changes requested
 * @param transaction - Optional database transaction
 * @returns Updated review
 *
 * @example
 * ```typescript
 * await rejectDocumentReview('review-123', 'Technical inaccuracies found', 'Update section 3.2');
 * ```
 */
export async function rejectDocumentReview(
  reviewId: string,
  reason: string,
  changesRequested?: string,
  transaction?: Transaction
): Promise<DocumentReview> {
  const review = await DocumentReview.findByPk(reviewId, {
    include: [{ model: Document }],
    transaction,
  });

  if (!review) {
    throw new NotFoundException(`Review ${reviewId} not found`);
  }

  const status = changesRequested
    ? ReviewStatus.CHANGES_REQUESTED
    : ReviewStatus.REJECTED;

  await review.update({
    status,
    approved: false,
    completedDate: new Date(),
    comments: reason,
    changesRequested,
  }, { transaction });

  // Update document
  const doc = review.document!;
  await doc.update({
    status: DocumentStatus.DRAFT,
  }, { transaction });

  return review;
}

/**
 * Gets pending reviews
 *
 * @param reviewerId - Optional reviewer filter
 * @returns Pending reviews
 *
 * @example
 * ```typescript
 * const myReviews = await getPendingReviews('reviewer-123');
 * ```
 */
export async function getPendingReviews(
  reviewerId?: string
): Promise<DocumentReview[]> {
  const where: WhereOptions = {
    status: { [Op.in]: [ReviewStatus.PENDING, ReviewStatus.IN_PROGRESS] },
  };

  if (reviewerId) {
    where.reviewerId = reviewerId;
  }

  return DocumentReview.findAll({
    where,
    include: [{ model: Document }],
    order: [['dueDate', 'ASC']],
  });
}

// ============================================================================
// SEARCH FUNCTIONS
// ============================================================================

/**
 * Searches documents
 *
 * @param query - Search query
 * @param options - Search options
 * @returns Search results
 *
 * @example
 * ```typescript
 * const results = await searchDocuments('safety procedures', {
 *   documentTypes: [DocumentType.SOP, DocumentType.SDS],
 *   tags: ['safety'],
 *   dateFrom: new Date('2024-01-01')
 * });
 * ```
 */
export async function searchDocuments(
  query: string,
  options: SearchOptions = {}
): Promise<Document[]> {
  const where: WhereOptions = {};

  if (query) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${query}%` } },
      { description: { [Op.iLike]: `%${query}%` } },
      { fullTextContent: { [Op.iLike]: `%${query}%` } },
    ];
  }

  if (options.documentTypes && options.documentTypes.length > 0) {
    where.documentType = { [Op.in]: options.documentTypes };
  }

  if (options.status && options.status.length > 0) {
    where.status = { [Op.in]: options.status };
  }

  if (options.assetId) {
    where.assetId = options.assetId;
  }

  if (options.tags && options.tags.length > 0) {
    where.tags = { [Op.overlap]: options.tags };
  }

  if (options.accessLevel && options.accessLevel.length > 0) {
    where.accessLevel = { [Op.in]: options.accessLevel };
  }

  if (options.dateFrom || options.dateTo) {
    where.createdAt = {};
    if (options.dateFrom) {
      (where.createdAt as any)[Op.gte] = options.dateFrom;
    }
    if (options.dateTo) {
      (where.createdAt as any)[Op.lte] = options.dateTo;
    }
  }

  return Document.findAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: options.limit || 100,
    offset: options.offset || 0,
  });
}

/**
 * Searches by tags
 *
 * @param tags - Tags to search
 * @returns Documents
 *
 * @example
 * ```typescript
 * const docs = await searchByTags(['manual', 'operations']);
 * ```
 */
export async function searchByTags(tags: string[]): Promise<Document[]> {
  return Document.findAll({
    where: {
      tags: { [Op.overlap]: tags },
    },
    order: [['createdAt', 'DESC']],
  });
}

/**
 * Gets expiring documents
 *
 * @param daysAhead - Days to look ahead
 * @returns Expiring documents
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringDocuments(30); // Next 30 days
 * ```
 */
export async function getExpiringDocuments(
  daysAhead: number = 30
): Promise<Document[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return Document.findAll({
    where: {
      expirationDate: {
        [Op.between]: [new Date(), futureDate],
      },
      status: { [Op.notIn]: [DocumentStatus.ARCHIVED, DocumentStatus.OBSOLETE] },
    },
    order: [['expirationDate', 'ASC']],
  });
}

/**
 * Gets documents due for review
 *
 * @param daysAhead - Days to look ahead
 * @returns Documents due for review
 *
 * @example
 * ```typescript
 * const dueForReview = await getDocumentsDueForReview(14);
 * ```
 */
export async function getDocumentsDueForReview(
  daysAhead: number = 30
): Promise<Document[]> {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + daysAhead);

  return Document.findAll({
    where: {
      reviewDate: {
        [Op.lte]: futureDate,
      },
      status: DocumentStatus.PUBLISHED,
    },
    order: [['reviewDate', 'ASC']],
  });
}

// ============================================================================
// SDS FUNCTIONS
// ============================================================================

/**
 * Creates Safety Data Sheet
 *
 * @param data - SDS data
 * @param transaction - Optional database transaction
 * @returns Created SDS
 *
 * @example
 * ```typescript
 * const sds = await createSDS({
 *   documentId: 'doc-123',
 *   chemicalName: 'Acetone',
 *   casNumber: '67-64-1',
 *   manufacturer: 'Chemical Co',
 *   hazards: ['Flammable', 'Irritant'],
 *   handlingInstructions: 'Use in well-ventilated area',
 *   storageRequirements: 'Store in cool, dry place',
 *   disposalRequirements: 'Dispose as hazardous waste',
 *   emergencyProcedures: 'In case of spill, evacuate area'
 * });
 * ```
 */
export async function createSDS(
  data: SDSData,
  transaction?: Transaction
): Promise<SafetyDataSheet> {
  const doc = await Document.findByPk(data.documentId, { transaction });
  if (!doc) {
    throw new NotFoundException(`Document ${data.documentId} not found`);
  }

  if (doc.documentType !== DocumentType.SDS) {
    throw new BadRequestException('Document must be of type SDS');
  }

  const sds = await SafetyDataSheet.create(data, { transaction });
  return sds;
}

/**
 * Gets SDS by chemical name
 *
 * @param chemicalName - Chemical name
 * @returns SDS records
 *
 * @example
 * ```typescript
 * const sds = await getSDSByChemical('Acetone');
 * ```
 */
export async function getSDSByChemical(
  chemicalName: string
): Promise<SafetyDataSheet[]> {
  return SafetyDataSheet.findAll({
    where: {
      chemicalName: { [Op.iLike]: `%${chemicalName}%` },
    },
    include: [{ model: Document }],
    order: [['createdAt', 'DESC']],
  });
}

/**
 * Gets SDS by CAS number
 *
 * @param casNumber - CAS number
 * @returns SDS record
 *
 * @example
 * ```typescript
 * const sds = await getSDSByCAS('67-64-1');
 * ```
 */
export async function getSDSByCAS(
  casNumber: string
): Promise<SafetyDataSheet | null> {
  return SafetyDataSheet.findOne({
    where: { casNumber },
    include: [{ model: Document }],
  });
}

// ============================================================================
// TECHNICAL DRAWING FUNCTIONS
// ============================================================================

/**
 * Creates technical drawing
 *
 * @param data - Drawing data
 * @param transaction - Optional database transaction
 * @returns Created drawing
 *
 * @example
 * ```typescript
 * const drawing = await createTechnicalDrawing({
 *   documentId: 'doc-123',
 *   drawingNumber: 'DWG-2024-001',
 *   revision: 'A',
 *   scale: '1:10',
 *   materials: ['Steel', 'Aluminum']
 * });
 * ```
 */
export async function createTechnicalDrawing(
  data: DrawingData,
  transaction?: Transaction
): Promise<TechnicalDrawing> {
  const doc = await Document.findByPk(data.documentId, { transaction });
  if (!doc) {
    throw new NotFoundException(`Document ${data.documentId} not found`);
  }

  const drawing = await TechnicalDrawing.create(data, { transaction });
  return drawing;
}

/**
 * Gets drawing by number
 *
 * @param drawingNumber - Drawing number
 * @returns Drawing record
 *
 * @example
 * ```typescript
 * const drawing = await getDrawingByNumber('DWG-2024-001');
 * ```
 */
export async function getDrawingByNumber(
  drawingNumber: string
): Promise<TechnicalDrawing | null> {
  return TechnicalDrawing.findOne({
    where: { drawingNumber },
    include: [{ model: Document }],
  });
}

/**
 * Gets drawings by revision
 *
 * @param drawingNumber - Drawing number
 * @returns Drawing revisions
 *
 * @example
 * ```typescript
 * const revisions = await getDrawingRevisions('DWG-2024-001');
 * ```
 */
export async function getDrawingRevisions(
  drawingNumber: string
): Promise<TechnicalDrawing[]> {
  return TechnicalDrawing.findAll({
    where: {
      drawingNumber: { [Op.like]: `${drawingNumber}%` },
    },
    include: [{ model: Document }],
    order: [['revision', 'DESC']],
  });
}

// ============================================================================
// ACCESS LOGGING FUNCTIONS
// ============================================================================

/**
 * Logs document access
 *
 * @param documentId - Document ID
 * @param userId - User ID
 * @param action - Action performed
 * @param metadata - Additional metadata
 * @param transaction - Optional database transaction
 * @returns Access log entry
 *
 * @example
 * ```typescript
 * await logDocumentAccess('doc-123', 'user-456', 'view', { ipAddress: '192.168.1.1' });
 * ```
 */
export async function logDocumentAccess(
  documentId: string,
  userId: string,
  action: string,
  metadata?: { ipAddress?: string; userAgent?: string },
  transaction?: Transaction
): Promise<DocumentAccessLog> {
  const log = await DocumentAccessLog.create(
    {
      documentId,
      userId,
      action,
      accessedAt: new Date(),
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    },
    { transaction }
  );

  // Update document counters
  if (action === 'view') {
    await Document.increment('viewCount', {
      where: { id: documentId },
      transaction,
    });
  } else if (action === 'download') {
    await Document.increment('downloadCount', {
      where: { id: documentId },
      transaction,
    });
  }

  return log;
}

/**
 * Gets access logs for document
 *
 * @param documentId - Document ID
 * @param limit - Maximum logs to return
 * @returns Access logs
 *
 * @example
 * ```typescript
 * const logs = await getDocumentAccessLogs('doc-123', 50);
 * ```
 */
export async function getDocumentAccessLogs(
  documentId: string,
  limit: number = 100
): Promise<DocumentAccessLog[]> {
  return DocumentAccessLog.findAll({
    where: { documentId },
    order: [['accessedAt', 'DESC']],
    limit,
  });
}

/**
 * Gets user access history
 *
 * @param userId - User ID
 * @param limit - Maximum logs to return
 * @returns Access logs
 *
 * @example
 * ```typescript
 * const history = await getUserAccessHistory('user-123', 20);
 * ```
 */
export async function getUserAccessHistory(
  userId: string,
  limit: number = 100
): Promise<DocumentAccessLog[]> {
  return DocumentAccessLog.findAll({
    where: { userId },
    include: [{ model: Document }],
    order: [['accessedAt', 'DESC']],
    limit,
  });
}

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Bulk updates document status
 *
 * @param documentIds - Document IDs
 * @param status - New status
 * @param userId - User making update
 * @param transaction - Optional database transaction
 * @returns Number of updated documents
 *
 * @example
 * ```typescript
 * await bulkUpdateStatus(['doc-1', 'doc-2'], DocumentStatus.PUBLISHED, 'user-123');
 * ```
 */
export async function bulkUpdateStatus(
  documentIds: string[],
  status: DocumentStatus,
  userId: string,
  transaction?: Transaction
): Promise<number> {
  const [count] = await Document.update(
    { status, lastModifiedBy: userId },
    { where: { id: { [Op.in]: documentIds } }, transaction }
  );

  return count;
}

/**
 * Bulk adds tags
 *
 * @param documentIds - Document IDs
 * @param tags - Tags to add
 * @param userId - User adding tags
 * @param transaction - Optional database transaction
 * @returns Updated documents
 *
 * @example
 * ```typescript
 * await bulkAddTags(['doc-1', 'doc-2'], ['safety', 'critical'], 'user-123');
 * ```
 */
export async function bulkAddTags(
  documentIds: string[],
  tags: string[],
  userId: string,
  transaction?: Transaction
): Promise<Document[]> {
  const docs = await Document.findAll({
    where: { id: { [Op.in]: documentIds } },
    transaction,
  });

  for (const doc of docs) {
    const existingTags = doc.tags || [];
    const newTags = Array.from(new Set([...existingTags, ...tags]));
    await doc.update({ tags: newTags, lastModifiedBy: userId }, { transaction });
  }

  return docs;
}

/**
 * Bulk exports documents
 *
 * @param documentIds - Document IDs
 * @returns Export manifest
 *
 * @example
 * ```typescript
 * const manifest = await bulkExportDocuments(['doc-1', 'doc-2', 'doc-3']);
 * ```
 */
export async function bulkExportDocuments(
  documentIds: string[]
): Promise<{ documents: Document[]; totalSize: number }> {
  const docs = await Document.findAll({
    where: { id: { [Op.in]: documentIds } },
    include: [{ model: DocumentVersion, as: 'versions' }],
  });

  const totalSize = docs.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);

  return { documents: docs, totalSize };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  Document,
  DocumentVersion,
  DocumentLink,
  DocumentReview,
  SafetyDataSheet,
  TechnicalDrawing,
  DocumentAccessLog,

  // Document Management Functions
  createDocument,
  updateDocument,
  getDocument,
  getDocumentsByAsset,
  publishDocument,
  archiveDocument,
  deleteDocument,

  // Version Control Functions
  createDocumentVersion,
  getVersionHistory,
  revertToVersion,
  compareVersions,

  // Document Linking Functions
  linkDocuments,
  unlinkDocuments,
  getLinkedDocuments,
  linkDocumentToAsset,

  // Review Workflow Functions
  createDocumentReview,
  startReview,
  approveDocumentReview,
  rejectDocumentReview,
  getPendingReviews,

  // Search Functions
  searchDocuments,
  searchByTags,
  getExpiringDocuments,
  getDocumentsDueForReview,

  // SDS Functions
  createSDS,
  getSDSByChemical,
  getSDSByCAS,

  // Technical Drawing Functions
  createTechnicalDrawing,
  getDrawingByNumber,
  getDrawingRevisions,

  // Access Logging Functions
  logDocumentAccess,
  getDocumentAccessLogs,
  getUserAccessHistory,

  // Bulk Operations
  bulkUpdateStatus,
  bulkAddTags,
  bulkExportDocuments,
};
