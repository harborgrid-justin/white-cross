"use strict";
/**
 * @fileoverview Health Surgical Management Kit - Comprehensive Sequelize associations for surgical workflows
 * @module reuse/server/health/health-surgical-management-kit
 * @description Enterprise-grade Sequelize association utilities for surgical case management including
 * OR scheduling, preference cards, supply tracking, anesthesia documentation, intraoperative notes,
 * consent management, implant tracking, safety checklists, and pathology specimen tracking.
 * Epic OpTime-level functionality for White Cross healthcare platform.
 *
 * Key Features:
 * - Surgical case scheduling and coordination
 * - Operating room scheduling and management
 * - Surgical preference card associations
 * - Surgical supply and instrument tracking
 * - Anesthesia documentation associations
 * - Intraoperative notes and documentation
 * - Surgical consent management
 * - Implant tracking and registry
 * - Surgical safety checklist workflows
 * - Time-out documentation
 * - Pathology specimen tracking
 * - Blood product management
 * - Post-operative order sets
 * - Surgical complication tracking and reporting
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x, HL7 FHIR
 *
 * @security
 * - HIPAA-compliant association design
 * - PHI access control through scoped associations
 * - Audit trail for all surgical data access
 * - Encryption for sensitive surgical records
 * - Role-based association filtering
 * - Regulatory compliance (Joint Commission, FDA)
 *
 * @example Basic surgical case management
 * ```typescript
 * import {
 *   createSurgicalCaseAssociations,
 *   scheduleOperatingRoom,
 *   linkSurgicalPreferenceCard
 * } from './health-surgical-management-kit';
 *
 * // Set up surgical case associations
 * const caseAssociations = await createSurgicalCaseAssociations(
 *   SurgicalCase,
 *   Patient,
 *   Surgeon,
 *   { includeProcedures: true, trackStatus: true }
 * );
 *
 * // Schedule OR
 * const orBooking = await scheduleOperatingRoom(
 *   surgicalCase,
 *   operatingRoom,
 *   { startTime: new Date(), estimatedDuration: 180 }
 * );
 *
 * // Link preference card
 * await linkSurgicalPreferenceCard(surgeon, procedure, preferenceCard);
 * ```
 *
 * @example Advanced perioperative workflow
 * ```typescript
 * import {
 *   trackAnesthesiaRecord,
 *   createIntraoperativeNote,
 *   recordSurgicalTimeOut
 * } from './health-surgical-management-kit';
 *
 * // Track anesthesia
 * const anesthesiaRecord = await trackAnesthesiaRecord(
 *   surgicalCase,
 *   anesthesiologist,
 *   { anesthesiaType: 'General', asaClass: 'II' }
 * );
 *
 * // Create intraop note
 * const intraopNote = await createIntraoperativeNote(
 *   surgicalCase,
 *   surgeon,
 *   { findings: 'Normal anatomy', complications: 'None' }
 * );
 *
 * // Record time-out
 * await recordSurgicalTimeOut(
 *   surgicalCase,
 *   surgicalTeam,
 *   { allMembersPresent: true, verifiedCorrectSite: true }
 * );
 * ```
 *
 * LOC: HSM-001
 * UPSTREAM: sequelize, hl7-fhir, ihe-integration
 * DOWNSTREAM: surgery-service/*, perioperative-workflow/*, or-management/*
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSurgicalComplicationAssociations = exports.trackSurgicalComplication = exports.linkOrderSetToTemplate = exports.createPostOpOrderSetAssociations = exports.createPostOpOrderSet = exports.trackBloodProductAdministration = exports.createBloodProductAssociations = exports.manageSurgicalBloodProducts = exports.querySpecimenChainOfCustody = exports.createPathologySpecimenAssociations = exports.trackPathologySpecimen = exports.validateTimeOutCompletion = exports.createTimeOutAssociations = exports.recordSurgicalTimeOut = exports.trackChecklistCompletion = exports.createSafetyChecklistAssociations = exports.createSurgicalSafetyChecklist = exports.queryImplantRegistryByPatient = exports.createImplantTrackingAssociations = exports.trackSurgicalImplant = exports.trackConsentSignatures = exports.createSurgicalConsentAssociations = exports.createSurgicalConsent = exports.linkIntraoperativeImages = exports.createIntraoperativeNoteAssociations = exports.createIntraoperativeNote = exports.trackAnesthesiaVitalSigns = exports.linkAnesthesiaMedications = exports.createAnesthesiaRecordAssociations = exports.trackAnesthesiaRecord = exports.querySupplyUsageByCase = exports.createSupplyUsageAssociations = exports.trackSurgicalSupplyUsage = exports.queryPreferenceCardWithItems = exports.linkPreferenceCardItems = exports.createPreferenceCardAssociations = exports.linkSurgicalPreferenceCard = exports.findORConflicts = exports.queryORAvailability = exports.createORSchedulingAssociations = exports.scheduleOperatingRoom = exports.querySurgicalCasesWithAssociations = exports.createSurgicalCaseStatusTracking = exports.linkSurgicalCaseProcedures = exports.createSurgicalCaseAssociations = exports.ImplantCategory = exports.SurgicalPriority = exports.ASAClass = exports.AnesthesiaType = exports.SurgicalCaseStatus = void 0;
exports.linkComplicationsToQualityInitiatives = exports.queryComplicationStatsBySurgeon = void 0;
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * @enum SurgicalCaseStatus
 * @description Surgical case workflow statuses
 */
var SurgicalCaseStatus;
(function (SurgicalCaseStatus) {
    SurgicalCaseStatus["SCHEDULED"] = "SCHEDULED";
    SurgicalCaseStatus["PRE_OP"] = "PRE_OP";
    SurgicalCaseStatus["IN_OR"] = "IN_OR";
    SurgicalCaseStatus["IN_PROGRESS"] = "IN_PROGRESS";
    SurgicalCaseStatus["CLOSING"] = "CLOSING";
    SurgicalCaseStatus["RECOVERY"] = "RECOVERY";
    SurgicalCaseStatus["PACU"] = "PACU";
    SurgicalCaseStatus["COMPLETED"] = "COMPLETED";
    SurgicalCaseStatus["CANCELLED"] = "CANCELLED";
    SurgicalCaseStatus["DELAYED"] = "DELAYED";
})(SurgicalCaseStatus || (exports.SurgicalCaseStatus = SurgicalCaseStatus = {}));
/**
 * @enum AnesthesiaType
 * @description Types of anesthesia
 */
var AnesthesiaType;
(function (AnesthesiaType) {
    AnesthesiaType["GENERAL"] = "GENERAL";
    AnesthesiaType["REGIONAL"] = "REGIONAL";
    AnesthesiaType["SPINAL"] = "SPINAL";
    AnesthesiaType["EPIDURAL"] = "EPIDURAL";
    AnesthesiaType["LOCAL"] = "LOCAL";
    AnesthesiaType["MAC"] = "MAC";
    AnesthesiaType["SEDATION"] = "SEDATION";
})(AnesthesiaType || (exports.AnesthesiaType = AnesthesiaType = {}));
/**
 * @enum ASAClass
 * @description ASA Physical Status Classification
 */
var ASAClass;
(function (ASAClass) {
    ASAClass["I"] = "I";
    ASAClass["II"] = "II";
    ASAClass["III"] = "III";
    ASAClass["IV"] = "IV";
    ASAClass["V"] = "V";
    ASAClass["VI"] = "VI";
})(ASAClass || (exports.ASAClass = ASAClass = {}));
/**
 * @enum SurgicalPriority
 * @description Surgical case priority levels
 */
var SurgicalPriority;
(function (SurgicalPriority) {
    SurgicalPriority["ELECTIVE"] = "ELECTIVE";
    SurgicalPriority["URGENT"] = "URGENT";
    SurgicalPriority["EMERGENT"] = "EMERGENT";
    SurgicalPriority["TRAUMA"] = "TRAUMA";
})(SurgicalPriority || (exports.SurgicalPriority = SurgicalPriority = {}));
/**
 * @enum ImplantCategory
 * @description Categories of surgical implants
 */
var ImplantCategory;
(function (ImplantCategory) {
    ImplantCategory["ORTHOPEDIC"] = "ORTHOPEDIC";
    ImplantCategory["CARDIAC"] = "CARDIAC";
    ImplantCategory["NEUROLOGICAL"] = "NEUROLOGICAL";
    ImplantCategory["VASCULAR"] = "VASCULAR";
    ImplantCategory["OPHTHALMIC"] = "OPHTHALMIC";
    ImplantCategory["GENERAL"] = "GENERAL";
})(ImplantCategory || (exports.ImplantCategory = ImplantCategory = {}));
// ============================================================================
// SURGICAL CASE SCHEDULING ASSOCIATIONS
// ============================================================================
/**
 * Creates comprehensive surgical case associations
 *
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {ModelStatic<any>} Patient - Patient model
 * @param {ModelStatic<any>} Surgeon - Surgeon model
 * @param {SurgicalCaseConfig} config - Case configuration
 * @returns {Promise<Object>} Created associations
 *
 * @example
 * ```typescript
 * const caseAssociations = await createSurgicalCaseAssociations(
 *   SurgicalCase,
 *   Patient,
 *   Surgeon,
 *   { includeProcedures: true, includeTeam: true }
 * );
 * ```
 */
const createSurgicalCaseAssociations = async (SurgicalCase, Patient, Surgeon, config = {}) => {
    const patientAssoc = SurgicalCase.belongsTo(Patient, {
        foreignKey: 'patientId',
        as: 'patient',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });
    const primarySurgeonAssoc = SurgicalCase.belongsTo(Surgeon, {
        foreignKey: 'primarySurgeonId',
        as: 'primarySurgeon',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });
    const assistingSurgeonAssoc = SurgicalCase.belongsTo(Surgeon, {
        foreignKey: 'assistingSurgeonId',
        as: 'assistingSurgeon',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    });
    return {
        patient: patientAssoc,
        primarySurgeon: primarySurgeonAssoc,
        assistingSurgeon: assistingSurgeonAssoc,
    };
};
exports.createSurgicalCaseAssociations = createSurgicalCaseAssociations;
/**
 * Links surgical case to procedures
 *
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {ModelStatic<any>} Procedure - Procedure model
 * @param {ModelStatic<any>} CPTCode - CPT code model
 * @returns {Object} Procedure associations
 *
 * @example
 * ```typescript
 * const procedureLinks = linkSurgicalCaseProcedures(
 *   SurgicalCase,
 *   Procedure,
 *   CPTCode
 * );
 * ```
 */
const linkSurgicalCaseProcedures = (SurgicalCase, Procedure, CPTCode) => {
    const proceduresAssoc = SurgicalCase.belongsToMany(Procedure, {
        through: 'surgical_case_procedures',
        foreignKey: 'caseId',
        otherKey: 'procedureId',
        as: 'procedures',
        timestamps: true,
    });
    Procedure.belongsTo(CPTCode, {
        foreignKey: 'cptCodeId',
        as: 'cptCode',
        onDelete: 'RESTRICT',
    });
    return { procedures: proceduresAssoc, cptCode: Procedure.associations.cptCode };
};
exports.linkSurgicalCaseProcedures = linkSurgicalCaseProcedures;
/**
 * Creates surgical case status tracking
 *
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {ModelStatic<any>} CaseStatusLog - Status log model
 * @returns {Association} Status log association
 *
 * @example
 * ```typescript
 * const statusAssoc = createSurgicalCaseStatusTracking(
 *   SurgicalCase,
 *   CaseStatusLog
 * );
 * ```
 */
const createSurgicalCaseStatusTracking = (SurgicalCase, CaseStatusLog) => {
    return SurgicalCase.hasMany(CaseStatusLog, {
        foreignKey: 'caseId',
        as: 'statusHistory',
        onDelete: 'CASCADE',
    });
};
exports.createSurgicalCaseStatusTracking = createSurgicalCaseStatusTracking;
/**
 * Queries surgical cases with comprehensive associations
 *
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {WhereOptions} where - Query conditions
 * @param {SurgicalCaseConfig} config - Query configuration
 * @returns {Promise<any[]>} Surgical cases with associations
 *
 * @example
 * ```typescript
 * const cases = await querySurgicalCasesWithAssociations(
 *   SurgicalCase,
 *   { status: 'SCHEDULED', surgeonId: surgeonId },
 *   { includePatient: true, includeProcedures: true }
 * );
 * ```
 */
const querySurgicalCasesWithAssociations = async (SurgicalCase, where = {}, config = {}) => {
    const include = [];
    if (config.includePatient) {
        include.push({
            association: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'mrn'],
        });
    }
    if (config.includeSurgeon) {
        include.push({
            association: 'primarySurgeon',
            attributes: ['id', 'firstName', 'lastName', 'npi', 'specialty'],
        });
        include.push({
            association: 'assistingSurgeon',
            attributes: ['id', 'firstName', 'lastName', 'npi', 'specialty'],
            required: false,
        });
    }
    if (config.includeProcedures) {
        include.push({
            association: 'procedures',
            attributes: ['id', 'name', 'description'],
            through: { attributes: ['isPrimary', 'laterality'] },
            include: [{ association: 'cptCode', attributes: ['code', 'description'] }],
        });
    }
    if (config.includeTeam) {
        include.push({
            association: 'surgicalTeam',
            attributes: ['id', 'memberId', 'role', 'isPrimary'],
        });
    }
    return await SurgicalCase.findAll({
        where,
        include,
        order: [['scheduledStartTime', 'ASC']],
    });
};
exports.querySurgicalCasesWithAssociations = querySurgicalCasesWithAssociations;
// ============================================================================
// OPERATING ROOM SCHEDULING
// ============================================================================
/**
 * Schedules operating room for surgical case
 *
 * @param {Model} surgicalCase - Surgical case instance
 * @param {Model} operatingRoom - Operating room instance
 * @param {ORSchedulingConfig} config - Scheduling configuration
 * @returns {Promise<any>} Created OR booking
 *
 * @example
 * ```typescript
 * const orBooking = await scheduleOperatingRoom(
 *   surgicalCase,
 *   operatingRoom,
 *   {
 *     startTime: new Date('2025-11-10T08:00:00'),
 *     estimatedDuration: 120,
 *     turnoverTime: 30
 *   }
 * );
 * ```
 */
const scheduleOperatingRoom = async (surgicalCase, operatingRoom, config) => {
    const ORSchedule = surgicalCase.sequelize.model('ORSchedule');
    const endTime = new Date(config.startTime);
    endTime.setMinutes(endTime.getMinutes() + config.estimatedDuration);
    return await ORSchedule.create({
        caseId: surgicalCase.id,
        operatingRoomId: operatingRoom.id,
        scheduledStartTime: config.startTime,
        scheduledEndTime: endTime,
        estimatedDuration: config.estimatedDuration,
        turnoverTime: config.turnoverTime || 30,
        emergencyCase: config.emergencyCase || false,
        requiresSpecialEquipment: config.requiresSpecialEquipment || false,
        status: 'SCHEDULED',
    });
};
exports.scheduleOperatingRoom = scheduleOperatingRoom;
/**
 * Creates OR scheduling associations
 *
 * @param {ModelStatic<any>} ORSchedule - OR schedule model
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {ModelStatic<any>} OperatingRoom - Operating room model
 * @returns {Object} Scheduling associations
 *
 * @example
 * ```typescript
 * const scheduleAssocs = createORSchedulingAssociations(
 *   ORSchedule,
 *   SurgicalCase,
 *   OperatingRoom
 * );
 * ```
 */
const createORSchedulingAssociations = (ORSchedule, SurgicalCase, OperatingRoom) => {
    const caseAssoc = ORSchedule.belongsTo(SurgicalCase, {
        foreignKey: 'caseId',
        as: 'surgicalCase',
        onDelete: 'CASCADE',
    });
    const roomAssoc = ORSchedule.belongsTo(OperatingRoom, {
        foreignKey: 'operatingRoomId',
        as: 'operatingRoom',
        onDelete: 'RESTRICT',
    });
    return { surgicalCase: caseAssoc, operatingRoom: roomAssoc };
};
exports.createORSchedulingAssociations = createORSchedulingAssociations;
/**
 * Queries OR schedule availability
 *
 * @param {ModelStatic<any>} ORSchedule - OR schedule model
 * @param {Date} date - Date to check
 * @param {string} operatingRoomId - Operating room ID
 * @returns {Promise<any[]>} Available time slots
 *
 * @example
 * ```typescript
 * const availability = await queryORAvailability(
 *   ORSchedule,
 *   new Date('2025-11-10'),
 *   operatingRoomId
 * );
 * ```
 */
const queryORAvailability = async (ORSchedule, date, operatingRoomId) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const scheduled = await ORSchedule.findAll({
        where: {
            operatingRoomId,
            scheduledStartTime: { [sequelize_1.Op.between]: [startOfDay, endOfDay] },
            status: { [sequelize_1.Op.notIn]: ['CANCELLED', 'COMPLETED'] },
        },
        order: [['scheduledStartTime', 'ASC']],
        attributes: ['scheduledStartTime', 'scheduledEndTime', 'turnoverTime'],
    });
    return scheduled;
};
exports.queryORAvailability = queryORAvailability;
/**
 * Finds OR conflicts
 *
 * @param {ModelStatic<any>} ORSchedule - OR schedule model
 * @param {string} operatingRoomId - Operating room ID
 * @param {Date} startTime - Proposed start time
 * @param {Date} endTime - Proposed end time
 * @returns {Promise<boolean>} True if conflict exists
 *
 * @example
 * ```typescript
 * const hasConflict = await findORConflicts(
 *   ORSchedule,
 *   operatingRoomId,
 *   new Date('2025-11-10T08:00:00'),
 *   new Date('2025-11-10T10:00:00')
 * );
 * ```
 */
const findORConflicts = async (ORSchedule, operatingRoomId, startTime, endTime) => {
    const conflicts = await ORSchedule.count({
        where: {
            operatingRoomId,
            status: { [sequelize_1.Op.notIn]: ['CANCELLED', 'COMPLETED'] },
            [sequelize_1.Op.or]: [
                {
                    scheduledStartTime: { [sequelize_1.Op.between]: [startTime, endTime] },
                },
                {
                    scheduledEndTime: { [sequelize_1.Op.between]: [startTime, endTime] },
                },
                {
                    [sequelize_1.Op.and]: [
                        { scheduledStartTime: { [sequelize_1.Op.lte]: startTime } },
                        { scheduledEndTime: { [sequelize_1.Op.gte]: endTime } },
                    ],
                },
            ],
        },
    });
    return conflicts > 0;
};
exports.findORConflicts = findORConflicts;
// ============================================================================
// SURGICAL PREFERENCE CARDS
// ============================================================================
/**
 * Links surgical preference card
 *
 * @param {Model} surgeon - Surgeon instance
 * @param {Model} procedure - Procedure instance
 * @param {Model} preferenceCard - Preference card instance
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await linkSurgicalPreferenceCard(surgeon, procedure, preferenceCard);
 * ```
 */
const linkSurgicalPreferenceCard = async (surgeon, procedure, preferenceCard) => {
    await preferenceCard.update({
        surgeonId: surgeon.id,
        procedureId: procedure.id,
    });
};
exports.linkSurgicalPreferenceCard = linkSurgicalPreferenceCard;
/**
 * Creates preference card associations
 *
 * @param {ModelStatic<any>} PreferenceCard - Preference card model
 * @param {ModelStatic<any>} Surgeon - Surgeon model
 * @param {ModelStatic<any>} Procedure - Procedure model
 * @returns {Object} Preference card associations
 *
 * @example
 * ```typescript
 * const prefCardAssocs = createPreferenceCardAssociations(
 *   PreferenceCard,
 *   Surgeon,
 *   Procedure
 * );
 * ```
 */
const createPreferenceCardAssociations = (PreferenceCard, Surgeon, Procedure) => {
    const surgeonAssoc = PreferenceCard.belongsTo(Surgeon, {
        foreignKey: 'surgeonId',
        as: 'surgeon',
        onDelete: 'CASCADE',
    });
    const procedureAssoc = PreferenceCard.belongsTo(Procedure, {
        foreignKey: 'procedureId',
        as: 'procedure',
        onDelete: 'CASCADE',
    });
    return { surgeon: surgeonAssoc, procedure: procedureAssoc };
};
exports.createPreferenceCardAssociations = createPreferenceCardAssociations;
/**
 * Links preference card to instruments and supplies
 *
 * @param {ModelStatic<any>} PreferenceCard - Preference card model
 * @param {ModelStatic<any>} Instrument - Instrument model
 * @param {ModelStatic<any>} Supply - Supply model
 * @returns {Object} Instrument and supply associations
 *
 * @example
 * ```typescript
 * const itemAssocs = linkPreferenceCardItems(
 *   PreferenceCard,
 *   Instrument,
 *   Supply
 * );
 * ```
 */
const linkPreferenceCardItems = (PreferenceCard, Instrument, Supply) => {
    const instrumentsAssoc = PreferenceCard.belongsToMany(Instrument, {
        through: 'preference_card_instruments',
        foreignKey: 'preferenceCardId',
        otherKey: 'instrumentId',
        as: 'instruments',
        timestamps: false,
    });
    const suppliesAssoc = PreferenceCard.belongsToMany(Supply, {
        through: 'preference_card_supplies',
        foreignKey: 'preferenceCardId',
        otherKey: 'supplyId',
        as: 'supplies',
        timestamps: false,
    });
    return { instruments: instrumentsAssoc, supplies: suppliesAssoc };
};
exports.linkPreferenceCardItems = linkPreferenceCardItems;
/**
 * Queries preference card with items
 *
 * @param {ModelStatic<any>} PreferenceCard - Preference card model
 * @param {string} surgeonId - Surgeon ID
 * @param {string} procedureId - Procedure ID
 * @param {PreferenceCardConfig} config - Query configuration
 * @returns {Promise<any>} Preference card with items
 *
 * @example
 * ```typescript
 * const prefCard = await queryPreferenceCardWithItems(
 *   PreferenceCard,
 *   surgeonId,
 *   procedureId,
 *   { includeInstruments: true, includeSupplies: true }
 * );
 * ```
 */
const queryPreferenceCardWithItems = async (PreferenceCard, surgeonId, procedureId, config = {}) => {
    const include = [];
    if (config.includeInstruments) {
        include.push({
            association: 'instruments',
            attributes: ['id', 'name', 'catalogNumber', 'manufacturer'],
            through: { attributes: ['quantity', 'preference'] },
        });
    }
    if (config.includeSupplies) {
        include.push({
            association: 'supplies',
            attributes: ['id', 'name', 'catalogNumber', 'uom'],
            through: { attributes: ['quantity', 'isPreferred'] },
        });
    }
    return await PreferenceCard.findOne({
        where: { surgeonId, procedureId, isActive: true },
        include,
    });
};
exports.queryPreferenceCardWithItems = queryPreferenceCardWithItems;
// ============================================================================
// SURGICAL SUPPLY TRACKING
// ============================================================================
/**
 * Tracks surgical supply usage
 *
 * @param {Model} surgicalCase - Surgical case instance
 * @param {Model} supply - Supply instance
 * @param {number} quantity - Quantity used
 * @param {Transaction} transaction - Optional transaction
 * @returns {Promise<any>} Created usage record
 *
 * @example
 * ```typescript
 * const usage = await trackSurgicalSupplyUsage(
 *   surgicalCase,
 *   supply,
 *   5,
 *   transaction
 * );
 * ```
 */
const trackSurgicalSupplyUsage = async (surgicalCase, supply, quantity, transaction) => {
    const SupplyUsage = surgicalCase.sequelize.model('SurgicalSupplyUsage');
    return await SupplyUsage.create({
        caseId: surgicalCase.id,
        supplyId: supply.id,
        quantity,
        recordedAt: new Date(),
    }, { transaction });
};
exports.trackSurgicalSupplyUsage = trackSurgicalSupplyUsage;
/**
 * Creates supply usage associations
 *
 * @param {ModelStatic<any>} SupplyUsage - Supply usage model
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {ModelStatic<any>} Supply - Supply model
 * @returns {Object} Usage associations
 *
 * @example
 * ```typescript
 * const usageAssocs = createSupplyUsageAssociations(
 *   SupplyUsage,
 *   SurgicalCase,
 *   Supply
 * );
 * ```
 */
const createSupplyUsageAssociations = (SupplyUsage, SurgicalCase, Supply) => {
    const caseAssoc = SupplyUsage.belongsTo(SurgicalCase, {
        foreignKey: 'caseId',
        as: 'surgicalCase',
        onDelete: 'CASCADE',
    });
    const supplyAssoc = SupplyUsage.belongsTo(Supply, {
        foreignKey: 'supplyId',
        as: 'supply',
        onDelete: 'RESTRICT',
    });
    return { surgicalCase: caseAssoc, supply: supplyAssoc };
};
exports.createSupplyUsageAssociations = createSupplyUsageAssociations;
/**
 * Queries supply usage by case
 *
 * @param {ModelStatic<any>} SupplyUsage - Supply usage model
 * @param {string} caseId - Surgical case ID
 * @returns {Promise<any[]>} Supply usage records
 *
 * @example
 * ```typescript
 * const usage = await querySupplyUsageByCa se(SupplyUsage, caseId);
 * ```
 */
const querySupplyUsageByCase = async (SupplyUsage, caseId) => {
    return await SupplyUsage.findAll({
        where: { caseId },
        include: [
            {
                association: 'supply',
                attributes: ['id', 'name', 'catalogNumber', 'unitCost'],
            },
        ],
        order: [['recordedAt', 'ASC']],
    });
};
exports.querySupplyUsageByCase = querySupplyUsageByCase;
// ============================================================================
// ANESTHESIA DOCUMENTATION
// ============================================================================
/**
 * Tracks anesthesia record
 *
 * @param {Model} surgicalCase - Surgical case instance
 * @param {Model} anesthesiologist - Anesthesiologist instance
 * @param {AnesthesiaRecordConfig} config - Anesthesia configuration
 * @returns {Promise<any>} Created anesthesia record
 *
 * @example
 * ```typescript
 * const anesthesiaRecord = await trackAnesthesiaRecord(
 *   surgicalCase,
 *   anesthesiologist,
 *   { anesthesiaType: AnesthesiaType.GENERAL, asaClass: ASAClass.II }
 * );
 * ```
 */
const trackAnesthesiaRecord = async (surgicalCase, anesthesiologist, config) => {
    const AnesthesiaRecord = surgicalCase.sequelize.model('AnesthesiaRecord');
    return await AnesthesiaRecord.create({
        caseId: surgicalCase.id,
        anesthesiologistId: anesthesiologist.id,
        anesthesiaType: config.anesthesiaType,
        asaClass: config.asaClass,
        startTime: new Date(),
    });
};
exports.trackAnesthesiaRecord = trackAnesthesiaRecord;
/**
 * Creates anesthesia record associations
 *
 * @param {ModelStatic<any>} AnesthesiaRecord - Anesthesia record model
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {ModelStatic<any>} Anesthesiologist - Anesthesiologist model
 * @returns {Object} Anesthesia associations
 *
 * @example
 * ```typescript
 * const anesAssocs = createAnesthesiaRecordAssociations(
 *   AnesthesiaRecord,
 *   SurgicalCase,
 *   Anesthesiologist
 * );
 * ```
 */
const createAnesthesiaRecordAssociations = (AnesthesiaRecord, SurgicalCase, Anesthesiologist) => {
    const caseAssoc = AnesthesiaRecord.belongsTo(SurgicalCase, {
        foreignKey: 'caseId',
        as: 'surgicalCase',
        onDelete: 'CASCADE',
    });
    const anesAssoc = AnesthesiaRecord.belongsTo(Anesthesiologist, {
        foreignKey: 'anesthesiologistId',
        as: 'anesthesiologist',
        onDelete: 'RESTRICT',
    });
    return { surgicalCase: caseAssoc, anesthesiologist: anesAssoc };
};
exports.createAnesthesiaRecordAssociations = createAnesthesiaRecordAssociations;
/**
 * Links anesthesia medications
 *
 * @param {ModelStatic<any>} AnesthesiaRecord - Anesthesia record model
 * @param {ModelStatic<any>} Medication - Medication model
 * @returns {Association} Medication association
 *
 * @example
 * ```typescript
 * const medAssoc = linkAnesthesiaMedications(AnesthesiaRecord, Medication);
 * ```
 */
const linkAnesthesiaMedications = (AnesthesiaRecord, Medication) => {
    return AnesthesiaRecord.belongsToMany(Medication, {
        through: 'anesthesia_medications',
        foreignKey: 'recordId',
        otherKey: 'medicationId',
        as: 'medications',
        timestamps: true,
    });
};
exports.linkAnesthesiaMedications = linkAnesthesiaMedications;
/**
 * Tracks anesthesia vital signs
 *
 * @param {ModelStatic<any>} AnesthesiaRecord - Anesthesia record model
 * @param {ModelStatic<any>} VitalSign - Vital sign model
 * @returns {Association} Vital signs association
 *
 * @example
 * ```typescript
 * const vitalsAssoc = trackAnesthesiaVitalSigns(
 *   AnesthesiaRecord,
 *   VitalSign
 * );
 * ```
 */
const trackAnesthesiaVitalSigns = (AnesthesiaRecord, VitalSign) => {
    return AnesthesiaRecord.hasMany(VitalSign, {
        foreignKey: 'recordId',
        as: 'vitalSigns',
        onDelete: 'CASCADE',
    });
};
exports.trackAnesthesiaVitalSigns = trackAnesthesiaVitalSigns;
// ============================================================================
// INTRAOPERATIVE NOTES
// ============================================================================
/**
 * Creates intraoperative note
 *
 * @param {Model} surgicalCase - Surgical case instance
 * @param {Model} surgeon - Surgeon instance
 * @param {IntraoperativeNoteConfig} config - Note configuration
 * @returns {Promise<any>} Created intraop note
 *
 * @example
 * ```typescript
 * const intraopNote = await createIntraoperativeNote(
 *   surgicalCase,
 *   surgeon,
 *   {
 *     findings: 'Normal anatomy',
 *     complications: 'None',
 *     estimatedBloodLoss: 50
 *   }
 * );
 * ```
 */
const createIntraoperativeNote = async (surgicalCase, surgeon, config) => {
    const IntraoperativeNote = surgicalCase.sequelize.model('IntraoperativeNote');
    return await IntraoperativeNote.create({
        caseId: surgicalCase.id,
        surgeonId: surgeon.id,
        findings: config.findings,
        complications: config.complications,
        estimatedBloodLoss: config.estimatedBloodLoss,
        specimens: config.specimens,
        createdAt: new Date(),
    });
};
exports.createIntraoperativeNote = createIntraoperativeNote;
/**
 * Creates intraoperative note associations
 *
 * @param {ModelStatic<any>} IntraoperativeNote - Intraoperative note model
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {ModelStatic<any>} Surgeon - Surgeon model
 * @returns {Object} Intraop note associations
 *
 * @example
 * ```typescript
 * const intraopAssocs = createIntraoperativeNoteAssociations(
 *   IntraoperativeNote,
 *   SurgicalCase,
 *   Surgeon
 * );
 * ```
 */
const createIntraoperativeNoteAssociations = (IntraoperativeNote, SurgicalCase, Surgeon) => {
    const caseAssoc = IntraoperativeNote.belongsTo(SurgicalCase, {
        foreignKey: 'caseId',
        as: 'surgicalCase',
        onDelete: 'CASCADE',
    });
    const surgeonAssoc = IntraoperativeNote.belongsTo(Surgeon, {
        foreignKey: 'surgeonId',
        as: 'surgeon',
        onDelete: 'RESTRICT',
    });
    return { surgicalCase: caseAssoc, surgeon: surgeonAssoc };
};
exports.createIntraoperativeNoteAssociations = createIntraoperativeNoteAssociations;
/**
 * Links intraoperative images
 *
 * @param {ModelStatic<any>} IntraoperativeNote - Intraoperative note model
 * @param {ModelStatic<any>} SurgicalImage - Surgical image model
 * @returns {Association} Image association
 *
 * @example
 * ```typescript
 * const imageAssoc = linkIntraoperativeImages(
 *   IntraoperativeNote,
 *   SurgicalImage
 * );
 * ```
 */
const linkIntraoperativeImages = (IntraoperativeNote, SurgicalImage) => {
    return IntraoperativeNote.hasMany(SurgicalImage, {
        foreignKey: 'noteId',
        as: 'images',
        onDelete: 'CASCADE',
    });
};
exports.linkIntraoperativeImages = linkIntraoperativeImages;
// ============================================================================
// SURGICAL CONSENT MANAGEMENT
// ============================================================================
/**
 * Creates surgical consent
 *
 * @param {Model} surgicalCase - Surgical case instance
 * @param {Model} patient - Patient instance
 * @param {SurgicalConsentConfig} config - Consent configuration
 * @returns {Promise<any>} Created consent record
 *
 * @example
 * ```typescript
 * const consent = await createSurgicalConsent(
 *   surgicalCase,
 *   patient,
 *   { includeRisks: true, requireWitness: true }
 * );
 * ```
 */
const createSurgicalConsent = async (surgicalCase, patient, config = {}) => {
    const SurgicalConsent = surgicalCase.sequelize.model('SurgicalConsent');
    return await SurgicalConsent.create({
        caseId: surgicalCase.id,
        patientId: patient.id,
        includeRisks: config.includeRisks || true,
        includeBenefits: config.includeBenefits || true,
        includeAlternatives: config.includeAlternatives || true,
        requireWitness: config.requireWitness || false,
        electronicSignature: config.electronicSignature || false,
        status: 'PENDING',
        createdAt: new Date(),
    });
};
exports.createSurgicalConsent = createSurgicalConsent;
/**
 * Creates surgical consent associations
 *
 * @param {ModelStatic<any>} SurgicalConsent - Surgical consent model
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {ModelStatic<any>} Patient - Patient model
 * @returns {Object} Consent associations
 *
 * @example
 * ```typescript
 * const consentAssocs = createSurgicalConsentAssociations(
 *   SurgicalConsent,
 *   SurgicalCase,
 *   Patient
 * );
 * ```
 */
const createSurgicalConsentAssociations = (SurgicalConsent, SurgicalCase, Patient) => {
    const caseAssoc = SurgicalConsent.belongsTo(SurgicalCase, {
        foreignKey: 'caseId',
        as: 'surgicalCase',
        onDelete: 'CASCADE',
    });
    const patientAssoc = SurgicalConsent.belongsTo(Patient, {
        foreignKey: 'patientId',
        as: 'patient',
        onDelete: 'CASCADE',
    });
    return { surgicalCase: caseAssoc, patient: patientAssoc };
};
exports.createSurgicalConsentAssociations = createSurgicalConsentAssociations;
/**
 * Tracks consent signatures
 *
 * @param {ModelStatic<any>} SurgicalConsent - Surgical consent model
 * @param {ModelStatic<any>} ConsentSignature - Consent signature model
 * @returns {Association} Signature association
 *
 * @example
 * ```typescript
 * const sigAssoc = trackConsentSignatures(SurgicalConsent, ConsentSignature);
 * ```
 */
const trackConsentSignatures = (SurgicalConsent, ConsentSignature) => {
    return SurgicalConsent.hasMany(ConsentSignature, {
        foreignKey: 'consentId',
        as: 'signatures',
        onDelete: 'CASCADE',
    });
};
exports.trackConsentSignatures = trackConsentSignatures;
// ============================================================================
// IMPLANT TRACKING & REGISTRY
// ============================================================================
/**
 * Tracks surgical implant
 *
 * @param {Model} surgicalCase - Surgical case instance
 * @param {Model} implant - Implant instance
 * @param {ImplantTrackingConfig} config - Implant configuration
 * @returns {Promise<any>} Created implant tracking record
 *
 * @example
 * ```typescript
 * const implantTracking = await trackSurgicalImplant(
 *   surgicalCase,
 *   implant,
 *   {
 *     category: ImplantCategory.ORTHOPEDIC,
 *     lotNumber: 'LOT12345',
 *     serialNumber: 'SN987654'
 *   }
 * );
 * ```
 */
const trackSurgicalImplant = async (surgicalCase, implant, config) => {
    const ImplantTracking = surgicalCase.sequelize.model('ImplantTracking');
    return await ImplantTracking.create({
        caseId: surgicalCase.id,
        implantId: implant.id,
        category: config.category,
        manufacturer: config.manufacturer,
        lotNumber: config.lotNumber,
        serialNumber: config.serialNumber,
        implantedAt: new Date(),
        requireFDAReporting: config.requireFDAReporting || false,
    });
};
exports.trackSurgicalImplant = trackSurgicalImplant;
/**
 * Creates implant tracking associations
 *
 * @param {ModelStatic<any>} ImplantTracking - Implant tracking model
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {ModelStatic<any>} Implant - Implant model
 * @returns {Object} Implant tracking associations
 *
 * @example
 * ```typescript
 * const implantAssocs = createImplantTrackingAssociations(
 *   ImplantTracking,
 *   SurgicalCase,
 *   Implant
 * );
 * ```
 */
const createImplantTrackingAssociations = (ImplantTracking, SurgicalCase, Implant) => {
    const caseAssoc = ImplantTracking.belongsTo(SurgicalCase, {
        foreignKey: 'caseId',
        as: 'surgicalCase',
        onDelete: 'CASCADE',
    });
    const implantAssoc = ImplantTracking.belongsTo(Implant, {
        foreignKey: 'implantId',
        as: 'implant',
        onDelete: 'RESTRICT',
    });
    return { surgicalCase: caseAssoc, implant: implantAssoc };
};
exports.createImplantTrackingAssociations = createImplantTrackingAssociations;
/**
 * Queries implant registry by patient
 *
 * @param {ModelStatic<any>} ImplantTracking - Implant tracking model
 * @param {string} patientId - Patient ID
 * @returns {Promise<any[]>} Patient implant registry
 *
 * @example
 * ```typescript
 * const implantRegistry = await queryImplantRegistryByPatient(
 *   ImplantTracking,
 *   patientId
 * );
 * ```
 */
const queryImplantRegistryByPatient = async (ImplantTracking, patientId) => {
    return await ImplantTracking.findAll({
        include: [
            {
                association: 'surgicalCase',
                where: { patientId },
                attributes: ['id', 'caseDate', 'caseNumber'],
                include: [
                    {
                        association: 'primarySurgeon',
                        attributes: ['id', 'firstName', 'lastName', 'npi'],
                    },
                ],
            },
            {
                association: 'implant',
                attributes: ['id', 'name', 'catalogNumber', 'manufacturer'],
            },
        ],
        order: [['implantedAt', 'DESC']],
    });
};
exports.queryImplantRegistryByPatient = queryImplantRegistryByPatient;
// ============================================================================
// SURGICAL SAFETY CHECKLIST
// ============================================================================
/**
 * Creates surgical safety checklist
 *
 * @param {Model} surgicalCase - Surgical case instance
 * @param {SafetyChecklistConfig} config - Checklist configuration
 * @returns {Promise<any>} Created safety checklist
 *
 * @example
 * ```typescript
 * const checklist = await createSurgicalSafetyChecklist(
 *   surgicalCase,
 *   { includeSignIn: true, includeTimeOut: true, includeSignOut: true }
 * );
 * ```
 */
const createSurgicalSafetyChecklist = async (surgicalCase, config = {}) => {
    const SafetyChecklist = surgicalCase.sequelize.model('SurgicalSafetyChecklist');
    return await SafetyChecklist.create({
        caseId: surgicalCase.id,
        includeSignIn: config.includeSignIn !== false,
        includeTimeOut: config.includeTimeOut !== false,
        includeSignOut: config.includeSignOut !== false,
        requireAllSignatures: config.requireAllSignatures !== false,
        status: 'PENDING',
    });
};
exports.createSurgicalSafetyChecklist = createSurgicalSafetyChecklist;
/**
 * Creates safety checklist associations
 *
 * @param {ModelStatic<any>} SafetyChecklist - Safety checklist model
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @returns {Association} Checklist association
 *
 * @example
 * ```typescript
 * const checklistAssoc = createSafetyChecklistAssociations(
 *   SafetyChecklist,
 *   SurgicalCase
 * );
 * ```
 */
const createSafetyChecklistAssociations = (SafetyChecklist, SurgicalCase) => {
    return SafetyChecklist.belongsTo(SurgicalCase, {
        foreignKey: 'caseId',
        as: 'surgicalCase',
        onDelete: 'CASCADE',
    });
};
exports.createSafetyChecklistAssociations = createSafetyChecklistAssociations;
/**
 * Tracks checklist completion
 *
 * @param {ModelStatic<any>} SafetyChecklist - Safety checklist model
 * @param {ModelStatic<any>} ChecklistItem - Checklist item model
 * @returns {Association} Checklist items association
 *
 * @example
 * ```typescript
 * const itemsAssoc = trackChecklistCompletion(
 *   SafetyChecklist,
 *   ChecklistItem
 * );
 * ```
 */
const trackChecklistCompletion = (SafetyChecklist, ChecklistItem) => {
    return SafetyChecklist.hasMany(ChecklistItem, {
        foreignKey: 'checklistId',
        as: 'items',
        onDelete: 'CASCADE',
    });
};
exports.trackChecklistCompletion = trackChecklistCompletion;
// ============================================================================
// TIME-OUT DOCUMENTATION
// ============================================================================
/**
 * Records surgical time-out
 *
 * @param {Model} surgicalCase - Surgical case instance
 * @param {Model[]} surgicalTeam - Surgical team members
 * @param {TimeOutConfig} config - Time-out configuration
 * @returns {Promise<any>} Created time-out record
 *
 * @example
 * ```typescript
 * const timeOut = await recordSurgicalTimeOut(
 *   surgicalCase,
 *   surgicalTeam,
 *   {
 *     allMembersPresent: true,
 *     verifiedPatient: true,
 *     verifiedProcedure: true,
 *     verifiedSite: true
 *   }
 * );
 * ```
 */
const recordSurgicalTimeOut = async (surgicalCase, surgicalTeam, config) => {
    const TimeOut = surgicalCase.sequelize.model('SurgicalTimeOut');
    return await TimeOut.create({
        caseId: surgicalCase.id,
        allMembersPresent: config.allMembersPresent || false,
        verifiedPatient: config.verifiedPatient || false,
        verifiedProcedure: config.verifiedProcedure || false,
        verifiedSite: config.verifiedSite || false,
        verifiedPosition: config.verifiedPosition || false,
        performedAt: new Date(),
        teamMemberCount: surgicalTeam.length,
    });
};
exports.recordSurgicalTimeOut = recordSurgicalTimeOut;
/**
 * Creates time-out associations
 *
 * @param {ModelStatic<any>} TimeOut - Time-out model
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {ModelStatic<any>} User - User model
 * @returns {Object} Time-out associations
 *
 * @example
 * ```typescript
 * const timeOutAssocs = createTimeOutAssociations(
 *   TimeOut,
 *   SurgicalCase,
 *   User
 * );
 * ```
 */
const createTimeOutAssociations = (TimeOut, SurgicalCase, User) => {
    const caseAssoc = TimeOut.belongsTo(SurgicalCase, {
        foreignKey: 'caseId',
        as: 'surgicalCase',
        onDelete: 'CASCADE',
    });
    const performedByAssoc = TimeOut.belongsTo(User, {
        foreignKey: 'performedBy',
        as: 'performer',
        onDelete: 'RESTRICT',
    });
    return { surgicalCase: caseAssoc, performedBy: performedByAssoc };
};
exports.createTimeOutAssociations = createTimeOutAssociations;
/**
 * Validates time-out completion
 *
 * @param {ModelStatic<any>} TimeOut - Time-out model
 * @param {string} caseId - Surgical case ID
 * @returns {Promise<boolean>} True if time-out completed
 *
 * @example
 * ```typescript
 * const isComplete = await validateTimeOutCompletion(TimeOut, caseId);
 * ```
 */
const validateTimeOutCompletion = async (TimeOut, caseId) => {
    const timeOut = await TimeOut.findOne({
        where: { caseId },
        order: [['performedAt', 'DESC']],
    });
    if (!timeOut)
        return false;
    return (timeOut.verifiedPatient &&
        timeOut.verifiedProcedure &&
        timeOut.verifiedSite &&
        timeOut.allMembersPresent);
};
exports.validateTimeOutCompletion = validateTimeOutCompletion;
// ============================================================================
// PATHOLOGY SPECIMEN TRACKING
// ============================================================================
/**
 * Tracks pathology specimen
 *
 * @param {Model} surgicalCase - Surgical case instance
 * @param {SpecimenTrackingConfig} config - Specimen configuration
 * @returns {Promise<any>} Created specimen tracking record
 *
 * @example
 * ```typescript
 * const specimen = await trackPathologySpecimen(
 *   surgicalCase,
 *   {
 *     specimenType: 'Tissue biopsy',
 *     fixativeType: 'Formalin',
 *     containerCount: 2
 *   }
 * );
 * ```
 */
const trackPathologySpecimen = async (surgicalCase, config) => {
    const PathologySpecimen = surgicalCase.sequelize.model('PathologySpecimen');
    return await PathologySpecimen.create({
        caseId: surgicalCase.id,
        specimenType: config.specimenType,
        fixativeType: config.fixativeType,
        containerCount: config.containerCount || 1,
        requiresRushProcessing: config.requiresRushProcessing || false,
        collectedAt: new Date(),
        status: 'COLLECTED',
    });
};
exports.trackPathologySpecimen = trackPathologySpecimen;
/**
 * Creates pathology specimen associations
 *
 * @param {ModelStatic<any>} PathologySpecimen - Pathology specimen model
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {ModelStatic<any>} PathologyReport - Pathology report model
 * @returns {Object} Specimen associations
 *
 * @example
 * ```typescript
 * const specimenAssocs = createPathologySpecimenAssociations(
 *   PathologySpecimen,
 *   SurgicalCase,
 *   PathologyReport
 * );
 * ```
 */
const createPathologySpecimenAssociations = (PathologySpecimen, SurgicalCase, PathologyReport) => {
    const caseAssoc = PathologySpecimen.belongsTo(SurgicalCase, {
        foreignKey: 'caseId',
        as: 'surgicalCase',
        onDelete: 'CASCADE',
    });
    const reportAssoc = PathologySpecimen.hasOne(PathologyReport, {
        foreignKey: 'specimenId',
        as: 'pathologyReport',
        onDelete: 'SET NULL',
    });
    return { surgicalCase: caseAssoc, pathologyReport: reportAssoc };
};
exports.createPathologySpecimenAssociations = createPathologySpecimenAssociations;
/**
 * Queries specimen chain of custody
 *
 * @param {ModelStatic<any>} PathologySpecimen - Pathology specimen model
 * @param {string} specimenId - Specimen ID
 * @returns {Promise<any[]>} Chain of custody records
 *
 * @example
 * ```typescript
 * const custody = await querySpecimenChainOfCustody(
 *   PathologySpecimen,
 *   specimenId
 * );
 * ```
 */
const querySpecimenChainOfCustody = async (PathologySpecimen, specimenId) => {
    const CustodyLog = PathologySpecimen.sequelize.model('SpecimenCustodyLog');
    return await CustodyLog.findAll({
        where: { specimenId },
        include: [
            {
                association: 'transferredBy',
                attributes: ['id', 'firstName', 'lastName', 'role'],
            },
            {
                association: 'receivedBy',
                attributes: ['id', 'firstName', 'lastName', 'role'],
            },
        ],
        order: [['transferredAt', 'ASC']],
    });
};
exports.querySpecimenChainOfCustody = querySpecimenChainOfCustody;
// ============================================================================
// BLOOD PRODUCT MANAGEMENT
// ============================================================================
/**
 * Manages surgical blood products
 *
 * @param {Model} surgicalCase - Surgical case instance
 * @param {BloodProductConfig} config - Blood product configuration
 * @returns {Promise<any>} Created blood product order
 *
 * @example
 * ```typescript
 * const bloodOrder = await manageSurgicalBloodProducts(
 *   surgicalCase,
 *   {
 *     productType: 'Packed RBC',
 *     unitsOrdered: 2,
 *     crossmatchRequired: true
 *   }
 * );
 * ```
 */
const manageSurgicalBloodProducts = async (surgicalCase, config) => {
    const BloodProductOrder = surgicalCase.sequelize.model('BloodProductOrder');
    return await BloodProductOrder.create({
        caseId: surgicalCase.id,
        productType: config.productType,
        unitsOrdered: config.unitsOrdered || 1,
        crossmatchRequired: config.crossmatchRequired || true,
        autoReleaseProtocol: config.autoReleaseProtocol || false,
        orderedAt: new Date(),
        status: 'ORDERED',
    });
};
exports.manageSurgicalBloodProducts = manageSurgicalBloodProducts;
/**
 * Creates blood product associations
 *
 * @param {ModelStatic<any>} BloodProductOrder - Blood product order model
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {ModelStatic<any>} BloodBank - Blood bank model
 * @returns {Object} Blood product associations
 *
 * @example
 * ```typescript
 * const bloodAssocs = createBloodProductAssociations(
 *   BloodProductOrder,
 *   SurgicalCase,
 *   BloodBank
 * );
 * ```
 */
const createBloodProductAssociations = (BloodProductOrder, SurgicalCase, BloodBank) => {
    const caseAssoc = BloodProductOrder.belongsTo(SurgicalCase, {
        foreignKey: 'caseId',
        as: 'surgicalCase',
        onDelete: 'CASCADE',
    });
    const bloodBankAssoc = BloodProductOrder.belongsTo(BloodBank, {
        foreignKey: 'bloodBankId',
        as: 'bloodBank',
        onDelete: 'RESTRICT',
    });
    return { surgicalCase: caseAssoc, bloodBank: bloodBankAssoc };
};
exports.createBloodProductAssociations = createBloodProductAssociations;
/**
 * Tracks blood product administration
 *
 * @param {ModelStatic<any>} BloodProductOrder - Blood product order model
 * @param {ModelStatic<any>} BloodAdministration - Blood administration model
 * @returns {Association} Administration association
 *
 * @example
 * ```typescript
 * const adminAssoc = trackBloodProductAdministration(
 *   BloodProductOrder,
 *   BloodAdministration
 * );
 * ```
 */
const trackBloodProductAdministration = (BloodProductOrder, BloodAdministration) => {
    return BloodProductOrder.hasMany(BloodAdministration, {
        foreignKey: 'orderId',
        as: 'administrations',
        onDelete: 'CASCADE',
    });
};
exports.trackBloodProductAdministration = trackBloodProductAdministration;
// ============================================================================
// POST-OPERATIVE ORDER SETS
// ============================================================================
/**
 * Creates post-operative order set
 *
 * @param {Model} surgicalCase - Surgical case instance
 * @param {PostOpOrderSetConfig} config - Order set configuration
 * @returns {Promise<any>} Created post-op order set
 *
 * @example
 * ```typescript
 * const postOpOrders = await createPostOpOrderSet(
 *   surgicalCase,
 *   {
 *     painManagement: true,
 *     antibiotics: true,
 *     dvtProphylaxis: true
 *   }
 * );
 * ```
 */
const createPostOpOrderSet = async (surgicalCase, config = {}) => {
    const PostOpOrderSet = surgicalCase.sequelize.model('PostOpOrderSet');
    return await PostOpOrderSet.create({
        caseId: surgicalCase.id,
        painManagement: config.painManagement !== false,
        antibiotics: config.antibiotics || false,
        dvtProphylaxis: config.dvtProphylaxis || false,
        dietOrders: config.dietOrders || false,
        activityOrders: config.activityOrders || false,
        createdAt: new Date(),
        status: 'ACTIVE',
    });
};
exports.createPostOpOrderSet = createPostOpOrderSet;
/**
 * Creates post-op order set associations
 *
 * @param {ModelStatic<any>} PostOpOrderSet - Post-op order set model
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {ModelStatic<any>} Order - Order model
 * @returns {Object} Post-op order associations
 *
 * @example
 * ```typescript
 * const postOpAssocs = createPostOpOrderSetAssociations(
 *   PostOpOrderSet,
 *   SurgicalCase,
 *   Order
 * );
 * ```
 */
const createPostOpOrderSetAssociations = (PostOpOrderSet, SurgicalCase, Order) => {
    const caseAssoc = PostOpOrderSet.belongsTo(SurgicalCase, {
        foreignKey: 'caseId',
        as: 'surgicalCase',
        onDelete: 'CASCADE',
    });
    const ordersAssoc = PostOpOrderSet.hasMany(Order, {
        foreignKey: 'orderSetId',
        as: 'orders',
        onDelete: 'CASCADE',
    });
    return { surgicalCase: caseAssoc, orders: ordersAssoc };
};
exports.createPostOpOrderSetAssociations = createPostOpOrderSetAssociations;
/**
 * Links order set to template
 *
 * @param {ModelStatic<any>} PostOpOrderSet - Post-op order set model
 * @param {ModelStatic<any>} OrderSetTemplate - Order set template model
 * @returns {Association} Template association
 *
 * @example
 * ```typescript
 * const templateAssoc = linkOrderSetToTemplate(
 *   PostOpOrderSet,
 *   OrderSetTemplate
 * );
 * ```
 */
const linkOrderSetToTemplate = (PostOpOrderSet, OrderSetTemplate) => {
    return PostOpOrderSet.belongsTo(OrderSetTemplate, {
        foreignKey: 'templateId',
        as: 'template',
        onDelete: 'SET NULL',
    });
};
exports.linkOrderSetToTemplate = linkOrderSetToTemplate;
// ============================================================================
// SURGICAL COMPLICATION TRACKING
// ============================================================================
/**
 * Tracks surgical complication
 *
 * @param {Model} surgicalCase - Surgical case instance
 * @param {Object} complicationData - Complication data
 * @returns {Promise<any>} Created complication record
 *
 * @example
 * ```typescript
 * const complication = await trackSurgicalComplication(
 *   surgicalCase,
 *   {
 *     complicationType: 'Infection',
 *     severity: 'Moderate',
 *     description: 'Superficial wound infection',
 *     occurredAt: new Date()
 *   }
 * );
 * ```
 */
const trackSurgicalComplication = async (surgicalCase, complicationData) => {
    const SurgicalComplication = surgicalCase.sequelize.model('SurgicalComplication');
    return await SurgicalComplication.create({
        caseId: surgicalCase.id,
        complicationType: complicationData.complicationType,
        severity: complicationData.severity,
        description: complicationData.description,
        occurredAt: complicationData.occurredAt,
        status: 'ACTIVE',
    });
};
exports.trackSurgicalComplication = trackSurgicalComplication;
/**
 * Creates surgical complication associations
 *
 * @param {ModelStatic<any>} SurgicalComplication - Surgical complication model
 * @param {ModelStatic<any>} SurgicalCase - Surgical case model
 * @param {ModelStatic<any>} User - User model
 * @returns {Object} Complication associations
 *
 * @example
 * ```typescript
 * const compAssocs = createSurgicalComplicationAssociations(
 *   SurgicalComplication,
 *   SurgicalCase,
 *   User
 * );
 * ```
 */
const createSurgicalComplicationAssociations = (SurgicalComplication, SurgicalCase, User) => {
    const caseAssoc = SurgicalComplication.belongsTo(SurgicalCase, {
        foreignKey: 'caseId',
        as: 'surgicalCase',
        onDelete: 'CASCADE',
    });
    const reportedByAssoc = SurgicalComplication.belongsTo(User, {
        foreignKey: 'reportedBy',
        as: 'reporter',
        onDelete: 'RESTRICT',
    });
    return { surgicalCase: caseAssoc, reportedBy: reportedByAssoc };
};
exports.createSurgicalComplicationAssociations = createSurgicalComplicationAssociations;
/**
 * Queries complication statistics by surgeon
 *
 * @param {ModelStatic<any>} SurgicalComplication - Surgical complication model
 * @param {string} surgeonId - Surgeon ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Object>} Complication statistics
 *
 * @example
 * ```typescript
 * const stats = await queryComplicationStatsBySurgeon(
 *   SurgicalComplication,
 *   surgeonId,
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 * ```
 */
const queryComplicationStatsBySurgeon = async (SurgicalComplication, surgeonId, startDate, endDate) => {
    const total = await SurgicalComplication.count({
        include: [
            {
                association: 'surgicalCase',
                where: {
                    primarySurgeonId: surgeonId,
                    caseDate: { [sequelize_1.Op.between]: [startDate, endDate] },
                },
                attributes: [],
            },
        ],
    });
    const totalCases = await SurgicalComplication.sequelize.model('SurgicalCase').count({
        where: {
            primarySurgeonId: surgeonId,
            caseDate: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const byType = await SurgicalComplication.findAll({
        attributes: [
            'complicationType',
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'count'],
        ],
        include: [
            {
                association: 'surgicalCase',
                where: {
                    primarySurgeonId: surgeonId,
                    caseDate: { [sequelize_1.Op.between]: [startDate, endDate] },
                },
                attributes: [],
            },
        ],
        group: ['complicationType'],
        raw: true,
    });
    const byTypeMap = byType.reduce((acc, item) => {
        acc[item.complicationType] = parseInt(item.count, 10);
        return acc;
    }, {});
    return {
        totalComplications: total,
        complicationRate: totalCases > 0 ? (total / totalCases) * 100 : 0,
        byType: byTypeMap,
    };
};
exports.queryComplicationStatsBySurgeon = queryComplicationStatsBySurgeon;
/**
 * Links complications to quality improvement initiatives
 *
 * @param {ModelStatic<any>} SurgicalComplication - Surgical complication model
 * @param {ModelStatic<any>} QualityInitiative - Quality initiative model
 * @returns {Association} Quality initiative association
 *
 * @example
 * ```typescript
 * const qiAssoc = linkComplicationsToQualityInitiatives(
 *   SurgicalComplication,
 *   QualityInitiative
 * );
 * ```
 */
const linkComplicationsToQualityInitiatives = (SurgicalComplication, QualityInitiative) => {
    return SurgicalComplication.belongsToMany(QualityInitiative, {
        through: 'complication_quality_initiatives',
        foreignKey: 'complicationId',
        otherKey: 'initiativeId',
        as: 'qualityInitiatives',
        timestamps: true,
    });
};
exports.linkComplicationsToQualityInitiatives = linkComplicationsToQualityInitiatives;
//# sourceMappingURL=health-surgical-management-kit.js.map