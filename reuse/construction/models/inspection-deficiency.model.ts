
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { DeficiencySeverity, DeficiencyStatus } from '../types/inspection.types';
import { ConstructionInspection } from './construction-inspection.model';

@Table({ tableName: 'inspection_deficiencies', timestamps: true })
export class InspectionDeficiency extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => ConstructionInspection)
  @AllowNull(false)
  @Column(DataType.UUID)
  inspectionId: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  deficiencyNumber: string;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  title: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.STRING(500))
  location: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(DeficiencySeverity)),
  })
  severity: DeficiencySeverity;

  @AllowNull(false)
  @Default(DeficiencyStatus.OPEN)
  @Column({
    type: DataType.ENUM(...Object.values(DeficiencyStatus)),
  })
  status: DeficiencyStatus;

  @Column(DataType.STRING(500))
  codeReference: string;

  @Column(DataType.TEXT)
  requiredAction: string;

  @Column(DataType.DATE)
  dueDate: Date;

  @Column(DataType.UUID)
  assignedTo: string;

  @Column(DataType.STRING(200))
  assignedToName: string;

  @Column(DataType.DATE)
  assignedAt: Date;

  @Column(DataType.DATE)
  resolvedAt: Date;

  @Column(DataType.UUID)
  resolvedBy: string;

  @Column(DataType.TEXT)
  resolutionNotes: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSONB)
  photos: string[];

  @Column(DataType.DATE)
  verifiedAt: Date;

  @Column(DataType.UUID)
  verifiedBy: string;

  @Column(DataType.TEXT)
  verificationNotes: string;

  @BelongsTo(() => ConstructionInspection)
  inspection: ConstructionInspection;
}
