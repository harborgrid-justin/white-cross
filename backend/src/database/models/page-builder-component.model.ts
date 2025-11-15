/**
 * Page Builder Component Model
 *
 * Represents a component instance on a page (e.g., header, hero, card, form)
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
import type { PageBuilderPage } from './page-builder-page.model';
import type { PageBuilderComponentLibrary } from './page-builder-component-library.model';
import type { PageBuilderComponentElement } from './page-builder-component-element.model';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export enum ComponentType {
  CONTAINER = 'container',
  SECTION = 'section',
  HEADER = 'header',
  FOOTER = 'footer',
  NAVIGATION = 'navigation',
  HERO = 'hero',
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  BUTTON = 'button',
  FORM = 'form',
  CARD = 'card',
  GRID = 'grid',
  LIST = 'list',
  TABLE = 'table',
  CUSTOM = 'custom',
}

export interface ComponentStyles {
  width?: string;
  height?: string;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  background?: {
    color?: string;
    image?: string;
    size?: string;
    position?: string;
    repeat?: string;
  };
  border?: {
    width?: number;
    style?: string;
    color?: string;
    radius?: number;
  };
  shadow?: {
    x?: number;
    y?: number;
    blur?: number;
    spread?: number;
    color?: string;
  };
  display?: string;
  flexbox?: {
    direction?: 'row' | 'column';
    justify?: string;
    align?: string;
    wrap?: string;
    gap?: number;
  };
  grid?: {
    columns?: number;
    rows?: number;
    gap?: number;
    templateColumns?: string;
    templateRows?: string;
  };
  typography?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    lineHeight?: number;
    color?: string;
    textAlign?: string;
  };
  animation?: {
    name?: string;
    duration?: number;
    delay?: number;
    iteration?: number;
    timing?: string;
  };
  customCSS?: string;
}

export interface ComponentProps {
  [key: string]: any;
}

export interface ComponentResponsive {
  mobile?: ComponentStyles;
  tablet?: ComponentStyles;
  desktop?: ComponentStyles;
}

export interface PageBuilderComponentAttributes {
  id?: string;
  pageId: string;
  libraryComponentId?: string;
  type: ComponentType;
  name: string;
  order?: number;
  parentId?: string;
  props?: ComponentProps;
  styles?: ComponentStyles;
  responsive?: ComponentResponsive;
  isVisible?: boolean;
  isLocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CreatePageBuilderComponentAttributes {
  pageId: string;
  libraryComponentId?: string;
  type: ComponentType;
  name: string;
  order?: number;
  parentId?: string;
  props?: ComponentProps;
  styles?: ComponentStyles;
  responsive?: ComponentResponsive;
  isVisible?: boolean;
  isLocked?: boolean;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
      isVisible: true,
    },
    order: [['order', 'ASC']],
  },
  byPage: (pageId: string) => ({
    where: { pageId, deletedAt: null },
    order: [['order', 'ASC']],
  }),
  topLevel: {
    where: { parentId: null, deletedAt: null },
    order: [['order', 'ASC']],
  },
  byType: (type: ComponentType) => ({
    where: { type, deletedAt: null },
    order: [['order', 'ASC']],
  }),
  withChildren: {
    include: [
      {
        association: 'children',
        where: { deletedAt: null },
        required: false,
      },
    ],
  },
  withElements: {
    include: [
      {
        association: 'elements',
        where: { deletedAt: null },
        required: false,
        order: [['order', 'ASC']],
      },
    ],
  },
}))
@Table({
  tableName: 'page_builder_components',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    { fields: ['pageId'] },
    { fields: ['parentId'] },
    { fields: ['type'] },
    { fields: ['libraryComponentId'] },
    {
      fields: ['pageId', 'order'],
      name: 'idx_pb_components_page_order',
    },
    { fields: ['createdAt'], name: 'idx_pb_components_created_at' },
    { fields: ['updatedAt'], name: 'idx_pb_components_updated_at' },
  ],
})
export class PageBuilderComponent extends Model<
  PageBuilderComponentAttributes,
  CreatePageBuilderComponentAttributes
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

  @ForeignKey(
    () =>
      require('./page-builder-component-library.model').PageBuilderComponentLibrary,
  )
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Library component ID if created from library',
  })
  @Index
  libraryComponentId?: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(ComponentType)),
    allowNull: false,
    comment: 'Component type',
  })
  @Index
  type: ComponentType;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    comment: 'Component name',
  })
  name: string;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Display order within page',
  })
  order: number;

  @ForeignKey(() => PageBuilderComponent)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Parent component ID for nested components',
  })
  @Index
  parentId?: string;

  @Default({})
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Component properties (dynamic based on component type)',
  })
  props: ComponentProps;

  @Default({})
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Component styles (CSS properties)',
  })
  styles: ComponentStyles;

  @Default({})
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Responsive styles for different breakpoints',
  })
  responsive: ComponentResponsive;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether component is visible',
  })
  isVisible: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Whether component is locked from editing',
  })
  isLocked: boolean;

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
  static async auditAccess(instance: PageBuilderComponent) {
    await createModelAuditHook('PageBuilderComponent', instance);
  }

  // Relationships
  @BelongsTo(() => require('./page-builder-page.model').PageBuilderPage, {
    foreignKey: 'pageId',
    as: 'page',
  })
  declare page?: PageBuilderPage;

  @BelongsTo(
    () =>
      require('./page-builder-component-library.model').PageBuilderComponentLibrary,
    {
      foreignKey: 'libraryComponentId',
      as: 'libraryComponent',
    },
  )
  declare libraryComponent?: PageBuilderComponentLibrary;

  @BelongsTo(() => PageBuilderComponent, {
    foreignKey: 'parentId',
    as: 'parent',
  })
  declare parent?: PageBuilderComponent;

  @HasMany(() => PageBuilderComponent, {
    foreignKey: 'parentId',
    as: 'children',
  })
  declare children?: PageBuilderComponent[];

  @HasMany(
    () =>
      require('./page-builder-component-element.model').PageBuilderComponentElement,
    {
      foreignKey: 'componentId',
      as: 'elements',
    },
  )
  declare elements?: PageBuilderComponentElement[];
}

export default PageBuilderComponent;
