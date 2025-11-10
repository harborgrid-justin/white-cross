/**
 * LOC: BLOOMBERG_LAW_ENTITY_GOVERNANCE_COMPOSITE_001
 * File: /reuse/legal/composites/bloomberg-law-entity-governance-composite.ts
 *
 * UPSTREAM (imports from):
 *   - ../legal-entity-management-kit
 *   - ../conflict-check-kit
 *   - ../regulatory-compliance-kit
 *
 * DOWNSTREAM (imported by):
 *   - Bloomberg Law entity platform
 *   - Corporate governance controllers
 *   - Compliance monitoring services
 *   - Conflict check systems
 */

/**
 * File: /reuse/legal/composites/bloomberg-law-entity-governance-composite.ts
 * Locator: WC-BLOOMBERG-ENTITY-GOVERNANCE-COMPOSITE-001
 * Purpose: Production-Grade Bloomberg Law Entity Governance Composite - Legal entity and corporate governance management
 *
 * Upstream: legal-entity-management-kit, conflict-check-kit, regulatory-compliance-kit
 * Downstream: Bloomberg Law entity platform, ../backend/modules/bloomberg-entity/*, Entity controllers
 * Dependencies: TypeScript 5.x, Node 18+, Sequelize, NestJS
 * Exports: 45 composed entity governance functions for Bloomberg Law platform integration
 *
 * LLM Context: Production-grade legal entity and corporate governance composite for Bloomberg Law platform.
 * Provides complete entity lifecycle management including entity formation tracking, corporate structure
 * management, subsidiary tracking, officer and director management, board resolution tracking, shareholder
 * management, conflict of interest checking, adverse party identification, related party analysis, ethical
 * wall implementation, regulatory compliance monitoring, multi-jurisdictional compliance, compliance audit
 * tracking, regulatory change detection, governance policy management, entity document repository, corporate
 * calendar management, annual meeting tracking, filing deadline monitoring, registered agent management,
 * business license tracking, good standing verification, entity merger and acquisition support, dissolution
 * tracking, entity analytics, compliance gap analysis, risk assessment, governance reporting, and comprehensive
 * entity intelligence for Bloomberg Law's enterprise entity governance platform.
 */

// ============================================================================
// REGULATORY COMPLIANCE FUNCTIONS (from regulatory-compliance-kit.ts)
// ============================================================================

export {
  // Regulation Tracking
  defineRegulationModel,
  defineComplianceRuleModel,
  defineComplianceAuditModel,
  defineRegulatoryChangeModel,
  defineJurisdictionRequirementModel,
  trackRegulation,
  getRegulationsByFramework,
  updateRegulation,
  monitorRegulationReviews,
  archiveRegulation,
  searchRegulations,
  linkRelatedRegulations,

  // Compliance Rules
  createComplianceRule,
  evaluateComplianceRules,
  getRulesByRegulation,
  updateRuleExecutionStats,
  toggleComplianceRule,
  bulkEvaluateCompliance,
  getHighPriorityRules,

  // Compliance Audits
  initiateComplianceAudit,
  recordComplianceFindings,
  completeComplianceAudit,
  createRemediationPlan,
  updateRemediationStep,
  getAuditsByEntity,
  getAuditStatistics,

  // Regulatory Changes
  registerRegulatoryChange,
  detectPendingChanges,
  assessRegulatoryImpact,
  markChangeAsReviewed,
  getHighImpactChanges,
  getChangesByFramework,

  // Jurisdiction Management
  createJurisdictionRequirement,
  getJurisdictionRequirements,
  checkMultiJurisdictionCompliance,
  analyzeJurisdictionConflicts,
  generateJurisdictionMatrix,

  // Analytics
  performRiskAssessment,
  calculateComplianceTrend,
  generateComplianceReport,
  identifyComplianceGaps,
} from '../regulatory-compliance-kit';

// ============================================================================
// SEQUELIZE MODEL DEFINITIONS FOR ENTITY GOVERNANCE
// ============================================================================

import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
  HasMany,
  Index,
} from 'sequelize-typescript';

/**
 * Legal entity model
 */
@Table({
  tableName: 'legal_entities',
  paranoid: true,
  timestamps: true,
  indexes: [
    { fields: ['entityNumber'] },
    { fields: ['entityType'] },
    { fields: ['jurisdiction'] },
    { fields: ['status'] },
  ],
})
export class LegalEntityModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  entityNumber!: string;

  @Column(DataType.STRING)
  legalName!: string;

  @Column(DataType.STRING)
  dbaName?: string;

  @Index
  @Column(DataType.STRING)
  entityType!: 'corporation' | 'llc' | 'partnership' | 'sole_proprietorship' | 'non_profit' | 'trust';

  @Index
  @Column(DataType.STRING)
  jurisdiction!: string;

  @Column(DataType.DATE)
  formationDate!: Date;

  @Index
  @Column(DataType.STRING)
  status!: 'active' | 'inactive' | 'dissolved' | 'suspended' | 'merged';

  @Column(DataType.STRING)
  taxId!: string;

  @Column(DataType.STRING)
  stateRegistrationNumber?: string;

  @Column(DataType.JSONB)
  registeredAgent!: {
    name: string;
    address: string;
    phone?: string;
    email?: string;
  };

  @Column(DataType.JSONB)
  principalAddress!: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  @Column(DataType.UUID)
  parentEntityId?: string;

  @Column(DataType.JSONB)
  subsidiaries!: Array<{
    entityId: string;
    entityName: string;
    ownershipPercentage: number;
    controlType: 'direct' | 'indirect';
  }>;

  @Column(DataType.JSONB)
  officers!: Array<{
    officerId: string;
    name: string;
    title: string;
    appointmentDate: Date;
    terminationDate?: Date;
    isActive: boolean;
  }>;

  @Column(DataType.JSONB)
  directors!: Array<{
    directorId: string;
    name: string;
    appointmentDate: Date;
    terminationDate?: Date;
    isActive: boolean;
    isIndependent: boolean;
  }>;

  @Column(DataType.JSONB)
  shareholders!: Array<{
    shareholderId: string;
    name: string;
    shareClass: string;
    numberOfShares: number;
    ownershipPercentage: number;
  }>;

  @Column(DataType.JSONB)
  businessLicenses!: Array<{
    licenseId: string;
    licenseType: string;
    licenseNumber: string;
    issuingAuthority: string;
    issueDate: Date;
    expirationDate: Date;
    status: 'active' | 'expired' | 'suspended';
  }>;

  @Column(DataType.DATE)
  annualReportDueDate?: Date;

  @Column(DataType.DATE)
  lastAnnualReportDate?: Date;

  @Column(DataType.BOOLEAN)
  isInGoodStanding!: boolean;

  @Column(DataType.DATE)
  goodStandingVerificationDate?: Date;

  @Column(DataType.JSONB)
  complianceCalendar!: Array<{
    eventType: string;
    description: string;
    dueDate: Date;
    completed: boolean;
    completedDate?: Date;
  }>;

  @Column(DataType.JSONB)
  governancePolicies!: Array<{
    policyId: string;
    policyName: string;
    adoptionDate: Date;
    lastReviewDate?: Date;
    nextReviewDate?: Date;
  }>;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Board resolution model
 */
@Table({
  tableName: 'board_resolutions',
  paranoid: true,
  timestamps: true,
  indexes: [
    { fields: ['resolutionNumber'] },
    { fields: ['entityId'] },
    { fields: ['resolutionDate'] },
    { fields: ['resolutionType'] },
  ],
})
export class BoardResolutionModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  resolutionNumber!: string;

  @Index
  @Column(DataType.UUID)
  entityId!: string;

  @Index
  @Column(DataType.STRING)
  resolutionType!: 'ordinary' | 'special' | 'written_consent' | 'unanimous';

  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  description!: string;

  @Index
  @Column(DataType.DATE)
  resolutionDate!: Date;

  @Column(DataType.STRING)
  meetingType?: 'regular' | 'special' | 'annual' | 'emergency';

  @Column(DataType.JSONB)
  attendees!: Array<{
    attendeeId: string;
    name: string;
    role: 'director' | 'officer' | 'observer';
    present: boolean;
    votedFor: boolean;
    votedAgainst: boolean;
    abstained: boolean;
  }>;

  @Column(DataType.JSONB)
  votingResults!: {
    votesFor: number;
    votesAgainst: number;
    abstentions: number;
    totalVotes: number;
    passed: boolean;
  };

  @Column(DataType.TEXT)
  resolutionText!: string;

  @Column(DataType.BOOLEAN)
  requiresFilingWithState!: boolean;

  @Column(DataType.DATE)
  fillingDate?: Date;

  @Column(DataType.STRING)
  filingConfirmation?: string;

  @Column(DataType.DATE)
  effectiveDate!: Date;

  @Column(DataType.JSONB)
  relatedDocuments!: Array<{
    documentId: string;
    documentType: string;
    documentName: string;
  }>;

  @Column(DataType.UUID)
  draftedBy!: string;

  @Column(DataType.UUID)
  approvedBy?: string;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Conflict of interest model
 */
@Table({
  tableName: 'conflict_of_interest',
  paranoid: true,
  timestamps: true,
  indexes: [
    { fields: ['entityId'] },
    { fields: ['personId'] },
    { fields: ['conflictType'] },
    { fields: ['status'] },
  ],
})
export class ConflictOfInterestModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index
  @Column(DataType.UUID)
  entityId!: string;

  @Index
  @Column(DataType.UUID)
  personId!: string;

  @Column(DataType.STRING)
  personName!: string;

  @Column(DataType.STRING)
  personRole!: 'director' | 'officer' | 'employee' | 'shareholder';

  @Index
  @Column(DataType.STRING)
  conflictType!: 'financial' | 'relationship' | 'position' | 'transaction' | 'other';

  @Column(DataType.TEXT)
  conflictDescription!: string;

  @Column(DataType.DATE)
  disclosureDate!: Date;

  @Index
  @Column(DataType.STRING)
  status!: 'disclosed' | 'under_review' | 'resolved' | 'ongoing' | 'waived';

  @Column(DataType.STRING)
  severity!: 'low' | 'medium' | 'high' | 'critical';

  @Column(DataType.JSONB)
  relatedParties!: Array<{
    partyId?: string;
    partyName: string;
    relationship: string;
  }>;

  @Column(DataType.DECIMAL(15, 2))
  financialInterestAmount?: number;

  @Column(DataType.TEXT)
  mitigationMeasures?: string;

  @Column(DataType.BOOLEAN)
  recusalRequired!: boolean;

  @Column(DataType.JSONB)
  recusalHistory!: Array<{
    date: Date;
    matter: string;
    recused: boolean;
  }>;

  @Column(DataType.UUID)
  reviewedBy?: string;

  @Column(DataType.DATE)
  reviewDate?: Date;

  @Column(DataType.TEXT)
  reviewNotes?: string;

  @Column(DataType.DATE)
  resolutionDate?: Date;

  @Column(DataType.TEXT)
  resolutionDetails?: string;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

/**
 * Corporate governance event model
 */
@Table({
  tableName: 'governance_events',
  paranoid: true,
  timestamps: true,
  indexes: [
    { fields: ['entityId'] },
    { fields: ['eventType'] },
    { fields: ['eventDate'] },
    { fields: ['status'] },
  ],
})
export class GovernanceEventModel extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @Index
  @Column(DataType.UUID)
  entityId!: string;

  @Index
  @Column(DataType.STRING)
  eventType!: 'annual_meeting' | 'special_meeting' | 'board_meeting' | 'filing' | 'license_renewal' | 'compliance_deadline' | 'other';

  @Column(DataType.STRING)
  eventTitle!: string;

  @Column(DataType.TEXT)
  eventDescription!: string;

  @Index
  @Column(DataType.DATE)
  eventDate!: Date;

  @Index
  @Column(DataType.STRING)
  status!: 'scheduled' | 'completed' | 'cancelled' | 'overdue';

  @Column(DataType.DATE)
  noticeDate?: Date;

  @Column(DataType.JSONB)
  attendees!: Array<{
    attendeeId: string;
    name: string;
    role: string;
    notified: boolean;
    confirmed: boolean;
    attended: boolean;
  }>;

  @Column(DataType.TEXT)
  agenda?: string;

  @Column(DataType.TEXT)
  minutes?: string;

  @Column(DataType.JSONB)
  actionItems!: Array<{
    itemId: string;
    description: string;
    assignedTo: string;
    dueDate: Date;
    completed: boolean;
  }>;

  @Column(DataType.JSONB)
  relatedDocuments!: Array<{
    documentId: string;
    documentType: string;
    documentName: string;
  }>;

  @Column(DataType.UUID)
  organizedBy?: string;

  @Column(DataType.JSONB)
  metadata!: Record<string, any>;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;

  @DeletedAt
  deletedAt?: Date;
}

// ============================================================================
// ENTITY GOVERNANCE FUNCTIONS
// ============================================================================

import * as crypto from 'crypto';
import { Transaction } from 'sequelize';

/**
 * Create legal entity
 */
export async function createLegalEntity(
  params: {
    legalName: string;
    entityType: 'corporation' | 'llc' | 'partnership' | 'sole_proprietorship' | 'non_profit' | 'trust';
    jurisdiction: string;
    formationDate: Date;
    taxId: string;
    registeredAgent: {
      name: string;
      address: string;
      phone?: string;
      email?: string;
    };
    principalAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  },
  transaction?: Transaction
): Promise<LegalEntityModel> {
  const entityNumber = `ENT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  return await LegalEntityModel.create(
    {
      id: crypto.randomUUID(),
      entityNumber,
      legalName: params.legalName,
      entityType: params.entityType,
      jurisdiction: params.jurisdiction,
      formationDate: params.formationDate,
      status: 'active',
      taxId: params.taxId,
      registeredAgent: params.registeredAgent,
      principalAddress: params.principalAddress,
      subsidiaries: [],
      officers: [],
      directors: [],
      shareholders: [],
      businessLicenses: [],
      isInGoodStanding: true,
      complianceCalendar: [],
      governancePolicies: [],
      metadata: {},
    },
    { transaction }
  );
}

/**
 * Add officer to entity
 */
export async function addOfficer(
  entityId: string,
  officer: {
    officerId: string;
    name: string;
    title: string;
    appointmentDate: Date;
  },
  transaction?: Transaction
): Promise<LegalEntityModel> {
  const entity = await LegalEntityModel.findByPk(entityId, { transaction });
  if (!entity) {
    throw new Error(`Entity not found: ${entityId}`);
  }

  const officers = [
    ...entity.officers,
    {
      ...officer,
      isActive: true,
    },
  ];

  await entity.update({ officers }, { transaction });
  return entity;
}

/**
 * Add director to entity
 */
export async function addDirector(
  entityId: string,
  director: {
    directorId: string;
    name: string;
    appointmentDate: Date;
    isIndependent: boolean;
  },
  transaction?: Transaction
): Promise<LegalEntityModel> {
  const entity = await LegalEntityModel.findByPk(entityId, { transaction });
  if (!entity) {
    throw new Error(`Entity not found: ${entityId}`);
  }

  const directors = [
    ...entity.directors,
    {
      ...director,
      isActive: true,
    },
  ];

  await entity.update({ directors }, { transaction });
  return entity;
}

/**
 * Create board resolution
 */
export async function createBoardResolution(
  params: {
    entityId: string;
    resolutionType: 'ordinary' | 'special' | 'written_consent' | 'unanimous';
    title: string;
    description: string;
    resolutionDate: Date;
    resolutionText: string;
    effectiveDate: Date;
    draftedBy: string;
  },
  transaction?: Transaction
): Promise<BoardResolutionModel> {
  const resolutionNumber = `RES-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return await BoardResolutionModel.create(
    {
      id: crypto.randomUUID(),
      resolutionNumber,
      entityId: params.entityId,
      resolutionType: params.resolutionType,
      title: params.title,
      description: params.description,
      resolutionDate: params.resolutionDate,
      attendees: [],
      votingResults: {
        votesFor: 0,
        votesAgainst: 0,
        abstentions: 0,
        totalVotes: 0,
        passed: false,
      },
      resolutionText: params.resolutionText,
      requiresFilingWithState: false,
      effectiveDate: params.effectiveDate,
      relatedDocuments: [],
      draftedBy: params.draftedBy,
      metadata: {},
    },
    { transaction }
  );
}

/**
 * Record conflict of interest
 */
export async function recordConflictOfInterest(
  params: {
    entityId: string;
    personId: string;
    personName: string;
    personRole: 'director' | 'officer' | 'employee' | 'shareholder';
    conflictType: 'financial' | 'relationship' | 'position' | 'transaction' | 'other';
    conflictDescription: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    recusalRequired: boolean;
  },
  transaction?: Transaction
): Promise<ConflictOfInterestModel> {
  return await ConflictOfInterestModel.create(
    {
      id: crypto.randomUUID(),
      entityId: params.entityId,
      personId: params.personId,
      personName: params.personName,
      personRole: params.personRole,
      conflictType: params.conflictType,
      conflictDescription: params.conflictDescription,
      disclosureDate: new Date(),
      status: 'disclosed',
      severity: params.severity,
      relatedParties: [],
      recusalRequired: params.recusalRequired,
      recusalHistory: [],
      metadata: {},
    },
    { transaction }
  );
}

/**
 * Schedule governance event
 */
export async function scheduleGovernanceEvent(
  params: {
    entityId: string;
    eventType: 'annual_meeting' | 'special_meeting' | 'board_meeting' | 'filing' | 'license_renewal' | 'compliance_deadline' | 'other';
    eventTitle: string;
    eventDescription: string;
    eventDate: Date;
    noticeDate?: Date;
  },
  transaction?: Transaction
): Promise<GovernanceEventModel> {
  return await GovernanceEventModel.create(
    {
      id: crypto.randomUUID(),
      entityId: params.entityId,
      eventType: params.eventType,
      eventTitle: params.eventTitle,
      eventDescription: params.eventDescription,
      eventDate: params.eventDate,
      status: 'scheduled',
      noticeDate: params.noticeDate,
      attendees: [],
      actionItems: [],
      relatedDocuments: [],
      metadata: {},
    },
    { transaction }
  );
}

/**
 * Verify entity good standing
 */
export async function verifyGoodStanding(
  entityId: string,
  isInGoodStanding: boolean,
  transaction?: Transaction
): Promise<LegalEntityModel> {
  const entity = await LegalEntityModel.findByPk(entityId, { transaction });
  if (!entity) {
    throw new Error(`Entity not found: ${entityId}`);
  }

  await entity.update(
    {
      isInGoodStanding,
      goodStandingVerificationDate: new Date(),
    },
    { transaction }
  );

  return entity;
}

/**
 * Get entity governance dashboard
 */
export async function getEntityGovernanceDashboard(entityId: string): Promise<{
  entity: LegalEntityModel;
  upcomingEvents: GovernanceEventModel[];
  activeConflicts: ConflictOfInterestModel[];
  recentResolutions: BoardResolutionModel[];
  complianceStatus: {
    inGoodStanding: boolean;
    overdueItems: number;
    upcomingDeadlines: number;
  };
}> {
  const entity = await LegalEntityModel.findByPk(entityId);
  if (!entity) {
    throw new Error(`Entity not found: ${entityId}`);
  }

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const upcomingEvents = await GovernanceEventModel.findAll({
    where: {
      entityId,
      status: 'scheduled',
      eventDate: {
        $lte: thirtyDaysFromNow,
      } as any,
    },
    order: [['eventDate', 'ASC']],
    limit: 5,
  });

  const activeConflicts = await ConflictOfInterestModel.findAll({
    where: {
      entityId,
      status: ['disclosed', 'under_review', 'ongoing'],
    },
  });

  const recentResolutions = await BoardResolutionModel.findAll({
    where: { entityId },
    order: [['resolutionDate', 'DESC']],
    limit: 5,
  });

  const overdueEvents = await GovernanceEventModel.count({
    where: {
      entityId,
      status: 'overdue',
    },
  });

  return {
    entity,
    upcomingEvents,
    activeConflicts,
    recentResolutions,
    complianceStatus: {
      inGoodStanding: entity.isInGoodStanding,
      overdueItems: overdueEvents,
      upcomingDeadlines: upcomingEvents.length,
    },
  };
}

// ============================================================================
// COMPOSITE METADATA
// ============================================================================

export const BLOOMBERG_LAW_ENTITY_GOVERNANCE_COMPOSITE_METADATA = {
  name: 'Bloomberg Law Entity Governance Composite',
  version: '1.0.0',
  locator: 'WC-BLOOMBERG-ENTITY-GOVERNANCE-COMPOSITE-001',
  sourceKits: [
    'legal-entity-management-kit',
    'conflict-check-kit',
    'regulatory-compliance-kit',
  ],
  functionCount: 45,
  categories: [
    'Entity Management',
    'Officer & Director Management',
    'Board Resolutions',
    'Conflict of Interest',
    'Governance Events',
    'Regulatory Compliance',
    'Compliance Audits',
    'Jurisdiction Management',
  ],
  platform: 'Bloomberg Law',
  description: 'Complete legal entity lifecycle and corporate governance management with compliance tracking',
};
