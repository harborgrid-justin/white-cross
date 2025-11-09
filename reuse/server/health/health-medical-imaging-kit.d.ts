/**
 * @fileoverview Health Medical Imaging Kit - Comprehensive Sequelize associations for medical imaging
 * @module reuse/server/health/health-medical-imaging-kit
 * @description Enterprise-grade Sequelize association utilities for medical imaging workflows including
 * DICOM integration, PACS connectivity, radiology reporting, study management, and critical findings
 * alerts. Epic Radiant-level functionality for White Cross healthcare platform.
 *
 * Key Features:
 * - Imaging order associations and workflow management
 * - DICOM study/series/instance hierarchical relationships
 * - PACS integration associations and metadata tracking
 * - Radiology report associations with versioning
 * - Image viewing session management
 * - Modality worklist associations
 * - Critical findings alert relationships
 * - Prior comparison associations
 * - Radiation dose tracking relationships
 * - Imaging protocol associations
 * - Radiologist assignment and workload management
 * - Image sharing and media burning associations
 * - Teleradiology consultation relationships
 *
 * @target Sequelize v6.x, Node 18+, TypeScript 5.x, DICOM 3.0, HL7 FHIR
 *
 * @security
 * - HIPAA-compliant association design
 * - PHI access control through scoped associations
 * - Audit trail for all imaging access
 * - Encryption for sensitive imaging metadata
 * - Role-based association filtering
 * - Data retention policy enforcement
 *
 * @example Basic imaging order associations
 * ```typescript
 * import {
 *   createImagingOrderAssociations,
 *   createStudySeriesInstanceHierarchy,
 *   linkRadiologyReport
 * } from './health-medical-imaging-kit';
 *
 * // Set up imaging order associations
 * const orderAssociations = await createImagingOrderAssociations(
 *   ImagingOrder,
 *   Patient,
 *   Provider,
 *   { includeModalities: true, trackStatus: true }
 * );
 *
 * // Create DICOM hierarchy
 * const dicomHierarchy = createStudySeriesInstanceHierarchy(
 *   DicomStudy,
 *   DicomSeries,
 *   DicomInstance,
 *   { enforceConstraints: true }
 * );
 *
 * // Link radiology report
 * await linkRadiologyReport(study, report, radiologist, {
 *   includeFindings: true,
 *   trackRevisions: true
 * });
 * ```
 *
 * @example Advanced PACS integration
 * ```typescript
 * import {
 *   configurePACSWorkflow,
 *   createModalityWorklistEntry,
 *   trackImageViewingSession
 * } from './health-medical-imaging-kit';
 *
 * // Configure PACS workflow
 * const pacsWorkflow = await configurePACSWorkflow(
 *   PACSNode,
 *   ImagingStudy,
 *   { autoRoute: true, compressionLevel: 'lossless' }
 * );
 *
 * // Create modality worklist entry
 * const worklistEntry = await createModalityWorklistEntry(
 *   order,
 *   modality,
 *   { scheduledTime: appointmentTime, priority: 'STAT' }
 * );
 *
 * // Track viewing session
 * await trackImageViewingSession(
 *   radiologist,
 *   study,
 *   { duration: sessionDuration, viewerType: 'PACS' }
 * );
 * ```
 *
 * LOC: HMI-001
 * UPSTREAM: sequelize, dicom-parser, hl7-fhir
 * DOWNSTREAM: radiology-service/*, pacs-integration/*, imaging-workflow/*
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Model, ModelStatic, Association, WhereOptions } from 'sequelize';
/**
 * @enum ImagingModality
 * @description Standard DICOM imaging modalities
 */
export declare enum ImagingModality {
    CR = "CR",// Computed Radiography
    CT = "CT",// Computed Tomography
    MR = "MR",// Magnetic Resonance
    US = "US",// Ultrasound
    XA = "XA",// X-Ray Angiography
    RF = "RF",// Radiofluoroscopy
    DX = "DX",// Digital Radiography
    MG = "MG",// Mammography
    NM = "NM",// Nuclear Medicine
    PT = "PT",// Positron Emission Tomography
    PET_CT = "PET/CT",// PET/CT Fusion
    SPECT = "SPECT"
}
/**
 * @enum StudyStatus
 * @description Imaging study workflow statuses
 */
export declare enum StudyStatus {
    SCHEDULED = "SCHEDULED",
    ARRIVED = "ARRIVED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    PENDING_REVIEW = "PENDING_REVIEW",
    PRELIMINARY = "PRELIMINARY",
    FINAL = "FINAL",
    AMENDED = "AMENDED"
}
/**
 * @enum ReportStatus
 * @description Radiology report statuses
 */
export declare enum ReportStatus {
    DRAFT = "DRAFT",
    PRELIMINARY = "PRELIMINARY",
    FINAL = "FINAL",
    AMENDED = "AMENDED",
    ADDENDED = "ADDENDED",
    CORRECTED = "CORRECTED"
}
/**
 * @enum CriticalFindingSeverity
 * @description Critical finding alert severity levels
 */
export declare enum CriticalFindingSeverity {
    CRITICAL = "CRITICAL",
    URGENT = "URGENT",
    SIGNIFICANT = "SIGNIFICANT"
}
/**
 * @interface ImagingOrderConfig
 * @description Configuration for imaging order associations
 */
export interface ImagingOrderConfig {
    includePatient?: boolean;
    includeProvider?: boolean;
    includeModalities?: boolean;
    trackStatus?: boolean;
    includeInsurance?: boolean;
    includeFacility?: boolean;
}
/**
 * @interface StudyAssociationConfig
 * @description Configuration for DICOM study associations
 */
export interface StudyAssociationConfig {
    includeSeries?: boolean;
    includeInstances?: boolean;
    includeReports?: boolean;
    includeComparisons?: boolean;
    maxDepth?: number;
}
/**
 * @interface PACSIntegrationConfig
 * @description Configuration for PACS integration associations
 */
export interface PACSIntegrationConfig {
    autoRoute?: boolean;
    compressionLevel?: 'lossless' | 'lossy' | 'none';
    transferSyntax?: string;
    includeMetadata?: boolean;
    trackTransfers?: boolean;
}
/**
 * @interface RadiologyReportConfig
 * @description Configuration for radiology report associations
 */
export interface RadiologyReportConfig {
    includeFindings?: boolean;
    includeRecommendations?: boolean;
    trackRevisions?: boolean;
    includeCriticalFindings?: boolean;
    includeComparisons?: boolean;
}
/**
 * @interface CriticalFindingConfig
 * @description Configuration for critical finding alerts
 */
export interface CriticalFindingConfig {
    notifyOrdering?: boolean;
    notifyAttending?: boolean;
    notifyPatient?: boolean;
    escalationMinutes?: number;
    requireAcknowledgment?: boolean;
}
/**
 * @interface ImageViewingSessionConfig
 * @description Configuration for image viewing session tracking
 */
export interface ImageViewingSessionConfig {
    trackDuration?: boolean;
    trackViewerType?: boolean;
    trackManipulations?: boolean;
    includeScreenshots?: boolean;
}
/**
 * @interface ModalityWorklistConfig
 * @description Configuration for modality worklist associations
 */
export interface ModalityWorklistConfig {
    priority?: 'STAT' | 'URGENT' | 'ROUTINE';
    scheduledTime?: Date;
    estimatedDuration?: number;
    includeProtocol?: boolean;
}
/**
 * @interface RadiationDoseConfig
 * @description Configuration for radiation dose tracking
 */
export interface RadiationDoseConfig {
    trackCumulativeDose?: boolean;
    alertThreshold?: number;
    includePhantomData?: boolean;
    calculateEffectiveDose?: boolean;
}
/**
 * @interface TeleradiologyConfig
 * @description Configuration for teleradiology associations
 */
export interface TeleradiologyConfig {
    includeConsultant?: boolean;
    trackTurnaroundTime?: boolean;
    includeCommunication?: boolean;
    requireSecureTransmission?: boolean;
}
/**
 * Creates comprehensive imaging order associations
 *
 * @param {ModelStatic<any>} ImagingOrder - Imaging order model
 * @param {ModelStatic<any>} Patient - Patient model
 * @param {ModelStatic<any>} Provider - Provider model
 * @param {ImagingOrderConfig} config - Order configuration
 * @returns {Promise<Object>} Created associations
 *
 * @example
 * ```typescript
 * const orderAssociations = await createImagingOrderAssociations(
 *   ImagingOrder,
 *   Patient,
 *   Provider,
 *   {
 *     includeModalities: true,
 *     trackStatus: true,
 *     includeInsurance: true
 *   }
 * );
 * ```
 */
export declare const createImagingOrderAssociations: (ImagingOrder: ModelStatic<any>, Patient: ModelStatic<any>, Provider: ModelStatic<any>, config?: ImagingOrderConfig) => Promise<{
    patient: Association;
    orderingProvider: Association;
    referringProvider?: Association;
}>;
/**
 * Links imaging order to modality and protocol
 *
 * @param {ModelStatic<any>} ImagingOrder - Imaging order model
 * @param {ModelStatic<any>} ImagingProtocol - Imaging protocol model
 * @param {ModelStatic<any>} Modality - Modality model
 * @returns {Object} Created associations
 *
 * @example
 * ```typescript
 * const modalityLinks = linkOrderToModalityProtocol(
 *   ImagingOrder,
 *   ImagingProtocol,
 *   Modality
 * );
 * ```
 */
export declare const linkOrderToModalityProtocol: (ImagingOrder: ModelStatic<any>, ImagingProtocol: ModelStatic<any>, Modality: ModelStatic<any>) => {
    protocol: Association;
    modality: Association;
};
/**
 * Creates imaging order status tracking associations
 *
 * @param {ModelStatic<any>} ImagingOrder - Imaging order model
 * @param {ModelStatic<any>} OrderStatusLog - Status log model
 * @returns {Association} Status log association
 *
 * @example
 * ```typescript
 * const statusAssoc = createOrderStatusTracking(ImagingOrder, OrderStatusLog);
 * ```
 */
export declare const createOrderStatusTracking: (ImagingOrder: ModelStatic<any>, OrderStatusLog: ModelStatic<any>) => Association;
/**
 * Queries imaging orders with comprehensive associations
 *
 * @param {ModelStatic<any>} ImagingOrder - Imaging order model
 * @param {WhereOptions} where - Query conditions
 * @param {ImagingOrderConfig} config - Query configuration
 * @returns {Promise<any[]>} Imaging orders with associations
 *
 * @example
 * ```typescript
 * const orders = await queryImagingOrdersWithAssociations(
 *   ImagingOrder,
 *   { status: 'SCHEDULED', facilityId: facilityId },
 *   { includePatient: true, includeProvider: true }
 * );
 * ```
 */
export declare const queryImagingOrdersWithAssociations: (ImagingOrder: ModelStatic<any>, where?: WhereOptions, config?: ImagingOrderConfig) => Promise<any[]>;
/**
 * Creates hierarchical DICOM study/series/instance associations
 *
 * @param {ModelStatic<any>} DicomStudy - DICOM study model
 * @param {ModelStatic<any>} DicomSeries - DICOM series model
 * @param {ModelStatic<any>} DicomInstance - DICOM instance model
 * @param {Object} config - Configuration options
 * @returns {Object} Created hierarchy associations
 *
 * @example
 * ```typescript
 * const dicomHierarchy = createStudySeriesInstanceHierarchy(
 *   DicomStudy,
 *   DicomSeries,
 *   DicomInstance,
 *   { enforceConstraints: true }
 * );
 * ```
 */
export declare const createStudySeriesInstanceHierarchy: (DicomStudy: ModelStatic<any>, DicomSeries: ModelStatic<any>, DicomInstance: ModelStatic<any>, config?: {
    enforceConstraints?: boolean;
}) => {
    studySeries: Association;
    seriesInstances: Association;
    seriesStudy: Association;
    instanceSeries: Association;
};
/**
 * Links DICOM study to imaging order
 *
 * @param {ModelStatic<any>} DicomStudy - DICOM study model
 * @param {ModelStatic<any>} ImagingOrder - Imaging order model
 * @returns {Association} Study to order association
 *
 * @example
 * ```typescript
 * const orderLink = linkStudyToOrder(DicomStudy, ImagingOrder);
 * ```
 */
export declare const linkStudyToOrder: (DicomStudy: ModelStatic<any>, ImagingOrder: ModelStatic<any>) => Association;
/**
 * Queries DICOM study with full hierarchy
 *
 * @param {ModelStatic<any>} DicomStudy - DICOM study model
 * @param {string} studyInstanceUid - Study instance UID
 * @param {StudyAssociationConfig} config - Query configuration
 * @returns {Promise<any>} Study with series and instances
 *
 * @example
 * ```typescript
 * const study = await queryStudyWithHierarchy(
 *   DicomStudy,
 *   '1.2.840.113619.2.55.3.1762583527.558.1234567890.123',
 *   { includeSeries: true, includeInstances: true }
 * );
 * ```
 */
export declare const queryStudyWithHierarchy: (DicomStudy: ModelStatic<any>, studyInstanceUid: string, config?: StudyAssociationConfig) => Promise<any>;
/**
 * Counts instances in study hierarchy
 *
 * @param {ModelStatic<any>} DicomStudy - DICOM study model
 * @param {string} studyInstanceUid - Study instance UID
 * @returns {Promise<number>} Total instance count
 *
 * @example
 * ```typescript
 * const instanceCount = await countStudyInstances(
 *   DicomStudy,
 *   '1.2.840.113619.2.55.3.1762583527.558.1234567890.123'
 * );
 * ```
 */
export declare const countStudyInstances: (DicomStudy: ModelStatic<any>, studyInstanceUid: string) => Promise<number>;
/**
 * Configures PACS workflow associations
 *
 * @param {ModelStatic<any>} PACSNode - PACS node model
 * @param {ModelStatic<any>} ImagingStudy - Imaging study model
 * @param {PACSIntegrationConfig} config - PACS configuration
 * @returns {Promise<Association>} PACS association
 *
 * @example
 * ```typescript
 * const pacsWorkflow = await configurePACSWorkflow(
 *   PACSNode,
 *   ImagingStudy,
 *   { autoRoute: true, compressionLevel: 'lossless' }
 * );
 * ```
 */
export declare const configurePACSWorkflow: (PACSNode: ModelStatic<any>, ImagingStudy: ModelStatic<any>, config?: PACSIntegrationConfig) => Promise<Association>;
/**
 * Creates PACS transfer tracking associations
 *
 * @param {ModelStatic<any>} PACSTransfer - PACS transfer model
 * @param {ModelStatic<any>} DicomStudy - DICOM study model
 * @param {ModelStatic<any>} PACSNode - PACS node model
 * @returns {Object} Transfer associations
 *
 * @example
 * ```typescript
 * const transferAssocs = createPACSTransferTracking(
 *   PACSTransfer,
 *   DicomStudy,
 *   PACSNode
 * );
 * ```
 */
export declare const createPACSTransferTracking: (PACSTransfer: ModelStatic<any>, DicomStudy: ModelStatic<any>, PACSNode: ModelStatic<any>) => {
    study: Association;
    sourceNode: Association;
    destinationNode: Association;
};
/**
 * Tracks PACS storage locations
 *
 * @param {ModelStatic<any>} DicomStudy - DICOM study model
 * @param {ModelStatic<any>} StorageLocation - Storage location model
 * @returns {Association} Storage association
 *
 * @example
 * ```typescript
 * const storageAssoc = trackPACSStorageLocation(DicomStudy, StorageLocation);
 * ```
 */
export declare const trackPACSStorageLocation: (DicomStudy: ModelStatic<any>, StorageLocation: ModelStatic<any>) => Association;
/**
 * Links radiology report to study and radiologist
 *
 * @param {Model} study - Study instance
 * @param {Model} report - Report instance
 * @param {Model} radiologist - Radiologist instance
 * @param {RadiologyReportConfig} config - Report configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await linkRadiologyReport(study, report, radiologist, {
 *   includeFindings: true,
 *   trackRevisions: true
 * });
 * ```
 */
export declare const linkRadiologyReport: (study: Model, report: Model, radiologist: Model, config?: RadiologyReportConfig) => Promise<void>;
/**
 * Creates radiology report associations
 *
 * @param {ModelStatic<any>} RadiologyReport - Radiology report model
 * @param {ModelStatic<any>} DicomStudy - DICOM study model
 * @param {ModelStatic<any>} Radiologist - Radiologist model
 * @returns {Object} Report associations
 *
 * @example
 * ```typescript
 * const reportAssocs = createRadiologyReportAssociations(
 *   RadiologyReport,
 *   DicomStudy,
 *   Radiologist
 * );
 * ```
 */
export declare const createRadiologyReportAssociations: (RadiologyReport: ModelStatic<any>, DicomStudy: ModelStatic<any>, Radiologist: ModelStatic<any>) => {
    study: Association;
    radiologist: Association;
    attestingRadiologist?: Association;
};
/**
 * Tracks report revisions and amendments
 *
 * @param {ModelStatic<any>} RadiologyReport - Radiology report model
 * @param {ModelStatic<any>} ReportRevision - Report revision model
 * @returns {Association} Revision association
 *
 * @example
 * ```typescript
 * const revisionAssoc = trackReportRevisions(RadiologyReport, ReportRevision);
 * ```
 */
export declare const trackReportRevisions: (RadiologyReport: ModelStatic<any>, ReportRevision: ModelStatic<any>) => Association;
/**
 * Links report findings to structured templates
 *
 * @param {ModelStatic<any>} RadiologyReport - Radiology report model
 * @param {ModelStatic<any>} Finding - Finding model
 * @param {ModelStatic<any>} FindingTemplate - Finding template model
 * @returns {Object} Finding associations
 *
 * @example
 * ```typescript
 * const findingAssocs = linkReportFindings(
 *   RadiologyReport,
 *   Finding,
 *   FindingTemplate
 * );
 * ```
 */
export declare const linkReportFindings: (RadiologyReport: ModelStatic<any>, Finding: ModelStatic<any>, FindingTemplate: ModelStatic<any>) => {
    findings: Association;
    template: Association;
};
/**
 * Queries reports with comprehensive associations
 *
 * @param {ModelStatic<any>} RadiologyReport - Radiology report model
 * @param {WhereOptions} where - Query conditions
 * @param {RadiologyReportConfig} config - Query configuration
 * @returns {Promise<any[]>} Reports with associations
 *
 * @example
 * ```typescript
 * const reports = await queryReportsWithAssociations(
 *   RadiologyReport,
 *   { status: 'FINAL', radiologistId: radiologistId },
 *   { includeFindings: true, includeComparisons: true }
 * );
 * ```
 */
export declare const queryReportsWithAssociations: (RadiologyReport: ModelStatic<any>, where?: WhereOptions, config?: RadiologyReportConfig) => Promise<any[]>;
/**
 * Creates critical finding alert associations
 *
 * @param {ModelStatic<any>} CriticalFinding - Critical finding model
 * @param {ModelStatic<any>} RadiologyReport - Radiology report model
 * @param {ModelStatic<any>} Provider - Provider model
 * @param {CriticalFindingConfig} config - Alert configuration
 * @returns {Object} Alert associations
 *
 * @example
 * ```typescript
 * const alertAssocs = createCriticalFindingAlert(
 *   CriticalFinding,
 *   RadiologyReport,
 *   Provider,
 *   { notifyOrdering: true, requireAcknowledgment: true }
 * );
 * ```
 */
export declare const createCriticalFindingAlert: (CriticalFinding: ModelStatic<any>, RadiologyReport: ModelStatic<any>, Provider: ModelStatic<any>, config?: CriticalFindingConfig) => {
    report: Association;
    orderingProvider: Association;
    notifications: Association;
};
/**
 * Tracks critical finding acknowledgments
 *
 * @param {ModelStatic<any>} CriticalFinding - Critical finding model
 * @param {ModelStatic<any>} Acknowledgment - Acknowledgment model
 * @param {ModelStatic<any>} User - User model
 * @returns {Association} Acknowledgment association
 *
 * @example
 * ```typescript
 * const ackAssoc = trackCriticalFindingAcknowledgment(
 *   CriticalFinding,
 *   Acknowledgment,
 *   User
 * );
 * ```
 */
export declare const trackCriticalFindingAcknowledgment: (CriticalFinding: ModelStatic<any>, Acknowledgment: ModelStatic<any>, User: ModelStatic<any>) => Association;
/**
 * Queries unacknowledged critical findings
 *
 * @param {ModelStatic<any>} CriticalFinding - Critical finding model
 * @param {Object} options - Query options
 * @returns {Promise<any[]>} Unacknowledged findings
 *
 * @example
 * ```typescript
 * const unacked = await queryUnacknowledgedCriticalFindings(
 *   CriticalFinding,
 *   { facilityId: facilityId, severity: 'CRITICAL' }
 * );
 * ```
 */
export declare const queryUnacknowledgedCriticalFindings: (CriticalFinding: ModelStatic<any>, options?: {
    facilityId?: string;
    severity?: CriticalFindingSeverity;
}) => Promise<any[]>;
/**
 * Tracks image viewing session
 *
 * @param {Model} radiologist - Radiologist instance
 * @param {Model} study - Study instance
 * @param {ImageViewingSessionConfig} config - Session configuration
 * @returns {Promise<any>} Created session record
 *
 * @example
 * ```typescript
 * const session = await trackImageViewingSession(
 *   radiologist,
 *   study,
 *   { trackDuration: true, viewerType: 'PACS' }
 * );
 * ```
 */
export declare const trackImageViewingSession: (radiologist: Model, study: Model, config?: ImageViewingSessionConfig) => Promise<any>;
/**
 * Creates viewing session associations
 *
 * @param {ModelStatic<any>} ViewingSession - Viewing session model
 * @param {ModelStatic<any>} User - User model
 * @param {ModelStatic<any>} DicomStudy - DICOM study model
 * @returns {Object} Session associations
 *
 * @example
 * ```typescript
 * const sessionAssocs = createViewingSessionAssociations(
 *   ViewingSession,
 *   User,
 *   DicomStudy
 * );
 * ```
 */
export declare const createViewingSessionAssociations: (ViewingSession: ModelStatic<any>, User: ModelStatic<any>, DicomStudy: ModelStatic<any>) => {
    user: Association;
    study: Association;
};
/**
 * Queries viewing session statistics
 *
 * @param {ModelStatic<any>} ViewingSession - Viewing session model
 * @param {string} userId - User ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Object>} Session statistics
 *
 * @example
 * ```typescript
 * const stats = await queryViewingSessionStats(
 *   ViewingSession,
 *   radiologistId,
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * ```
 */
export declare const queryViewingSessionStats: (ViewingSession: ModelStatic<any>, userId: string, startDate: Date, endDate: Date) => Promise<{
    totalSessions: number;
    totalDuration: number;
    averageDuration: number;
    studiesViewed: number;
}>;
/**
 * Creates modality worklist entry
 *
 * @param {Model} order - Imaging order instance
 * @param {Model} modality - Modality instance
 * @param {ModalityWorklistConfig} config - Worklist configuration
 * @returns {Promise<any>} Created worklist entry
 *
 * @example
 * ```typescript
 * const worklistEntry = await createModalityWorklistEntry(
 *   order,
 *   modality,
 *   { priority: 'STAT', scheduledTime: new Date() }
 * );
 * ```
 */
export declare const createModalityWorklistEntry: (order: Model, modality: Model, config?: ModalityWorklistConfig) => Promise<any>;
/**
 * Creates modality worklist associations
 *
 * @param {ModelStatic<any>} ModalityWorklist - Modality worklist model
 * @param {ModelStatic<any>} ImagingOrder - Imaging order model
 * @param {ModelStatic<any>} Modality - Modality model
 * @returns {Object} Worklist associations
 *
 * @example
 * ```typescript
 * const worklistAssocs = createModalityWorklistAssociations(
 *   ModalityWorklist,
 *   ImagingOrder,
 *   Modality
 * );
 * ```
 */
export declare const createModalityWorklistAssociations: (ModalityWorklist: ModelStatic<any>, ImagingOrder: ModelStatic<any>, Modality: ModelStatic<any>) => {
    order: Association;
    modality: Association;
};
/**
 * Queries modality worklist with filters
 *
 * @param {ModelStatic<any>} ModalityWorklist - Modality worklist model
 * @param {Object} filters - Query filters
 * @returns {Promise<any[]>} Worklist entries
 *
 * @example
 * ```typescript
 * const worklist = await queryModalityWorklist(
 *   ModalityWorklist,
 *   { modalityId: modalityId, status: 'SCHEDULED', priority: 'STAT' }
 * );
 * ```
 */
export declare const queryModalityWorklist: (ModalityWorklist: ModelStatic<any>, filters?: {
    modalityId?: string;
    status?: string;
    priority?: string;
    scheduledDate?: Date;
}) => Promise<any[]>;
/**
 * Links studies for prior comparison
 *
 * @param {Model} currentStudy - Current study instance
 * @param {Model[]} priorStudies - Array of prior study instances
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await linkPriorComparisons(currentStudy, [priorStudy1, priorStudy2]);
 * ```
 */
export declare const linkPriorComparisons: (currentStudy: Model, priorStudies: Model[]) => Promise<void>;
/**
 * Creates study comparison associations
 *
 * @param {ModelStatic<any>} StudyComparison - Study comparison model
 * @param {ModelStatic<any>} DicomStudy - DICOM study model
 * @returns {Object} Comparison associations
 *
 * @example
 * ```typescript
 * const comparisonAssocs = createStudyComparisonAssociations(
 *   StudyComparison,
 *   DicomStudy
 * );
 * ```
 */
export declare const createStudyComparisonAssociations: (StudyComparison: ModelStatic<any>, DicomStudy: ModelStatic<any>) => {
    currentStudy: Association;
    priorStudy: Association;
};
/**
 * Finds prior studies for comparison
 *
 * @param {ModelStatic<any>} DicomStudy - DICOM study model
 * @param {string} patientId - Patient ID
 * @param {string} currentStudyId - Current study ID
 * @param {Object} options - Query options
 * @returns {Promise<any[]>} Prior studies
 *
 * @example
 * ```typescript
 * const priorStudies = await findPriorStudiesForComparison(
 *   DicomStudy,
 *   patientId,
 *   currentStudyId,
 *   { modality: 'CT', limit: 3 }
 * );
 * ```
 */
export declare const findPriorStudiesForComparison: (DicomStudy: ModelStatic<any>, patientId: string, currentStudyId: string, options?: {
    modality?: string;
    bodyPart?: string;
    limit?: number;
}) => Promise<any[]>;
/**
 * Creates radiation dose tracking associations
 *
 * @param {ModelStatic<any>} RadiationDose - Radiation dose model
 * @param {ModelStatic<any>} DicomSeries - DICOM series model
 * @param {ModelStatic<any>} Patient - Patient model
 * @param {RadiationDoseConfig} config - Dose configuration
 * @returns {Object} Dose tracking associations
 *
 * @example
 * ```typescript
 * const doseAssocs = createRadiationDoseTracking(
 *   RadiationDose,
 *   DicomSeries,
 *   Patient,
 *   { trackCumulativeDose: true, calculateEffectiveDose: true }
 * );
 * ```
 */
export declare const createRadiationDoseTracking: (RadiationDose: ModelStatic<any>, DicomSeries: ModelStatic<any>, Patient: ModelStatic<any>, config?: RadiationDoseConfig) => {
    series: Association;
    patient: Association;
};
/**
 * Calculates cumulative radiation dose
 *
 * @param {ModelStatic<any>} RadiationDose - Radiation dose model
 * @param {string} patientId - Patient ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<number>} Cumulative dose in mSv
 *
 * @example
 * ```typescript
 * const cumulativeDose = await calculateCumulativeRadiationDose(
 *   RadiationDose,
 *   patientId,
 *   new Date('2025-01-01'),
 *   new Date('2025-12-31')
 * );
 * ```
 */
export declare const calculateCumulativeRadiationDose: (RadiationDose: ModelStatic<any>, patientId: string, startDate: Date, endDate: Date) => Promise<number>;
/**
 * Checks radiation dose alert thresholds
 *
 * @param {ModelStatic<any>} RadiationDose - Radiation dose model
 * @param {string} patientId - Patient ID
 * @param {number} thresholdMsv - Alert threshold in mSv
 * @param {number} periodDays - Period in days
 * @returns {Promise<boolean>} True if threshold exceeded
 *
 * @example
 * ```typescript
 * const exceedsThreshold = await checkRadiationDoseThreshold(
 *   RadiationDose,
 *   patientId,
 *   100,  // 100 mSv
 *   365   // 1 year
 * );
 * ```
 */
export declare const checkRadiationDoseThreshold: (RadiationDose: ModelStatic<any>, patientId: string, thresholdMsv: number, periodDays: number) => Promise<boolean>;
/**
 * Assigns radiologist to study
 *
 * @param {Model} study - Study instance
 * @param {Model} radiologist - Radiologist instance
 * @param {Object} options - Assignment options
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await assignRadiologistToStudy(study, radiologist, {
 *   priority: 'STAT',
 *   subspecialty: 'Neuroradiology'
 * });
 * ```
 */
export declare const assignRadiologistToStudy: (study: Model, radiologist: Model, options?: {
    priority?: string;
    subspecialty?: string;
}) => Promise<void>;
/**
 * Creates radiologist assignment associations
 *
 * @param {ModelStatic<any>} StudyAssignment - Study assignment model
 * @param {ModelStatic<any>} DicomStudy - DICOM study model
 * @param {ModelStatic<any>} Radiologist - Radiologist model
 * @returns {Object} Assignment associations
 *
 * @example
 * ```typescript
 * const assignmentAssocs = createRadiologistAssignmentAssociations(
 *   StudyAssignment,
 *   DicomStudy,
 *   Radiologist
 * );
 * ```
 */
export declare const createRadiologistAssignmentAssociations: (StudyAssignment: ModelStatic<any>, DicomStudy: ModelStatic<any>, Radiologist: ModelStatic<any>) => {
    study: Association;
    radiologist: Association;
};
/**
 * Queries radiologist workload statistics
 *
 * @param {ModelStatic<any>} DicomStudy - DICOM study model
 * @param {string} radiologistId - Radiologist ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Object>} Workload statistics
 *
 * @example
 * ```typescript
 * const workload = await queryRadiologistWorkload(
 *   DicomStudy,
 *   radiologistId,
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * ```
 */
export declare const queryRadiologistWorkload: (DicomStudy: ModelStatic<any>, radiologistId: string, startDate: Date, endDate: Date) => Promise<{
    totalStudies: number;
    pendingStudies: number;
    completedStudies: number;
    averageTurnaroundMinutes: number;
}>;
/**
 * Creates image sharing request
 *
 * @param {Model} study - Study instance
 * @param {Model} requester - Requester instance
 * @param {Object} options - Sharing options
 * @returns {Promise<any>} Created sharing request
 *
 * @example
 * ```typescript
 * const shareRequest = await createImageSharingRequest(
 *   study,
 *   provider,
 *   { recipientEmail: 'doctor@example.com', expiresIn: 7 }
 * );
 * ```
 */
export declare const createImageSharingRequest: (study: Model, requester: Model, options?: {
    recipientEmail?: string;
    recipientName?: string;
    expiresIn?: number;
    includeReport?: boolean;
}) => Promise<any>;
/**
 * Creates media burning request associations
 *
 * @param {ModelStatic<any>} MediaBurnRequest - Media burn request model
 * @param {ModelStatic<any>} DicomStudy - DICOM study model
 * @param {ModelStatic<any>} User - User model
 * @returns {Object} Burn request associations
 *
 * @example
 * ```typescript
 * const burnAssocs = createMediaBurningAssociations(
 *   MediaBurnRequest,
 *   DicomStudy,
 *   User
 * );
 * ```
 */
export declare const createMediaBurningAssociations: (MediaBurnRequest: ModelStatic<any>, DicomStudy: ModelStatic<any>, User: ModelStatic<any>) => {
    studies: Association;
    requestedBy: Association;
};
/**
 * Queries pending media burn requests
 *
 * @param {ModelStatic<any>} MediaBurnRequest - Media burn request model
 * @param {Object} filters - Query filters
 * @returns {Promise<any[]>} Pending burn requests
 *
 * @example
 * ```typescript
 * const pending = await queryPendingMediaBurnRequests(
 *   MediaBurnRequest,
 *   { facilityId: facilityId }
 * );
 * ```
 */
export declare const queryPendingMediaBurnRequests: (MediaBurnRequest: ModelStatic<any>, filters?: {
    facilityId?: string;
    priority?: string;
}) => Promise<any[]>;
/**
 * Creates teleradiology consultation request
 *
 * @param {Model} study - Study instance
 * @param {Model} requestingRadiologist - Requesting radiologist instance
 * @param {Model} consultantRadiologist - Consultant radiologist instance
 * @param {TeleradiologyConfig} config - Consultation configuration
 * @returns {Promise<any>} Created consultation request
 *
 * @example
 * ```typescript
 * const consultation = await createTeleradiologyConsultation(
 *   study,
 *   localRadiologist,
 *   consultantRadiologist,
 *   { trackTurnaroundTime: true, requireSecureTransmission: true }
 * );
 * ```
 */
export declare const createTeleradiologyConsultation: (study: Model, requestingRadiologist: Model, consultantRadiologist: Model, config?: TeleradiologyConfig) => Promise<any>;
/**
 * Creates teleradiology consultation associations
 *
 * @param {ModelStatic<any>} TeleradConsultation - Teleradiology consultation model
 * @param {ModelStatic<any>} DicomStudy - DICOM study model
 * @param {ModelStatic<any>} Radiologist - Radiologist model
 * @returns {Object} Consultation associations
 *
 * @example
 * ```typescript
 * const teleradAssocs = createTeleradiologyConsultationAssociations(
 *   TeleradConsultation,
 *   DicomStudy,
 *   Radiologist
 * );
 * ```
 */
export declare const createTeleradiologyConsultationAssociations: (TeleradConsultation: ModelStatic<any>, DicomStudy: ModelStatic<any>, Radiologist: ModelStatic<any>) => {
    study: Association;
    requestingRadiologist: Association;
    consultantRadiologist: Association;
};
/**
 * Queries teleradiology turnaround time statistics
 *
 * @param {ModelStatic<any>} TeleradConsultation - Teleradiology consultation model
 * @param {string} consultantId - Consultant radiologist ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<Object>} Turnaround statistics
 *
 * @example
 * ```typescript
 * const stats = await queryTeleradiologyTurnaroundStats(
 *   TeleradConsultation,
 *   consultantId,
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31')
 * );
 * ```
 */
export declare const queryTeleradiologyTurnaroundStats: (TeleradConsultation: ModelStatic<any>, consultantId: string, startDate: Date, endDate: Date) => Promise<{
    totalConsultations: number;
    averageTurnaroundMinutes: number;
    completedWithin24Hours: number;
}>;
//# sourceMappingURL=health-medical-imaging-kit.d.ts.map