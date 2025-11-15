/**
 * Page Builder Page Model
 *
 * Represents a page within a page builder project
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
import type { PageBuilderProject } from './page-builder-project.model';
import type { PageBuilderComponent } from './page-builder-component.model';
import type { PageBuilderPageVersion } from './page-builder-page-version.model';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface PageLayout {
  type: 'fixed' | 'fluid' | 'custom';
  maxWidth?: number;
  columns?: number;
  gap?: number;
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

export interface PageSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface PageSettings {
  layout?: PageLayout;
  seo?: PageSEO;
  customCSS?: string;
  customJS?: string;
  headerCode?: string;
  footerCode?: string;
  requireAuth?: boolean;
  allowedRoles?: string[];
  metadata?: Record<string, any>;
}

export interface PageBuilderPageAttributes {
  id?: string;
  projectId: string;
  name: string;
  path: string;
  status?: PageStatus;
  order?: number;
  parentId?: string;
  settings?: PageSettings;
  thumbnailUrl?: string;
  isHomePage?: boolean;
  version?: number;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CreatePageBuilderPageAttributes {
  projectId: string;
  name: string;
  path: string;
  status?: PageStatus;
  order?: number;
  parentId?: string;
  settings?: PageSettings;
  thumbnailUrl?: string;
  isHomePage?: boolean;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['order', 'ASC']],
  },
  byProject: (projectId: string) => ({
    where: { projectId, deletedAt: null },
    order: [['order', 'ASC']],
  }),
  published: {
    where: { status: PageStatus.PUBLISHED, deletedAt: null },
    order: [['order', 'ASC']],
  },
  withComponents: {
    include: [
      {
        association: 'components',
        where: { deletedAt: null },
        required: false,
        order: [['order', 'ASC']],
      },
    ],
  },
  topLevel: {
    where: { parentId: null, deletedAt: null },
    order: [['order', 'ASC']],
  },
}))
@Table({
  tableName: 'page_builder_pages',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['parentId'] },
    { fields: ['status'] },
    { fields: ['isHomePage'] },
    {
      fields: ['projectId', 'path'],
      unique: true,
      where: { deletedAt: null },
      name: 'idx_pb_pages_project_path_unique',
    },
    {
      fields: ['projectId', 'order'],
      name: 'idx_pb_pages_project_order',
    },
    { fields: ['createdAt'], name: 'idx_pb_pages_created_at' },
    { fields: ['updatedAt'], name: 'idx_pb_pages_updated_at' },
  ],
})
export class PageBuilderPage extends Model<
  PageBuilderPageAttributes,
  CreatePageBuilderPageAttributes
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

  @AllowNull(false)
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    comment: 'Page name',
  })
  name: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(500),
    allowNull: false,
    comment: 'URL path for the page (e.g., /about, /contact)',
  })
  path: string;

  @Default(PageStatus.DRAFT)
  @Column({
    type: DataType.ENUM(...Object.values(PageStatus)),
    allowNull: false,
    defaultValue: PageStatus.DRAFT,
    comment: 'Page status',
  })
  @Index
  status: PageStatus;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Display order within project',
  })
  order: number;

  @ForeignKey(() => PageBuilderPage)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Parent page ID for nested pages',
  })
  @Index
  parentId?: string;

  @Default({})
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Page settings (layout, SEO, custom code)',
  })
  settings: PageSettings;

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
    comment: 'Whether this is the home page',
  })
  @Index
  isHomePage: boolean;

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
    comment: 'When page was published',
  })
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
  static async auditAccess(instance: PageBuilderPage) {
    await createModelAuditHook('PageBuilderPage', instance);
  }

  @BeforeCreate
  static normalizePath(instance: PageBuilderPage) {
    if (instance.path && !instance.path.startsWith('/')) {
      instance.path = '/' + instance.path;
    }
  }

  // Relationships
  @BelongsTo(() => require('./page-builder-project.model').PageBuilderProject, {
    foreignKey: 'projectId',
    as: 'project',
  })
  declare project?: PageBuilderProject;

  @BelongsTo(() => PageBuilderPage, {
    foreignKey: 'parentId',
    as: 'parent',
  })
  declare parent?: PageBuilderPage;

  @HasMany(() => PageBuilderPage, {
    foreignKey: 'parentId',
    as: 'children',
  })
  declare children?: PageBuilderPage[];

  @HasMany(() => require('./page-builder-component.model').PageBuilderComponent, {
    foreignKey: 'pageId',
    as: 'components',
  })
  declare components?: PageBuilderComponent[];

  @HasMany(
    () => require('./page-builder-page-version.model').PageBuilderPageVersion,
    {
      foreignKey: 'pageId',
      as: 'versions',
    },
  )
  declare versions?: PageBuilderPageVersion[];
}

export default PageBuilderPage;
