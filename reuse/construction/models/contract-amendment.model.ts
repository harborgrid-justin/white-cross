
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
import { AmendmentStatus } from '../types/contract.types';
import { ConstructionContract } from './construction-contract.model';

@Table({
  tableName: 'contract_amendments',
  timestamps: true,
})
export class ContractAmendment extends Model<ContractAmendment> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => ConstructionContract)
  @AllowNull(false)
  @Column(DataType.UUID)
  contractId: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  amendmentNumber: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Default(AmendmentStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(AmendmentStatus)),
  })
  status: AmendmentStatus;

  @AllowNull(false)
  @Column(DataType.ENUM('scope', 'time', 'cost', 'terms', 'multiple'))
  changeType: 'scope' | 'time' | 'cost' | 'terms' | 'multiple';

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  costImpact: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  timeImpact: number; // in days

  @Column(DataType.DATE)
  newCompletionDate?: Date;

  @Column(DataType.DECIMAL(19, 2))
  newContractAmount?: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  justification: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  requestedBy: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  requestedDate: Date;

  @Column(DataType.STRING(100))
  reviewedBy?: string;

  @Column(DataType.DATE)
  reviewedDate?: Date;

  @Column(DataType.STRING(100))
  approvedBy?: string;

  @Column(DataType.DATE)
  approvedDate?: Date;

  @Column(DataType.DATE)
  executedDate?: Date;

  @Column(DataType.DATE)
  effectiveDate?: Date;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  attachments?: string[];

  @BelongsTo(() => ConstructionContract)
  contract: ConstructionContract;
}
