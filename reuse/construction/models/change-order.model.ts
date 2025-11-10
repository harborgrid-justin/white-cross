
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  Index,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ConstructionProject } from './project.model';

export enum ChangeOrderStatus {
    DRAFT = 'DRAFT',
    SUBMITTED = 'SUBMITTED',
    UNDER_REVIEW = 'UNDER_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    IMPLEMENTED = 'IMPLEMENTED',
}

export enum ChangeOrderType {
    SCOPE = 'SCOPE',
    SCHEDULE = 'SCHEDULE',
    COST = 'COST',
    COMBINED = 'COMBINED',
}

@Table({
  tableName: 'change_orders',
  timestamps: true,
})
export class ChangeOrder extends Model<ChangeOrder> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => ConstructionProject)
  @AllowNull(false)
  @Column(DataType.UUID)
  projectId: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(50))
  changeOrderNumber: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(ChangeOrderType)),
  })
  changeType: ChangeOrderType;

  @AllowNull(false)
  @Column(DataType.STRING)
  requestedBy: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(19, 2))
  costImpact: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  scheduleImpact: number; // in days

  @AllowNull(false)
  @Default(ChangeOrderStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(ChangeOrderStatus)),
  })
  status: ChangeOrderStatus;

  @Column(DataType.DATE)
  implementedDate?: Date;

  @BelongsTo(() => ConstructionProject)
  project: ConstructionProject;
}
