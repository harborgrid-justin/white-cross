/**
 * Page Builder Component Library Model
 *
 * Represents reusable components created by users and stored in their library
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
import type { User } from './user.model';
import type { School } from './school.model';
import type { District } from './district.model';
import { createModelAuditHook } from '../services/model-audit-hooks.service';
import type {
  ComponentType,
  ComponentProps,
  ComponentStyles,
  ComponentResponsive,
} from './page-builder-component.model';

export enum LibraryComponentVisibility {
  PRIVATE = 'private',
  SCHOOL = 'school',
  DISTRICT = 'district',
  PUBLIC = 'public',
}

export interface ComponentDefinition {
  type: ComponentType;
  props: ComponentProps;
  styles: ComponentStyles;
  responsive?: ComponentResponsive;
  children?: ComponentDefinition[];
}

export interface PageBuilderComponentLibraryAttributes {
  id?: string;
  createdById: string;
  schoolId?: string;
  districtId?: string;
  name: string;
  description?: string;
  category?: string;
  definition: ComponentDefinition;
  thumbnailUrl?: string;
  visibility?: LibraryComponentVisibility;
  tags?: string[];
  usageCount?: number;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CreatePageBuilderComponentLibraryAttributes {
  createdById: string;
  schoolId?: string;
  districtId?: string;
  name: string;
  description?: string;
  category?: string;
  definition: ComponentDefinition;
  thumbnailUrl?: string;
  visibility?: LibraryComponentVisibility;
  tags?: string[];
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['name', 'ASC']],
  },
  byCreator: (createdById: string) => ({
    where: { createdById, deletedAt: null },
    order: [['updatedAt', 'DESC']],
  }),
  bySchool: (schoolId: string) => ({
    where: {
      schoolId,
      visibility: LibraryComponentVisibility.SCHOOL,
      deletedAt: null,
    },
    order: [['usageCount', 'DESC']],
  }),
  public: {
    where: {
      visibility: LibraryComponentVisibility.PUBLIC,
      deletedAt: null,
    },
    order: [['rating', 'DESC']],
  },
  byCategory: (category: string) => ({
    where: { category, deletedAt: null },
    order: [['name', 'ASC']],
  }),
  popular: {
    where: { deletedAt: null },
    order: [['usageCount', 'DESC']],
    limit: 50,
  },
}))
@Table({
  tableName: 'page_builder_component_library',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    { fields: ['createdById'] },
    { fields: ['schoolId'] },
    { fields: ['districtId'] },
    { fields: ['visibility'] },
    { fields: ['category'] },
    { fields: ['tags'], using: 'gin' },
    { fields: ['rating'] },
    { fields: ['usageCount'] },
    { fields: ['createdAt'], name: 'idx_pb_library_created_at' },
    { fields: ['updatedAt'], name: 'idx_pb_library_updated_at' },
    {
      fields: ['visibility', 'category'],
      name: 'idx_pb_library_visibility_category',
    },
  ],
})
export class PageBuilderComponentLibrary extends Model<
  PageBuilderComponentLibraryAttributes,
  CreatePageBuilderComponentLibraryAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => require('./user.model').User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'User who created this library component',
  })
  @Index
  createdById: string;

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

  @AllowNull(false)
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    comment: 'Component name',
  })
  name: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Component description',
  })
  description?: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    comment: 'Component category',
  })
  @Index
  category?: string;

  @AllowNull(false)
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    comment: 'Complete component definition (structure, styles, props)',
  })
  definition: ComponentDefinition;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    comment: 'Thumbnail image URL',
  })
  thumbnailUrl?: string;

  @Default(LibraryComponentVisibility.PRIVATE)
  @Column({
    type: DataType.ENUM(...Object.values(LibraryComponentVisibility)),
    allowNull: false,
    defaultValue: LibraryComponentVisibility.PRIVATE,
    comment: 'Component visibility level',
  })
  @Index
  visibility: LibraryComponentVisibility;

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
    comment: 'Component tags for search and organization',
  })
  tags: string[];

  @Default(0)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Number of times this component has been used',
  })
  usageCount: number;

  @Default(0)
  @Column({
    type: DataType.DECIMAL(3, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Average rating (0-5)',
  })
  rating: number;

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
  static async auditAccess(instance: PageBuilderComponentLibrary) {
    await createModelAuditHook('PageBuilderComponentLibrary', instance);
  }

  // Relationships
  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'createdById',
    as: 'creator',
  })
  declare creator?: User;

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
}

export default PageBuilderComponentLibrary;
