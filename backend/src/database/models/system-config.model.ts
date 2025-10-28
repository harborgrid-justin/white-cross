import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';

export interface SystemConfigAttributes {
  id?: string;
  key: string;
  value: any;
  description?: string;
  isPublic: boolean;
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'system_config',
  timestamps: true,
  indexes: [
    {
      fields: ['key'],
      unique: true,
    },
  ],
})
export class SystemConfig extends Model<SystemConfigAttributes> implements SystemConfigAttributes {
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  key: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  value: any;

  @Column(DataType.TEXT)
  description?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  isPublic: boolean;

  @Column(DataType.UUID)
  updatedBy?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;
}
