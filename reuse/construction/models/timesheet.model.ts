
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { TimesheetStatus, LaborCraft } from '../types/labor.types';

@Table({ tableName: 'timesheets', timestamps: true })
export class Timesheet extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.UUID, allowNull: false })
  workerId: string;

  @Column({ type: DataType.UUID, allowNull: false })
  projectId: string;

  @Column({ type: DataType.DATE, allowNull: false })
  weekEnding: Date;

  @Column({ type: DataType.ENUM(...Object.values(TimesheetStatus)), defaultValue: TimesheetStatus.DRAFT })
  status: TimesheetStatus;

  @Column({ type: DataType.DECIMAL(8, 2), defaultValue: 0 })
  regularHours: number;

  @Column({ type: DataType.DECIMAL(8, 2), defaultValue: 0 })
  overtimeHours: number;

  @Column({ type: DataType.DECIMAL(8, 2), defaultValue: 0 })
  doubleTimeHours: number;

  @Column({ type: DataType.DECIMAL(10, 2), defaultValue: 0 })
  totalWages: number;

  @Column({ type: DataType.ENUM(...Object.values(LaborCraft)) })
  craft: LaborCraft;

  @Column({ type: DataType.DECIMAL(8, 2) })
  hourlyRate: number;

  @Column({ type: DataType.DECIMAL(8, 2) })
  prevailingWageRate: number;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPrevailingWage: boolean;

  @Column({ type: DataType.UUID })
  approvedBy: string;

  @Column({ type: DataType.DATE })
  approvedAt: Date;

  @Column({ type: DataType.TEXT })
  rejectionReason: string;

  @Column({ type: DataType.JSON })
  dailyEntries: Array<any>;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
