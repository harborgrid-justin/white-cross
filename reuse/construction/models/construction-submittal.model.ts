
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  HasMany,
} from 'sequelize-typescript';
import { SubmittalStatus, SubmittalType, SubmittalPriority } from '../types/submittal.types';
import { SubmittalReview } from './submittal-review.model';

@Table({
  tableName: 'construction_submittals',
  timestamps: true,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['submittalNumber'], unique: true },
    { fields: ['specSection'] },
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['assignedReviewer'] },
    { fields: ['ballInCourt'] },
    { fields: ['dateRequired'] },
    { fields: ['isOverdue'] },
    { fields: ['projectId', 'status'] },
    { fields: ['projectId', 'specSection'] },
    { fields: ['projectId', 'dateRequired'] },
  ],
})
export class ConstructionSubmittal extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  projectId: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  submittalNumber: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  specSection: string;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  title: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(SubmittalType)),
  })
  type: SubmittalType;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  submittedBy: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  submittedByCompany: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  submittedByEmail: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  dateSubmitted: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  dateRequired: Date;

  @Column(DataType.DATE)
  dateReceived?: Date;

  @AllowNull(false)
  @Default(SubmittalPriority.MEDIUM)
  @Column({
    type: DataType.ENUM(...Object.values(SubmittalPriority)),
  })
  priority: SubmittalPriority;

  @AllowNull(false)
  @Default(SubmittalStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(SubmittalStatus)),
  })
  status: SubmittalStatus;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  revisionNumber: number;

  @Column(DataType.UUID)
  originalSubmittalId?: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  ballInCourt: string;

  @Column(DataType.STRING(100))
  assignedReviewer?: string;

  @Column(DataType.STRING(200))
  assignedReviewerEmail?: string;

  @Column(DataType.DATE)
  reviewStartDate?: Date;

  @Column(DataType.DATE)
  reviewCompletedDate?: Date;

  @Column(DataType.STRING(50))
  finalAction?: string;

  @Column(DataType.STRING(100))
  finalActionBy?: string;

  @Column(DataType.DATE)
  finalActionDate?: Date;

  @AllowNull(false)
  @Default(14)
  @Column(DataType.INTEGER)
  leadTimeDays: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  daysInReview: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isOverdue: boolean;

  @Column(DataType.DATE)
  closedDate?: Date;

  @Column(DataType.STRING(100))
  closedBy?: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  documentUrls: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  markupUrls: string[];

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  complianceVerified: boolean;

  @Column(DataType.DECIMAL(5, 2))
  complianceScore?: number;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  tags: string[];

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;

  @HasMany(() => SubmittalReview)
  reviews: SubmittalReview[];
}
