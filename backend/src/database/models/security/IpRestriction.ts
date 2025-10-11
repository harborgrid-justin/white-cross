import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { IpRestrictionType } from '../../types/enums';

/**
 * IpRestriction Model
 *
 * HIPAA Compliance: Implements IP-based access control for enhanced security.
 * Allows organizations to restrict PHI access to specific IP addresses or
 * block malicious IPs, supporting HIPAA's Technical Safeguards requirements.
 *
 * Key Features:
 * - Whitelist and blacklist support
 * - Active/inactive status for temporary restrictions
 * - Reason tracking for audit trail
 * - Creator tracking for accountability
 * - Fast IP lookup via indexed searches
 */
interface IpRestrictionAttributes {
  id: string;
  ipAddress: string;
  type: IpRestrictionType;
  reason?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IpRestrictionCreationAttributes
  extends Optional<IpRestrictionAttributes, 'id' | 'createdAt' | 'updatedAt' | 'type' | 'isActive' | 'reason'> {}

export class IpRestriction
  extends Model<IpRestrictionAttributes, IpRestrictionCreationAttributes>
  implements IpRestrictionAttributes
{
  public id!: string;
  public ipAddress!: string;
  public type!: IpRestrictionType;
  public reason?: string;
  public isActive!: boolean;
  public createdBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

IpRestriction.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'IP address or CIDR range',
    },
    type: {
      type: DataTypes.ENUM(...Object.values(IpRestrictionType)),
      allowNull: false,
      defaultValue: IpRestrictionType.WHITELIST,
      comment: 'Restriction type (whitelist or blacklist)',
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Reason for the IP restriction',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'Whether the restriction is currently active',
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'User ID who created the restriction',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'ip_restrictions',
    timestamps: true,
    indexes: [
      { fields: ['ipAddress'] },
      { fields: ['type'] },
      { fields: ['isActive'] },
    ],
  }
);
