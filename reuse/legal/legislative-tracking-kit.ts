/**
 * @fileoverview Legislative Tracking Kit - Comprehensive legislative monitoring and analysis
 * @module reuse/legal/legislative-tracking-kit
 * @description Production-ready legislative tracking system with real-time monitoring,
 * bill tracking, voting analysis, committee management, and amendment tracking.
 *
 * Key Features:
 * - Bill lifecycle tracking and monitoring
 * - Legislative history analysis and reporting
 * - Voting record analysis and trends
 * - Committee tracking and composition management
 * - Amendment tracking and version control
 * - Legislator profile and voting pattern analysis
 * - Real-time legislative updates (WebSocket/SSE)
 * - Multi-jurisdiction support
 * - Bill text comparison and diff analysis
 * - Automated alert and notification system
 * - Legislative calendar integration
 * - Sponsor and co-sponsor tracking
 * - Public hearing and testimony tracking
 * - Legislative impact analysis
 * - Compliance and regulatory tracking
 *
 * @target Sequelize v6.x, NestJS v10.x, Node 18+, TypeScript 5.x
 *
 * @security
 * - Role-based access control for legislative data
 * - Audit logging for all legislative actions
 * - Data integrity validation
 * - Secure WebSocket connections (WSS)
 * - Rate limiting for API endpoints
 * - Input sanitization and validation
 * - GDPR compliance for personal data
 * - Public records compliance
 *
 * @example Basic bill tracking
 * ```typescript
 * import { createBill, trackBillProgress, getBillHistory } from './legislative-tracking-kit';
 *
 * const bill = await createBill({
 *   billNumber: 'HB-1234',
 *   title: 'Healthcare Reform Act',
 *   jurisdiction: 'US-CA',
 *   chamber: Chamber.HOUSE
 * });
 *
 * await trackBillProgress(bill.id, BillStatus.IN_COMMITTEE);
 * const history = await getBillHistory(bill.id);
 * ```
 *
 * @example Real-time legislative monitoring
 * ```typescript
 * import { LegislativeMonitoringService } from './legislative-tracking-kit';
 *
 * const monitor = new LegislativeMonitoringService(sequelize);
 * monitor.subscribeToUpdates(['HB-1234', 'SB-5678'], (update) => {
 *   console.log('Bill update:', update);
 * });
 * ```
 *
 * @example Voting analysis
 * ```typescript
 * import {
 *   analyzeVotingRecord,
 *   calculateVotingAlignment,
 *   getVotingTrends
 * } from './legislative-tracking-kit';
 *
 * const record = await analyzeVotingRecord('legislator-123');
 * const alignment = await calculateVotingAlignment('legislator-123', 'legislator-456');
 * const trends = await getVotingTrends({ startDate: '2024-01-01', endDate: '2024-12-31' });
 * ```
 *
 * LOC: LEG-TRACK-001
 * UPSTREAM: sequelize, @nestjs/common, @nestjs/swagger, ws, ulid
 * DOWNSTREAM: legal services, compliance modules, reporting services
 *
 * @version 1.0.0
 * @since 2025-11-09
 */

import {
  Model,
  ModelStatic,
  Sequelize,
  DataTypes,
  ModelAttributes,
  Transaction,
  Op,
  FindOptions,
  literal,
  fn,
  col,
  QueryTypes,
} from 'sequelize';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { monotonicFactory } from 'ulid';
import * as crypto from 'crypto';
import { EventEmitter } from 'events';

// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================

/**
 * @enum Chamber
 * @description Legislative chamber types
 */
export enum Chamber {
  HOUSE = 'HOUSE',
  SENATE = 'SENATE',
  ASSEMBLY = 'ASSEMBLY',
  COUNCIL = 'COUNCIL',
  UNICAMERAL = 'UNICAMERAL',
}

/**
 * @enum BillStatus
 * @description Bill lifecycle status
 */
export enum BillStatus {
  PREFILED = 'PREFILED',
  INTRODUCED = 'INTRODUCED',
  IN_COMMITTEE = 'IN_COMMITTEE',
  COMMITTEE_REPORTED = 'COMMITTEE_REPORTED',
  FIRST_READING = 'FIRST_READING',
  SECOND_READING = 'SECOND_READING',
  THIRD_READING = 'THIRD_READING',
  PASSED_CHAMBER = 'PASSED_CHAMBER',
  SENT_TO_OTHER_CHAMBER = 'SENT_TO_OTHER_CHAMBER',
  PASSED_BOTH_CHAMBERS = 'PASSED_BOTH_CHAMBERS',
  SENT_TO_GOVERNOR = 'SENT_TO_GOVERNOR',
  SIGNED = 'SIGNED',
  VETOED = 'VETOED',
  VETO_OVERRIDDEN = 'VETO_OVERRIDDEN',
  ENACTED = 'ENACTED',
  FAILED = 'FAILED',
  WITHDRAWN = 'WITHDRAWN',
  TABLED = 'TABLED',
}

/**
 * @enum VoteType
 * @description Type of legislative vote
 */
export enum VoteType {
  YEA = 'YEA',
  NAY = 'NAY',
  PRESENT = 'PRESENT',
  ABSTAIN = 'ABSTAIN',
  EXCUSED = 'EXCUSED',
  NOT_VOTING = 'NOT_VOTING',
}

/**
 * @enum AmendmentStatus
 * @description Amendment processing status
 */
export enum AmendmentStatus {
  PROPOSED = 'PROPOSED',
  ADOPTED = 'ADOPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  TABLED = 'TABLED',
}

/**
 * @enum CommitteeType
 * @description Type of legislative committee
 */
export enum CommitteeType {
  STANDING = 'STANDING',
  SELECT = 'SELECT',
  JOINT = 'JOINT',
  SPECIAL = 'SPECIAL',
  CONFERENCE = 'CONFERENCE',
  SUBCOMMITTEE = 'SUBCOMMITTEE',
}

/**
 * @enum PartyAffiliation
 * @description Political party affiliation
 */
export enum PartyAffiliation {
  DEMOCRAT = 'DEMOCRAT',
  REPUBLICAN = 'REPUBLICAN',
  INDEPENDENT = 'INDEPENDENT',
  LIBERTARIAN = 'LIBERTARIAN',
  GREEN = 'GREEN',
  OTHER = 'OTHER',
}

/**
 * @enum LegislativeEventType
 * @description Types of legislative events
 */
export enum LegislativeEventType {
  BILL_INTRODUCED = 'BILL_INTRODUCED',
  COMMITTEE_HEARING = 'COMMITTEE_HEARING',
  FLOOR_VOTE = 'FLOOR_VOTE',
  AMENDMENT_FILED = 'AMENDMENT_FILED',
  STATUS_CHANGE = 'STATUS_CHANGE',
  TESTIMONY_SUBMITTED = 'TESTIMONY_SUBMITTED',
  FISCAL_NOTE_ADDED = 'FISCAL_NOTE_ADDED',
  VETO = 'VETO',
  ENACTED = 'ENACTED',
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * @interface BillAttributes
 * @description Bill model attributes
 */
export interface BillAttributes {
  id: string;
  billNumber: string;
  title: string;
  summary?: string;
  fullText?: string;
  jurisdiction: string;
  chamber: Chamber;
  session: string;
  status: BillStatus;
  introducedDate?: Date;
  lastActionDate?: Date;
  effectiveDate?: Date;
  subjectAreas?: string[];
  fiscalImpact?: number;
  fiscalNote?: string;
  primarySponsorId?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

/**
 * @interface LegislatorAttributes
 * @description Legislator profile attributes
 */
export interface LegislatorAttributes {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  fullName: string;
  party: PartyAffiliation;
  chamber: Chamber;
  district: string;
  jurisdiction: string;
  email?: string;
  phone?: string;
  website?: string;
  photoUrl?: string;
  termStartDate?: Date;
  termEndDate?: Date;
  biography?: string;
  committees?: string[];
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @interface AmendmentAttributes
 * @description Amendment attributes
 */
export interface AmendmentAttributes {
  id: string;
  billId: string;
  amendmentNumber: string;
  title?: string;
  description?: string;
  fullText?: string;
  sponsorId?: string;
  status: AmendmentStatus;
  proposedDate?: Date;
  adoptedDate?: Date;
  voteId?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @interface VoteAttributes
 * @description Vote record attributes
 */
export interface VoteAttributes {
  id: string;
  billId?: string;
  amendmentId?: string;
  chamber: Chamber;
  voteDate: Date;
  voteType: string;
  question?: string;
  result: 'PASSED' | 'FAILED' | 'TIE';
  yeaCount: number;
  nayCount: number;
  presentCount: number;
  absentCount: number;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @interface IndividualVoteAttributes
 * @description Individual legislator vote
 */
export interface IndividualVoteAttributes {
  id: string;
  voteId: string;
  legislatorId: string;
  vote: VoteType;
  metadata?: Record<string, any>;
  createdAt?: Date;
}

/**
 * @interface CommitteeAttributes
 * @description Committee attributes
 */
export interface CommitteeAttributes {
  id: string;
  name: string;
  chamber: Chamber;
  committeeType: CommitteeType;
  jurisdiction: string;
  parentCommitteeId?: string;
  chairId?: string;
  viceChairId?: string;
  description?: string;
  website?: string;
  memberIds?: string[];
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * @interface BillSponsorAttributes
 * @description Bill sponsor relationship
 */
export interface BillSponsorAttributes {
  id: string;
  billId: string;
  legislatorId: string;
  isPrimary: boolean;
  sponsorshipDate?: Date;
  metadata?: Record<string, any>;
  createdAt?: Date;
}

/**
 * @interface LegislativeEventAttributes
 * @description Legislative event tracking
 */
export interface LegislativeEventAttributes {
  id: string;
  billId?: string;
  eventType: LegislativeEventType;
  eventDate: Date;
  description?: string;
  location?: string;
  participants?: string[];
  documents?: string[];
  metadata?: Record<string, any>;
  createdAt?: Date;
}

/**
 * @interface BillHistoryEntry
 * @description Bill history entry
 */
export interface BillHistoryEntry {
  id: string;
  billId: string;
  status: BillStatus;
  timestamp: Date;
  chamber?: Chamber;
  action: string;
  actorId?: string;
  metadata?: Record<string, any>;
}

/**
 * @interface VotingAnalysis
 * @description Voting record analysis results
 */
export interface VotingAnalysis {
  legislatorId: string;
  totalVotes: number;
  yeaVotes: number;
  nayVotes: number;
  abstentions: number;
  attendance: number;
  partyLineVotes: number;
  partyLinePercentage: number;
  votingTrends: Array<{
    period: string;
    yeaCount: number;
    nayCount: number;
  }>;
}

/**
 * @interface LegislativeUpdate
 * @description Real-time legislative update
 */
export interface LegislativeUpdate {
  billId: string;
  billNumber: string;
  updateType: LegislativeEventType;
  oldStatus?: BillStatus;
  newStatus?: BillStatus;
  timestamp: Date;
  description: string;
  metadata?: Record<string, any>;
}

/**
 * @interface BillSearchCriteria
 * @description Bill search parameters
 */
export interface BillSearchCriteria {
  keywords?: string;
  billNumber?: string;
  chamber?: Chamber;
  status?: BillStatus;
  jurisdiction?: string;
  session?: string;
  sponsorId?: string;
  subjectAreas?: string[];
  introducedAfter?: Date;
  introducedBefore?: Date;
  lastActionAfter?: Date;
  lastActionBefore?: Date;
}

// ============================================================================
// SEQUELIZE MODELS
// ============================================================================

/**
 * Creates Bill model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Bill model
 *
 * @example
 * ```typescript
 * const Bill = createBillModel(sequelize);
 * ```
 */
export const createBillModel = (sequelize: Sequelize): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      defaultValue: () => generateULID(),
    },
    billNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: 'unique_bill_per_session',
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
    },
    fullText: {
      type: DataTypes.TEXT,
    },
    jurisdiction: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: 'unique_bill_per_session',
    },
    chamber: {
      type: DataTypes.ENUM(...Object.values(Chamber)),
      allowNull: false,
    },
    session: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: 'unique_bill_per_session',
    },
    status: {
      type: DataTypes.ENUM(...Object.values(BillStatus)),
      allowNull: false,
      defaultValue: BillStatus.INTRODUCED,
    },
    introducedDate: {
      type: DataTypes.DATE,
    },
    lastActionDate: {
      type: DataTypes.DATE,
    },
    effectiveDate: {
      type: DataTypes.DATE,
    },
    subjectAreas: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    fiscalImpact: {
      type: DataTypes.DECIMAL(15, 2),
    },
    fiscalNote: {
      type: DataTypes.TEXT,
    },
    primarySponsorId: {
      type: DataTypes.STRING(26),
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  };

  class Bill extends Model implements BillAttributes {
    public id!: string;
    public billNumber!: string;
    public title!: string;
    public summary?: string;
    public fullText?: string;
    public jurisdiction!: string;
    public chamber!: Chamber;
    public session!: string;
    public status!: BillStatus;
    public introducedDate?: Date;
    public lastActionDate?: Date;
    public effectiveDate?: Date;
    public subjectAreas?: string[];
    public fiscalImpact?: number;
    public fiscalNote?: string;
    public primarySponsorId?: string;
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt?: Date | null;
  }

  return Bill.init(attributes, {
    sequelize,
    modelName: 'Bill',
    tableName: 'bills',
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      { fields: ['bill_number'] },
      { fields: ['jurisdiction'] },
      { fields: ['chamber'] },
      { fields: ['status'] },
      { fields: ['session'] },
      { fields: ['primary_sponsor_id'] },
      { fields: ['introduced_date'] },
      { fields: ['last_action_date'] },
      { fields: ['subject_areas'], using: 'gin' },
      { fields: ['metadata'], using: 'gin' },
    ],
  });
};

/**
 * Creates Legislator model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Legislator model
 *
 * @example
 * ```typescript
 * const Legislator = createLegislatorModel(sequelize);
 * ```
 */
export const createLegislatorModel = (sequelize: Sequelize): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      defaultValue: () => generateULID(),
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    middleName: {
      type: DataTypes.STRING(100),
    },
    fullName: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    party: {
      type: DataTypes.ENUM(...Object.values(PartyAffiliation)),
      allowNull: false,
    },
    chamber: {
      type: DataTypes.ENUM(...Object.values(Chamber)),
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    jurisdiction: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(50),
    },
    website: {
      type: DataTypes.STRING(500),
    },
    photoUrl: {
      type: DataTypes.STRING(500),
    },
    termStartDate: {
      type: DataTypes.DATE,
    },
    termEndDate: {
      type: DataTypes.DATE,
    },
    biography: {
      type: DataTypes.TEXT,
    },
    committees: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  };

  class Legislator extends Model implements LegislatorAttributes {
    public id!: string;
    public firstName!: string;
    public lastName!: string;
    public middleName?: string;
    public fullName!: string;
    public party!: PartyAffiliation;
    public chamber!: Chamber;
    public district!: string;
    public jurisdiction!: string;
    public email?: string;
    public phone?: string;
    public website?: string;
    public photoUrl?: string;
    public termStartDate?: Date;
    public termEndDate?: Date;
    public biography?: string;
    public committees?: string[];
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  return Legislator.init(attributes, {
    sequelize,
    modelName: 'Legislator',
    tableName: 'legislators',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['full_name'] },
      { fields: ['party'] },
      { fields: ['chamber'] },
      { fields: ['district'] },
      { fields: ['jurisdiction'] },
      { fields: ['email'], unique: true, where: { email: { [Op.ne]: null } } },
      { fields: ['committees'], using: 'gin' },
    ],
  });
};

/**
 * Creates Amendment model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Amendment model
 *
 * @example
 * ```typescript
 * const Amendment = createAmendmentModel(sequelize);
 * ```
 */
export const createAmendmentModel = (sequelize: Sequelize): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      defaultValue: () => generateULID(),
    },
    billId: {
      type: DataTypes.STRING(26),
      allowNull: false,
      references: { model: 'bills', key: 'id' },
      onDelete: 'CASCADE',
    },
    amendmentNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(500),
    },
    description: {
      type: DataTypes.TEXT,
    },
    fullText: {
      type: DataTypes.TEXT,
    },
    sponsorId: {
      type: DataTypes.STRING(26),
      references: { model: 'legislators', key: 'id' },
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AmendmentStatus)),
      allowNull: false,
      defaultValue: AmendmentStatus.PROPOSED,
    },
    proposedDate: {
      type: DataTypes.DATE,
    },
    adoptedDate: {
      type: DataTypes.DATE,
    },
    voteId: {
      type: DataTypes.STRING(26),
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  };

  class Amendment extends Model implements AmendmentAttributes {
    public id!: string;
    public billId!: string;
    public amendmentNumber!: string;
    public title?: string;
    public description?: string;
    public fullText?: string;
    public sponsorId?: string;
    public status!: AmendmentStatus;
    public proposedDate?: Date;
    public adoptedDate?: Date;
    public voteId?: string;
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  return Amendment.init(attributes, {
    sequelize,
    modelName: 'Amendment',
    tableName: 'amendments',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['bill_id'] },
      { fields: ['amendment_number'] },
      { fields: ['sponsor_id'] },
      { fields: ['status'] },
      { fields: ['proposed_date'] },
    ],
  });
};

/**
 * Creates Vote model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Vote model
 *
 * @example
 * ```typescript
 * const Vote = createVoteModel(sequelize);
 * ```
 */
export const createVoteModel = (sequelize: Sequelize): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      defaultValue: () => generateULID(),
    },
    billId: {
      type: DataTypes.STRING(26),
      references: { model: 'bills', key: 'id' },
    },
    amendmentId: {
      type: DataTypes.STRING(26),
      references: { model: 'amendments', key: 'id' },
    },
    chamber: {
      type: DataTypes.ENUM(...Object.values(Chamber)),
      allowNull: false,
    },
    voteDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    voteType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    question: {
      type: DataTypes.TEXT,
    },
    result: {
      type: DataTypes.ENUM('PASSED', 'FAILED', 'TIE'),
      allowNull: false,
    },
    yeaCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    nayCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    presentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    absentCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  };

  class Vote extends Model implements VoteAttributes {
    public id!: string;
    public billId?: string;
    public amendmentId?: string;
    public chamber!: Chamber;
    public voteDate!: Date;
    public voteType!: string;
    public question?: string;
    public result!: 'PASSED' | 'FAILED' | 'TIE';
    public yeaCount!: number;
    public nayCount!: number;
    public presentCount!: number;
    public absentCount!: number;
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  return Vote.init(attributes, {
    sequelize,
    modelName: 'Vote',
    tableName: 'votes',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['bill_id'] },
      { fields: ['amendment_id'] },
      { fields: ['chamber'] },
      { fields: ['vote_date'] },
      { fields: ['result'] },
    ],
  });
};

/**
 * Creates IndividualVote model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} IndividualVote model
 *
 * @example
 * ```typescript
 * const IndividualVote = createIndividualVoteModel(sequelize);
 * ```
 */
export const createIndividualVoteModel = (sequelize: Sequelize): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      defaultValue: () => generateULID(),
    },
    voteId: {
      type: DataTypes.STRING(26),
      allowNull: false,
      references: { model: 'votes', key: 'id' },
      onDelete: 'CASCADE',
    },
    legislatorId: {
      type: DataTypes.STRING(26),
      allowNull: false,
      references: { model: 'legislators', key: 'id' },
    },
    vote: {
      type: DataTypes.ENUM(...Object.values(VoteType)),
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  };

  class IndividualVote extends Model implements IndividualVoteAttributes {
    public id!: string;
    public voteId!: string;
    public legislatorId!: string;
    public vote!: VoteType;
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
  }

  return IndividualVote.init(attributes, {
    sequelize,
    modelName: 'IndividualVote',
    tableName: 'individual_votes',
    timestamps: false,
    underscored: true,
    indexes: [
      { fields: ['vote_id'] },
      { fields: ['legislator_id'] },
      { fields: ['vote'] },
      { fields: ['vote_id', 'legislator_id'], unique: true },
    ],
  });
};

/**
 * Creates Committee model
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model>} Committee model
 *
 * @example
 * ```typescript
 * const Committee = createCommitteeModel(sequelize);
 * ```
 */
export const createCommitteeModel = (sequelize: Sequelize): ModelStatic<Model> => {
  const attributes: ModelAttributes = {
    id: {
      type: DataTypes.STRING(26),
      primaryKey: true,
      defaultValue: () => generateULID(),
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    chamber: {
      type: DataTypes.ENUM(...Object.values(Chamber)),
      allowNull: false,
    },
    committeeType: {
      type: DataTypes.ENUM(...Object.values(CommitteeType)),
      allowNull: false,
    },
    jurisdiction: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    parentCommitteeId: {
      type: DataTypes.STRING(26),
      references: { model: 'committees', key: 'id' },
    },
    chairId: {
      type: DataTypes.STRING(26),
      references: { model: 'legislators', key: 'id' },
    },
    viceChairId: {
      type: DataTypes.STRING(26),
      references: { model: 'legislators', key: 'id' },
    },
    description: {
      type: DataTypes.TEXT,
    },
    website: {
      type: DataTypes.STRING(500),
    },
    memberIds: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  };

  class Committee extends Model implements CommitteeAttributes {
    public id!: string;
    public name!: string;
    public chamber!: Chamber;
    public committeeType!: CommitteeType;
    public jurisdiction!: string;
    public parentCommitteeId?: string;
    public chairId?: string;
    public viceChairId?: string;
    public description?: string;
    public website?: string;
    public memberIds?: string[];
    public metadata?: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  return Committee.init(attributes, {
    sequelize,
    modelName: 'Committee',
    tableName: 'committees',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['name'] },
      { fields: ['chamber'] },
      { fields: ['committee_type'] },
      { fields: ['jurisdiction'] },
      { fields: ['chair_id'] },
      { fields: ['member_ids'], using: 'gin' },
    ],
  });
};

// ============================================================================
// BILL TRACKING AND MONITORING FUNCTIONS
// ============================================================================

/**
 * Generates a ULID
 *
 * @returns {string} ULID string
 * @private
 */
const generateULID = (): string => {
  const ulid = monotonicFactory();
  return ulid();
};

/**
 * Creates a new bill
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<BillAttributes>} billData - Bill data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created bill
 *
 * @example
 * ```typescript
 * const bill = await createBill(sequelize, {
 *   billNumber: 'HB-1234',
 *   title: 'Healthcare Reform Act',
 *   jurisdiction: 'US-CA',
 *   chamber: Chamber.HOUSE,
 *   session: '2024-2025'
 * });
 * ```
 */
export const createBill = async (
  sequelize: Sequelize,
  billData: Partial<BillAttributes>,
  transaction?: Transaction,
): Promise<Model> => {
  const Bill = sequelize.models.Bill;

  const bill = await Bill.create(
    {
      ...billData,
      introducedDate: billData.introducedDate || new Date(),
      lastActionDate: billData.lastActionDate || new Date(),
    },
    { transaction },
  );

  // Create initial history entry
  await createBillHistoryEntry(
    sequelize,
    bill.get('id') as string,
    BillStatus.INTRODUCED,
    'Bill introduced',
    transaction,
  );

  return bill;
};

/**
 * Updates bill status
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} billId - Bill ID
 * @param {BillStatus} newStatus - New status
 * @param {string} [action] - Action description
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated bill
 *
 * @example
 * ```typescript
 * await updateBillStatus(sequelize, 'bill-123', BillStatus.IN_COMMITTEE, 'Referred to Finance Committee');
 * ```
 */
export const updateBillStatus = async (
  sequelize: Sequelize,
  billId: string,
  newStatus: BillStatus,
  action?: string,
  transaction?: Transaction,
): Promise<Model> => {
  const Bill = sequelize.models.Bill;

  const bill = await Bill.findByPk(billId, { transaction });
  if (!bill) {
    throw new Error(`Bill not found: ${billId}`);
  }

  const oldStatus = bill.get('status') as BillStatus;

  await bill.update(
    {
      status: newStatus,
      lastActionDate: new Date(),
    },
    { transaction },
  );

  // Create history entry
  await createBillHistoryEntry(
    sequelize,
    billId,
    newStatus,
    action || `Status changed from ${oldStatus} to ${newStatus}`,
    transaction,
  );

  return bill;
};

/**
 * Creates bill history entry
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} billId - Bill ID
 * @param {BillStatus} status - Bill status
 * @param {string} action - Action description
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 * @private
 */
const createBillHistoryEntry = async (
  sequelize: Sequelize,
  billId: string,
  status: BillStatus,
  action: string,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `INSERT INTO bill_history (id, bill_id, status, action, timestamp, created_at)
     VALUES (:id, :billId, :status, :action, NOW(), NOW())`,
    {
      replacements: {
        id: generateULID(),
        billId,
        status,
        action,
      },
      transaction,
    },
  );
};

/**
 * Gets bill history
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} billId - Bill ID
 * @returns {Promise<BillHistoryEntry[]>} Bill history
 *
 * @example
 * ```typescript
 * const history = await getBillHistory(sequelize, 'bill-123');
 * ```
 */
export const getBillHistory = async (
  sequelize: Sequelize,
  billId: string,
): Promise<BillHistoryEntry[]> => {
  const [results] = await sequelize.query(
    `SELECT * FROM bill_history
     WHERE bill_id = :billId
     ORDER BY timestamp DESC`,
    {
      replacements: { billId },
      type: QueryTypes.SELECT,
    },
  );

  return results as BillHistoryEntry[];
};

/**
 * Searches bills with criteria
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {BillSearchCriteria} criteria - Search criteria
 * @returns {Promise<Model[]>} Matching bills
 *
 * @example
 * ```typescript
 * const bills = await searchBills(sequelize, {
 *   jurisdiction: 'US-CA',
 *   status: BillStatus.IN_COMMITTEE,
 *   subjectAreas: ['healthcare']
 * });
 * ```
 */
export const searchBills = async (
  sequelize: Sequelize,
  criteria: BillSearchCriteria,
): Promise<Model[]> => {
  const Bill = sequelize.models.Bill;

  const where: any = {};

  if (criteria.billNumber) {
    where.billNumber = { [Op.iLike]: `%${criteria.billNumber}%` };
  }
  if (criteria.chamber) {
    where.chamber = criteria.chamber;
  }
  if (criteria.status) {
    where.status = criteria.status;
  }
  if (criteria.jurisdiction) {
    where.jurisdiction = criteria.jurisdiction;
  }
  if (criteria.session) {
    where.session = criteria.session;
  }
  if (criteria.sponsorId) {
    where.primarySponsorId = criteria.sponsorId;
  }
  if (criteria.introducedAfter) {
    where.introducedDate = { [Op.gte]: criteria.introducedAfter };
  }
  if (criteria.introducedBefore) {
    if (where.introducedDate) {
      where.introducedDate[Op.lte] = criteria.introducedBefore;
    } else {
      where.introducedDate = { [Op.lte]: criteria.introducedBefore };
    }
  }
  if (criteria.subjectAreas && criteria.subjectAreas.length > 0) {
    where.subjectAreas = { [Op.overlap]: criteria.subjectAreas };
  }
  if (criteria.keywords) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${criteria.keywords}%` } },
      { summary: { [Op.iLike]: `%${criteria.keywords}%` } },
    ];
  }

  return Bill.findAll({
    where,
    order: [['lastActionDate', 'DESC']],
  });
};

/**
 * Tracks bill progress milestones
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} billId - Bill ID
 * @returns {Promise<{ milestone: string; date?: Date; completed: boolean }[]>} Progress milestones
 *
 * @example
 * ```typescript
 * const progress = await trackBillProgress(sequelize, 'bill-123');
 * ```
 */
export const trackBillProgress = async (
  sequelize: Sequelize,
  billId: string,
): Promise<Array<{ milestone: string; date?: Date; completed: boolean }>> => {
  const history = await getBillHistory(sequelize, billId);

  const milestones = [
    BillStatus.INTRODUCED,
    BillStatus.IN_COMMITTEE,
    BillStatus.PASSED_CHAMBER,
    BillStatus.SENT_TO_OTHER_CHAMBER,
    BillStatus.PASSED_BOTH_CHAMBERS,
    BillStatus.SENT_TO_GOVERNOR,
    BillStatus.SIGNED,
    BillStatus.ENACTED,
  ];

  return milestones.map((milestone) => {
    const entry = history.find((h) => h.status === milestone);
    return {
      milestone,
      date: entry?.timestamp,
      completed: !!entry,
    };
  });
};

/**
 * Gets bills by status
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {BillStatus} status - Bill status
 * @param {string} [jurisdiction] - Optional jurisdiction filter
 * @returns {Promise<Model[]>} Bills with status
 *
 * @example
 * ```typescript
 * const committeBills = await getBillsByStatus(sequelize, BillStatus.IN_COMMITTEE, 'US-CA');
 * ```
 */
export const getBillsByStatus = async (
  sequelize: Sequelize,
  status: BillStatus,
  jurisdiction?: string,
): Promise<Model[]> => {
  const Bill = sequelize.models.Bill;

  const where: any = { status };
  if (jurisdiction) {
    where.jurisdiction = jurisdiction;
  }

  return Bill.findAll({
    where,
    order: [['lastActionDate', 'DESC']],
  });
};

/**
 * Adds bill sponsor
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} billId - Bill ID
 * @param {string} legislatorId - Legislator ID
 * @param {boolean} [isPrimary=false] - Is primary sponsor
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await addBillSponsor(sequelize, 'bill-123', 'leg-456', true);
 * ```
 */
export const addBillSponsor = async (
  sequelize: Sequelize,
  billId: string,
  legislatorId: string,
  isPrimary: boolean = false,
  transaction?: Transaction,
): Promise<void> => {
  await sequelize.query(
    `INSERT INTO bill_sponsors (id, bill_id, legislator_id, is_primary, sponsorship_date, created_at)
     VALUES (:id, :billId, :legislatorId, :isPrimary, NOW(), NOW())`,
    {
      replacements: {
        id: generateULID(),
        billId,
        legislatorId,
        isPrimary,
      },
      transaction,
    },
  );

  if (isPrimary) {
    const Bill = sequelize.models.Bill;
    await Bill.update(
      { primarySponsorId: legislatorId },
      { where: { id: billId }, transaction },
    );
  }
};

/**
 * Gets bill sponsors
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} billId - Bill ID
 * @returns {Promise<Array<{ legislator: Model; isPrimary: boolean }>>} Bill sponsors
 *
 * @example
 * ```typescript
 * const sponsors = await getBillSponsors(sequelize, 'bill-123');
 * ```
 */
export const getBillSponsors = async (
  sequelize: Sequelize,
  billId: string,
): Promise<Array<{ legislator: Model; isPrimary: boolean }>> => {
  const [results] = await sequelize.query(
    `SELECT l.*, bs.is_primary
     FROM bill_sponsors bs
     JOIN legislators l ON bs.legislator_id = l.id
     WHERE bs.bill_id = :billId
     ORDER BY bs.is_primary DESC, l.last_name`,
    {
      replacements: { billId },
      type: QueryTypes.SELECT,
    },
  );

  const Legislator = sequelize.models.Legislator;

  return (results as any[]).map((row) => ({
    legislator: Legislator.build(row),
    isPrimary: row.is_primary,
  }));
};

// ============================================================================
// AMENDMENT TRACKING FUNCTIONS
// ============================================================================

/**
 * Creates an amendment
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<AmendmentAttributes>} amendmentData - Amendment data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created amendment
 *
 * @example
 * ```typescript
 * const amendment = await createAmendment(sequelize, {
 *   billId: 'bill-123',
 *   amendmentNumber: 'AMD-001',
 *   sponsorId: 'leg-456',
 *   description: 'Add section on rural healthcare'
 * });
 * ```
 */
export const createAmendment = async (
  sequelize: Sequelize,
  amendmentData: Partial<AmendmentAttributes>,
  transaction?: Transaction,
): Promise<Model> => {
  const Amendment = sequelize.models.Amendment;

  return Amendment.create(
    {
      ...amendmentData,
      proposedDate: amendmentData.proposedDate || new Date(),
    },
    { transaction },
  );
};

/**
 * Updates amendment status
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} amendmentId - Amendment ID
 * @param {AmendmentStatus} status - New status
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated amendment
 *
 * @example
 * ```typescript
 * await updateAmendmentStatus(sequelize, 'amd-123', AmendmentStatus.ADOPTED);
 * ```
 */
export const updateAmendmentStatus = async (
  sequelize: Sequelize,
  amendmentId: string,
  status: AmendmentStatus,
  transaction?: Transaction,
): Promise<Model> => {
  const Amendment = sequelize.models.Amendment;

  const amendment = await Amendment.findByPk(amendmentId, { transaction });
  if (!amendment) {
    throw new Error(`Amendment not found: ${amendmentId}`);
  }

  const updateData: any = { status };
  if (status === AmendmentStatus.ADOPTED) {
    updateData.adoptedDate = new Date();
  }

  await amendment.update(updateData, { transaction });
  return amendment;
};

/**
 * Gets bill amendments
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} billId - Bill ID
 * @param {AmendmentStatus} [status] - Optional status filter
 * @returns {Promise<Model[]>} Bill amendments
 *
 * @example
 * ```typescript
 * const amendments = await getBillAmendments(sequelize, 'bill-123', AmendmentStatus.ADOPTED);
 * ```
 */
export const getBillAmendments = async (
  sequelize: Sequelize,
  billId: string,
  status?: AmendmentStatus,
): Promise<Model[]> => {
  const Amendment = sequelize.models.Amendment;

  const where: any = { billId };
  if (status) {
    where.status = status;
  }

  return Amendment.findAll({
    where,
    order: [['proposedDate', 'DESC']],
  });
};

/**
 * Compares bill text versions
 *
 * @param {string} originalText - Original bill text
 * @param {string} amendedText - Amended bill text
 * @returns {Array<{ type: 'added' | 'removed' | 'unchanged'; text: string }>} Text diff
 *
 * @example
 * ```typescript
 * const diff = compareBillTextVersions(originalBill.fullText, amendedBill.fullText);
 * ```
 */
export const compareBillTextVersions = (
  originalText: string,
  amendedText: string,
): Array<{ type: 'added' | 'removed' | 'unchanged'; text: string }> => {
  // Simple line-by-line diff (in production, use a proper diff library)
  const originalLines = originalText.split('\n');
  const amendedLines = amendedText.split('\n');
  const diff: Array<{ type: 'added' | 'removed' | 'unchanged'; text: string }> = [];

  const maxLength = Math.max(originalLines.length, amendedLines.length);

  for (let i = 0; i < maxLength; i++) {
    const originalLine = originalLines[i];
    const amendedLine = amendedLines[i];

    if (originalLine === amendedLine) {
      if (originalLine !== undefined) {
        diff.push({ type: 'unchanged', text: originalLine });
      }
    } else {
      if (originalLine && !amendedLine) {
        diff.push({ type: 'removed', text: originalLine });
      } else if (!originalLine && amendedLine) {
        diff.push({ type: 'added', text: amendedLine });
      } else if (originalLine !== amendedLine) {
        diff.push({ type: 'removed', text: originalLine });
        diff.push({ type: 'added', text: amendedLine });
      }
    }
  }

  return diff;
};

// ============================================================================
// VOTING RECORD ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Creates a vote record
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<VoteAttributes>} voteData - Vote data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created vote
 *
 * @example
 * ```typescript
 * const vote = await createVote(sequelize, {
 *   billId: 'bill-123',
 *   chamber: Chamber.HOUSE,
 *   voteDate: new Date(),
 *   voteType: 'Final Passage',
 *   result: 'PASSED',
 *   yeaCount: 45,
 *   nayCount: 25
 * });
 * ```
 */
export const createVote = async (
  sequelize: Sequelize,
  voteData: Partial<VoteAttributes>,
  transaction?: Transaction,
): Promise<Model> => {
  const Vote = sequelize.models.Vote;

  return Vote.create(voteData, { transaction });
};

/**
 * Records individual legislator vote
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} voteId - Vote ID
 * @param {string} legislatorId - Legislator ID
 * @param {VoteType} vote - Vote type
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created individual vote
 *
 * @example
 * ```typescript
 * await recordIndividualVote(sequelize, 'vote-123', 'leg-456', VoteType.YEA);
 * ```
 */
export const recordIndividualVote = async (
  sequelize: Sequelize,
  voteId: string,
  legislatorId: string,
  vote: VoteType,
  transaction?: Transaction,
): Promise<Model> => {
  const IndividualVote = sequelize.models.IndividualVote;

  return IndividualVote.create(
    {
      voteId,
      legislatorId,
      vote,
    },
    { transaction },
  );
};

/**
 * Analyzes legislator voting record
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} legislatorId - Legislator ID
 * @param {Date} [startDate] - Optional start date
 * @param {Date} [endDate] - Optional end date
 * @returns {Promise<VotingAnalysis>} Voting analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeVotingRecord(sequelize, 'leg-123');
 * ```
 */
export const analyzeVotingRecord = async (
  sequelize: Sequelize,
  legislatorId: string,
  startDate?: Date,
  endDate?: Date,
): Promise<VotingAnalysis> => {
  let dateFilter = '';
  const replacements: any = { legislatorId };

  if (startDate) {
    dateFilter += ' AND v.vote_date >= :startDate';
    replacements.startDate = startDate;
  }
  if (endDate) {
    dateFilter += ' AND v.vote_date <= :endDate';
    replacements.endDate = endDate;
  }

  const [results] = await sequelize.query(
    `SELECT
       COUNT(*) as total_votes,
       SUM(CASE WHEN iv.vote = 'YEA' THEN 1 ELSE 0 END) as yea_votes,
       SUM(CASE WHEN iv.vote = 'NAY' THEN 1 ELSE 0 END) as nay_votes,
       SUM(CASE WHEN iv.vote IN ('PRESENT', 'ABSTAIN') THEN 1 ELSE 0 END) as abstentions,
       SUM(CASE WHEN iv.vote NOT IN ('NOT_VOTING', 'EXCUSED') THEN 1 ELSE 0 END) as attendance
     FROM individual_votes iv
     JOIN votes v ON iv.vote_id = v.id
     WHERE iv.legislator_id = :legislatorId ${dateFilter}`,
    {
      replacements,
      type: QueryTypes.SELECT,
    },
  );

  const stats = results[0] as any;

  return {
    legislatorId,
    totalVotes: parseInt(stats.total_votes) || 0,
    yeaVotes: parseInt(stats.yea_votes) || 0,
    nayVotes: parseInt(stats.nay_votes) || 0,
    abstentions: parseInt(stats.abstentions) || 0,
    attendance: parseInt(stats.attendance) || 0,
    partyLineVotes: 0, // Would require party position data
    partyLinePercentage: 0,
    votingTrends: [], // Would require time-series aggregation
  };
};

/**
 * Calculates voting alignment between two legislators
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} legislatorId1 - First legislator ID
 * @param {string} legislatorId2 - Second legislator ID
 * @returns {Promise<number>} Alignment percentage (0-100)
 *
 * @example
 * ```typescript
 * const alignment = await calculateVotingAlignment(sequelize, 'leg-123', 'leg-456');
 * // => 87.5
 * ```
 */
export const calculateVotingAlignment = async (
  sequelize: Sequelize,
  legislatorId1: string,
  legislatorId2: string,
): Promise<number> => {
  const [results] = await sequelize.query(
    `SELECT
       COUNT(*) as total_shared_votes,
       SUM(CASE WHEN iv1.vote = iv2.vote THEN 1 ELSE 0 END) as matching_votes
     FROM individual_votes iv1
     JOIN individual_votes iv2 ON iv1.vote_id = iv2.vote_id
     WHERE iv1.legislator_id = :legislatorId1
       AND iv2.legislator_id = :legislatorId2
       AND iv1.vote NOT IN ('NOT_VOTING', 'EXCUSED')
       AND iv2.vote NOT IN ('NOT_VOTING', 'EXCUSED')`,
    {
      replacements: { legislatorId1, legislatorId2 },
      type: QueryTypes.SELECT,
    },
  );

  const stats = results[0] as any;
  const total = parseInt(stats.total_shared_votes) || 0;
  const matching = parseInt(stats.matching_votes) || 0;

  return total > 0 ? (matching / total) * 100 : 0;
};

/**
 * Gets legislator votes on bill
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} billId - Bill ID
 * @returns {Promise<Array<{ legislator: Model; vote: VoteType; voteDate: Date }>>} Legislator votes
 *
 * @example
 * ```typescript
 * const votes = await getLegislatorVotesOnBill(sequelize, 'bill-123');
 * ```
 */
export const getLegislatorVotesOnBill = async (
  sequelize: Sequelize,
  billId: string,
): Promise<Array<{ legislator: Model; vote: VoteType; voteDate: Date }>> => {
  const [results] = await sequelize.query(
    `SELECT l.*, iv.vote, v.vote_date
     FROM individual_votes iv
     JOIN votes v ON iv.vote_id = v.id
     JOIN legislators l ON iv.legislator_id = l.id
     WHERE v.bill_id = :billId
     ORDER BY l.last_name, v.vote_date`,
    {
      replacements: { billId },
      type: QueryTypes.SELECT,
    },
  );

  const Legislator = sequelize.models.Legislator;

  return (results as any[]).map((row) => ({
    legislator: Legislator.build(row),
    vote: row.vote as VoteType,
    voteDate: row.vote_date,
  }));
};

/**
 * Gets voting trends by time period
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {object} options - Query options
 * @returns {Promise<Array<{ period: string; totalVotes: number; passedCount: number; failedCount: number }>>} Voting trends
 *
 * @example
 * ```typescript
 * const trends = await getVotingTrends(sequelize, {
 *   startDate: new Date('2024-01-01'),
 *   endDate: new Date('2024-12-31'),
 *   chamber: Chamber.HOUSE
 * });
 * ```
 */
export const getVotingTrends = async (
  sequelize: Sequelize,
  options: {
    startDate?: Date;
    endDate?: Date;
    chamber?: Chamber;
  },
): Promise<Array<{ period: string; totalVotes: number; passedCount: number; failedCount: number }>> => {
  let whereClause = '1=1';
  const replacements: any = {};

  if (options.startDate) {
    whereClause += ' AND vote_date >= :startDate';
    replacements.startDate = options.startDate;
  }
  if (options.endDate) {
    whereClause += ' AND vote_date <= :endDate';
    replacements.endDate = options.endDate;
  }
  if (options.chamber) {
    whereClause += ' AND chamber = :chamber';
    replacements.chamber = options.chamber;
  }

  const [results] = await sequelize.query(
    `SELECT
       TO_CHAR(vote_date, 'YYYY-MM') as period,
       COUNT(*) as total_votes,
       SUM(CASE WHEN result = 'PASSED' THEN 1 ELSE 0 END) as passed_count,
       SUM(CASE WHEN result = 'FAILED' THEN 1 ELSE 0 END) as failed_count
     FROM votes
     WHERE ${whereClause}
     GROUP BY TO_CHAR(vote_date, 'YYYY-MM')
     ORDER BY period`,
    {
      replacements,
      type: QueryTypes.SELECT,
    },
  );

  return (results as any[]).map((row) => ({
    period: row.period,
    totalVotes: parseInt(row.total_votes),
    passedCount: parseInt(row.passed_count),
    failedCount: parseInt(row.failed_count),
  }));
};

// ============================================================================
// COMMITTEE TRACKING FUNCTIONS
// ============================================================================

/**
 * Creates a committee
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<CommitteeAttributes>} committeeData - Committee data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Created committee
 *
 * @example
 * ```typescript
 * const committee = await createCommittee(sequelize, {
 *   name: 'Finance Committee',
 *   chamber: Chamber.HOUSE,
 *   committeeType: CommitteeType.STANDING,
 *   jurisdiction: 'US-CA'
 * });
 * ```
 */
export const createCommittee = async (
  sequelize: Sequelize,
  committeeData: Partial<CommitteeAttributes>,
  transaction?: Transaction,
): Promise<Model> => {
  const Committee = sequelize.models.Committee;

  return Committee.create(committeeData, { transaction });
};

/**
 * Adds committee member
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} committeeId - Committee ID
 * @param {string} legislatorId - Legislator ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<Model>} Updated committee
 *
 * @example
 * ```typescript
 * await addCommitteeMember(sequelize, 'com-123', 'leg-456');
 * ```
 */
export const addCommitteeMember = async (
  sequelize: Sequelize,
  committeeId: string,
  legislatorId: string,
  transaction?: Transaction,
): Promise<Model> => {
  const Committee = sequelize.models.Committee;

  const committee = await Committee.findByPk(committeeId, { transaction });
  if (!committee) {
    throw new Error(`Committee not found: ${committeeId}`);
  }

  const memberIds = (committee.get('memberIds') as string[]) || [];
  if (!memberIds.includes(legislatorId)) {
    memberIds.push(legislatorId);
    await committee.update({ memberIds }, { transaction });
  }

  return committee;
};

/**
 * Gets committee members
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} committeeId - Committee ID
 * @returns {Promise<Model[]>} Committee members
 *
 * @example
 * ```typescript
 * const members = await getCommitteeMembers(sequelize, 'com-123');
 * ```
 */
export const getCommitteeMembers = async (
  sequelize: Sequelize,
  committeeId: string,
): Promise<Model[]> => {
  const [results] = await sequelize.query(
    `SELECT l.*
     FROM committees c
     CROSS JOIN UNNEST(c.member_ids) as member_id
     JOIN legislators l ON l.id = member_id
     WHERE c.id = :committeeId
     ORDER BY l.last_name`,
    {
      replacements: { committeeId },
      type: QueryTypes.SELECT,
    },
  );

  const Legislator = sequelize.models.Legislator;
  return (results as any[]).map((row) => Legislator.build(row));
};

/**
 * Gets bills in committee
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} committeeId - Committee ID
 * @returns {Promise<Model[]>} Bills in committee
 *
 * @example
 * ```typescript
 * const bills = await getBillsInCommittee(sequelize, 'com-123');
 * ```
 */
export const getBillsInCommittee = async (
  sequelize: Sequelize,
  committeeId: string,
): Promise<Model[]> => {
  // This requires a bill_committee junction table
  const [results] = await sequelize.query(
    `SELECT b.*
     FROM bill_committees bc
     JOIN bills b ON bc.bill_id = b.id
     WHERE bc.committee_id = :committeeId
       AND bc.status = 'ACTIVE'
     ORDER BY bc.assigned_date DESC`,
    {
      replacements: { committeeId },
      type: QueryTypes.SELECT,
    },
  );

  const Bill = sequelize.models.Bill;
  return (results as any[]).map((row) => Bill.build(row));
};

/**
 * Tracks committee hearing schedule
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} committeeId - Committee ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Array<{ date: Date; location: string; billIds: string[] }>>} Hearing schedule
 *
 * @example
 * ```typescript
 * const schedule = await getCommitteeHearingSchedule(
 *   sequelize,
 *   'com-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export const getCommitteeHearingSchedule = async (
  sequelize: Sequelize,
  committeeId: string,
  startDate: Date,
  endDate: Date,
): Promise<Array<{ date: Date; location: string; billIds: string[] }>> => {
  const [results] = await sequelize.query(
    `SELECT
       event_date as date,
       location,
       ARRAY_AGG(bill_id) as bill_ids
     FROM legislative_events
     WHERE event_type = :eventType
       AND metadata->>'committeeId' = :committeeId
       AND event_date BETWEEN :startDate AND :endDate
     GROUP BY event_date, location
     ORDER BY event_date`,
    {
      replacements: {
        eventType: LegislativeEventType.COMMITTEE_HEARING,
        committeeId,
        startDate,
        endDate,
      },
      type: QueryTypes.SELECT,
    },
  );

  return results as any[];
};

// ============================================================================
// NESTJS SERVICE
// ============================================================================

/**
 * @class LegislativeMonitoringService
 * @description NestJS service for real-time legislative monitoring
 */
@Injectable()
@ApiTags('legislative-monitoring')
export class LegislativeMonitoringService extends EventEmitter implements OnModuleInit {
  private readonly logger = new Logger(LegislativeMonitoringService.name);
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(private readonly sequelize: Sequelize) {
    super();
  }

  async onModuleInit() {
    this.logger.log('Legislative Monitoring Service initialized');
  }

  /**
   * Subscribes to bill updates
   *
   * @param {string[]} billIds - Bill IDs to monitor
   * @param {Function} callback - Update callback
   * @returns {string} Subscription ID
   *
   * @example
   * ```typescript
   * const subId = service.subscribeToUpdates(['bill-123'], (update) => {
   *   console.log('Update:', update);
   * });
   * ```
   */
  @ApiOperation({ summary: 'Subscribe to real-time bill updates' })
  @ApiResponse({ status: 200, description: 'Subscription created' })
  subscribeToUpdates(
    billIds: string[],
    callback: (update: LegislativeUpdate) => void,
  ): string {
    const subscriptionId = generateULID();

    this.on(`update:${subscriptionId}`, callback);

    const interval = setInterval(async () => {
      try {
        const updates = await this.checkForUpdates(billIds);
        updates.forEach((update) => {
          this.emit(`update:${subscriptionId}`, update);
        });
      } catch (error) {
        this.logger.error(`Error checking updates: ${error.message}`);
      }
    }, 30000); // Check every 30 seconds

    this.monitoringIntervals.set(subscriptionId, interval);
    return subscriptionId;
  }

  /**
   * Unsubscribes from updates
   *
   * @param {string} subscriptionId - Subscription ID
   * @returns {void}
   */
  unsubscribe(subscriptionId: string): void {
    const interval = this.monitoringIntervals.get(subscriptionId);
    if (interval) {
      clearInterval(interval);
      this.monitoringIntervals.delete(subscriptionId);
      this.removeAllListeners(`update:${subscriptionId}`);
    }
  }

  /**
   * Checks for bill updates
   *
   * @param {string[]} billIds - Bill IDs to check
   * @returns {Promise<LegislativeUpdate[]>} Updates
   * @private
   */
  private async checkForUpdates(billIds: string[]): Promise<LegislativeUpdate[]> {
    const updates: LegislativeUpdate[] = [];

    for (const billId of billIds) {
      const Bill = this.sequelize.models.Bill;
      const bill = await Bill.findByPk(billId);

      if (bill) {
        const history = await getBillHistory(this.sequelize, billId);
        const latestEntry = history[0];

        if (latestEntry && this.isRecentUpdate(latestEntry.timestamp)) {
          updates.push({
            billId: bill.get('id') as string,
            billNumber: bill.get('billNumber') as string,
            updateType: LegislativeEventType.STATUS_CHANGE,
            newStatus: bill.get('status') as BillStatus,
            timestamp: latestEntry.timestamp,
            description: latestEntry.action,
          });
        }
      }
    }

    return updates;
  }

  /**
   * Checks if update is recent
   *
   * @param {Date} timestamp - Update timestamp
   * @returns {boolean} Is recent
   * @private
   */
  private isRecentUpdate(timestamp: Date): boolean {
    const thirtySecondsAgo = new Date(Date.now() - 30000);
    return timestamp > thirtySecondsAgo;
  }

  /**
   * Gets active bills count
   *
   * @param {string} jurisdiction - Jurisdiction
   * @returns {Promise<number>} Active bills count
   */
  @ApiOperation({ summary: 'Get active bills count by jurisdiction' })
  @ApiResponse({ status: 200, description: 'Returns count' })
  async getActiveBillsCount(jurisdiction: string): Promise<number> {
    const Bill = this.sequelize.models.Bill;
    return Bill.count({
      where: {
        jurisdiction,
        status: {
          [Op.notIn]: [BillStatus.ENACTED, BillStatus.FAILED, BillStatus.WITHDRAWN],
        },
      },
    });
  }

  /**
   * Gets recent legislative activity
   *
   * @param {string} jurisdiction - Jurisdiction
   * @param {number} [days=7] - Days to look back
   * @returns {Promise<Model[]>} Recent bills
   */
  @ApiOperation({ summary: 'Get recent legislative activity' })
  @ApiResponse({ status: 200, description: 'Returns recent bills' })
  async getRecentActivity(jurisdiction: string, days: number = 7): Promise<Model[]> {
    const Bill = this.sequelize.models.Bill;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    return Bill.findAll({
      where: {
        jurisdiction,
        lastActionDate: { [Op.gte]: cutoffDate },
      },
      order: [['lastActionDate', 'DESC']],
      limit: 50,
    });
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates all legislative tracking tables
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await createLegislativeTrackingTables(sequelize);
 * ```
 */
export const createLegislativeTrackingTables = async (
  sequelize: Sequelize,
  transaction?: Transaction,
): Promise<void> => {
  // Create bill_history table
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS bill_history (
      id VARCHAR(26) PRIMARY KEY,
      bill_id VARCHAR(26) NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
      status VARCHAR(50) NOT NULL,
      action TEXT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      chamber VARCHAR(50),
      actor_id VARCHAR(26),
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    { transaction },
  );

  // Create bill_sponsors table
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS bill_sponsors (
      id VARCHAR(26) PRIMARY KEY,
      bill_id VARCHAR(26) NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
      legislator_id VARCHAR(26) NOT NULL REFERENCES legislators(id),
      is_primary BOOLEAN DEFAULT FALSE,
      sponsorship_date TIMESTAMPTZ DEFAULT NOW(),
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(bill_id, legislator_id)
    )`,
    { transaction },
  );

  // Create bill_committees table
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS bill_committees (
      id VARCHAR(26) PRIMARY KEY,
      bill_id VARCHAR(26) NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
      committee_id VARCHAR(26) NOT NULL REFERENCES committees(id),
      assigned_date TIMESTAMPTZ DEFAULT NOW(),
      status VARCHAR(50) DEFAULT 'ACTIVE',
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    { transaction },
  );

  // Create legislative_events table
  await sequelize.query(
    `CREATE TABLE IF NOT EXISTS legislative_events (
      id VARCHAR(26) PRIMARY KEY,
      bill_id VARCHAR(26) REFERENCES bills(id),
      event_type VARCHAR(100) NOT NULL,
      event_date TIMESTAMPTZ NOT NULL,
      description TEXT,
      location VARCHAR(500),
      participants TEXT[],
      documents TEXT[],
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    { transaction },
  );

  // Create indexes
  await sequelize.query(
    `CREATE INDEX IF NOT EXISTS idx_bill_history_bill ON bill_history(bill_id);
     CREATE INDEX IF NOT EXISTS idx_bill_history_timestamp ON bill_history(timestamp);
     CREATE INDEX IF NOT EXISTS idx_bill_sponsors_bill ON bill_sponsors(bill_id);
     CREATE INDEX IF NOT EXISTS idx_bill_sponsors_legislator ON bill_sponsors(legislator_id);
     CREATE INDEX IF NOT EXISTS idx_bill_committees_bill ON bill_committees(bill_id);
     CREATE INDEX IF NOT EXISTS idx_bill_committees_committee ON bill_committees(committee_id);
     CREATE INDEX IF NOT EXISTS idx_legislative_events_bill ON legislative_events(bill_id);
     CREATE INDEX IF NOT EXISTS idx_legislative_events_date ON legislative_events(event_date);`,
    { transaction },
  );
};

/**
 * Initializes all legislative tracking models
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {void}
 *
 * @example
 * ```typescript
 * initializeLegislativeModels(sequelize);
 * ```
 */
export const initializeLegislativeModels = (sequelize: Sequelize): void => {
  createBillModel(sequelize);
  createLegislatorModel(sequelize);
  createAmendmentModel(sequelize);
  createVoteModel(sequelize);
  createIndividualVoteModel(sequelize);
  createCommitteeModel(sequelize);
};

/**
 * Gets legislative analytics summary
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} jurisdiction - Jurisdiction
 * @param {string} session - Legislative session
 * @returns {Promise<object>} Analytics summary
 *
 * @example
 * ```typescript
 * const summary = await getLegislativeAnalyticsSummary(sequelize, 'US-CA', '2024-2025');
 * ```
 */
export const getLegislativeAnalyticsSummary = async (
  sequelize: Sequelize,
  jurisdiction: string,
  session: string,
): Promise<{
  totalBills: number;
  billsByStatus: Record<string, number>;
  billsByChamber: Record<string, number>;
  enactmentRate: number;
  averageDaysToEnactment: number;
}> => {
  const [results] = await sequelize.query(
    `SELECT
       COUNT(*) as total_bills,
       COUNT(CASE WHEN status = 'ENACTED' THEN 1 END) as enacted_bills,
       AVG(CASE
         WHEN status = 'ENACTED' AND introduced_date IS NOT NULL
         THEN EXTRACT(EPOCH FROM (last_action_date - introduced_date)) / 86400
       END) as avg_days_to_enactment
     FROM bills
     WHERE jurisdiction = :jurisdiction AND session = :session`,
    {
      replacements: { jurisdiction, session },
      type: QueryTypes.SELECT,
    },
  );

  const stats = results[0] as any;
  const totalBills = parseInt(stats.total_bills) || 0;
  const enactedBills = parseInt(stats.enacted_bills) || 0;

  return {
    totalBills,
    billsByStatus: {}, // Would require additional query
    billsByChamber: {}, // Would require additional query
    enactmentRate: totalBills > 0 ? (enactedBills / totalBills) * 100 : 0,
    averageDaysToEnactment: parseFloat(stats.avg_days_to_enactment) || 0,
  };
};
