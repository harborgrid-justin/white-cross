/**
 * Page Builder Component Element Model
 *
 * Represents individual elements within a component (e.g., text nodes, images, buttons within a card)
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
import type { PageBuilderComponent } from './page-builder-component.model';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export enum ElementType {
  TEXT = 'text',
  HEADING = 'heading',
  PARAGRAPH = 'paragraph',
  IMAGE = 'image',
  ICON = 'icon',
  BUTTON = 'button',
  LINK = 'link',
  INPUT = 'input',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  DIVIDER = 'divider',
  SPACER = 'spacer',
  EMBED = 'embed',
}

export interface ElementContent {
  text?: string;
  html?: string;
  url?: string;
  alt?: string;
  value?: any;
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
  embedCode?: string;
  [key: string]: any;
}

export interface ElementStyles {
  [key: string]: any;
}

export interface ElementEvents {
  onClick?: string;
  onChange?: string;
  onSubmit?: string;
  onHover?: string;
  [key: string]: any;
}

export interface PageBuilderComponentElementAttributes {
  id?: string;
  componentId: string;
  type: ElementType;
  order?: number;
  content?: ElementContent;
  styles?: ElementStyles;
  events?: ElementEvents;
  isVisible?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CreatePageBuilderComponentElementAttributes {
  componentId: string;
  type: ElementType;
  order?: number;
  content?: ElementContent;
  styles?: ElementStyles;
  events?: ElementEvents;
  isVisible?: boolean;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
      isVisible: true,
    },
    order: [['order', 'ASC']],
  },
  byComponent: (componentId: string) => ({
    where: { componentId, deletedAt: null },
    order: [['order', 'ASC']],
  }),
  byType: (type: ElementType) => ({
    where: { type, deletedAt: null },
    order: [['order', 'ASC']],
  }),
}))
@Table({
  tableName: 'page_builder_component_elements',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    { fields: ['componentId'] },
    { fields: ['type'] },
    {
      fields: ['componentId', 'order'],
      name: 'idx_pb_elements_component_order',
    },
    { fields: ['createdAt'], name: 'idx_pb_elements_created_at' },
  ],
})
export class PageBuilderComponentElement extends Model<
  PageBuilderComponentElementAttributes,
  CreatePageBuilderComponentElementAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./page-builder-component.model').PageBuilderComponent)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Parent component ID',
  })
  @Index
  componentId: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(ElementType)),
    allowNull: false,
    comment: 'Element type',
  })
  @Index
  type: ElementType;

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Display order within component',
  })
  order: number;

  @Default({})
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Element content (text, URLs, values)',
  })
  content: ElementContent;

  @Default({})
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Element styles',
  })
  styles: ElementStyles;

  @Default({})
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Event handlers for element',
  })
  events: ElementEvents;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether element is visible',
  })
  isVisible: boolean;

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
  static async auditAccess(instance: PageBuilderComponentElement) {
    await createModelAuditHook('PageBuilderComponentElement', instance);
  }

  // Relationships
  @BelongsTo(() => require('./page-builder-component.model').PageBuilderComponent, {
    foreignKey: 'componentId',
    as: 'component',
  })
  declare component?: PageBuilderComponent;
}

export default PageBuilderComponentElement;
