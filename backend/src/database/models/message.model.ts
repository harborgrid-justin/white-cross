import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
} from 'sequelize-typescript';
;

export enum MessagePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum MessageCategory {
  EMERGENCY = 'EMERGENCY',
  HEALTH_UPDATE = 'HEALTH_UPDATE',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  MEDICATION_REMINDER = 'MEDICATION_REMINDER',
  GENERAL = 'GENERAL',
  INCIDENT_NOTIFICATION = 'INCIDENT_NOTIFICATION',
  COMPLIANCE = 'COMPLIANCE',
}

export interface MessageAttributes {
  id?: string;
  subject?: string;
  content: string;
  priority: MessagePriority;
  category: MessageCategory;
  recipientCount: number;
  scheduledAt?: Date;
  attachments: string[];
  senderId: string;
  templateId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'messages',
  timestamps: true,
  underscored: true,
})
export class Message extends Model<MessageAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  subject?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.ENUM(...(Object.values(MessagePriority) as string[])),
    allowNull: false,
  })
  priority: MessagePriority;

  @Index
  @Column({
    type: DataType.ENUM(...(Object.values(MessageCategory) as string[])),
    allowNull: false,
  })
  category: MessageCategory;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  recipientCount: number;

  @Index
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  scheduledAt?: Date;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  attachments: string[];

  @Index
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  senderId: string;

  @BelongsTo(() => require('./user.model').User, { foreignKey: 'senderId', as: 'sender' })
  declare sender?: any;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  templateId?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare createdAt?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare updatedAt?: Date;
}
