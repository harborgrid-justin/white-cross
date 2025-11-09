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
import { Model, ModelStatic, Sequelize, Transaction } from 'sequelize';
import { OnModuleInit } from '@nestjs/common';
import { EventEmitter } from 'events';
/**
 * @enum Chamber
 * @description Legislative chamber types
 */
export declare enum Chamber {
    HOUSE = "HOUSE",
    SENATE = "SENATE",
    ASSEMBLY = "ASSEMBLY",
    COUNCIL = "COUNCIL",
    UNICAMERAL = "UNICAMERAL"
}
/**
 * @enum BillStatus
 * @description Bill lifecycle status
 */
export declare enum BillStatus {
    PREFILED = "PREFILED",
    INTRODUCED = "INTRODUCED",
    IN_COMMITTEE = "IN_COMMITTEE",
    COMMITTEE_REPORTED = "COMMITTEE_REPORTED",
    FIRST_READING = "FIRST_READING",
    SECOND_READING = "SECOND_READING",
    THIRD_READING = "THIRD_READING",
    PASSED_CHAMBER = "PASSED_CHAMBER",
    SENT_TO_OTHER_CHAMBER = "SENT_TO_OTHER_CHAMBER",
    PASSED_BOTH_CHAMBERS = "PASSED_BOTH_CHAMBERS",
    SENT_TO_GOVERNOR = "SENT_TO_GOVERNOR",
    SIGNED = "SIGNED",
    VETOED = "VETOED",
    VETO_OVERRIDDEN = "VETO_OVERRIDDEN",
    ENACTED = "ENACTED",
    FAILED = "FAILED",
    WITHDRAWN = "WITHDRAWN",
    TABLED = "TABLED"
}
/**
 * @enum VoteType
 * @description Type of legislative vote
 */
export declare enum VoteType {
    YEA = "YEA",
    NAY = "NAY",
    PRESENT = "PRESENT",
    ABSTAIN = "ABSTAIN",
    EXCUSED = "EXCUSED",
    NOT_VOTING = "NOT_VOTING"
}
/**
 * @enum AmendmentStatus
 * @description Amendment processing status
 */
export declare enum AmendmentStatus {
    PROPOSED = "PROPOSED",
    ADOPTED = "ADOPTED",
    REJECTED = "REJECTED",
    WITHDRAWN = "WITHDRAWN",
    TABLED = "TABLED"
}
/**
 * @enum CommitteeType
 * @description Type of legislative committee
 */
export declare enum CommitteeType {
    STANDING = "STANDING",
    SELECT = "SELECT",
    JOINT = "JOINT",
    SPECIAL = "SPECIAL",
    CONFERENCE = "CONFERENCE",
    SUBCOMMITTEE = "SUBCOMMITTEE"
}
/**
 * @enum PartyAffiliation
 * @description Political party affiliation
 */
export declare enum PartyAffiliation {
    DEMOCRAT = "DEMOCRAT",
    REPUBLICAN = "REPUBLICAN",
    INDEPENDENT = "INDEPENDENT",
    LIBERTARIAN = "LIBERTARIAN",
    GREEN = "GREEN",
    OTHER = "OTHER"
}
/**
 * @enum LegislativeEventType
 * @description Types of legislative events
 */
export declare enum LegislativeEventType {
    BILL_INTRODUCED = "BILL_INTRODUCED",
    COMMITTEE_HEARING = "COMMITTEE_HEARING",
    FLOOR_VOTE = "FLOOR_VOTE",
    AMENDMENT_FILED = "AMENDMENT_FILED",
    STATUS_CHANGE = "STATUS_CHANGE",
    TESTIMONY_SUBMITTED = "TESTIMONY_SUBMITTED",
    FISCAL_NOTE_ADDED = "FISCAL_NOTE_ADDED",
    VETO = "VETO",
    ENACTED = "ENACTED"
}
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
export declare const createBillModel: (sequelize: Sequelize) => ModelStatic<Model>;
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
export declare const createLegislatorModel: (sequelize: Sequelize) => ModelStatic<Model>;
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
export declare const createAmendmentModel: (sequelize: Sequelize) => ModelStatic<Model>;
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
export declare const createVoteModel: (sequelize: Sequelize) => ModelStatic<Model>;
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
export declare const createIndividualVoteModel: (sequelize: Sequelize) => ModelStatic<Model>;
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
export declare const createCommitteeModel: (sequelize: Sequelize) => ModelStatic<Model>;
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
export declare const createBill: (sequelize: Sequelize, billData: Partial<BillAttributes>, transaction?: Transaction) => Promise<Model>;
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
export declare const updateBillStatus: (sequelize: Sequelize, billId: string, newStatus: BillStatus, action?: string, transaction?: Transaction) => Promise<Model>;
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
export declare const getBillHistory: (sequelize: Sequelize, billId: string) => Promise<BillHistoryEntry[]>;
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
export declare const searchBills: (sequelize: Sequelize, criteria: BillSearchCriteria) => Promise<Model[]>;
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
export declare const trackBillProgress: (sequelize: Sequelize, billId: string) => Promise<Array<{
    milestone: string;
    date?: Date;
    completed: boolean;
}>>;
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
export declare const getBillsByStatus: (sequelize: Sequelize, status: BillStatus, jurisdiction?: string) => Promise<Model[]>;
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
export declare const addBillSponsor: (sequelize: Sequelize, billId: string, legislatorId: string, isPrimary?: boolean, transaction?: Transaction) => Promise<void>;
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
export declare const getBillSponsors: (sequelize: Sequelize, billId: string) => Promise<Array<{
    legislator: Model;
    isPrimary: boolean;
}>>;
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
export declare const createAmendment: (sequelize: Sequelize, amendmentData: Partial<AmendmentAttributes>, transaction?: Transaction) => Promise<Model>;
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
export declare const updateAmendmentStatus: (sequelize: Sequelize, amendmentId: string, status: AmendmentStatus, transaction?: Transaction) => Promise<Model>;
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
export declare const getBillAmendments: (sequelize: Sequelize, billId: string, status?: AmendmentStatus) => Promise<Model[]>;
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
export declare const compareBillTextVersions: (originalText: string, amendedText: string) => Array<{
    type: "added" | "removed" | "unchanged";
    text: string;
}>;
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
export declare const createVote: (sequelize: Sequelize, voteData: Partial<VoteAttributes>, transaction?: Transaction) => Promise<Model>;
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
export declare const recordIndividualVote: (sequelize: Sequelize, voteId: string, legislatorId: string, vote: VoteType, transaction?: Transaction) => Promise<Model>;
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
export declare const analyzeVotingRecord: (sequelize: Sequelize, legislatorId: string, startDate?: Date, endDate?: Date) => Promise<VotingAnalysis>;
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
export declare const calculateVotingAlignment: (sequelize: Sequelize, legislatorId1: string, legislatorId2: string) => Promise<number>;
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
export declare const getLegislatorVotesOnBill: (sequelize: Sequelize, billId: string) => Promise<Array<{
    legislator: Model;
    vote: VoteType;
    voteDate: Date;
}>>;
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
export declare const getVotingTrends: (sequelize: Sequelize, options: {
    startDate?: Date;
    endDate?: Date;
    chamber?: Chamber;
}) => Promise<Array<{
    period: string;
    totalVotes: number;
    passedCount: number;
    failedCount: number;
}>>;
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
export declare const createCommittee: (sequelize: Sequelize, committeeData: Partial<CommitteeAttributes>, transaction?: Transaction) => Promise<Model>;
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
export declare const addCommitteeMember: (sequelize: Sequelize, committeeId: string, legislatorId: string, transaction?: Transaction) => Promise<Model>;
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
export declare const getCommitteeMembers: (sequelize: Sequelize, committeeId: string) => Promise<Model[]>;
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
export declare const getBillsInCommittee: (sequelize: Sequelize, committeeId: string) => Promise<Model[]>;
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
export declare const getCommitteeHearingSchedule: (sequelize: Sequelize, committeeId: string, startDate: Date, endDate: Date) => Promise<Array<{
    date: Date;
    location: string;
    billIds: string[];
}>>;
/**
 * @class LegislativeMonitoringService
 * @description NestJS service for real-time legislative monitoring
 */
export declare class LegislativeMonitoringService extends EventEmitter implements OnModuleInit {
    private readonly sequelize;
    private readonly logger;
    private monitoringIntervals;
    constructor(sequelize: Sequelize);
    onModuleInit(): Promise<void>;
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
    subscribeToUpdates(billIds: string[], callback: (update: LegislativeUpdate) => void): string;
    /**
     * Unsubscribes from updates
     *
     * @param {string} subscriptionId - Subscription ID
     * @returns {void}
     */
    unsubscribe(subscriptionId: string): void;
    /**
     * Checks for bill updates
     *
     * @param {string[]} billIds - Bill IDs to check
     * @returns {Promise<LegislativeUpdate[]>} Updates
     * @private
     */
    private checkForUpdates;
    /**
     * Checks if update is recent
     *
     * @param {Date} timestamp - Update timestamp
     * @returns {boolean} Is recent
     * @private
     */
    private isRecentUpdate;
    /**
     * Gets active bills count
     *
     * @param {string} jurisdiction - Jurisdiction
     * @returns {Promise<number>} Active bills count
     */
    getActiveBillsCount(jurisdiction: string): Promise<number>;
    /**
     * Gets recent legislative activity
     *
     * @param {string} jurisdiction - Jurisdiction
     * @param {number} [days=7] - Days to look back
     * @returns {Promise<Model[]>} Recent bills
     */
    getRecentActivity(jurisdiction: string, days?: number): Promise<Model[]>;
}
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
export declare const createLegislativeTrackingTables: (sequelize: Sequelize, transaction?: Transaction) => Promise<void>;
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
export declare const initializeLegislativeModels: (sequelize: Sequelize) => void;
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
export declare const getLegislativeAnalyticsSummary: (sequelize: Sequelize, jurisdiction: string, session: string) => Promise<{
    totalBills: number;
    billsByStatus: Record<string, number>;
    billsByChamber: Record<string, number>;
    enactmentRate: number;
    averageDaysToEnactment: number;
}>;
//# sourceMappingURL=legislative-tracking-kit.d.ts.map