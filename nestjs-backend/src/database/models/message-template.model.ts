import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { User } from './user.model';
import { MessageCategory } from './message.model';

export enum MessageType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  VOICE = 'VOICE',
}

export interface MessageTemplateAttributes {
  id: string;
  name: string;
  subject?: string;
  content: string;
  type: MessageType;
  category: MessageCategory;
  variables: string[];
  isActive: boolean;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

@Table({
  tableName: 'message_templates',
  timestamps: true,
  underscored: true,
})
export class MessageTemplate extends Model<MessageTemplateAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

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

  @Index
  @Column({
    type: DataType.ENUM(...Object.values(MessageType)),
    allowNull: false,
  })
  type: MessageType;

  @Index
  @Column({
    type: DataType.ENUM(...Object.values(MessageCategory)),
    allowNull: false,
  })
  category: MessageCategory;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    defaultValue: [],
  })
  variables: string[];

  @Index
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @Index
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdById: string;

  @BelongsTo(() => User, 'createdById')
  createdBy: User;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updatedAt: Date;
}
