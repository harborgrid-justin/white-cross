
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
import { MilestoneStatus } from '../types/contract.types';
import { ConstructionContract } from './construction-contract.model';

@Table({
  tableName: 'contract_milestones',
  timestamps: true,
})
export class ContractMilestone extends Model<ContractMilestone> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => ConstructionContract)
  @AllowNull(false)
  @Column(DataType.UUID)
  contractId: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Default(MilestoneStatus.NOT_STARTED)
  @Column({
    type: DataType.ENUM(...Object.values(MilestoneStatus)),
  })
  status: MilestoneStatus;

  @AllowNull(false)
  @Column(DataType.DATE)
  scheduledDate: Date;

  @Column(DataType.DATE)
  actualDate?: Date;

  @AllowNull(false)
  @Column(DataType.DECIMAL(5, 2))
  paymentPercentage: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  paymentAmount: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isPaid: boolean;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  deliverables: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  acceptanceCriteria: string[];

  @Column(DataType.STRING(100))
  verifiedBy?: string;

  @Column(DataType.DATE)
  verifiedDate?: Date;

  @Column(DataType.TEXT)
  notes?: string;

  @BelongsTo(() => ConstructionContract)
  contract: ConstructionContract;
}
