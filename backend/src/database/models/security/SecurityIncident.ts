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
    },
    affectedResources: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
      comment: 'List of affected resources/systems',
    },
    detectedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User ID or system that detected the incident',
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
    },
    resolvedBy: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'User ID who resolved the incident',
    },
    resolution: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Resolution details and actions taken',
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
  }
);
