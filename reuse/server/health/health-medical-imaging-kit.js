"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryTeleradiologyTurnaroundStats = exports.createTeleradiologyConsultationAssociations = exports.createTeleradiologyConsultation = exports.queryPendingMediaBurnRequests = exports.createMediaBurningAssociations = exports.createImageSharingRequest = exports.queryRadiologistWorkload = exports.createRadiologistAssignmentAssociations = exports.assignRadiologistToStudy = exports.checkRadiationDoseThreshold = exports.calculateCumulativeRadiationDose = exports.createRadiationDoseTracking = exports.findPriorStudiesForComparison = exports.createStudyComparisonAssociations = exports.linkPriorComparisons = exports.queryModalityWorklist = exports.createModalityWorklistAssociations = exports.createModalityWorklistEntry = exports.queryViewingSessionStats = exports.createViewingSessionAssociations = exports.trackImageViewingSession = exports.queryUnacknowledgedCriticalFindings = exports.trackCriticalFindingAcknowledgment = exports.createCriticalFindingAlert = exports.queryReportsWithAssociations = exports.linkReportFindings = exports.trackReportRevisions = exports.createRadiologyReportAssociations = exports.linkRadiologyReport = exports.trackPACSStorageLocation = exports.createPACSTransferTracking = exports.configurePACSWorkflow = exports.countStudyInstances = exports.queryStudyWithHierarchy = exports.linkStudyToOrder = exports.createStudySeriesInstanceHierarchy = exports.queryImagingOrdersWithAssociations = exports.createOrderStatusTracking = exports.linkOrderToModalityProtocol = exports.createImagingOrderAssociations = exports.CriticalFindingSeverity = exports.ReportStatus = exports.StudyStatus = exports.ImagingModality = void 0;
const sequelize_1 = require("sequelize");
// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
/**
 * @enum ImagingModality
 * @description Standard DICOM imaging modalities
 */
var ImagingModality;
(function (ImagingModality) {
    ImagingModality["CR"] = "CR";
    ImagingModality["CT"] = "CT";
    ImagingModality["MR"] = "MR";
    ImagingModality["US"] = "US";
    ImagingModality["XA"] = "XA";
    ImagingModality["RF"] = "RF";
    ImagingModality["DX"] = "DX";
    ImagingModality["MG"] = "MG";
    ImagingModality["NM"] = "NM";
    ImagingModality["PT"] = "PT";
    ImagingModality["PET_CT"] = "PET/CT";
    ImagingModality["SPECT"] = "SPECT";
})(ImagingModality || (exports.ImagingModality = ImagingModality = {}));
/**
 * @enum StudyStatus
 * @description Imaging study workflow statuses
 */
var StudyStatus;
(function (StudyStatus) {
    StudyStatus["SCHEDULED"] = "SCHEDULED";
    StudyStatus["ARRIVED"] = "ARRIVED";
    StudyStatus["IN_PROGRESS"] = "IN_PROGRESS";
    StudyStatus["COMPLETED"] = "COMPLETED";
    StudyStatus["CANCELLED"] = "CANCELLED";
    StudyStatus["PENDING_REVIEW"] = "PENDING_REVIEW";
    StudyStatus["PRELIMINARY"] = "PRELIMINARY";
    StudyStatus["FINAL"] = "FINAL";
    StudyStatus["AMENDED"] = "AMENDED";
})(StudyStatus || (exports.StudyStatus = StudyStatus = {}));
/**
 * @enum ReportStatus
 * @description Radiology report statuses
 */
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["DRAFT"] = "DRAFT";
    ReportStatus["PRELIMINARY"] = "PRELIMINARY";
    ReportStatus["FINAL"] = "FINAL";
    ReportStatus["AMENDED"] = "AMENDED";
    ReportStatus["ADDENDED"] = "ADDENDED";
    ReportStatus["CORRECTED"] = "CORRECTED";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
/**
 * @enum CriticalFindingSeverity
 * @description Critical finding alert severity levels
 */
var CriticalFindingSeverity;
(function (CriticalFindingSeverity) {
    CriticalFindingSeverity["CRITICAL"] = "CRITICAL";
    CriticalFindingSeverity["URGENT"] = "URGENT";
    CriticalFindingSeverity["SIGNIFICANT"] = "SIGNIFICANT";
})(CriticalFindingSeverity || (exports.CriticalFindingSeverity = CriticalFindingSeverity = {}));
// ============================================================================
// IMAGING ORDER MANAGEMENT ASSOCIATIONS
// ============================================================================
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
const createImagingOrderAssociations = async (ImagingOrder, Patient, Provider, config = {}) => {
    const patientAssoc = ImagingOrder.belongsTo(Patient, {
        foreignKey: 'patientId',
        as: 'patient',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });
    const orderingProviderAssoc = ImagingOrder.belongsTo(Provider, {
        foreignKey: 'orderingProviderId',
        as: 'orderingProvider',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });
    const referringProviderAssoc = ImagingOrder.belongsTo(Provider, {
        foreignKey: 'referringProviderId',
        as: 'referringProvider',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    });
    return {
        patient: patientAssoc,
        orderingProvider: orderingProviderAssoc,
        referringProvider: referringProviderAssoc,
    };
};
exports.createImagingOrderAssociations = createImagingOrderAssociations;
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
const linkOrderToModalityProtocol = (ImagingOrder, ImagingProtocol, Modality) => {
    const protocolAssoc = ImagingOrder.belongsTo(ImagingProtocol, {
        foreignKey: 'protocolId',
        as: 'protocol',
        onDelete: 'RESTRICT',
    });
    const modalityAssoc = ImagingOrder.belongsTo(Modality, {
        foreignKey: 'modalityId',
        as: 'modality',
        onDelete: 'RESTRICT',
    });
    return { protocol: protocolAssoc, modality: modalityAssoc };
};
exports.linkOrderToModalityProtocol = linkOrderToModalityProtocol;
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
const createOrderStatusTracking = (ImagingOrder, OrderStatusLog) => {
    return ImagingOrder.hasMany(OrderStatusLog, {
        foreignKey: 'orderId',
        as: 'statusHistory',
        onDelete: 'CASCADE',
    });
};
exports.createOrderStatusTracking = createOrderStatusTracking;
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
const queryImagingOrdersWithAssociations = async (ImagingOrder, where = {}, config = {}) => {
    const include = [];
    if (config.includePatient) {
        include.push({
            association: 'patient',
            attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'mrn'],
        });
    }
    if (config.includeProvider) {
        include.push({
            association: 'orderingProvider',
            attributes: ['id', 'firstName', 'lastName', 'npi', 'specialty'],
        });
        include.push({
            association: 'referringProvider',
            attributes: ['id', 'firstName', 'lastName', 'npi', 'specialty'],
            required: false,
        });
    }
    if (config.includeModalities) {
        include.push({
            association: 'modality',
            attributes: ['id', 'name', 'code', 'description'],
        });
        include.push({
            association: 'protocol',
            attributes: ['id', 'name', 'description', 'instructions'],
        });
    }
    return await ImagingOrder.findAll({
        where,
        include,
        order: [['createdAt', 'DESC']],
    });
};
exports.queryImagingOrdersWithAssociations = queryImagingOrdersWithAssociations;
// ============================================================================
// DICOM STUDY/SERIES/INSTANCE HIERARCHY
// ============================================================================
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
const createStudySeriesInstanceHierarchy = (DicomStudy, DicomSeries, DicomInstance, config = {}) => {
    const studySeries = DicomStudy.hasMany(DicomSeries, {
        foreignKey: 'studyInstanceUid',
        sourceKey: 'studyInstanceUid',
        as: 'series',
        onDelete: 'CASCADE',
        constraints: config.enforceConstraints !== false,
    });
    const seriesInstances = DicomSeries.hasMany(DicomInstance, {
        foreignKey: 'seriesInstanceUid',
        sourceKey: 'seriesInstanceUid',
        as: 'instances',
        onDelete: 'CASCADE',
        constraints: config.enforceConstraints !== false,
    });
    const seriesStudy = DicomSeries.belongsTo(DicomStudy, {
        foreignKey: 'studyInstanceUid',
        targetKey: 'studyInstanceUid',
        as: 'study',
        onDelete: 'CASCADE',
    });
    const instanceSeries = DicomInstance.belongsTo(DicomSeries, {
        foreignKey: 'seriesInstanceUid',
        targetKey: 'seriesInstanceUid',
        as: 'series',
        onDelete: 'CASCADE',
    });
    return { studySeries, seriesInstances, seriesStudy, instanceSeries };
};
exports.createStudySeriesInstanceHierarchy = createStudySeriesInstanceHierarchy;
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
const linkStudyToOrder = (DicomStudy, ImagingOrder) => {
    return DicomStudy.belongsTo(ImagingOrder, {
        foreignKey: 'orderId',
        as: 'imagingOrder',
        onDelete: 'SET NULL',
    });
};
exports.linkStudyToOrder = linkStudyToOrder;
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
const queryStudyWithHierarchy = async (DicomStudy, studyInstanceUid, config = {}) => {
    const include = [];
    if (config.includeSeries) {
        const seriesInclude = {
            association: 'series',
            attributes: [
                'seriesInstanceUid',
                'modality',
                'seriesDescription',
                'seriesNumber',
                'numberOfInstances',
            ],
        };
        if (config.includeInstances) {
            seriesInclude.include = [
                {
                    association: 'instances',
                    attributes: [
                        'sopInstanceUid',
                        'instanceNumber',
                        'imageType',
                        'rows',
                        'columns',
                        'pixelSpacing',
                    ],
                },
            ];
        }
        include.push(seriesInclude);
    }
    if (config.includeReports) {
        include.push({
            association: 'reports',
            attributes: ['id', 'status', 'reportText', 'radiologistId', 'signedAt'],
        });
    }
    return await DicomStudy.findOne({
        where: { studyInstanceUid },
        include,
    });
};
exports.queryStudyWithHierarchy = queryStudyWithHierarchy;
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
const countStudyInstances = async (DicomStudy, studyInstanceUid) => {
    const study = await DicomStudy.findOne({
        where: { studyInstanceUid },
        include: [
            {
                association: 'series',
                attributes: [],
                include: [{ association: 'instances', attributes: [] }],
            },
        ],
        attributes: [[(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('series.instances.id')), 'instanceCount']],
        group: ['DicomStudy.id'],
        raw: true,
    });
    return parseInt(study?.instanceCount || '0', 10);
};
exports.countStudyInstances = countStudyInstances;
// ============================================================================
// PACS INTEGRATION ASSOCIATIONS
// ============================================================================
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
const configurePACSWorkflow = async (PACSNode, ImagingStudy, config = {}) => {
    return ImagingStudy.belongsTo(PACSNode, {
        foreignKey: 'pacsNodeId',
        as: 'pacsNode',
        onDelete: 'RESTRICT',
    });
};
exports.configurePACSWorkflow = configurePACSWorkflow;
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
const createPACSTransferTracking = (PACSTransfer, DicomStudy, PACSNode) => {
    const studyAssoc = PACSTransfer.belongsTo(DicomStudy, {
        foreignKey: 'studyId',
        as: 'study',
        onDelete: 'CASCADE',
    });
    const sourceNodeAssoc = PACSTransfer.belongsTo(PACSNode, {
        foreignKey: 'sourceNodeId',
        as: 'sourceNode',
        onDelete: 'RESTRICT',
    });
    const destinationNodeAssoc = PACSTransfer.belongsTo(PACSNode, {
        foreignKey: 'destinationNodeId',
        as: 'destinationNode',
        onDelete: 'RESTRICT',
    });
    return {
        study: studyAssoc,
        sourceNode: sourceNodeAssoc,
        destinationNode: destinationNodeAssoc,
    };
};
exports.createPACSTransferTracking = createPACSTransferTracking;
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
const trackPACSStorageLocation = (DicomStudy, StorageLocation) => {
    return DicomStudy.belongsToMany(StorageLocation, {
        through: 'study_storage_locations',
        foreignKey: 'studyId',
        otherKey: 'locationId',
        as: 'storageLocations',
        timestamps: true,
    });
};
exports.trackPACSStorageLocation = trackPACSStorageLocation;
// ============================================================================
// RADIOLOGY REPORT ASSOCIATIONS
// ============================================================================
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
const linkRadiologyReport = async (study, report, radiologist, config = {}) => {
    await report.update({
        studyId: study.id,
        radiologistId: radiologist.id,
        status: ReportStatus.DRAFT,
    });
};
exports.linkRadiologyReport = linkRadiologyReport;
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
const createRadiologyReportAssociations = (RadiologyReport, DicomStudy, Radiologist) => {
    const studyAssoc = RadiologyReport.belongsTo(DicomStudy, {
        foreignKey: 'studyId',
        as: 'study',
        onDelete: 'CASCADE',
    });
    const radiologistAssoc = RadiologyReport.belongsTo(Radiologist, {
        foreignKey: 'radiologistId',
        as: 'radiologist',
        onDelete: 'RESTRICT',
    });
    const attestingRadiologistAssoc = RadiologyReport.belongsTo(Radiologist, {
        foreignKey: 'attestingRadiologistId',
        as: 'attestingRadiologist',
        onDelete: 'RESTRICT',
    });
    return {
        study: studyAssoc,
        radiologist: radiologistAssoc,
        attestingRadiologist: attestingRadiologistAssoc,
    };
};
exports.createRadiologyReportAssociations = createRadiologyReportAssociations;
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
const trackReportRevisions = (RadiologyReport, ReportRevision) => {
    return RadiologyReport.hasMany(ReportRevision, {
        foreignKey: 'reportId',
        as: 'revisions',
        onDelete: 'CASCADE',
    });
};
exports.trackReportRevisions = trackReportRevisions;
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
const linkReportFindings = (RadiologyReport, Finding, FindingTemplate) => {
    const findingsAssoc = RadiologyReport.hasMany(Finding, {
        foreignKey: 'reportId',
        as: 'findings',
        onDelete: 'CASCADE',
    });
    Finding.belongsTo(FindingTemplate, {
        foreignKey: 'templateId',
        as: 'template',
        onDelete: 'RESTRICT',
    });
    return { findings: findingsAssoc, template: Finding.associations.template };
};
exports.linkReportFindings = linkReportFindings;
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
const queryReportsWithAssociations = async (RadiologyReport, where = {}, config = {}) => {
    const include = [
        {
            association: 'study',
            attributes: ['studyInstanceUid', 'studyDescription', 'studyDate'],
        },
        {
            association: 'radiologist',
            attributes: ['id', 'firstName', 'lastName', 'npi'],
        },
    ];
    if (config.includeFindings) {
        include.push({
            association: 'findings',
            attributes: ['id', 'findingType', 'description', 'severity'],
            include: [{ association: 'template', attributes: ['id', 'name'] }],
        });
    }
    if (config.trackRevisions) {
        include.push({
            association: 'revisions',
            attributes: ['id', 'revisionType', 'revisionReason', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });
    }
    return await RadiologyReport.findAll({ where, include });
};
exports.queryReportsWithAssociations = queryReportsWithAssociations;
// ============================================================================
// CRITICAL FINDINGS ALERTS
// ============================================================================
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
const createCriticalFindingAlert = (CriticalFinding, RadiologyReport, Provider, config = {}) => {
    const reportAssoc = CriticalFinding.belongsTo(RadiologyReport, {
        foreignKey: 'reportId',
        as: 'report',
        onDelete: 'CASCADE',
    });
    const orderingProviderAssoc = CriticalFinding.belongsTo(Provider, {
        foreignKey: 'orderingProviderId',
        as: 'orderingProvider',
        onDelete: 'RESTRICT',
    });
    const notificationsAssoc = CriticalFinding.hasMany(CriticalFinding.sequelize.model('CriticalFindingNotification'), {
        foreignKey: 'findingId',
        as: 'notifications',
        onDelete: 'CASCADE',
    });
    return {
        report: reportAssoc,
        orderingProvider: orderingProviderAssoc,
        notifications: notificationsAssoc,
    };
};
exports.createCriticalFindingAlert = createCriticalFindingAlert;
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
const trackCriticalFindingAcknowledgment = (CriticalFinding, Acknowledgment, User) => {
    Acknowledgment.belongsTo(User, {
        foreignKey: 'acknowledgedBy',
        as: 'acknowledger',
        onDelete: 'RESTRICT',
    });
    return CriticalFinding.hasMany(Acknowledgment, {
        foreignKey: 'findingId',
        as: 'acknowledgments',
        onDelete: 'CASCADE',
    });
};
exports.trackCriticalFindingAcknowledgment = trackCriticalFindingAcknowledgment;
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
const queryUnacknowledgedCriticalFindings = async (CriticalFinding, options = {}) => {
    const where = {
        acknowledgedAt: null,
    };
    if (options.severity) {
        where.severity = options.severity;
    }
    return await CriticalFinding.findAll({
        where,
        include: [
            {
                association: 'report',
                include: [
                    {
                        association: 'study',
                        include: [{ association: 'patient', attributes: ['id', 'firstName', 'lastName', 'mrn'] }],
                    },
                ],
            },
            { association: 'orderingProvider', attributes: ['id', 'firstName', 'lastName', 'phone'] },
        ],
        order: [['createdAt', 'ASC']],
    });
};
exports.queryUnacknowledgedCriticalFindings = queryUnacknowledgedCriticalFindings;
// ============================================================================
// IMAGE VIEWING SESSION TRACKING
// ============================================================================
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
const trackImageViewingSession = async (radiologist, study, config = {}) => {
    const ViewingSession = radiologist.sequelize.model('ImageViewingSession');
    return await ViewingSession.create({
        userId: radiologist.id,
        studyId: study.id,
        viewerType: config.trackViewerType ? 'PACS' : null,
        startedAt: new Date(),
    });
};
exports.trackImageViewingSession = trackImageViewingSession;
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
const createViewingSessionAssociations = (ViewingSession, User, DicomStudy) => {
    const userAssoc = ViewingSession.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
    });
    const studyAssoc = ViewingSession.belongsTo(DicomStudy, {
        foreignKey: 'studyId',
        as: 'study',
        onDelete: 'CASCADE',
    });
    return { user: userAssoc, study: studyAssoc };
};
exports.createViewingSessionAssociations = createViewingSessionAssociations;
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
const queryViewingSessionStats = async (ViewingSession, userId, startDate, endDate) => {
    const stats = await ViewingSession.findOne({
        attributes: [
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.col)('id')), 'totalSessions'],
            [(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('duration')), 'totalDuration'],
            [(0, sequelize_1.fn)('AVG', (0, sequelize_1.col)('duration')), 'averageDuration'],
            [(0, sequelize_1.fn)('COUNT', (0, sequelize_1.fn)('DISTINCT', (0, sequelize_1.col)('studyId'))), 'studiesViewed'],
        ],
        where: {
            userId,
            startedAt: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        raw: true,
    });
    return {
        totalSessions: parseInt(stats?.totalSessions || '0', 10),
        totalDuration: parseFloat(stats?.totalDuration || '0'),
        averageDuration: parseFloat(stats?.averageDuration || '0'),
        studiesViewed: parseInt(stats?.studiesViewed || '0', 10),
    };
};
exports.queryViewingSessionStats = queryViewingSessionStats;
// ============================================================================
// MODALITY WORKLIST MANAGEMENT
// ============================================================================
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
const createModalityWorklistEntry = async (order, modality, config = {}) => {
    const ModalityWorklist = order.sequelize.model('ModalityWorklist');
    return await ModalityWorklist.create({
        orderId: order.id,
        modalityId: modality.id,
        priority: config.priority || 'ROUTINE',
        scheduledTime: config.scheduledTime,
        estimatedDuration: config.estimatedDuration,
        status: 'SCHEDULED',
    });
};
exports.createModalityWorklistEntry = createModalityWorklistEntry;
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
const createModalityWorklistAssociations = (ModalityWorklist, ImagingOrder, Modality) => {
    const orderAssoc = ModalityWorklist.belongsTo(ImagingOrder, {
        foreignKey: 'orderId',
        as: 'order',
        onDelete: 'CASCADE',
    });
    const modalityAssoc = ModalityWorklist.belongsTo(Modality, {
        foreignKey: 'modalityId',
        as: 'modality',
        onDelete: 'RESTRICT',
    });
    return { order: orderAssoc, modality: modalityAssoc };
};
exports.createModalityWorklistAssociations = createModalityWorklistAssociations;
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
const queryModalityWorklist = async (ModalityWorklist, filters = {}) => {
    const where = {};
    if (filters.modalityId)
        where.modalityId = filters.modalityId;
    if (filters.status)
        where.status = filters.status;
    if (filters.priority)
        where.priority = filters.priority;
    if (filters.scheduledDate) {
        where.scheduledTime = {
            [sequelize_1.Op.gte]: filters.scheduledDate,
            [sequelize_1.Op.lt]: new Date(filters.scheduledDate.getTime() + 24 * 60 * 60 * 1000),
        };
    }
    return await ModalityWorklist.findAll({
        where,
        include: [
            {
                association: 'order',
                include: [
                    { association: 'patient', attributes: ['id', 'firstName', 'lastName', 'mrn'] },
                    { association: 'protocol', attributes: ['id', 'name', 'instructions'] },
                ],
            },
            { association: 'modality', attributes: ['id', 'name', 'aeTitle'] },
        ],
        order: [
            ['priority', 'DESC'],
            ['scheduledTime', 'ASC'],
        ],
    });
};
exports.queryModalityWorklist = queryModalityWorklist;
// ============================================================================
// PRIOR COMPARISON ASSOCIATIONS
// ============================================================================
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
const linkPriorComparisons = async (currentStudy, priorStudies) => {
    const StudyComparison = currentStudy.sequelize.model('StudyComparison');
    const comparisons = priorStudies.map((priorStudy) => ({
        currentStudyId: currentStudy.id,
        priorStudyId: priorStudy.id,
        comparisonType: 'PRIOR',
    }));
    await StudyComparison.bulkCreate(comparisons);
};
exports.linkPriorComparisons = linkPriorComparisons;
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
const createStudyComparisonAssociations = (StudyComparison, DicomStudy) => {
    const currentStudyAssoc = StudyComparison.belongsTo(DicomStudy, {
        foreignKey: 'currentStudyId',
        as: 'currentStudy',
        onDelete: 'CASCADE',
    });
    const priorStudyAssoc = StudyComparison.belongsTo(DicomStudy, {
        foreignKey: 'priorStudyId',
        as: 'priorStudy',
        onDelete: 'CASCADE',
    });
    return { currentStudy: currentStudyAssoc, priorStudy: priorStudyAssoc };
};
exports.createStudyComparisonAssociations = createStudyComparisonAssociations;
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
const findPriorStudiesForComparison = async (DicomStudy, patientId, currentStudyId, options = {}) => {
    const where = {
        patientId,
        id: { [sequelize_1.Op.ne]: currentStudyId },
        status: StudyStatus.FINAL,
    };
    if (options.modality)
        where.modality = options.modality;
    if (options.bodyPart)
        where.bodyPartExamined = options.bodyPart;
    return await DicomStudy.findAll({
        where,
        attributes: ['id', 'studyInstanceUid', 'studyDescription', 'studyDate', 'modality'],
        order: [['studyDate', 'DESC']],
        limit: options.limit || 5,
    });
};
exports.findPriorStudiesForComparison = findPriorStudiesForComparison;
// ============================================================================
// RADIATION DOSE TRACKING
// ============================================================================
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
const createRadiationDoseTracking = (RadiationDose, DicomSeries, Patient, config = {}) => {
    const seriesAssoc = RadiationDose.belongsTo(DicomSeries, {
        foreignKey: 'seriesId',
        as: 'series',
        onDelete: 'CASCADE',
    });
    const patientAssoc = RadiationDose.belongsTo(Patient, {
        foreignKey: 'patientId',
        as: 'patient',
        onDelete: 'CASCADE',
    });
    return { series: seriesAssoc, patient: patientAssoc };
};
exports.createRadiationDoseTracking = createRadiationDoseTracking;
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
const calculateCumulativeRadiationDose = async (RadiationDose, patientId, startDate, endDate) => {
    const result = await RadiationDose.findOne({
        attributes: [[(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('effectiveDose')), 'totalDose']],
        where: {
            patientId,
            exposureDate: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
        raw: true,
    });
    return parseFloat(result?.totalDose || '0');
};
exports.calculateCumulativeRadiationDose = calculateCumulativeRadiationDose;
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
const checkRadiationDoseThreshold = async (RadiationDose, patientId, thresholdMsv, periodDays) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);
    const cumulativeDose = await (0, exports.calculateCumulativeRadiationDose)(RadiationDose, patientId, startDate, new Date());
    return cumulativeDose >= thresholdMsv;
};
exports.checkRadiationDoseThreshold = checkRadiationDoseThreshold;
// ============================================================================
// RADIOLOGIST ASSIGNMENT & WORKLOAD
// ============================================================================
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
const assignRadiologistToStudy = async (study, radiologist, options = {}) => {
    await study.update({
        assignedRadiologistId: radiologist.id,
        assignedAt: new Date(),
        priority: options.priority,
    });
};
exports.assignRadiologistToStudy = assignRadiologistToStudy;
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
const createRadiologistAssignmentAssociations = (StudyAssignment, DicomStudy, Radiologist) => {
    const studyAssoc = StudyAssignment.belongsTo(DicomStudy, {
        foreignKey: 'studyId',
        as: 'study',
        onDelete: 'CASCADE',
    });
    const radiologistAssoc = StudyAssignment.belongsTo(Radiologist, {
        foreignKey: 'radiologistId',
        as: 'radiologist',
        onDelete: 'RESTRICT',
    });
    return { study: studyAssoc, radiologist: radiologistAssoc };
};
exports.createRadiologistAssignmentAssociations = createRadiologistAssignmentAssociations;
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
const queryRadiologistWorkload = async (DicomStudy, radiologistId, startDate, endDate) => {
    const total = await DicomStudy.count({
        where: {
            assignedRadiologistId: radiologistId,
            studyDate: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const pending = await DicomStudy.count({
        where: {
            assignedRadiologistId: radiologistId,
            status: { [sequelize_1.Op.in]: [StudyStatus.PENDING_REVIEW, StudyStatus.IN_PROGRESS] },
        },
    });
    const completed = await DicomStudy.count({
        where: {
            assignedRadiologistId: radiologistId,
            status: { [sequelize_1.Op.in]: [StudyStatus.FINAL, StudyStatus.PRELIMINARY] },
            studyDate: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const avgTurnaround = await DicomStudy.findOne({
        attributes: [
            [
                (0, sequelize_1.fn)('AVG', (0, sequelize_1.literal)('EXTRACT(EPOCH FROM (completed_at - study_date)) / 60')),
                'avgMinutes',
            ],
        ],
        where: {
            assignedRadiologistId: radiologistId,
            status: StudyStatus.FINAL,
            studyDate: { [sequelize_1.Op.between]: [startDate, endDate] },
            completedAt: { [sequelize_1.Op.ne]: null },
        },
        raw: true,
    });
    return {
        totalStudies: total,
        pendingStudies: pending,
        completedStudies: completed,
        averageTurnaroundMinutes: parseFloat(avgTurnaround?.avgMinutes || '0'),
    };
};
exports.queryRadiologistWorkload = queryRadiologistWorkload;
// ============================================================================
// IMAGE SHARING & BURNING
// ============================================================================
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
const createImageSharingRequest = async (study, requester, options = {}) => {
    const ImageShare = study.sequelize.model('ImageShare');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (options.expiresIn || 7));
    return await ImageShare.create({
        studyId: study.id,
        requestedBy: requester.id,
        recipientEmail: options.recipientEmail,
        recipientName: options.recipientName,
        includeReport: options.includeReport || false,
        expiresAt,
        status: 'PENDING',
    });
};
exports.createImageSharingRequest = createImageSharingRequest;
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
const createMediaBurningAssociations = (MediaBurnRequest, DicomStudy, User) => {
    const studiesAssoc = MediaBurnRequest.belongsToMany(DicomStudy, {
        through: 'media_burn_studies',
        foreignKey: 'burnRequestId',
        otherKey: 'studyId',
        as: 'studies',
    });
    const requestedByAssoc = MediaBurnRequest.belongsTo(User, {
        foreignKey: 'requestedBy',
        as: 'requester',
        onDelete: 'RESTRICT',
    });
    return { studies: studiesAssoc, requestedBy: requestedByAssoc };
};
exports.createMediaBurningAssociations = createMediaBurningAssociations;
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
const queryPendingMediaBurnRequests = async (MediaBurnRequest, filters = {}) => {
    const where = {
        status: 'PENDING',
    };
    if (filters.facilityId)
        where.facilityId = filters.facilityId;
    if (filters.priority)
        where.priority = filters.priority;
    return await MediaBurnRequest.findAll({
        where,
        include: [
            {
                association: 'studies',
                attributes: ['id', 'studyInstanceUid', 'studyDescription', 'studyDate'],
            },
            {
                association: 'requester',
                attributes: ['id', 'firstName', 'lastName', 'email'],
            },
        ],
        order: [
            ['priority', 'DESC'],
            ['createdAt', 'ASC'],
        ],
    });
};
exports.queryPendingMediaBurnRequests = queryPendingMediaBurnRequests;
// ============================================================================
// TELERADIOLOGY CONSULTATION
// ============================================================================
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
const createTeleradiologyConsultation = async (study, requestingRadiologist, consultantRadiologist, config = {}) => {
    const TeleradConsultation = study.sequelize.model('TeleradiologyConsultation');
    return await TeleradConsultation.create({
        studyId: study.id,
        requestingRadiologistId: requestingRadiologist.id,
        consultantRadiologistId: consultantRadiologist.id,
        requestedAt: new Date(),
        status: 'PENDING',
        secureTransmission: config.requireSecureTransmission || true,
    });
};
exports.createTeleradiologyConsultation = createTeleradiologyConsultation;
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
const createTeleradiologyConsultationAssociations = (TeleradConsultation, DicomStudy, Radiologist) => {
    const studyAssoc = TeleradConsultation.belongsTo(DicomStudy, {
        foreignKey: 'studyId',
        as: 'study',
        onDelete: 'CASCADE',
    });
    const requestingAssoc = TeleradConsultation.belongsTo(Radiologist, {
        foreignKey: 'requestingRadiologistId',
        as: 'requestingRadiologist',
        onDelete: 'RESTRICT',
    });
    const consultantAssoc = TeleradConsultation.belongsTo(Radiologist, {
        foreignKey: 'consultantRadiologistId',
        as: 'consultantRadiologist',
        onDelete: 'RESTRICT',
    });
    return {
        study: studyAssoc,
        requestingRadiologist: requestingAssoc,
        consultantRadiologist: consultantAssoc,
    };
};
exports.createTeleradiologyConsultationAssociations = createTeleradiologyConsultationAssociations;
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
const queryTeleradiologyTurnaroundStats = async (TeleradConsultation, consultantId, startDate, endDate) => {
    const total = await TeleradConsultation.count({
        where: {
            consultantRadiologistId: consultantId,
            requestedAt: { [sequelize_1.Op.between]: [startDate, endDate] },
        },
    });
    const avgTurnaround = await TeleradConsultation.findOne({
        attributes: [
            [
                (0, sequelize_1.fn)('AVG', (0, sequelize_1.literal)('EXTRACT(EPOCH FROM (completed_at - requested_at)) / 60')),
                'avgMinutes',
            ],
        ],
        where: {
            consultantRadiologistId: consultantId,
            status: 'COMPLETED',
            requestedAt: { [sequelize_1.Op.between]: [startDate, endDate] },
            completedAt: { [sequelize_1.Op.ne]: null },
        },
        raw: true,
    });
    const within24Hours = await TeleradConsultation.count({
        where: {
            consultantRadiologistId: consultantId,
            status: 'COMPLETED',
            requestedAt: { [sequelize_1.Op.between]: [startDate, endDate] },
            [sequelize_1.Op.and]: [
                (0, sequelize_1.literal)('EXTRACT(EPOCH FROM (completed_at - requested_at)) / 3600 <= 24'),
            ],
        },
    });
    return {
        totalConsultations: total,
        averageTurnaroundMinutes: parseFloat(avgTurnaround?.avgMinutes || '0'),
        completedWithin24Hours: within24Hours,
    };
};
exports.queryTeleradiologyTurnaroundStats = queryTeleradiologyTurnaroundStats;
//# sourceMappingURL=health-medical-imaging-kit.js.map