"use strict";
/**
 * LOC: LEGLH2345678
 * File: /reuse/legal/legal-hold-preservation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable legal utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Backend legal services
 *   - Compliance management modules
 *   - Discovery processing services
 *   - Records management systems
 */
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegalHoldService = exports.generateDefensibilityReport = exports.exportLegalHoldAuditTrail = exports.generateHoldStatusReport = exports.logLegalHoldAudit = exports.generateEscalationSummary = exports.getOpenEscalations = exports.resolveEscalation = exports.createEscalation = exports.archiveReleasedHold = exports.generateDispositionCertificate = exports.validateReleasePrerequisites = exports.releaseLegalHold = exports.identifyComplianceGaps = exports.generateComplianceReport = exports.performPreservationVerification = exports.getPendingInterviews = exports.recordInterviewCompletion = exports.scheduleCustodianInterview = exports.comparePreservationScopes = exports.generateScopeSummary = exports.expandPreservationScope = exports.validatePreservationScope = exports.definePreservationScope = exports.markDataSourceFailed = exports.estimatePreservationVolume = exports.getDataSourcesByCustodian = exports.updateDataSourceStatus = exports.identifyDataSources = exports.processCustodianExemption = exports.getPendingAcknowledgments = exports.sendCustodianReminders = exports.recordCustodianAcknowledgment = exports.addCustodiansToHold = exports.getActiveLegalHolds = exports.activateLegalHold = exports.validateLegalHoldNotice = exports.updateLegalHoldNotice = exports.createLegalHoldNotice = exports.createLegalHoldAuditLogModel = exports.createHoldDataSourceModel = exports.createHoldCustodianModel = exports.createLegalHoldModel = void 0;
/**
 * File: /reuse/legal/legal-hold-preservation-kit.ts
 * Locator: WC-LEGAL-LH-001
 * Purpose: Enterprise-grade Legal Hold and Data Preservation - hold notices, custodian management, preservation scope, data source tracking, release procedures
 *
 * Upstream: Independent utility module for legal hold operations
 * Downstream: ../backend/legal/*, legal controllers, compliance services, discovery processors, records management
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 38 functions for legal hold operations for litigation readiness and compliance
 *
 * LLM Context: Comprehensive legal hold utilities for production-ready legal applications.
 * Provides legal hold notice creation, custodian acknowledgment tracking, preservation scope definition,
 * data source identification, release procedures, audit trails, compliance reporting, escalation workflows,
 * custodian interviews, preservation verification, and defensible disposition.
 */
const sequelize_1 = require("sequelize");
const common_1 = require("@nestjs/common");
// ============================================================================
// SEQUELIZE MODELS
// ============================================================================
/**
 * Sequelize model for Legal Hold with matter tracking and compliance monitoring.
 *
 * @swagger
 * @openapi
 * components:
 *   schemas:
 *     LegalHold:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         matterName:
 *           type: string
 *         matterNumber:
 *           type: string
 *         status:
 *           type: string
 *           enum: [draft, active, released, expired]
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LegalHold model
 *
 * @example
 * ```typescript
 * const LegalHold = createLegalHoldModel(sequelize);
 * const hold = await LegalHold.create({
 *   matterName: 'Smith v. Acme Corp',
 *   matterNumber: 'LIT-2024-001',
 *   issueDate: new Date(),
 *   effectiveDate: new Date(),
 *   status: 'active',
 *   priority: 'high'
 * });
 * ```
 */
const createLegalHoldModel = (sequelize) => {
    class LegalHold extends sequelize_1.Model {
    }
    LegalHold.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        matterName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Matter or case name',
            validate: {
                notEmpty: true,
            },
        },
        matterNumber: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique matter identifier',
            validate: {
                notEmpty: true,
            },
        },
        issueDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date hold was issued',
        },
        effectiveDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Date hold becomes effective',
        },
        releaseDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date hold was released',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Hold description and scope',
        },
        preservationScope: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Detailed preservation scope',
        },
        relevantTimeframeStart: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Start of relevant time period',
        },
        relevantTimeframeEnd: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'End of relevant time period',
        },
        keywords: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
            comment: 'Preservation keywords',
        },
        issuedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who issued hold',
        },
        legalCounsel: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            defaultValue: '',
            comment: 'Legal counsel contact',
        },
        priority: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'medium',
            comment: 'Hold priority level',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('draft', 'active', 'released', 'expired'),
            allowNull: false,
            defaultValue: 'draft',
            comment: 'Hold status',
        },
        totalCustodians: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total custodians assigned',
        },
        acknowledgedCustodians: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Custodians who acknowledged',
        },
        totalDataSources: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total data sources identified',
        },
        preservedDataSources: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Data sources successfully preserved',
        },
        lastVerificationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last compliance verification date',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'legal_holds',
        timestamps: true,
        indexes: [
            { fields: ['matterNumber'], unique: true },
            { fields: ['status'] },
            { fields: ['priority'] },
            { fields: ['issueDate'] },
            { fields: ['effectiveDate'] },
            { fields: ['releaseDate'] },
            { fields: ['issuedBy'] },
        ],
    });
    return LegalHold;
};
exports.createLegalHoldModel = createLegalHoldModel;
/**
 * Sequelize model for Custodians with acknowledgment tracking.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} HoldCustodian model
 *
 * @example
 * ```typescript
 * const HoldCustodian = createHoldCustodianModel(sequelize);
 * const custodian = await HoldCustodian.create({
 *   holdId: 'hold-uuid',
 *   custodianId: 'EMP001',
 *   firstName: 'John',
 *   lastName: 'Smith',
 *   email: 'john.smith@example.com',
 *   status: 'active'
 * });
 * ```
 */
const createHoldCustodianModel = (sequelize) => {
    class HoldCustodian extends sequelize_1.Model {
    }
    HoldCustodian.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        holdId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Related legal hold',
        },
        custodianId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Employee/custodian identifier',
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'First name',
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Last name',
        },
        email: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Email address',
            validate: {
                isEmail: true,
            },
        },
        department: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            defaultValue: '',
            comment: 'Department',
        },
        title: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            defaultValue: '',
            comment: 'Job title',
        },
        location: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            defaultValue: '',
            comment: 'Physical location',
        },
        manager: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            defaultValue: '',
            comment: 'Manager name',
        },
        notificationSent: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Initial notification sent date',
        },
        acknowledgedDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Acknowledgment date',
        },
        acknowledgmentMethod: {
            type: sequelize_1.DataTypes.ENUM('email', 'portal', 'in_person', 'certified_mail'),
            allowNull: true,
            comment: 'How acknowledgment was received',
        },
        remindersSent: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of reminders sent',
        },
        lastReminderDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last reminder sent date',
        },
        exemptionRequested: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Exemption requested',
        },
        exemptionReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Exemption reason',
        },
        exemptionApproved: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Exemption approved',
        },
        interviewCompleted: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Custodian interview completed',
        },
        interviewDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Interview date',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'terminated', 'released'),
            allowNull: false,
            defaultValue: 'active',
            comment: 'Custodian status',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'hold_custodians',
        timestamps: true,
        indexes: [
            { fields: ['holdId'] },
            { fields: ['custodianId'] },
            { fields: ['email'] },
            { fields: ['holdId', 'custodianId'], unique: true },
            { fields: ['acknowledgedDate'] },
            { fields: ['status'] },
        ],
    });
    return HoldCustodian;
};
exports.createHoldCustodianModel = createHoldCustodianModel;
/**
 * Sequelize model for Data Source tracking with preservation status.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} HoldDataSource model
 */
const createHoldDataSourceModel = (sequelize) => {
    class HoldDataSource extends sequelize_1.Model {
    }
    HoldDataSource.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        holdId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Related legal hold',
        },
        sourceId: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'Data source identifier',
        },
        sourceName: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Data source name',
        },
        sourceType: {
            type: sequelize_1.DataTypes.ENUM('email', 'file_share', 'database', 'cloud_storage', 'mobile_device', 'physical_records', 'application', 'backup'),
            allowNull: false,
            comment: 'Type of data source',
        },
        location: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            comment: 'Source location or path',
        },
        custodianId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Associated custodian',
        },
        preservationMethod: {
            type: sequelize_1.DataTypes.ENUM('in_place', 'collection', 'backup', 'litigation_hold_flag'),
            allowNull: false,
            defaultValue: 'in_place',
            comment: 'Preservation method',
        },
        preservationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date preservation was applied',
        },
        collectionDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Date data was collected',
        },
        preservationStatus: {
            type: sequelize_1.DataTypes.ENUM('identified', 'preserved', 'collected', 'failed', 'excluded'),
            allowNull: false,
            defaultValue: 'identified',
            comment: 'Preservation status',
        },
        volumeEstimate: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            defaultValue: '',
            comment: 'Estimated data volume',
        },
        collectionMethod: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: true,
            comment: 'Collection method used',
        },
        storageLocation: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Storage location for collected data',
        },
        verificationDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last verification date',
        },
        verificationStatus: {
            type: sequelize_1.DataTypes.ENUM('pending', 'verified', 'failed'),
            allowNull: true,
            comment: 'Verification status',
        },
        failureReason: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Reason for preservation failure',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'hold_data_sources',
        timestamps: true,
        indexes: [
            { fields: ['holdId'] },
            { fields: ['sourceId'] },
            { fields: ['sourceType'] },
            { fields: ['custodianId'] },
            { fields: ['preservationStatus'] },
            { fields: ['verificationStatus'] },
        ],
    });
    return HoldDataSource;
};
exports.createHoldDataSourceModel = createHoldDataSourceModel;
/**
 * Sequelize model for Legal Hold Audit Trail.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} LegalHoldAuditLog model
 */
const createLegalHoldAuditLogModel = (sequelize) => {
    class LegalHoldAuditLog extends sequelize_1.Model {
    }
    LegalHoldAuditLog.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        entityType: {
            type: sequelize_1.DataTypes.ENUM('hold', 'custodian', 'data_source', 'acknowledgment', 'release'),
            allowNull: false,
            comment: 'Entity type',
        },
        entityId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Entity identifier',
        },
        holdId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: true,
            comment: 'Related hold ID',
        },
        action: {
            type: sequelize_1.DataTypes.ENUM('create', 'update', 'delete', 'acknowledge', 'release', 'escalate', 'verify'),
            allowNull: false,
            comment: 'Action performed',
        },
        userId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'User who performed action',
        },
        userName: {
            type: sequelize_1.DataTypes.STRING(200),
            allowNull: false,
            comment: 'User name for audit',
        },
        changes: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Change details',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: false,
            defaultValue: '',
            comment: 'IP address',
        },
        userAgent: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: false,
            defaultValue: '',
            comment: 'User agent',
        },
    }, {
        sequelize,
        tableName: 'legal_hold_audit_logs',
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ['entityType', 'entityId'] },
            { fields: ['holdId'] },
            { fields: ['userId'] },
            { fields: ['action'] },
            { fields: ['createdAt'] },
        ],
    });
    return LegalHoldAuditLog;
};
exports.createLegalHoldAuditLogModel = createLegalHoldAuditLogModel;
// ============================================================================
// LEGAL HOLD CREATION & MANAGEMENT (1-5)
// ============================================================================
/**
 * Creates a new legal hold notice with custodians and scope.
 *
 * @param {LegalHoldNoticeData} noticeData - Hold notice data
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User creating hold
 * @param {Transaction} [transaction] - Optional Sequelize transaction
 * @returns {Promise<any>} Created legal hold
 *
 * @example
 * ```typescript
 * const hold = await createLegalHoldNotice({
 *   matterName: 'Smith v. Acme Corp',
 *   matterNumber: 'LIT-2024-001',
 *   issueDate: new Date(),
 *   effectiveDate: new Date(),
 *   description: 'Employment discrimination case',
 *   preservationScope: 'All communications related to performance reviews',
 *   relevantTimeframe: { startDate: new Date('2023-01-01') },
 *   keywords: ['performance', 'review', 'discrimination'],
 *   custodianIds: ['EMP001', 'EMP002'],
 *   dataSources: ['email', 'file_share'],
 *   issuedBy: 'legal-team',
 *   priority: 'high',
 *   status: 'active'
 * }, LegalHold, 'user123');
 * ```
 */
const createLegalHoldNotice = async (noticeData, LegalHold, userId, transaction) => {
    const hold = await LegalHold.create({
        matterName: noticeData.matterName,
        matterNumber: noticeData.matterNumber,
        issueDate: noticeData.issueDate,
        effectiveDate: noticeData.effectiveDate,
        description: noticeData.description,
        preservationScope: noticeData.preservationScope,
        relevantTimeframeStart: noticeData.relevantTimeframe.startDate,
        relevantTimeframeEnd: noticeData.relevantTimeframe.endDate || null,
        keywords: noticeData.keywords,
        issuedBy: noticeData.issuedBy,
        legalCounsel: noticeData.legalCounsel || '',
        priority: noticeData.priority,
        status: noticeData.status,
        totalCustodians: noticeData.custodianIds.length,
        metadata: noticeData.metadata || {},
    }, { transaction });
    await (0, exports.logLegalHoldAudit)({
        entityType: 'hold',
        entityId: hold.id,
        holdId: hold.id,
        action: 'create',
        userId,
        timestamp: new Date(),
        changes: noticeData,
    });
    return hold;
};
exports.createLegalHoldNotice = createLegalHoldNotice;
/**
 * Updates legal hold notice with modifications and tracking.
 *
 * @param {string} holdId - Hold ID
 * @param {Partial<LegalHoldNoticeData>} updates - Updates to apply
 * @param {string} userId - User updating hold
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Updated hold
 *
 * @example
 * ```typescript
 * await updateLegalHoldNotice('hold-uuid', {
 *   keywords: ['performance', 'review', 'discrimination', 'termination']
 * }, 'user123', LegalHold);
 * ```
 */
const updateLegalHoldNotice = async (holdId, updates, userId, LegalHold) => {
    const hold = await LegalHold.findByPk(holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    const originalData = hold.toJSON();
    if (updates.keywords)
        hold.keywords = updates.keywords;
    if (updates.preservationScope)
        hold.preservationScope = updates.preservationScope;
    if (updates.description)
        hold.description = updates.description;
    if (updates.priority)
        hold.priority = updates.priority;
    if (updates.status)
        hold.status = updates.status;
    await hold.save();
    await (0, exports.logLegalHoldAudit)({
        entityType: 'hold',
        entityId: holdId,
        holdId,
        action: 'update',
        userId,
        timestamp: new Date(),
        changes: { original: originalData, updated: hold.toJSON() },
    });
    return hold;
};
exports.updateLegalHoldNotice = updateLegalHoldNotice;
/**
 * Validates legal hold notice data for completeness and compliance.
 *
 * @param {LegalHoldNoticeData} noticeData - Notice data to validate
 * @returns {Promise<{ valid: boolean; errors: string[] }>} Validation result
 *
 * @example
 * ```typescript
 * const result = await validateLegalHoldNotice(noticeData);
 * if (!result.valid) {
 *   throw new Error(result.errors.join(', '));
 * }
 * ```
 */
const validateLegalHoldNotice = async (noticeData) => {
    const errors = [];
    if (!noticeData.matterName)
        errors.push('Matter name is required');
    if (!noticeData.matterNumber)
        errors.push('Matter number is required');
    if (!noticeData.issueDate)
        errors.push('Issue date is required');
    if (!noticeData.effectiveDate)
        errors.push('Effective date is required');
    if (!noticeData.description)
        errors.push('Description is required');
    if (!noticeData.preservationScope)
        errors.push('Preservation scope is required');
    if (!noticeData.relevantTimeframe?.startDate)
        errors.push('Relevant timeframe start date is required');
    if (!noticeData.custodianIds || noticeData.custodianIds.length === 0) {
        errors.push('At least one custodian is required');
    }
    if (!noticeData.issuedBy)
        errors.push('Issued by is required');
    if (noticeData.effectiveDate < noticeData.issueDate) {
        errors.push('Effective date must be on or after issue date');
    }
    return {
        valid: errors.length === 0,
        errors,
    };
};
exports.validateLegalHoldNotice = validateLegalHoldNotice;
/**
 * Activates a draft legal hold and triggers custodian notifications.
 *
 * @param {string} holdId - Hold ID
 * @param {string} userId - User activating hold
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Activated hold
 *
 * @example
 * ```typescript
 * const activeHold = await activateLegalHold('hold-uuid', 'user123', LegalHold);
 * ```
 */
const activateLegalHold = async (holdId, userId, LegalHold) => {
    const hold = await LegalHold.findByPk(holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    if (hold.status !== 'draft') {
        throw new Error('Only draft holds can be activated');
    }
    hold.status = 'active';
    hold.effectiveDate = new Date();
    await hold.save();
    await (0, exports.logLegalHoldAudit)({
        entityType: 'hold',
        entityId: holdId,
        holdId,
        action: 'update',
        userId,
        timestamp: new Date(),
        changes: { status: 'active', effectiveDate: hold.effectiveDate },
    });
    return hold;
};
exports.activateLegalHold = activateLegalHold;
/**
 * Retrieves all active legal holds with filtering.
 *
 * @param {Object} filters - Filter criteria
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any[]>} Active legal holds
 *
 * @example
 * ```typescript
 * const activeHolds = await getActiveLegalHolds({ priority: 'high' }, LegalHold);
 * ```
 */
const getActiveLegalHolds = async (filters, LegalHold) => {
    const where = { status: 'active' };
    if (filters.priority)
        where.priority = filters.priority;
    if (filters.issuedBy)
        where.issuedBy = filters.issuedBy;
    return await LegalHold.findAll({
        where,
        order: [['priority', 'DESC'], ['issueDate', 'DESC']],
    });
};
exports.getActiveLegalHolds = getActiveLegalHolds;
// ============================================================================
// CUSTODIAN MANAGEMENT (6-10)
// ============================================================================
/**
 * Adds custodians to legal hold with notification tracking.
 *
 * @param {string} holdId - Hold ID
 * @param {CustodianData[]} custodians - Custodian data array
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User adding custodians
 * @returns {Promise<any[]>} Created custodian records
 *
 * @example
 * ```typescript
 * const custodians = await addCustodiansToHold('hold-uuid', [
 *   {
 *     employeeId: 'EMP001',
 *     firstName: 'John',
 *     lastName: 'Smith',
 *     email: 'john.smith@example.com',
 *     department: 'Engineering',
 *     title: 'Senior Engineer',
 *     location: 'New York',
 *     status: 'active'
 *   }
 * ], HoldCustodian, LegalHold, 'user123');
 * ```
 */
const addCustodiansToHold = async (holdId, custodians, HoldCustodian, LegalHold, userId) => {
    const hold = await LegalHold.findByPk(holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    const created = [];
    for (const custodian of custodians) {
        const record = await HoldCustodian.create({
            holdId,
            custodianId: custodian.employeeId,
            firstName: custodian.firstName,
            lastName: custodian.lastName,
            email: custodian.email,
            department: custodian.department,
            title: custodian.title,
            location: custodian.location,
            manager: custodian.manager || '',
            status: custodian.status,
            metadata: custodian.metadata || {},
        });
        created.push(record);
        await (0, exports.logLegalHoldAudit)({
            entityType: 'custodian',
            entityId: record.id,
            holdId,
            action: 'create',
            userId,
            timestamp: new Date(),
            changes: custodian,
        });
    }
    // Update hold custodian count
    hold.totalCustodians += custodians.length;
    await hold.save();
    return created;
};
exports.addCustodiansToHold = addCustodiansToHold;
/**
 * Records custodian acknowledgment of legal hold notice.
 *
 * @param {string} holdId - Hold ID
 * @param {string} custodianId - Custodian ID
 * @param {string} method - Acknowledgment method
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} LegalHold - LegalHold model
 * @param {string} [ipAddress] - IP address of acknowledgment
 * @returns {Promise<any>} Updated custodian record
 *
 * @example
 * ```typescript
 * await recordCustodianAcknowledgment('hold-uuid', 'EMP001', 'email', HoldCustodian, LegalHold, '192.168.1.1');
 * ```
 */
const recordCustodianAcknowledgment = async (holdId, custodianId, method, HoldCustodian, LegalHold, ipAddress) => {
    const custodian = await HoldCustodian.findOne({
        where: { holdId, custodianId },
    });
    if (!custodian)
        throw new Error('Custodian not found in legal hold');
    if (custodian.acknowledgedDate) {
        throw new Error('Custodian has already acknowledged this hold');
    }
    custodian.acknowledgedDate = new Date();
    custodian.acknowledgmentMethod = method;
    await custodian.save();
    // Update hold acknowledgment count
    const hold = await LegalHold.findByPk(holdId);
    if (hold) {
        hold.acknowledgedCustodians += 1;
        await hold.save();
    }
    await (0, exports.logLegalHoldAudit)({
        entityType: 'acknowledgment',
        entityId: custodian.id,
        holdId,
        action: 'acknowledge',
        userId: custodianId,
        timestamp: new Date(),
        changes: { method, acknowledgedDate: custodian.acknowledgedDate },
        ipAddress: ipAddress || '',
    });
    return custodian;
};
exports.recordCustodianAcknowledgment = recordCustodianAcknowledgment;
/**
 * Sends reminder to custodians who haven't acknowledged.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {any} notificationService - Notification service
 * @returns {Promise<number>} Number of reminders sent
 *
 * @example
 * ```typescript
 * const reminderCount = await sendCustodianReminders('hold-uuid', HoldCustodian, notificationService);
 * ```
 */
const sendCustodianReminders = async (holdId, HoldCustodian, notificationService) => {
    const custodians = await HoldCustodian.findAll({
        where: {
            holdId,
            acknowledgedDate: null,
            exemptionApproved: false,
        },
    });
    let sentCount = 0;
    for (const custodian of custodians) {
        // Send reminder via notification service
        // await notificationService.sendReminder(custodian);
        custodian.remindersSent += 1;
        custodian.lastReminderDate = new Date();
        await custodian.save();
        sentCount++;
    }
    return sentCount;
};
exports.sendCustodianReminders = sendCustodianReminders;
/**
 * Retrieves custodians pending acknowledgment.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any[]>} Pending custodians
 *
 * @example
 * ```typescript
 * const pending = await getPendingAcknowledgments('hold-uuid', HoldCustodian);
 * ```
 */
const getPendingAcknowledgments = async (holdId, HoldCustodian) => {
    return await HoldCustodian.findAll({
        where: {
            holdId,
            acknowledgedDate: null,
            exemptionApproved: false,
        },
        order: [['notificationSent', 'ASC']],
    });
};
exports.getPendingAcknowledgments = getPendingAcknowledgments;
/**
 * Processes custodian exemption request.
 *
 * @param {string} holdId - Hold ID
 * @param {string} custodianId - Custodian ID
 * @param {string} reason - Exemption reason
 * @param {boolean} approved - Approval decision
 * @param {string} approvedBy - User approving exemption
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any>} Updated custodian record
 *
 * @example
 * ```typescript
 * await processCustodianExemption('hold-uuid', 'EMP001', 'No relevant data', true, 'legal-counsel', HoldCustodian);
 * ```
 */
const processCustodianExemption = async (holdId, custodianId, reason, approved, approvedBy, HoldCustodian) => {
    const custodian = await HoldCustodian.findOne({
        where: { holdId, custodianId },
    });
    if (!custodian)
        throw new Error('Custodian not found in legal hold');
    custodian.exemptionRequested = true;
    custodian.exemptionReason = reason;
    custodian.exemptionApproved = approved;
    if (approved) {
        custodian.status = 'released';
    }
    await custodian.save();
    await (0, exports.logLegalHoldAudit)({
        entityType: 'custodian',
        entityId: custodian.id,
        holdId,
        action: 'update',
        userId: approvedBy,
        timestamp: new Date(),
        changes: { exemptionRequested: true, exemptionApproved: approved, reason },
    });
    return custodian;
};
exports.processCustodianExemption = processCustodianExemption;
// ============================================================================
// DATA SOURCE IDENTIFICATION (11-15)
// ============================================================================
/**
 * Identifies and registers data sources for legal hold.
 *
 * @param {string} holdId - Hold ID
 * @param {DataSourceIdentification[]} dataSources - Data sources to identify
 * @param {Model} HoldDataSource - HoldDataSource model
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User identifying sources
 * @returns {Promise<any[]>} Created data source records
 *
 * @example
 * ```typescript
 * const sources = await identifyDataSources('hold-uuid', [
 *   {
 *     sourceId: 'EMAIL-001',
 *     sourceName: 'Exchange Mailbox',
 *     sourceType: 'email',
 *     location: 'john.smith@example.com',
 *     custodianId: 'EMP001',
 *     preservationMethod: 'in_place',
 *     preservationStatus: 'identified',
 *     volumeEstimate: '10GB'
 *   }
 * ], HoldDataSource, LegalHold, 'user123');
 * ```
 */
const identifyDataSources = async (holdId, dataSources, HoldDataSource, LegalHold, userId) => {
    const hold = await LegalHold.findByPk(holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    const created = [];
    for (const source of dataSources) {
        const record = await HoldDataSource.create({
            holdId,
            sourceId: source.sourceId,
            sourceName: source.sourceName,
            sourceType: source.sourceType,
            location: source.location,
            custodianId: source.custodianId || null,
            preservationMethod: source.preservationMethod,
            preservationStatus: source.preservationStatus,
            volumeEstimate: source.volumeEstimate || '',
            metadata: source.metadata || {},
        });
        created.push(record);
        await (0, exports.logLegalHoldAudit)({
            entityType: 'data_source',
            entityId: record.id,
            holdId,
            action: 'create',
            userId,
            timestamp: new Date(),
            changes: source,
        });
    }
    // Update hold data source count
    hold.totalDataSources += dataSources.length;
    await hold.save();
    return created;
};
exports.identifyDataSources = identifyDataSources;
/**
 * Updates data source preservation status.
 *
 * @param {string} dataSourceId - Data source ID
 * @param {string} status - New preservation status
 * @param {Model} HoldDataSource - HoldDataSource model
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User updating status
 * @returns {Promise<any>} Updated data source
 *
 * @example
 * ```typescript
 * await updateDataSourceStatus('source-uuid', 'preserved', HoldDataSource, LegalHold, 'user123');
 * ```
 */
const updateDataSourceStatus = async (dataSourceId, status, HoldDataSource, LegalHold, userId) => {
    const dataSource = await HoldDataSource.findByPk(dataSourceId);
    if (!dataSource)
        throw new Error('Data source not found');
    const oldStatus = dataSource.preservationStatus;
    dataSource.preservationStatus = status;
    if (status === 'preserved' || status === 'collected') {
        dataSource.preservationDate = new Date();
    }
    await dataSource.save();
    // Update hold preserved count
    if (status === 'preserved' && oldStatus !== 'preserved') {
        const hold = await LegalHold.findByPk(dataSource.holdId);
        if (hold) {
            hold.preservedDataSources += 1;
            await hold.save();
        }
    }
    await (0, exports.logLegalHoldAudit)({
        entityType: 'data_source',
        entityId: dataSourceId,
        holdId: dataSource.holdId,
        action: 'update',
        userId,
        timestamp: new Date(),
        changes: { oldStatus, newStatus: status },
    });
    return dataSource;
};
exports.updateDataSourceStatus = updateDataSourceStatus;
/**
 * Retrieves data sources by custodian.
 *
 * @param {string} holdId - Hold ID
 * @param {string} custodianId - Custodian ID
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any[]>} Custodian's data sources
 *
 * @example
 * ```typescript
 * const sources = await getDataSourcesByCustodian('hold-uuid', 'EMP001', HoldDataSource);
 * ```
 */
const getDataSourcesByCustodian = async (holdId, custodianId, HoldDataSource) => {
    return await HoldDataSource.findAll({
        where: { holdId, custodianId },
        order: [['sourceType', 'ASC'], ['sourceName', 'ASC']],
    });
};
exports.getDataSourcesByCustodian = getDataSourcesByCustodian;
/**
 * Estimates total preservation volume for legal hold.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<{ totalSources: number; estimatedVolume: string; byType: Record<string, number> }>} Volume estimate
 *
 * @example
 * ```typescript
 * const volume = await estimatePreservationVolume('hold-uuid', HoldDataSource);
 * console.log(`Total volume: ${volume.estimatedVolume}`);
 * ```
 */
const estimatePreservationVolume = async (holdId, HoldDataSource) => {
    const sources = await HoldDataSource.findAll({ where: { holdId } });
    const byType = {};
    sources.forEach((source) => {
        if (!byType[source.sourceType]) {
            byType[source.sourceType] = 0;
        }
        byType[source.sourceType] += 1;
    });
    return {
        totalSources: sources.length,
        estimatedVolume: 'Calculation pending', // TODO: Parse and sum volume estimates
        byType,
    };
};
exports.estimatePreservationVolume = estimatePreservationVolume;
/**
 * Marks data source as failed with reason.
 *
 * @param {string} dataSourceId - Data source ID
 * @param {string} reason - Failure reason
 * @param {Model} HoldDataSource - HoldDataSource model
 * @param {string} userId - User marking failure
 * @returns {Promise<any>} Updated data source
 *
 * @example
 * ```typescript
 * await markDataSourceFailed('source-uuid', 'Access denied - system unavailable', HoldDataSource, 'user123');
 * ```
 */
const markDataSourceFailed = async (dataSourceId, reason, HoldDataSource, userId) => {
    const dataSource = await HoldDataSource.findByPk(dataSourceId);
    if (!dataSource)
        throw new Error('Data source not found');
    dataSource.preservationStatus = 'failed';
    dataSource.failureReason = reason;
    await dataSource.save();
    await (0, exports.logLegalHoldAudit)({
        entityType: 'data_source',
        entityId: dataSourceId,
        holdId: dataSource.holdId,
        action: 'update',
        userId,
        timestamp: new Date(),
        changes: { status: 'failed', reason },
    });
    return dataSource;
};
exports.markDataSourceFailed = markDataSourceFailed;
// ============================================================================
// PRESERVATION SCOPE DEFINITION (16-20)
// ============================================================================
/**
 * Defines preservation scope for legal hold.
 *
 * @param {PreservationScope} scope - Preservation scope definition
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Updated hold
 *
 * @example
 * ```typescript
 * await definePreservationScope({
 *   holdId: 'hold-uuid',
 *   scopeType: 'targeted',
 *   includedDataTypes: ['email', 'documents', 'instant_messages'],
 *   keywordTerms: ['discrimination', 'termination', 'performance'],
 *   dateRange: { startDate: new Date('2023-01-01'), endDate: new Date('2024-12-31') },
 *   custodianScope: 'specific',
 *   preservationRationale: 'Focused on HR-related communications'
 * }, LegalHold);
 * ```
 */
const definePreservationScope = async (scope, LegalHold) => {
    const hold = await LegalHold.findByPk(scope.holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    const scopeMetadata = {
        scopeType: scope.scopeType,
        includedDataTypes: scope.includedDataTypes,
        excludedDataTypes: scope.excludedDataTypes || [],
        keywordTerms: scope.keywordTerms || [],
        dateRange: scope.dateRange,
        custodianScope: scope.custodianScope,
        geographicScope: scope.geographicScope || [],
        businessUnits: scope.businessUnits || [],
        preservationRationale: scope.preservationRationale,
    };
    hold.metadata = {
        ...hold.metadata,
        preservationScope: scopeMetadata,
    };
    if (scope.keywordTerms && scope.keywordTerms.length > 0) {
        hold.keywords = scope.keywordTerms;
    }
    await hold.save();
    return hold;
};
exports.definePreservationScope = definePreservationScope;
/**
 * Validates preservation scope for legal defensibility.
 *
 * @param {PreservationScope} scope - Scope to validate
 * @returns {{ valid: boolean; warnings: string[]; recommendations: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const validation = validatePreservationScope(scope);
 * if (!validation.valid) {
 *   console.log('Warnings:', validation.warnings);
 * }
 * ```
 */
const validatePreservationScope = (scope) => {
    const warnings = [];
    const recommendations = [];
    if (scope.scopeType === 'broad' && !scope.preservationRationale) {
        warnings.push('Broad scope should include detailed rationale');
    }
    if (scope.scopeType === 'keyword' && (!scope.keywordTerms || scope.keywordTerms.length === 0)) {
        warnings.push('Keyword-based scope requires keyword terms');
    }
    if (!scope.dateRange.endDate) {
        recommendations.push('Consider setting an end date for the relevant timeframe');
    }
    if (scope.scopeType === 'targeted' && scope.includedDataTypes.length > 10) {
        recommendations.push('Large number of data types may indicate broad scope');
    }
    if (!scope.excludedDataTypes || scope.excludedDataTypes.length === 0) {
        recommendations.push('Consider explicitly excluding irrelevant data types');
    }
    return {
        valid: warnings.length === 0,
        warnings,
        recommendations,
    };
};
exports.validatePreservationScope = validatePreservationScope;
/**
 * Expands preservation scope with additional criteria.
 *
 * @param {string} holdId - Hold ID
 * @param {Partial<PreservationScope>} additions - Additional scope criteria
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User expanding scope
 * @returns {Promise<any>} Updated hold
 *
 * @example
 * ```typescript
 * await expandPreservationScope('hold-uuid', {
 *   keywordTerms: ['retaliation', 'complaint'],
 *   includedDataTypes: ['social_media']
 * }, LegalHold, 'user123');
 * ```
 */
const expandPreservationScope = async (holdId, additions, LegalHold, userId) => {
    const hold = await LegalHold.findByPk(holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    const currentScope = hold.metadata.preservationScope || {};
    if (additions.keywordTerms) {
        const existingKeywords = new Set(hold.keywords);
        additions.keywordTerms.forEach(k => existingKeywords.add(k));
        hold.keywords = Array.from(existingKeywords);
    }
    if (additions.includedDataTypes) {
        currentScope.includedDataTypes = [
            ...(currentScope.includedDataTypes || []),
            ...additions.includedDataTypes,
        ];
    }
    hold.metadata = {
        ...hold.metadata,
        preservationScope: currentScope,
    };
    await hold.save();
    await (0, exports.logLegalHoldAudit)({
        entityType: 'hold',
        entityId: holdId,
        holdId,
        action: 'update',
        userId,
        timestamp: new Date(),
        changes: { scopeExpansion: additions },
    });
    return hold;
};
exports.expandPreservationScope = expandPreservationScope;
/**
 * Generates preservation scope summary report.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any>} Scope summary
 *
 * @example
 * ```typescript
 * const summary = await generateScopeSummary('hold-uuid', LegalHold, HoldDataSource);
 * ```
 */
const generateScopeSummary = async (holdId, LegalHold, HoldDataSource) => {
    const hold = await LegalHold.findByPk(holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    const dataSources = await HoldDataSource.findAll({ where: { holdId } });
    const sourcesByType = {};
    dataSources.forEach((source) => {
        sourcesByType[source.sourceType] = (sourcesByType[source.sourceType] || 0) + 1;
    });
    return {
        matterName: hold.matterName,
        matterNumber: hold.matterNumber,
        preservationScope: hold.preservationScope,
        keywords: hold.keywords,
        relevantTimeframe: {
            start: hold.relevantTimeframeStart,
            end: hold.relevantTimeframeEnd,
        },
        totalCustodians: hold.totalCustodians,
        totalDataSources: hold.totalDataSources,
        dataSourcesByType: sourcesByType,
        scopeMetadata: hold.metadata.preservationScope || {},
    };
};
exports.generateScopeSummary = generateScopeSummary;
/**
 * Compares preservation scope across multiple holds.
 *
 * @param {string[]} holdIds - Array of hold IDs
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Scope comparison
 *
 * @example
 * ```typescript
 * const comparison = await comparePreservationScopes(['hold1', 'hold2'], LegalHold);
 * ```
 */
const comparePreservationScopes = async (holdIds, LegalHold) => {
    const holds = await LegalHold.findAll({
        where: { id: { [sequelize_1.Op.in]: holdIds } },
    });
    const comparison = holds.map((hold) => ({
        holdId: hold.id,
        matterName: hold.matterName,
        keywords: hold.keywords,
        custodianCount: hold.totalCustodians,
        dataSourceCount: hold.totalDataSources,
        scopeType: hold.metadata.preservationScope?.scopeType || 'unknown',
    }));
    return comparison;
};
exports.comparePreservationScopes = comparePreservationScopes;
// ============================================================================
// CUSTODIAN INTERVIEWS (21-23)
// ============================================================================
/**
 * Schedules custodian interview for data source identification.
 *
 * @param {CustodianInterview} interviewData - Interview data
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any>} Interview record
 *
 * @example
 * ```typescript
 * await scheduleCustodianInterview({
 *   holdId: 'hold-uuid',
 *   custodianId: 'EMP001',
 *   interviewDate: new Date('2024-06-01'),
 *   interviewer: 'legal-team',
 *   interviewMethod: 'video_conference',
 *   dataSources: [],
 *   relevantDocuments: [],
 *   notes: '',
 *   followUpRequired: false,
 *   completionStatus: 'scheduled'
 * }, HoldCustodian);
 * ```
 */
const scheduleCustodianInterview = async (interviewData, HoldCustodian) => {
    const custodian = await HoldCustodian.findOne({
        where: { holdId: interviewData.holdId, custodianId: interviewData.custodianId },
    });
    if (!custodian)
        throw new Error('Custodian not found in legal hold');
    custodian.interviewDate = interviewData.interviewDate;
    custodian.metadata = {
        ...custodian.metadata,
        interview: interviewData,
    };
    await custodian.save();
    return custodian;
};
exports.scheduleCustodianInterview = scheduleCustodianInterview;
/**
 * Records custodian interview completion and findings.
 *
 * @param {string} holdId - Hold ID
 * @param {string} custodianId - Custodian ID
 * @param {Partial<CustodianInterview>} interviewResults - Interview results
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any>} Updated custodian
 *
 * @example
 * ```typescript
 * await recordInterviewCompletion('hold-uuid', 'EMP001', {
 *   notes: 'Identified 3 additional email accounts and shared drive',
 *   dataSources: [...],
 *   completionStatus: 'completed',
 *   followUpRequired: true
 * }, HoldCustodian);
 * ```
 */
const recordInterviewCompletion = async (holdId, custodianId, interviewResults, HoldCustodian) => {
    const custodian = await HoldCustodian.findOne({
        where: { holdId, custodianId },
    });
    if (!custodian)
        throw new Error('Custodian not found in legal hold');
    custodian.interviewCompleted = true;
    custodian.interviewDate = new Date();
    custodian.metadata = {
        ...custodian.metadata,
        interview: {
            ...custodian.metadata.interview,
            ...interviewResults,
            completionStatus: 'completed',
        },
    };
    await custodian.save();
    return custodian;
};
exports.recordInterviewCompletion = recordInterviewCompletion;
/**
 * Retrieves custodians pending interviews.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldCustodian - HoldCustodian model
 * @returns {Promise<any[]>} Custodians pending interviews
 *
 * @example
 * ```typescript
 * const pending = await getPendingInterviews('hold-uuid', HoldCustodian);
 * ```
 */
const getPendingInterviews = async (holdId, HoldCustodian) => {
    return await HoldCustodian.findAll({
        where: {
            holdId,
            interviewCompleted: false,
        },
        order: [['interviewDate', 'ASC']],
    });
};
exports.getPendingInterviews = getPendingInterviews;
// ============================================================================
// PRESERVATION VERIFICATION (24-26)
// ============================================================================
/**
 * Performs preservation verification audit.
 *
 * @param {PreservationVerification} verification - Verification data
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any>} Verification results
 *
 * @example
 * ```typescript
 * const results = await performPreservationVerification({
 *   holdId: 'hold-uuid',
 *   verificationDate: new Date(),
 *   verifiedBy: 'compliance-team',
 *   dataSourcesVerified: ['source1', 'source2'],
 *   verificationMethod: 'sampling',
 *   custodianSampleSize: 10,
 *   complianceRate: 95,
 *   issuesFound: ['One mailbox not preserved'],
 *   remediationRequired: true,
 *   verificationStatus: 'partial'
 * }, LegalHold, HoldDataSource);
 * ```
 */
const performPreservationVerification = async (verification, LegalHold, HoldDataSource) => {
    const hold = await LegalHold.findByPk(verification.holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    // Update data sources verification status
    for (const sourceId of verification.dataSourcesVerified) {
        const source = await HoldDataSource.findByPk(sourceId);
        if (source) {
            source.verificationDate = verification.verificationDate;
            source.verificationStatus = verification.verificationStatus === 'pass' ? 'verified' : 'failed';
            await source.save();
        }
    }
    hold.lastVerificationDate = verification.verificationDate;
    hold.metadata = {
        ...hold.metadata,
        lastVerification: verification,
    };
    await hold.save();
    return {
        holdId: verification.holdId,
        verificationStatus: verification.verificationStatus,
        complianceRate: verification.complianceRate,
        issuesFound: verification.issuesFound,
        remediationRequired: verification.remediationRequired,
    };
};
exports.performPreservationVerification = performPreservationVerification;
/**
 * Generates preservation compliance report.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<ComplianceMetrics>} Compliance metrics
 *
 * @example
 * ```typescript
 * const metrics = await generateComplianceReport('hold-uuid', LegalHold, HoldCustodian, HoldDataSource);
 * console.log(`Compliance score: ${metrics.complianceScore}`);
 * ```
 */
const generateComplianceReport = async (holdId, LegalHold, HoldCustodian, HoldDataSource) => {
    const hold = await LegalHold.findByPk(holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    const custodians = await HoldCustodian.findAll({ where: { holdId } });
    const dataSources = await HoldDataSource.findAll({ where: { holdId } });
    const acknowledgedCount = custodians.filter((c) => c.acknowledgedDate !== null).length;
    const preservedCount = dataSources.filter((s) => s.preservationStatus === 'preserved' || s.preservationStatus === 'collected').length;
    const acknowledgmentRate = (acknowledgedCount / custodians.length) * 100 || 0;
    const preservationRate = (preservedCount / dataSources.length) * 100 || 0;
    const acknowledgmentTimes = custodians
        .filter((c) => c.acknowledgedDate && c.notificationSent)
        .map((c) => c.acknowledgedDate.getTime() - c.notificationSent.getTime());
    const averageAcknowledgmentTime = acknowledgmentTimes.length > 0
        ? acknowledgmentTimes.reduce((sum, time) => sum + time, 0) / acknowledgmentTimes.length / 86400000
        : 0;
    const complianceScore = (acknowledgmentRate * 0.5 + preservationRate * 0.5);
    return {
        holdId,
        totalCustodians: custodians.length,
        acknowledgedCustodians: acknowledgedCount,
        acknowledgmentRate,
        averageAcknowledgmentTime,
        totalDataSources: dataSources.length,
        preservedDataSources: preservedCount,
        preservationRate,
        escalations: 0, // TODO: Count escalations
        complianceScore,
        lastVerificationDate: hold.lastVerificationDate,
    };
};
exports.generateComplianceReport = generateComplianceReport;
/**
 * Identifies preservation compliance gaps.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any[]>} Compliance gaps
 *
 * @example
 * ```typescript
 * const gaps = await identifyComplianceGaps('hold-uuid', HoldCustodian, HoldDataSource);
 * ```
 */
const identifyComplianceGaps = async (holdId, HoldCustodian, HoldDataSource) => {
    const gaps = [];
    // Check for unacknowledged custodians
    const unacknowledged = await HoldCustodian.findAll({
        where: {
            holdId,
            acknowledgedDate: null,
            exemptionApproved: false,
        },
    });
    if (unacknowledged.length > 0) {
        gaps.push({
            type: 'unacknowledged_custodians',
            count: unacknowledged.length,
            severity: 'high',
            custodians: unacknowledged.map((c) => c.custodianId),
        });
    }
    // Check for failed data sources
    const failed = await HoldDataSource.findAll({
        where: {
            holdId,
            preservationStatus: 'failed',
        },
    });
    if (failed.length > 0) {
        gaps.push({
            type: 'failed_preservation',
            count: failed.length,
            severity: 'critical',
            sources: failed.map((s) => ({ id: s.sourceId, reason: s.failureReason })),
        });
    }
    return gaps;
};
exports.identifyComplianceGaps = identifyComplianceGaps;
// ============================================================================
// RELEASE PROCEDURES (27-30)
// ============================================================================
/**
 * Releases legal hold fully or partially.
 *
 * @param {HoldReleaseData} releaseData - Release data
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {string} userId - User releasing hold
 * @returns {Promise<any>} Updated hold
 *
 * @example
 * ```typescript
 * await releaseLegalHold({
 *   holdId: 'hold-uuid',
 *   releaseDate: new Date(),
 *   releaseReason: 'Matter settled',
 *   releaseType: 'full',
 *   approvedBy: 'legal-counsel',
 *   legalCounselApproval: true,
 *   dispositionInstructions: 'Delete data after 90 days'
 * }, LegalHold, HoldCustodian, 'user123');
 * ```
 */
const releaseLegalHold = async (releaseData, LegalHold, HoldCustodian, userId) => {
    const hold = await LegalHold.findByPk(releaseData.holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    if (!releaseData.legalCounselApproval) {
        throw new Error('Legal counsel approval required for hold release');
    }
    if (releaseData.releaseType === 'full') {
        hold.status = 'released';
        hold.releaseDate = releaseData.releaseDate;
        // Release all custodians
        await HoldCustodian.update({ status: 'released' }, { where: { holdId: releaseData.holdId } });
    }
    else if (releaseData.releaseType === 'partial') {
        // Release specific custodians
        if (releaseData.releasedCustodians) {
            await HoldCustodian.update({ status: 'released' }, {
                where: {
                    holdId: releaseData.holdId,
                    custodianId: { [sequelize_1.Op.in]: releaseData.releasedCustodians },
                },
            });
        }
    }
    hold.metadata = {
        ...hold.metadata,
        release: releaseData,
    };
    await hold.save();
    await (0, exports.logLegalHoldAudit)({
        entityType: 'release',
        entityId: hold.id,
        holdId: hold.id,
        action: 'release',
        userId,
        timestamp: new Date(),
        changes: releaseData,
    });
    return hold;
};
exports.releaseLegalHold = releaseLegalHold;
/**
 * Validates release prerequisites before releasing hold.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<{ canRelease: boolean; blockers: string[] }>} Release validation
 *
 * @example
 * ```typescript
 * const validation = await validateReleasePrerequisites('hold-uuid', HoldDataSource);
 * if (!validation.canRelease) {
 *   console.log('Blockers:', validation.blockers);
 * }
 * ```
 */
const validateReleasePrerequisites = async (holdId, HoldDataSource) => {
    const blockers = [];
    // Check for pending preservation
    const pending = await HoldDataSource.findAll({
        where: {
            holdId,
            preservationStatus: 'identified',
        },
    });
    if (pending.length > 0) {
        blockers.push(`${pending.length} data sources not yet preserved`);
    }
    // Check for failed sources
    const failed = await HoldDataSource.findAll({
        where: {
            holdId,
            preservationStatus: 'failed',
        },
    });
    if (failed.length > 0) {
        blockers.push(`${failed.length} data sources failed preservation`);
    }
    return {
        canRelease: blockers.length === 0,
        blockers,
    };
};
exports.validateReleasePrerequisites = validateReleasePrerequisites;
/**
 * Generates certificate of disposition for released hold.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<string>} Certificate content
 *
 * @example
 * ```typescript
 * const certificate = await generateDispositionCertificate('hold-uuid', LegalHold);
 * ```
 */
const generateDispositionCertificate = async (holdId, LegalHold) => {
    const hold = await LegalHold.findByPk(holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    if (hold.status !== 'released') {
        throw new Error('Hold must be released before generating certificate');
    }
    const certificate = `
CERTIFICATE OF DISPOSITION

Matter: ${hold.matterName}
Matter Number: ${hold.matterNumber}
Hold Issue Date: ${hold.issueDate.toISOString()}
Hold Release Date: ${hold.releaseDate?.toISOString()}

This certifies that the legal hold placed on the above matter has been released
and all preservation requirements have been satisfied.

Total Custodians: ${hold.totalCustodians}
Total Data Sources: ${hold.totalDataSources}

Issued By: ${hold.issuedBy}
Date: ${new Date().toISOString()}
  `.trim();
    return certificate;
};
exports.generateDispositionCertificate = generateDispositionCertificate;
/**
 * Archives released legal hold for retention.
 *
 * @param {string} holdId - Hold ID
 * @param {number} retentionYears - Retention period in years
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Archived hold
 *
 * @example
 * ```typescript
 * await archiveReleasedHold('hold-uuid', 7, LegalHold);
 * ```
 */
const archiveReleasedHold = async (holdId, retentionYears, LegalHold) => {
    const hold = await LegalHold.findByPk(holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    if (hold.status !== 'released') {
        throw new Error('Only released holds can be archived');
    }
    const archiveDate = new Date();
    const expirationDate = new Date(archiveDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + retentionYears);
    hold.metadata = {
        ...hold.metadata,
        archive: {
            archiveDate,
            retentionYears,
            expirationDate,
        },
    };
    await hold.save();
    return hold;
};
exports.archiveReleasedHold = archiveReleasedHold;
// ============================================================================
// ESCALATION & COMPLIANCE (31-34)
// ============================================================================
/**
 * Creates escalation for non-compliance or issues.
 *
 * @param {EscalationWorkflow} escalation - Escalation data
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User creating escalation
 * @returns {Promise<any>} Escalation record
 *
 * @example
 * ```typescript
 * await createEscalation({
 *   holdId: 'hold-uuid',
 *   escalationType: 'non_acknowledgment',
 *   custodianId: 'EMP001',
 *   escalationDate: new Date(),
 *   escalatedTo: 'manager',
 *   escalationReason: 'No response after 3 reminders',
 *   priority: 'high',
 *   status: 'open'
 * }, LegalHold, 'user123');
 * ```
 */
const createEscalation = async (escalation, LegalHold, userId) => {
    const hold = await LegalHold.findByPk(escalation.holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    const escalations = hold.metadata.escalations || [];
    escalations.push({
        ...escalation,
        id: `ESC-${Date.now()}`,
        createdBy: userId,
        createdAt: new Date(),
    });
    hold.metadata = {
        ...hold.metadata,
        escalations,
    };
    await hold.save();
    await (0, exports.logLegalHoldAudit)({
        entityType: 'hold',
        entityId: hold.id,
        holdId: hold.id,
        action: 'escalate',
        userId,
        timestamp: new Date(),
        changes: escalation,
    });
    return escalation;
};
exports.createEscalation = createEscalation;
/**
 * Resolves escalation with outcome.
 *
 * @param {string} holdId - Hold ID
 * @param {string} escalationId - Escalation ID
 * @param {string} resolution - Resolution description
 * @param {Model} LegalHold - LegalHold model
 * @param {string} userId - User resolving escalation
 * @returns {Promise<any>} Resolved escalation
 *
 * @example
 * ```typescript
 * await resolveEscalation('hold-uuid', 'ESC-123', 'Custodian acknowledged after manager contact', LegalHold, 'user123');
 * ```
 */
const resolveEscalation = async (holdId, escalationId, resolution, LegalHold, userId) => {
    const hold = await LegalHold.findByPk(holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    const escalations = hold.metadata.escalations || [];
    const escalation = escalations.find((e) => e.id === escalationId);
    if (!escalation)
        throw new Error('Escalation not found');
    escalation.status = 'resolved';
    escalation.resolution = resolution;
    escalation.resolvedDate = new Date();
    escalation.resolvedBy = userId;
    hold.metadata = {
        ...hold.metadata,
        escalations,
    };
    await hold.save();
    return escalation;
};
exports.resolveEscalation = resolveEscalation;
/**
 * Retrieves open escalations for legal hold.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any[]>} Open escalations
 *
 * @example
 * ```typescript
 * const openEscalations = await getOpenEscalations('hold-uuid', LegalHold);
 * ```
 */
const getOpenEscalations = async (holdId, LegalHold) => {
    const hold = await LegalHold.findByPk(holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    const escalations = hold.metadata.escalations || [];
    return escalations.filter((e) => e.status === 'open' || e.status === 'in_progress');
};
exports.getOpenEscalations = getOpenEscalations;
/**
 * Generates escalation summary report.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @returns {Promise<any>} Escalation summary
 *
 * @example
 * ```typescript
 * const summary = await generateEscalationSummary('hold-uuid', LegalHold);
 * ```
 */
const generateEscalationSummary = async (holdId, LegalHold) => {
    const hold = await LegalHold.findByPk(holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    const escalations = hold.metadata.escalations || [];
    const byType = {};
    const byStatus = {};
    escalations.forEach((e) => {
        byType[e.escalationType] = (byType[e.escalationType] || 0) + 1;
        byStatus[e.status] = (byStatus[e.status] || 0) + 1;
    });
    return {
        totalEscalations: escalations.length,
        openEscalations: byStatus.open || 0,
        resolvedEscalations: byStatus.resolved || 0,
        byType,
        byStatus,
    };
};
exports.generateEscalationSummary = generateEscalationSummary;
// ============================================================================
// AUDIT & REPORTING (35-38)
// ============================================================================
/**
 * Logs audit event for legal hold operations.
 *
 * @param {LegalHoldAuditEntry} auditData - Audit entry data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await logLegalHoldAudit({
 *   entityType: 'hold',
 *   entityId: 'hold-uuid',
 *   holdId: 'hold-uuid',
 *   action: 'create',
 *   userId: 'user123',
 *   timestamp: new Date(),
 *   changes: { ... }
 * });
 * ```
 */
const logLegalHoldAudit = async (auditData) => {
    // In production, this would write to LegalHoldAuditLog model
    console.log('Legal Hold Audit Event:', auditData);
};
exports.logLegalHoldAudit = logLegalHoldAudit;
/**
 * Generates comprehensive legal hold status report.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any>} Status report
 *
 * @example
 * ```typescript
 * const report = await generateHoldStatusReport('hold-uuid', LegalHold, HoldCustodian, HoldDataSource);
 * ```
 */
const generateHoldStatusReport = async (holdId, LegalHold, HoldCustodian, HoldDataSource) => {
    const hold = await LegalHold.findByPk(holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    const metrics = await (0, exports.generateComplianceReport)(holdId, LegalHold, HoldCustodian, HoldDataSource);
    const gaps = await (0, exports.identifyComplianceGaps)(holdId, HoldCustodian, HoldDataSource);
    const scopeSummary = await (0, exports.generateScopeSummary)(holdId, LegalHold, HoldDataSource);
    return {
        holdInformation: {
            id: hold.id,
            matterName: hold.matterName,
            matterNumber: hold.matterNumber,
            status: hold.status,
            priority: hold.priority,
            issueDate: hold.issueDate,
            effectiveDate: hold.effectiveDate,
            releaseDate: hold.releaseDate,
        },
        complianceMetrics: metrics,
        complianceGaps: gaps,
        preservationScope: scopeSummary,
        lastVerificationDate: hold.lastVerificationDate,
        escalations: await (0, exports.generateEscalationSummary)(holdId, LegalHold),
    };
};
exports.generateHoldStatusReport = generateHoldStatusReport;
/**
 * Exports legal hold audit trail.
 *
 * @param {string} holdId - Hold ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Model} LegalHoldAuditLog - LegalHoldAuditLog model
 * @returns {Promise<string>} Audit trail CSV
 *
 * @example
 * ```typescript
 * const csv = await exportLegalHoldAuditTrail('hold-uuid', startDate, endDate, LegalHoldAuditLog);
 * ```
 */
const exportLegalHoldAuditTrail = async (holdId, startDate, endDate, LegalHoldAuditLog) => {
    const logs = await LegalHoldAuditLog.findAll({
        where: {
            holdId,
            createdAt: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        order: [['createdAt', 'ASC']],
    });
    const headers = 'Timestamp,Entity Type,Entity ID,Action,User,Changes\n';
    const rows = logs.map((log) => `${log.createdAt},${log.entityType},${log.entityId},${log.action},${log.userName},"${JSON.stringify(log.changes)}"`);
    return headers + rows.join('\n');
};
exports.exportLegalHoldAuditTrail = exportLegalHoldAuditTrail;
/**
 * Generates defensibility report for litigation readiness.
 *
 * @param {string} holdId - Hold ID
 * @param {Model} LegalHold - LegalHold model
 * @param {Model} HoldCustodian - HoldCustodian model
 * @param {Model} HoldDataSource - HoldDataSource model
 * @returns {Promise<any>} Defensibility report
 *
 * @example
 * ```typescript
 * const report = await generateDefensibilityReport('hold-uuid', LegalHold, HoldCustodian, HoldDataSource);
 * console.log(`Defensibility score: ${report.defensibilityScore}`);
 * ```
 */
const generateDefensibilityReport = async (holdId, LegalHold, HoldCustodian, HoldDataSource) => {
    const hold = await LegalHold.findByPk(holdId);
    if (!hold)
        throw new Error('Legal hold not found');
    const metrics = await (0, exports.generateComplianceReport)(holdId, LegalHold, HoldCustodian, HoldDataSource);
    const gaps = await (0, exports.identifyComplianceGaps)(holdId, HoldCustodian, HoldDataSource);
    const custodians = await HoldCustodian.findAll({ where: { holdId } });
    const dataSources = await HoldDataSource.findAll({ where: { holdId } });
    // Calculate defensibility score
    let defensibilityScore = 100;
    // Deduct for gaps
    gaps.forEach((gap) => {
        if (gap.severity === 'critical')
            defensibilityScore -= 15;
        else if (gap.severity === 'high')
            defensibilityScore -= 10;
        else if (gap.severity === 'medium')
            defensibilityScore -= 5;
    });
    // Deduct for low compliance
    if (metrics.complianceScore < 90)
        defensibilityScore -= 10;
    if (metrics.complianceScore < 75)
        defensibilityScore -= 15;
    // Bonus for verification
    if (hold.lastVerificationDate)
        defensibilityScore += 5;
    const strengths = [];
    const weaknesses = [];
    if (metrics.acknowledgmentRate > 95) {
        strengths.push('High custodian acknowledgment rate');
    }
    else if (metrics.acknowledgmentRate < 80) {
        weaknesses.push('Low custodian acknowledgment rate');
    }
    if (metrics.preservationRate > 95) {
        strengths.push('Excellent data source preservation');
    }
    else if (metrics.preservationRate < 80) {
        weaknesses.push('Incomplete data source preservation');
    }
    if (hold.lastVerificationDate) {
        strengths.push('Regular verification performed');
    }
    else {
        weaknesses.push('No verification audit performed');
    }
    return {
        holdId,
        matterName: hold.matterName,
        defensibilityScore: Math.max(0, Math.min(100, defensibilityScore)),
        strengths,
        weaknesses,
        complianceMetrics: metrics,
        complianceGaps: gaps,
        recommendations: generateDefensibilityRecommendations(defensibilityScore, gaps),
    };
};
exports.generateDefensibilityReport = generateDefensibilityReport;
/**
 * Generates defensibility recommendations.
 *
 * @param {number} score - Defensibility score
 * @param {any[]} gaps - Compliance gaps
 * @returns {string[]} Recommendations
 */
const generateDefensibilityRecommendations = (score, gaps) => {
    const recommendations = [];
    if (score < 70) {
        recommendations.push('Immediate action required to improve defensibility');
    }
    gaps.forEach((gap) => {
        if (gap.type === 'unacknowledged_custodians') {
            recommendations.push('Escalate unacknowledged custodians to management');
        }
        if (gap.type === 'failed_preservation') {
            recommendations.push('Remediate failed data source preservation');
        }
    });
    return recommendations;
};
// ============================================================================
// NESTJS SERVICE WRAPPER
// ============================================================================
/**
 * NestJS Injectable service for Legal Hold management.
 *
 * @example
 * ```typescript
 * @Controller('legal-holds')
 * export class LegalHoldController {
 *   constructor(private readonly legalHoldService: LegalHoldService) {}
 *
 *   @Post()
 *   async createHold(@Body() data: LegalHoldNoticeData) {
 *     return this.legalHoldService.createHold(data);
 *   }
 * }
 * ```
 */
let LegalHoldService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LegalHoldService = _classThis = class {
        constructor(sequelize) {
            this.sequelize = sequelize;
        }
        async createHold(data, userId) {
            const LegalHold = (0, exports.createLegalHoldModel)(this.sequelize);
            return (0, exports.createLegalHoldNotice)(data, LegalHold, userId);
        }
        async addCustodians(holdId, custodians, userId) {
            const HoldCustodian = (0, exports.createHoldCustodianModel)(this.sequelize);
            const LegalHold = (0, exports.createLegalHoldModel)(this.sequelize);
            return (0, exports.addCustodiansToHold)(holdId, custodians, HoldCustodian, LegalHold, userId);
        }
        async generateStatusReport(holdId) {
            const LegalHold = (0, exports.createLegalHoldModel)(this.sequelize);
            const HoldCustodian = (0, exports.createHoldCustodianModel)(this.sequelize);
            const HoldDataSource = (0, exports.createHoldDataSourceModel)(this.sequelize);
            return (0, exports.generateHoldStatusReport)(holdId, LegalHold, HoldCustodian, HoldDataSource);
        }
        async releaseHold(releaseData, userId) {
            const LegalHold = (0, exports.createLegalHoldModel)(this.sequelize);
            const HoldCustodian = (0, exports.createHoldCustodianModel)(this.sequelize);
            return (0, exports.releaseLegalHold)(releaseData, LegalHold, HoldCustodian, userId);
        }
    };
    __setFunctionName(_classThis, "LegalHoldService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LegalHoldService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LegalHoldService = _classThis;
})();
exports.LegalHoldService = LegalHoldService;
/**
 * Default export with all legal hold utilities.
 */
exports.default = {
    // Models
    createLegalHoldModel: exports.createLegalHoldModel,
    createHoldCustodianModel: exports.createHoldCustodianModel,
    createHoldDataSourceModel: exports.createHoldDataSourceModel,
    createLegalHoldAuditLogModel: exports.createLegalHoldAuditLogModel,
    // Legal Hold Management
    createLegalHoldNotice: exports.createLegalHoldNotice,
    updateLegalHoldNotice: exports.updateLegalHoldNotice,
    validateLegalHoldNotice: exports.validateLegalHoldNotice,
    activateLegalHold: exports.activateLegalHold,
    getActiveLegalHolds: exports.getActiveLegalHolds,
    // Custodian Management
    addCustodiansToHold: exports.addCustodiansToHold,
    recordCustodianAcknowledgment: exports.recordCustodianAcknowledgment,
    sendCustodianReminders: exports.sendCustodianReminders,
    getPendingAcknowledgments: exports.getPendingAcknowledgments,
    processCustodianExemption: exports.processCustodianExemption,
    // Data Source Identification
    identifyDataSources: exports.identifyDataSources,
    updateDataSourceStatus: exports.updateDataSourceStatus,
    getDataSourcesByCustodian: exports.getDataSourcesByCustodian,
    estimatePreservationVolume: exports.estimatePreservationVolume,
    markDataSourceFailed: exports.markDataSourceFailed,
    // Preservation Scope
    definePreservationScope: exports.definePreservationScope,
    validatePreservationScope: exports.validatePreservationScope,
    expandPreservationScope: exports.expandPreservationScope,
    generateScopeSummary: exports.generateScopeSummary,
    comparePreservationScopes: exports.comparePreservationScopes,
    // Custodian Interviews
    scheduleCustodianInterview: exports.scheduleCustodianInterview,
    recordInterviewCompletion: exports.recordInterviewCompletion,
    getPendingInterviews: exports.getPendingInterviews,
    // Preservation Verification
    performPreservationVerification: exports.performPreservationVerification,
    generateComplianceReport: exports.generateComplianceReport,
    identifyComplianceGaps: exports.identifyComplianceGaps,
    // Release Procedures
    releaseLegalHold: exports.releaseLegalHold,
    validateReleasePrerequisites: exports.validateReleasePrerequisites,
    generateDispositionCertificate: exports.generateDispositionCertificate,
    archiveReleasedHold: exports.archiveReleasedHold,
    // Escalation & Compliance
    createEscalation: exports.createEscalation,
    resolveEscalation: exports.resolveEscalation,
    getOpenEscalations: exports.getOpenEscalations,
    generateEscalationSummary: exports.generateEscalationSummary,
    // Audit & Reporting
    logLegalHoldAudit: exports.logLegalHoldAudit,
    generateHoldStatusReport: exports.generateHoldStatusReport,
    exportLegalHoldAuditTrail: exports.exportLegalHoldAuditTrail,
    generateDefensibilityReport: exports.generateDefensibilityReport,
    // Service
    LegalHoldService,
};
//# sourceMappingURL=legal-hold-preservation-kit.js.map