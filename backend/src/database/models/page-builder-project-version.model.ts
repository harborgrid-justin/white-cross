/**
 * Page Builder Project Version Model
 *
 * Stores snapshots of project state for version control and rollback
 */

import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import type { PageBuilderProject } from './page-builder-project.model';
import type { User } from './user.model';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export enum VersionType {
  AUTO_SAVE = 'auto_save',
  MANUAL_SAVE = 'manual_save',
  CHECKPOINT = 'checkpoint',
  PUBLISH = 'publish',
  RESTORE = 'restore',
}

export interface ProjectSnapshot {
  projectData: any;
  pagesData: any[];
  componentsData: any[];
  assetsData: any[];
  settings: any;
}

export interface PageBuilderProjectVersionAttributes {
  id?: string;
  projectId: string;
  createdById: string;
  versionNumber: number;
  type?: VersionType;
  name?: string;
  description?: string;
  snapshot: ProjectSnapshot;
  changesSummary?: string[];
  fileSize?: number;
  createdAt?: Date;
}

export interface CreatePageBuilderProjectVersionAttributes {
  projectId: string;
  createdById: string;
  versionNumber: number;
  type?: VersionType;
  name?: string;
  description?: string;
  snapshot: ProjectSnapshot;
  changesSummary?: string[];
  fileSize?: number;
}

@Scopes(() => ({
  byProject: (projectId: string) => ({
    where: { projectId },
    order: [['versionNumber', 'DESC']],
  }),
  latest: (projectId: string) => ({
    where: { projectId },
    order: [['versionNumber', 'DESC']],
    limit: 1,
  }),
  checkpoints: {
    where: { type: VersionType.CHECKPOINT },
    order: [['createdAt', 'DESC']],
  },
  published: {
    where: { type: VersionType.PUBLISH },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'page_builder_project_versions',
  timestamps: false,
  underscored: false,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['createdById'] },
    { fields: ['type'] },
    {
      fields: ['projectId', 'versionNumber'],
      unique: true,
      name: 'idx_pb_project_versions_unique',
    },
    { fields: ['createdAt'], name: 'idx_pb_project_versions_created_at' },
  ],
})
export class PageBuilderProjectVersion extends Model<
  PageBuilderProjectVersionAttributes,
  CreatePageBuilderProjectVersionAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./page-builder-project.model').PageBuilderProject)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Parent project ID',
  })
  @Index
  projectId: string;

  @ForeignKey(() => require('./user.model').User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'User who created this version',
  })
  @Index
  createdById: string;

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: 'Sequential version number',
  })
  versionNumber: number;

  @Default(VersionType.AUTO_SAVE)
  @Column({
    type: DataType.ENUM(...Object.values(VersionType)),
    allowNull: false,
    defaultValue: VersionType.AUTO_SAVE,
    comment: 'Version type',
  })
  @Index
  type: VersionType;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    comment: 'Version name (for manual saves and checkpoints)',
  })
  name?: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Version description',
  })
  description?: string;

  @AllowNull(false)
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    comment: 'Complete snapshot of project state',
  })
  snapshot: ProjectSnapshot;

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.TEXT),
    allowNull: false,
    defaultValue: [],
    comment: 'Summary of changes from previous version',
  })
  changesSummary: string[];

  @AllowNull(true)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    comment: 'Snapshot size in bytes',
  })
  fileSize?: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;

  // Hooks
  @BeforeCreate
  @BeforeUpdate
  static async auditAccess(instance: PageBuilderProjectVersion) {
    await createModelAuditHook('PageBuilderProjectVersion', instance);
  }

  // Relationships
  @BelongsTo(() => require('./page-builder-project.model').PageBuilderProject, {
    foreignKey: 'projectId',
    as: 'project',
  })
  declare project?: PageBuilderProject;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'createdById',
    as: 'createdBy',
  })
  declare createdBy?: User;
}

export default PageBuilderProjectVersion;
