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
      validate: {
        notEmpty: {
          msg: 'IP address cannot be empty'
        },
        isValidIpOrCidr(value: string) {
          // IPv4 validation
          const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
          // IPv4 CIDR validation
          const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
          // IPv6 validation (simplified)
          const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

          if (!ipv4Regex.test(value) && !cidrRegex.test(value) && !ipv6Regex.test(value)) {
            throw new Error('Invalid IP address or CIDR range format');
          }

          // Validate IPv4 octets if it's IPv4
          if (ipv4Regex.test(value) || cidrRegex.test(value)) {
            const parts = value.split('/')[0].split('.');
            for (const part of parts) {
              const num = parseInt(part);
              if (num < 0 || num > 255) {
                throw new Error('IPv4 octets must be between 0 and 255');
              }
            }

            // Validate CIDR notation
            if (cidrRegex.test(value)) {
              const cidrBits = parseInt(value.split('/')[1]);
              if (cidrBits < 0 || cidrBits > 32) {
                throw new Error('CIDR notation must be between /0 and /32 for IPv4');
              }
            }
          }
        },
        notLocalhost(value: string) {
          const localhostPatterns = ['127.0.0.1', 'localhost', '::1', '0.0.0.0'];
          if (localhostPatterns.some(pattern => value.includes(pattern))) {
            throw new Error('Cannot restrict localhost addresses');
          }
        },
      },
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
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Reason must not exceed 1000 characters'
        },
      },
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
      validate: {
        notEmpty: {
          msg: 'Created by user ID cannot be empty'
        },
        isUUID: {
          args: 4,
          msg: 'Created by must be a valid UUID'
        },
      },
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
