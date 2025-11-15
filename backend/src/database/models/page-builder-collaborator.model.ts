/**
 * Page Builder Collaborator Model
 *
 * Manages project collaborators and their permissions
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

export enum CollaboratorRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  COMMENTER = 'commenter',
}

export interface CollaboratorPermissions {
  canEdit?: boolean;
  canDelete?: boolean;
  canPublish?: boolean;
  canManageAssets?: boolean;
  canManagePages?: boolean;
  canManageSettings?: boolean;
  canInviteCollaborators?: boolean;
  canManagePermissions?: boolean;
}

export interface CollaboratorActivity {
  lastViewedAt?: Date;
  lastEditedAt?: Date;
  editCount?: number;
  activeTime?: number; // in seconds
}

export interface PageBuilderCollaboratorAttributes {
  id?: string;
  projectId: string;
  userId: string;
  invitedById?: string;
  role?: CollaboratorRole;
  permissions?: CollaboratorPermissions;
  activity?: CollaboratorActivity;
  isActive?: boolean;
  invitedAt?: Date;
  acceptedAt?: Date;
  revokedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePageBuilderCollaboratorAttributes {
  projectId: string;
  userId: string;
  invitedById?: string;
  role?: CollaboratorRole;
  permissions?: CollaboratorPermissions;
  invitedAt?: Date;
}

@Scopes(() => ({
  active: {
    where: {
      isActive: true,
      revokedAt: null,
    },
    order: [['createdAt', 'ASC']],
  },
  byProject: (projectId: string) => ({
    where: { projectId, isActive: true, revokedAt: null },
    order: [['role', 'ASC']],
  }),
  byUser: (userId: string) => ({
    where: { userId, isActive: true, revokedAt: null },
    order: [['updatedAt', 'DESC']],
  }),
  withUser: {
    include: [
      {
        association: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email', 'profilePictureUrl'],
      },
    ],
  },
  pending: {
    where: {
      isActive: true,
      acceptedAt: null,
      revokedAt: null,
    },
    order: [['invitedAt', 'DESC']],
  },
}))
@Table({
  tableName: 'page_builder_collaborators',
  timestamps: true,
  underscored: false,
  indexes: [
    { fields: ['projectId'] },
    { fields: ['userId'] },
    { fields: ['invitedById'] },
    { fields: ['role'] },
    { fields: ['isActive'] },
    {
      fields: ['projectId', 'userId'],
      unique: true,
      name: 'idx_pb_collaborators_project_user_unique',
    },
    { fields: ['createdAt'], name: 'idx_pb_collaborators_created_at' },
  ],
})
export class PageBuilderCollaborator extends Model<
  PageBuilderCollaboratorAttributes,
  CreatePageBuilderCollaboratorAttributes
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

  @ForeignKey(() => require('./user.model').User)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    comment: 'Collaborator user ID',
  })
  @Index
  userId: string;

  @ForeignKey(() => require('./user.model').User)
  @AllowNull(true)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    comment: 'User who invited this collaborator',
  })
  @Index
  invitedById?: string;

  @Default(CollaboratorRole.VIEWER)
  @Column({
    type: DataType.ENUM(...Object.values(CollaboratorRole)),
    allowNull: false,
    defaultValue: CollaboratorRole.VIEWER,
    comment: 'Collaborator role',
  })
  @Index
  role: CollaboratorRole;

  @Default({})
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Granular permissions for this collaborator',
  })
  permissions: CollaboratorPermissions;

  @Default({})
  @Column({
    type: DataType.JSONB,
    allowNull: false,
    defaultValue: {},
    comment: 'Collaborator activity tracking',
  })
  activity: CollaboratorActivity;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether collaboration is active',
  })
  @Index
  isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    comment: 'When collaborator was invited',
  })
  invitedAt: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'When collaborator accepted invitation',
  })
  acceptedAt?: Date;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    allowNull: true,
    comment: 'When collaboration was revoked',
  })
  revokedAt?: Date;

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

  // Hooks
  @BeforeCreate
  @BeforeUpdate
  static async auditAccess(instance: PageBuilderCollaborator) {
    await createModelAuditHook('PageBuilderCollaborator', instance);
  }

  @BeforeCreate
  static setDefaultPermissions(instance: PageBuilderCollaborator) {
    if (!instance.permissions || Object.keys(instance.permissions).length === 0) {
      switch (instance.role) {
        case CollaboratorRole.OWNER:
        case CollaboratorRole.ADMIN:
          instance.permissions = {
            canEdit: true,
            canDelete: true,
            canPublish: true,
            canManageAssets: true,
            canManagePages: true,
            canManageSettings: true,
            canInviteCollaborators: true,
            canManagePermissions: true,
          };
          break;
        case CollaboratorRole.EDITOR:
          instance.permissions = {
            canEdit: true,
            canDelete: false,
            canPublish: false,
            canManageAssets: true,
            canManagePages: true,
            canManageSettings: false,
            canInviteCollaborators: false,
            canManagePermissions: false,
          };
          break;
        case CollaboratorRole.COMMENTER:
          instance.permissions = {
            canEdit: false,
            canDelete: false,
            canPublish: false,
            canManageAssets: false,
            canManagePages: false,
            canManageSettings: false,
            canInviteCollaborators: false,
            canManagePermissions: false,
          };
          break;
        case CollaboratorRole.VIEWER:
        default:
          instance.permissions = {
            canEdit: false,
            canDelete: false,
            canPublish: false,
            canManageAssets: false,
            canManagePages: false,
            canManageSettings: false,
            canInviteCollaborators: false,
            canManagePermissions: false,
          };
          break;
      }
    }
  }

  // Relationships
  @BelongsTo(() => require('./page-builder-project.model').PageBuilderProject, {
    foreignKey: 'projectId',
    as: 'project',
  })
  declare project?: PageBuilderProject;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'userId',
    as: 'user',
  })
  declare user?: User;

  @BelongsTo(() => require('./user.model').User, {
    foreignKey: 'invitedById',
    as: 'invitedBy',
  })
  declare invitedBy?: User;
}

export default PageBuilderCollaborator;
