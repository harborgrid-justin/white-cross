import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { SecurityIncidentType, IncidentSeverity, SecurityIncidentStatus } from '../../types/enums';

/**
 * SecurityIncident Model
 *
 * HIPAA Compliance: Records security incidents and breaches as required by HIPAA
 * Breach Notification Rule. Critical for incident response, compliance reporting,
 * and maintaining security posture.
 *
 * Key Features:
 * - Comprehensive incident tracking and classification
 * - Severity levels for prioritization
 * - Status workflow from open to resolved
 * - Affected resources tracking
 * - Resolution documentation
 * - Detection and resolution timestamps
 */
interface SecurityIncidentAttributes {
  id: string;
  type: SecurityIncidentType;
  severity: IncidentSeverity;
  description: string;
  affectedResources: string[];
  detectedBy?: string;
  status: SecurityIncidentStatus;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SecurityIncidentCreationAttributes
  extends Optional<
    SecurityIncidentAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'status'
    | 'detectedBy'
    | 'resolvedAt'
    | 'resolvedBy'
    | 'resolution'
  > {}

export class SecurityIncident
  extends Model<SecurityIncidentAttributes, SecurityIncidentCreationAttributes>
  implements SecurityIncidentAttributes
{
  public id!: string;
  public type!: SecurityIncidentType;
  public severity!: IncidentSeverity;
  public description!: string;
  public affectedResources!: string[];
  public detectedBy?: string;
  public status!: SecurityIncidentStatus;
  public resolvedAt?: Date;
  public resolvedBy?: string;
  public resolution?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SecurityIncident.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(SecurityIncidentType)),
      allowNull: false,
      comment: 'Type of security incident',
    },
    severity: {
      type: DataTypes.ENUM(...Object.values(IncidentSeverity)),
      allowNull: false,
      comment: 'Incident severity level',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'Detailed incident description',
      validate: {
        notEmpty: {
          msg: 'Incident description cannot be empty'
        },
        len: {
          args: [10, 5000],
          msg: 'Incident description must be between 10 and 5000 characters'
        },
      },
    },
    affectedResources: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      comment: 'List of affected resources/systems',
      validate: {
        isValidArray(value: string[]) {
          if (!Array.isArray(value)) {
            throw new Error('Affected resources must be an array');
          }
          if (value.length > 100) {
            throw new Error('Cannot have more than 100 affected resources');
          }
          // Validate each resource entry
          for (const resource of value) {
            if (typeof resource !== 'string' || resource.trim().length === 0) {
              throw new Error('Each affected resource must be a non-empty string');
            }
            if (resource.length > 255) {
              throw new Error('Each affected resource must not exceed 255 characters');
            }
          }
        },
      },
    },
    detectedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User ID or system that detected the incident',
      validate: {
        len: {
          args: [0, 255],
          msg: 'Detected by field must not exceed 255 characters'
        },
      },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(SecurityIncidentStatus)),
      allowNull: false,
      defaultValue: SecurityIncidentStatus.OPEN,
      comment: 'Current incident status',
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the incident was resolved',
      validate: {
        isValidResolvedDate(value: Date | undefined) {
          if (value && new Date(value) > new Date()) {
            throw new Error('Resolution date cannot be in the future');
          }
        },
      },
    },
    resolvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User ID who resolved the incident',
      validate: {
        requiredForResolution(value: string | undefined) {
          const resolvedStatuses = [SecurityIncidentStatus.RESOLVED, SecurityIncidentStatus.CLOSED];
          const status = this.status as SecurityIncidentStatus;
          if (resolvedStatuses.includes(status) && !value) {
            throw new Error('Resolved by is required when incident is resolved or closed');
          }
        },
      },
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Resolution details and actions taken',
      validate: {
        len: {
          args: [0, 5000],
          msg: 'Resolution must not exceed 5000 characters'
        },
        requiredForResolution(value: string | undefined) {
          const resolvedStatuses = [SecurityIncidentStatus.RESOLVED, SecurityIncidentStatus.CLOSED];
          const status = this.status as SecurityIncidentStatus;
          if (resolvedStatuses.includes(status) && !value) {
            throw new Error('Resolution details are required when incident is resolved or closed');
          }
        },
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'security_incidents',
    timestamps: true,
    indexes: [
      { fields: ['type', 'status'] },
      { fields: ['createdAt'] },
      { fields: ['severity'] },
      { fields: ['status'] },
    ],
    validate: {
      resolutionConsistency() {
        const resolvedStatuses = [SecurityIncidentStatus.RESOLVED, SecurityIncidentStatus.CLOSED];
        const status = this.status as SecurityIncidentStatus;
        const requiresResolution = resolvedStatuses.includes(status);

        if (requiresResolution) {
          if (!this.resolution) {
            throw new Error('Resolution details are required for resolved or closed incidents');
          }
          if (!this.resolvedBy) {
            throw new Error('Resolved by user is required for resolved or closed incidents');
          }
          if (!this.resolvedAt) {
            throw new Error('Resolved at timestamp is required for resolved or closed incidents');
          }
        }
      },
    },
  }
);
