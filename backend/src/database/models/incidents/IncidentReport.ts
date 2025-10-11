import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { IncidentType, IncidentSeverity, InsuranceClaimStatus, ComplianceStatus } from '../../types/enums';
import { AuditableModel } from '../base/AuditableModel';

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
          msg: 'Invalid incident date/time'
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
      medicationErrorDetailRequired() {
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
