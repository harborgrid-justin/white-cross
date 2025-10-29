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
  indexes: [
    { fields: ['type', 'isActive'] },
    { fields: ['ipAddress'] },
  ],
})
export class IpRestrictionEntity extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.STRING)
  declare id: string;

  @Column({
    type: DataType.ENUM(...Object.values(IpRestrictionType)),
    allowNull: false,
  })
  type: IpRestrictionType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ipAddress?: string; // Single IP or CIDR notation (e.g., "192.168.1.0/24")

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  ipRange?: { start: string; end: string };

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  countries?: string[]; // ISO country codes for geo restrictions

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  reason: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  createdBy: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expiresAt?: Date;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isActive: boolean;
}
