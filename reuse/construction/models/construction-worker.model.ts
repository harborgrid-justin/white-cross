
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
import { LaborCraft, UnionStatus } from '../types/labor.types';

@Table({ tableName: 'construction_workers', timestamps: true })
export class ConstructionWorker extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @Column({ type: DataType.STRING })
  email: string;

  @Column({ type: DataType.STRING })
  phone: string;

  @Column({ type: DataType.ENUM(...Object.values(LaborCraft)), allowNull: false })
  primaryCraft: LaborCraft;

  @Column({ type: DataType.JSON })
  secondaryCrafts: LaborCraft[];

  @Column({ type: DataType.ENUM(...Object.values(UnionStatus)), defaultValue: UnionStatus.NON_UNION })
  unionStatus: UnionStatus;

  @Column({ type: DataType.STRING })
  unionLocal: string;

  @Column({ type: DataType.STRING })
  unionCardNumber: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isApprentice: boolean;

  @Column({ type: DataType.INTEGER })
  apprenticeshipYear: number;

  @Column({ type: DataType.JSON })
  certifications: Array<any>;

  @Column({ type: DataType.JSON })
  safetyTraining: Array<any>;

  @Column({ type: DataType.DECIMAL(8, 2) })
  baseHourlyRate: number;

  @Column({ type: DataType.STRING })
  emergencyContact: string;

  @Column({ type: DataType.STRING })
  emergencyPhone: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  isActive: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
