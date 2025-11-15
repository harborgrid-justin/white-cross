/**
 * Page Builder Project Model
 *
 * Represents a page builder project containing multiple pages, components, and assets
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
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import type { User } from './user.model';
import type { School } from './school.model';
import type { District } from './district.model';
import type { PageBuilderPage } from './page-builder-page.model';
import type { PageBuilderAsset } from './page-builder-asset.model';
import type { PageBuilderProjectVersion } from './page-builder-project-version.model';
import type { PageBuilderCollaborator } from './page-builder-collaborator.model';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export enum ProjectStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum ProjectVisibility {
  PRIVATE = 'private',
  SCHOOL = 'school',
  DISTRICT = 'district',
  PUBLIC = 'public',
}

export interface ProjectSettings {
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    customCSS?: string;
  };
  seo?: {
    titleTemplate?: string;
    defaultDescription?: string;
    defaultKeywords?: string[];
    ogImage?: string;
  };
  responsive?: {
    breakpoints?: {
      mobile?: number;
      tablet?: number;
      desktop?: number;
    };
  };
  integrations?: {
    googleAnalytics?: string;
    facebookPixel?: string;
    customScripts?: string[];
  };
  metadata?: Record<string, any>;
}

export interface PageBuilderProjectAttributes {
  id?: string;
  name: string;
  description?: string;
  slug?: string;
  ownerId: string;
  schoolId?: string;
  districtId?: string;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  settings?: ProjectSettings;
  thumbnailUrl?: string;
  isTemplate?: boolean;
  templateCategory?: string;
  version?: number;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CreatePageBuilderProjectAttributes {
  name: string;
  description?: string;
  slug?: string;
  ownerId: string;
  schoolId?: string;
  districtId?: string;
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  settings?: ProjectSettings;
  thumbnailUrl?: string;
  isTemplate?: boolean;
  templateCategory?: string;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['updatedAt', 'DESC']],
  },
  byOwner: (ownerId: string) => ({
    where: { ownerId, deletedAt: null },
    order: [['updatedAt', 'DESC']],
  }),
  bySchool: (schoolId: string) => ({
    where: { schoolId, deletedAt: null },
    order: [['updatedAt', 'DESC']],
  }),
  published: {
    where: { status: ProjectStatus.PUBLISHED, deletedAt: null },
    order: [['publishedAt', 'DESC']],
  },
  templates: {
    where: { isTemplate: true, deletedAt: null },
    order: [['name', 'ASC']],
  },
  withPages: {
    include: [
      {
        association: 'pages',
        where: { deletedAt: null },
        required: false,
      },
    ],
  },
  withCollaborators: {
    include: [
      {
        association: 'collaborators',
        include: ['user'],
      },
    ],
  },
}))
@Table({
  tableName: 'page_builder_projects',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    { fields: ['ownerId'] },
    { fields: ['schoolId'] },
    { fields: ['districtId'] },
    { fields: ['status'] },
    { fields: ['visibility'] },
    { fields: ['isTemplate'] },
    { fields: ['slug'], unique: true, where: { deletedAt: null } },
    { fields: ['createdAt'], name: 'idx_pb_projects_created_at' },
    { fields: ['updatedAt'], name: 'idx_pb_projects_updated_at' },
    { fields: ['publishedAt'], name: 'idx_pb_projects_published_at' },
    {
      fields: ['ownerId', 'status'],
      name: 'idx_pb_projects_owner_status',
    },
    {
      fields: ['schoolId', 'visibility'],
      name: 'idx_pb_projects_school_visibility',
    },
  ],
})
export class PageBuilderProject extends Model<
  PageBuilderProjectAttributes,
  CreatePageBuilderProjectAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    comment: 'Project name',
  })
  name: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Project description',
  })
  description?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    unique: true,
    comment: 'URL-friendly slug for project',
  })
  @Index
  slug?: string;

  @ForeignKey(() => require('./user.model').User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Owner user ID',
  })
  @Index
  ownerId: string;

  @ForeignKey(() => require('./school.model').School)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Associated school ID',
  })
  @Index
  schoolId?: string;

  @ForeignKey(() => require('./district.model').District)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Associated district ID',
  })
  @Index
  districtId?: string;

  @Default(ProjectStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(ProjectStatus)),
    allowNull: false,
    defaultValue: ProjectStatus.DRAFT,
    comment: 'Project status',
  })
  @Index
  status: ProjectStatus;

  @Default(ProjectVisibility.PRIVATE)
  @Column({
    type: DataType.ENUM(...Object.values(ProjectVisibility)),
    allowNull: false,
    defaultValue: ProjectVisibility.PRIVATE,
    comment: 'Project visibility level',
  })
  @Index
  visibility: ProjectVisibility;

  @Default({})
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Project settings (theme, SEO, responsive, integrations)',
  })
  settings: ProjectSettings;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: 'Thumbnail image URL',
  })
  thumbnailUrl?: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether project is a template',
  })
  @Index
  isTemplate: boolean;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: 'Template category if isTemplate is true',
  })
  templateCategory?: string;

  @Default(1)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Current version number',
  })
  version: number;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'When project was published',
  })
  @Index
  publishedAt?: Date;

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
  static async auditAccess(instance: PageBuilderProject) {
    await createModelAuditHook('PageBuilderProject', instance);
  }

  @BeforeCreate
  static generateSlug(instance: PageBuilderProject) {
    if (!instance.slug && instance.name) {
      instance.slug = instance.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
  }

  // Relationships
  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'ownerId',
    as: 'owner',
  })
  declare owner?: User;

  @BelongsTo(() => require('./school.model').School, {
    foreignKey: 'schoolId',
    as: 'school',
  })
  declare school?: School;

  @BelongsTo(() => require('./district.model').District, {
    foreignKey: 'districtId',
    as: 'district',
  })
  declare district?: District;

  @HasMany(() => require('./page-builder-page.model').PageBuilderPage, {
    foreignKey: 'projectId',
    as: 'pages',
  })
  declare pages?: PageBuilderPage[];

  @HasMany(() => require('./page-builder-asset.model').PageBuilderAsset, {
    foreignKey: 'projectId',
    as: 'assets',
  })
  declare assets?: PageBuilderAsset[];

  @HasMany(
    () => require('./page-builder-project-version.model').PageBuilderProjectVersion,
    {
      foreignKey: 'projectId',
      as: 'versions',
    },
  )
  declare versions?: PageBuilderProjectVersion[];

  @HasMany(
    () => require('./page-builder-collaborator.model').PageBuilderCollaborator,
    {
      foreignKey: 'projectId',
      as: 'collaborators',
    },
  )
  declare collaborators?: PageBuilderCollaborator[];
}

export default PageBuilderProject;
