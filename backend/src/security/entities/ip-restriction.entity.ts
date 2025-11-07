import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  Index,
} from 'sequelize-typescript';
import { IpRestrictionType } from '../enums';

/**
 * IP Restriction Entity
 * Manages IP whitelisting, blacklisting, and geolocation-based access control
 */
@Table({
  tableName: 'ip_restrictions',
  timestamps: true,
  indexes: [{ fields: ['type', 'isActive'] }, { fields: ['ipAddress'] }],
})
export class IpRestrictionEntity extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @Column({
    type: DataType.ENUM(...(Object.values(IpRestrictionType) as string[])),
    allowNull: false,
  })
  type: IpRestrictionType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'ipAddress',
  })
  ipAddress?: string; // Single IP or CIDR notation (e.g., "192.168.1.0/24")

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'ipRange',
  })
  ipRange?: { start: string; end: string };

  @Column({
    type: DataType.JSON,
    allowNull: true,
    field: 'countries',
  })
  countries?: string[]; // ISO country codes for geo restrictions

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'reason',
  })
  reason: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'createdBy',
  })
  createdBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'createdAt',
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: 'expiresAt',
  })
  expiresAt?: Date;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'isActive',
  })
  isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'updatedAt',
  })
  declare updatedAt: Date;
}
