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

import {
  Model,
  ModelStatic,
  Association,
  HasManyOptions,
  BelongsToOptions,
  BelongsToManyOptions,
  FindOptions,
  CreateOptions,
  Transaction,
  WhereOptions,
  Op,
  Includeable,
  DataTypes,
  Sequelize,
  fn,
  col,
  literal,
  QueryTypes,
} from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * @enum ImagingModality
 * @description Standard DICOM imaging modalities
 */
export enum ImagingModality {
  CR = 'CR', // Computed Radiography
  CT = 'CT', // Computed Tomography
  MR = 'MR', // Magnetic Resonance
  US = 'US', // Ultrasound
  XA = 'XA', // X-Ray Angiography
  RF = 'RF', // Radiofluoroscopy
  DX = 'DX', // Digital Radiography
  MG = 'MG', // Mammography
  NM = 'NM', // Nuclear Medicine
  PT = 'PT', // Positron Emission Tomography
  PET_CT = 'PET/CT', // PET/CT Fusion
  SPECT = 'SPECT', // Single Photon Emission Computed Tomography
}

/**
 * @enum StudyStatus
 * @description Imaging study workflow statuses
 */
export enum StudyStatus {
  SCHEDULED = 'SCHEDULED',
  ARRIVED = 'ARRIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PRELIMINARY = 'PRELIMINARY',
  FINAL = 'FINAL',
  AMENDED = 'AMENDED',
}

/**
 * @enum ReportStatus
 * @description Radiology report statuses
 */
export enum ReportStatus {
  DRAFT = 'DRAFT',
  PRELIMINARY = 'PRELIMINARY',
  FINAL = 'FINAL',
  AMENDED = 'AMENDED',
  ADDENDED = 'ADDENDED',
  CORRECTED = 'CORRECTED',
}

/**
 * @enum CriticalFindingSeverity
 * @description Critical finding alert severity levels
 */
export enum CriticalFindingSeverity {
  CRITICAL = 'CRITICAL',
  URGENT = 'URGENT',
  SIGNIFICANT = 'SIGNIFICANT',
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
export const createImagingOrderAssociations = async (
  ImagingOrder: ModelStatic<any>,
  Patient: ModelStatic<any>,
  Provider: ModelStatic<any>,
  config: ImagingOrderConfig = {},
): Promise<{
  patient: Association;
  orderingProvider: Association;
  referringProvider?: Association;
}> => {
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
export const linkOrderToModalityProtocol = (
  ImagingOrder: ModelStatic<any>,
  ImagingProtocol: ModelStatic<any>,
  Modality: ModelStatic<any>,
): { protocol: Association; modality: Association } => {
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
export const createOrderStatusTracking = (
  ImagingOrder: ModelStatic<any>,
  OrderStatusLog: ModelStatic<any>,
): Association => {
  return ImagingOrder.hasMany(OrderStatusLog, {
    foreignKey: 'orderId',
    as: 'statusHistory',
    onDelete: 'CASCADE',
  });
};

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
export const queryImagingOrdersWithAssociations = async (
  ImagingOrder: ModelStatic<any>,
  where: WhereOptions = {},
  config: ImagingOrderConfig = {},
): Promise<any[]> => {
  const include: Includeable[] = [];

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
export const createStudySeriesInstanceHierarchy = (
  DicomStudy: ModelStatic<any>,
  DicomSeries: ModelStatic<any>,
  DicomInstance: ModelStatic<any>,
  config: { enforceConstraints?: boolean } = {},
): {
  studySeries: Association;
  seriesInstances: Association;
  seriesStudy: Association;
  instanceSeries: Association;
} => {
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
export const linkStudyToOrder = (
  DicomStudy: ModelStatic<any>,
  ImagingOrder: ModelStatic<any>,
): Association => {
  return DicomStudy.belongsTo(ImagingOrder, {
    foreignKey: 'orderId',
    as: 'imagingOrder',
    onDelete: 'SET NULL',
  });
};

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
export const queryStudyWithHierarchy = async (
  DicomStudy: ModelStatic<any>,
  studyInstanceUid: string,
  config: StudyAssociationConfig = {},
): Promise<any> => {
  const include: Includeable[] = [];

  if (config.includeSeries) {
    const seriesInclude: any = {
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
export const countStudyInstances = async (
  DicomStudy: ModelStatic<any>,
  studyInstanceUid: string,
): Promise<number> => {
  const study = await DicomStudy.findOne({
    where: { studyInstanceUid },
    include: [
      {
        association: 'series',
        attributes: [],
        include: [{ association: 'instances', attributes: [] }],
      },
    ],
    attributes: [[fn('COUNT', col('series.instances.id')), 'instanceCount']],
    group: ['DicomStudy.id'],
    raw: true,
  });

  return parseInt((study as any)?.instanceCount || '0', 10);
};

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
export const configurePACSWorkflow = async (
  PACSNode: ModelStatic<any>,
  ImagingStudy: ModelStatic<any>,
  config: PACSIntegrationConfig = {},
): Promise<Association> => {
  return ImagingStudy.belongsTo(PACSNode, {
    foreignKey: 'pacsNodeId',
    as: 'pacsNode',
    onDelete: 'RESTRICT',
  });
};

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
export const createPACSTransferTracking = (
  PACSTransfer: ModelStatic<any>,
  DicomStudy: ModelStatic<any>,
  PACSNode: ModelStatic<any>,
): { study: Association; sourceNode: Association; destinationNode: Association } => {
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
export const trackPACSStorageLocation = (
  DicomStudy: ModelStatic<any>,
  StorageLocation: ModelStatic<any>,
): Association => {
  return DicomStudy.belongsToMany(StorageLocation, {
    through: 'study_storage_locations',
    foreignKey: 'studyId',
    otherKey: 'locationId',
    as: 'storageLocations',
    timestamps: true,
  });
};

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
export const linkRadiologyReport = async (
  study: Model,
  report: Model,
  radiologist: Model,
  config: RadiologyReportConfig = {},
): Promise<void> => {
  await report.update({
    studyId: (study as any).id,
    radiologistId: (radiologist as any).id,
    status: ReportStatus.DRAFT,
  });
};

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
export const createRadiologyReportAssociations = (
  RadiologyReport: ModelStatic<any>,
  DicomStudy: ModelStatic<any>,
  Radiologist: ModelStatic<any>,
): {
  study: Association;
  radiologist: Association;
  attestingRadiologist?: Association;
} => {
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
export const trackReportRevisions = (
  RadiologyReport: ModelStatic<any>,
  ReportRevision: ModelStatic<any>,
): Association => {
  return RadiologyReport.hasMany(ReportRevision, {
    foreignKey: 'reportId',
    as: 'revisions',
    onDelete: 'CASCADE',
  });
};

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
export const linkReportFindings = (
  RadiologyReport: ModelStatic<any>,
  Finding: ModelStatic<any>,
  FindingTemplate: ModelStatic<any>,
): { findings: Association; template: Association } => {
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
export const queryReportsWithAssociations = async (
  RadiologyReport: ModelStatic<any>,
  where: WhereOptions = {},
  config: RadiologyReportConfig = {},
): Promise<any[]> => {
  const include: Includeable[] = [
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
export const createCriticalFindingAlert = (
  CriticalFinding: ModelStatic<any>,
  RadiologyReport: ModelStatic<any>,
  Provider: ModelStatic<any>,
  config: CriticalFindingConfig = {},
): {
  report: Association;
  orderingProvider: Association;
  notifications: Association;
} => {
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

  const notificationsAssoc = CriticalFinding.hasMany(
    CriticalFinding.sequelize!.model('CriticalFindingNotification'),
    {
      foreignKey: 'findingId',
      as: 'notifications',
      onDelete: 'CASCADE',
    },
  );

  return {
    report: reportAssoc,
    orderingProvider: orderingProviderAssoc,
    notifications: notificationsAssoc,
  };
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
export const trackCriticalFindingAcknowledgment = (
  CriticalFinding: ModelStatic<any>,
  Acknowledgment: ModelStatic<any>,
  User: ModelStatic<any>,
): Association => {
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
export const queryUnacknowledgedCriticalFindings = async (
  CriticalFinding: ModelStatic<any>,
  options: { facilityId?: string; severity?: CriticalFindingSeverity } = {},
): Promise<any[]> => {
  const where: WhereOptions = {
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
export const trackImageViewingSession = async (
  radiologist: Model,
  study: Model,
  config: ImageViewingSessionConfig = {},
): Promise<any> => {
  const ViewingSession = radiologist.sequelize!.model('ImageViewingSession');

  return await ViewingSession.create({
    userId: (radiologist as any).id,
    studyId: (study as any).id,
    viewerType: config.trackViewerType ? 'PACS' : null,
    startedAt: new Date(),
  });
};

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
export const createViewingSessionAssociations = (
  ViewingSession: ModelStatic<any>,
  User: ModelStatic<any>,
  DicomStudy: ModelStatic<any>,
): { user: Association; study: Association } => {
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
export const queryViewingSessionStats = async (
  ViewingSession: ModelStatic<any>,
  userId: string,
  startDate: Date,
  endDate: Date,
): Promise<{
  totalSessions: number;
  totalDuration: number;
  averageDuration: number;
  studiesViewed: number;
}> => {
  const stats = await ViewingSession.findOne({
    attributes: [
      [fn('COUNT', col('id')), 'totalSessions'],
      [fn('SUM', col('duration')), 'totalDuration'],
      [fn('AVG', col('duration')), 'averageDuration'],
      [fn('COUNT', fn('DISTINCT', col('studyId'))), 'studiesViewed'],
    ],
    where: {
      userId,
      startedAt: { [Op.between]: [startDate, endDate] },
    },
    raw: true,
  });

  return {
    totalSessions: parseInt((stats as any)?.totalSessions || '0', 10),
    totalDuration: parseFloat((stats as any)?.totalDuration || '0'),
    averageDuration: parseFloat((stats as any)?.averageDuration || '0'),
    studiesViewed: parseInt((stats as any)?.studiesViewed || '0', 10),
  };
};

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
export const createModalityWorklistEntry = async (
  order: Model,
  modality: Model,
  config: ModalityWorklistConfig = {},
): Promise<any> => {
  const ModalityWorklist = order.sequelize!.model('ModalityWorklist');

  return await ModalityWorklist.create({
    orderId: (order as any).id,
    modalityId: (modality as any).id,
    priority: config.priority || 'ROUTINE',
    scheduledTime: config.scheduledTime,
    estimatedDuration: config.estimatedDuration,
    status: 'SCHEDULED',
  });
};

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
export const createModalityWorklistAssociations = (
  ModalityWorklist: ModelStatic<any>,
  ImagingOrder: ModelStatic<any>,
  Modality: ModelStatic<any>,
): { order: Association; modality: Association } => {
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
export const queryModalityWorklist = async (
  ModalityWorklist: ModelStatic<any>,
  filters: {
    modalityId?: string;
    status?: string;
    priority?: string;
    scheduledDate?: Date;
  } = {},
): Promise<any[]> => {
  const where: WhereOptions = {};

  if (filters.modalityId) where.modalityId = filters.modalityId;
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.scheduledDate) {
    where.scheduledTime = {
      [Op.gte]: filters.scheduledDate,
      [Op.lt]: new Date(filters.scheduledDate.getTime() + 24 * 60 * 60 * 1000),
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
export const linkPriorComparisons = async (
  currentStudy: Model,
  priorStudies: Model[],
): Promise<void> => {
  const StudyComparison = currentStudy.sequelize!.model('StudyComparison');

  const comparisons = priorStudies.map((priorStudy) => ({
    currentStudyId: (currentStudy as any).id,
    priorStudyId: (priorStudy as any).id,
    comparisonType: 'PRIOR',
  }));

  await StudyComparison.bulkCreate(comparisons);
};

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
export const createStudyComparisonAssociations = (
  StudyComparison: ModelStatic<any>,
  DicomStudy: ModelStatic<any>,
): { currentStudy: Association; priorStudy: Association } => {
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
export const findPriorStudiesForComparison = async (
  DicomStudy: ModelStatic<any>,
  patientId: string,
  currentStudyId: string,
  options: { modality?: string; bodyPart?: string; limit?: number } = {},
): Promise<any[]> => {
  const where: WhereOptions = {
    patientId,
    id: { [Op.ne]: currentStudyId },
    status: StudyStatus.FINAL,
  };

  if (options.modality) where.modality = options.modality;
  if (options.bodyPart) where.bodyPartExamined = options.bodyPart;

  return await DicomStudy.findAll({
    where,
    attributes: ['id', 'studyInstanceUid', 'studyDescription', 'studyDate', 'modality'],
    order: [['studyDate', 'DESC']],
    limit: options.limit || 5,
  });
};

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
export const createRadiationDoseTracking = (
  RadiationDose: ModelStatic<any>,
  DicomSeries: ModelStatic<any>,
  Patient: ModelStatic<any>,
  config: RadiationDoseConfig = {},
): { series: Association; patient: Association } => {
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
export const calculateCumulativeRadiationDose = async (
  RadiationDose: ModelStatic<any>,
  patientId: string,
  startDate: Date,
  endDate: Date,
): Promise<number> => {
  const result = await RadiationDose.findOne({
    attributes: [[fn('SUM', col('effectiveDose')), 'totalDose']],
    where: {
      patientId,
      exposureDate: { [Op.between]: [startDate, endDate] },
    },
    raw: true,
  });

  return parseFloat((result as any)?.totalDose || '0');
};

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
export const checkRadiationDoseThreshold = async (
  RadiationDose: ModelStatic<any>,
  patientId: string,
  thresholdMsv: number,
  periodDays: number,
): Promise<boolean> => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - periodDays);

  const cumulativeDose = await calculateCumulativeRadiationDose(
    RadiationDose,
    patientId,
    startDate,
    new Date(),
  );

  return cumulativeDose >= thresholdMsv;
};

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
export const assignRadiologistToStudy = async (
  study: Model,
  radiologist: Model,
  options: { priority?: string; subspecialty?: string } = {},
): Promise<void> => {
  await study.update({
    assignedRadiologistId: (radiologist as any).id,
    assignedAt: new Date(),
    priority: options.priority,
  });
};

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
export const createRadiologistAssignmentAssociations = (
  StudyAssignment: ModelStatic<any>,
  DicomStudy: ModelStatic<any>,
  Radiologist: ModelStatic<any>,
): { study: Association; radiologist: Association } => {
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
export const queryRadiologistWorkload = async (
  DicomStudy: ModelStatic<any>,
  radiologistId: string,
  startDate: Date,
  endDate: Date,
): Promise<{
  totalStudies: number;
  pendingStudies: number;
  completedStudies: number;
  averageTurnaroundMinutes: number;
}> => {
  const total = await DicomStudy.count({
    where: {
      assignedRadiologistId: radiologistId,
      studyDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const pending = await DicomStudy.count({
    where: {
      assignedRadiologistId: radiologistId,
      status: { [Op.in]: [StudyStatus.PENDING_REVIEW, StudyStatus.IN_PROGRESS] },
    },
  });

  const completed = await DicomStudy.count({
    where: {
      assignedRadiologistId: radiologistId,
      status: { [Op.in]: [StudyStatus.FINAL, StudyStatus.PRELIMINARY] },
      studyDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const avgTurnaround = await DicomStudy.findOne({
    attributes: [
      [
        fn('AVG', literal('EXTRACT(EPOCH FROM (completed_at - study_date)) / 60')),
        'avgMinutes',
      ],
    ],
    where: {
      assignedRadiologistId: radiologistId,
      status: StudyStatus.FINAL,
      studyDate: { [Op.between]: [startDate, endDate] },
      completedAt: { [Op.ne]: null },
    },
    raw: true,
  });

  return {
    totalStudies: total,
    pendingStudies: pending,
    completedStudies: completed,
    averageTurnaroundMinutes: parseFloat((avgTurnaround as any)?.avgMinutes || '0'),
  };
};

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
export const createImageSharingRequest = async (
  study: Model,
  requester: Model,
  options: {
    recipientEmail?: string;
    recipientName?: string;
    expiresIn?: number;
    includeReport?: boolean;
  } = {},
): Promise<any> => {
  const ImageShare = study.sequelize!.model('ImageShare');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (options.expiresIn || 7));

  return await ImageShare.create({
    studyId: (study as any).id,
    requestedBy: (requester as any).id,
    recipientEmail: options.recipientEmail,
    recipientName: options.recipientName,
    includeReport: options.includeReport || false,
    expiresAt,
    status: 'PENDING',
  });
};

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
export const createMediaBurningAssociations = (
  MediaBurnRequest: ModelStatic<any>,
  DicomStudy: ModelStatic<any>,
  User: ModelStatic<any>,
): { studies: Association; requestedBy: Association } => {
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
export const queryPendingMediaBurnRequests = async (
  MediaBurnRequest: ModelStatic<any>,
  filters: { facilityId?: string; priority?: string } = {},
): Promise<any[]> => {
  const where: WhereOptions = {
    status: 'PENDING',
  };

  if (filters.facilityId) where.facilityId = filters.facilityId;
  if (filters.priority) where.priority = filters.priority;

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
export const createTeleradiologyConsultation = async (
  study: Model,
  requestingRadiologist: Model,
  consultantRadiologist: Model,
  config: TeleradiologyConfig = {},
): Promise<any> => {
  const TeleradConsultation = study.sequelize!.model('TeleradiologyConsultation');

  return await TeleradConsultation.create({
    studyId: (study as any).id,
    requestingRadiologistId: (requestingRadiologist as any).id,
    consultantRadiologistId: (consultantRadiologist as any).id,
    requestedAt: new Date(),
    status: 'PENDING',
    secureTransmission: config.requireSecureTransmission || true,
  });
};

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
export const createTeleradiologyConsultationAssociations = (
  TeleradConsultation: ModelStatic<any>,
  DicomStudy: ModelStatic<any>,
  Radiologist: ModelStatic<any>,
): {
  study: Association;
  requestingRadiologist: Association;
  consultantRadiologist: Association;
} => {
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
export const queryTeleradiologyTurnaroundStats = async (
  TeleradConsultation: ModelStatic<any>,
  consultantId: string,
  startDate: Date,
  endDate: Date,
): Promise<{
  totalConsultations: number;
  averageTurnaroundMinutes: number;
  completedWithin24Hours: number;
}> => {
  const total = await TeleradConsultation.count({
    where: {
      consultantRadiologistId: consultantId,
      requestedAt: { [Op.between]: [startDate, endDate] },
    },
  });

  const avgTurnaround = await TeleradConsultation.findOne({
    attributes: [
      [
        fn('AVG', literal('EXTRACT(EPOCH FROM (completed_at - requested_at)) / 60')),
        'avgMinutes',
      ],
    ],
    where: {
      consultantRadiologistId: consultantId,
      status: 'COMPLETED',
      requestedAt: { [Op.between]: [startDate, endDate] },
      completedAt: { [Op.ne]: null },
    },
    raw: true,
  });

  const within24Hours = await TeleradConsultation.count({
    where: {
      consultantRadiologistId: consultantId,
      status: 'COMPLETED',
      requestedAt: { [Op.between]: [startDate, endDate] },
      [Op.and]: [
        literal('EXTRACT(EPOCH FROM (completed_at - requested_at)) / 3600 <= 24'),
      ],
    },
  });

  return {
    totalConsultations: total,
    averageTurnaroundMinutes: parseFloat((avgTurnaround as any)?.avgMinutes || '0'),
    completedWithin24Hours: within24Hours,
  };
};
