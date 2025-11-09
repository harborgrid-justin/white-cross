
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  ForeignKey,
} from 'sequelize-typescript';
import { ClaimStatus, ClaimPriority } from '../types/warranty.types';
import { ConstructionWarranty } from './construction-warranty.model';

@Table({
  tableName: 'warranty_claims',
  timestamps: true,
  indexes: [
    { fields: ['claimNumber'], unique: true },
    { fields: ['warrantyId'] },
    { fields: ['status'] },
    { fields: ['priority'] },
    { fields: ['assignedTo'] },
    { fields: ['issueDate'] },
    { fields: ['reportedBy'] },
    { fields: ['escalated'] },
    { fields: ['component'] },
  ],
})
export class WarrantyClaim extends Model {
  @PrimaryKey
  @Default(DataType.INTEGER)
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => ConstructionWarranty)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  warrantyId: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  claimNumber: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  title: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  issueDate: Date;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  reportedBy: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  reportedByContact: string;

  @AllowNull(false)
  @Default(ClaimPriority.MEDIUM)
  @Column({
    type: DataType.ENUM(...Object.values(ClaimPriority)),
  })
  priority!: ClaimPriority;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  component!: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  location!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  defectDescription!: string;

  @Column(DataType.TEXT)
  rootCause?: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(12, 2))
  estimatedCost!: number;

  @Column(DataType.DECIMAL(12, 2))
  actualCost?: number;

  @Column(DataType.DECIMAL(12, 2))
  laborCost?: number;

  @Column(DataType.DECIMAL(12, 2))
  materialCost?: number;

  @AllowNull(false)
  @Default(ClaimStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(ClaimStatus)),
  })
  status!: ClaimStatus;

  @Column(DataType.STRING(100))
  assignedTo?: string;

  @Column(DataType.DATE)
  assignedDate?: Date;

  @Column(DataType.STRING(100))
  reviewedBy?: string;

  @Column(DataType.DATE)
  reviewedDate?: Date;

  @Column(DataType.TEXT)
  reviewNotes?: string;

  @Column(DataType.STRING(100))
  approvedBy?: string;

  @Column(DataType.DATE)
  approvedDate?: Date;

  @Column(DataType.TEXT)
  rejectionReason?: string;

  @Column(DataType.DATE)
  resolutionDate?: Date;

  @Column(DataType.TEXT)
  resolutionDescription?: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  photos!: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  documents!: string[];

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  callbackScheduled!: boolean;

  @Column(DataType.DATE)
  callbackDate?: Date;

  @Column(DataType.DATE)
  completionDate?: Date;

  @Column(DataType.TEXT)
  completionNotes?: string;

  @Column(DataType.INTEGER)
  satisfactionRating?: number;

  @Column(DataType.TEXT)
  feedback?: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  escalated!: boolean;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  escalationLevel!: number;

  @Column(DataType.TEXT)
  escalationReason?: string;

  @Column(DataType.TEXT)
  disputeReason?: string;

  @Column(DataType.TEXT)
  disputeResolution?: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  tags!: string[];

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata!: Record<string, any>;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  createdBy!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  updatedBy!: string;
}
