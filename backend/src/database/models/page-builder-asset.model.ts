/**
 * Page Builder Asset Model
 *
 * Represents uploaded assets (images, videos, documents) for a project
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

export enum AssetType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  FONT = 'font',
  ICON = 'icon',
  OTHER = 'other',
}

export interface AssetMetadata {
  width?: number;
  height?: number;
  duration?: number;
  format?: string;
  size?: number;
  alt?: string;
  caption?: string;
  credit?: string;
  exif?: Record<string, any>;
  [key: string]: any;
}

export interface PageBuilderAssetAttributes {
  id?: string;
  projectId: string;
  uploadedById: string;
  name: string;
  filename: string;
  type: AssetType;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  metadata?: AssetMetadata;
  tags?: string[];
  isPublic?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CreatePageBuilderAssetAttributes {
  projectId: string;
  uploadedById: string;
  name: string;
  filename: string;
  type: AssetType;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  metadata?: AssetMetadata;
  tags?: string[];
  isPublic?: boolean;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
  byProject: (projectId: string) => ({
    where: { projectId, deletedAt: null },
    order: [['createdAt', 'DESC']],
  }),
  byType: (type: AssetType) => ({
    where: { type, deletedAt: null },
    order: [['createdAt', 'DESC']],
  }),
  images: {
    where: { type: AssetType.IMAGE, deletedAt: null },
    order: [['createdAt', 'DESC']],
  },
  videos: {
    where: { type: AssetType.VIDEO, deletedAt: null },
    order: [['createdAt', 'DESC']],
  },
  public: {
    where: { isPublic: true, deletedAt: null },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'page_builder_assets',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['uploadedById'] },
    { fields: ['type'] },
    { fields: ['mimeType'] },
    { fields: ['tags'], using: 'gin' },
    { fields: ['createdAt'], name: 'idx_pb_assets_created_at' },
    { fields: ['updatedAt'], name: 'idx_pb_assets_updated_at' },
    {
      fields: ['projectId', 'type'],
      name: 'idx_pb_assets_project_type',
    },
  ],
})
export class PageBuilderAsset extends Model<
  PageBuilderAssetAttributes,
  CreatePageBuilderAssetAttributes
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
    comment: 'User who uploaded the asset',
  })
  @Index
  uploadedById: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    comment: 'Asset display name',
  })
  name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: 'Original filename',
  })
  filename: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(AssetType)),
    allowNull: false,
    comment: 'Asset type',
  })
  @Index
  type: AssetType;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: 'MIME type',
  })
  @Index
  mimeType: string;

  @AllowNull(false)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    comment: 'File size in bytes',
  })
  size: number;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
    allowNull: false,
    comment: 'Asset URL (S3, CDN, or local path)',
  })
  url: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Thumbnail URL for preview',
  })
  thumbnailUrl?: string;

  @Default({})
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Asset metadata (dimensions, duration, EXIF, etc.)',
  })
  metadata: AssetMetadata;

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
    comment: 'Asset tags for organization',
  })
  tags: string[];

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether asset is publicly accessible',
  })
  isPublic: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare updatedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare deletedAt?: Date;

  // Hooks
  @BeforeCreate
  @BeforeUpdate
  static async auditAccess(instance: PageBuilderAsset) {
    await createModelAuditHook('PageBuilderAsset', instance);
  }

  // Relationships
  @BelongsTo(() => require('./page-builder-project.model').PageBuilderProject, {
    foreignKey: 'projectId',
    as: 'project',
  })
  declare project?: PageBuilderProject;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'uploadedById',
    as: 'uploadedBy',
  })
  declare uploadedBy?: User;
}

export default PageBuilderAsset;
