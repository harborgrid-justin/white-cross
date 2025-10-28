import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

// Enums
export enum DisclosureType {
  TREATMENT = 'TREATMENT',
  PAYMENT = 'PAYMENT',
  HEALTHCARE_OPERATIONS = 'HEALTHCARE_OPERATIONS',
  PUBLIC_HEALTH = 'PUBLIC_HEALTH',
  LEGAL_REQUIREMENT = 'LEGAL_REQUIREMENT',
  PARENTAL_REQUEST = 'PARENTAL_REQUEST',
  STUDENT_REQUEST = 'STUDENT_REQUEST',
  RESEARCH = 'RESEARCH',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER',
}

export enum DisclosurePurpose {
  TREATMENT_COORDINATION = 'TREATMENT_COORDINATION',
  BILLING_CLAIMS = 'BILLING_CLAIMS',
  QUALITY_IMPROVEMENT = 'QUALITY_IMPROVEMENT',
  PUBLIC_HEALTH_REPORTING = 'PUBLIC_HEALTH_REPORTING',
  COURT_ORDER = 'COURT_ORDER',
  SUBPOENA = 'SUBPOENA',
  PARENTAL_ACCESS = 'PARENTAL_ACCESS',
  STUDENT_ACCESS = 'STUDENT_ACCESS',
  RESEARCH_STUDY = 'RESEARCH_STUDY',
  MEDICAL_EMERGENCY = 'MEDICAL_EMERGENCY',
  STATE_REGISTRY = 'STATE_REGISTRY',
  MEDICAID_BILLING = 'MEDICAID_BILLING',
  OTHER = 'OTHER',
}

export enum DisclosureMethod {
  EMAIL = 'EMAIL',
  FAX = 'FAX',
  MAIL = 'MAIL',
  IN_PERSON = 'IN_PERSON',
  PHONE = 'PHONE',
  SECURE_MESSAGE = 'SECURE_MESSAGE',
  PORTAL = 'PORTAL',
  EHR_INTEGRATION = 'EHR_INTEGRATION',
  OTHER = 'OTHER',
}

export enum RecipientType {
  PARENT_GUARDIAN = 'PARENT_GUARDIAN',
  HEALTHCARE_PROVIDER = 'HEALTHCARE_PROVIDER',
  INSURANCE_COMPANY = 'INSURANCE_COMPANY',
  GOVERNMENT_AGENCY = 'GOVERNMENT_AGENCY',
  SCHOOL_OFFICIAL = 'SCHOOL_OFFICIAL',
  LEGAL_REPRESENTATIVE = 'LEGAL_REPRESENTATIVE',
  STUDENT = 'STUDENT',
  RESEARCHER = 'RESEARCHER',
  OTHER = 'OTHER',
}

// Attributes interface
export interface PHIDisclosureAttributes {
  id: string;
  studentId: string;
  disclosureType: DisclosureType;
  purpose: DisclosurePurpose;
  method: DisclosureMethod;
  disclosureDate: Date;
  informationDisclosed: string[];
  minimumNecessary: string;
  recipientType: RecipientType;
  recipientName: string;
  recipientOrganization?: string;
  recipientAddress?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  authorizationObtained: boolean;
  authorizationDate?: Date;
  authorizationExpiryDate?: Date;
  patientRequested: boolean;
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpCompleted: boolean;
  notes?: string;
  disclosedBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Creation attributes
export interface PHIDisclosureCreationAttributes
  extends Optional<PHIDisclosureAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

/**
 * PHI Disclosure Model
 * HIPAA §164.528 - Accounting of Disclosures
 *
 * Tracks all disclosures of Protected Health Information (PHI)
 * as required by HIPAA regulations.
 */
class PHIDisclosure extends Model<PHIDisclosureAttributes, PHIDisclosureCreationAttributes> implements PHIDisclosureAttributes {
  public id!: string;
  public studentId!: string;
  public disclosureType!: DisclosureType;
  public purpose!: DisclosurePurpose;
  public method!: DisclosureMethod;
  public disclosureDate!: Date;
  public informationDisclosed!: string[];
  public minimumNecessary!: string;
  public recipientType!: RecipientType;
  public recipientName!: string;
  public recipientOrganization?: string;
  public recipientAddress?: string;
  public recipientPhone?: string;
  public recipientEmail?: string;
  public authorizationObtained!: boolean;
  public authorizationDate?: Date;
  public authorizationExpiryDate?: Date;
  public patientRequested!: boolean;
  public followUpRequired!: boolean;
  public followUpDate?: Date;
  public followUpCompleted!: boolean;
  public notes?: string;
  public disclosedBy!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;

  /**
   * Initialize the PHI Disclosure model
   */
  public static initialize(sequelize: Sequelize): typeof PHIDisclosure {
    PHIDisclosure.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        studentId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'student_id',
        },
        disclosureType: {
          type: DataTypes.ENUM(...Object.values(DisclosureType)),
          allowNull: false,
          field: 'disclosure_type',
        },
        purpose: {
          type: DataTypes.ENUM(...Object.values(DisclosurePurpose)),
          allowNull: false,
        },
        method: {
          type: DataTypes.ENUM(...Object.values(DisclosureMethod)),
          allowNull: false,
        },
        disclosureDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'disclosure_date',
        },
        informationDisclosed: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: false,
          field: 'information_disclosed',
        },
        minimumNecessary: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'minimum_necessary',
        },
        recipientType: {
          type: DataTypes.ENUM(...Object.values(RecipientType)),
          allowNull: false,
          field: 'recipient_type',
        },
        recipientName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'recipient_name',
        },
        recipientOrganization: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'recipient_organization',
        },
        recipientAddress: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'recipient_address',
        },
        recipientPhone: {
          type: DataTypes.STRING(20),
          allowNull: true,
          field: 'recipient_phone',
        },
        recipientEmail: {
          type: DataTypes.STRING(255),
          allowNull: true,
          field: 'recipient_email',
        },
        authorizationObtained: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'authorization_obtained',
        },
        authorizationDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'authorization_date',
        },
        authorizationExpiryDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'authorization_expiry_date',
        },
        patientRequested: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'patient_requested',
        },
        followUpRequired: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'follow_up_required',
        },
        followUpDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'follow_up_date',
        },
        followUpCompleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          field: 'follow_up_completed',
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        disclosedBy: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'disclosed_by',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
        },
      },
      {
        sequelize,
        tableName: 'phi_disclosures',
        modelName: 'PHIDisclosure',
        paranoid: true,
        timestamps: true,
        underscored: true,
        indexes: [
          { fields: ['student_id'] },
          { fields: ['disclosure_date'] },
          { fields: ['disclosure_type', 'purpose'] },
          { fields: ['disclosed_by'] },
          {
            fields: ['follow_up_required', 'follow_up_completed'],
            where: { follow_up_required: true },
          },
        ],
      }
    );

    return PHIDisclosure;
  }

  /**
   * Define associations
   */
  public static associate(models: any): void {
    PHIDisclosure.belongsTo(models.Student, {
      foreignKey: 'studentId',
      as: 'student',
    });

    PHIDisclosure.belongsTo(models.User, {
      foreignKey: 'disclosedBy',
      as: 'discloser',
    });

    PHIDisclosure.hasMany(models.PHIDisclosureAudit, {
      foreignKey: 'disclosureId',
      as: 'auditTrail',
    });
  }
}

export default PHIDisclosure;
