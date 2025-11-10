
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
import { DeficiencySeverity, DeficiencyStatus } from '../types/quality.types';

@Table({
  tableName: 'quality_deficiencies',
  timestamps: true,
  indexes: [
    { fields: ['deficiencyNumber'], unique: true },
    { fields: ['inspectionId'] },
    { fields: ['projectId'] },
    { fields: ['severity'] },
    { fields: ['status'] },
    { fields: ['assignedTo'] },
    { fields: ['dueDate'] },
    { fields: ['identifiedDate'] },
    { fields: ['isPunchListItem'] },
  ],
})
export class QualityDeficiency extends Model {
  @PrimaryKey
  @Default(DataType.INTEGER)
  @Column(DataType.INTEGER)
  id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(50))
  deficiencyNumber: string;

  @Index
  @Column(DataType.INTEGER)
  inspectionId?: number;

  @AllowNull(false)
  @Index
  @Column(DataType.INTEGER)
  projectId: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  location: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(DeficiencySeverity)),
  })
  severity: DeficiencySeverity;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  category: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  trade: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  specification: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  identifiedBy: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  identifiedDate: Date;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  assignedTo: string;

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  assignedDate: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  dueDate: Date;

  @AllowNull(false)
  @Default(DeficiencyStatus.OPEN)
  @Column({
    type: DataType.ENUM(...Object.values(DeficiencyStatus)),
  })
  status: DeficiencyStatus;

  @Column(DataType.TEXT)
  rootCause?: string;

  @Column(DataType.TEXT)
  correctiveAction?: string;

  @Column(DataType.STRING(100))
  resolvedBy?: string;

  @Column(DataType.DATE)
  resolvedDate?: Date;

  @Column(DataType.STRING(100))
  verifiedBy?: string;

  @Column(DataType.DATE)
  verifiedDate?: Date;

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  photos: string[];

  @AllowNull(false)
  @Default([])
  @Column(DataType.ARRAY(DataType.STRING))
  attachments: string[];

  @Column(DataType.DECIMAL(12, 2))
  cost?: number;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isPunchListItem: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  requiresRetest: boolean;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  escalationLevel: number;

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
