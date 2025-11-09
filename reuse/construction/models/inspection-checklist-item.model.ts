
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
import { ConstructionInspection } from './construction-inspection.model';

@Table({ tableName: 'inspection_checklist_items', timestamps: true })
export class InspectionChecklistItem extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => ConstructionInspection)
  @AllowNull(false)
  @Column(DataType.UUID)
  inspectionId: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  sequence: number;

  @Column(DataType.STRING(100))
  category: string;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  itemText: string;

  @Column(DataType.TEXT)
  description: string;

  @AllowNull(false)
  @Default(true)
  @Column(DataType.BOOLEAN)
  isRequired: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isCompliant: boolean;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  isNotApplicable: boolean;

  @Column(DataType.TEXT)
  notes: string;

  @Column(DataType.STRING(500))
  codeReference: string;

  @AllowNull(false)
  @Default([])
  @Column(DataType.JSONB)
  photos: string[];

  @Column(DataType.DATE)
  checkedAt: Date;

  @Column(DataType.UUID)
  checkedBy: string;

  @BelongsTo(() => ConstructionInspection)
  inspection: ConstructionInspection;
}
