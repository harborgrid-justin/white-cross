
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  HasMany,
} from 'sequelize-typescript';
import { InspectionType, InspectionStatus, InspectionResult, InspectorType } from '../types/inspection.types';
import { InspectionDeficiency } from './inspection-deficiency.model';
import { InspectionChecklistItem } from './inspection-checklist-item.model';

@Table({ tableName: 'construction_inspections', timestamps: true, paranoid: true })
export class ConstructionInspection extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  inspectionNumber: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(InspectionType)),
  })
  inspectionType: InspectionType;

  @AllowNull(false)
  @Column(DataType.UUID)
  projectId: string;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  location: string;

  @Column(DataType.STRING(200))
  building: string;

  @Column(DataType.STRING(100))
  level: string;

  @Column(DataType.STRING(100))
  zone: string;

  @AllowNull(false)
  @Default(InspectionStatus.SCHEDULED)
  @Column({
    type: DataType.ENUM(...Object.values(InspectionStatus)),
  })
  status: InspectionStatus;

  @AllowNull(false)
  @Column(DataType.DATE)
  scheduledDate: Date;

  @Column(DataType.DATE)
  actualStartTime: Date;

  @Column(DataType.DATE)
  actualEndTime: Date;

  @Column(DataType.UUID)
  inspectorId: string;

  @Column(DataType.STRING(200))
  inspectorName: string;

  @Column({
    type: DataType.ENUM(...Object.values(InspectorType)),
  })
  inspectorType: InspectorType;

  @Column(DataType.UUID)
  requestedBy: string;

  @Column(DataType.DATE)
  requestedAt: Date;

  @Column(DataType.TEXT)
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(InspectionResult)),
  })
  result: InspectionResult;

  @Column(DataType.TEXT)
  notes: string;

  @Column(DataType.TEXT)
  comments: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSONB)
  attachments: string[];

  @Column(DataType.UUID)
  permitId: string;

  @Column(DataType.UUID)
  checklistTemplateId: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  requiresReinspection: boolean;

  @Column(DataType.UUID)
  reinspectionOfId: string;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  deficiencyCount: number;

  @Column(DataType.JSONB)
  metadata: Record<string, any>;

  @HasMany(() => InspectionDeficiency, 'inspectionId')
  deficiencies: InspectionDeficiency[];

  @HasMany(() => InspectionChecklistItem, 'inspectionId')
  checklistItems: InspectionChecklistItem[];
}
