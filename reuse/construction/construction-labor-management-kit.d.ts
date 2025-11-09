/**
 * CONSTRUCTION LABOR MANAGEMENT KIT
 *
 * Comprehensive labor planning and workforce management system for construction projects.
 * Provides 40 specialized functions covering:
 * - Labor planning and forecasting
 * - Crew assignment and composition
 * - Work scheduling and shift management
 * - Time tracking and timesheet processing
 * - Timesheet approval workflows
 * - Certified payroll reporting
 * - Prevailing wage compliance (Davis-Bacon Act)
 * - Union labor compliance and tracking
 * - Apprenticeship program management
 * - Labor productivity analysis
 * - Labor cost tracking and forecasting
 * - Worker certification and safety compliance
 * - NestJS injectable services with DI
 * - Swagger API documentation
 * - Full validation and error handling
 *
 * @module ConstructionLaborManagementKit
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.1.0
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires @faker-js/faker ^9.4.0
 * @requires Node.js 18+
 * @requires TypeScript 5.x
 *
 * @example
 * ```typescript
 * import {
 *   createLaborPlan,
 *   assignCrewToProject,
 *   recordTimeEntry,
 *   approveCertifiedPayroll,
 *   trackLaborProductivity
 * } from './construction-labor-management-kit';
 *
 * // Create labor plan
 * const plan = await createLaborPlan({
 *   projectId: 'proj-123',
 *   startDate: new Date(),
 *   totalLaborHours: 5000,
 *   craftMix: { carpenter: 40, electrician: 30, laborer: 30 }
 * });
 *
 * // Assign crew
 * const crew = await assignCrewToProject('proj-123', {
 *   crewName: 'Framing Crew A',
 *   workers: ['worker-1', 'worker-2', 'worker-3']
 * });
 * ```
 */
import { LaborPlan } from './models/labor-plan.model';
import { Timesheet } from './models/timesheet.model';
import { ConstructionWorker } from './models/construction-worker.model';
import { LaborCraft } from './types/labor.types';
import { CreateLaborPlanDto } from './dto/create-labor-plan.dto';
import { CreateCrewAssignmentDto } from './dto/create-crew-assignment.dto';
import { RecordTimeEntryDto } from './dto/record-time-entry.dto';
import { SubmitTimesheetDto } from './dto/submit-timesheet.dto';
import { ApproveTimesheetDto } from './dto/approve-timesheet.dto';
import { CreateWorkerDto } from './dto/create-worker.dto';
/**
 * Creates a comprehensive labor plan for a construction project
 *
 * @param planData - Labor plan creation data
 * @param userId - User creating the plan
 * @returns Created labor plan
 *
 * @example
 * ```typescript
 * const plan = await createLaborPlan({
 *   projectId: 'proj-123',
 *   planName: 'Q1 2025 Labor Plan',
 *   startDate: new Date('2025-01-01'),
 *   endDate: new Date('2025-03-31'),
 *   totalLaborHours: 5000,
 *   budgetedLaborCost: 250000,
 *   craftMix: { carpenter: 40, electrician: 30, laborer: 30 }
 * }, 'user-123');
 * ```
 */
export declare function createLaborPlan(planData: Omit<ILaborPlan, 'id' | 'actualLaborCost' | 'createdAt' | 'updatedAt'>, userId: string): Promise<ILaborPlan>;
/**
 * Forecasts labor requirements based on project schedule
 *
 * @param projectId - Project identifier
 * @param scheduleData - Project schedule data
 * @returns Labor forecast by period
 *
 * @example
 * ```typescript
 * const forecast = await forecastLaborRequirements('proj-123', {
 *   totalDuration: 90,
 *   phases: ['foundation', 'framing', 'finishing']
 * });
 * ```
 */
export declare function forecastLaborRequirements(projectId: string, scheduleData: {
    totalDuration: number;
    phases: string[];
    phaseHours?: Record<string, number>;
}): Promise<Array<{
    period: string;
    craft: LaborCraft;
    requiredHeadcount: number;
    estimatedHours: number;
    estimatedCost: number;
}>>;
/**
 * Calculates optimal crew size for a task
 *
 * @param taskData - Task information
 * @returns Recommended crew composition
 *
 * @example
 * ```typescript
 * const crew = await calculateOptimalCrewSize({
 *   taskType: 'framing',
 *   estimatedHours: 400,
 *   targetDuration: 5
 * });
 * ```
 */
export declare function calculateOptimalCrewSize(taskData: {
    taskType: string;
    estimatedHours: number;
    targetDuration: number;
}): Promise<{
    totalWorkers: number;
    composition: Record<LaborCraft, number>;
    productivity: number;
}>;
/**
 * Generates labor loading chart data
 *
 * @param projectId - Project identifier
 * @param startDate - Chart start date
 * @param endDate - Chart end date
 * @returns Labor loading by period
 *
 * @example
 * ```typescript
 * const loadingChart = await generateLaborLoadingChart('proj-123', startDate, endDate);
 * ```
 */
export declare function generateLaborLoadingChart(projectId: string, startDate: Date, endDate: Date): Promise<Array<{
    date: Date;
    plannedHeadcount: number;
    actualHeadcount: number;
    plannedHours: number;
    actualHours: number;
}>>;
/**
 * Assigns a crew to a project
 *
 * @param crewData - Crew assignment data
 * @returns Created crew assignment
 *
 * @example
 * ```typescript
 * const crew = await assignCrewToProject({
 *   projectId: 'proj-123',
 *   crewName: 'Framing Crew A',
 *   foremanId: 'worker-1',
 *   workers: ['worker-2', 'worker-3', 'worker-4'],
 *   craft: LaborCraft.CARPENTER,
 *   shiftType: ShiftType.DAY,
 *   startDate: new Date()
 * });
 * ```
 */
export declare function assignCrewToProject(crewData: Omit<CrewAssignment, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>): Promise<CrewAssignment>;
/**
 * Updates crew composition
 *
 * @param crewId - Crew assignment identifier
 * @param updates - Crew updates
 * @returns Updated crew assignment
 *
 * @example
 * ```typescript
 * await updateCrewComposition('crew-123', {
 *   workers: ['worker-1', 'worker-2', 'worker-5']
 * });
 * ```
 */
export declare function updateCrewComposition(crewId: string, updates: {
    workers?: string[];
    foremanId?: string;
}): Promise<CrewAssignment>;
/**
 * Gets available workers for a craft
 *
 * @param craft - Labor craft
 * @param date - Availability date
 * @returns Available workers
 *
 * @example
 * ```typescript
 * const available = await getAvailableWorkers(LaborCraft.ELECTRICIAN, new Date());
 * ```
 */
export declare function getAvailableWorkers(craft: LaborCraft, date: Date): Promise<Array<{
    workerId: string;
    name: string;
    craft: LaborCraft;
    hourlyRate: number;
    certifications: string[];
}>>;
/**
 * Rotates crew members
 *
 * @param crewId - Crew identifier
 * @param rotationData - Rotation configuration
 * @returns Updated crew assignment
 *
 * @example
 * ```typescript
 * await rotateCrewMembers('crew-123', {
 *   removeWorkers: ['worker-1'],
 *   addWorkers: ['worker-5']
 * });
 * ```
 */
export declare function rotateCrewMembers(crewId: string, rotationData: {
    removeWorkers: string[];
    addWorkers: string[];
}): Promise<CrewAssignment>;
/**
 * Records a time entry for a worker
 *
 * @param entryData - Time entry data
 * @returns Created time entry
 *
 * @example
 * ```typescript
 * const entry = await recordTimeEntry({
 *   workerId: 'worker-123',
 *   projectId: 'proj-456',
 *   date: new Date(),
 *   clockIn: new Date('2025-01-08T07:00:00'),
 *   clockOut: new Date('2025-01-08T15:30:00'),
 *   regularHours: 8,
 *   overtimeHours: 0.5,
 *   costCode: 'CC-100'
 * });
 * ```
 */
export declare function recordTimeEntry(entryData: Omit<TimeEntry, 'id'>): Promise<TimeEntry>;
/**
 * Calculates hours from clock in/out times
 *
 * @param clockIn - Clock in time
 * @param clockOut - Clock out time
 * @param breakMinutes - Break duration in minutes
 * @returns Calculated hours breakdown
 *
 * @example
 * ```typescript
 * const hours = calculateHoursFromClockTimes(
 *   new Date('2025-01-08T07:00:00'),
 *   new Date('2025-01-08T16:30:00'),
 *   30
 * );
 * ```
 */
export declare function calculateHoursFromClockTimes(clockIn: Date, clockOut: Date, breakMinutes?: number): {
    totalHours: number;
    regularHours: number;
    overtimeHours: number;
    doubleTimeHours: number;
};
/**
 * Submits a timesheet for approval
 *
 * @param timesheetData - Timesheet submission data
 * @returns Created timesheet
 *
 * @example
 * ```typescript
 * const timesheet = await submitTimesheet({
 *   workerId: 'worker-123',
 *   projectId: 'proj-456',
 *   weekEnding: new Date(),
 *   dailyEntries: [...]
 * });
 * ```
 */
export declare function submitTimesheet(timesheetData: {
    workerId: string;
    projectId: string;
    weekEnding: Date;
    dailyEntries: Array<any>;
    craft: LaborCraft;
}): Promise<Timesheet>;
/**
 * Approves a timesheet
 *
 * @param timesheetId - Timesheet identifier
 * @param approverId - Approver user ID
 * @returns Updated timesheet
 *
 * @example
 * ```typescript
 * await approveTimesheet('timesheet-123', 'manager-456');
 * ```
 */
export declare function approveTimesheet(timesheetId: string, approverId: string): Promise<Timesheet>;
/**
 * Rejects a timesheet with reason
 *
 * @param timesheetId - Timesheet identifier
 * @param rejectionReason - Reason for rejection
 * @param rejectedBy - Rejector user ID
 * @returns Updated timesheet
 *
 * @example
 * ```typescript
 * await rejectTimesheet('timesheet-123', 'Missing cost codes for Friday', 'manager-456');
 * ```
 */
export declare function rejectTimesheet(timesheetId: string, rejectionReason: string, rejectedBy: string): Promise<Timesheet>;
/**
 * Gets pending timesheets for approval
 *
 * @param projectId - Project identifier
 * @returns Pending timesheets
 *
 * @example
 * ```typescript
 * const pending = await getPendingTimesheets('proj-123');
 * ```
 */
export declare function getPendingTimesheets(projectId: string): Promise<Timesheet[]>;
/**
 * Generates certified payroll report for Davis-Bacon compliance
 *
 * @param projectId - Project identifier
 * @param weekEnding - Week ending date
 * @returns Certified payroll report
 *
 * @example
 * ```typescript
 * const report = await generateCertifiedPayrollReport('proj-123', new Date());
 * ```
 */
export declare function generateCertifiedPayrollReport(projectId: string, weekEnding: Date): Promise<CertifiedPayrollReport>;
/**
 * Certifies payroll report for submission
 *
 * @param reportId - Report identifier
 * @param certifiedBy - Certifier user ID
 * @returns Certified report
 *
 * @example
 * ```typescript
 * await certifyPayrollReport('report-123', 'admin-456');
 * ```
 */
export declare function certifyPayrollReport(reportId: string, certifiedBy: string): Promise<CertifiedPayrollReport>;
/**
 * Submits certified payroll to government agency
 *
 * @param reportId - Report identifier
 * @returns Submission confirmation
 *
 * @example
 * ```typescript
 * await submitCertifiedPayroll('report-123');
 * ```
 */
export declare function submitCertifiedPayroll(reportId: string): Promise<{
    reportId: string;
    submittedAt: Date;
    confirmationNumber: string;
}>;
/**
 * Validates prevailing wage compliance
 *
 * @param projectId - Project identifier
 * @param weekEnding - Week ending date
 * @returns Compliance validation result
 *
 * @example
 * ```typescript
 * const validation = await validatePrevailingWageCompliance('proj-123', new Date());
 * ```
 */
export declare function validatePrevailingWageCompliance(projectId: string, weekEnding: Date): Promise<{
    isCompliant: boolean;
    violations: Array<{
        workerId: string;
        craft: LaborCraft;
        actualRate: number;
        requiredRate: number;
        shortage: number;
    }>;
    totalShortage: number;
}>;
/**
 * Gets prevailing wage rate for craft and location
 *
 * @param craft - Labor craft
 * @param projectId - Project identifier
 * @returns Prevailing wage rate
 *
 * @example
 * ```typescript
 * const rate = await getPrevailingWageRate(LaborCraft.ELECTRICIAN, 'proj-123');
 * ```
 */
export declare function getPrevailingWageRate(craft: LaborCraft, projectId: string): Promise<number>;
/**
 * Calculates fringe benefit requirements
 *
 * @param craft - Labor craft
 * @param totalHours - Total hours worked
 * @returns Fringe benefit calculation
 *
 * @example
 * ```typescript
 * const benefits = calculateFringeBenefits(LaborCraft.CARPENTER, 160);
 * ```
 */
export declare function calculateFringeBenefits(craft: LaborCraft, totalHours: number): {
    healthWelfare: number;
    pension: number;
    vacation: number;
    training: number;
    totalFringe: number;
};
/**
 * Tracks labor productivity for a craft
 *
 * @param projectId - Project identifier
 * @param craft - Labor craft
 * @param period - Reporting period
 * @returns Productivity metrics
 *
 * @example
 * ```typescript
 * const metrics = await trackLaborProductivity('proj-123', LaborCraft.CARPENTER, '2025-01');
 * ```
 */
export declare function trackLaborProductivity(projectId: string, craft: LaborCraft, period: string): Promise<ProductivityMetrics>;
/**
 * Calculates labor efficiency ratio
 *
 * @param actualHours - Actual hours worked
 * @param budgetedHours - Budgeted hours
 * @returns Efficiency ratio and rating
 *
 * @example
 * ```typescript
 * const efficiency = calculateLaborEfficiency(800, 1000);
 * ```
 */
export declare function calculateLaborEfficiency(actualHours: number, budgetedHours: number): {
    efficiencyRatio: number;
    varianceHours: number;
    variancePercentage: number;
    rating: 'excellent' | 'good' | 'acceptable' | 'poor';
};
/**
 * Generates productivity trends report
 *
 * @param projectId - Project identifier
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Productivity trend data
 *
 * @example
 * ```typescript
 * const trends = await generateProductivityTrends('proj-123', startDate, endDate);
 * ```
 */
export declare function generateProductivityTrends(projectId: string, startDate: Date, endDate: Date): Promise<Array<{
    week: string;
    craft: LaborCraft;
    productivityRate: number;
    trend: 'improving' | 'stable' | 'declining';
}>>;
/**
 * Tracks labor costs by cost code
 *
 * @param projectId - Project identifier
 * @param period - Reporting period
 * @returns Labor cost breakdown
 *
 * @example
 * ```typescript
 * const costs = await trackLaborCostsByCode('proj-123', '2025-01');
 * ```
 */
export declare function trackLaborCostsByCode(projectId: string, period: string): Promise<Array<{
    costCode: string;
    description: string;
    budgetedHours: number;
    actualHours: number;
    budgetedCost: number;
    actualCost: number;
    variance: number;
    variancePercentage: number;
}>>;
/**
 * Calculates labor burden and overhead
 *
 * @param directLaborCost - Direct labor cost
 * @param burdenRate - Burden rate percentage
 * @returns Total burdened labor cost
 *
 * @example
 * ```typescript
 * const burdened = calculateLaborBurden(100000, 0.35);
 * ```
 */
export declare function calculateLaborBurden(directLaborCost: number, burdenRate?: number): {
    directCost: number;
    burdenCost: number;
    totalCost: number;
    burdenPercentage: number;
};
/**
 * Forecasts labor costs to completion
 *
 * @param projectId - Project identifier
 * @returns Cost forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastLaborCostToCompletion('proj-123');
 * ```
 */
export declare function forecastLaborCostToCompletion(projectId: string): Promise<{
    budgetedCost: number;
    actualCostToDate: number;
    estimateToComplete: number;
    estimateAtCompletion: number;
    variance: number;
    variancePercentage: number;
}>;
/**
 * Validates union compliance requirements
 *
 * @param projectId - Project identifier
 * @param date - Compliance check date
 * @returns Compliance validation result
 *
 * @example
 * ```typescript
 * const compliance = await validateUnionCompliance('proj-123', new Date());
 * ```
 */
export declare function validateUnionCompliance(projectId: string, date: Date): Promise<UnionComplianceRecord>;
/**
 * Tracks union work hours and contributions
 *
 * @param projectId - Project identifier
 * @param unionLocal - Union local number
 * @param period - Reporting period
 * @returns Union hours and contributions
 *
 * @example
 * ```typescript
 * const report = await trackUnionWorkHours('proj-123', 'Local 123', '2025-01');
 * ```
 */
export declare function trackUnionWorkHours(projectId: string, unionLocal: string, period: string): Promise<{
    unionLocal: string;
    totalHours: number;
    totalWorkers: number;
    pensionContributions: number;
    healthWelfareContributions: number;
    trainingContributions: number;
    totalContributions: number;
}>;
/**
 * Generates union labor report
 *
 * @param projectId - Project identifier
 * @param period - Reporting period
 * @returns Union labor summary
 *
 * @example
 * ```typescript
 * const report = await generateUnionLaborReport('proj-123', '2025-Q1');
 * ```
 */
export declare function generateUnionLaborReport(projectId: string, period: string): Promise<{
    period: string;
    unionLocals: Array<{
        local: string;
        craft: LaborCraft;
        workers: number;
        hours: number;
        wages: number;
        contributions: number;
    }>;
    totalUnionWorkers: number;
    totalUnionHours: number;
    totalUnionWages: number;
    totalContributions: number;
}>;
/**
 * Enrolls worker in apprenticeship program
 *
 * @param workerId - Worker identifier
 * @param programData - Apprenticeship program data
 * @returns Updated worker record
 *
 * @example
 * ```typescript
 * await enrollInApprenticeship('worker-123', {
 *   craft: LaborCraft.ELECTRICIAN,
 *   year: 1,
 *   sponsoringUnion: 'Local 456'
 * });
 * ```
 */
export declare function enrollInApprenticeship(workerId: string, programData: {
    craft: LaborCraft;
    year: number;
    sponsoringUnion: string;
}): Promise<ConstructionWorker>;
/**
 * Advances apprentice to next year
 *
 * @param workerId - Worker identifier
 * @returns Updated worker record
 *
 * @example
 * ```typescript
 * await advanceApprenticeYear('worker-123');
 * ```
 */
export declare function advanceApprenticeYear(workerId: string): Promise<ConstructionWorker>;
/**
 * Tracks apprentice training hours
 *
 * @param workerId - Worker identifier
 * @param trainingHours - Training hours completed
 * @returns Training record
 *
 * @example
 * ```typescript
 * await trackApprenticeTraining('worker-123', {
 *   courseType: 'Electrical Theory',
 *   hours: 40,
 *   completedDate: new Date()
 * });
 * ```
 */
export declare function trackApprenticeTraining(workerId: string, trainingData: {
    courseType: string;
    hours: number;
    completedDate: Date;
}): Promise<{
    workerId: string;
    totalTrainingHours: number;
    requiredHours: number;
    percentComplete: number;
}>;
/**
 * Adds certification to worker profile
 *
 * @param workerId - Worker identifier
 * @param certification - Certification data
 * @returns Updated worker record
 *
 * @example
 * ```typescript
 * await addWorkerCertification('worker-123', {
 *   name: 'OSHA 30',
 *   issuedDate: new Date(),
 *   expirationDate: new Date('2028-01-01')
 * });
 * ```
 */
export declare function addWorkerCertification(workerId: string, certification: {
    name: string;
    issuedDate: Date;
    expirationDate?: Date;
    issuingOrganization: string;
}): Promise<ConstructionWorker>;
/**
 * Validates worker certifications are current
 *
 * @param workerId - Worker identifier
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const validation = await validateWorkerCertifications('worker-123');
 * ```
 */
export declare function validateWorkerCertifications(workerId: string): Promise<{
    isValid: boolean;
    expiredCertifications: string[];
    expiringWithin30Days: string[];
}>;
/**
 * Gets workers with expiring certifications
 *
 * @param projectId - Project identifier
 * @param daysAhead - Days to look ahead
 * @returns Workers with expiring certifications
 *
 * @example
 * ```typescript
 * const expiring = await getWorkersWithExpiringCertifications('proj-123', 30);
 * ```
 */
export declare function getWorkersWithExpiringCertifications(projectId: string, daysAhead?: number): Promise<Array<{
    workerId: string;
    name: string;
    certification: string;
    expirationDate: Date;
    daysUntilExpiration: number;
}>>;
/**
 * Labor Management Controller
 * Provides RESTful API endpoints for construction labor management
 */
export declare class LaborManagementController {
    createPlan(dto: CreateLaborPlanDto): Promise<ILaborPlan>;
    assignCrew(dto: CreateCrewAssignmentDto): Promise<CrewAssignment>;
    recordTime(dto: RecordTimeEntryDto): Promise<TimeEntry>;
    submitSheet(dto: SubmitTimesheetDto): Promise<Timesheet>;
    approve(id: string, dto: ApproveTimesheetDto): Promise<Timesheet>;
    getPending(projectId: string): Promise<Timesheet[]>;
    generatePayroll(projectId: string, weekEnding: string): Promise<CertifiedPayrollReport>;
    getProductivity(projectId: string, craft: LaborCraft, period: string): Promise<ProductivityMetrics>;
    createWorker(dto: CreateWorkerDto): Promise<any>;
    checkUnionCompliance(projectId: string): Promise<UnionComplianceRecord>;
    checkPrevailingWage(projectId: string, weekEnding: string): Promise<{
        isCompliant: boolean;
        violations: Array<{
            workerId: string;
            craft: LaborCraft;
            actualRate: number;
            requiredRate: number;
            shortage: number;
        }>;
        totalShortage: number;
    }>;
}
declare const _default: {
    createLaborPlan: typeof createLaborPlan;
    forecastLaborRequirements: typeof forecastLaborRequirements;
    calculateOptimalCrewSize: typeof calculateOptimalCrewSize;
    generateLaborLoadingChart: typeof generateLaborLoadingChart;
    assignCrewToProject: typeof assignCrewToProject;
    updateCrewComposition: typeof updateCrewComposition;
    getAvailableWorkers: typeof getAvailableWorkers;
    rotateCrewMembers: typeof rotateCrewMembers;
    recordTimeEntry: typeof recordTimeEntry;
    calculateHoursFromClockTimes: typeof calculateHoursFromClockTimes;
    submitTimesheet: typeof submitTimesheet;
    approveTimesheet: typeof approveTimesheet;
    rejectTimesheet: typeof rejectTimesheet;
    getPendingTimesheets: typeof getPendingTimesheets;
    generateCertifiedPayrollReport: typeof generateCertifiedPayrollReport;
    certifyPayrollReport: typeof certifyPayrollReport;
    submitCertifiedPayroll: typeof submitCertifiedPayroll;
    validatePrevailingWageCompliance: typeof validatePrevailingWageCompliance;
    getPrevailingWageRate: typeof getPrevailingWageRate;
    calculateFringeBenefits: typeof calculateFringeBenefits;
    trackLaborProductivity: typeof trackLaborProductivity;
    calculateLaborEfficiency: typeof calculateLaborEfficiency;
    generateProductivityTrends: typeof generateProductivityTrends;
    trackLaborCostsByCode: typeof trackLaborCostsByCode;
    calculateLaborBurden: typeof calculateLaborBurden;
    forecastLaborCostToCompletion: typeof forecastLaborCostToCompletion;
    validateUnionCompliance: typeof validateUnionCompliance;
    trackUnionWorkHours: typeof trackUnionWorkHours;
    generateUnionLaborReport: typeof generateUnionLaborReport;
    enrollInApprenticeship: typeof enrollInApprenticeship;
    advanceApprenticeYear: typeof advanceApprenticeYear;
    trackApprenticeTraining: typeof trackApprenticeTraining;
    addWorkerCertification: typeof addWorkerCertification;
    validateWorkerCertifications: typeof validateWorkerCertifications;
    getWorkersWithExpiringCertifications: typeof getWorkersWithExpiringCertifications;
    LaborPlan: typeof LaborPlan;
    Timesheet: typeof Timesheet;
    ConstructionWorker: typeof ConstructionWorker;
    LaborManagementController: typeof LaborManagementController;
};
export default _default;
//# sourceMappingURL=construction-labor-management-kit.d.ts.map