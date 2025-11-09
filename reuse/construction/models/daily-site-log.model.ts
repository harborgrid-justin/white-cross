
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
} from 'sequelize-typescript';
import { ConstructionSite } from './construction-site.model';

@Table({
  tableName: 'daily_site_logs',
  timestamps: true,
  indexes: [
    { fields: ['siteId'] },
    { fields: ['logDate'] },
    { fields: ['submittedBy'] },
    { fields: ['siteId', 'logDate'], unique: true },
    { fields: ['weatherImpact'] },
    { fields: ['approvedBy'] },
  ],
})
export class DailySiteLog extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => ConstructionSite)
  @AllowNull(false)
  @Column(DataType.UUID)
  siteId: string;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  logDate: Date;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  submittedBy: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  workPerformed: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  crewCount: number;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  equipmentUsed: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  materialsDelivered: any[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  inspections: any[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  visitorLog: any[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  delaysEncountered: any[];

  @Column(DataType.TEXT)
  safetyObservations?: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  weatherConditions: any;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  weatherImpact: boolean;

  @AllowNull(false)
  @Column(DataType.DECIMAL(5, 2))
  hoursWorked: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(5, 2))
  overtimeHours: number;

  @Column(DataType.INTEGER)
  productivityRating?: number;

  @Column(DataType.TEXT)
  notes?: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSON)
  photoUrls: string[];

  @Column(DataType.STRING(100))
  approvedBy?: string;

  @Column(DataType.DATE)
  approvedAt?: Date;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  submittedAt: Date;
}
