/**
 * ASSET CALIBRATION MANAGEMENT COMMANDS
 *
 * Production-ready command functions for comprehensive asset calibration management in enterprise systems.
 * Provides 40+ specialized functions covering:
 * - Calibration scheduling and frequency optimization
 * - Calibration execution and measurement recording
 * - Calibration certification and documentation
 * - Calibration standards management and traceability
 * - Out-of-tolerance detection and handling workflows
 * - Calibration vendor management and performance tracking
 * - Calibration due date tracking and notifications
 * - Calibration cost tracking and analysis
 * - Multi-point calibration procedures
 * - Environmental condition monitoring
 * - Calibration equipment management
 * - Regulatory compliance (ISO/IEC 17025, FDA 21 CFR Part 11)
 *
 * @module AssetCalibrationCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @security Compliant with ISO/IEC 17025, FDA 21 CFR Part 11, HIPAA
 * @performance Optimized for high-volume calibration operations (1000+ assets)
 *
 * @example
 * ```typescript
 * import {
 *   scheduleCalibration,
 *   recordCalibrationCompletion,
 *   detectOutOfTolerance,
 *   generateCalibrationCertificate,
 *   CalibrationSchedule,
 *   CalibrationFrequency
 * } from './asset-calibration-commands';
 *
 * // Schedule calibration for critical medical equipment
 * const schedule = await scheduleCalibration({
 *   assetId: 'asset-mri-001',
 *   calibrationTypeId: 'cal-type-magnetic-field',
 *   frequency: CalibrationFrequency.MONTHLY,
 *   dueDate: new Date('2024-12-01'),
 *   assignedTechnicianId: 'tech-001',
 *   standardIds: ['std-nist-001', 'std-iso-002']
 * });
 *
 * // Record calibration results
 * const record = await recordCalibrationCompletion(schedule.id, {
 *   performedBy: 'tech-001',
 *   performedDate: new Date(),
 *   measurements: [
 *     { parameter: 'field-strength', reading: 1.5, unit: 'Tesla', tolerance: 0.01 }
 *   ],
 *   passed: true,
 *   environmentalConditions: {
 *     temperature: 22.5,
 *     humidity: 45,
 *     pressure: 101.3
 *   }
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
/**
 * Calibration frequency types
 */
export declare enum CalibrationFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    BIWEEKLY = "biweekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    SEMIANNUALLY = "semiannually",
    ANNUALLY = "annually",
    BIANNUALLY = "biannually",
    ON_DEMAND = "on_demand",
    USAGE_BASED = "usage_based"
}
/**
 * Calibration status
 */
export declare enum CalibrationStatus {
    SCHEDULED = "scheduled",
    DUE = "due",
    OVERDUE = "overdue",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    PASSED = "passed",
    FAILED = "failed",
    CANCELLED = "cancelled",
    DEFERRED = "deferred"
}
/**
 * Calibration result
 */
export declare enum CalibrationResult {
    PASS = "pass",
    FAIL = "fail",
    LIMITED_PASS = "limited_pass",
    OUT_OF_TOLERANCE = "out_of_tolerance",
    CONDITIONAL = "conditional"
}
/**
 * Out-of-tolerance action
 */
export declare enum OutOfToleranceAction {
    QUARANTINE = "quarantine",
    ADJUST_AND_RETEST = "adjust_and_retest",
    REPAIR = "repair",
    REPLACE = "replace",
    ACCEPT_AS_IS = "accept_as_is",
    INVESTIGATE = "investigate"
}
/**
 * Calibration method
 */
export declare enum CalibrationMethod {
    INTERNAL = "internal",
    EXTERNAL = "external",
    SELF_CALIBRATION = "self_calibration",
    AUTOMATIC = "automatic",
    MANUAL = "manual"
}
/**
 * Standard traceability source
 */
export declare enum TraceabilitySource {
    NIST = "nist",
    ISO = "iso",
    PTB = "ptb",
    NPL = "npl",
    MANUFACTURER = "manufacturer",
    ACCREDITED_LAB = "accredited_lab"
}
/**
 * Calibration schedule data
 */
export interface CalibrationScheduleData {
    assetId: string;
    calibrationTypeId: string;
    frequency: CalibrationFrequency;
    dueDate: Date;
    assignedTechnicianId?: string;
    assignedVendorId?: string;
    standardIds?: string[];
    procedureId?: string;
    priority?: 'critical' | 'high' | 'medium' | 'low';
    notes?: string;
}
/**
 * Calibration completion data
 */
export interface CalibrationCompletionData {
    performedBy: string;
    performedDate: Date;
    measurements: CalibrationMeasurement[];
    passed: boolean;
    result: CalibrationResult;
    environmentalConditions?: EnvironmentalConditions;
    equipmentUsed?: string[];
    standardsUsed?: string[];
    adjustmentsMade?: string;
    deviations?: string;
    notes?: string;
    certificateNumber?: string;
}
/**
 * Calibration measurement
 */
export interface CalibrationMeasurement {
    parameter: string;
    nominalValue?: number;
    reading: number;
    unit: string;
    tolerance: number;
    toleranceType?: 'absolute' | 'percentage';
    upperLimit?: number;
    lowerLimit?: number;
    uncertainty?: number;
    passed: boolean;
}
/**
 * Environmental conditions during calibration
 */
export interface EnvironmentalConditions {
    temperature: number;
    temperatureUnit?: string;
    humidity: number;
    pressure?: number;
    pressureUnit?: string;
    vibration?: number;
    electromagneticInterference?: number;
}
/**
 * Calibration standard data
 */
export interface CalibrationStandardData {
    standardNumber: string;
    description: string;
    traceabilitySource: TraceabilitySource;
    traceabilityCertificateNumber?: string;
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    calibrationDate: Date;
    expirationDate: Date;
    uncertaintyValue?: number;
    uncertaintyUnit?: string;
    custodian?: string;
    location?: string;
}
/**
 * Out-of-tolerance handling data
 */
export interface OutOfToleranceHandlingData {
    calibrationRecordId: string;
    action: OutOfToleranceAction;
    assignedTo: string;
    dueDate?: Date;
    rootCause?: string;
    correctiveAction?: string;
    preventiveAction?: string;
    impactAssessment?: string;
    affectedAssets?: string[];
    notificationsSent?: string[];
}
/**
 * Vendor performance metrics
 */
export interface VendorPerformanceMetrics {
    vendorId: string;
    totalCalibrations: number;
    passRate: number;
    averageTurnaroundTime: number;
    onTimeDeliveryRate: number;
    costEfficiency: number;
    qualityScore: number;
    customerSatisfactionScore?: number;
}
/**
 * Calibration Type Model - Defines calibration procedures and specifications
 */
export declare class CalibrationType extends Model {
    id: string;
    code: string;
    name: string;
    description?: string;
    defaultFrequency?: CalibrationFrequency;
    requiredStandards?: string[];
    procedureDocumentUrl?: string;
    toleranceSpecs?: Record<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    schedules?: CalibrationSchedule[];
}
/**
 * Calibration Schedule Model - Tracks calibration schedules for assets
 */
export declare class CalibrationSchedule extends Model {
    id: string;
    assetId: string;
    calibrationTypeId: string;
    frequency: CalibrationFrequency;
    scheduledDate?: Date;
    dueDate: Date;
    status: CalibrationStatus;
    assignedTechnicianId?: string;
    assignedVendorId?: string;
    method?: CalibrationMethod;
    standardIds?: string[];
    procedureId?: string;
    priority?: string;
    workOrderNumber?: string;
    estimatedDuration?: number;
    estimatedCost?: number;
    notes?: string;
    reminderSentDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    calibrationType?: CalibrationType;
    records?: CalibrationRecord[];
}
/**
 * Calibration Record Model - Records actual calibration execution and results
 */
export declare class CalibrationRecord extends Model {
    id: string;
    scheduleId: string;
    assetId: string;
    performedBy: string;
    performedDate: Date;
    completionDate?: Date;
    result: CalibrationResult;
    passed: boolean;
    certificateNumber?: string;
    measurements: CalibrationMeasurement[];
    environmentalConditions?: EnvironmentalConditions;
    equipmentUsed?: string[];
    standardsUsed?: string[];
    adjustmentsMade?: string;
    deviations?: string;
    notes?: string;
    actualDuration?: number;
    actualCost?: number;
    nextDueDate?: Date;
    reviewedBy?: string;
    reviewDate?: Date;
    approvedBy?: string;
    approvalDate?: Date;
    certificateFilePath?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    schedule?: CalibrationSchedule;
    ootActions?: OutOfToleranceAction[];
}
/**
 * Calibration Standard Model - Manages calibration standards and traceability
 */
export declare class CalibrationStandard extends Model {
    id: string;
    standardNumber: string;
    description: string;
    traceabilitySource: TraceabilitySource;
    traceabilityCertificateNumber?: string;
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    calibrationDate: Date;
    expirationDate: Date;
    uncertaintyValue?: number;
    uncertaintyUnit?: string;
    custodian?: string;
    location?: string;
    certificateFilePath?: string;
    specifications?: Record<string, any>;
    isActive: boolean;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Out-of-Tolerance Action Model - Tracks OOT handling and corrective actions
 */
export declare class OutOfToleranceAction extends Model {
    id: string;
    calibrationRecordId: string;
    action: OutOfToleranceAction;
    status: string;
    assignedTo: string;
    dueDate?: Date;
    rootCause?: string;
    correctiveAction?: string;
    preventiveAction?: string;
    impactAssessment?: string;
    affectedAssets?: string[];
    notificationsSent?: string[];
    completionDate?: Date;
    completedBy?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    calibrationRecord?: CalibrationRecord;
}
/**
 * Calibration Vendor Model - Manages external calibration service providers
 */
export declare class CalibrationVendor extends Model {
    id: string;
    code: string;
    name: string;
    contactInfo?: Record<string, any>;
    accreditationNumber?: string;
    accreditationExpiration?: Date;
    scopeOfAccreditation?: string;
    capabilities?: string[];
    turnaroundTimeDays?: number;
    averageCost?: number;
    qualityRating?: number;
    isActive: boolean;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
/**
 * Schedules a calibration for an asset
 *
 * @param data - Calibration schedule data
 * @param transaction - Optional database transaction
 * @returns Created calibration schedule
 *
 * @example
 * ```typescript
 * const schedule = await scheduleCalibration({
 *   assetId: 'asset-123',
 *   calibrationTypeId: 'cal-type-001',
 *   frequency: CalibrationFrequency.QUARTERLY,
 *   dueDate: new Date('2024-12-01'),
 *   assignedTechnicianId: 'tech-001',
 *   priority: 'high'
 * });
 * ```
 */
export declare function scheduleCalibration(data: CalibrationScheduleData, transaction?: Transaction): Promise<CalibrationSchedule>;
/**
 * Generates a unique calibration work order number
 *
 * @param transaction - Optional database transaction
 * @returns Work order number
 *
 * @example
 * ```typescript
 * const woNumber = await generateCalibrationWorkOrderNumber();
 * // Returns: "CAL-2024-001234"
 * ```
 */
export declare function generateCalibrationWorkOrderNumber(transaction?: Transaction): Promise<string>;
/**
 * Updates a calibration schedule
 *
 * @param scheduleId - Schedule identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await updateCalibrationSchedule('schedule-123', {
 *   dueDate: new Date('2024-12-15'),
 *   assignedTechnicianId: 'tech-002'
 * });
 * ```
 */
export declare function updateCalibrationSchedule(scheduleId: string, updates: Partial<CalibrationSchedule>, transaction?: Transaction): Promise<CalibrationSchedule>;
/**
 * Gets calibrations due within a specified timeframe
 *
 * @param daysAhead - Number of days to look ahead
 * @param filters - Optional filters (asset type, priority, etc.)
 * @returns List of due calibrations
 *
 * @example
 * ```typescript
 * const dueSoon = await getCalibrationsDue(30, { priority: 'critical' });
 * ```
 */
export declare function getCalibrationsDue(daysAhead?: number, filters?: {
    assetTypeId?: string;
    priority?: string;
    assignedTechnicianId?: string;
}): Promise<CalibrationSchedule[]>;
/**
 * Gets overdue calibrations
 *
 * @param filters - Optional filters
 * @returns List of overdue calibrations
 *
 * @example
 * ```typescript
 * const overdue = await getOverdueCalibrations();
 * ```
 */
export declare function getOverdueCalibrations(filters?: {
    assetTypeId?: string;
    priority?: string;
}): Promise<CalibrationSchedule[]>;
/**
 * Calculates optimal calibration frequency based on historical data
 *
 * @param assetId - Asset identifier
 * @param calibrationTypeId - Calibration type identifier
 * @returns Recommended frequency
 *
 * @example
 * ```typescript
 * const frequency = await calculateOptimalFrequency('asset-123', 'cal-type-001');
 * ```
 */
export declare function calculateOptimalFrequency(assetId: string, calibrationTypeId: string): Promise<{
    recommendedFrequency: CalibrationFrequency;
    confidence: number;
    rationale: string;
}>;
/**
 * Cancels a calibration schedule
 *
 * @param scheduleId - Schedule identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await cancelCalibrationSchedule('schedule-123', 'Asset retired');
 * ```
 */
export declare function cancelCalibrationSchedule(scheduleId: string, reason: string, transaction?: Transaction): Promise<CalibrationSchedule>;
/**
 * Defers a calibration schedule to a new date
 *
 * @param scheduleId - Schedule identifier
 * @param newDueDate - New due date
 * @param reason - Deferral reason
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await deferCalibration('schedule-123', new Date('2024-12-31'), 'Equipment unavailable');
 * ```
 */
export declare function deferCalibration(scheduleId: string, newDueDate: Date, reason: string, transaction?: Transaction): Promise<CalibrationSchedule>;
/**
 * Starts a calibration execution
 *
 * @param scheduleId - Schedule identifier
 * @param technicianId - Technician performing calibration
 * @param transaction - Optional database transaction
 * @returns Updated schedule
 *
 * @example
 * ```typescript
 * await startCalibrationExecution('schedule-123', 'tech-001');
 * ```
 */
export declare function startCalibrationExecution(scheduleId: string, technicianId: string, transaction?: Transaction): Promise<CalibrationSchedule>;
/**
 * Records calibration completion with results
 *
 * @param scheduleId - Schedule identifier
 * @param data - Calibration completion data
 * @param transaction - Optional database transaction
 * @returns Created calibration record
 *
 * @example
 * ```typescript
 * const record = await recordCalibrationCompletion('schedule-123', {
 *   performedBy: 'tech-001',
 *   performedDate: new Date(),
 *   measurements: [
 *     { parameter: 'voltage', reading: 5.01, unit: 'V', tolerance: 0.05, passed: true }
 *   ],
 *   passed: true,
 *   result: CalibrationResult.PASS
 * });
 * ```
 */
export declare function recordCalibrationCompletion(scheduleId: string, data: CalibrationCompletionData, transaction?: Transaction): Promise<CalibrationRecord>;
/**
 * Generates a unique calibration certificate number
 *
 * @param transaction - Optional database transaction
 * @returns Certificate number
 *
 * @example
 * ```typescript
 * const certNumber = await generateCalibrationCertificateNumber();
 * // Returns: "CERT-2024-001234"
 * ```
 */
export declare function generateCalibrationCertificateNumber(transaction?: Transaction): Promise<string>;
/**
 * Calculates next calibration due date based on frequency
 *
 * @param frequency - Calibration frequency
 * @param fromDate - Starting date (default: today)
 * @returns Next due date
 *
 * @example
 * ```typescript
 * const nextDue = calculateNextCalibrationDueDate(CalibrationFrequency.QUARTERLY);
 * ```
 */
export declare function calculateNextCalibrationDueDate(frequency: CalibrationFrequency, fromDate?: Date): Date;
/**
 * Records individual calibration measurements
 *
 * @param recordId - Calibration record identifier
 * @param measurements - Array of measurements
 * @param transaction - Optional database transaction
 * @returns Updated record
 *
 * @example
 * ```typescript
 * await recordCalibrationMeasurements('record-123', [
 *   { parameter: 'temp', reading: 25.1, unit: 'C', tolerance: 0.5, passed: true }
 * ]);
 * ```
 */
export declare function recordCalibrationMeasurements(recordId: string, measurements: CalibrationMeasurement[], transaction?: Transaction): Promise<CalibrationRecord>;
/**
 * Validates a measurement against its tolerance
 *
 * @param measurement - Calibration measurement
 * @returns Whether measurement passed tolerance check
 *
 * @example
 * ```typescript
 * const passed = validateMeasurementTolerance({
 *   parameter: 'voltage',
 *   reading: 5.01,
 *   nominalValue: 5.0,
 *   tolerance: 0.05,
 *   unit: 'V'
 * });
 * ```
 */
export declare function validateMeasurementTolerance(measurement: CalibrationMeasurement): boolean;
/**
 * Gets calibration history for an asset
 *
 * @param assetId - Asset identifier
 * @param limit - Maximum records to return
 * @returns Calibration records
 *
 * @example
 * ```typescript
 * const history = await getCalibrationHistory('asset-123', 10);
 * ```
 */
export declare function getCalibrationHistory(assetId: string, limit?: number): Promise<CalibrationRecord[]>;
/**
 * Approves a calibration record
 *
 * @param recordId - Record identifier
 * @param approvedBy - Approver user ID
 * @param transaction - Optional database transaction
 * @returns Updated record
 *
 * @example
 * ```typescript
 * await approveCalibrationRecord('record-123', 'supervisor-001');
 * ```
 */
export declare function approveCalibrationRecord(recordId: string, approvedBy: string, transaction?: Transaction): Promise<CalibrationRecord>;
/**
 * Detects out-of-tolerance conditions in calibration measurements
 *
 * @param recordId - Calibration record identifier
 * @returns OOT measurements
 *
 * @example
 * ```typescript
 * const ootMeasurements = await detectOutOfTolerance('record-123');
 * ```
 */
export declare function detectOutOfTolerance(recordId: string): Promise<CalibrationMeasurement[]>;
/**
 * Initiates out-of-tolerance handling workflow
 *
 * @param data - OOT handling data
 * @param transaction - Optional database transaction
 * @returns Created OOT action record
 *
 * @example
 * ```typescript
 * const ootAction = await handleOutOfTolerance({
 *   calibrationRecordId: 'record-123',
 *   action: OutOfToleranceAction.QUARANTINE,
 *   assignedTo: 'supervisor-001',
 *   rootCause: 'Environmental conditions outside spec',
 *   correctiveAction: 'Recalibrate in controlled environment'
 * });
 * ```
 */
export declare function handleOutOfTolerance(data: OutOfToleranceHandlingData, transaction?: Transaction): Promise<OutOfToleranceAction>;
/**
 * Quarantines an asset due to failed calibration
 *
 * @param assetId - Asset identifier
 * @param recordId - Calibration record identifier
 * @param reason - Quarantine reason
 * @param transaction - Optional database transaction
 * @returns OOT action record
 *
 * @example
 * ```typescript
 * await quarantineAsset('asset-123', 'record-456', 'Failed critical measurements');
 * ```
 */
export declare function quarantineAsset(assetId: string, recordId: string, reason: string, transaction?: Transaction): Promise<OutOfToleranceAction>;
/**
 * Completes an out-of-tolerance action
 *
 * @param ootActionId - OOT action identifier
 * @param completedBy - User completing action
 * @param notes - Completion notes
 * @param transaction - Optional database transaction
 * @returns Updated OOT action
 *
 * @example
 * ```typescript
 * await completeOutOfToleranceAction('oot-123', 'tech-001', 'Recalibrated successfully');
 * ```
 */
export declare function completeOutOfToleranceAction(ootActionId: string, completedBy: string, notes?: string, transaction?: Transaction): Promise<OutOfToleranceAction>;
/**
 * Registers a calibration standard
 *
 * @param data - Standard data
 * @param transaction - Optional database transaction
 * @returns Created standard
 *
 * @example
 * ```typescript
 * const standard = await registerCalibrationStandard({
 *   standardNumber: 'STD-2024-001',
 *   description: 'Voltage calibration standard',
 *   traceabilitySource: TraceabilitySource.NIST,
 *   calibrationDate: new Date('2024-01-01'),
 *   expirationDate: new Date('2025-01-01'),
 *   uncertaintyValue: 0.001,
 *   uncertaintyUnit: 'V'
 * });
 * ```
 */
export declare function registerCalibrationStandard(data: CalibrationStandardData, transaction?: Transaction): Promise<CalibrationStandard>;
/**
 * Gets calibration standards expiring within a timeframe
 *
 * @param daysAhead - Number of days to look ahead
 * @returns Expiring standards
 *
 * @example
 * ```typescript
 * const expiring = await getExpiringCalibrationStandards(30);
 * ```
 */
export declare function getExpiringCalibrationStandards(daysAhead?: number): Promise<CalibrationStandard[]>;
/**
 * Tracks calibration standard traceability chain
 *
 * @param standardId - Standard identifier
 * @returns Traceability information
 *
 * @example
 * ```typescript
 * const traceability = await trackStandardTraceability('std-123');
 * ```
 */
export declare function trackStandardTraceability(standardId: string): Promise<{
    standard: CalibrationStandard;
    traceabilityChain: Array<{
        level: number;
        source: string;
        certificateNumber?: string;
        date: Date;
    }>;
}>;
/**
 * Updates calibration standard
 *
 * @param standardId - Standard identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated standard
 *
 * @example
 * ```typescript
 * await updateCalibrationStandard('std-123', {
 *   location: 'Lab-A-Cabinet-3',
 *   custodian: 'user-001'
 * });
 * ```
 */
export declare function updateCalibrationStandard(standardId: string, updates: Partial<CalibrationStandard>, transaction?: Transaction): Promise<CalibrationStandard>;
/**
 * Retires a calibration standard
 *
 * @param standardId - Standard identifier
 * @param reason - Retirement reason
 * @param transaction - Optional database transaction
 * @returns Updated standard
 *
 * @example
 * ```typescript
 * await retireCalibrationStandard('std-123', 'Expired and replaced');
 * ```
 */
export declare function retireCalibrationStandard(standardId: string, reason: string, transaction?: Transaction): Promise<CalibrationStandard>;
/**
 * Registers a calibration vendor
 *
 * @param vendorData - Vendor information
 * @param transaction - Optional database transaction
 * @returns Created vendor
 *
 * @example
 * ```typescript
 * const vendor = await registerCalibrationVendor({
 *   code: 'VENDOR-001',
 *   name: 'Precision Calibration Services',
 *   accreditationNumber: 'ISO17025-12345',
 *   capabilities: ['electrical', 'mechanical', 'thermal']
 * });
 * ```
 */
export declare function registerCalibrationVendor(vendorData: {
    code: string;
    name: string;
    contactInfo?: Record<string, any>;
    accreditationNumber?: string;
    accreditationExpiration?: Date;
    capabilities?: string[];
    turnaroundTimeDays?: number;
}, transaction?: Transaction): Promise<CalibrationVendor>;
/**
 * Evaluates calibration vendor performance
 *
 * @param vendorId - Vendor identifier
 * @param startDate - Evaluation period start
 * @param endDate - Evaluation period end
 * @returns Performance metrics
 *
 * @example
 * ```typescript
 * const metrics = await evaluateVendorPerformance(
 *   'vendor-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function evaluateVendorPerformance(vendorId: string, startDate: Date, endDate: Date): Promise<VendorPerformanceMetrics>;
/**
 * Gets top performing calibration vendors
 *
 * @param limit - Number of vendors to return
 * @returns Top vendors by quality score
 *
 * @example
 * ```typescript
 * const topVendors = await getTopCalibrationVendors(5);
 * ```
 */
export declare function getTopCalibrationVendors(limit?: number): Promise<CalibrationVendor[]>;
/**
 * Tracks calibration costs for an asset
 *
 * @param assetId - Asset identifier
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Cost summary
 *
 * @example
 * ```typescript
 * const costs = await trackCalibrationCosts(
 *   'asset-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function trackCalibrationCosts(assetId: string, startDate: Date, endDate: Date): Promise<{
    totalCost: number;
    averageCost: number;
    calibrationCount: number;
    costByType: Record<string, number>;
}>;
/**
 * Generates calibration cost forecast
 *
 * @param assetId - Asset identifier
 * @param forecastMonths - Number of months to forecast
 * @returns Cost forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastCalibrationCosts('asset-123', 12);
 * ```
 */
export declare function forecastCalibrationCosts(assetId: string, forecastMonths?: number): Promise<{
    forecastedTotalCost: number;
    monthlyBreakdown: Array<{
        month: string;
        cost: number;
    }>;
}>;
/**
 * Generates calibration certificate
 *
 * @param recordId - Calibration record identifier
 * @returns Certificate data
 *
 * @example
 * ```typescript
 * const certificate = await generateCalibrationCertificate('record-123');
 * ```
 */
export declare function generateCalibrationCertificate(recordId: string): Promise<{
    certificateNumber: string;
    assetId: string;
    calibrationType: string;
    performedDate: Date;
    performedBy: string;
    result: CalibrationResult;
    measurements: CalibrationMeasurement[];
    environmentalConditions?: EnvironmentalConditions;
    standardsUsed?: string[];
    nextDueDate?: Date;
    issuedDate: Date;
}>;
/**
 * Generates calibration compliance report
 *
 * @param startDate - Report period start
 * @param endDate - Report period end
 * @param filters - Optional filters
 * @returns Compliance report data
 *
 * @example
 * ```typescript
 * const report = await generateCalibrationComplianceReport(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function generateCalibrationComplianceReport(startDate: Date, endDate: Date, filters?: {
    assetTypeId?: string;
    priority?: string;
}): Promise<{
    totalAssets: number;
    compliantAssets: number;
    nonCompliantAssets: number;
    complianceRate: number;
    overdueCalibrations: number;
    upcomingCalibrations: number;
    passRate: number;
}>;
/**
 * Gets calibration statistics for a date range
 *
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Calibration statistics
 *
 * @example
 * ```typescript
 * const stats = await getCalibrationStatistics(
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export declare function getCalibrationStatistics(startDate: Date, endDate: Date): Promise<{
    totalCalibrations: number;
    passed: number;
    failed: number;
    passRate: number;
    averageDuration: number;
    totalCost: number;
    averageCost: number;
    byType: Record<string, number>;
    byMonth: Record<string, number>;
}>;
declare const _default: {
    CalibrationType: typeof CalibrationType;
    CalibrationSchedule: typeof CalibrationSchedule;
    CalibrationRecord: typeof CalibrationRecord;
    CalibrationStandard: typeof CalibrationStandard;
    OutOfToleranceAction: typeof import("./asset-calibration-commands").OutOfToleranceAction;
    CalibrationVendor: typeof CalibrationVendor;
    scheduleCalibration: typeof scheduleCalibration;
    updateCalibrationSchedule: typeof updateCalibrationSchedule;
    getCalibrationsDue: typeof getCalibrationsDue;
    getOverdueCalibrations: typeof getOverdueCalibrations;
    calculateOptimalFrequency: typeof calculateOptimalFrequency;
    cancelCalibrationSchedule: typeof cancelCalibrationSchedule;
    deferCalibration: typeof deferCalibration;
    startCalibrationExecution: typeof startCalibrationExecution;
    recordCalibrationCompletion: typeof recordCalibrationCompletion;
    recordCalibrationMeasurements: typeof recordCalibrationMeasurements;
    validateMeasurementTolerance: typeof validateMeasurementTolerance;
    getCalibrationHistory: typeof getCalibrationHistory;
    approveCalibrationRecord: typeof approveCalibrationRecord;
    detectOutOfTolerance: typeof detectOutOfTolerance;
    handleOutOfTolerance: typeof handleOutOfTolerance;
    quarantineAsset: typeof quarantineAsset;
    completeOutOfToleranceAction: typeof completeOutOfToleranceAction;
    registerCalibrationStandard: typeof registerCalibrationStandard;
    getExpiringCalibrationStandards: typeof getExpiringCalibrationStandards;
    trackStandardTraceability: typeof trackStandardTraceability;
    updateCalibrationStandard: typeof updateCalibrationStandard;
    retireCalibrationStandard: typeof retireCalibrationStandard;
    registerCalibrationVendor: typeof registerCalibrationVendor;
    evaluateVendorPerformance: typeof evaluateVendorPerformance;
    getTopCalibrationVendors: typeof getTopCalibrationVendors;
    trackCalibrationCosts: typeof trackCalibrationCosts;
    forecastCalibrationCosts: typeof forecastCalibrationCosts;
    generateCalibrationCertificate: typeof generateCalibrationCertificate;
    generateCalibrationComplianceReport: typeof generateCalibrationComplianceReport;
    getCalibrationStatistics: typeof getCalibrationStatistics;
    generateCalibrationWorkOrderNumber: typeof generateCalibrationWorkOrderNumber;
    generateCalibrationCertificateNumber: typeof generateCalibrationCertificateNumber;
    calculateNextCalibrationDueDate: typeof calculateNextCalibrationDueDate;
};
export default _default;
//# sourceMappingURL=asset-calibration-commands.d.ts.map