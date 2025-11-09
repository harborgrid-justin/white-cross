/**
 * Construction Closeout Management Reusable Function Kit
 *
 * Provides comprehensive construction closeout management capabilities including:
 * - Punch list management with assignment and tracking
 * - Completion tracking and milestone monitoring
 * - Final inspection coordination and scheduling
 * - Certificate of occupancy management
 * - As-built documentation compilation and delivery
 * - Owner training coordination and tracking
 * - O&M manual delivery and acknowledgment
 * - Warranty documentation and registration
 * - Final payment processing and retainage release
 * - Lien release tracking and verification
 * - Closeout checklist management
 * - Lessons learned documentation and analysis
 *
 * Features rich Sequelize associations for complex relationship management.
 *
 * @module ConstructionCloseoutManagementKit
 */

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
  Index,
  Unique,
  Comment,
} from 'sequelize-typescript';
import { Optional, Op, Transaction, Sequelize, WhereOptions, FindOptions } from 'sequelize';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsEnum, IsNumber, IsBoolean, IsDate, IsOptional, IsArray, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CloseoutStatus, PunchListItemStatus, PunchListItemPriority, PunchListItemCategory, CloseoutDocumentType, DocumentStatus, InspectionResult, PaymentStatus } from './types/closeout.types';
import { CreateConstructionCloseoutDto } from './dto/create-construction-closeout.dto';
import { UpdateConstructionCloseoutDto } from './dto/update-construction-closeout.dto';
import { CreatePunchListItemDto } from './dto/create-punch-list-item.dto';
import { UpdatePunchListItemDto } from './dto/update-punch-list-item.dto';
import { CreateCloseoutDocumentDto } from './dto/create-closeout-document.dto';
import { UpdateCloseoutDocumentDto } from './dto/update-closeout-document.dto';

// ====================================================================
// SEQUELIZE MODELS
// ====================================================================

/**
 * Construction Closeout Model
 *
 * Represents a construction project closeout process.
 * Rich associations:
 * - hasMany PunchListItem
 * - hasMany CloseoutDocument
 * - belongsToMany User (stakeholders)
 */
export interface ConstructionCloseoutAttributes {
  id: string;
  projectId: string;
  projectName: string;
  contractorId: string;
  contractorName: string;
  status: CloseoutStatus;
  contractValue: number;
  retainageAmount: number;
  retainagePercentage: number;
  substantialCompletionDate?: Date;
  finalCompletionDate?: Date;
  certificateOfOccupancyDate?: Date;
  warrantyStartDate?: Date;
  warrantyEndDate?: Date;
  warrantyPeriodMonths: number;
  completionPercentage: number;
  totalPunchListItems: number;
  openPunchListItems: number;
  criticalPunchListItems: number;
  requiredDocumentsCount: number;
  submittedDocumentsCount: number;
  approvedDocumentsCount: number;
  finalInspectionScheduled: boolean;
  finalInspectionDate?: Date;
  finalInspectionResult?: InspectionResult;
  ownerTrainingRequired: boolean;
  ownerTrainingCompleted: boolean;
  ownerTrainingDate?: Date;
  lienReleasesRequired: number;
  lienReleasesReceived: number;
  finalPaymentAmount: number;
  finalPaymentStatus: PaymentStatus;
  finalPaymentDate?: Date;
  lessonsLearnedCompleted: boolean;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ConstructionCloseoutCreationAttributes
  extends Optional<
    ConstructionCloseoutAttributes,
    | 'id'
    | 'status'
    | 'retainagePercentage'
    | 'completionPercentage'
    | 'totalPunchListItems'
    | 'openPunchListItems'
    | 'criticalPunchListItems'
    | 'requiredDocumentsCount'
    | 'submittedDocumentsCount'
    | 'approvedDocumentsCount'
    | 'finalInspectionScheduled'
    | 'ownerTrainingRequired'
    | 'ownerTrainingCompleted'
    | 'lienReleasesRequired'
    | 'lienReleasesReceived'
    | 'finalPaymentStatus'
    | 'lessonsLearnedCompleted'
    | 'substantialCompletionDate'
    | 'finalCompletionDate'
    | 'certificateOfOccupancyDate'
    | 'warrantyStartDate'
    | 'warrantyEndDate'
    | 'finalInspectionDate'
    | 'finalInspectionResult'
    | 'ownerTrainingDate'
    | 'finalPaymentDate'
    | 'notes'
    | 'metadata'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
  > {}

@Table({
  tableName: 'construction_closeouts',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['contractorId'] },
    { fields: ['status'] },
    { fields: ['finalCompletionDate'] },
    { fields: ['finalPaymentStatus'] },
    { fields: ['createdAt'] },
  ],
})
export class ConstructionCloseout
  extends Model<ConstructionCloseoutAttributes, ConstructionCloseoutCreationAttributes>
  implements ConstructionCloseoutAttributes
{
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ApiProperty({ description: 'Project ID' })
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  projectId!: string;

  @ApiProperty({ description: 'Project name' })
  @AllowNull(false)
  @Column(DataType.STRING)
  projectName!: string;

  @ApiProperty({ description: 'Contractor ID' })
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  contractorId!: string;

  @ApiProperty({ description: 'Contractor name' })
  @AllowNull(false)
  @Column(DataType.STRING)
  contractorName!: string;

  @ApiProperty({ enum: CloseoutStatus, description: 'Closeout status' })
  @AllowNull(false)
  @Default(CloseoutStatus.INITIATED)
  @Index
  @Column(DataType.ENUM(...Object.values(CloseoutStatus)))
  status!: CloseoutStatus;

  @ApiProperty({ description: 'Contract value in cents' })
  @AllowNull(false)
  @Column(DataType.BIGINT)
  contractValue!: number;

  @ApiProperty({ description: 'Retainage amount in cents' })
  @AllowNull(false)
  @Column(DataType.BIGINT)
  retainageAmount!: number;

  @ApiProperty({ description: 'Retainage percentage (0-100)' })
  @AllowNull(false)
  @Default(10)
  @Column(DataType.DECIMAL(5, 2))
  retainagePercentage!: number;

  @ApiPropertyOptional({ description: 'Substantial completion date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  substantialCompletionDate?: Date;

  @ApiPropertyOptional({ description: 'Final completion date' })
  @AllowNull(true)
  @Index
  @Column(DataType.DATE)
  finalCompletionDate?: Date;

  @ApiPropertyOptional({ description: 'Certificate of occupancy date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  certificateOfOccupancyDate?: Date;

  @ApiPropertyOptional({ description: 'Warranty start date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  warrantyStartDate?: Date;

  @ApiPropertyOptional({ description: 'Warranty end date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  warrantyEndDate?: Date;

  @ApiProperty({ description: 'Warranty period in months' })
  @AllowNull(false)
  @Column(DataType.INTEGER)
  warrantyPeriodMonths!: number;

  @ApiProperty({ description: 'Completion percentage (0-100)' })
  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(5, 2))
  completionPercentage!: number;

  @ApiProperty({ description: 'Total punch list items' })
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  totalPunchListItems!: number;

  @ApiProperty({ description: 'Open punch list items' })
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  openPunchListItems!: number;

  @ApiProperty({ description: 'Critical punch list items' })
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  criticalPunchListItems!: number;

  @ApiProperty({ description: 'Required documents count' })
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  requiredDocumentsCount!: number;

  @ApiProperty({ description: 'Submitted documents count' })
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  submittedDocumentsCount!: number;

  @ApiProperty({ description: 'Approved documents count' })
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  approvedDocumentsCount!: number;

  @ApiProperty({ description: 'Final inspection scheduled' })
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  finalInspectionScheduled!: boolean;

  @ApiPropertyOptional({ description: 'Final inspection date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  finalInspectionDate?: Date;

  @ApiPropertyOptional({ enum: InspectionResult, description: 'Final inspection result' })
  @AllowNull(true)
  @Column(DataType.ENUM(...Object.values(InspectionResult)))
  finalInspectionResult?: InspectionResult;

  @ApiProperty({ description: 'Owner training required' })
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  ownerTrainingRequired!: boolean;

  @ApiProperty({ description: 'Owner training completed' })
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  ownerTrainingCompleted!: boolean;

  @ApiPropertyOptional({ description: 'Owner training date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  ownerTrainingDate?: Date;

  @ApiProperty({ description: 'Lien releases required' })
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  lienReleasesRequired!: number;

  @ApiProperty({ description: 'Lien releases received' })
  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  lienReleasesReceived!: number;

  @ApiProperty({ description: 'Final payment amount in cents' })
  @AllowNull(false)
  @Column(DataType.BIGINT)
  finalPaymentAmount!: number;

  @ApiProperty({ enum: PaymentStatus, description: 'Final payment status' })
  @AllowNull(false)
  @Default(PaymentStatus.PENDING)
  @Index
  @Column(DataType.ENUM(...Object.values(PaymentStatus)))
  finalPaymentStatus!: PaymentStatus;

  @ApiPropertyOptional({ description: 'Final payment date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  finalPaymentDate?: Date;

  @ApiProperty({ description: 'Lessons learned completed' })
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  lessonsLearnedCompleted!: boolean;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @AllowNull(true)
  @Column(DataType.TEXT)
  notes?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @AllowNull(true)
  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreatedAt
  @Column(DataType.DATE)
  createdAt?: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt?: Date;

  @ApiPropertyOptional({ description: 'Deletion timestamp' })
  @DeletedAt
  @Column(DataType.DATE)
  deletedAt?: Date;

  // Associations
  @HasMany(() => PunchListItem, 'closeoutId')
  punchListItems?: PunchListItem[];

  @HasMany(() => CloseoutDocument, 'closeoutId')
  documents?: CloseoutDocument[];
}

/**
 * Punch List Item Model
 *
 * Represents individual items on a construction punch list.
 * Associations:
 * - belongsTo ConstructionCloseout
 */
export interface PunchListItemAttributes {
  id: string;
  closeoutId: string;
  itemNumber: string;
  title: string;
  description: string;
  location: string;
  category: PunchListItemCategory;
  priority: PunchListItemPriority;
  status: PunchListItemStatus;
  assignedToId?: string;
  assignedToName?: string;
  assignedDate?: Date;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  estimatedCost?: number;
  actualCost?: number;
  reportedById: string;
  reportedByName: string;
  reportedDate: Date;
  reviewedById?: string;
  reviewedByName?: string;
  reviewedDate?: Date;
  approvedById?: string;
  approvedByName?: string;
  approvedDate?: Date;
  completedDate?: Date;
  closedDate?: Date;
  photoUrls?: string[];
  attachmentUrls?: string[];
  rejectionReason?: string;
  resolutionNotes?: string;
  requiresReinspection: boolean;
  reinspectionDate?: Date;
  contractorResponsible: string;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface PunchListItemCreationAttributes
  extends Optional<
    PunchListItemAttributes,
    | 'id'
    | 'status'
    | 'requiresReinspection'
    | 'assignedToId'
    | 'assignedToName'
    | 'assignedDate'
    | 'dueDate'
    | 'estimatedHours'
    | 'actualHours'
    | 'estimatedCost'
    | 'actualCost'
    | 'reviewedById'
    | 'reviewedByName'
    | 'reviewedDate'
    | 'approvedById'
    | 'approvedByName'
    | 'approvedDate'
    | 'completedDate'
    | 'closedDate'
    | 'photoUrls'
    | 'attachmentUrls'
    | 'rejectionReason'
    | 'resolutionNotes'
    | 'reinspectionDate'
    | 'tags'
    | 'metadata'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
  > {}

@Table({
  tableName: 'punch_list_items',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['closeoutId'] },
    { fields: ['itemNumber'] },
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['category'] },
    { fields: ['assignedToId'] },
    { fields: ['dueDate'] },
    { fields: ['createdAt'] },
  ],
})
export class PunchListItem
  extends Model<PunchListItemAttributes, PunchListItemCreationAttributes>
  implements PunchListItemAttributes
{
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ApiProperty({ description: 'Construction closeout ID' })
  @ForeignKey(() => ConstructionCloseout)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  closeoutId!: string;

  @ApiProperty({ description: 'Item number' })
  @AllowNull(false)
  @Index
  @Column(DataType.STRING)
  itemNumber!: string;

  @ApiProperty({ description: 'Item title' })
  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @ApiProperty({ description: 'Detailed description' })
  @AllowNull(false)
  @Column(DataType.TEXT)
  description!: string;

  @ApiProperty({ description: 'Location in building' })
  @AllowNull(false)
  @Column(DataType.STRING)
  location!: string;

  @ApiProperty({ enum: PunchListItemCategory, description: 'Item category' })
  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(PunchListItemCategory)))
  category!: PunchListItemCategory;

  @ApiProperty({ enum: PunchListItemPriority, description: 'Item priority' })
  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(PunchListItemPriority)))
  priority!: PunchListItemPriority;

  @ApiProperty({ enum: PunchListItemStatus, description: 'Item status' })
  @AllowNull(false)
  @Default(PunchListItemStatus.OPEN)
  @Index
  @Column(DataType.ENUM(...Object.values(PunchListItemStatus)))
  status!: PunchListItemStatus;

  @ApiPropertyOptional({ description: 'Assigned user ID' })
  @AllowNull(true)
  @Index
  @Column(DataType.UUID)
  assignedToId?: string;

  @ApiPropertyOptional({ description: 'Assigned user name' })
  @AllowNull(true)
  @Column(DataType.STRING)
  assignedToName?: string;

  @ApiPropertyOptional({ description: 'Assignment date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  assignedDate?: Date;

  @ApiPropertyOptional({ description: 'Due date' })
  @AllowNull(true)
  @Index
  @Column(DataType.DATE)
  dueDate?: Date;

  @ApiPropertyOptional({ description: 'Estimated hours to complete' })
  @AllowNull(true)
  @Column(DataType.DECIMAL(10, 2))
  estimatedHours?: number;

  @ApiPropertyOptional({ description: 'Actual hours spent' })
  @AllowNull(true)
  @Column(DataType.DECIMAL(10, 2))
  actualHours?: number;

  @ApiPropertyOptional({ description: 'Estimated cost in cents' })
  @AllowNull(true)
  @Column(DataType.BIGINT)
  estimatedCost?: number;

  @ApiPropertyOptional({ description: 'Actual cost in cents' })
  @AllowNull(true)
  @Column(DataType.BIGINT)
  actualCost?: number;

  @ApiProperty({ description: 'Reported by user ID' })
  @AllowNull(false)
  @Column(DataType.UUID)
  reportedById!: string;

  @ApiProperty({ description: 'Reported by user name' })
  @AllowNull(false)
  @Column(DataType.STRING)
  reportedByName!: string;

  @ApiProperty({ description: 'Reported date' })
  @AllowNull(false)
  @Column(DataType.DATE)
  reportedDate!: Date;

  @ApiPropertyOptional({ description: 'Reviewed by user ID' })
  @AllowNull(true)
  @Column(DataType.UUID)
  reviewedById?: string;

  @ApiPropertyOptional({ description: 'Reviewed by user name' })
  @AllowNull(true)
  @Column(DataType.STRING)
  reviewedByName?: string;

  @ApiPropertyOptional({ description: 'Review date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  reviewedDate?: Date;

  @ApiPropertyOptional({ description: 'Approved by user ID' })
  @AllowNull(true)
  @Column(DataType.UUID)
  approvedById?: string;

  @ApiPropertyOptional({ description: 'Approved by user name' })
  @AllowNull(true)
  @Column(DataType.STRING)
  approvedByName?: string;

  @ApiPropertyOptional({ description: 'Approval date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  approvedDate?: Date;

  @ApiPropertyOptional({ description: 'Completion date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  completedDate?: Date;

  @ApiPropertyOptional({ description: 'Closed date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  closedDate?: Date;

  @ApiPropertyOptional({ description: 'Photo URLs', type: [String] })
  @AllowNull(true)
  @Column(DataType.ARRAY(DataType.TEXT))
  photoUrls?: string[];

  @ApiPropertyOptional({ description: 'Attachment URLs', type: [String] })
  @AllowNull(true)
  @Column(DataType.ARRAY(DataType.TEXT))
  attachmentUrls?: string[];

  @ApiPropertyOptional({ description: 'Rejection reason if rejected' })
  @AllowNull(true)
  @Column(DataType.TEXT)
  rejectionReason?: string;

  @ApiPropertyOptional({ description: 'Resolution notes' })
  @AllowNull(true)
  @Column(DataType.TEXT)
  resolutionNotes?: string;

  @ApiProperty({ description: 'Requires reinspection' })
  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  requiresReinspection!: boolean;

  @ApiPropertyOptional({ description: 'Reinspection date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  reinspectionDate?: Date;

  @ApiProperty({ description: 'Contractor responsible' })
  @AllowNull(false)
  @Column(DataType.STRING)
  contractorResponsible!: string;

  @ApiPropertyOptional({ description: 'Tags for categorization', type: [String] })
  @AllowNull(true)
  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @AllowNull(true)
  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreatedAt
  @Column(DataType.DATE)
  createdAt?: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt?: Date;

  @ApiPropertyOptional({ description: 'Deletion timestamp' })
  @DeletedAt
  @Column(DataType.DATE)
  deletedAt?: Date;

  // Associations
  @BelongsTo(() => ConstructionCloseout, 'closeoutId')
  closeout?: ConstructionCloseout;
}

/**
 * Closeout Document Model
 *
 * Represents documents required for construction closeout.
 * Associations:
 * - belongsTo ConstructionCloseout
 */
export interface CloseoutDocumentAttributes {
  id: string;
  closeoutId: string;
  documentType: CloseoutDocumentType;
  title: string;
  description?: string;
  documentNumber?: string;
  version: string;
  status: DocumentStatus;
  required: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  uploadedById?: string;
  uploadedByName?: string;
  uploadedDate?: Date;
  submittedById?: string;
  submittedByName?: string;
  submittedDate?: Date;
  reviewedById?: string;
  reviewedByName?: string;
  reviewedDate?: Date;
  approvedById?: string;
  approvedByName?: string;
  approvedDate?: Date;
  deliveredDate?: Date;
  acknowledgedById?: string;
  acknowledgedByName?: string;
  acknowledgedDate?: Date;
  expirationDate?: Date;
  rejectionReason?: string;
  reviewComments?: string;
  relatedEquipment?: string;
  relatedSystem?: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  warrantyStartDate?: Date;
  warrantyEndDate?: Date;
  trainingTopic?: string;
  trainingDuration?: number;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CloseoutDocumentCreationAttributes
  extends Optional<
    CloseoutDocumentAttributes,
    | 'id'
    | 'status'
    | 'required'
    | 'version'
    | 'description'
    | 'documentNumber'
    | 'fileUrl'
    | 'fileName'
    | 'fileSize'
    | 'mimeType'
    | 'uploadedById'
    | 'uploadedByName'
    | 'uploadedDate'
    | 'submittedById'
    | 'submittedByName'
    | 'submittedDate'
    | 'reviewedById'
    | 'reviewedByName'
    | 'reviewedDate'
    | 'approvedById'
    | 'approvedByName'
    | 'approvedDate'
    | 'deliveredDate'
    | 'acknowledgedById'
    | 'acknowledgedByName'
    | 'acknowledgedDate'
    | 'expirationDate'
    | 'rejectionReason'
    | 'reviewComments'
    | 'relatedEquipment'
    | 'relatedSystem'
    | 'manufacturer'
    | 'modelNumber'
    | 'serialNumber'
    | 'warrantyStartDate'
    | 'warrantyEndDate'
    | 'trainingTopic'
    | 'trainingDuration'
    | 'tags'
    | 'metadata'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
  > {}

@Table({
  tableName: 'closeout_documents',
  timestamps: true,
  paranoid: true,
  indexes: [
    { fields: ['closeoutId'] },
    { fields: ['documentType'] },
    { fields: ['status'] },
    { fields: ['required'] },
    { fields: ['submittedDate'] },
    { fields: ['approvedDate'] },
    { fields: ['createdAt'] },
  ],
})
export class CloseoutDocument
  extends Model<CloseoutDocumentAttributes, CloseoutDocumentCreationAttributes>
  implements CloseoutDocumentAttributes
{
  @ApiProperty({ description: 'Unique identifier' })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ApiProperty({ description: 'Construction closeout ID' })
  @ForeignKey(() => ConstructionCloseout)
  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  closeoutId!: string;

  @ApiProperty({ enum: CloseoutDocumentType, description: 'Document type' })
  @AllowNull(false)
  @Index
  @Column(DataType.ENUM(...Object.values(CloseoutDocumentType)))
  documentType!: CloseoutDocumentType;

  @ApiProperty({ description: 'Document title' })
  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @ApiPropertyOptional({ description: 'Document description' })
  @AllowNull(true)
  @Column(DataType.TEXT)
  description?: string;

  @ApiPropertyOptional({ description: 'Document number' })
  @AllowNull(true)
  @Column(DataType.STRING)
  documentNumber?: string;

  @ApiProperty({ description: 'Document version' })
  @AllowNull(false)
  @Default('1.0')
  @Column(DataType.STRING)
  version!: string;

  @ApiProperty({ enum: DocumentStatus, description: 'Document status' })
  @AllowNull(false)
  @Default(DocumentStatus.PENDING)
  @Index
  @Column(DataType.ENUM(...Object.values(DocumentStatus)))
  status!: DocumentStatus;

  @ApiProperty({ description: 'Document required for closeout' })
  @AllowNull(false)
  @Default(true)
  @Index
  @Column(DataType.BOOLEAN)
  required!: boolean;

  @ApiPropertyOptional({ description: 'File URL' })
  @AllowNull(true)
  @Column(DataType.TEXT)
  fileUrl?: string;

  @ApiPropertyOptional({ description: 'File name' })
  @AllowNull(true)
  @Column(DataType.STRING)
  fileName?: string;

  @ApiPropertyOptional({ description: 'File size in bytes' })
  @AllowNull(true)
  @Column(DataType.BIGINT)
  fileSize?: number;

  @ApiPropertyOptional({ description: 'MIME type' })
  @AllowNull(true)
  @Column(DataType.STRING)
  mimeType?: string;

  @ApiPropertyOptional({ description: 'Uploaded by user ID' })
  @AllowNull(true)
  @Column(DataType.UUID)
  uploadedById?: string;

  @ApiPropertyOptional({ description: 'Uploaded by user name' })
  @AllowNull(true)
  @Column(DataType.STRING)
  uploadedByName?: string;

  @ApiPropertyOptional({ description: 'Upload date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  uploadedDate?: Date;

  @ApiPropertyOptional({ description: 'Submitted by user ID' })
  @AllowNull(true)
  @Column(DataType.UUID)
  submittedById?: string;

  @ApiPropertyOptional({ description: 'Submitted by user name' })
  @AllowNull(true)
  @Column(DataType.STRING)
  submittedByName?: string;

  @ApiPropertyOptional({ description: 'Submission date' })
  @AllowNull(true)
  @Index
  @Column(DataType.DATE)
  submittedDate?: Date;

  @ApiPropertyOptional({ description: 'Reviewed by user ID' })
  @AllowNull(true)
  @Column(DataType.UUID)
  reviewedById?: string;

  @ApiPropertyOptional({ description: 'Reviewed by user name' })
  @AllowNull(true)
  @Column(DataType.STRING)
  reviewedByName?: string;

  @ApiPropertyOptional({ description: 'Review date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  reviewedDate?: Date;

  @ApiPropertyOptional({ description: 'Approved by user ID' })
  @AllowNull(true)
  @Column(DataType.UUID)
  approvedById?: string;

  @ApiPropertyOptional({ description: 'Approved by user name' })
  @AllowNull(true)
  @Column(DataType.STRING)
  approvedByName?: string;

  @ApiPropertyOptional({ description: 'Approval date' })
  @AllowNull(true)
  @Index
  @Column(DataType.DATE)
  approvedDate?: Date;

  @ApiPropertyOptional({ description: 'Delivery date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  deliveredDate?: Date;

  @ApiPropertyOptional({ description: 'Acknowledged by user ID' })
  @AllowNull(true)
  @Column(DataType.UUID)
  acknowledgedById?: string;

  @ApiPropertyOptional({ description: 'Acknowledged by user name' })
  @AllowNull(true)
  @Column(DataType.STRING)
  acknowledgedByName?: string;

  @ApiPropertyOptional({ description: 'Acknowledgment date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  acknowledgedDate?: Date;

  @ApiPropertyOptional({ description: 'Expiration date (for warranties, certifications)' })
  @AllowNull(true)
  @Column(DataType.DATE)
  expirationDate?: Date;

  @ApiPropertyOptional({ description: 'Rejection reason if rejected' })
  @AllowNull(true)
  @Column(DataType.TEXT)
  rejectionReason?: string;

  @ApiPropertyOptional({ description: 'Review comments' })
  @AllowNull(true)
  @Column(DataType.TEXT)
  reviewComments?: string;

  @ApiPropertyOptional({ description: 'Related equipment' })
  @AllowNull(true)
  @Column(DataType.STRING)
  relatedEquipment?: string;

  @ApiPropertyOptional({ description: 'Related system' })
  @AllowNull(true)
  @Column(DataType.STRING)
  relatedSystem?: string;

  @ApiPropertyOptional({ description: 'Manufacturer (for warranties)' })
  @AllowNull(true)
  @Column(DataType.STRING)
  manufacturer?: string;

  @ApiPropertyOptional({ description: 'Model number' })
  @AllowNull(true)
  @Column(DataType.STRING)
  modelNumber?: string;

  @ApiPropertyOptional({ description: 'Serial number' })
  @AllowNull(true)
  @Column(DataType.STRING)
  serialNumber?: string;

  @ApiPropertyOptional({ description: 'Warranty start date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  warrantyStartDate?: Date;

  @ApiPropertyOptional({ description: 'Warranty end date' })
  @AllowNull(true)
  @Column(DataType.DATE)
  warrantyEndDate?: Date;

  @ApiPropertyOptional({ description: 'Training topic (for training materials)' })
  @AllowNull(true)
  @Column(DataType.STRING)
  trainingTopic?: string;

  @ApiPropertyOptional({ description: 'Training duration in minutes' })
  @AllowNull(true)
  @Column(DataType.INTEGER)
  trainingDuration?: number;

  @ApiPropertyOptional({ description: 'Tags for categorization', type: [String] })
  @AllowNull(true)
  @Column(DataType.ARRAY(DataType.STRING))
  tags?: string[];

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @AllowNull(true)
  @Column(DataType.JSONB)
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Creation timestamp' })
  @CreatedAt
  @Column(DataType.DATE)
  createdAt?: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  @UpdatedAt
  @Column(DataType.DATE)
  updatedAt?: Date;

  @ApiPropertyOptional({ description: 'Deletion timestamp' })
  @DeletedAt
  @Column(DataType.DATE)
  deletedAt?: Date;

  // Associations
  @BelongsTo(() => ConstructionCloseout, 'closeoutId')
  closeout?: ConstructionCloseout;
}

// ====================================================================
// DATA TRANSFER OBJECTS (DTOs)
// ====================================================================

export class CreateConstructionCloseoutDto implements Partial<ConstructionCloseoutCreationAttributes> {
  @ApiProperty()
  @IsUUID()
  projectId!: string;

  @ApiProperty()
  @IsString()
  projectName!: string;

  @ApiProperty()
  @IsUUID()
  contractorId!: string;

  @ApiProperty()
  @IsString()
  contractorName!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  contractValue!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  retainageAmount!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  retainagePercentage?: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  warrantyPeriodMonths!: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  finalPaymentAmount!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateConstructionCloseoutDto implements Partial<ConstructionCloseoutAttributes> {
  @ApiPropertyOptional({ enum: CloseoutStatus })
  @IsOptional()
  @IsEnum(CloseoutStatus)
  status?: CloseoutStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  substantialCompletionDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  finalCompletionDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  certificateOfOccupancyDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  finalInspectionScheduled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  finalInspectionDate?: Date;

  @ApiPropertyOptional({ enum: InspectionResult })
  @IsOptional()
  @IsEnum(InspectionResult)
  finalInspectionResult?: InspectionResult;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ownerTrainingRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  ownerTrainingCompleted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ownerTrainingDate?: Date;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  finalPaymentStatus?: PaymentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  finalPaymentDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  lessonsLearnedCompleted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreatePunchListItemDto implements Partial<PunchListItemCreationAttributes> {
  @ApiProperty()
  @IsUUID()
  closeoutId!: string;

  @ApiProperty()
  @IsString()
  itemNumber!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @IsString()
  location!: string;

  @ApiProperty({ enum: PunchListItemCategory })
  @IsEnum(PunchListItemCategory)
  category!: PunchListItemCategory;

  @ApiProperty({ enum: PunchListItemPriority })
  @IsEnum(PunchListItemPriority)
  priority!: PunchListItemPriority;

  @ApiProperty()
  @IsUUID()
  reportedById!: string;

  @ApiProperty()
  @IsString()
  reportedByName!: string;

  @ApiProperty()
  @IsString()
  contractorResponsible!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedToName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  estimatedHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  estimatedCost?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdatePunchListItemDto implements Partial<PunchListItemAttributes> {
  @ApiPropertyOptional({ enum: PunchListItemStatus })
  @IsOptional()
  @IsEnum(PunchListItemStatus)
  status?: PunchListItemStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedToName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  actualHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  actualCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  resolutionNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  requiresReinspection?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photoUrls?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachmentUrls?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateCloseoutDocumentDto implements Partial<CloseoutDocumentCreationAttributes> {
  @ApiProperty()
  @IsUUID()
  closeoutId!: string;

  @ApiProperty({ enum: CloseoutDocumentType })
  @IsEnum(CloseoutDocumentType)
  documentType!: CloseoutDocumentType;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  relatedEquipment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  relatedSystem?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  modelNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  trainingTopic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  trainingDuration?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateCloseoutDocumentDto implements Partial<CloseoutDocumentAttributes> {
  @ApiPropertyOptional({ enum: DocumentStatus })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reviewComments?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  warrantyStartDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  warrantyEndDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  metadata?: Record<string, any>;
}

// ====================================================================
// REUSABLE FUNCTIONS - CONSTRUCTION CLOSEOUT MANAGEMENT
// ====================================================================

/**
 * 1. CREATE CONSTRUCTION CLOSEOUT
 * Creates a new construction closeout record
 */
export async function createConstructionCloseout(
  data: CreateConstructionCloseoutDto,
  transaction?: Transaction,
): Promise<ConstructionCloseout> {
  const closeout = await ConstructionCloseout.create(
    {
      ...data,
      status: CloseoutStatus.INITIATED,
      completionPercentage: 0,
      totalPunchListItems: 0,
      openPunchListItems: 0,
      criticalPunchListItems: 0,
      requiredDocumentsCount: 0,
      submittedDocumentsCount: 0,
      approvedDocumentsCount: 0,
      finalInspectionScheduled: false,
      ownerTrainingRequired: false,
      ownerTrainingCompleted: false,
      lienReleasesRequired: 0,
      lienReleasesReceived: 0,
      finalPaymentStatus: PaymentStatus.PENDING,
      lessonsLearnedCompleted: false,
    },
    { transaction },
  );

  return closeout;
}

/**
 * 2. GET CLOSEOUT BY ID WITH ASSOCIATIONS
 * Retrieves a closeout record with all associated data using eager loading
 */
export async function getCloseoutByIdWithAssociations(
  id: string,
  options?: {
    includePunchList?: boolean;
    includeDocuments?: boolean;
    punchListStatus?: PunchListItemStatus[];
    documentTypes?: CloseoutDocumentType[];
  },
): Promise<ConstructionCloseout | null> {
  const include: any[] = [];

  if (options?.includePunchList) {
    const punchListWhere: WhereOptions<PunchListItemAttributes> = {};
    if (options.punchListStatus && options.punchListStatus.length > 0) {
      punchListWhere.status = { [Op.in]: options.punchListStatus };
    }

    include.push({
      model: PunchListItem,
      as: 'punchListItems',
      where: Object.keys(punchListWhere).length > 0 ? punchListWhere : undefined,
      required: false,
    });
  }

  if (options?.includeDocuments) {
    const documentWhere: WhereOptions<CloseoutDocumentAttributes> = {};
    if (options.documentTypes && options.documentTypes.length > 0) {
      documentWhere.documentType = { [Op.in]: options.documentTypes };
    }

    include.push({
      model: CloseoutDocument,
      as: 'documents',
      where: Object.keys(documentWhere).length > 0 ? documentWhere : undefined,
      required: false,
    });
  }

  const closeout = await ConstructionCloseout.findByPk(id, {
    include: include.length > 0 ? include : undefined,
  });

  return closeout;
}

/**
 * 3. UPDATE CLOSEOUT STATUS
 * Updates the closeout status with validation
 */
export async function updateCloseoutStatus(
  id: string,
  status: CloseoutStatus,
  transaction?: Transaction,
): Promise<ConstructionCloseout> {
  const closeout = await ConstructionCloseout.findByPk(id, { transaction });
  if (!closeout) {
    throw new Error('Closeout not found');
  }

  await closeout.update({ status }, { transaction });
  return closeout;
}

/**
 * 4. CREATE PUNCH LIST ITEM
 * Creates a new punch list item and updates closeout counters
 */
export async function createPunchListItem(
  data: CreatePunchListItemDto,
  transaction?: Transaction,
): Promise<PunchListItem> {
  const shouldCommit = !transaction;
  const t = transaction || await ConstructionCloseout.sequelize!.transaction();

  try {
    const item = await PunchListItem.create(
      {
        ...data,
        status: PunchListItemStatus.OPEN,
        reportedDate: new Date(),
        assignedDate: data.assignedToId ? new Date() : undefined,
        requiresReinspection: false,
      },
      { transaction: t },
    );

    // Update closeout counters
    const closeout = await ConstructionCloseout.findByPk(data.closeoutId, { transaction: t });
    if (closeout) {
      await closeout.increment('totalPunchListItems', { transaction: t });
      await closeout.increment('openPunchListItems', { transaction: t });

      if (data.priority === PunchListItemPriority.CRITICAL) {
        await closeout.increment('criticalPunchListItems', { transaction: t });
      }

      // Recalculate completion percentage
      await recalculateCloseoutCompletion(data.closeoutId, t);
    }

    if (shouldCommit) {
      await t.commit();
    }

    return item;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 5. GET PUNCH LIST ITEMS FOR CLOSEOUT
 * Retrieves punch list items with filtering and pagination
 */
export async function getPunchListItemsForCloseout(
  closeoutId: string,
  options?: {
    status?: PunchListItemStatus[];
    priority?: PunchListItemPriority[];
    category?: PunchListItemCategory[];
    assignedToId?: string;
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
  },
): Promise<{ items: PunchListItem[]; total: number }> {
  const where: WhereOptions<PunchListItemAttributes> = { closeoutId };

  if (options?.status && options.status.length > 0) {
    where.status = { [Op.in]: options.status };
  }

  if (options?.priority && options.priority.length > 0) {
    where.priority = { [Op.in]: options.priority };
  }

  if (options?.category && options.category.length > 0) {
    where.category = { [Op.in]: options.category };
  }

  if (options?.assignedToId) {
    where.assignedToId = options.assignedToId;
  }

  const { count, rows } = await PunchListItem.findAndCountAll({
    where,
    limit: options?.limit,
    offset: options?.offset,
    order: [[options?.orderBy || 'createdAt', options?.orderDirection || 'DESC']],
  });

  return { items: rows, total: count };
}

/**
 * 6. UPDATE PUNCH LIST ITEM STATUS
 * Updates punch list item status with workflow validation
 */
export async function updatePunchListItemStatus(
  id: string,
  status: PunchListItemStatus,
  userId: string,
  userName: string,
  notes?: string,
  transaction?: Transaction,
): Promise<PunchListItem> {
  const shouldCommit = !transaction;
  const t = transaction || await PunchListItem.sequelize!.transaction();

  try {
    const item = await PunchListItem.findByPk(id, { transaction: t });
    if (!item) {
      throw new Error('Punch list item not found');
    }

    const updates: Partial<PunchListItemAttributes> = { status };

    // Update timestamps based on status
    switch (status) {
      case PunchListItemStatus.READY_FOR_REVIEW:
        updates.completedDate = new Date();
        if (notes) updates.resolutionNotes = notes;
        break;
      case PunchListItemStatus.REVIEWED:
        updates.reviewedById = userId;
        updates.reviewedByName = userName;
        updates.reviewedDate = new Date();
        break;
      case PunchListItemStatus.APPROVED:
        updates.approvedById = userId;
        updates.approvedByName = userName;
        updates.approvedDate = new Date();
        break;
      case PunchListItemStatus.REJECTED:
        if (notes) updates.rejectionReason = notes;
        break;
      case PunchListItemStatus.CLOSED:
        updates.closedDate = new Date();
        break;
    }

    await item.update(updates, { transaction: t });

    // Update closeout counters
    await updateCloseoutPunchListCounters(item.closeoutId, t);
    await recalculateCloseoutCompletion(item.closeoutId, t);

    if (shouldCommit) {
      await t.commit();
    }

    return item;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 7. ASSIGN PUNCH LIST ITEM
 * Assigns a punch list item to a user
 */
export async function assignPunchListItem(
  id: string,
  assignedToId: string,
  assignedToName: string,
  dueDate?: Date,
  transaction?: Transaction,
): Promise<PunchListItem> {
  const item = await PunchListItem.findByPk(id, { transaction });
  if (!item) {
    throw new Error('Punch list item not found');
  }

  await item.update(
    {
      assignedToId,
      assignedToName,
      assignedDate: new Date(),
      dueDate,
      status: PunchListItemStatus.IN_PROGRESS,
    },
    { transaction },
  );

  return item;
}

/**
 * 8. GET CRITICAL PUNCH LIST ITEMS
 * Retrieves all critical punch list items across closeouts
 */
export async function getCriticalPunchListItems(
  projectId?: string,
  status?: PunchListItemStatus[],
): Promise<PunchListItem[]> {
  const where: WhereOptions<PunchListItemAttributes> = {
    priority: PunchListItemPriority.CRITICAL,
  };

  if (status && status.length > 0) {
    where.status = { [Op.in]: status };
  }

  const include: any[] = [];

  if (projectId) {
    include.push({
      model: ConstructionCloseout,
      as: 'closeout',
      where: { projectId },
      required: true,
    });
  }

  const items = await PunchListItem.findAll({
    where,
    include: include.length > 0 ? include : undefined,
    order: [['dueDate', 'ASC']],
  });

  return items;
}

/**
 * 9. GET OVERDUE PUNCH LIST ITEMS
 * Retrieves overdue punch list items
 */
export async function getOverduePunchListItems(
  closeoutId?: string,
): Promise<PunchListItem[]> {
  const where: WhereOptions<PunchListItemAttributes> = {
    dueDate: {
      [Op.lt]: new Date(),
    },
    status: {
      [Op.notIn]: [PunchListItemStatus.CLOSED, PunchListItemStatus.CANCELLED],
    },
  };

  if (closeoutId) {
    where.closeoutId = closeoutId;
  }

  const items = await PunchListItem.findAll({
    where,
    include: [
      {
        model: ConstructionCloseout,
        as: 'closeout',
      },
    ],
    order: [['dueDate', 'ASC']],
  });

  return items;
}

/**
 * 10. BULK UPDATE PUNCH LIST ITEMS
 * Updates multiple punch list items at once
 */
export async function bulkUpdatePunchListItems(
  itemIds: string[],
  updates: UpdatePunchListItemDto,
  transaction?: Transaction,
): Promise<number> {
  const shouldCommit = !transaction;
  const t = transaction || await PunchListItem.sequelize!.transaction();

  try {
    const [affectedCount] = await PunchListItem.update(updates, {
      where: { id: { [Op.in]: itemIds } },
      transaction: t,
    });

    // Update closeout counters for affected closeouts
    const items = await PunchListItem.findAll({
      where: { id: { [Op.in]: itemIds } },
      attributes: ['closeoutId'],
      group: ['closeoutId'],
      transaction: t,
    });

    for (const item of items) {
      await updateCloseoutPunchListCounters(item.closeoutId, t);
      await recalculateCloseoutCompletion(item.closeoutId, t);
    }

    if (shouldCommit) {
      await t.commit();
    }

    return affectedCount;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 11. CREATE CLOSEOUT DOCUMENT
 * Creates a new closeout document record
 */
export async function createCloseoutDocument(
  data: CreateCloseoutDocumentDto,
  transaction?: Transaction,
): Promise<CloseoutDocument> {
  const shouldCommit = !transaction;
  const t = transaction || await CloseoutDocument.sequelize!.transaction();

  try {
    const document = await CloseoutDocument.create(
      {
        ...data,
        status: DocumentStatus.PENDING,
        version: '1.0',
        required: data.required !== undefined ? data.required : true,
      },
      { transaction: t },
    );

    // Update closeout counters
    const closeout = await ConstructionCloseout.findByPk(data.closeoutId, { transaction: t });
    if (closeout && data.required !== false) {
      await closeout.increment('requiredDocumentsCount', { transaction: t });
      await recalculateCloseoutCompletion(data.closeoutId, t);
    }

    if (shouldCommit) {
      await t.commit();
    }

    return document;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 12. UPLOAD CLOSEOUT DOCUMENT
 * Uploads a document file and updates the record
 */
export async function uploadCloseoutDocument(
  id: string,
  fileUrl: string,
  fileName: string,
  fileSize: number,
  mimeType: string,
  uploadedById: string,
  uploadedByName: string,
  transaction?: Transaction,
): Promise<CloseoutDocument> {
  const document = await CloseoutDocument.findByPk(id, { transaction });
  if (!document) {
    throw new Error('Document not found');
  }

  await document.update(
    {
      fileUrl,
      fileName,
      fileSize,
      mimeType,
      uploadedById,
      uploadedByName,
      uploadedDate: new Date(),
      status: DocumentStatus.IN_PROGRESS,
    },
    { transaction },
  );

  return document;
}

/**
 * 13. SUBMIT CLOSEOUT DOCUMENT FOR REVIEW
 * Submits a document for review
 */
export async function submitCloseoutDocument(
  id: string,
  submittedById: string,
  submittedByName: string,
  transaction?: Transaction,
): Promise<CloseoutDocument> {
  const shouldCommit = !transaction;
  const t = transaction || await CloseoutDocument.sequelize!.transaction();

  try {
    const document = await CloseoutDocument.findByPk(id, { transaction: t });
    if (!document) {
      throw new Error('Document not found');
    }

    if (!document.fileUrl) {
      throw new Error('Cannot submit document without uploaded file');
    }

    await document.update(
      {
        submittedById,
        submittedByName,
        submittedDate: new Date(),
        status: DocumentStatus.SUBMITTED,
      },
      { transaction: t },
    );

    // Update closeout counters
    const closeout = await ConstructionCloseout.findByPk(document.closeoutId, { transaction: t });
    if (closeout && document.required) {
      await closeout.increment('submittedDocumentsCount', { transaction: t });
      await recalculateCloseoutCompletion(document.closeoutId, t);
    }

    if (shouldCommit) {
      await t.commit();
    }

    return document;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 14. APPROVE CLOSEOUT DOCUMENT
 * Approves a submitted document
 */
export async function approveCloseoutDocument(
  id: string,
  approvedById: string,
  approvedByName: string,
  reviewComments?: string,
  transaction?: Transaction,
): Promise<CloseoutDocument> {
  const shouldCommit = !transaction;
  const t = transaction || await CloseoutDocument.sequelize!.transaction();

  try {
    const document = await CloseoutDocument.findByPk(id, { transaction: t });
    if (!document) {
      throw new Error('Document not found');
    }

    await document.update(
      {
        approvedById,
        approvedByName,
        approvedDate: new Date(),
        reviewComments,
        status: DocumentStatus.APPROVED,
      },
      { transaction: t },
    );

    // Update closeout counters
    const closeout = await ConstructionCloseout.findByPk(document.closeoutId, { transaction: t });
    if (closeout && document.required) {
      await closeout.increment('approvedDocumentsCount', { transaction: t });
      await recalculateCloseoutCompletion(document.closeoutId, t);
    }

    if (shouldCommit) {
      await t.commit();
    }

    return document;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 15. REJECT CLOSEOUT DOCUMENT
 * Rejects a submitted document
 */
export async function rejectCloseoutDocument(
  id: string,
  reviewedById: string,
  reviewedByName: string,
  rejectionReason: string,
  transaction?: Transaction,
): Promise<CloseoutDocument> {
  const document = await CloseoutDocument.findByPk(id, { transaction });
  if (!document) {
    throw new Error('Document not found');
  }

  await document.update(
    {
      reviewedById,
      reviewedByName,
      reviewedDate: new Date(),
      rejectionReason,
      status: DocumentStatus.REJECTED,
    },
    { transaction },
  );

  return document;
}

/**
 * 16. GET DOCUMENTS BY TYPE
 * Retrieves closeout documents by type
 */
export async function getDocumentsByType(
  closeoutId: string,
  documentTypes: CloseoutDocumentType[],
  status?: DocumentStatus[],
): Promise<CloseoutDocument[]> {
  const where: WhereOptions<CloseoutDocumentAttributes> = {
    closeoutId,
    documentType: { [Op.in]: documentTypes },
  };

  if (status && status.length > 0) {
    where.status = { [Op.in]: status };
  }

  const documents = await CloseoutDocument.findAll({
    where,
    order: [['documentType', 'ASC'], ['createdAt', 'DESC']],
  });

  return documents;
}

/**
 * 17. GET PENDING DOCUMENTS
 * Retrieves all pending required documents
 */
export async function getPendingDocuments(
  closeoutId: string,
): Promise<CloseoutDocument[]> {
  const documents = await CloseoutDocument.findAll({
    where: {
      closeoutId,
      required: true,
      status: {
        [Op.in]: [DocumentStatus.PENDING, DocumentStatus.IN_PROGRESS, DocumentStatus.REJECTED],
      },
    },
    order: [['documentType', 'ASC']],
  });

  return documents;
}

/**
 * 18. GET AS-BUILT DOCUMENTS
 * Retrieves all as-built drawings and documentation
 */
export async function getAsBuiltDocuments(
  closeoutId: string,
): Promise<CloseoutDocument[]> {
  return getDocumentsByType(closeoutId, [CloseoutDocumentType.AS_BUILT_DRAWING]);
}

/**
 * 19. GET WARRANTY DOCUMENTS
 * Retrieves all warranty-related documents
 */
export async function getWarrantyDocuments(
  closeoutId: string,
  includeExpired?: boolean,
): Promise<CloseoutDocument[]> {
  const where: WhereOptions<CloseoutDocumentAttributes> = {
    closeoutId,
    documentType: {
      [Op.in]: [
        CloseoutDocumentType.WARRANTY_CERTIFICATE,
        CloseoutDocumentType.EQUIPMENT_WARRANTY,
        CloseoutDocumentType.MATERIAL_WARRANTY,
      ],
    },
  };

  if (!includeExpired) {
    where[Op.or] = [
      { expirationDate: null },
      { expirationDate: { [Op.gte]: new Date() } },
    ];
  }

  const documents = await CloseoutDocument.findAll({
    where,
    order: [['expirationDate', 'ASC']],
  });

  return documents;
}

/**
 * 20. GET O&M MANUALS
 * Retrieves O&M manual documents
 */
export async function getOMManuals(
  closeoutId: string,
): Promise<CloseoutDocument[]> {
  return getDocumentsByType(closeoutId, [CloseoutDocumentType.OM_MANUAL]);
}

/**
 * 21. GET TRAINING MATERIALS
 * Retrieves training-related documents
 */
export async function getTrainingMaterials(
  closeoutId: string,
): Promise<CloseoutDocument[]> {
  return getDocumentsByType(closeoutId, [
    CloseoutDocumentType.TRAINING_MATERIAL,
    CloseoutDocumentType.TRAINING_CERTIFICATE,
  ]);
}

/**
 * 22. SCHEDULE FINAL INSPECTION
 * Schedules the final inspection for a closeout
 */
export async function scheduleFinalInspection(
  closeoutId: string,
  inspectionDate: Date,
  transaction?: Transaction,
): Promise<ConstructionCloseout> {
  const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction });
  if (!closeout) {
    throw new Error('Closeout not found');
  }

  await closeout.update(
    {
      finalInspectionScheduled: true,
      finalInspectionDate: inspectionDate,
      status: CloseoutStatus.FINAL_INSPECTION_SCHEDULED,
    },
    { transaction },
  );

  return closeout;
}

/**
 * 23. RECORD FINAL INSPECTION RESULT
 * Records the result of a final inspection
 */
export async function recordFinalInspectionResult(
  closeoutId: string,
  result: InspectionResult,
  inspectionDocumentId?: string,
  transaction?: Transaction,
): Promise<ConstructionCloseout> {
  const shouldCommit = !transaction;
  const t = transaction || await ConstructionCloseout.sequelize!.transaction();

  try {
    const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
    if (!closeout) {
      throw new Error('Closeout not found');
    }

    const updates: Partial<ConstructionCloseoutAttributes> = {
      finalInspectionResult: result,
    };

    if (result === InspectionResult.PASSED) {
      updates.status = CloseoutStatus.FINAL_INSPECTION_COMPLETE;
    } else if (result === InspectionResult.FAILED) {
      updates.status = CloseoutStatus.PUNCH_LIST_IN_PROGRESS;
    }

    await closeout.update(updates, { transaction: t });

    if (shouldCommit) {
      await t.commit();
    }

    return closeout;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 24. RECORD CERTIFICATE OF OCCUPANCY
 * Records the certificate of occupancy
 */
export async function recordCertificateOfOccupancy(
  closeoutId: string,
  coDate: Date,
  documentId?: string,
  transaction?: Transaction,
): Promise<ConstructionCloseout> {
  const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction });
  if (!closeout) {
    throw new Error('Closeout not found');
  }

  await closeout.update(
    {
      certificateOfOccupancyDate: coDate,
    },
    { transaction },
  );

  return closeout;
}

/**
 * 25. SCHEDULE OWNER TRAINING
 * Schedules owner training session
 */
export async function scheduleOwnerTraining(
  closeoutId: string,
  trainingDate: Date,
  transaction?: Transaction,
): Promise<ConstructionCloseout> {
  const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction });
  if (!closeout) {
    throw new Error('Closeout not found');
  }

  await closeout.update(
    {
      ownerTrainingRequired: true,
      ownerTrainingDate: trainingDate,
      status: CloseoutStatus.OWNER_TRAINING_SCHEDULED,
    },
    { transaction },
  );

  return closeout;
}

/**
 * 26. COMPLETE OWNER TRAINING
 * Marks owner training as completed
 */
export async function completeOwnerTraining(
  closeoutId: string,
  completionDate: Date,
  certificateDocumentId?: string,
  transaction?: Transaction,
): Promise<ConstructionCloseout> {
  const shouldCommit = !transaction;
  const t = transaction || await ConstructionCloseout.sequelize!.transaction();

  try {
    const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
    if (!closeout) {
      throw new Error('Closeout not found');
    }

    await closeout.update(
      {
        ownerTrainingCompleted: true,
        ownerTrainingDate: completionDate,
        status: CloseoutStatus.OWNER_TRAINING_COMPLETE,
      },
      { transaction: t },
    );

    await recalculateCloseoutCompletion(closeoutId, t);

    if (shouldCommit) {
      await t.commit();
    }

    return closeout;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 27. REGISTER WARRANTY
 * Registers a warranty for equipment or materials
 */
export async function registerWarranty(
  closeoutId: string,
  warrantyData: {
    title: string;
    documentType: CloseoutDocumentType;
    manufacturer: string;
    modelNumber?: string;
    serialNumber?: string;
    warrantyStartDate: Date;
    warrantyEndDate: Date;
    relatedEquipment?: string;
    relatedSystem?: string;
  },
  transaction?: Transaction,
): Promise<CloseoutDocument> {
  const shouldCommit = !transaction;
  const t = transaction || await CloseoutDocument.sequelize!.transaction();

  try {
    const document = await CloseoutDocument.create(
      {
        closeoutId,
        ...warrantyData,
        status: DocumentStatus.PENDING,
        version: '1.0',
        required: true,
      },
      { transaction: t },
    );

    // Update closeout warranty dates
    const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
    if (closeout) {
      const updates: Partial<ConstructionCloseoutAttributes> = {};

      if (!closeout.warrantyStartDate || warrantyData.warrantyStartDate < closeout.warrantyStartDate) {
        updates.warrantyStartDate = warrantyData.warrantyStartDate;
      }

      if (!closeout.warrantyEndDate || warrantyData.warrantyEndDate > closeout.warrantyEndDate) {
        updates.warrantyEndDate = warrantyData.warrantyEndDate;
      }

      if (Object.keys(updates).length > 0) {
        await closeout.update(updates, { transaction: t });
      }
    }

    if (shouldCommit) {
      await t.commit();
    }

    return document;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 28. GET EXPIRING WARRANTIES
 * Retrieves warranties expiring within a specified period
 */
export async function getExpiringWarranties(
  daysUntilExpiration: number,
  projectId?: string,
): Promise<CloseoutDocument[]> {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysUntilExpiration);

  const where: WhereOptions<CloseoutDocumentAttributes> = {
    documentType: {
      [Op.in]: [
        CloseoutDocumentType.WARRANTY_CERTIFICATE,
        CloseoutDocumentType.EQUIPMENT_WARRANTY,
        CloseoutDocumentType.MATERIAL_WARRANTY,
      ],
    },
    expirationDate: {
      [Op.between]: [new Date(), expirationDate],
    },
  };

  const include: any[] = [];

  if (projectId) {
    include.push({
      model: ConstructionCloseout,
      as: 'closeout',
      where: { projectId },
      required: true,
    });
  }

  const documents = await CloseoutDocument.findAll({
    where,
    include: include.length > 0 ? include : undefined,
    order: [['expirationDate', 'ASC']],
  });

  return documents;
}

/**
 * 29. PROCESS FINAL PAYMENT
 * Processes the final payment for a closeout
 */
export async function processFinalPayment(
  closeoutId: string,
  paymentStatus: PaymentStatus,
  paymentDate?: Date,
  transaction?: Transaction,
): Promise<ConstructionCloseout> {
  const shouldCommit = !transaction;
  const t = transaction || await ConstructionCloseout.sequelize!.transaction();

  try {
    const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
    if (!closeout) {
      throw new Error('Closeout not found');
    }

    const updates: Partial<ConstructionCloseoutAttributes> = {
      finalPaymentStatus: paymentStatus,
    };

    if (paymentStatus === PaymentStatus.PAID && paymentDate) {
      updates.finalPaymentDate = paymentDate;
    }

    await closeout.update(updates, { transaction: t });
    await recalculateCloseoutCompletion(closeoutId, t);

    if (shouldCommit) {
      await t.commit();
    }

    return closeout;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 30. RECORD LIEN RELEASE
 * Records receipt of a lien release
 */
export async function recordLienRelease(
  closeoutId: string,
  lienReleaseData: {
    title: string;
    contractorName: string;
    fileUrl?: string;
    fileName?: string;
  },
  transaction?: Transaction,
): Promise<CloseoutDocument> {
  const shouldCommit = !transaction;
  const t = transaction || await CloseoutDocument.sequelize!.transaction();

  try {
    const document = await CloseoutDocument.create(
      {
        closeoutId,
        documentType: CloseoutDocumentType.LIEN_RELEASE,
        title: lienReleaseData.title,
        description: `Lien release from ${lienReleaseData.contractorName}`,
        fileUrl: lienReleaseData.fileUrl,
        fileName: lienReleaseData.fileName,
        status: lienReleaseData.fileUrl ? DocumentStatus.SUBMITTED : DocumentStatus.PENDING,
        version: '1.0',
        required: true,
      },
      { transaction: t },
    );

    // Update closeout lien release counters
    const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
    if (closeout && lienReleaseData.fileUrl) {
      await closeout.increment('lienReleasesReceived', { transaction: t });
      await recalculateCloseoutCompletion(closeoutId, t);
    }

    if (shouldCommit) {
      await t.commit();
    }

    return document;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 31. GET LIEN RELEASE STATUS
 * Gets the lien release status for a closeout
 */
export async function getLienReleaseStatus(
  closeoutId: string,
): Promise<{
  required: number;
  received: number;
  pending: number;
  documents: CloseoutDocument[];
}> {
  const closeout = await ConstructionCloseout.findByPk(closeoutId);
  if (!closeout) {
    throw new Error('Closeout not found');
  }

  const documents = await getDocumentsByType(closeoutId, [CloseoutDocumentType.LIEN_RELEASE]);

  return {
    required: closeout.lienReleasesRequired,
    received: closeout.lienReleasesReceived,
    pending: closeout.lienReleasesRequired - closeout.lienReleasesReceived,
    documents,
  };
}

/**
 * 32. CREATE CLOSEOUT CHECKLIST
 * Creates a closeout checklist document
 */
export async function createCloseoutChecklist(
  closeoutId: string,
  checklistItems: Array<{
    item: string;
    required: boolean;
    completed: boolean;
    notes?: string;
  }>,
  transaction?: Transaction,
): Promise<CloseoutDocument> {
  const document = await CloseoutDocument.create(
    {
      closeoutId,
      documentType: CloseoutDocumentType.CLOSEOUT_CHECKLIST,
      title: 'Construction Closeout Checklist',
      status: DocumentStatus.IN_PROGRESS,
      version: '1.0',
      required: true,
      metadata: { checklistItems },
    },
    { transaction },
  );

  return document;
}

/**
 * 33. UPDATE CLOSEOUT CHECKLIST
 * Updates the closeout checklist
 */
export async function updateCloseoutChecklist(
  documentId: string,
  checklistItems: Array<{
    item: string;
    required: boolean;
    completed: boolean;
    notes?: string;
  }>,
  transaction?: Transaction,
): Promise<CloseoutDocument> {
  const document = await CloseoutDocument.findByPk(documentId, { transaction });
  if (!document) {
    throw new Error('Checklist document not found');
  }

  const allRequiredCompleted = checklistItems
    .filter((item) => item.required)
    .every((item) => item.completed);

  await document.update(
    {
      metadata: { checklistItems },
      status: allRequiredCompleted ? DocumentStatus.APPROVED : DocumentStatus.IN_PROGRESS,
    },
    { transaction },
  );

  return document;
}

/**
 * 34. GET CLOSEOUT CHECKLIST STATUS
 * Gets the status of the closeout checklist
 */
export async function getCloseoutChecklistStatus(
  closeoutId: string,
): Promise<{
  totalItems: number;
  completedItems: number;
  requiredItems: number;
  completedRequiredItems: number;
  percentComplete: number;
  checklist?: CloseoutDocument;
}> {
  const checklist = await CloseoutDocument.findOne({
    where: {
      closeoutId,
      documentType: CloseoutDocumentType.CLOSEOUT_CHECKLIST,
    },
  });

  if (!checklist || !checklist.metadata?.checklistItems) {
    return {
      totalItems: 0,
      completedItems: 0,
      requiredItems: 0,
      completedRequiredItems: 0,
      percentComplete: 0,
    };
  }

  const items = checklist.metadata.checklistItems as Array<{
    item: string;
    required: boolean;
    completed: boolean;
  }>;

  const totalItems = items.length;
  const completedItems = items.filter((item) => item.completed).length;
  const requiredItems = items.filter((item) => item.required).length;
  const completedRequiredItems = items.filter((item) => item.required && item.completed).length;

  return {
    totalItems,
    completedItems,
    requiredItems,
    completedRequiredItems,
    percentComplete: totalItems > 0 ? (completedItems / totalItems) * 100 : 0,
    checklist,
  };
}

/**
 * 35. CREATE LESSONS LEARNED DOCUMENT
 * Creates a lessons learned document
 */
export async function createLessonsLearnedDocument(
  closeoutId: string,
  lessonsData: {
    successes: string[];
    challenges: string[];
    improvements: string[];
    recommendations: string[];
  },
  transaction?: Transaction,
): Promise<CloseoutDocument> {
  const shouldCommit = !transaction;
  const t = transaction || await CloseoutDocument.sequelize!.transaction();

  try {
    const document = await CloseoutDocument.create(
      {
        closeoutId,
        documentType: CloseoutDocumentType.LESSONS_LEARNED,
        title: 'Project Lessons Learned',
        status: DocumentStatus.IN_PROGRESS,
        version: '1.0',
        required: true,
        metadata: lessonsData,
      },
      { transaction: t },
    );

    const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
    if (closeout) {
      await closeout.update({ lessonsLearnedCompleted: true }, { transaction: t });
      await recalculateCloseoutCompletion(closeoutId, t);
    }

    if (shouldCommit) {
      await t.commit();
    }

    return document;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 36. GET CLOSEOUT COMPLETION STATUS
 * Gets detailed completion status for a closeout
 */
export async function getCloseoutCompletionStatus(
  closeoutId: string,
): Promise<{
  closeout: ConstructionCloseout;
  punchListStatus: {
    total: number;
    open: number;
    closed: number;
    percentComplete: number;
  };
  documentStatus: {
    required: number;
    submitted: number;
    approved: number;
    percentComplete: number;
  };
  inspectionStatus: {
    scheduled: boolean;
    completed: boolean;
    passed: boolean;
  };
  trainingStatus: {
    required: boolean;
    completed: boolean;
  };
  paymentStatus: {
    status: PaymentStatus;
    paid: boolean;
  };
  lienReleaseStatus: {
    required: number;
    received: number;
    percentComplete: number;
  };
  overallCompletion: number;
}> {
  const closeout = await ConstructionCloseout.findByPk(closeoutId);
  if (!closeout) {
    throw new Error('Closeout not found');
  }

  const closedItems = closeout.totalPunchListItems - closeout.openPunchListItems;

  return {
    closeout,
    punchListStatus: {
      total: closeout.totalPunchListItems,
      open: closeout.openPunchListItems,
      closed: closedItems,
      percentComplete:
        closeout.totalPunchListItems > 0
          ? (closedItems / closeout.totalPunchListItems) * 100
          : 100,
    },
    documentStatus: {
      required: closeout.requiredDocumentsCount,
      submitted: closeout.submittedDocumentsCount,
      approved: closeout.approvedDocumentsCount,
      percentComplete:
        closeout.requiredDocumentsCount > 0
          ? (closeout.approvedDocumentsCount / closeout.requiredDocumentsCount) * 100
          : 100,
    },
    inspectionStatus: {
      scheduled: closeout.finalInspectionScheduled,
      completed: closeout.finalInspectionResult !== undefined && closeout.finalInspectionResult !== null,
      passed: closeout.finalInspectionResult === InspectionResult.PASSED,
    },
    trainingStatus: {
      required: closeout.ownerTrainingRequired,
      completed: closeout.ownerTrainingCompleted,
    },
    paymentStatus: {
      status: closeout.finalPaymentStatus,
      paid: closeout.finalPaymentStatus === PaymentStatus.PAID,
    },
    lienReleaseStatus: {
      required: closeout.lienReleasesRequired,
      received: closeout.lienReleasesReceived,
      percentComplete:
        closeout.lienReleasesRequired > 0
          ? (closeout.lienReleasesReceived / closeout.lienReleasesRequired) * 100
          : 100,
    },
    overallCompletion: closeout.completionPercentage,
  };
}

/**
 * 37. MARK SUBSTANTIAL COMPLETION
 * Marks a project as substantially complete
 */
export async function markSubstantialCompletion(
  closeoutId: string,
  completionDate: Date,
  transaction?: Transaction,
): Promise<ConstructionCloseout> {
  const shouldCommit = !transaction;
  const t = transaction || await ConstructionCloseout.sequelize!.transaction();

  try {
    const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
    if (!closeout) {
      throw new Error('Closeout not found');
    }

    await closeout.update(
      {
        substantialCompletionDate: completionDate,
        status: CloseoutStatus.SUBSTANTIALLY_COMPLETE,
      },
      { transaction: t },
    );

    await recalculateCloseoutCompletion(closeoutId, t);

    if (shouldCommit) {
      await t.commit();
    }

    return closeout;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 38. MARK FINAL COMPLETION
 * Marks a project as fully complete
 */
export async function markFinalCompletion(
  closeoutId: string,
  completionDate: Date,
  transaction?: Transaction,
): Promise<ConstructionCloseout> {
  const shouldCommit = !transaction;
  const t = transaction || await ConstructionCloseout.sequelize!.transaction();

  try {
    const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction: t });
    if (!closeout) {
      throw new Error('Closeout not found');
    }

    // Validate all requirements are met
    const status = await getCloseoutCompletionStatus(closeoutId);

    if (status.punchListStatus.open > 0) {
      throw new Error('Cannot mark final completion with open punch list items');
    }

    if (status.documentStatus.approved < status.documentStatus.required) {
      throw new Error('Cannot mark final completion with unapproved required documents');
    }

    await closeout.update(
      {
        finalCompletionDate: completionDate,
        status: CloseoutStatus.FULLY_COMPLETE,
        completionPercentage: 100,
      },
      { transaction: t },
    );

    if (shouldCommit) {
      await t.commit();
    }

    return closeout;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 39. GET CLOSEOUTS BY STATUS
 * Retrieves closeouts filtered by status
 */
export async function getCloseoutsByStatus(
  status: CloseoutStatus[],
  options?: {
    projectId?: string;
    contractorId?: string;
    limit?: number;
    offset?: number;
  },
): Promise<{ closeouts: ConstructionCloseout[]; total: number }> {
  const where: WhereOptions<ConstructionCloseoutAttributes> = {
    status: { [Op.in]: status },
  };

  if (options?.projectId) {
    where.projectId = options.projectId;
  }

  if (options?.contractorId) {
    where.contractorId = options.contractorId;
  }

  const { count, rows } = await ConstructionCloseout.findAndCountAll({
    where,
    limit: options?.limit,
    offset: options?.offset,
    order: [['createdAt', 'DESC']],
  });

  return { closeouts: rows, total: count };
}

/**
 * 40. GET ACTIVE CLOSEOUTS
 * Retrieves all active (non-complete) closeouts
 */
export async function getActiveCloseouts(
  projectId?: string,
): Promise<ConstructionCloseout[]> {
  const where: WhereOptions<ConstructionCloseoutAttributes> = {
    status: {
      [Op.notIn]: [CloseoutStatus.FULLY_COMPLETE, CloseoutStatus.CANCELLED],
    },
  };

  if (projectId) {
    where.projectId = projectId;
  }

  const closeouts = await ConstructionCloseout.findAll({
    where,
    include: [
      {
        model: PunchListItem,
        as: 'punchListItems',
        where: {
          status: {
            [Op.notIn]: [PunchListItemStatus.CLOSED, PunchListItemStatus.CANCELLED],
          },
        },
        required: false,
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  return closeouts;
}

/**
 * 41. GET CLOSEOUT SUMMARY REPORT
 * Generates a comprehensive summary report for a closeout
 */
export async function getCloseoutSummaryReport(
  closeoutId: string,
): Promise<{
  closeout: ConstructionCloseout;
  completionStatus: any;
  punchListSummary: {
    byStatus: Record<string, number>;
    byPriority: Record<string, number>;
    byCategory: Record<string, number>;
  };
  documentSummary: {
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  };
  timeline: {
    created: Date;
    substantialCompletion?: Date;
    finalInspection?: Date;
    ownerTraining?: Date;
    finalCompletion?: Date;
  };
}> {
  const closeout = await getCloseoutByIdWithAssociations(closeoutId, {
    includePunchList: true,
    includeDocuments: true,
  });

  if (!closeout) {
    throw new Error('Closeout not found');
  }

  const completionStatus = await getCloseoutCompletionStatus(closeoutId);

  // Aggregate punch list items
  const punchListByStatus: Record<string, number> = {};
  const punchListByPriority: Record<string, number> = {};
  const punchListByCategory: Record<string, number> = {};

  closeout.punchListItems?.forEach((item) => {
    punchListByStatus[item.status] = (punchListByStatus[item.status] || 0) + 1;
    punchListByPriority[item.priority] = (punchListByPriority[item.priority] || 0) + 1;
    punchListByCategory[item.category] = (punchListByCategory[item.category] || 0) + 1;
  });

  // Aggregate documents
  const documentByType: Record<string, number> = {};
  const documentByStatus: Record<string, number> = {};

  closeout.documents?.forEach((doc) => {
    documentByType[doc.documentType] = (documentByType[doc.documentType] || 0) + 1;
    documentByStatus[doc.status] = (documentByStatus[doc.status] || 0) + 1;
  });

  return {
    closeout,
    completionStatus,
    punchListSummary: {
      byStatus: punchListByStatus,
      byPriority: punchListByPriority,
      byCategory: punchListByCategory,
    },
    documentSummary: {
      byType: documentByType,
      byStatus: documentByStatus,
    },
    timeline: {
      created: closeout.createdAt!,
      substantialCompletion: closeout.substantialCompletionDate,
      finalInspection: closeout.finalInspectionDate,
      ownerTraining: closeout.ownerTrainingDate,
      finalCompletion: closeout.finalCompletionDate,
    },
  };
}

/**
 * 42. SEARCH CLOSEOUTS
 * Searches closeouts with multiple criteria
 */
export async function searchCloseouts(
  criteria: {
    projectName?: string;
    contractorName?: string;
    status?: CloseoutStatus[];
    minCompletionPercentage?: number;
    maxCompletionPercentage?: number;
    dateFrom?: Date;
    dateTo?: Date;
  },
  options?: {
    limit?: number;
    offset?: number;
    orderBy?: string;
    orderDirection?: 'ASC' | 'DESC';
  },
): Promise<{ closeouts: ConstructionCloseout[]; total: number }> {
  const where: WhereOptions<ConstructionCloseoutAttributes> = {};

  if (criteria.projectName) {
    where.projectName = { [Op.iLike]: `%${criteria.projectName}%` };
  }

  if (criteria.contractorName) {
    where.contractorName = { [Op.iLike]: `%${criteria.contractorName}%` };
  }

  if (criteria.status && criteria.status.length > 0) {
    where.status = { [Op.in]: criteria.status };
  }

  if (criteria.minCompletionPercentage !== undefined) {
    where.completionPercentage = { [Op.gte]: criteria.minCompletionPercentage };
  }

  if (criteria.maxCompletionPercentage !== undefined) {
    where.completionPercentage = {
      ...where.completionPercentage,
      [Op.lte]: criteria.maxCompletionPercentage,
    };
  }

  if (criteria.dateFrom) {
    where.createdAt = { [Op.gte]: criteria.dateFrom };
  }

  if (criteria.dateTo) {
    where.createdAt = {
      ...where.createdAt,
      [Op.lte]: criteria.dateTo,
    };
  }

  const { count, rows } = await ConstructionCloseout.findAndCountAll({
    where,
    limit: options?.limit,
    offset: options?.offset,
    order: [[options?.orderBy || 'createdAt', options?.orderDirection || 'DESC']],
  });

  return { closeouts: rows, total: count };
}

/**
 * 43. GET CLOSEOUTS PENDING FINAL PAYMENT
 * Retrieves closeouts awaiting final payment
 */
export async function getCloseoutsPendingFinalPayment(): Promise<ConstructionCloseout[]> {
  const closeouts = await ConstructionCloseout.findAll({
    where: {
      finalPaymentStatus: {
        [Op.in]: [PaymentStatus.PENDING, PaymentStatus.APPROVED],
      },
      status: {
        [Op.in]: [
          CloseoutStatus.SUBSTANTIALLY_COMPLETE,
          CloseoutStatus.FULLY_COMPLETE,
        ],
      },
    },
    order: [['substantialCompletionDate', 'ASC']],
  });

  return closeouts;
}

/**
 * 44. DELETE CLOSEOUT
 * Soft deletes a closeout and all associated records
 */
export async function deleteCloseout(
  id: string,
  transaction?: Transaction,
): Promise<boolean> {
  const shouldCommit = !transaction;
  const t = transaction || await ConstructionCloseout.sequelize!.transaction();

  try {
    const closeout = await ConstructionCloseout.findByPk(id, { transaction: t });
    if (!closeout) {
      throw new Error('Closeout not found');
    }

    // Delete associated records
    await PunchListItem.destroy({
      where: { closeoutId: id },
      transaction: t,
    });

    await CloseoutDocument.destroy({
      where: { closeoutId: id },
      transaction: t,
    });

    // Delete closeout
    await closeout.destroy({ transaction: t });

    if (shouldCommit) {
      await t.commit();
    }

    return true;
  } catch (error) {
    if (shouldCommit) {
      await t.rollback();
    }
    throw error;
  }
}

/**
 * 45. EXPORT CLOSEOUT DATA
 * Exports complete closeout data with all associations
 */
export async function exportCloseoutData(
  closeoutId: string,
): Promise<{
  closeout: ConstructionCloseout;
  punchListItems: PunchListItem[];
  documents: CloseoutDocument[];
  summary: any;
}> {
  const closeout = await getCloseoutByIdWithAssociations(closeoutId, {
    includePunchList: true,
    includeDocuments: true,
  });

  if (!closeout) {
    throw new Error('Closeout not found');
  }

  const summary = await getCloseoutSummaryReport(closeoutId);

  return {
    closeout,
    punchListItems: closeout.punchListItems || [],
    documents: closeout.documents || [],
    summary,
  };
}

// ====================================================================
// HELPER FUNCTIONS
// ====================================================================

/**
 * Updates punch list counters for a closeout
 */
async function updateCloseoutPunchListCounters(
  closeoutId: string,
  transaction?: Transaction,
): Promise<void> {
  const items = await PunchListItem.findAll({
    where: { closeoutId },
    transaction,
  });

  const openItems = items.filter(
    (item) => ![PunchListItemStatus.CLOSED, PunchListItemStatus.CANCELLED].includes(item.status),
  ).length;

  const criticalItems = items.filter(
    (item) =>
      item.priority === PunchListItemPriority.CRITICAL &&
      ![PunchListItemStatus.CLOSED, PunchListItemStatus.CANCELLED].includes(item.status),
  ).length;

  const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction });
  if (closeout) {
    await closeout.update(
      {
        totalPunchListItems: items.length,
        openPunchListItems: openItems,
        criticalPunchListItems: criticalItems,
      },
      { transaction },
    );
  }
}

/**
 * Recalculates overall completion percentage for a closeout
 */
async function recalculateCloseoutCompletion(
  closeoutId: string,
  transaction?: Transaction,
): Promise<void> {
  const closeout = await ConstructionCloseout.findByPk(closeoutId, { transaction });
  if (!closeout) {
    return;
  }

  let totalWeight = 0;
  let completedWeight = 0;

  // Punch list completion (40% weight)
  totalWeight += 40;
  if (closeout.totalPunchListItems > 0) {
    const closedItems = closeout.totalPunchListItems - closeout.openPunchListItems;
    completedWeight += (closedItems / closeout.totalPunchListItems) * 40;
  } else {
    completedWeight += 40;
  }

  // Document completion (30% weight)
  totalWeight += 30;
  if (closeout.requiredDocumentsCount > 0) {
    completedWeight += (closeout.approvedDocumentsCount / closeout.requiredDocumentsCount) * 30;
  } else {
    completedWeight += 30;
  }

  // Final inspection (10% weight)
  totalWeight += 10;
  if (closeout.finalInspectionResult === InspectionResult.PASSED) {
    completedWeight += 10;
  }

  // Owner training (10% weight)
  totalWeight += 10;
  if (!closeout.ownerTrainingRequired || closeout.ownerTrainingCompleted) {
    completedWeight += 10;
  }

  // Final payment (10% weight)
  totalWeight += 10;
  if (closeout.finalPaymentStatus === PaymentStatus.PAID) {
    completedWeight += 10;
  }

  const completionPercentage = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;

  await closeout.update({ completionPercentage }, { transaction });
}

// ====================================================================
// EXPORTS
// ====================================================================

export default {
  // Models
  ConstructionCloseout,
  PunchListItem,
  CloseoutDocument,

  // Enums
  CloseoutStatus,
  PunchListItemStatus,
  PunchListItemPriority,
  PunchListItemCategory,
  CloseoutDocumentType,
  DocumentStatus,
  InspectionResult,
  TrainingStatus,
  PaymentStatus,

  // DTOs
  CreateConstructionCloseoutDto,
  UpdateConstructionCloseoutDto,
  CreatePunchListItemDto,
  UpdatePunchListItemDto,
  CreateCloseoutDocumentDto,
  UpdateCloseoutDocumentDto,

  // Functions
  createConstructionCloseout,
  getCloseoutByIdWithAssociations,
  updateCloseoutStatus,
  createPunchListItem,
  getPunchListItemsForCloseout,
  updatePunchListItemStatus,
  assignPunchListItem,
  getCriticalPunchListItems,
  getOverduePunchListItems,
  bulkUpdatePunchListItems,
  createCloseoutDocument,
  uploadCloseoutDocument,
  submitCloseoutDocument,
  approveCloseoutDocument,
  rejectCloseoutDocument,
  getDocumentsByType,
  getPendingDocuments,
  getAsBuiltDocuments,
  getWarrantyDocuments,
  getOMManuals,
  getTrainingMaterials,
  scheduleFinalInspection,
  recordFinalInspectionResult,
  recordCertificateOfOccupancy,
  scheduleOwnerTraining,
  completeOwnerTraining,
  registerWarranty,
  getExpiringWarranties,
  processFinalPayment,
  recordLienRelease,
  getLienReleaseStatus,
  createCloseoutChecklist,
  updateCloseoutChecklist,
  getCloseoutChecklistStatus,
  createLessonsLearnedDocument,
  getCloseoutCompletionStatus,
  markSubstantialCompletion,
  markFinalCompletion,
  getCloseoutsByStatus,
  getActiveCloseouts,
  getCloseoutSummaryReport,
  searchCloseouts,
  getCloseoutsPendingFinalPayment,
  deleteCloseout,
  exportCloseoutData,
};
