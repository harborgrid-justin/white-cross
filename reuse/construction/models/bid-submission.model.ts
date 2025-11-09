
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
  BelongsTo,
} from 'sequelize-typescript';
import { BidStatus } from '../types/bid.types';
import { BidSolicitation } from './bid-solicitation.model';

@Table({
  tableName: 'bid_submissions',
  timestamps: true,
  indexes: [
    { fields: ['solicitationId'] },
    { fields: ['vendorId'] },
    { fields: ['status'] },
    { fields: ['rank'] },
  ],
})
export class BidSubmission extends Model<BidSubmission> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => BidSolicitation)
  @AllowNull(false)
  @Column(DataType.UUID)
  solicitationId: string;

  @AllowNull(false)
  @Index
  @Column(DataType.UUID)
  vendorId: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  vendorName: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  bidNumber: string;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  submittalDate: Date;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  bidAmount: number;

  @Column(DataType.DECIMAL(19, 2))
  bidBondAmount?: number;

  @Column(DataType.STRING(255))
  bidBondProvider?: string;

  @Column(DataType.DECIMAL(10, 2))
  technicalScore?: number;

  @Column(DataType.DECIMAL(10, 2))
  financialScore?: number;

  @Column(DataType.DECIMAL(10, 2))
  totalScore?: number;

  @Column(DataType.INTEGER)
  rank?: number;

  @AllowNull(false)
  @Default(BidStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(BidStatus)),
  })
  status: BidStatus;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  responsiveness: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  responsibility: boolean;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  scheduleProposed: number; // in days

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  alternatesProvided: boolean;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  valueEngineeringProposals: any[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  clarifications: any[];

  @Column(DataType.TEXT)
  evaluationNotes?: string;

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;

  @BelongsTo(() => BidSolicitation)
  solicitation: BidSolicitation;
}
