import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export interface WebhookAttributes {
  id?: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  headers?: any;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'webhooks',
  timestamps: true,
  underscored: false,
})
export class Webhook extends Model<WebhookAttributes> implements WebhookAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: false,
  })
  url: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  events: string[];

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive: boolean;

  @Column(DataType.STRING(255))
  secret?: string;

  @Column(DataType.JSON)
  headers?: any;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  createdBy: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}
