/**
 * @fileoverview SecurityIncident Database Model
 * @module database/models/security/SecurityIncident
 * @description Sequelize model for tracking security incidents and breaches.
 * Critical for HIPAA Breach Notification Rule compliance, incident response,
 * security monitoring, and maintaining organizational security posture.
 *
 * Key Features:
 * - Comprehensive incident tracking with type classification
 * - Severity levels (CRITICAL, HIGH, MEDIUM, LOW) for prioritization
 * - Status workflow (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
 * - Affected resources tracking for impact assessment
 * - Resolution documentation for compliance and learning
 * - Detection and resolution timestamps for SLA tracking
 * - Detector and resolver tracking for accountability
 *
 * @security Tracks all security incidents for breach notification
 * @security Validates resolution requirements for closed incidents
 * @compliance HIPAA - Breach Notification Rule (45 CFR §§ 164.400-414)
 * @compliance HIPAA - Security incident tracking and response
 * @compliance Required for demonstrating security posture to auditors
 *
 * @requires sequelize - ORM for database operations
 * @requires SecurityIncidentType - Enum for incident classification
 * @requires IncidentSeverity - Enum for severity levels
 * @requires SecurityIncidentStatus - Enum for workflow states
 *
 * LOC: 7B52BE4769
 * WC-GEN-093 | SecurityIncident.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize.ts (database/config/sequelize.ts)
 *   - enums.ts (database/types/enums.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (database/models/index.ts)
 *   - Security monitoring services - Incident detection
 *   - Compliance reporting - Breach notification
 *   - Incident response - Resolution tracking
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { SecurityIncidentType, IncidentSeverity, SecurityIncidentStatus } from '../../types/enums';

/**
 * @interface SecurityIncidentAttributes
 * @description TypeScript interface defining all SecurityIncident model attributes
 *
 * @property {string} id - Primary key, auto-generated UUID
 * @property {SecurityIncidentType} type - Incident classification type
 * @property {IncidentSeverity} severity - Severity level for prioritization
 * @property {string} description - Detailed incident description (10-5000 chars)
 * @property {string[]} affectedResources - Array of affected systems/resources
 * @property {string} [detectedBy] - User ID or system that detected the incident
 * @property {SecurityIncidentStatus} status - Current workflow status
 * @property {Date} [resolvedAt] - Timestamp when incident was resolved
 * @property {string} [resolvedBy] - User ID who resolved the incident
 * @property {string} [resolution] - Resolution details and actions taken
 * @property {Date} createdAt - Incident detection/creation timestamp
 * @property {Date} updatedAt - Last update timestamp
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

/**
 * @interface SecurityIncidentCreationAttributes
 * @description Attributes required when creating a new SecurityIncident instance.
 * Extends SecurityIncidentAttributes with optional fields that have defaults or are auto-generated.
 */
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

/**
 * @class SecurityIncident
 * @extends Model
 * @description SecurityIncident model for tracking and managing security incidents.
 * Essential for HIPAA Breach Notification compliance, security monitoring, and
 * incident response workflows in healthcare systems.
 *
 * @tablename security_incidents
 *
 * HIPAA Breach Notification Requirements:
 * - Must track all incidents involving unsecured PHI
 * - Severity assessment determines notification requirements
 * - CRITICAL/HIGH severity may require HHS and individual notification
 * - All incidents must be documented regardless of breach determination
 * - 60-day notification deadline for confirmed breaches
 *
 * Incident Workflow:
 * 1. Detection → Create incident with type, severity, description
 * 2. OPEN → Incident detected, awaiting triage
 * 3. IN_PROGRESS → Under investigation or remediation
 * 4. RESOLVED → Incident mitigated, awaiting final documentation
 * 5. CLOSED → Fully resolved with complete documentation
 *
 * Severity Levels:
 * - CRITICAL: Immediate threat to PHI or system availability (response within 1 hour)
 * - HIGH: Significant security risk requiring urgent action (response within 4 hours)
 * - MEDIUM: Moderate risk, needs timely resolution (response within 24 hours)
 * - LOW: Minor issue, scheduled resolution (response within 72 hours)
 *
 * Common Incident Types:
 * - UNAUTHORIZED_ACCESS: Unauthorized PHI access attempt
 * - DATA_BREACH: Confirmed or suspected PHI breach
 * - MALWARE: Malicious software detection
 * - PHISHING: Phishing attempt targeting users
 * - BRUTE_FORCE: Brute force attack detection
 * - INSIDER_THREAT: Suspicious internal user activity
 *
 * @example
 * // Create a critical security incident
 * await SecurityIncident.create({
 *   type: SecurityIncidentType.DATA_BREACH,
 *   severity: IncidentSeverity.CRITICAL,
 *   description: 'Unauthorized access to patient records database detected from external IP',
 *   affectedResources: ['patient_records_db', 'health_records_table'],
 *   detectedBy: 'security-monitoring-system'
 * });
 *
 * @example
 * // Resolve an incident
 * const incident = await SecurityIncident.findByPk('incident-uuid');
 * await incident.update({
 *   status: SecurityIncidentStatus.RESOLVED,
 *   resolvedAt: new Date(),
 *   resolvedBy: 'admin-user-uuid',
 *   resolution: 'Blocked malicious IP, reset affected user passwords, notified impacted patients'
 * });
 *
 * @example
 * // Query open high-severity incidents
 * const criticalIncidents = await SecurityIncident.findAll({
 *   where: {
 *     severity: [IncidentSeverity.CRITICAL, IncidentSeverity.HIGH],
 *     status: [SecurityIncidentStatus.OPEN, SecurityIncidentStatus.IN_PROGRESS]
 *   },
 *   order: [['createdAt', 'DESC']]
 * });
 *
 * @security Resolution required for RESOLVED/CLOSED status
 * @security Resolver and timestamp tracked for accountability
 * @compliance Breach notification deadlines enforced externally
 */
export class SecurityIncident
  extends Model<SecurityIncidentAttributes, SecurityIncidentCreationAttributes>
  implements SecurityIncidentAttributes
{
  /**
   * @property {string} id - Primary key UUID
   * @security Unique identifier for incident tracking
   */
  public id!: string;

  /**
   * @property {SecurityIncidentType} type - Incident classification
   * @security Determines incident handling procedures
   * @compliance Used for breach notification determination
   */
  public type!: SecurityIncidentType;

  /**
   * @property {IncidentSeverity} severity - Severity level
   * @security Determines response SLA and escalation
   * @compliance CRITICAL/HIGH may require breach notification
   */
  public severity!: IncidentSeverity;

  /**
   * @property {string} description - Detailed incident description
   * @validation 10-5000 characters
   * @compliance Required for breach documentation
   */
  public description!: string;

  /**
   * @property {string[]} affectedResources - Affected systems/resources
   * @validation Max 100 resources, each max 255 chars
   * @compliance Required for impact assessment and breach scope
   */
  public affectedResources!: string[];

  /**
   * @property {string} detectedBy - Detector identification
   * @validation Max 255 characters
   * @security Tracks who/what detected the incident
   */
  public detectedBy?: string;

  /**
   * @property {SecurityIncidentStatus} status - Current workflow status
   * @default SecurityIncidentStatus.OPEN
   * @security Tracks incident lifecycle for SLA compliance
   */
  public status!: SecurityIncidentStatus;

  /**
   * @property {Date} resolvedAt - Resolution timestamp
   * @validation Cannot be future date
   * @validation REQUIRED for RESOLVED/CLOSED status
   * @compliance Required for SLA tracking
   */
  public resolvedAt?: Date;

  /**
   * @property {string} resolvedBy - Resolver user ID
   * @validation REQUIRED for RESOLVED/CLOSED status
   * @security Accountability for incident resolution
   */
  public resolvedBy?: string;

  /**
   * @property {string} resolution - Resolution details
   * @validation Max 5000 characters
   * @validation REQUIRED for RESOLVED/CLOSED status
   * @compliance Required for post-incident review and learning
   */
  public resolution?: string;

  /**
   * @property {Date} createdAt - Incident detection timestamp
   * @readonly
   * @compliance Critical for breach notification timeline
   */
  public readonly createdAt!: Date;

  /**
   * @property {Date} updatedAt - Last update timestamp
   * @readonly
   */
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
