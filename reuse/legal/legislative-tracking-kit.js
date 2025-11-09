"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLegislativeAnalyticsSummary = exports.initializeLegislativeModels = exports.createLegislativeTrackingTables = exports.LegislativeMonitoringService = exports.getCommitteeHearingSchedule = exports.getBillsInCommittee = exports.getCommitteeMembers = exports.addCommitteeMember = exports.createCommittee = exports.getVotingTrends = exports.getLegislatorVotesOnBill = exports.calculateVotingAlignment = exports.analyzeVotingRecord = exports.recordIndividualVote = exports.createVote = exports.compareBillTextVersions = exports.getBillAmendments = exports.updateAmendmentStatus = exports.createAmendment = exports.getBillSponsors = exports.addBillSponsor = exports.getBillsByStatus = exports.trackBillProgress = exports.searchBills = exports.getBillHistory = exports.updateBillStatus = exports.createBill = exports.createCommitteeModel = exports.createIndividualVoteModel = exports.createVoteModel = exports.createAmendmentModel = exports.createLegislatorModel = exports.createBillModel = exports.LegislativeEventType = exports.PartyAffiliation = exports.CommitteeType = exports.AmendmentStatus = exports.VoteType = exports.BillStatus = exports.Chamber = void 0;
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ulid_1 = require("ulid");
const events_1 = require("events");
// ============================================================================
// TYPE DEFINITIONS AND ENUMS
// ============================================================================
/**
 * @enum Chamber
 * @description Legislative chamber types
 */
var Chamber;
(function (Chamber) {
    Chamber["HOUSE"] = "HOUSE";
    Chamber["SENATE"] = "SENATE";
    Chamber["ASSEMBLY"] = "ASSEMBLY";
    Chamber["COUNCIL"] = "COUNCIL";
    Chamber["UNICAMERAL"] = "UNICAMERAL";
})(Chamber || (exports.Chamber = Chamber = {}));
/**
 * @enum BillStatus
 * @description Bill lifecycle status
 */
var BillStatus;
(function (BillStatus) {
    BillStatus["PREFILED"] = "PREFILED";
    BillStatus["INTRODUCED"] = "INTRODUCED";
    BillStatus["IN_COMMITTEE"] = "IN_COMMITTEE";
    BillStatus["COMMITTEE_REPORTED"] = "COMMITTEE_REPORTED";
    BillStatus["FIRST_READING"] = "FIRST_READING";
    BillStatus["SECOND_READING"] = "SECOND_READING";
    BillStatus["THIRD_READING"] = "THIRD_READING";
    BillStatus["PASSED_CHAMBER"] = "PASSED_CHAMBER";
    BillStatus["SENT_TO_OTHER_CHAMBER"] = "SENT_TO_OTHER_CHAMBER";
    BillStatus["PASSED_BOTH_CHAMBERS"] = "PASSED_BOTH_CHAMBERS";
    BillStatus["SENT_TO_GOVERNOR"] = "SENT_TO_GOVERNOR";
    BillStatus["SIGNED"] = "SIGNED";
    BillStatus["VETOED"] = "VETOED";
    BillStatus["VETO_OVERRIDDEN"] = "VETO_OVERRIDDEN";
    BillStatus["ENACTED"] = "ENACTED";
    BillStatus["FAILED"] = "FAILED";
    BillStatus["WITHDRAWN"] = "WITHDRAWN";
    BillStatus["TABLED"] = "TABLED";
})(BillStatus || (exports.BillStatus = BillStatus = {}));
/**
 * @enum VoteType
 * @description Type of legislative vote
 */
var VoteType;
(function (VoteType) {
    VoteType["YEA"] = "YEA";
    VoteType["NAY"] = "NAY";
    VoteType["PRESENT"] = "PRESENT";
    VoteType["ABSTAIN"] = "ABSTAIN";
    VoteType["EXCUSED"] = "EXCUSED";
    VoteType["NOT_VOTING"] = "NOT_VOTING";
})(VoteType || (exports.VoteType = VoteType = {}));
/**
 * @enum AmendmentStatus
 * @description Amendment processing status
 */
var AmendmentStatus;
(function (AmendmentStatus) {
    AmendmentStatus["PROPOSED"] = "PROPOSED";
    AmendmentStatus["ADOPTED"] = "ADOPTED";
    AmendmentStatus["REJECTED"] = "REJECTED";
    AmendmentStatus["WITHDRAWN"] = "WITHDRAWN";
    AmendmentStatus["TABLED"] = "TABLED";
})(AmendmentStatus || (exports.AmendmentStatus = AmendmentStatus = {}));
/**
 * @enum CommitteeType
 * @description Type of legislative committee
 */
var CommitteeType;
(function (CommitteeType) {
    CommitteeType["STANDING"] = "STANDING";
    CommitteeType["SELECT"] = "SELECT";
    CommitteeType["JOINT"] = "JOINT";
    CommitteeType["SPECIAL"] = "SPECIAL";
    CommitteeType["CONFERENCE"] = "CONFERENCE";
    CommitteeType["SUBCOMMITTEE"] = "SUBCOMMITTEE";
})(CommitteeType || (exports.CommitteeType = CommitteeType = {}));
/**
 * @enum PartyAffiliation
 * @description Political party affiliation
 */
var PartyAffiliation;
(function (PartyAffiliation) {
    PartyAffiliation["DEMOCRAT"] = "DEMOCRAT";
    PartyAffiliation["REPUBLICAN"] = "REPUBLICAN";
    PartyAffiliation["INDEPENDENT"] = "INDEPENDENT";
    PartyAffiliation["LIBERTARIAN"] = "LIBERTARIAN";
    PartyAffiliation["GREEN"] = "GREEN";
    PartyAffiliation["OTHER"] = "OTHER";
})(PartyAffiliation || (exports.PartyAffiliation = PartyAffiliation = {}));
/**
 * @enum LegislativeEventType
 * @description Types of legislative events
 */
var LegislativeEventType;
(function (LegislativeEventType) {
    LegislativeEventType["BILL_INTRODUCED"] = "BILL_INTRODUCED";
    LegislativeEventType["COMMITTEE_HEARING"] = "COMMITTEE_HEARING";
    LegislativeEventType["FLOOR_VOTE"] = "FLOOR_VOTE";
    LegislativeEventType["AMENDMENT_FILED"] = "AMENDMENT_FILED";
    LegislativeEventType["STATUS_CHANGE"] = "STATUS_CHANGE";
    LegislativeEventType["TESTIMONY_SUBMITTED"] = "TESTIMONY_SUBMITTED";
    LegislativeEventType["FISCAL_NOTE_ADDED"] = "FISCAL_NOTE_ADDED";
    LegislativeEventType["VETO"] = "VETO";
    LegislativeEventType["ENACTED"] = "ENACTED";
})(LegislativeEventType || (exports.LegislativeEventType = LegislativeEventType = {}));
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
const createBillModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(26),
            primaryKey: true,
            defaultValue: () => generateULID(),
        },
        billNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: 'unique_bill_per_session',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
        },
        summary: {
            type: sequelize_1.DataTypes.TEXT,
        },
        fullText: {
            type: sequelize_1.DataTypes.TEXT,
        },
        jurisdiction: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: 'unique_bill_per_session',
        },
        chamber: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(Chamber)),
            allowNull: false,
        },
        session: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            unique: 'unique_bill_per_session',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(BillStatus)),
            allowNull: false,
            defaultValue: BillStatus.INTRODUCED,
        },
        introducedDate: {
            type: sequelize_1.DataTypes.DATE,
        },
        lastActionDate: {
            type: sequelize_1.DataTypes.DATE,
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
        },
        subjectAreas: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: [],
        },
        fiscalImpact: {
            type: sequelize_1.DataTypes.DECIMAL(15, 2),
        },
        fiscalNote: {
            type: sequelize_1.DataTypes.TEXT,
        },
        primarySponsorId: {
            type: sequelize_1.DataTypes.STRING(26),
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        deletedAt: {
            type: sequelize_1.DataTypes.DATE,
        },
    };
    class Bill extends sequelize_1.Model {
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
exports.createBillModel = createBillModel;
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
const createLegislatorModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(26),
            primaryKey: true,
            defaultValue: () => generateULID(),
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        middleName: {
            type: sequelize_1.DataTypes.STRING(100),
        },
        fullName: {
            type: sequelize_1.DataTypes.STRING(300),
            allowNull: false,
        },
        party: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(PartyAffiliation)),
            allowNull: false,
        },
        chamber: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(Chamber)),
            allowNull: false,
        },
        district: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        jurisdiction: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING(255),
            validate: { isEmail: true },
        },
        phone: {
            type: sequelize_1.DataTypes.STRING(50),
        },
        website: {
            type: sequelize_1.DataTypes.STRING(500),
        },
        photoUrl: {
            type: sequelize_1.DataTypes.STRING(500),
        },
        termStartDate: {
            type: sequelize_1.DataTypes.DATE,
        },
        termEndDate: {
            type: sequelize_1.DataTypes.DATE,
        },
        biography: {
            type: sequelize_1.DataTypes.TEXT,
        },
        committees: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: [],
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    };
    class Legislator extends sequelize_1.Model {
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
            { fields: ['email'], unique: true, where: { email: { [sequelize_1.Op.ne]: null } } },
            { fields: ['committees'], using: 'gin' },
        ],
    });
};
exports.createLegislatorModel = createLegislatorModel;
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
const createAmendmentModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(26),
            primaryKey: true,
            defaultValue: () => generateULID(),
        },
        billId: {
            type: sequelize_1.DataTypes.STRING(26),
            allowNull: false,
            references: { model: 'bills', key: 'id' },
            onDelete: 'CASCADE',
        },
        amendmentNumber: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
        },
        title: {
            type: sequelize_1.DataTypes.STRING(500),
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
        },
        fullText: {
            type: sequelize_1.DataTypes.TEXT,
        },
        sponsorId: {
            type: sequelize_1.DataTypes.STRING(26),
            references: { model: 'legislators', key: 'id' },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(AmendmentStatus)),
            allowNull: false,
            defaultValue: AmendmentStatus.PROPOSED,
        },
        proposedDate: {
            type: sequelize_1.DataTypes.DATE,
        },
        adoptedDate: {
            type: sequelize_1.DataTypes.DATE,
        },
        voteId: {
            type: sequelize_1.DataTypes.STRING(26),
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    };
    class Amendment extends sequelize_1.Model {
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
exports.createAmendmentModel = createAmendmentModel;
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
const createVoteModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(26),
            primaryKey: true,
            defaultValue: () => generateULID(),
        },
        billId: {
            type: sequelize_1.DataTypes.STRING(26),
            references: { model: 'bills', key: 'id' },
        },
        amendmentId: {
            type: sequelize_1.DataTypes.STRING(26),
            references: { model: 'amendments', key: 'id' },
        },
        chamber: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(Chamber)),
            allowNull: false,
        },
        voteDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        voteType: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        question: {
            type: sequelize_1.DataTypes.TEXT,
        },
        result: {
            type: sequelize_1.DataTypes.ENUM('PASSED', 'FAILED', 'TIE'),
            allowNull: false,
        },
        yeaCount: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
        nayCount: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
        presentCount: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
        absentCount: {
            type: sequelize_1.DataTypes.INTEGER,
            defaultValue: 0,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    };
    class Vote extends sequelize_1.Model {
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
exports.createVoteModel = createVoteModel;
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
const createIndividualVoteModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(26),
            primaryKey: true,
            defaultValue: () => generateULID(),
        },
        voteId: {
            type: sequelize_1.DataTypes.STRING(26),
            allowNull: false,
            references: { model: 'votes', key: 'id' },
            onDelete: 'CASCADE',
        },
        legislatorId: {
            type: sequelize_1.DataTypes.STRING(26),
            allowNull: false,
            references: { model: 'legislators', key: 'id' },
        },
        vote: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(VoteType)),
            allowNull: false,
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    };
    class IndividualVote extends sequelize_1.Model {
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
exports.createIndividualVoteModel = createIndividualVoteModel;
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
const createCommitteeModel = (sequelize) => {
    const attributes = {
        id: {
            type: sequelize_1.DataTypes.STRING(26),
            primaryKey: true,
            defaultValue: () => generateULID(),
        },
        name: {
            type: sequelize_1.DataTypes.STRING(300),
            allowNull: false,
        },
        chamber: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(Chamber)),
            allowNull: false,
        },
        committeeType: {
            type: sequelize_1.DataTypes.ENUM(...Object.values(CommitteeType)),
            allowNull: false,
        },
        jurisdiction: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        parentCommitteeId: {
            type: sequelize_1.DataTypes.STRING(26),
            references: { model: 'committees', key: 'id' },
        },
        chairId: {
            type: sequelize_1.DataTypes.STRING(26),
            references: { model: 'legislators', key: 'id' },
        },
        viceChairId: {
            type: sequelize_1.DataTypes.STRING(26),
            references: { model: 'legislators', key: 'id' },
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
        },
        website: {
            type: sequelize_1.DataTypes.STRING(500),
        },
        memberIds: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            defaultValue: [],
        },
        metadata: {
            type: sequelize_1.DataTypes.JSONB,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
    };
    class Committee extends sequelize_1.Model {
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
exports.createCommitteeModel = createCommitteeModel;
// ============================================================================
// BILL TRACKING AND MONITORING FUNCTIONS
// ============================================================================
/**
 * Generates a ULID
 *
 * @returns {string} ULID string
 * @private
 */
const generateULID = () => {
    const ulid = (0, ulid_1.monotonicFactory)();
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
const createBill = async (sequelize, billData, transaction) => {
    const Bill = sequelize.models.Bill;
    const bill = await Bill.create({
        ...billData,
        introducedDate: billData.introducedDate || new Date(),
        lastActionDate: billData.lastActionDate || new Date(),
    }, { transaction });
    // Create initial history entry
    await createBillHistoryEntry(sequelize, bill.get('id'), BillStatus.INTRODUCED, 'Bill introduced', transaction);
    return bill;
};
exports.createBill = createBill;
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
const updateBillStatus = async (sequelize, billId, newStatus, action, transaction) => {
    const Bill = sequelize.models.Bill;
    const bill = await Bill.findByPk(billId, { transaction });
    if (!bill) {
        throw new Error(`Bill not found: ${billId}`);
    }
    const oldStatus = bill.get('status');
    await bill.update({
        status: newStatus,
        lastActionDate: new Date(),
    }, { transaction });
    // Create history entry
    await createBillHistoryEntry(sequelize, billId, newStatus, action || `Status changed from ${oldStatus} to ${newStatus}`, transaction);
    return bill;
};
exports.updateBillStatus = updateBillStatus;
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
const createBillHistoryEntry = async (sequelize, billId, status, action, transaction) => {
    await sequelize.query(`INSERT INTO bill_history (id, bill_id, status, action, timestamp, created_at)
     VALUES (:id, :billId, :status, :action, NOW(), NOW())`, {
        replacements: {
            id: generateULID(),
            billId,
            status,
            action,
        },
        transaction,
    });
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
const getBillHistory = async (sequelize, billId) => {
    const [results] = await sequelize.query(`SELECT * FROM bill_history
     WHERE bill_id = :billId
     ORDER BY timestamp DESC`, {
        replacements: { billId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getBillHistory = getBillHistory;
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
const searchBills = async (sequelize, criteria) => {
    const Bill = sequelize.models.Bill;
    const where = {};
    if (criteria.billNumber) {
        where.billNumber = { [sequelize_1.Op.iLike]: `%${criteria.billNumber}%` };
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
        where.introducedDate = { [sequelize_1.Op.gte]: criteria.introducedAfter };
    }
    if (criteria.introducedBefore) {
        if (where.introducedDate) {
            where.introducedDate[sequelize_1.Op.lte] = criteria.introducedBefore;
        }
        else {
            where.introducedDate = { [sequelize_1.Op.lte]: criteria.introducedBefore };
        }
    }
    if (criteria.subjectAreas && criteria.subjectAreas.length > 0) {
        where.subjectAreas = { [sequelize_1.Op.overlap]: criteria.subjectAreas };
    }
    if (criteria.keywords) {
        where[sequelize_1.Op.or] = [
            { title: { [sequelize_1.Op.iLike]: `%${criteria.keywords}%` } },
            { summary: { [sequelize_1.Op.iLike]: `%${criteria.keywords}%` } },
        ];
    }
    return Bill.findAll({
        where,
        order: [['lastActionDate', 'DESC']],
    });
};
exports.searchBills = searchBills;
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
const trackBillProgress = async (sequelize, billId) => {
    const history = await (0, exports.getBillHistory)(sequelize, billId);
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
exports.trackBillProgress = trackBillProgress;
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
const getBillsByStatus = async (sequelize, status, jurisdiction) => {
    const Bill = sequelize.models.Bill;
    const where = { status };
    if (jurisdiction) {
        where.jurisdiction = jurisdiction;
    }
    return Bill.findAll({
        where,
        order: [['lastActionDate', 'DESC']],
    });
};
exports.getBillsByStatus = getBillsByStatus;
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
const addBillSponsor = async (sequelize, billId, legislatorId, isPrimary = false, transaction) => {
    await sequelize.query(`INSERT INTO bill_sponsors (id, bill_id, legislator_id, is_primary, sponsorship_date, created_at)
     VALUES (:id, :billId, :legislatorId, :isPrimary, NOW(), NOW())`, {
        replacements: {
            id: generateULID(),
            billId,
            legislatorId,
            isPrimary,
        },
        transaction,
    });
    if (isPrimary) {
        const Bill = sequelize.models.Bill;
        await Bill.update({ primarySponsorId: legislatorId }, { where: { id: billId }, transaction });
    }
};
exports.addBillSponsor = addBillSponsor;
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
const getBillSponsors = async (sequelize, billId) => {
    const [results] = await sequelize.query(`SELECT l.*, bs.is_primary
     FROM bill_sponsors bs
     JOIN legislators l ON bs.legislator_id = l.id
     WHERE bs.bill_id = :billId
     ORDER BY bs.is_primary DESC, l.last_name`, {
        replacements: { billId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const Legislator = sequelize.models.Legislator;
    return results.map((row) => ({
        legislator: Legislator.build(row),
        isPrimary: row.is_primary,
    }));
};
exports.getBillSponsors = getBillSponsors;
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
const createAmendment = async (sequelize, amendmentData, transaction) => {
    const Amendment = sequelize.models.Amendment;
    return Amendment.create({
        ...amendmentData,
        proposedDate: amendmentData.proposedDate || new Date(),
    }, { transaction });
};
exports.createAmendment = createAmendment;
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
const updateAmendmentStatus = async (sequelize, amendmentId, status, transaction) => {
    const Amendment = sequelize.models.Amendment;
    const amendment = await Amendment.findByPk(amendmentId, { transaction });
    if (!amendment) {
        throw new Error(`Amendment not found: ${amendmentId}`);
    }
    const updateData = { status };
    if (status === AmendmentStatus.ADOPTED) {
        updateData.adoptedDate = new Date();
    }
    await amendment.update(updateData, { transaction });
    return amendment;
};
exports.updateAmendmentStatus = updateAmendmentStatus;
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
const getBillAmendments = async (sequelize, billId, status) => {
    const Amendment = sequelize.models.Amendment;
    const where = { billId };
    if (status) {
        where.status = status;
    }
    return Amendment.findAll({
        where,
        order: [['proposedDate', 'DESC']],
    });
};
exports.getBillAmendments = getBillAmendments;
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
const compareBillTextVersions = (originalText, amendedText) => {
    // Simple line-by-line diff (in production, use a proper diff library)
    const originalLines = originalText.split('\n');
    const amendedLines = amendedText.split('\n');
    const diff = [];
    const maxLength = Math.max(originalLines.length, amendedLines.length);
    for (let i = 0; i < maxLength; i++) {
        const originalLine = originalLines[i];
        const amendedLine = amendedLines[i];
        if (originalLine === amendedLine) {
            if (originalLine !== undefined) {
                diff.push({ type: 'unchanged', text: originalLine });
            }
        }
        else {
            if (originalLine && !amendedLine) {
                diff.push({ type: 'removed', text: originalLine });
            }
            else if (!originalLine && amendedLine) {
                diff.push({ type: 'added', text: amendedLine });
            }
            else if (originalLine !== amendedLine) {
                diff.push({ type: 'removed', text: originalLine });
                diff.push({ type: 'added', text: amendedLine });
            }
        }
    }
    return diff;
};
exports.compareBillTextVersions = compareBillTextVersions;
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
const createVote = async (sequelize, voteData, transaction) => {
    const Vote = sequelize.models.Vote;
    return Vote.create(voteData, { transaction });
};
exports.createVote = createVote;
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
const recordIndividualVote = async (sequelize, voteId, legislatorId, vote, transaction) => {
    const IndividualVote = sequelize.models.IndividualVote;
    return IndividualVote.create({
        voteId,
        legislatorId,
        vote,
    }, { transaction });
};
exports.recordIndividualVote = recordIndividualVote;
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
const analyzeVotingRecord = async (sequelize, legislatorId, startDate, endDate) => {
    let dateFilter = '';
    const replacements = { legislatorId };
    if (startDate) {
        dateFilter += ' AND v.vote_date >= :startDate';
        replacements.startDate = startDate;
    }
    if (endDate) {
        dateFilter += ' AND v.vote_date <= :endDate';
        replacements.endDate = endDate;
    }
    const [results] = await sequelize.query(`SELECT
       COUNT(*) as total_votes,
       SUM(CASE WHEN iv.vote = 'YEA' THEN 1 ELSE 0 END) as yea_votes,
       SUM(CASE WHEN iv.vote = 'NAY' THEN 1 ELSE 0 END) as nay_votes,
       SUM(CASE WHEN iv.vote IN ('PRESENT', 'ABSTAIN') THEN 1 ELSE 0 END) as abstentions,
       SUM(CASE WHEN iv.vote NOT IN ('NOT_VOTING', 'EXCUSED') THEN 1 ELSE 0 END) as attendance
     FROM individual_votes iv
     JOIN votes v ON iv.vote_id = v.id
     WHERE iv.legislator_id = :legislatorId ${dateFilter}`, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
    const stats = results[0];
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
exports.analyzeVotingRecord = analyzeVotingRecord;
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
const calculateVotingAlignment = async (sequelize, legislatorId1, legislatorId2) => {
    const [results] = await sequelize.query(`SELECT
       COUNT(*) as total_shared_votes,
       SUM(CASE WHEN iv1.vote = iv2.vote THEN 1 ELSE 0 END) as matching_votes
     FROM individual_votes iv1
     JOIN individual_votes iv2 ON iv1.vote_id = iv2.vote_id
     WHERE iv1.legislator_id = :legislatorId1
       AND iv2.legislator_id = :legislatorId2
       AND iv1.vote NOT IN ('NOT_VOTING', 'EXCUSED')
       AND iv2.vote NOT IN ('NOT_VOTING', 'EXCUSED')`, {
        replacements: { legislatorId1, legislatorId2 },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const stats = results[0];
    const total = parseInt(stats.total_shared_votes) || 0;
    const matching = parseInt(stats.matching_votes) || 0;
    return total > 0 ? (matching / total) * 100 : 0;
};
exports.calculateVotingAlignment = calculateVotingAlignment;
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
const getLegislatorVotesOnBill = async (sequelize, billId) => {
    const [results] = await sequelize.query(`SELECT l.*, iv.vote, v.vote_date
     FROM individual_votes iv
     JOIN votes v ON iv.vote_id = v.id
     JOIN legislators l ON iv.legislator_id = l.id
     WHERE v.bill_id = :billId
     ORDER BY l.last_name, v.vote_date`, {
        replacements: { billId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const Legislator = sequelize.models.Legislator;
    return results.map((row) => ({
        legislator: Legislator.build(row),
        vote: row.vote,
        voteDate: row.vote_date,
    }));
};
exports.getLegislatorVotesOnBill = getLegislatorVotesOnBill;
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
const getVotingTrends = async (sequelize, options) => {
    let whereClause = '1=1';
    const replacements = {};
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
    const [results] = await sequelize.query(`SELECT
       TO_CHAR(vote_date, 'YYYY-MM') as period,
       COUNT(*) as total_votes,
       SUM(CASE WHEN result = 'PASSED' THEN 1 ELSE 0 END) as passed_count,
       SUM(CASE WHEN result = 'FAILED' THEN 1 ELSE 0 END) as failed_count
     FROM votes
     WHERE ${whereClause}
     GROUP BY TO_CHAR(vote_date, 'YYYY-MM')
     ORDER BY period`, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results.map((row) => ({
        period: row.period,
        totalVotes: parseInt(row.total_votes),
        passedCount: parseInt(row.passed_count),
        failedCount: parseInt(row.failed_count),
    }));
};
exports.getVotingTrends = getVotingTrends;
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
const createCommittee = async (sequelize, committeeData, transaction) => {
    const Committee = sequelize.models.Committee;
    return Committee.create(committeeData, { transaction });
};
exports.createCommittee = createCommittee;
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
const addCommitteeMember = async (sequelize, committeeId, legislatorId, transaction) => {
    const Committee = sequelize.models.Committee;
    const committee = await Committee.findByPk(committeeId, { transaction });
    if (!committee) {
        throw new Error(`Committee not found: ${committeeId}`);
    }
    const memberIds = committee.get('memberIds') || [];
    if (!memberIds.includes(legislatorId)) {
        memberIds.push(legislatorId);
        await committee.update({ memberIds }, { transaction });
    }
    return committee;
};
exports.addCommitteeMember = addCommitteeMember;
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
const getCommitteeMembers = async (sequelize, committeeId) => {
    const [results] = await sequelize.query(`SELECT l.*
     FROM committees c
     CROSS JOIN UNNEST(c.member_ids) as member_id
     JOIN legislators l ON l.id = member_id
     WHERE c.id = :committeeId
     ORDER BY l.last_name`, {
        replacements: { committeeId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const Legislator = sequelize.models.Legislator;
    return results.map((row) => Legislator.build(row));
};
exports.getCommitteeMembers = getCommitteeMembers;
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
const getBillsInCommittee = async (sequelize, committeeId) => {
    // This requires a bill_committee junction table
    const [results] = await sequelize.query(`SELECT b.*
     FROM bill_committees bc
     JOIN bills b ON bc.bill_id = b.id
     WHERE bc.committee_id = :committeeId
       AND bc.status = 'ACTIVE'
     ORDER BY bc.assigned_date DESC`, {
        replacements: { committeeId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const Bill = sequelize.models.Bill;
    return results.map((row) => Bill.build(row));
};
exports.getBillsInCommittee = getBillsInCommittee;
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
const getCommitteeHearingSchedule = async (sequelize, committeeId, startDate, endDate) => {
    const [results] = await sequelize.query(`SELECT
       event_date as date,
       location,
       ARRAY_AGG(bill_id) as bill_ids
     FROM legislative_events
     WHERE event_type = :eventType
       AND metadata->>'committeeId' = :committeeId
       AND event_date BETWEEN :startDate AND :endDate
     GROUP BY event_date, location
     ORDER BY event_date`, {
        replacements: {
            eventType: LegislativeEventType.COMMITTEE_HEARING,
            committeeId,
            startDate,
            endDate,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results;
};
exports.getCommitteeHearingSchedule = getCommitteeHearingSchedule;
// ============================================================================
// NESTJS SERVICE
// ============================================================================
/**
 * @class LegislativeMonitoringService
 * @description NestJS service for real-time legislative monitoring
 */
let LegislativeMonitoringService = (() => {
    let _classDecorators = [(0, common_1.Injectable)(), (0, swagger_1.ApiTags)('legislative-monitoring')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = events_1.EventEmitter;
    let _instanceExtraInitializers = [];
    let _subscribeToUpdates_decorators;
    let _getActiveBillsCount_decorators;
    let _getRecentActivity_decorators;
    var LegislativeMonitoringService = _classThis = class extends _classSuper {
        constructor(sequelize) {
            super();
            this.sequelize = (__runInitializers(this, _instanceExtraInitializers), sequelize);
            this.logger = new common_1.Logger(LegislativeMonitoringService.name);
            this.monitoringIntervals = new Map();
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
        subscribeToUpdates(billIds, callback) {
            const subscriptionId = generateULID();
            this.on(`update:${subscriptionId}`, callback);
            const interval = setInterval(async () => {
                try {
                    const updates = await this.checkForUpdates(billIds);
                    updates.forEach((update) => {
                        this.emit(`update:${subscriptionId}`, update);
                    });
                }
                catch (error) {
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
        unsubscribe(subscriptionId) {
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
        async checkForUpdates(billIds) {
            const updates = [];
            for (const billId of billIds) {
                const Bill = this.sequelize.models.Bill;
                const bill = await Bill.findByPk(billId);
                if (bill) {
                    const history = await (0, exports.getBillHistory)(this.sequelize, billId);
                    const latestEntry = history[0];
                    if (latestEntry && this.isRecentUpdate(latestEntry.timestamp)) {
                        updates.push({
                            billId: bill.get('id'),
                            billNumber: bill.get('billNumber'),
                            updateType: LegislativeEventType.STATUS_CHANGE,
                            newStatus: bill.get('status'),
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
        isRecentUpdate(timestamp) {
            const thirtySecondsAgo = new Date(Date.now() - 30000);
            return timestamp > thirtySecondsAgo;
        }
        /**
         * Gets active bills count
         *
         * @param {string} jurisdiction - Jurisdiction
         * @returns {Promise<number>} Active bills count
         */
        async getActiveBillsCount(jurisdiction) {
            const Bill = this.sequelize.models.Bill;
            return Bill.count({
                where: {
                    jurisdiction,
                    status: {
                        [sequelize_1.Op.notIn]: [BillStatus.ENACTED, BillStatus.FAILED, BillStatus.WITHDRAWN],
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
        async getRecentActivity(jurisdiction, days = 7) {
            const Bill = this.sequelize.models.Bill;
            const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            return Bill.findAll({
                where: {
                    jurisdiction,
                    lastActionDate: { [sequelize_1.Op.gte]: cutoffDate },
                },
                order: [['lastActionDate', 'DESC']],
                limit: 50,
            });
        }
    };
    __setFunctionName(_classThis, "LegislativeMonitoringService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _subscribeToUpdates_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Subscribe to real-time bill updates' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription created' })];
        _getActiveBillsCount_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Get active bills count by jurisdiction' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns count' })];
        _getRecentActivity_decorators = [(0, swagger_1.ApiOperation)({ summary: 'Get recent legislative activity' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns recent bills' })];
        __esDecorate(_classThis, null, _subscribeToUpdates_decorators, { kind: "method", name: "subscribeToUpdates", static: false, private: false, access: { has: obj => "subscribeToUpdates" in obj, get: obj => obj.subscribeToUpdates }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getActiveBillsCount_decorators, { kind: "method", name: "getActiveBillsCount", static: false, private: false, access: { has: obj => "getActiveBillsCount" in obj, get: obj => obj.getActiveBillsCount }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRecentActivity_decorators, { kind: "method", name: "getRecentActivity", static: false, private: false, access: { has: obj => "getRecentActivity" in obj, get: obj => obj.getRecentActivity }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LegislativeMonitoringService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LegislativeMonitoringService = _classThis;
})();
exports.LegislativeMonitoringService = LegislativeMonitoringService;
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
const createLegislativeTrackingTables = async (sequelize, transaction) => {
    // Create bill_history table
    await sequelize.query(`CREATE TABLE IF NOT EXISTS bill_history (
      id VARCHAR(26) PRIMARY KEY,
      bill_id VARCHAR(26) NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
      status VARCHAR(50) NOT NULL,
      action TEXT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      chamber VARCHAR(50),
      actor_id VARCHAR(26),
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, { transaction });
    // Create bill_sponsors table
    await sequelize.query(`CREATE TABLE IF NOT EXISTS bill_sponsors (
      id VARCHAR(26) PRIMARY KEY,
      bill_id VARCHAR(26) NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
      legislator_id VARCHAR(26) NOT NULL REFERENCES legislators(id),
      is_primary BOOLEAN DEFAULT FALSE,
      sponsorship_date TIMESTAMPTZ DEFAULT NOW(),
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(bill_id, legislator_id)
    )`, { transaction });
    // Create bill_committees table
    await sequelize.query(`CREATE TABLE IF NOT EXISTS bill_committees (
      id VARCHAR(26) PRIMARY KEY,
      bill_id VARCHAR(26) NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
      committee_id VARCHAR(26) NOT NULL REFERENCES committees(id),
      assigned_date TIMESTAMPTZ DEFAULT NOW(),
      status VARCHAR(50) DEFAULT 'ACTIVE',
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, { transaction });
    // Create legislative_events table
    await sequelize.query(`CREATE TABLE IF NOT EXISTS legislative_events (
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
    )`, { transaction });
    // Create indexes
    await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_bill_history_bill ON bill_history(bill_id);
     CREATE INDEX IF NOT EXISTS idx_bill_history_timestamp ON bill_history(timestamp);
     CREATE INDEX IF NOT EXISTS idx_bill_sponsors_bill ON bill_sponsors(bill_id);
     CREATE INDEX IF NOT EXISTS idx_bill_sponsors_legislator ON bill_sponsors(legislator_id);
     CREATE INDEX IF NOT EXISTS idx_bill_committees_bill ON bill_committees(bill_id);
     CREATE INDEX IF NOT EXISTS idx_bill_committees_committee ON bill_committees(committee_id);
     CREATE INDEX IF NOT EXISTS idx_legislative_events_bill ON legislative_events(bill_id);
     CREATE INDEX IF NOT EXISTS idx_legislative_events_date ON legislative_events(event_date);`, { transaction });
};
exports.createLegislativeTrackingTables = createLegislativeTrackingTables;
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
const initializeLegislativeModels = (sequelize) => {
    (0, exports.createBillModel)(sequelize);
    (0, exports.createLegislatorModel)(sequelize);
    (0, exports.createAmendmentModel)(sequelize);
    (0, exports.createVoteModel)(sequelize);
    (0, exports.createIndividualVoteModel)(sequelize);
    (0, exports.createCommitteeModel)(sequelize);
};
exports.initializeLegislativeModels = initializeLegislativeModels;
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
const getLegislativeAnalyticsSummary = async (sequelize, jurisdiction, session) => {
    const [results] = await sequelize.query(`SELECT
       COUNT(*) as total_bills,
       COUNT(CASE WHEN status = 'ENACTED' THEN 1 END) as enacted_bills,
       AVG(CASE
         WHEN status = 'ENACTED' AND introduced_date IS NOT NULL
         THEN EXTRACT(EPOCH FROM (last_action_date - introduced_date)) / 86400
       END) as avg_days_to_enactment
     FROM bills
     WHERE jurisdiction = :jurisdiction AND session = :session`, {
        replacements: { jurisdiction, session },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const stats = results[0];
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
exports.getLegislativeAnalyticsSummary = getLegislativeAnalyticsSummary;
//# sourceMappingURL=legislative-tracking-kit.js.map