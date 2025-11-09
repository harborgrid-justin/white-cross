
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
import { ConstructionProject } from './project.model';
import { ChangeRequestStatus, ChangeOrderType, ChangeCategory } from '../types/change-order.types';

@Table({
  tableName: 'change_requests',
  timestamps: true,
})
export class ChangeRequest extends Model<ChangeRequest> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  changeRequestNumber: string;

  @ForeignKey(() => ConstructionProject)
  @AllowNull(false)
  @Column(DataType.UUID)
  projectId: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  projectName: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  contractId: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  contractNumber: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Default(ChangeRequestStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(ChangeRequestStatus)),
  })
  status: ChangeRequestStatus;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(ChangeOrderType)),
  })
  changeType: ChangeOrderType;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(ChangeCategory)),
  })
  changeCategory: ChangeCategory;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  requestedBy: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  requestedByName: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  requestDate: Date;

  @Column(DataType.DATE)
  requiredByDate?: Date;

  @AllowNull(false)
  @Column(DataType.TEXT)
  justification: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  affectedAreas: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  relatedDrawings: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  relatedSpecifications: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  attachments: string[];

  @AllowNull(false)
  @Column(DataType.ENUM('low', 'medium', 'high', 'critical'))
  urgency: 'low' | 'medium' | 'high' | 'critical';

  @Column(DataType.DECIMAL(19, 2))
  estimatedCostImpact?: number;

  @Column(DataType.INTEGER)
  estimatedTimeImpact?: number; // in days

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;

  @BelongsTo(() => ConstructionProject)
  project: ConstructionProject;
}
