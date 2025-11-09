
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { WarrantyType, WarrantyStatus } from '../types/warranty.types';

@Table({
  tableName: 'construction_warranties',
  timestamps: true,
  indexes: [
    { fields: ['warrantyNumber'], unique: true },
    { fields: ['projectId'] },
    { fields: ['warrantyType'] },
    { fields: ['status'] },
    { fields: ['contractorId'] },
    { fields: ['startDate'] },
    { fields: ['endDate'] },
    { fields: ['component'] },
    { fields: ['extendedWarranty'] },
    { fields: ['originalWarrantyId'] },
  ],
})
export class ConstructionWarranty extends Model {
  @PrimaryKey
  @Default(DataType.INTEGER)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Index
  @Column(DataType.INTEGER)
  projectId: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  warrantyNumber: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(WarrantyType)),
  })
  warrantyType: WarrantyType;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  title: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  component: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  location: string;

  @AllowNull(false)
  @Index
  @Column(DataType.INTEGER)
  contractorId: number;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  contractorName: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  contractorContact: string;

  @Column(DataType.INTEGER)
  manufacturerId?: number;

  @Column(DataType.STRING(200))
  manufacturerName?: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  startDate: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  endDate: Date;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  durationMonths: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(12, 2))
  coverageAmount: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(12, 2))
  deductible: number;

  @AllowNull(false)
  @Column(DataType.TEXT)
  terms: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.TEXT))
  exclusions: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.TEXT))
  conditions: string[];

  @AllowNull(false)
  @Default(WarrantyStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(WarrantyStatus)),
  })
  status: WarrantyStatus;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  documentUrls: string[];

  @Column(DataType.STRING(100))
  certificateNumber?: string;

  @Column(DataType.STRING(100))
  policyNumber?: string;

  @Column(DataType.STRING(200))
  insuranceProvider?: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  notificationsSent: number;

  @Column(DataType.DATE)
  lastNotificationDate?: Date;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  extendedWarranty: boolean;

  @Index
  @Column(DataType.INTEGER)
  originalWarrantyId?: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  autoRenewalEnabled: boolean;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  tags: string[];

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  createdBy: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  updatedBy: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
