
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
import { BidSolicitationStatus, ProcurementMethod, AwardMethod } from '../types/bid.types';
import { BidSubmission } from './bid-submission.model';

@Table({
  tableName: 'bid_solicitations',
  timestamps: true,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['status'] },
    { fields: ['procurementMethod'] },
    { fields: ['openingDate'] },
    { fields: ['closingDate'] },
  ],
})
export class BidSolicitation extends Model<BidSolicitation> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  solicitationNumber: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  projectId: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(ProcurementMethod)),
  })
  procurementMethod: ProcurementMethod;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(AwardMethod)),
  })
  awardMethod: AwardMethod;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  estimatedValue: number;

  @Column(DataType.DATE)
  publishedDate?: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  openingDate: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  closingDate: Date;

  @Column(DataType.DATE)
  prebidMeetingDate?: Date;

  @Column(DataType.STRING(255))
  prebidMeetingLocation?: string;

  @AllowNull(false)
  @Default(BidSolicitationStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(BidSolicitationStatus)),
  })
  status: BidSolicitationStatus;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  bondRequirement: boolean;

  @Column(DataType.DECIMAL(5, 2))
  bondPercentage?: number;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  insuranceRequirements: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  evaluationCriteria: any[];

  @Column(DataType.DECIMAL(5, 2))
  smallBusinessGoals?: number;

  @Column(DataType.DECIMAL(5, 2))
  dbeGoals?: number;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  documents: any[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  addenda: any[];

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  createdBy: string;

  @Column(DataType.STRING(100))
  updatedBy?: string;

  @HasMany(() => BidSubmission)
  submissions: BidSubmission[];
}
