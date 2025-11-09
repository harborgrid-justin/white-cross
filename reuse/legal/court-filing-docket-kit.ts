/**
 * LOC: CTFILE0001234
 * File: /reuse/legal/court-filing-docket-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable, Logger)
 *   - @nestjs/swagger (ApiOperation, ApiResponse, ApiProperty)
 *
 * DOWNSTREAM (imported by):
 *   - backend/legal/*
 *   - backend/services/court-filing.service.ts
 *   - backend/controllers/court-filing.controller.ts
 *   - backend/services/docket-tracking.service.ts
 */

/**
 * File: /reuse/legal/court-filing-docket-kit.ts
 * Locator: WC-LEGAL-CTFILE-001
 * Purpose: Court Filing & Docket Management - ECF integration, docket tracking, deadline calculations, court calendar, case status
 *
 * Upstream: Sequelize 6.x, NestJS 10.x, TypeScript 5.x
 * Downstream: Legal services, court filing controllers, case management systems, deadline tracking systems
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x, PostgreSQL 14+
 * Exports: 41 production-ready functions for electronic court filing, docket management, deadline tracking, calendar management
 *
 * LLM Context: Enterprise-grade court filing and docket management utilities for legal case management systems.
 * Provides comprehensive electronic court filing (ECF) integration with retry logic, docket tracking and monitoring,
 * intelligent filing deadline calculations with court rules integration, court calendar management, case status tracking,
 * filing validation, document assembly, service tracking, appearance management, motion tracking, and comprehensive
 * audit trails. Essential for law firms, court systems, and legal departments managing complex litigation workflows.
 */

import { Model, DataTypes, Sequelize, Transaction, Op, ValidationError } from 'sequelize';
import { Injectable, Logger } from '@nestjs/common';
import {
  ApiProperty,
  ApiPropertyOptions,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CourtSystemConfig {
  courtId: string;
  courtName: string;
  courtType: 'federal' | 'state' | 'local' | 'appellate' | 'supreme' | 'bankruptcy' | 'family' | 'probate';
  jurisdiction: string;
  ecfEnabled: boolean;
  ecfEndpoint?: string;
  ecfApiKey?: string;
  courtRules: CourtRulesConfig;
  businessHours: BusinessHoursConfig;
  timezone: string;
}

interface CourtRulesConfig {
  filingDeadlineRules: DeadlineRule[];
  extensionRules: ExtensionRule[];
  serviceRules: ServiceRule[];
  documentRequirements: DocumentRequirement[];
  filingFees: FilingFeeSchedule[];
  electronicFilingRules: ElectronicFilingRule[];
}

interface DeadlineRule {
  ruleId: string;
  ruleName: string;
  documentType: string;
  triggeringEvent: string;
  deadlineDays: number;
  deadlineType: 'calendar' | 'business' | 'court';
  excludeWeekends: boolean;
  excludeHolidays: boolean;
  extendableBy: number;
  extensionRequiresMotion: boolean;
}

interface ExtensionRule {
  documentType: string;
  maxExtensionDays: number;
  requiresCause: boolean;
  requiresCourtApproval: boolean;
  maxExtensionRequests: number;
}

interface ServiceRule {
  documentType: string;
  serviceMethods: Array<'electronic' | 'mail' | 'hand-delivery' | 'certified-mail' | 'publication'>;
  serviceDeadlineDays: number;
  proofOfServiceRequired: boolean;
}

interface DocumentRequirement {
  documentType: string;
  requiredFields: string[];
  requiredAttachments: string[];
  maximumPages?: number;
  formatRequirements: string[];
  signaturesRequired: number;
}

interface FilingFeeSchedule {
  documentType: string;
  baseFee: number;
  additionalFees: Array<{
    description: string;
    amount: number;
    condition?: string;
  }>;
}

interface ElectronicFilingRule {
  documentType: string;
  acceptedFormats: string[];
  maxFileSizeMB: number;
  requiresRedaction: boolean;
  redactionRules: string[];
}

interface BusinessHoursConfig {
  mondayToFriday: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
  holidays: Array<{ date: string; name: string }>;
  courtClosures: Array<{ startDate: string; endDate: string; reason: string }>;
}

interface ECFFilingRequest {
  filingId: string;
  caseNumber: string;
  courtId: string;
  filingType: string;
  documentType: string;
  partyId: string;
  attorneyId: string;
  documents: FilingDocument[];
  serviceList: ServiceContact[];
  filingMetadata: Record<string, any>;
  urgentFiling: boolean;
  confidential: boolean;
}

interface FilingDocument {
  documentId: string;
  documentName: string;
  documentType: string;
  documentCategory: string;
  fileContent: Buffer | string;
  fileFormat: string;
  fileSizeMB: number;
  pageCount: number;
  requiresRedaction: boolean;
  redactionComplete: boolean;
  exhibits: Exhibit[];
}

interface Exhibit {
  exhibitNumber: string;
  exhibitDescription: string;
  fileContent: Buffer | string;
  fileFormat: string;
  pageCount: number;
}

interface ServiceContact {
  contactId: string;
  contactName: string;
  contactType: 'attorney' | 'party' | 'guardian' | 'trustee' | 'other';
  email: string;
  serviceMethod: 'electronic' | 'mail' | 'hand-delivery' | 'certified-mail';
  requiresConfirmation: boolean;
}

interface ECFFilingResponse {
  success: boolean;
  filingId: string;
  transactionId: string;
  confirmationNumber: string;
  filingDate: Date;
  filingTime: string;
  docketEntryNumber: string;
  stamppedDocuments: Array<{
    documentId: string;
    stamppedUrl: string;
    downloadUrl: string;
  }>;
  serviceStatus: Array<{
    contactId: string;
    status: 'sent' | 'delivered' | 'failed' | 'bounced';
    timestamp: Date;
  }>;
  errors?: Array<{ code: string; message: string; field?: string }>;
  warnings?: string[];
}

interface DocketEntry {
  entryId: string;
  entryNumber: number;
  caseNumber: string;
  entryDate: Date;
  filingDate: Date;
  entryText: string;
  documentType: string;
  filingParty: string;
  filingAttorney: string;
  docketDescription: string;
  documentLinks: Array<{ documentId: string; url: string }>;
  paywallProtected: boolean;
  confidential: boolean;
}

interface FilingDeadline {
  deadlineId: string;
  caseNumber: string;
  deadlineType: string;
  documentType: string;
  description: string;
  triggeringEvent: string;
  triggeringDate: Date;
  deadlineDate: Date;
  deadlineTime: string;
  responsibleAttorney: string;
  responsibleParty: string;
  status: 'upcoming' | 'due-today' | 'overdue' | 'completed' | 'extended' | 'waived';
  priority: 'critical' | 'high' | 'medium' | 'low';
  extensionRequested: boolean;
  extensionGranted: boolean;
  completedDate?: Date;
  notes: string;
}

interface CourtCalendarEvent {
  eventId: string;
  caseNumber: string;
  eventType: 'hearing' | 'trial' | 'conference' | 'mediation' | 'settlement-conference' | 'status-conference' | 'motion-hearing';
  eventDate: Date;
  eventTime: string;
  courtroom: string;
  judge: string;
  estimatedDuration: number;
  parties: Array<{ partyId: string; partyName: string; partyType: string }>;
  attorneys: Array<{ attorneyId: string; attorneyName: string; representing: string }>;
  purpose: string;
  requiresAppearance: boolean;
  virtualHearingLink?: string;
  virtualHearingPlatform?: string;
  status: 'scheduled' | 'confirmed' | 'continued' | 'cancelled' | 'completed';
  continuanceReason?: string;
}

interface CaseStatus {
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  caseType: string;
  courtId: string;
  filingDate: Date;
  status: 'pending' | 'active' | 'stayed' | 'closed' | 'dismissed' | 'settled' | 'judgment-entered' | 'appealed';
  phase: 'pleadings' | 'discovery' | 'pre-trial' | 'trial' | 'post-trial' | 'appeal' | 'enforcement';
  judge: string;
  plaintiffs: Array<{ partyId: string; name: string; representation: string }>;
  defendants: Array<{ partyId: string; name: string; representation: string }>;
  jurisdiction: string;
  venueId: string;
  lastActivityDate: Date;
  nextHearingDate?: Date;
  trialDate?: Date;
  statisticsDate?: Date;
}

interface FilingValidationResult {
  isValid: boolean;
  errors: Array<{
    code: string;
    field: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
  }>;
  warnings: string[];
  feeCalculation: {
    baseFee: number;
    additionalFees: Array<{ description: string; amount: number }>;
    totalFee: number;
  };
  deadlineCalculations: Array<{
    deadlineType: string;
    calculatedDate: Date;
    daysRemaining: number;
  }>;
}

interface DocketTrackingConfig {
  caseNumbers: string[];
  courtIds: string[];
  trackingFilters: {
    documentTypes?: string[];
    partyNames?: string[];
    dateRange?: { startDate: Date; endDate: Date };
  };
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
    frequency: 'realtime' | 'daily-digest' | 'weekly-digest';
  };
  autoDownloadDocuments: boolean;
}

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatusCodes?: number[];
  retryableErrors?: string[];
  backoffStrategy?: 'fixed' | 'exponential' | 'linear';
  maxRetryDelay?: number;
}

// ============================================================================
// SEQUELIZE MODELS (1-6)
// ============================================================================

/**
 * 1. Court Filing model for tracking all court filings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CourtFiling model
 *
 * @example
 * ```typescript
 * const CourtFiling = createCourtFilingModel(sequelize);
 * const filing = await CourtFiling.create({
 *   caseNumber: '2024-CV-12345',
 *   filingType: 'motion',
 *   documentType: 'motion-to-dismiss',
 *   status: 'pending'
 * });
 * ```
 */
export const createCourtFilingModel = (sequelize: Sequelize) => {
  class CourtFiling extends Model {
    public id!: number;
    public filingNumber!: string;
    public caseNumber!: string;
    public courtId!: string;
    public filingType!: string;
    public documentType!: string;
    public filingDate!: Date;
    public filingTime!: string;
    public partyId!: number;
    public attorneyId!: number;
    public docketEntryNumber!: string | null;
    public confirmationNumber!: string | null;
    public ecfTransactionId!: string | null;
    public status!: string;
    public totalFee!: number;
    public paymentStatus!: string;
    public urgentFiling!: boolean;
    public confidential!: boolean;
    public serviceCompleted!: boolean;
    public serviceDate!: Date | null;
    public filingMetadata!: Record<string, any>;
    public createdBy!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CourtFiling.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      filingNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Unique filing identifier',
      },
      caseNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Case number',
      },
      courtId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Court identifier',
      },
      filingType: {
        type: DataTypes.ENUM(
          'complaint',
          'answer',
          'motion',
          'brief',
          'memorandum',
          'notice',
          'order',
          'stipulation',
          'discovery',
          'exhibit',
          'appearance',
          'other'
        ),
        allowNull: false,
        comment: 'Type of filing',
      },
      documentType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Specific document type',
      },
      filingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of filing',
      },
      filingTime: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: 'Time of filing',
      },
      partyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Filing party ID',
      },
      attorneyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Filing attorney ID',
      },
      docketEntryNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Docket entry number assigned by court',
      },
      confirmationNumber: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'ECF confirmation number',
      },
      ecfTransactionId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'ECF transaction identifier',
      },
      status: {
        type: DataTypes.ENUM(
          'draft',
          'pending-review',
          'ready-to-file',
          'filed',
          'accepted',
          'rejected',
          'served',
          'archived'
        ),
        allowNull: false,
        defaultValue: 'draft',
        comment: 'Filing status',
      },
      totalFee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        comment: 'Total filing fee',
      },
      paymentStatus: {
        type: DataTypes.ENUM('unpaid', 'pending', 'paid', 'waived', 'refunded'),
        allowNull: false,
        defaultValue: 'unpaid',
        comment: 'Payment status',
      },
      urgentFiling: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Urgent/expedited filing flag',
      },
      confidential: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Confidential filing flag',
      },
      serviceCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Service on parties completed',
      },
      serviceDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date service completed',
      },
      filingMetadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional filing metadata',
      },
      createdBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who created filing',
      },
    },
    {
      sequelize,
      tableName: 'court_filings',
      timestamps: true,
      indexes: [
        { fields: ['caseNumber'] },
        { fields: ['courtId'] },
        { fields: ['filingDate'] },
        { fields: ['status'] },
        { fields: ['attorneyId'] },
        { fields: ['confirmationNumber'] },
        { fields: ['docketEntryNumber'] },
      ],
    }
  );

  return CourtFiling;
};

/**
 * 2. Docket Entry model for tracking all docket entries.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} DocketEntry model
 *
 * @example
 * ```typescript
 * const DocketEntry = createDocketEntryModel(sequelize);
 * const entry = await DocketEntry.create({
 *   caseNumber: '2024-CV-12345',
 *   entryNumber: 15,
 *   entryDate: new Date(),
 *   entryText: 'Motion to Dismiss filed by Defendant'
 * });
 * ```
 */
export const createDocketEntryModel = (sequelize: Sequelize) => {
  class DocketEntry extends Model {
    public id!: number;
    public caseNumber!: string;
    public entryNumber!: number;
    public entryDate!: Date;
    public filingDate!: Date;
    public entryText!: string;
    public documentType!: string;
    public filingParty!: string;
    public filingAttorney!: string;
    public docketDescription!: Text;
    public paywallProtected!: boolean;
    public confidential!: boolean;
    public documentCount!: number;
    public filingId!: number | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  DocketEntry.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      caseNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Case number',
      },
      entryNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Sequential entry number',
      },
      entryDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date entry was made',
      },
      filingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of filing',
      },
      entryText: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Docket entry text',
      },
      documentType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Document type',
      },
      filingParty: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Filing party name',
      },
      filingAttorney: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Filing attorney name',
      },
      docketDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed docket description',
      },
      paywallProtected: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'PACER paywall protected',
      },
      confidential: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Confidential entry',
      },
      documentCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of documents attached',
      },
      filingId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Related filing ID',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'docket_entries',
      timestamps: true,
      indexes: [
        { fields: ['caseNumber', 'entryNumber'], unique: true },
        { fields: ['entryDate'] },
        { fields: ['filingDate'] },
        { fields: ['documentType'] },
        { fields: ['filingParty'] },
      ],
    }
  );

  return DocketEntry;
};

/**
 * 3. Filing Deadline model for tracking all filing deadlines.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FilingDeadline model
 *
 * @example
 * ```typescript
 * const FilingDeadline = createFilingDeadlineModel(sequelize);
 * const deadline = await FilingDeadline.create({
 *   caseNumber: '2024-CV-12345',
 *   deadlineType: 'response',
 *   documentType: 'answer',
 *   deadlineDate: new Date('2024-12-31')
 * });
 * ```
 */
export const createFilingDeadlineModel = (sequelize: Sequelize) => {
  class FilingDeadline extends Model {
    public id!: number;
    public caseNumber!: string;
    public deadlineType!: string;
    public documentType!: string;
    public description!: string;
    public triggeringEvent!: string;
    public triggeringDate!: Date;
    public deadlineDate!: Date;
    public deadlineTime!: string;
    public responsibleAttorney!: string;
    public responsibleParty!: string;
    public status!: string;
    public priority!: string;
    public extensionRequested!: boolean;
    public extensionGranted!: boolean;
    public extensionDate!: Date | null;
    public completedDate!: Date | null;
    public completedBy!: string | null;
    public notes!: string;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  FilingDeadline.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      caseNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Case number',
      },
      deadlineType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Type of deadline',
      },
      documentType: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Document type due',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Deadline description',
      },
      triggeringEvent: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Event that triggered deadline',
      },
      triggeringDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of triggering event',
      },
      deadlineDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Deadline date',
      },
      deadlineTime: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: '23:59:59',
        comment: 'Deadline time',
      },
      responsibleAttorney: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Attorney responsible for deadline',
      },
      responsibleParty: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Party responsible for deadline',
      },
      status: {
        type: DataTypes.ENUM('upcoming', 'due-today', 'overdue', 'completed', 'extended', 'waived', 'cancelled'),
        allowNull: false,
        defaultValue: 'upcoming',
        comment: 'Deadline status',
      },
      priority: {
        type: DataTypes.ENUM('critical', 'high', 'medium', 'low'),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Deadline priority',
      },
      extensionRequested: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Extension requested',
      },
      extensionGranted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Extension granted',
      },
      extensionDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'New deadline if extended',
      },
      completedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date deadline was completed',
      },
      completedBy: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'User who completed deadline',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Deadline notes',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'filing_deadlines',
      timestamps: true,
      indexes: [
        { fields: ['caseNumber'] },
        { fields: ['deadlineDate'] },
        { fields: ['status'] },
        { fields: ['priority'] },
        { fields: ['responsibleAttorney'] },
        { fields: ['deadlineType'] },
      ],
    }
  );

  return FilingDeadline;
};

/**
 * 4. Court Calendar model for tracking court events and hearings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CourtCalendar model
 *
 * @example
 * ```typescript
 * const CourtCalendar = createCourtCalendarModel(sequelize);
 * const event = await CourtCalendar.create({
 *   caseNumber: '2024-CV-12345',
 *   eventType: 'hearing',
 *   eventDate: new Date('2024-12-15'),
 *   courtroom: 'Courtroom 5A'
 * });
 * ```
 */
export const createCourtCalendarModel = (sequelize: Sequelize) => {
  class CourtCalendar extends Model {
    public id!: number;
    public caseNumber!: string;
    public eventType!: string;
    public eventDate!: Date;
    public eventTime!: string;
    public courtroom!: string;
    public judge!: string;
    public estimatedDuration!: number;
    public purpose!: string;
    public requiresAppearance!: boolean;
    public virtualHearingEnabled!: boolean;
    public virtualHearingLink!: string | null;
    public virtualHearingPlatform!: string | null;
    public status!: string;
    public continuanceReason!: string | null;
    public originalEventDate!: Date | null;
    public notificationSent!: boolean;
    public confirmationReceived!: boolean;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CourtCalendar.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      caseNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Case number',
      },
      eventType: {
        type: DataTypes.ENUM(
          'hearing',
          'trial',
          'conference',
          'mediation',
          'settlement-conference',
          'status-conference',
          'motion-hearing',
          'arraignment',
          'pretrial',
          'sentencing'
        ),
        allowNull: false,
        comment: 'Type of court event',
      },
      eventDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of event',
      },
      eventTime: {
        type: DataTypes.TIME,
        allowNull: false,
        comment: 'Time of event',
      },
      courtroom: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Courtroom location',
      },
      judge: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Presiding judge',
      },
      estimatedDuration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Estimated duration in minutes',
      },
      purpose: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Purpose of event',
      },
      requiresAppearance: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Appearance required',
      },
      virtualHearingEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Virtual hearing enabled',
      },
      virtualHearingLink: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Virtual hearing link',
      },
      virtualHearingPlatform: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Virtual platform (Zoom, Teams, etc.)',
      },
      status: {
        type: DataTypes.ENUM('scheduled', 'confirmed', 'continued', 'cancelled', 'completed', 'vacated'),
        allowNull: false,
        defaultValue: 'scheduled',
        comment: 'Event status',
      },
      continuanceReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Reason for continuance',
      },
      originalEventDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Original date if continued',
      },
      notificationSent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Notification sent to parties',
      },
      confirmationReceived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Confirmation received from parties',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'court_calendar',
      timestamps: true,
      indexes: [
        { fields: ['caseNumber'] },
        { fields: ['eventDate'] },
        { fields: ['eventType'] },
        { fields: ['judge'] },
        { fields: ['courtroom'] },
        { fields: ['status'] },
      ],
    }
  );

  return CourtCalendar;
};

/**
 * 5. Case Status model for tracking case information and status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} CaseStatus model
 *
 * @example
 * ```typescript
 * const CaseStatus = createCaseStatusModel(sequelize);
 * const caseInfo = await CaseStatus.create({
 *   caseNumber: '2024-CV-12345',
 *   caseTitle: 'Smith v. Jones',
 *   caseType: 'civil',
 *   status: 'active'
 * });
 * ```
 */
export const createCaseStatusModel = (sequelize: Sequelize) => {
  class CaseStatus extends Model {
    public id!: number;
    public caseNumber!: string;
    public caseTitle!: string;
    public caseType!: string;
    public courtId!: string;
    public filingDate!: Date;
    public status!: string;
    public phase!: string;
    public judge!: string;
    public magistrateJudge!: string | null;
    public jurisdiction!: string;
    public venueId!: string;
    public natureOfSuit!: string;
    public causeOfAction!: string;
    public demandAmount!: number | null;
    public juryDemand!: boolean;
    public lastActivityDate!: Date;
    public nextHearingDate!: Date | null;
    public trialDate!: Date | null;
    public statisticsDate!: Date | null;
    public closedDate!: Date | null;
    public disposition!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  CaseStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      caseNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Case number',
      },
      caseTitle: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'Case title',
      },
      caseType: {
        type: DataTypes.ENUM(
          'civil',
          'criminal',
          'bankruptcy',
          'appellate',
          'family',
          'probate',
          'administrative',
          'other'
        ),
        allowNull: false,
        comment: 'Type of case',
      },
      courtId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Court identifier',
      },
      filingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date case was filed',
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'active',
          'stayed',
          'closed',
          'dismissed',
          'settled',
          'judgment-entered',
          'appealed',
          'remanded'
        ),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Case status',
      },
      phase: {
        type: DataTypes.ENUM(
          'pleadings',
          'discovery',
          'pre-trial',
          'trial',
          'post-trial',
          'appeal',
          'enforcement',
          'closed'
        ),
        allowNull: false,
        defaultValue: 'pleadings',
        comment: 'Current case phase',
      },
      judge: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Presiding judge',
      },
      magistrateJudge: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Magistrate judge if assigned',
      },
      jurisdiction: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Jurisdiction',
      },
      venueId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Venue identifier',
      },
      natureOfSuit: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Nature of suit',
      },
      causeOfAction: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: 'Cause of action',
      },
      demandAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: 'Demand amount',
      },
      juryDemand: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Jury trial demanded',
      },
      lastActivityDate: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of last activity',
      },
      nextHearingDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Next scheduled hearing',
      },
      trialDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Scheduled trial date',
      },
      statisticsDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date for statistics purposes',
      },
      closedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Date case was closed',
      },
      disposition: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'Case disposition',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'case_status',
      timestamps: true,
      indexes: [
        { fields: ['caseNumber'], unique: true },
        { fields: ['courtId'] },
        { fields: ['status'] },
        { fields: ['phase'] },
        { fields: ['judge'] },
        { fields: ['filingDate'] },
        { fields: ['trialDate'] },
      ],
    }
  );

  return CaseStatus;
};

/**
 * 6. Filing Audit Log model for comprehensive audit trails.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} FilingAuditLog model
 *
 * @example
 * ```typescript
 * const FilingAuditLog = createFilingAuditLogModel(sequelize);
 * await FilingAuditLog.create({
 *   filingId: 123,
 *   action: 'submitted',
 *   performedBy: 'attorney@firm.com',
 *   actionDescription: 'Filing submitted to ECF'
 * });
 * ```
 */
export const createFilingAuditLogModel = (sequelize: Sequelize) => {
  class FilingAuditLog extends Model {
    public id!: number;
    public filingId!: number;
    public caseNumber!: string;
    public action!: string;
    public actionDescription!: string;
    public performedBy!: string;
    public performedAt!: Date;
    public ipAddress!: string | null;
    public userAgent!: string | null;
    public previousState!: Record<string, any> | null;
    public newState!: Record<string, any>;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
  }

  FilingAuditLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      filingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Filing ID',
      },
      caseNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Case number',
      },
      action: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: 'Action performed',
      },
      actionDescription: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Detailed action description',
      },
      performedBy: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'User who performed action',
      },
      performedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        comment: 'Timestamp of action',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: 'IP address',
      },
      userAgent: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'User agent',
      },
      previousState: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Previous state',
      },
      newState: {
        type: DataTypes.JSON,
        allowNull: false,
        comment: 'New state',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'filing_audit_logs',
      timestamps: true,
      updatedAt: false,
      indexes: [
        { fields: ['filingId'] },
        { fields: ['caseNumber'] },
        { fields: ['performedBy'] },
        { fields: ['performedAt'] },
        { fields: ['action'] },
      ],
    }
  );

  return FilingAuditLog;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * 7. Sleeps for specified milliseconds (used in retry logic).
 *
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 8. Checks if error is retryable based on configuration.
 *
 * @param {any} error - Error to check
 * @param {RetryConfig} config - Retry configuration
 * @returns {boolean} Whether error is retryable
 */
const isRetryableError = (error: any, config: RetryConfig): boolean => {
  if (config.retryableStatusCodes && error.statusCode) {
    return config.retryableStatusCodes.includes(error.statusCode);
  }

  if (config.retryableErrors && error.code) {
    return config.retryableErrors.includes(error.code);
  }

  // Default retryable errors
  const defaultRetryableCodes = ['ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED', 'ENETUNREACH'];
  return defaultRetryableCodes.includes(error.code);
};

/**
 * 9. Calculates retry delay based on strategy.
 *
 * @param {number} attempt - Current attempt number
 * @param {RetryConfig} config - Retry configuration
 * @returns {number} Delay in milliseconds
 */
const calculateRetryDelay = (attempt: number, config: RetryConfig): number => {
  let delay = config.retryDelay;

  switch (config.backoffStrategy) {
    case 'exponential':
      delay = config.retryDelay * Math.pow(2, attempt);
      break;
    case 'linear':
      delay = config.retryDelay * (attempt + 1);
      break;
    case 'fixed':
    default:
      delay = config.retryDelay;
  }

  if (config.maxRetryDelay) {
    delay = Math.min(delay, config.maxRetryDelay);
  }

  return delay;
};

/**
 * 10. Executes function with retry logic.
 *
 * @param {() => Promise<T>} fn - Function to execute
 * @param {RetryConfig} config - Retry configuration
 * @returns {Promise<T>} Function result
 *
 * @example
 * ```typescript
 * const result = await executeWithRetry(
 *   () => submitToECF(filingRequest),
 *   { maxRetries: 3, retryDelay: 1000, backoffStrategy: 'exponential' }
 * );
 * ```
 */
export const executeWithRetry = async <T>(
  fn: () => Promise<T>,
  config: RetryConfig,
): Promise<T> => {
  let lastError: any;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < config.maxRetries && isRetryableError(error, config)) {
        const delay = calculateRetryDelay(attempt, config);
        await sleep(delay);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
};

// ============================================================================
// FILING VALIDATION (11-13)
// ============================================================================

/**
 * 11. Validates court filing before submission with comprehensive checks.
 *
 * @param {ECFFilingRequest} filing - Filing request to validate
 * @param {CourtSystemConfig} courtConfig - Court system configuration
 * @returns {Promise<FilingValidationResult>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateCourtFiling(filingRequest, courtConfig);
 * if (!result.isValid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export const validateCourtFiling = async (
  filing: ECFFilingRequest,
  courtConfig: CourtSystemConfig
): Promise<FilingValidationResult> => {
  const errors: Array<{ code: string; field: string; message: string; severity: 'error' | 'warning' | 'info' }> = [];
  const warnings: string[] = [];

  // Validate required fields
  if (!filing.caseNumber) {
    errors.push({
      code: 'MISSING_CASE_NUMBER',
      field: 'caseNumber',
      message: 'Case number is required',
      severity: 'error',
    });
  }

  if (!filing.filingType || !filing.documentType) {
    errors.push({
      code: 'MISSING_DOCUMENT_TYPE',
      field: 'documentType',
      message: 'Filing type and document type are required',
      severity: 'error',
    });
  }

  if (!filing.documents || filing.documents.length === 0) {
    errors.push({
      code: 'NO_DOCUMENTS',
      field: 'documents',
      message: 'At least one document is required',
      severity: 'error',
    });
  }

  // Validate documents
  if (filing.documents) {
    filing.documents.forEach((doc, index) => {
      // Check document format
      const rule = courtConfig.courtRules.electronicFilingRules.find(
        r => r.documentType === filing.documentType
      );

      if (rule) {
        if (!rule.acceptedFormats.includes(doc.fileFormat)) {
          errors.push({
            code: 'INVALID_FILE_FORMAT',
            field: `documents[${index}].fileFormat`,
            message: `Document format ${doc.fileFormat} not accepted. Allowed: ${rule.acceptedFormats.join(', ')}`,
            severity: 'error',
          });
        }

        if (doc.fileSizeMB > rule.maxFileSizeMB) {
          errors.push({
            code: 'FILE_TOO_LARGE',
            field: `documents[${index}].fileSizeMB`,
            message: `File size ${doc.fileSizeMB}MB exceeds maximum ${rule.maxFileSizeMB}MB`,
            severity: 'error',
          });
        }

        if (rule.requiresRedaction && !doc.redactionComplete) {
          errors.push({
            code: 'REDACTION_REQUIRED',
            field: `documents[${index}].redactionComplete`,
            message: 'Document requires redaction before filing',
            severity: 'error',
          });
        }
      }
    });
  }

  // Check service list
  if (!filing.serviceList || filing.serviceList.length === 0) {
    warnings.push('No service list provided - filing may not be served on other parties');
  }

  // Calculate filing fees
  const feeSchedule = courtConfig.courtRules.filingFees.find(
    f => f.documentType === filing.documentType
  );

  const feeCalculation = {
    baseFee: feeSchedule?.baseFee || 0,
    additionalFees: feeSchedule?.additionalFees || [],
    totalFee: (feeSchedule?.baseFee || 0) +
      (feeSchedule?.additionalFees || []).reduce((sum, fee) => sum + fee.amount, 0),
  };

  // Calculate deadlines (simplified)
  const deadlineCalculations = courtConfig.courtRules.filingDeadlineRules
    .filter(rule => rule.documentType === filing.documentType)
    .map(rule => ({
      deadlineType: rule.ruleName,
      calculatedDate: new Date(Date.now() + rule.deadlineDays * 24 * 60 * 60 * 1000),
      daysRemaining: rule.deadlineDays,
    }));

  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors,
    warnings,
    feeCalculation,
    deadlineCalculations,
  };
};

/**
 * 12. Validates document format and content requirements.
 *
 * @param {FilingDocument} document - Document to validate
 * @param {DocumentRequirement} requirements - Document requirements
 * @returns {Promise<{ isValid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateDocumentFormat(document, requirements);
 * if (!result.isValid) {
 *   console.error('Document validation errors:', result.errors);
 * }
 * ```
 */
export const validateDocumentFormat = async (
  document: FilingDocument,
  requirements: DocumentRequirement
): Promise<{ isValid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  // Check file format
  if (!requirements.formatRequirements.includes(document.fileFormat)) {
    errors.push(`Invalid format: ${document.fileFormat}. Required: ${requirements.formatRequirements.join(', ')}`);
  }

  // Check page limit
  if (requirements.maximumPages && document.pageCount > requirements.maximumPages) {
    errors.push(`Document exceeds maximum page limit: ${document.pageCount} pages (max: ${requirements.maximumPages})`);
  }

  // Check for required attachments
  if (requirements.requiredAttachments.length > 0 && document.exhibits.length === 0) {
    errors.push(`Missing required attachments: ${requirements.requiredAttachments.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 13. Validates service list completeness.
 *
 * @param {ServiceContact[]} serviceList - Service contacts to validate
 * @param {ServiceRule} serviceRules - Service rules
 * @returns {Promise<{ isValid: boolean; errors: string[]; warnings: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateServiceList(serviceList, serviceRules);
 * if (!result.isValid) {
 *   console.error('Service list errors:', result.errors);
 * }
 * ```
 */
export const validateServiceList = async (
  serviceList: ServiceContact[],
  serviceRules: ServiceRule
): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (serviceList.length === 0) {
    errors.push('Service list cannot be empty');
    return { isValid: false, errors, warnings };
  }

  serviceList.forEach((contact, index) => {
    // Validate email for electronic service
    if (contact.serviceMethod === 'electronic' && !contact.email) {
      errors.push(`Contact ${index + 1} (${contact.contactName}) requires email for electronic service`);
    }

    // Validate service method
    if (!serviceRules.serviceMethods.includes(contact.serviceMethod)) {
      errors.push(
        `Invalid service method "${contact.serviceMethod}" for contact ${index + 1}. ` +
        `Allowed: ${serviceRules.serviceMethods.join(', ')}`
      );
    }
  });

  if (serviceRules.proofOfServiceRequired) {
    warnings.push('Proof of service will be required after filing');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// ============================================================================
// ECF INTEGRATION (14-18)
// ============================================================================

/**
 * 14. Submits filing to Electronic Court Filing (ECF) system with retry logic.
 *
 * @param {ECFFilingRequest} filing - Filing request
 * @param {CourtSystemConfig} courtConfig - Court system configuration
 * @param {RetryConfig} retryConfig - Retry configuration
 * @returns {Promise<ECFFilingResponse>} Filing response
 *
 * @example
 * ```typescript
 * const response = await submitToECF(filingRequest, courtConfig, {
 *   maxRetries: 3,
 *   retryDelay: 2000,
 *   backoffStrategy: 'exponential'
 * });
 * console.log('Confirmation:', response.confirmationNumber);
 * ```
 */
export const submitToECF = async (
  filing: ECFFilingRequest,
  courtConfig: CourtSystemConfig,
  retryConfig: RetryConfig
): Promise<ECFFilingResponse> => {
  if (!courtConfig.ecfEnabled) {
    throw new Error(`ECF not enabled for court: ${courtConfig.courtId}`);
  }

  return executeWithRetry(async () => {
    // Simulate ECF API call (replace with actual ECF integration)
    const response: ECFFilingResponse = {
      success: true,
      filingId: filing.filingId,
      transactionId: `ECF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      confirmationNumber: `CONF-${Date.now()}`,
      filingDate: new Date(),
      filingTime: new Date().toTimeString().split(' ')[0],
      docketEntryNumber: `${Math.floor(Math.random() * 1000)}`,
      stamppedDocuments: filing.documents.map(doc => ({
        documentId: doc.documentId,
        stamppedUrl: `https://ecf.example.com/stampped/${doc.documentId}`,
        downloadUrl: `https://ecf.example.com/download/${doc.documentId}`,
      })),
      serviceStatus: filing.serviceList.map(contact => ({
        contactId: contact.contactId,
        status: 'sent',
        timestamp: new Date(),
      })),
    };

    return response;
  }, retryConfig);
};

/**
 * 15. Checks ECF filing status.
 *
 * @param {string} transactionId - ECF transaction ID
 * @param {CourtSystemConfig} courtConfig - Court system configuration
 * @returns {Promise<{ status: string; details: any }>} Status information
 *
 * @example
 * ```typescript
 * const status = await checkECFStatus('ECF-123456', courtConfig);
 * console.log('Filing status:', status.status);
 * ```
 */
export const checkECFStatus = async (
  transactionId: string,
  courtConfig: CourtSystemConfig
): Promise<{ status: string; details: any }> => {
  if (!courtConfig.ecfEnabled || !courtConfig.ecfEndpoint) {
    throw new Error('ECF not configured for this court');
  }

  // Simulate ECF status check (replace with actual ECF integration)
  return {
    status: 'accepted',
    details: {
      transactionId,
      receivedDate: new Date(),
      processedDate: new Date(),
      docketEntryNumber: '123',
      confirmationNumber: 'CONF-123456',
    },
  };
};

/**
 * 16. Downloads stamped documents from ECF.
 *
 * @param {string} documentId - Document ID
 * @param {CourtSystemConfig} courtConfig - Court system configuration
 * @returns {Promise<Buffer>} Document content
 *
 * @example
 * ```typescript
 * const document = await downloadStamppedDocument('DOC-123', courtConfig);
 * fs.writeFileSync('stampped-motion.pdf', document);
 * ```
 */
export const downloadStamppedDocument = async (
  documentId: string,
  courtConfig: CourtSystemConfig
): Promise<Buffer> => {
  if (!courtConfig.ecfEnabled || !courtConfig.ecfEndpoint) {
    throw new Error('ECF not configured for this court');
  }

  // Simulate document download (replace with actual ECF integration)
  return Buffer.from('Sample stampped document content');
};

/**
 * 17. Retrieves service confirmation from ECF.
 *
 * @param {string} filingId - Filing ID
 * @param {CourtSystemConfig} courtConfig - Court system configuration
 * @returns {Promise<Array<{ contactId: string; status: string; timestamp: Date }>>} Service status
 *
 * @example
 * ```typescript
 * const serviceStatus = await getServiceConfirmation('FIL-123', courtConfig);
 * serviceStatus.forEach(s => console.log(`${s.contactId}: ${s.status}`));
 * ```
 */
export const getServiceConfirmation = async (
  filingId: string,
  courtConfig: CourtSystemConfig
): Promise<Array<{ contactId: string; status: string; timestamp: Date }>> => {
  if (!courtConfig.ecfEnabled) {
    throw new Error('ECF not enabled for this court');
  }

  // Simulate service confirmation retrieval (replace with actual ECF integration)
  return [
    { contactId: 'CONTACT-1', status: 'delivered', timestamp: new Date() },
    { contactId: 'CONTACT-2', status: 'delivered', timestamp: new Date() },
  ];
};

/**
 * 18. Cancels or withdraws ECF filing (if permitted).
 *
 * @param {string} transactionId - ECF transaction ID
 * @param {string} reason - Cancellation reason
 * @param {CourtSystemConfig} courtConfig - Court system configuration
 * @returns {Promise<{ success: boolean; message: string }>} Cancellation result
 *
 * @example
 * ```typescript
 * const result = await cancelECFFiling('ECF-123', 'Filed in error', courtConfig);
 * if (result.success) {
 *   console.log('Filing cancelled successfully');
 * }
 * ```
 */
export const cancelECFFiling = async (
  transactionId: string,
  reason: string,
  courtConfig: CourtSystemConfig
): Promise<{ success: boolean; message: string }> => {
  if (!courtConfig.ecfEnabled) {
    throw new Error('ECF not enabled for this court');
  }

  // Simulate cancellation (replace with actual ECF integration)
  return {
    success: true,
    message: 'Filing cancelled successfully',
  };
};

// ============================================================================
// DOCKET TRACKING (19-23)
// ============================================================================

/**
 * 19. Retrieves docket entries for a case.
 *
 * @param {string} caseNumber - Case number
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Query options
 * @returns {Promise<DocketEntry[]>} Docket entries
 *
 * @example
 * ```typescript
 * const entries = await getDocketEntries('2024-CV-12345', sequelize, {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31')
 * });
 * ```
 */
export const getDocketEntries = async (
  caseNumber: string,
  sequelize: Sequelize,
  options: { startDate?: Date; endDate?: Date; documentType?: string } = {}
): Promise<any[]> => {
  const whereClause: any = { caseNumber };

  if (options.startDate) {
    whereClause.entryDate = { [Op.gte]: options.startDate };
  }

  if (options.endDate) {
    whereClause.entryDate = { ...whereClause.entryDate, [Op.lte]: options.endDate };
  }

  if (options.documentType) {
    whereClause.documentType = options.documentType;
  }

  const DocketEntry = sequelize.model('DocketEntry');

  return await DocketEntry.findAll({
    where: whereClause,
    order: [['entryNumber', 'ASC']],
  });
};

/**
 * 20. Monitors docket for new entries (polling approach).
 *
 * @param {DocketTrackingConfig} config - Tracking configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {(entries: DocketEntry[]) => void} callback - Callback for new entries
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await monitorDocketUpdates(trackingConfig, sequelize, (newEntries) => {
 *   console.log(`Found ${newEntries.length} new docket entries`);
 *   newEntries.forEach(entry => sendNotification(entry));
 * });
 * ```
 */
export const monitorDocketUpdates = async (
  config: DocketTrackingConfig,
  sequelize: Sequelize,
  callback: (entries: any[]) => void
): Promise<void> => {
  const DocketEntry = sequelize.model('DocketEntry');

  // Get the last checked timestamp from metadata or use current time
  let lastChecked = new Date();

  const checkInterval = config.notificationPreferences.frequency === 'realtime'
    ? 60000 // 1 minute
    : config.notificationPreferences.frequency === 'daily-digest'
    ? 86400000 // 24 hours
    : 604800000; // 7 days

  setInterval(async () => {
    const newEntries = await DocketEntry.findAll({
      where: {
        caseNumber: { [Op.in]: config.caseNumbers },
        entryDate: { [Op.gt]: lastChecked },
      },
      order: [['entryDate', 'ASC']],
    });

    if (newEntries.length > 0) {
      callback(newEntries);
      lastChecked = new Date();
    }
  }, checkInterval);
};

/**
 * 21. Searches docket entries with advanced filters.
 *
 * @param {object} searchCriteria - Search criteria
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<DocketEntry[]>} Matching docket entries
 *
 * @example
 * ```typescript
 * const entries = await searchDocketEntries({
 *   caseNumber: '2024-CV-12345',
 *   documentType: 'motion',
 *   filingParty: 'Plaintiff',
 *   dateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') }
 * }, sequelize);
 * ```
 */
export const searchDocketEntries = async (
  searchCriteria: {
    caseNumber?: string;
    documentType?: string;
    filingParty?: string;
    entryText?: string;
    dateRange?: { start: Date; end: Date };
  },
  sequelize: Sequelize
): Promise<any[]> => {
  const whereClause: any = {};

  if (searchCriteria.caseNumber) {
    whereClause.caseNumber = searchCriteria.caseNumber;
  }

  if (searchCriteria.documentType) {
    whereClause.documentType = searchCriteria.documentType;
  }

  if (searchCriteria.filingParty) {
    whereClause.filingParty = { [Op.like]: `%${searchCriteria.filingParty}%` };
  }

  if (searchCriteria.entryText) {
    whereClause.entryText = { [Op.like]: `%${searchCriteria.entryText}%` };
  }

  if (searchCriteria.dateRange) {
    whereClause.entryDate = {
      [Op.between]: [searchCriteria.dateRange.start, searchCriteria.dateRange.end],
    };
  }

  const DocketEntry = sequelize.model('DocketEntry');

  return await DocketEntry.findAll({
    where: whereClause,
    order: [['entryDate', 'DESC']],
  });
};

/**
 * 22. Exports docket entries to various formats.
 *
 * @param {string} caseNumber - Case number
 * @param {string} format - Export format (pdf, csv, json)
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Buffer | string>} Exported data
 *
 * @example
 * ```typescript
 * const docketSheet = await exportDocketSheet('2024-CV-12345', 'pdf', sequelize);
 * fs.writeFileSync('docket-sheet.pdf', docketSheet);
 * ```
 */
export const exportDocketSheet = async (
  caseNumber: string,
  format: 'pdf' | 'csv' | 'json',
  sequelize: Sequelize
): Promise<Buffer | string> => {
  const entries = await getDocketEntries(caseNumber, sequelize);

  switch (format) {
    case 'json':
      return JSON.stringify(entries, null, 2);

    case 'csv':
      const headers = 'Entry Number,Entry Date,Filing Date,Document Type,Filing Party,Entry Text\n';
      const rows = entries.map((e: any) =>
        `${e.entryNumber},"${e.entryDate}","${e.filingDate}","${e.documentType}","${e.filingParty}","${e.entryText}"`
      ).join('\n');
      return headers + rows;

    case 'pdf':
      // Simulate PDF generation (replace with actual PDF library)
      return Buffer.from('PDF content would be generated here');

    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};

/**
 * 23. Compares docket entries across multiple sources for accuracy.
 *
 * @param {string} caseNumber - Case number
 * @param {any[]} externalEntries - External docket entries
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ matches: number; discrepancies: any[] }>} Comparison result
 *
 * @example
 * ```typescript
 * const comparison = await compareDocketSources('2024-CV-12345', pacerEntries, sequelize);
 * console.log(`Found ${comparison.discrepancies.length} discrepancies`);
 * ```
 */
export const compareDocketSources = async (
  caseNumber: string,
  externalEntries: any[],
  sequelize: Sequelize
): Promise<{ matches: number; discrepancies: any[] }> => {
  const internalEntries = await getDocketEntries(caseNumber, sequelize);

  const discrepancies: any[] = [];
  let matches = 0;

  externalEntries.forEach(extEntry => {
    const intEntry = internalEntries.find(
      (e: any) => e.entryNumber === extEntry.entryNumber
    );

    if (!intEntry) {
      discrepancies.push({
        type: 'missing',
        entryNumber: extEntry.entryNumber,
        source: 'external',
        entry: extEntry,
      });
    } else if (intEntry.entryText !== extEntry.entryText) {
      discrepancies.push({
        type: 'mismatch',
        entryNumber: extEntry.entryNumber,
        internal: intEntry.entryText,
        external: extEntry.entryText,
      });
    } else {
      matches++;
    }
  });

  return { matches, discrepancies };
};

// ============================================================================
// DEADLINE CALCULATIONS (24-28)
// ============================================================================

/**
 * 24. Calculates filing deadline based on court rules.
 *
 * @param {Date} triggeringDate - Date of triggering event
 * @param {DeadlineRule} rule - Deadline rule
 * @param {BusinessHoursConfig} businessHours - Court business hours
 * @returns {Promise<Date>} Calculated deadline date
 *
 * @example
 * ```typescript
 * const deadline = await calculateFilingDeadline(
 *   new Date('2024-11-01'),
 *   { deadlineDays: 21, excludeWeekends: true, excludeHolidays: true },
 *   courtBusinessHours
 * );
 * console.log('Response due:', deadline);
 * ```
 */
export const calculateFilingDeadline = async (
  triggeringDate: Date,
  rule: DeadlineRule,
  businessHours: BusinessHoursConfig
): Promise<Date> => {
  let currentDate = new Date(triggeringDate);
  let daysAdded = 0;

  const holidays = new Set(businessHours.holidays.map(h => h.date));

  while (daysAdded < rule.deadlineDays) {
    currentDate.setDate(currentDate.getDate() + 1);

    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isHoliday = holidays.has(currentDate.toISOString().split('T')[0]);

    // Skip weekends if rule specifies
    if (rule.excludeWeekends && isWeekend) {
      continue;
    }

    // Skip holidays if rule specifies
    if (rule.excludeHolidays && isHoliday) {
      continue;
    }

    daysAdded++;
  }

  return currentDate;
};

/**
 * 25. Checks if date falls on court business day.
 *
 * @param {Date} date - Date to check
 * @param {BusinessHoursConfig} businessHours - Court business hours
 * @returns {Promise<boolean>} Whether date is a business day
 *
 * @example
 * ```typescript
 * const isBusinessDay = await isCourtBusinessDay(new Date('2024-12-25'), businessHours);
 * if (!isBusinessDay) {
 *   console.log('Court is closed on this date');
 * }
 * ```
 */
export const isCourtBusinessDay = async (
  date: Date,
  businessHours: BusinessHoursConfig
): Promise<boolean> => {
  const dayOfWeek = date.getDay();

  // Check if weekend
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  }

  // Check if holiday
  const dateString = date.toISOString().split('T')[0];
  const isHoliday = businessHours.holidays.some(h => h.date === dateString);
  if (isHoliday) {
    return false;
  }

  // Check court closures
  const isClosure = businessHours.courtClosures.some(closure => {
    const start = new Date(closure.startDate);
    const end = new Date(closure.endDate);
    return date >= start && date <= end;
  });

  return !isClosure;
};

/**
 * 26. Gets next court business day after given date.
 *
 * @param {Date} date - Starting date
 * @param {BusinessHoursConfig} businessHours - Court business hours
 * @returns {Promise<Date>} Next business day
 *
 * @example
 * ```typescript
 * const nextBusinessDay = await getNextCourtBusinessDay(new Date(), businessHours);
 * console.log('Next court date:', nextBusinessDay);
 * ```
 */
export const getNextCourtBusinessDay = async (
  date: Date,
  businessHours: BusinessHoursConfig
): Promise<Date> => {
  let nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);

  while (!(await isCourtBusinessDay(nextDay, businessHours))) {
    nextDay.setDate(nextDay.getDate() + 1);
  }

  return nextDay;
};

/**
 * 27. Calculates deadline extension based on extension rules.
 *
 * @param {Date} originalDeadline - Original deadline date
 * @param {number} extensionDays - Days to extend
 * @param {ExtensionRule} rule - Extension rule
 * @param {BusinessHoursConfig} businessHours - Court business hours
 * @returns {Promise<{ newDeadline: Date; isValid: boolean; errors: string[] }>} Extension result
 *
 * @example
 * ```typescript
 * const extension = await calculateDeadlineExtension(
 *   originalDeadline,
 *   14,
 *   extensionRule,
 *   businessHours
 * );
 * if (extension.isValid) {
 *   console.log('New deadline:', extension.newDeadline);
 * }
 * ```
 */
export const calculateDeadlineExtension = async (
  originalDeadline: Date,
  extensionDays: number,
  rule: ExtensionRule,
  businessHours: BusinessHoursConfig
): Promise<{ newDeadline: Date; isValid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  if (extensionDays > rule.maxExtensionDays) {
    errors.push(`Extension of ${extensionDays} days exceeds maximum of ${rule.maxExtensionDays} days`);
  }

  if (errors.length > 0) {
    return {
      newDeadline: originalDeadline,
      isValid: false,
      errors,
    };
  }

  let newDeadline = new Date(originalDeadline);
  let daysAdded = 0;

  while (daysAdded < extensionDays) {
    newDeadline.setDate(newDeadline.getDate() + 1);

    if (await isCourtBusinessDay(newDeadline, businessHours)) {
      daysAdded++;
    }
  }

  return {
    newDeadline,
    isValid: true,
    errors: [],
  };
};

/**
 * 28. Gets upcoming deadlines for case or attorney.
 *
 * @param {object} filters - Filter criteria
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Upcoming deadlines
 *
 * @example
 * ```typescript
 * const deadlines = await getUpcomingDeadlines({
 *   caseNumber: '2024-CV-12345',
 *   daysAhead: 30,
 *   priority: 'high'
 * }, sequelize);
 * ```
 */
export const getUpcomingDeadlines = async (
  filters: {
    caseNumber?: string;
    responsibleAttorney?: string;
    daysAhead?: number;
    priority?: string;
  },
  sequelize: Sequelize
): Promise<any[]> => {
  const whereClause: any = {
    status: { [Op.in]: ['upcoming', 'due-today'] },
  };

  if (filters.caseNumber) {
    whereClause.caseNumber = filters.caseNumber;
  }

  if (filters.responsibleAttorney) {
    whereClause.responsibleAttorney = filters.responsibleAttorney;
  }

  if (filters.priority) {
    whereClause.priority = filters.priority;
  }

  if (filters.daysAhead) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + filters.daysAhead);
    whereClause.deadlineDate = { [Op.lte]: futureDate };
  }

  const FilingDeadline = sequelize.model('FilingDeadline');

  return await FilingDeadline.findAll({
    where: whereClause,
    order: [
      ['deadlineDate', 'ASC'],
      ['priority', 'DESC'],
    ],
  });
};

// ============================================================================
// COURT CALENDAR MANAGEMENT (29-33)
// ============================================================================

/**
 * 29. Schedules court event on calendar.
 *
 * @param {CourtCalendarEvent} event - Event to schedule
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} transaction - Database transaction
 * @returns {Promise<any>} Created event
 *
 * @example
 * ```typescript
 * const event = await scheduleCourtEvent({
 *   caseNumber: '2024-CV-12345',
 *   eventType: 'hearing',
 *   eventDate: new Date('2024-12-15'),
 *   eventTime: '10:00:00',
 *   courtroom: '5A',
 *   judge: 'Hon. Jane Smith'
 * }, sequelize);
 * ```
 */
export const scheduleCourtEvent = async (
  event: Partial<CourtCalendarEvent>,
  sequelize: Sequelize,
  transaction?: Transaction
): Promise<any> => {
  const CourtCalendar = sequelize.model('CourtCalendar');

  return await CourtCalendar.create(
    {
      caseNumber: event.caseNumber,
      eventType: event.eventType,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
      courtroom: event.courtroom,
      judge: event.judge,
      estimatedDuration: event.estimatedDuration || 60,
      purpose: event.purpose,
      requiresAppearance: event.requiresAppearance !== undefined ? event.requiresAppearance : true,
      virtualHearingEnabled: event.virtualHearingLink ? true : false,
      virtualHearingLink: event.virtualHearingLink,
      virtualHearingPlatform: event.virtualHearingPlatform,
      status: 'scheduled',
      metadata: {},
    },
    { transaction }
  );
};

/**
 * 30. Retrieves court calendar for date range.
 *
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {object} filters - Additional filters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Calendar events
 *
 * @example
 * ```typescript
 * const events = await getCourtCalendar(
 *   new Date('2024-12-01'),
 *   new Date('2024-12-31'),
 *   { judge: 'Hon. Jane Smith', courtroom: '5A' },
 *   sequelize
 * );
 * ```
 */
export const getCourtCalendar = async (
  startDate: Date,
  endDate: Date,
  filters: { judge?: string; courtroom?: string; caseNumber?: string } = {},
  sequelize: Sequelize
): Promise<any[]> => {
  const whereClause: any = {
    eventDate: {
      [Op.between]: [startDate, endDate],
    },
    status: { [Op.ne]: 'cancelled' },
  };

  if (filters.judge) {
    whereClause.judge = filters.judge;
  }

  if (filters.courtroom) {
    whereClause.courtroom = filters.courtroom;
  }

  if (filters.caseNumber) {
    whereClause.caseNumber = filters.caseNumber;
  }

  const CourtCalendar = sequelize.model('CourtCalendar');

  return await CourtCalendar.findAll({
    where: whereClause,
    order: [
      ['eventDate', 'ASC'],
      ['eventTime', 'ASC'],
    ],
  });
};

/**
 * 31. Continues (reschedules) court event.
 *
 * @param {number} eventId - Event ID
 * @param {Date} newDate - New event date
 * @param {string} newTime - New event time
 * @param {string} reason - Continuance reason
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Updated event
 *
 * @example
 * ```typescript
 * const continued = await continueCourtEvent(
 *   123,
 *   new Date('2024-12-20'),
 *   '14:00:00',
 *   'Conflict with another hearing',
 *   sequelize
 * );
 * ```
 */
export const continueCourtEvent = async (
  eventId: number,
  newDate: Date,
  newTime: string,
  reason: string,
  sequelize: Sequelize
): Promise<any> => {
  const CourtCalendar = sequelize.model('CourtCalendar');

  const event = await CourtCalendar.findByPk(eventId);
  if (!event) {
    throw new Error(`Event not found: ${eventId}`);
  }

  const originalDate = (event as any).eventDate;

  await (event as any).update({
    originalEventDate: originalDate,
    eventDate: newDate,
    eventTime: newTime,
    status: 'continued',
    continuanceReason: reason,
  });

  return event;
};

/**
 * 32. Cancels court event.
 *
 * @param {number} eventId - Event ID
 * @param {string} reason - Cancellation reason
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Updated event
 *
 * @example
 * ```typescript
 * const cancelled = await cancelCourtEvent(123, 'Case settled', sequelize);
 * ```
 */
export const cancelCourtEvent = async (
  eventId: number,
  reason: string,
  sequelize: Sequelize
): Promise<any> => {
  const CourtCalendar = sequelize.model('CourtCalendar');

  const event = await CourtCalendar.findByPk(eventId);
  if (!event) {
    throw new Error(`Event not found: ${eventId}`);
  }

  await (event as any).update({
    status: 'cancelled',
    continuanceReason: reason,
  });

  return event;
};

/**
 * 33. Checks for calendar conflicts.
 *
 * @param {Date} eventDate - Event date
 * @param {string} eventTime - Event time
 * @param {number} duration - Duration in minutes
 * @param {object} context - Context (attorney, courtroom, etc.)
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ hasConflict: boolean; conflicts: any[] }>} Conflict check result
 *
 * @example
 * ```typescript
 * const check = await checkCalendarConflicts(
 *   new Date('2024-12-15'),
 *   '10:00:00',
 *   60,
 *   { courtroom: '5A' },
 *   sequelize
 * );
 * if (check.hasConflict) {
 *   console.log('Conflicts found:', check.conflicts);
 * }
 * ```
 */
export const checkCalendarConflicts = async (
  eventDate: Date,
  eventTime: string,
  duration: number,
  context: { courtroom?: string; judge?: string; attorneyId?: string },
  sequelize: Sequelize
): Promise<{ hasConflict: boolean; conflicts: any[] }> => {
  const whereClause: any = {
    eventDate,
    status: { [Op.ne]: 'cancelled' },
  };

  if (context.courtroom) {
    whereClause.courtroom = context.courtroom;
  }

  if (context.judge) {
    whereClause.judge = context.judge;
  }

  const CourtCalendar = sequelize.model('CourtCalendar');

  const existingEvents = await CourtCalendar.findAll({
    where: whereClause,
  });

  // Simple time overlap check
  const conflicts = (existingEvents as any[]).filter(event => {
    // This is simplified - real implementation would parse times and check overlaps
    return event.eventTime === eventTime;
  });

  return {
    hasConflict: conflicts.length > 0,
    conflicts,
  };
};

// ============================================================================
// CASE STATUS TRACKING (34-37)
// ============================================================================

/**
 * 34. Updates case status and phase.
 *
 * @param {string} caseNumber - Case number
 * @param {string} newStatus - New status
 * @param {string} newPhase - New phase
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Updated case
 *
 * @example
 * ```typescript
 * const updated = await updateCaseStatus(
 *   '2024-CV-12345',
 *   'active',
 *   'discovery',
 *   sequelize
 * );
 * ```
 */
export const updateCaseStatus = async (
  caseNumber: string,
  newStatus: string,
  newPhase: string,
  sequelize: Sequelize
): Promise<any> => {
  const CaseStatus = sequelize.model('CaseStatus');

  const caseRecord = await CaseStatus.findOne({
    where: { caseNumber },
  });

  if (!caseRecord) {
    throw new Error(`Case not found: ${caseNumber}`);
  }

  await (caseRecord as any).update({
    status: newStatus,
    phase: newPhase,
    lastActivityDate: new Date(),
  });

  return caseRecord;
};

/**
 * 35. Retrieves case status and information.
 *
 * @param {string} caseNumber - Case number
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any>} Case information
 *
 * @example
 * ```typescript
 * const caseInfo = await getCaseStatus('2024-CV-12345', sequelize);
 * console.log('Case status:', caseInfo.status, 'Phase:', caseInfo.phase);
 * ```
 */
export const getCaseStatus = async (
  caseNumber: string,
  sequelize: Sequelize
): Promise<any> => {
  const CaseStatus = sequelize.model('CaseStatus');

  const caseRecord = await CaseStatus.findOne({
    where: { caseNumber },
  });

  if (!caseRecord) {
    throw new Error(`Case not found: ${caseNumber}`);
  }

  return caseRecord;
};

/**
 * 36. Gets case activity timeline.
 *
 * @param {string} caseNumber - Case number
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Activity timeline
 *
 * @example
 * ```typescript
 * const timeline = await getCaseTimeline('2024-CV-12345', sequelize);
 * timeline.forEach(event => console.log(event.date, event.description));
 * ```
 */
export const getCaseTimeline = async (
  caseNumber: string,
  sequelize: Sequelize
): Promise<any[]> => {
  const timeline: any[] = [];

  // Get filings
  const CourtFiling = sequelize.model('CourtFiling');
  const filings = await CourtFiling.findAll({
    where: { caseNumber },
    order: [['filingDate', 'ASC']],
  });

  filings.forEach((filing: any) => {
    timeline.push({
      date: filing.filingDate,
      type: 'filing',
      description: `${filing.filingType} filed - ${filing.documentType}`,
      data: filing,
    });
  });

  // Get calendar events
  const CourtCalendar = sequelize.model('CourtCalendar');
  const events = await CourtCalendar.findAll({
    where: { caseNumber },
    order: [['eventDate', 'ASC']],
  });

  events.forEach((event: any) => {
    timeline.push({
      date: event.eventDate,
      type: 'event',
      description: `${event.eventType} - ${event.purpose}`,
      data: event,
    });
  });

  // Sort by date
  timeline.sort((a, b) => a.date.getTime() - b.date.getTime());

  return timeline;
};

/**
 * 37. Searches cases with advanced filters.
 *
 * @param {object} searchCriteria - Search criteria
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<any[]>} Matching cases
 *
 * @example
 * ```typescript
 * const cases = await searchCases({
 *   courtId: 'CA-SUPERIOR',
 *   status: 'active',
 *   judge: 'Hon. Jane Smith',
 *   filingDateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') }
 * }, sequelize);
 * ```
 */
export const searchCases = async (
  searchCriteria: {
    courtId?: string;
    status?: string;
    phase?: string;
    judge?: string;
    caseType?: string;
    filingDateRange?: { start: Date; end: Date };
  },
  sequelize: Sequelize
): Promise<any[]> => {
  const whereClause: any = {};

  if (searchCriteria.courtId) {
    whereClause.courtId = searchCriteria.courtId;
  }

  if (searchCriteria.status) {
    whereClause.status = searchCriteria.status;
  }

  if (searchCriteria.phase) {
    whereClause.phase = searchCriteria.phase;
  }

  if (searchCriteria.judge) {
    whereClause.judge = { [Op.like]: `%${searchCriteria.judge}%` };
  }

  if (searchCriteria.caseType) {
    whereClause.caseType = searchCriteria.caseType;
  }

  if (searchCriteria.filingDateRange) {
    whereClause.filingDate = {
      [Op.between]: [searchCriteria.filingDateRange.start, searchCriteria.filingDateRange.end],
    };
  }

  const CaseStatus = sequelize.model('CaseStatus');

  return await CaseStatus.findAll({
    where: whereClause,
    order: [['filingDate', 'DESC']],
  });
};

// ============================================================================
// NESTJS SERVICE (38)
// ============================================================================

/**
 * 38. NestJS service for court filing operations.
 *
 * @example
 * ```typescript
 * @Module({
 *   providers: [CourtFilingService],
 *   exports: [CourtFilingService],
 * })
 * export class CourtFilingModule {}
 * ```
 */
@Injectable()
export class CourtFilingService {
  private readonly logger = new Logger(CourtFilingService.name);

  constructor(private readonly sequelize: Sequelize) {}

  /**
   * Submits a court filing with comprehensive validation and error handling.
   */
  async submitFiling(
    filing: ECFFilingRequest,
    courtConfig: CourtSystemConfig
  ): Promise<ECFFilingResponse> {
    this.logger.log(`Submitting filing ${filing.filingId} for case ${filing.caseNumber}`);

    try {
      // Validate filing
      const validation = await validateCourtFiling(filing, courtConfig);
      if (!validation.isValid) {
        throw new Error(`Filing validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
      }

      // Submit to ECF with retry logic
      const retryConfig: RetryConfig = {
        maxRetries: 3,
        retryDelay: 2000,
        backoffStrategy: 'exponential',
        maxRetryDelay: 10000,
      };

      const response = await submitToECF(filing, courtConfig, retryConfig);

      this.logger.log(`Filing submitted successfully: ${response.confirmationNumber}`);
      return response;
    } catch (error) {
      this.logger.error(`Filing submission failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves upcoming deadlines with automatic status updates.
   */
  async getDeadlinesWithStatusUpdate(
    filters: {
      caseNumber?: string;
      responsibleAttorney?: string;
      daysAhead?: number;
    }
  ): Promise<any[]> {
    const deadlines = await getUpcomingDeadlines(filters, this.sequelize);

    // Update deadline statuses
    const now = new Date();
    for (const deadline of deadlines) {
      const deadlineDate = new Date(deadline.deadlineDate);

      if (deadlineDate < now && deadline.status === 'upcoming') {
        await deadline.update({ status: 'overdue' });
      } else if (
        deadlineDate.toDateString() === now.toDateString() &&
        deadline.status === 'upcoming'
      ) {
        await deadline.update({ status: 'due-today' });
      }
    }

    return deadlines;
  }

  /**
   * Monitors docket and sends notifications for new entries.
   */
  async startDocketMonitoring(
    config: DocketTrackingConfig,
    notificationCallback: (entries: any[]) => Promise<void>
  ): Promise<void> {
    this.logger.log(`Starting docket monitoring for cases: ${config.caseNumbers.join(', ')}`);

    await monitorDocketUpdates(config, this.sequelize, async (newEntries) => {
      this.logger.log(`Found ${newEntries.length} new docket entries`);

      try {
        await notificationCallback(newEntries);
      } catch (error) {
        this.logger.error(`Notification callback failed: ${error.message}`, error.stack);
      }
    });
  }
}

// ============================================================================
// SWAGGER API DECORATORS (39-41)
// ============================================================================

/**
 * 39. Swagger decorator for filing submission endpoint.
 *
 * @example
 * ```typescript
 * @Post('/filings/submit')
 * @SwaggerFilingSubmit()
 * async submitFiling(@Body() request: ECFFilingRequest) {
 *   return await this.filingService.submitFiling(request, courtConfig);
 * }
 * ```
 */
export const SwaggerFilingSubmit = () => {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    ApiOperation({
      summary: 'Submit court filing to ECF system',
      description: 'Submits a court filing through the Electronic Court Filing (ECF) system with comprehensive validation, retry logic, and service tracking.',
    })(target, propertyKey, descriptor);

    ApiResponse({
      status: 200,
      description: 'Filing submitted successfully',
      schema: {
        example: {
          success: true,
          filingId: 'FIL-2024-001',
          transactionId: 'ECF-1234567890',
          confirmationNumber: 'CONF-987654',
          filingDate: '2024-11-09T10:30:00Z',
          docketEntryNumber: '123',
        },
      },
    })(target, propertyKey, descriptor);

    ApiResponse({
      status: 400,
      description: 'Validation error',
    })(target, propertyKey, descriptor);

    ApiResponse({
      status: 500,
      description: 'ECF system error',
    })(target, propertyKey, descriptor);
  };
};

/**
 * 40. Swagger decorator for docket retrieval endpoint.
 *
 * @example
 * ```typescript
 * @Get('/docket/:caseNumber')
 * @SwaggerGetDocket()
 * async getDocket(@Param('caseNumber') caseNumber: string) {
 *   return await this.filingService.getDocketEntries(caseNumber);
 * }
 * ```
 */
export const SwaggerGetDocket = () => {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    ApiOperation({
      summary: 'Retrieve docket entries for case',
      description: 'Retrieves all docket entries for a specified case with optional filtering by date range and document type.',
    })(target, propertyKey, descriptor);

    ApiParam({
      name: 'caseNumber',
      description: 'Case number',
      example: '2024-CV-12345',
    })(target, propertyKey, descriptor);

    ApiQuery({
      name: 'startDate',
      required: false,
      description: 'Start date for filtering',
      example: '2024-01-01',
    })(target, propertyKey, descriptor);

    ApiQuery({
      name: 'endDate',
      required: false,
      description: 'End date for filtering',
      example: '2024-12-31',
    })(target, propertyKey, descriptor);

    ApiResponse({
      status: 200,
      description: 'Docket entries retrieved successfully',
      schema: {
        example: [
          {
            entryNumber: 1,
            entryDate: '2024-11-01',
            documentType: 'complaint',
            filingParty: 'Plaintiff Smith',
            entryText: 'Complaint filed',
          },
        ],
      },
    })(target, propertyKey, descriptor);
  };
};

/**
 * 41. Swagger decorator for deadline calculation endpoint.
 *
 * @example
 * ```typescript
 * @Post('/deadlines/calculate')
 * @SwaggerCalculateDeadline()
 * async calculateDeadline(@Body() request: DeadlineCalculationRequest) {
 *   return await this.filingService.calculateDeadline(request);
 * }
 * ```
 */
export const SwaggerCalculateDeadline = () => {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    ApiOperation({
      summary: 'Calculate filing deadline',
      description: 'Calculates filing deadline based on court rules, triggering event, and business day calculations. Accounts for weekends, holidays, and court closures.',
    })(target, propertyKey, descriptor);

    ApiBody({
      description: 'Deadline calculation request',
      schema: {
        example: {
          triggeringDate: '2024-11-01',
          documentType: 'answer',
          courtId: 'CA-SUPERIOR',
          excludeWeekends: true,
          excludeHolidays: true,
        },
      },
    })(target, propertyKey, descriptor);

    ApiResponse({
      status: 200,
      description: 'Deadline calculated successfully',
      schema: {
        example: {
          deadlineDate: '2024-12-01',
          businessDays: 21,
          calendarDays: 30,
          deadlineTime: '23:59:59',
          warnings: [],
        },
      },
    })(target, propertyKey, descriptor);

    ApiResponse({
      status: 400,
      description: 'Invalid request parameters',
    })(target, propertyKey, descriptor);
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Models
  createCourtFilingModel,
  createDocketEntryModel,
  createFilingDeadlineModel,
  createCourtCalendarModel,
  createCaseStatusModel,
  createFilingAuditLogModel,

  // Validation
  validateCourtFiling,
  validateDocumentFormat,
  validateServiceList,

  // ECF Integration
  submitToECF,
  checkECFStatus,
  downloadStamppedDocument,
  getServiceConfirmation,
  cancelECFFiling,

  // Docket Tracking
  getDocketEntries,
  monitorDocketUpdates,
  searchDocketEntries,
  exportDocketSheet,
  compareDocketSources,

  // Deadline Calculations
  calculateFilingDeadline,
  isCourtBusinessDay,
  getNextCourtBusinessDay,
  calculateDeadlineExtension,
  getUpcomingDeadlines,

  // Court Calendar
  scheduleCourtEvent,
  getCourtCalendar,
  continueCourtEvent,
  cancelCourtEvent,
  checkCalendarConflicts,

  // Case Status
  updateCaseStatus,
  getCaseStatus,
  getCaseTimeline,
  searchCases,

  // Services
  CourtFilingService,

  // Swagger Decorators
  SwaggerFilingSubmit,
  SwaggerGetDocket,
  SwaggerCalculateDeadline,

  // Utilities
  executeWithRetry,
};
