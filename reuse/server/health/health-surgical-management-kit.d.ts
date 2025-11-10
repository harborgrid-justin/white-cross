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
import { Model, ModelStatic, Association, Transaction, WhereOptions } from 'sequelize';
/**
 * @enum SurgicalCaseStatus
 * @description Surgical case workflow statuses
 */
export declare enum SurgicalCaseStatus {
    SCHEDULED = "SCHEDULED",
    PRE_OP = "PRE_OP",
    IN_OR = "IN_OR",
    IN_PROGRESS = "IN_PROGRESS",
    CLOSING = "CLOSING",
    RECOVERY = "RECOVERY",
    PACU = "PACU",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    DELAYED = "DELAYED"
}
/**
 * @enum AnesthesiaType
 * @description Types of anesthesia
 */
export declare enum AnesthesiaType {
    GENERAL = "GENERAL",
    REGIONAL = "REGIONAL",
    SPINAL = "SPINAL",
    EPIDURAL = "EPIDURAL",
    LOCAL = "LOCAL",
    MAC = "MAC",// Monitored Anesthesia Care
    SEDATION = "SEDATION"
}
/**
 * @enum ASAClass
 * @description ASA Physical Status Classification
 */
export declare enum ASAClass {
    I = "I",// Healthy patient
    II = "II",// Mild systemic disease
    III = "III",// Severe systemic disease
    IV = "IV",// Severe disease that is a constant threat to life
    V = "V",// Moribund patient
    VI = "VI"
}
/**
 * @enum SurgicalPriority
 * @description Surgical case priority levels
 */
export declare enum SurgicalPriority {
    ELECTIVE = "ELECTIVE",
    URGENT = "URGENT",
    EMERGENT = "EMERGENT",
    TRAUMA = "TRAUMA"
}
/**
 * @enum ImplantCategory
 * @description Categories of surgical implants
 */
export declare enum ImplantCategory {
    ORTHOPEDIC = "ORTHOPEDIC",
    CARDIAC = "CARDIAC",
    NEUROLOGICAL = "NEUROLOGICAL",
    VASCULAR = "VASCULAR",
    OPHTHALMIC = "OPHTHALMIC",
    GENERAL = "GENERAL"
}
/**
 * @interface SurgicalCaseConfig
 * @description Configuration for surgical case associations
 */
export interface SurgicalCaseConfig {
    includePatient?: boolean;
    includeSurgeon?: boolean;
    includeProcedures?: boolean;
    trackStatus?: boolean;
    includeTeam?: boolean;
    includeFacility?: boolean;
}
/**
 * @interface ORSchedulingConfig
 * @description Configuration for OR scheduling
 */
export interface ORSchedulingConfig {
    startTime: Date;
    estimatedDuration: number;
    turnoverTime?: number;
    emergencyCase?: boolean;
    requiresSpecialEquipment?: boolean;
}
/**
 * @interface PreferenceCardConfig
 * @description Configuration for surgical preference cards
 */
export interface PreferenceCardConfig {
    includeInstruments?: boolean;
    includeSupplies?: boolean;
    includePositioning?: boolean;
    includeSpecialRequests?: boolean;
}
/**
 * @interface AnesthesiaRecordConfig
 * @description Configuration for anesthesia records
 */
export interface AnesthesiaRecordConfig {
    anesthesiaType: AnesthesiaType;
    asaClass: ASAClass;
    trackVitals?: boolean;
    trackMedications?: boolean;
    trackEvents?: boolean;
}
/**
 * @interface IntraoperativeNoteConfig
 * @description Configuration for intraoperative notes
 */
export interface IntraoperativeNoteConfig {
    findings?: string;
    complications?: string;
    estimatedBloodLoss?: number;
    specimens?: string;
    includeImages?: boolean;
}
/**
 * @interface SurgicalConsentConfig
 * @description Configuration for surgical consent
 */
export interface SurgicalConsentConfig {
    includeRisks?: boolean;
    includeBenefits?: boolean;
    includeAlternatives?: boolean;
    requireWitness?: boolean;
    electronicSignature?: boolean;
}
/**
 * @interface ImplantTrackingConfig
 * @description Configuration for implant tracking
 */
export interface ImplantTrackingConfig {
    category: ImplantCategory;
    manufacturer?: string;
    lotNumber?: string;
    serialNumber?: string;
    requireFDAReporting?: boolean;
}
/**
 * @interface SafetyChecklistConfig
 * @description Configuration for surgical safety checklist
 */
export interface SafetyChecklistConfig {
    includeSignIn?: boolean;
    includeTimeOut?: boolean;
    includeSignOut?: boolean;
    requireAllSignatures?: boolean;
}
/**
 * @interface TimeOutConfig
 * @description Configuration for surgical time-out
 */
export interface TimeOutConfig {
    allMembersPresent?: boolean;
    verifiedPatient?: boolean;
    verifiedProcedure?: boolean;
    verifiedSite?: boolean;
    verifiedPosition?: boolean;
}
/**
 * @interface SpecimenTrackingConfig
 * @description Configuration for pathology specimen tracking
 */
export interface SpecimenTrackingConfig {
    specimenType?: string;
    fixativeType?: string;
    containerCount?: number;
    requiresRushProcessing?: boolean;
}
/**
 * @interface BloodProductConfig
 * @description Configuration for blood product management
 */
export interface BloodProductConfig {
    productType?: string;
    unitsOrdered?: number;
    crossmatchRequired?: boolean;
    autoReleaseProtocol?: boolean;
}
/**
 * @interface PostOpOrderSetConfig
 * @description Configuration for post-op order sets
 */
export interface PostOpOrderSetConfig {
    painManagement?: boolean;
    antibiotics?: boolean;
    dvtProphylaxis?: boolean;
    dietOrders?: boolean;
    activityOrders?: boolean;
}
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
export declare const createSurgicalCaseAssociations: (SurgicalCase: ModelStatic<any>, Patient: ModelStatic<any>, Surgeon: ModelStatic<any>, config?: SurgicalCaseConfig) => Promise<{
    patient: Association;
    primarySurgeon: Association;
    assistingSurgeon?: Association;
}>;
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
export declare const linkSurgicalCaseProcedures: (SurgicalCase: ModelStatic<any>, Procedure: ModelStatic<any>, CPTCode: ModelStatic<any>) => {
    procedures: Association;
    cptCode: Association;
};
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
export declare const createSurgicalCaseStatusTracking: (SurgicalCase: ModelStatic<any>, CaseStatusLog: ModelStatic<any>) => Association;
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
export declare const querySurgicalCasesWithAssociations: (SurgicalCase: ModelStatic<any>, where?: WhereOptions, config?: SurgicalCaseConfig) => Promise<any[]>;
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
export declare const scheduleOperatingRoom: (surgicalCase: Model, operatingRoom: Model, config: ORSchedulingConfig) => Promise<any>;
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
export declare const createORSchedulingAssociations: (ORSchedule: ModelStatic<any>, SurgicalCase: ModelStatic<any>, OperatingRoom: ModelStatic<any>) => {
    surgicalCase: Association;
    operatingRoom: Association;
};
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
export declare const queryORAvailability: (ORSchedule: ModelStatic<any>, date: Date, operatingRoomId: string) => Promise<any[]>;
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
export declare const findORConflicts: (ORSchedule: ModelStatic<any>, operatingRoomId: string, startTime: Date, endTime: Date) => Promise<boolean>;
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
export declare const linkSurgicalPreferenceCard: (surgeon: Model, procedure: Model, preferenceCard: Model) => Promise<void>;
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
export declare const createPreferenceCardAssociations: (PreferenceCard: ModelStatic<any>, Surgeon: ModelStatic<any>, Procedure: ModelStatic<any>) => {
    surgeon: Association;
    procedure: Association;
};
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
export declare const linkPreferenceCardItems: (PreferenceCard: ModelStatic<any>, Instrument: ModelStatic<any>, Supply: ModelStatic<any>) => {
    instruments: Association;
    supplies: Association;
};
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
export declare const queryPreferenceCardWithItems: (PreferenceCard: ModelStatic<any>, surgeonId: string, procedureId: string, config?: PreferenceCardConfig) => Promise<any>;
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
export declare const trackSurgicalSupplyUsage: (surgicalCase: Model, supply: Model, quantity: number, transaction?: Transaction) => Promise<any>;
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
export declare const createSupplyUsageAssociations: (SupplyUsage: ModelStatic<any>, SurgicalCase: ModelStatic<any>, Supply: ModelStatic<any>) => {
    surgicalCase: Association;
    supply: Association;
};
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
export declare const querySupplyUsageByCase: (SupplyUsage: ModelStatic<any>, caseId: string) => Promise<any[]>;
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
export declare const trackAnesthesiaRecord: (surgicalCase: Model, anesthesiologist: Model, config: AnesthesiaRecordConfig) => Promise<any>;
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
export declare const createAnesthesiaRecordAssociations: (AnesthesiaRecord: ModelStatic<any>, SurgicalCase: ModelStatic<any>, Anesthesiologist: ModelStatic<any>) => {
    surgicalCase: Association;
    anesthesiologist: Association;
};
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
export declare const linkAnesthesiaMedications: (AnesthesiaRecord: ModelStatic<any>, Medication: ModelStatic<any>) => Association;
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
export declare const trackAnesthesiaVitalSigns: (AnesthesiaRecord: ModelStatic<any>, VitalSign: ModelStatic<any>) => Association;
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
export declare const createIntraoperativeNote: (surgicalCase: Model, surgeon: Model, config: IntraoperativeNoteConfig) => Promise<any>;
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
export declare const createIntraoperativeNoteAssociations: (IntraoperativeNote: ModelStatic<any>, SurgicalCase: ModelStatic<any>, Surgeon: ModelStatic<any>) => {
    surgicalCase: Association;
    surgeon: Association;
};
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
export declare const linkIntraoperativeImages: (IntraoperativeNote: ModelStatic<any>, SurgicalImage: ModelStatic<any>) => Association;
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
export declare const createSurgicalConsent: (surgicalCase: Model, patient: Model, config?: SurgicalConsentConfig) => Promise<any>;
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
export declare const createSurgicalConsentAssociations: (SurgicalConsent: ModelStatic<any>, SurgicalCase: ModelStatic<any>, Patient: ModelStatic<any>) => {
    surgicalCase: Association;
    patient: Association;
};
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
export declare const trackConsentSignatures: (SurgicalConsent: ModelStatic<any>, ConsentSignature: ModelStatic<any>) => Association;
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
export declare const trackSurgicalImplant: (surgicalCase: Model, implant: Model, config: ImplantTrackingConfig) => Promise<any>;
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
export declare const createImplantTrackingAssociations: (ImplantTracking: ModelStatic<any>, SurgicalCase: ModelStatic<any>, Implant: ModelStatic<any>) => {
    surgicalCase: Association;
    implant: Association;
};
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
export declare const queryImplantRegistryByPatient: (ImplantTracking: ModelStatic<any>, patientId: string) => Promise<any[]>;
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
export declare const createSurgicalSafetyChecklist: (surgicalCase: Model, config?: SafetyChecklistConfig) => Promise<any>;
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
export declare const createSafetyChecklistAssociations: (SafetyChecklist: ModelStatic<any>, SurgicalCase: ModelStatic<any>) => Association;
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
export declare const trackChecklistCompletion: (SafetyChecklist: ModelStatic<any>, ChecklistItem: ModelStatic<any>) => Association;
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
export declare const recordSurgicalTimeOut: (surgicalCase: Model, surgicalTeam: Model[], config: TimeOutConfig) => Promise<any>;
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
export declare const createTimeOutAssociations: (TimeOut: ModelStatic<any>, SurgicalCase: ModelStatic<any>, User: ModelStatic<any>) => {
    surgicalCase: Association;
    performedBy: Association;
};
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
export declare const validateTimeOutCompletion: (TimeOut: ModelStatic<any>, caseId: string) => Promise<boolean>;
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
export declare const trackPathologySpecimen: (surgicalCase: Model, config: SpecimenTrackingConfig) => Promise<any>;
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
export declare const createPathologySpecimenAssociations: (PathologySpecimen: ModelStatic<any>, SurgicalCase: ModelStatic<any>, PathologyReport: ModelStatic<any>) => {
    surgicalCase: Association;
    pathologyReport?: Association;
};
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
export declare const querySpecimenChainOfCustody: (PathologySpecimen: ModelStatic<any>, specimenId: string) => Promise<any[]>;
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
export declare const manageSurgicalBloodProducts: (surgicalCase: Model, config: BloodProductConfig) => Promise<any>;
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
export declare const createBloodProductAssociations: (BloodProductOrder: ModelStatic<any>, SurgicalCase: ModelStatic<any>, BloodBank: ModelStatic<any>) => {
    surgicalCase: Association;
    bloodBank: Association;
};
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
export declare const trackBloodProductAdministration: (BloodProductOrder: ModelStatic<any>, BloodAdministration: ModelStatic<any>) => Association;
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
export declare const createPostOpOrderSet: (surgicalCase: Model, config?: PostOpOrderSetConfig) => Promise<any>;
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
export declare const createPostOpOrderSetAssociations: (PostOpOrderSet: ModelStatic<any>, SurgicalCase: ModelStatic<any>, Order: ModelStatic<any>) => {
    surgicalCase: Association;
    orders: Association;
};
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
export declare const linkOrderSetToTemplate: (PostOpOrderSet: ModelStatic<any>, OrderSetTemplate: ModelStatic<any>) => Association;
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
export declare const trackSurgicalComplication: (surgicalCase: Model, complicationData: {
    complicationType: string;
    severity: string;
    description: string;
    occurredAt: Date;
}) => Promise<any>;
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
export declare const createSurgicalComplicationAssociations: (SurgicalComplication: ModelStatic<any>, SurgicalCase: ModelStatic<any>, User: ModelStatic<any>) => {
    surgicalCase: Association;
    reportedBy: Association;
};
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
export declare const queryComplicationStatsBySurgeon: (SurgicalComplication: ModelStatic<any>, surgeonId: string, startDate: Date, endDate: Date) => Promise<{
    totalComplications: number;
    complicationRate: number;
    byType: Record<string, number>;
}>;
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
export declare const linkComplicationsToQualityInitiatives: (SurgicalComplication: ModelStatic<any>, QualityInitiative: ModelStatic<any>) => Association;
//# sourceMappingURL=health-surgical-management-kit.d.ts.map