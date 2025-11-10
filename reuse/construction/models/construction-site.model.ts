
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Index,
} from 'sequelize-typescript';
import { SiteStatus } from '../types/site.types';

@Table({
  tableName: 'construction_sites',
  timestamps: true,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['status'] },
    { fields: ['siteManager'] },
    { fields: ['startDate'] },
    { fields: ['estimatedEndDate'] },
    { fields: ['status', 'startDate'] },
  ],
})
export class ConstructionSite extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Index
  @Column(DataType.STRING(50))
  projectId: string;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  siteName: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  siteAddress: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  siteManager: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  siteManagerContact: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  startDate: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  estimatedEndDate: Date;

  @Column(DataType.DATE)
  actualEndDate?: Date;

  @AllowNull(false)
  @Default(SiteStatus.PLANNING)
  @Column({
    type: DataType.ENUM(...Object.values(SiteStatus)),
  })
  status: SiteStatus;

  @Column(DataType.TEXT)
  accessRestrictions?: string;

  @Column(DataType.TEXT)
  parkingInstructions?: string;

  @Column(DataType.TEXT)
  securityRequirements?: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  emergencyPhone: string;

  @Column(DataType.TEXT)
  nearestHospital?: string;

  @Column(DataType.STRING(100))
  permitNumber?: string;

  @Column(DataType.STRING(100))
  insurancePolicy?: string;

  @Column(DataType.DECIMAL(10, 8))
  latitude?: number;

  @Column(DataType.DECIMAL(11, 8))
  longitude?: number;

  @Column(DataType.DECIMAL(15, 2))
  totalArea?: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  fenceInstalled: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  signsInstalled: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  utilitiesMarked: boolean;

  @AllowNull(false)
  @Default({})
  @Column(DataType.JSON)
  metadata: Record<string, any>;
}
