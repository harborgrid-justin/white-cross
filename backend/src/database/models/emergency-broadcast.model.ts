import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  BeforeCreate,
  ForeignKey,
  BelongsTo,
  Scopes,
  BeforeUpdate,
  UpdatedAt,
  CreatedAt
} from 'sequelize-typescript';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import {
  EmergencyType,
  EmergencyPriority,
  BroadcastAudience,
  BroadcastStatus,
  CommunicationChannel
} from '../../emergency-broadcast/emergency-broadcast.enums';

export interface EmergencyBroadcastAttributes {
  id: string;
  type: EmergencyType;
  priority: EmergencyPriority;
  title: string;
  message: string;
  audience: BroadcastAudience[];
  schoolId?: string;
  gradeLevel?: string;
  classId?: string;
  groupIds?: string[];
  channels: CommunicationChannel[];
  requiresAcknowledgment?: boolean;
  expiresAt?: Date;
  sentBy: string;
  sentAt: Date;
  status: BroadcastStatus;
  totalRecipients?: number;
  deliveredCount?: number;
  failedCount?: number;
  acknowledgedCount?: number;
  followUpRequired?: boolean;
  followUpMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null
    },
    order: [['createdAt', 'DESC']]
  }
}))
@Table({
  tableName: 'emergency_broadcasts',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['type']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['status']
    },
    {
      fields: ['schoolId']
    },
    {
      fields: ['sentAt']
    },
    {
      fields: ['expiresAt']
    },,
    {
      fields: ['createdAt'],
      name: 'idx_emergency_broadcast_created_at'
    },
    {
      fields: ['updatedAt'],
      name: 'idx_emergency_broadcast_updated_at'
    }
  ]
})
export class EmergencyBroadcast extends Model<EmergencyBroadcastAttributes> implements EmergencyBroadcastAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(EmergencyType)]
    },
    allowNull: false
  })
  type: EmergencyType;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(EmergencyPriority)]
    },
    allowNull: false
  })
  priority: EmergencyPriority;

  @Column({
    type: DataType.STRING(200),
    allowNull: false
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false
  })
  message: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: []
  })
  audience: BroadcastAudience[];

  @Column(DataType.UUID)
  schoolId?: string;

  @Column(DataType.STRING(50))
  gradeLevel?: string;

  @Column(DataType.UUID)
  classId?: string;

  @Column(DataType.JSON)
  groupIds?: string[];

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: []
  })
  channels: CommunicationChannel[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  requiresAcknowledgment?: boolean;

  @Column(DataType.DATE)
  expiresAt?: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  sentBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  sentAt: Date;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(BroadcastStatus)]
    },
    allowNull: false,
    defaultValue: BroadcastStatus.DRAFT
  })
  status: BroadcastStatus;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  totalRecipients?: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  deliveredCount?: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  failedCount?: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0
  })
  acknowledgedCount?: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  followUpRequired?: boolean;

  @Column(DataType.TEXT)
  followUpMessage?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;


  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: EmergencyBroadcast) {
    if (instance.changed()) {
      const changedFields = instance.changed() as string[];
      console.log(`[AUDIT] EmergencyBroadcast ${instance.id} modified at ${new Date().toISOString()}`);
      console.log(`[AUDIT] Changed fields: ${changedFields.join(', ')}`);
      // TODO: Integrate with AuditLog service for persistent audit trail
    }
  }
}