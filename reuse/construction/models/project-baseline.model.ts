
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

@Table({
  tableName: 'project_baselines',
  timestamps: true,
  updatedAt: false,
})
export class ProjectBaseline extends Model<ProjectBaseline> {
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
  baselineNumber: string;

  @AllowNull(false)
  @Column(DataType.ENUM('INITIAL', 'REVISED', 'RE_BASELINE'))
  baselineType: 'INITIAL' | 'REVISED' | 'RE_BASELINE';

  @AllowNull(false)
  @Column(DataType.DECIMAL(19, 2))
  budget: number;

  @AllowNull(false)
  @Column(DataType.DATE)
  schedule: Date;

  @AllowNull(false)
  @Column(DataType.TEXT)
  scope: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  approvedBy: string;

  @Column(DataType.TEXT)
  changeReason?: string;

  @BelongsTo(() => ConstructionProject)
  project: ConstructionProject;
}
