/**
 * Page Builder Workflow Model
 *
 * Manages automated workflows and publishing schedules
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
import type { PageBuilderPage } from './page-builder-page.model';
import type { User } from './user.model';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export enum WorkflowType {
  SCHEDULED_PUBLISH = 'scheduled_publish',
  AUTO_BACKUP = 'auto_backup',
  AUTO_SAVE = 'auto_save',
  APPROVAL_WORKFLOW = 'approval_workflow',
  NOTIFICATION = 'notification',
  CUSTOM = 'custom',
}

export enum WorkflowStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum WorkflowTrigger {
  SCHEDULE = 'schedule', // Cron-based
  EVENT = 'event', // On specific event (save, publish, etc.)
  MANUAL = 'manual', // Manually triggered
  WEBHOOK = 'webhook', // External webhook trigger
}

export interface WorkflowConfig {
  trigger?: {
    type: WorkflowTrigger;
    cron?: string; // For SCHEDULE trigger
    event?: string; // For EVENT trigger
    webhookUrl?: string; // For WEBHOOK trigger
  };
  actions?: Array<{
    type: string;
    config: any;
    order: number;
  }>;
  conditions?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  notifications?: {
    onSuccess?: string[];
    onFailure?: string[];
    channels?: ('email' | 'slack' | 'webhook')[];
  };
}

export interface WorkflowExecution {
  lastRunAt?: Date;
  nextRunAt?: Date;
  runCount?: number;
  successCount?: number;
  failureCount?: number;
  lastResult?: {
    status: 'success' | 'failure';
    message?: string;
    data?: any;
  };
}

export interface PageBuilderWorkflowAttributes {
  id?: string;
  projectId: string;
  pageId?: string;
  createdById: string;
  name: string;
  description?: string;
  type: WorkflowType;
  status?: WorkflowStatus;
  config: WorkflowConfig;
  execution?: WorkflowExecution;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CreatePageBuilderWorkflowAttributes {
  projectId: string;
  pageId?: string;
  createdById: string;
  name: string;
  description?: string;
  type: WorkflowType;
  status?: WorkflowStatus;
  config: WorkflowConfig;
  isActive?: boolean;
}

@Scopes(() => ({
  active: {
    where: {
      isActive: true,
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
  byProject: (projectId: string) => ({
    where: { projectId, deletedAt: null },
    order: [['createdAt', 'DESC']],
  }),
  byType: (type: WorkflowType) => ({
    where: { type, deletedAt: null },
    order: [['createdAt', 'DESC']],
  }),
  scheduled: {
    where: {
      isActive: true,
      status: WorkflowStatus.ACTIVE,
      deletedAt: null,
    },
    order: [['updatedAt', 'ASC']],
  },
}))
@Table({
  tableName: 'page_builder_workflows',
  timestamps: true,
  underscored: false,
  paranoid: true,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['pageId'] },
    { fields: ['createdById'] },
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['isActive'] },
    { fields: ['createdAt'], name: 'idx_pb_workflows_created_at' },
    { fields: ['updatedAt'], name: 'idx_pb_workflows_updated_at' },
  ],
})
export class PageBuilderWorkflow extends Model<
  PageBuilderWorkflowAttributes,
  CreatePageBuilderWorkflowAttributes
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
    comment: 'Project ID',
  })
  @Index
  projectId: string;

  @ForeignKey(() => require('./page-builder-page.model').PageBuilderPage)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'Page ID (if workflow is page-specific)',
  })
  @Index
  pageId?: string;

  @ForeignKey(() => require('./user.model').User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'User who created this workflow',
  })
  @Index
  createdById: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    comment: 'Workflow name',
  })
  name: string;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Workflow description',
  })
  description?: string;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(WorkflowType)),
    allowNull: false,
    comment: 'Workflow type',
  })
  @Index
  type: WorkflowType;

  @Default(WorkflowStatus.ACTIVE)
  @Column({
    type: DataType.ENUM(...Object.values(WorkflowStatus)),
    allowNull: false,
    defaultValue: WorkflowStatus.ACTIVE,
    comment: 'Workflow status',
  })
  @Index
  status: WorkflowStatus;

  @AllowNull(false)
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    comment: 'Workflow configuration (trigger, actions, conditions)',
  })
  config: WorkflowConfig;

  @Default({})
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Workflow execution tracking',
  })
  execution: WorkflowExecution;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether workflow is active',
  })
  @Index
  isActive: boolean;

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
  static async auditAccess(instance: PageBuilderWorkflow) {
    await createModelAuditHook('PageBuilderWorkflow', instance);
  }

  // Relationships
  @BelongsTo(() => require('./page-builder-project.model').PageBuilderProject, {
    foreignKey: 'projectId',
    as: 'project',
  })
  declare project?: PageBuilderProject;

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

export default PageBuilderWorkflow;
