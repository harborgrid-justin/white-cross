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


export enum MessageType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  VOICE = 'VOICE',
}

export enum MessageCategory {
  APPOINTMENT = 'APPOINTMENT',
  MEDICATION = 'MEDICATION',
  EMERGENCY = 'EMERGENCY',
  NOTIFICATION = 'NOTIFICATION',
  REMINDER = 'REMINDER',
}

export interface MessageTemplateAttributes {
  id?: string;
  name: string;
  subject?: string;
  content: string;
  type: MessageType;
  category: MessageCategory;
  variables: string[];
  isActive: boolean;
  createdById: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'message_templates',
  timestamps: true,
  underscored: false,
})
export class MessageTemplate extends Model<MessageTemplateAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id?: string;

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
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(MessageType)]
    },
    allowNull: false,
  })
  type: MessageType;

  @Index
  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(MessageCategory)]
    },
    allowNull: false,
  })
  declare category: any;

  @Column({
    type: DataType.ARRAY(DataType.STRING(255)),
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
  @ForeignKey(() => require('./user.model').User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdById: string;

  @BelongsTo(() => require('./user.model').User, { foreignKey: 'createdById', as: 'createdBy' })
  declare createdBy?: any;

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
