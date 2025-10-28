/**
 * @fileoverview Incident Report Database Model
 * @module database/models/incidents/IncidentReport
 * @description Sequelize model for managing student incident reports in school health settings.
 * Provides comprehensive incident documentation, tracking, and compliance management.
 *
 * Key Features:
 * - Incident type classification (injury, illness, behavioral, medication errors, etc.)
 * - Severity-based notification workflows
 * - Parent/guardian notification tracking with timestamps
 * - Evidence collection (photos, videos, attachments)
 * - Follow-up action management
 * - Witness statement integration
 * - Insurance claim tracking
 * - Legal compliance status monitoring
 *
 * Business Rules:
 * - Injury incidents automatically require follow-up actions
 * - Medication errors require detailed descriptions (minimum 50 characters)
 * - Critical severity incidents require principal notification within 1 hour
 * - High severity incidents require parent notification within 2 hours
 * - Incident reports are immutable after 24 hours (audit trail maintained)
 *
 * @compliance HIPAA - Protected Health Information (PHI) handling
 * @compliance FERPA - Educational records privacy requirements
 * @compliance State regulations - Mandatory incident reporting timelines
 *
 * @legal Retention requirement: 7 years from incident date
 * @legal Required for liability protection and legal proceedings
 * @legal Must maintain complete audit trail of all changes
 *
 * @requires sequelize
 * @requires ../../config/sequelize
 * @requires ../../types/enums
 * @requires ../base/AuditableModel
 *
 * LOC: 1A882E668E
 * Last Updated: 2025-10-17
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { IncidentType, IncidentSeverity, InsuranceClaimStatus, ComplianceStatus } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';
import type { Student } from '../core/Student';
import type { User } from '../core/User';

/**
 * @interface IncidentReportAttributes
 * @description Defines the complete structure of an incident report record
 * @property {string} id - Unique identifier (UUID v4)
 * @property {string} studentId - Reference to affected student
 * @property {string} reportedById - Reference to staff member who filed the report
 *
 * @property {IncidentType} type - Type of incident
 * @enum {IncidentType} ['INJURY', 'ILLNESS', 'BEHAVIORAL', 'MEDICATION_ERROR', 'ALLERGIC_REACTION', 'EMERGENCY', 'OTHER']
 * @business INJURY incidents automatically require follow-up
 * @business MEDICATION_ERROR incidents require detailed description (50+ characters)
 * @business EMERGENCY incidents trigger immediate notification protocols
 *
 * @property {IncidentSeverity} severity - Severity level of the incident
 * @enum {IncidentSeverity} ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
 * @business CRITICAL severity requires principal notification within 1 hour
 * @business HIGH severity requires parent notification within 2 hours
 * @business MEDIUM severity requires parent notification within 4 hours
 * @business LOW severity requires parent notification within same school day
 *
 * @property {string} description - Detailed incident description (20-5000 characters)
 * @compliance Required for legal documentation and compliance audits
 *
 * @property {string} location - Where the incident occurred (3-200 characters)
 * @business Required for safety pattern analysis and prevention
 *
 * @property {string[]} witnesses - Array of witness identifiers
 * @business Critical for legal proceedings and incident verification
 *
 * @property {string} actionsTaken - Immediate actions taken (10-2000 characters)
 * @compliance Required documentation for all incidents per state regulations
 *
 * @property {boolean} parentNotified - Whether parent/guardian was notified
 * @business Must be true within timeframe based on severity level
 * @property {string} [parentNotificationMethod] - Method used (call, email, SMS, in-person)
 * @property {Date} [parentNotifiedAt] - Timestamp of parent notification
 * @property {string} [parentNotifiedBy] - Staff member who notified parent
 *
 * @property {boolean} followUpRequired - Whether follow-up actions are needed
 * @business Automatically true for INJURY type incidents
 * @property {string} [followUpNotes] - Additional follow-up notes (max 2000 characters)
 *
 * @property {string[]} attachments - Array of attachment file URLs
 * @property {string[]} evidencePhotos - Array of photo evidence URLs
 * @property {string[]} evidenceVideos - Array of video evidence URLs
 * @compliance Evidence must be stored securely with encryption
 *
 * @property {string} [insuranceClaimNumber] - Insurance claim reference number
 * @property {InsuranceClaimStatus} [insuranceClaimStatus] - Status of insurance claim
 * @enum {InsuranceClaimStatus} ['NOT_FILED', 'FILED', 'PENDING', 'APPROVED', 'DENIED', 'CLOSED']
 *
 * @property {ComplianceStatus} legalComplianceStatus - Legal compliance review status
 * @enum {ComplianceStatus} ['PENDING', 'COMPLIANT', 'NON_COMPLIANT', 'UNDER_REVIEW']
 * @compliance All incidents require compliance review within 48 hours
 *
 * @property {Date} occurredAt - When the incident occurred
 * @business Cannot be in the future; used for reporting and analytics
 *
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record last update timestamp
 * @legal Full audit trail maintained via AuditableModel hooks
 */
interface IncidentReportAttributes {
  id: string;
  studentId: string;
  reportedById: string;
  type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  location: string;
  witnesses: string[];
  actionsTaken: string;
  parentNotified: boolean;
  parentNotificationMethod?: string;
  parentNotifiedAt?: Date;
  parentNotifiedBy?: string;
  followUpRequired: boolean;
  followUpNotes?: string;
  attachments: string[];
  evidencePhotos: string[];
  evidenceVideos: string[];
  insuranceClaimNumber?: string;
  insuranceClaimStatus?: InsuranceClaimStatus;
  legalComplianceStatus: ComplianceStatus;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface IncidentReportCreationAttributes
 * @description Defines optional fields when creating a new incident report
 * @extends IncidentReportAttributes
 */
interface IncidentReportCreationAttributes
  extends Optional<
    IncidentReportAttributes,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'parentNotificationMethod'
    | 'parentNotifiedAt'
    | 'parentNotifiedBy'
    | 'followUpNotes'
    | 'attachments'
    | 'witnesses'
    | 'evidencePhotos'
    | 'evidenceVideos'
    | 'insuranceClaimNumber'
    | 'insuranceClaimStatus'
  > {}

/**
 * @class IncidentReport
 * @extends Model
 * @description Sequelize model class for incident reports
 *
 * Workflow Summary:
 * 1. Incident occurs → Staff creates report with type and severity
 * 2. System validates required fields based on incident type
 * 3. Parent notification tracked with method, timestamp, and notifier
 * 4. Evidence can be attached (photos, videos, documents)
 * 5. Follow-up actions created if needed
 * 6. Witness statements collected and linked
 * 7. Compliance review completed within 48 hours
 * 8. Record retained for 7 years per legal requirements
 *
 * Notification Workflows:
 * - CRITICAL severity: Principal notified immediately + Parent within 1 hour
 * - HIGH severity: Parent notified within 2 hours
 * - MEDIUM severity: Parent notified within 4 hours
 * - LOW severity: Parent notified same school day
 * - EMERGENCY type: All emergency contacts notified immediately
 *
 * Associations:
 * - belongsTo: Student (affected student)
 * - belongsTo: User (reporting staff member)
 * - hasMany: FollowUpAction (related follow-up tasks)
 * - hasMany: WitnessStatement (witness testimonies)
 *
 * Hooks:
 * - beforeCreate: Auto-set followUpRequired for INJURY incidents
 * - beforeUpdate: Auto-timestamp parent notification
 * - Audit hooks: Track all changes via AuditableModel
 *
 * @example
 * // Create a new incident report
 * const report = await IncidentReport.create({
 *   studentId: 'student-uuid',
 *   reportedById: 'staff-uuid',
 *   type: IncidentType.INJURY,
 *   severity: IncidentSeverity.HIGH,
 *   description: 'Student fell on playground and injured left arm',
 *   location: 'Elementary Playground - Slide Area',
 *   actionsTaken: 'Applied ice pack, contacted parent, monitored for 30 minutes',
 *   parentNotified: true,
 *   parentNotificationMethod: 'phone',
 *   followUpRequired: true,
 *   occurredAt: new Date(),
 *   legalComplianceStatus: ComplianceStatus.PENDING
 * });
 */
export class IncidentReport
  extends Model<IncidentReportAttributes, IncidentReportCreationAttributes>
  implements IncidentReportAttributes
{
  public id!: string;
  public studentId!: string;
  public reportedById!: string;
  public type!: IncidentType;
  public severity!: IncidentSeverity;
  public description!: string;
  public location!: string;
  public witnesses!: string[];
  public actionsTaken!: string;
  public parentNotified!: boolean;
  public parentNotificationMethod?: string;
  public parentNotifiedAt?: Date;
  public parentNotifiedBy?: string;
  public followUpRequired!: boolean;
  public followUpNotes?: string;
  public attachments!: string[];
  public evidencePhotos!: string[];
  public evidenceVideos!: string[];
  public insuranceClaimNumber?: string;
  public insuranceClaimStatus?: InsuranceClaimStatus;
  public legalComplianceStatus!: ComplianceStatus;
  public occurredAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  declare student?: Student;
  declare reportedBy?: User;
  declare followUpActions?: any[];
  declare witnessStatements?: any[];
}

IncidentReport.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    studentId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Student ID is required'
        },
        isUUID: {
          args: 4,
          msg: 'Student ID must be a valid UUID'
        }
      }
    },
    reportedById: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Reporter ID is required'
        },
        isUUID: {
          args: 4,
          msg: 'Reporter ID must be a valid UUID'
        }
      }
    },
    type: {
      type: DataTypes.ENUM(...Object.values(IncidentType)),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Incident type is required'
        },
        isIn: {
          args: [Object.values(IncidentType)],
          msg: `Incident type must be one of: ${Object.values(IncidentType).join(', ')}`
        }
      }
    },
    severity: {
      type: DataTypes.ENUM(...Object.values(IncidentSeverity)),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Incident severity is required'
        },
        isIn: {
          args: [Object.values(IncidentSeverity)],
          msg: `Severity must be one of: ${Object.values(IncidentSeverity).join(', ')}`
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Incident description is required'
        },
        len: {
          args: [20, 5000],
          msg: 'Description must be between 20 and 5000 characters for proper documentation'
        }
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Incident location is required for safety documentation'
        },
        len: {
          args: [3, 200],
          msg: 'Location must be between 3 and 200 characters'
        }
      }
    },
    witnesses: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    actionsTaken: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Actions taken must be documented for all incidents'
        },
        len: {
          args: [10, 2000],
          msg: 'Actions taken must be between 10 and 2000 characters'
        }
      }
    },
    parentNotified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    parentNotificationMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parentNotifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    parentNotifiedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    followUpRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    followUpNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 2000],
          msg: 'Follow-up notes cannot exceed 2000 characters'
        }
      }
    },
    attachments: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    evidencePhotos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    evidenceVideos: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    occurredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Incident occurrence time is required'
        },
        isDate: {
          msg: 'Invalid incident date/time',
          args: true
        },
        isNotFuture(value: Date) {
          if (new Date(value) > new Date()) {
            throw new Error('Incident time cannot be in the future');
          }
        }
      }
    },
    insuranceClaimNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    insuranceClaimStatus: {
      type: DataTypes.ENUM(...Object.values(InsuranceClaimStatus)),
      allowNull: true,
    },
    legalComplianceStatus: {
      type: DataTypes.ENUM(...Object.values(ComplianceStatus)),
      allowNull: false,
      defaultValue: ComplianceStatus.PENDING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'incident_reports',
    timestamps: true,
    indexes: [
      { fields: ['studentId'] },
      { fields: ['reportedById'] },
      { fields: ['type', 'occurredAt'] },
      { fields: ['severity'] },
    ],
    validate: {
      // Model-level validation: Injury incidents require follow-up
      injuryRequiresFollowUp() {
        if (this.type === IncidentType.INJURY && !this.followUpRequired) {
          throw new Error('Injury incidents require follow-up to be marked as required');
        }
      },
      // Model-level validation: Medication errors require detailed description
      medicationErrorDetailRequired(this: IncidentReport) {
        if (this.type === IncidentType.MEDICATION_ERROR && this.description.length < 50) {
          throw new Error('Medication error incidents require detailed description (minimum 50 characters)');
        }
      }
    }
  }
);

// Add hooks for additional business logic validation
IncidentReport.beforeCreate((instance) => {
  // Auto-set follow-up required for injuries
  if (instance.type === IncidentType.INJURY && !instance.followUpRequired) {
    instance.followUpRequired = true;
  }
});

IncidentReport.beforeUpdate((instance) => {
  // Validate parent notification tracking
  if (instance.parentNotified && !instance.parentNotifiedAt) {
    instance.parentNotifiedAt = new Date();
  }
});

AuditableModel.setupAuditHooks(IncidentReport, 'IncidentReport');
