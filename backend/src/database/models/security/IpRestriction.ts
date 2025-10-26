/**
 * @fileoverview IpRestriction Database Model
 * @module database/models/security/IpRestriction
 * @description Sequelize model for IP-based access control and security restrictions.
 * Implements whitelist and blacklist functionality to restrict or allow PHI access based
 * on IP addresses or CIDR ranges, supporting HIPAA Technical Safeguards requirements.
 *
 * Key Features:
 * - Whitelist and blacklist support for flexible IP access control
 * - IPv4, IPv6, and CIDR range notation support
 * - Active/inactive status for temporary restrictions
 * - Reason tracking for compliance audit trails
 * - Creator tracking for accountability
 * - Fast IP lookup via indexed database searches
 * - Prevents localhost restriction for security
 *
 * @security Implements IP-based access control for PHI protection
 * @security Validates IP address format and prevents localhost blocking
 * @compliance HIPAA - Technical Safeguards for restricting PHI access by location
 * @compliance HIPAA - Audit trail for IP restriction changes
 *
 * @requires sequelize - ORM for database operations
 * @requires IpRestrictionType - Enum defining whitelist/blacklist types
 *
 * LOC: ED064839AE
 * WC-GEN-088 | IpRestriction.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - Authentication middleware - IP validation
 *   - Security services - IP-based access control
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { IpRestrictionType } from '../../types/enums';

/**
 * @interface IpRestrictionAttributes
 * @description TypeScript interface defining all IpRestriction model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {string} ipAddress - IP address or CIDR range (IPv4 or IPv6)
 * @property {IpRestrictionType} type - Restriction type (WHITELIST or BLACKLIST)
 * @property {string} [reason] - Optional reason for IP restriction (for audit trail)
 * @property {boolean} isActive - Whether restriction is currently active
 * @property {string} createdBy - User ID who created the restriction
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
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

/**
 * @interface IpRestrictionCreationAttributes
 * @description Attributes required when creating a new IpRestriction instance.
 * Extends IpRestrictionAttributes with optional fields that have defaults or are auto-generated.
 */
interface IpRestrictionCreationAttributes
  extends Optional<IpRestrictionAttributes, 'id' | 'createdAt' | 'updatedAt' | 'type' | 'isActive' | 'reason'> {}

/**
 * @class IpRestriction
 * @extends Model
 * @description IpRestriction model for IP-based access control to PHI systems.
 * Supports both whitelist (only allow specific IPs) and blacklist (block specific IPs)
 * strategies with IPv4, IPv6, and CIDR notation for flexible network access control.
 *
 * @tablename ip_restrictions
 *
 * Access Control Strategies:
 * - **Whitelist**: Only allow access from specified IPs (most secure)
 * - **Blacklist**: Block access from specified IPs (less restrictive)
 * - CIDR ranges supported for subnet-level control (e.g., 192.168.1.0/24)
 * - Active/inactive status allows temporary restrictions without deletion
 *
 * IP Format Support:
 * - IPv4: Standard dotted notation (e.g., 192.168.1.100)
 * - IPv4 CIDR: Subnet notation (e.g., 192.168.1.0/24)
 * - IPv6: Standard colon notation (e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334)
 * - Validates IP octets (0-255 for IPv4) and CIDR bits (0-32 for IPv4)
 *
 * Security Features:
 * - Localhost addresses (127.0.0.1, ::1, 0.0.0.0) cannot be restricted
 * - IP address format validated on creation/update
 * - Creator tracking for accountability
 * - Reason field for compliance documentation
 * - Indexed for fast lookup during authentication
 *
 * @example
 * // Whitelist a specific office IP
 * await IpRestriction.create({
 *   ipAddress: '203.0.113.5',
 *   type: IpRestrictionType.WHITELIST,
 *   reason: 'Main office location',
 *   isActive: true,
 *   createdBy: 'admin-user-uuid'
 * });
 *
 * @example
 * // Blacklist a malicious IP
 * await IpRestriction.create({
 *   ipAddress: '192.0.2.100',
 *   type: IpRestrictionType.BLACKLIST,
 *   reason: 'Detected brute force attack',
 *   isActive: true,
 *   createdBy: 'security-system'
 * });
 *
 * @example
 * // Whitelist entire office subnet using CIDR
 * await IpRestriction.create({
 *   ipAddress: '10.0.0.0/8',
 *   type: IpRestrictionType.WHITELIST,
 *   reason: 'Internal network range',
 *   isActive: true,
 *   createdBy: 'admin-user-uuid'
 * });
 *
 * @security Prevents localhost restriction to avoid lockout
 * @security IP format validated to prevent invalid restrictions
 * @security Indexed for performance during authentication checks
 */
export class IpRestriction
  extends Model<IpRestrictionAttributes, IpRestrictionCreationAttributes>
  implements IpRestrictionAttributes
{
  /**
   * @property {string} id - Primary key UUID
   * @security Unique identifier for IP restriction
   */
  public id!: string;

  /**
   * @property {string} ipAddress - IP address or CIDR range
   * @validation Must be valid IPv4, IPv6, or CIDR format
   * @validation IPv4 octets must be 0-255
   * @validation CIDR bits must be 0-32 for IPv4
   * @validation Cannot be localhost (127.0.0.1, ::1, 0.0.0.0)
   * @security Indexed for fast lookup during authentication
   */
  public ipAddress!: string;

  /**
   * @property {IpRestrictionType} type - Restriction type
   * @default IpRestrictionType.WHITELIST
   * @security WHITELIST = allow only this IP, BLACKLIST = block this IP
   */
  public type!: IpRestrictionType;

  /**
   * @property {string} reason - Optional reason for restriction
   * @validation Max 1000 characters
   * @compliance Required for audit trail and compliance documentation
   */
  public reason?: string;

  /**
   * @property {boolean} isActive - Active status flag
   * @default true
   * @security Allows temporary disabling without deleting restriction
   */
  public isActive!: boolean;

  /**
   * @property {string} createdBy - User ID who created restriction
   * @validation Must be valid UUID
   * @security Accountability for who implemented IP restriction
   */
  public createdBy!: string;

  /**
   * @property {Date} createdAt - Creation timestamp
   * @readonly
   */
  public readonly createdAt!: Date;

  /**
   * @property {Date} updatedAt - Last update timestamp
   * @readonly
   */
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
