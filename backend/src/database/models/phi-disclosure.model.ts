import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { v4 as uuidv4 } from 'uuid';
import { createModelAuditHook } from '../services/model-audit-hooks.service';

export enum DisclosureType {
  TREATMENT = 'TREATMENT',
  PAYMENT = 'PAYMENT',
  HEALTHCARE_OPERATIONS = 'HEALTHCARE_OPERATIONS',
  AUTHORIZATION = 'AUTHORIZATION',
  REQUIRED_BY_LAW = 'REQUIRED_BY_LAW',
  PUBLIC_HEALTH = 'PUBLIC_HEALTH',
  RESEARCH = 'RESEARCH',
}

export enum DisclosurePurpose {
  TREATMENT = 'TREATMENT',
  PAYMENT = 'PAYMENT',
  OPERATIONS = 'OPERATIONS',
  LEGAL_REQUIREMENT = 'LEGAL_REQUIREMENT',
  PUBLIC_HEALTH = 'PUBLIC_HEALTH',
  RESEARCH = 'RESEARCH',
  PATIENT_REQUEST = 'PATIENT_REQUEST',
}

export enum DisclosureMethod {
  VERBAL = 'VERBAL',
  WRITTEN = 'WRITTEN',
  ELECTRONIC = 'ELECTRONIC',
  FAX = 'FAX',
  PHONE = 'PHONE',
}

export enum RecipientType {
  HEALTHCARE_PROVIDER = 'HEALTHCARE_PROVIDER',
  INSURANCE = 'INSURANCE',
  PARENT_GUARDIAN = 'PARENT_GUARDIAN',
  SCHOOL_OFFICIAL = 'SCHOOL_OFFICIAL',
  GOVERNMENT_AGENCY = 'GOVERNMENT_AGENCY',
  RESEARCHER = 'RESEARCHER',
  OTHER = 'OTHER',
}

export interface PhiDisclosureAttributes {
  id?: string;
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
  disclosedBy: string;
  followUpRequired: boolean;
  followUpCompleted: boolean;
  followUpDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Scopes(() => ({
  active: {
    where: {
      deletedAt: null,
    },
    order: [['createdAt', 'DESC']],
  },
}))
@Table({
  tableName: 'phi_disclosures',
  timestamps: true,
  underscored: false,
  indexes: [
    {
      fields: ['studentId', 'disclosureDate'],
    },
    {
      fields: ['purpose', 'disclosureDate'],
    },
    {
      fields: ['studentId'],
    },
    {
      fields: ['purpose'],
    },
    {
      fields: ['disclosureDate'],
    },
    {
      fields: ['followUpDate'],
    },
    {
      fields: ['createdAt'],
      name: 'idx_phi_disclosure_created_at',
    },
    {
      fields: ['updatedAt'],
      name: 'idx_phi_disclosure_updated_at',
    },
  ],
})
export class PhiDisclosure
  extends Model<PhiDisclosureAttributes>
  implements PhiDisclosureAttributes
{
  @PrimaryKey
  @Default(() => uuidv4())
  @Column(DataType.UUID)
  declare id?: string;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  studentId: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(DisclosureType)],
    },
    allowNull: false,
  })
  disclosureType: DisclosureType;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(DisclosurePurpose)],
    },
    allowNull: false,
  })
  purpose: DisclosurePurpose;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(DisclosureMethod)],
    },
    allowNull: false,
  })
  method: DisclosureMethod;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  disclosureDate: Date;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  informationDisclosed: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  minimumNecessary: string;

  @Column({
    type: DataType.STRING(50),
    validate: {
      isIn: [Object.values(RecipientType)],
    },
    allowNull: false,
  })
  recipientType: RecipientType;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  recipientName: string;

  @AllowNull
  @Column(DataType.STRING(255))
  recipientOrganization?: string;

  @AllowNull
  @Column(DataType.TEXT)
  recipientAddress?: string;

  @AllowNull
  @Column(DataType.STRING(50))
  recipientPhone?: string;

  @AllowNull
  @Column(DataType.STRING(255))
  recipientEmail?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  authorizationObtained: boolean;

  @AllowNull
  @Column(DataType.DATE)
  authorizationDate?: Date;

  @AllowNull
  @Column(DataType.DATE)
  authorizationExpiryDate?: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  patientRequested: boolean;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  disclosedBy: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  followUpRequired: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  followUpCompleted: boolean;

  @AllowNull
  @Column(DataType.DATE)
  followUpDate?: Date;

  @AllowNull
  @Column(DataType.TEXT)
  notes?: string;

  @Column(DataType.DATE)
  declare createdAt?: Date;

  @Column(DataType.DATE)
  declare updatedAt?: Date;

  // Hooks for HIPAA compliance
  @BeforeCreate
  @BeforeUpdate
  static async auditPHIAccess(instance: PhiDisclosure) {
    await createModelAuditHook('PhiDisclosure', instance);
  }
}

// Default export for Sequelize-TypeScript
export default PhiDisclosure;
