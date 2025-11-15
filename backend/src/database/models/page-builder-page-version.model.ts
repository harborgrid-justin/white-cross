/**
 * Page Builder Page Version Model
 *
 * Stores snapshots of individual page states for granular version control
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
import type { PageBuilderPage } from './page-builder-page.model';
import type { User } from './user.model';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export enum PageVersionType {
  AUTO_SAVE = 'auto_save',
  MANUAL_SAVE = 'manual_save',
  CHECKPOINT = 'checkpoint',
  PUBLISH = 'publish',
  RESTORE = 'restore',
}

export interface PageSnapshot {
  pageData: any;
  componentsData: any[];
  settings: any;
}

export interface PageBuilderPageVersionAttributes {
  id?: string;
  pageId: string;
  createdById: string;
  versionNumber: number;
  type?: PageVersionType;
  name?: string;
  description?: string;
  snapshot: PageSnapshot;
  changesSummary?: string[];
  fileSize?: number;
  createdAt?: Date;
}

export interface CreatePageBuilderPageVersionAttributes {
  pageId: string;
  createdById: string;
  versionNumber: number;
  type?: PageVersionType;
  name?: string;
  description?: string;
  snapshot: PageSnapshot;
  changesSummary?: string[];
  fileSize?: number;
}

@Scopes(() => ({
  byPage: (pageId: string) => ({
    where: { pageId },
    order: [['versionNumber', 'DESC']],
  }),
  latest: (pageId: string) => ({
    where: { pageId },
    order: [['versionNumber', 'DESC']],
    limit: 1,
  }),
  checkpoints: {
    where: { type: PageVersionType.CHECKPOINT },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'page_builder_page_versions',
  timestamps: false,
  underscored: false,
  indexes: [
    { fields: ['pageId'] },
    { fields: ['createdById'] },
    { fields: ['type'] },
    {
      fields: ['pageId', 'versionNumber'],
      unique: true,
      name: 'idx_pb_page_versions_unique',
    },
    { fields: ['createdAt'], name: 'idx_pb_page_versions_created_at' },
  ],
})
export class PageBuilderPageVersion extends Model<
  PageBuilderPageVersionAttributes,
  CreatePageBuilderPageVersionAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./page-builder-page.model').PageBuilderPage)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Parent page ID',
  })
  @Index
  pageId: string;

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

  @Default(PageVersionType.AUTO_SAVE)
  @Column({
    type: DataType.ENUM(...Object.values(PageVersionType)),
    allowNull: false,
    defaultValue: PageVersionType.AUTO_SAVE,
    comment: 'Version type',
  })
  @Index
  type: PageVersionType;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    comment: 'Version name',
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
    comment: 'Complete snapshot of page state',
  })
  snapshot: PageSnapshot;

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
  static async auditAccess(instance: PageBuilderPageVersion) {
    await createModelAuditHook('PageBuilderPageVersion', instance);
  }

  // Relationships
  @BelongsTo(() => require('./page-builder-page.model').PageBuilderPage, {
    foreignKey: 'pageId',
    as: 'page',
  })
  declare page?: PageBuilderPage;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'createdById',
    as: 'createdBy',
  })
  declare createdBy?: User;
}

export default PageBuilderPageVersion;
