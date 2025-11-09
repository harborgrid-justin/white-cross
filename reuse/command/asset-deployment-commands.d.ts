/**
 * ASSET DEPLOYMENT COMMAND FUNCTIONS
 *
 * Enterprise-grade asset deployment and commissioning management system competing with
 * Oracle JD Edwards EnterpriseOne. Provides comprehensive functionality for:
 * - Deployment workflow orchestration
 * - Installation tracking and management
 * - Site preparation validation
 * - Resource allocation and scheduling
 * - Configuration setup and testing
 * - Commissioning procedures
 * - Acceptance testing workflows
 * - Go-live procedures and cutover
 * - Deployment rollback capabilities
 * - Post-deployment verification
 *
 * @module AssetDeploymentCommands
 * @version 1.0.0
 * @requires @nestjs/common ^11.1.8
 * @requires @nestjs/swagger ^8.0.7
 * @requires @nestjs/sequelize ^10.0.1
 * @requires sequelize ^6.37.5
 * @requires sequelize-typescript ^2.1.6
 * @requires class-validator ^0.14.1
 * @requires class-transformer ^0.5.1
 *
 * @example
 * ```typescript
 * import {
 *   createDeploymentPlan,
 *   scheduleDeployment,
 *   allocateDeploymentResources,
 *   executeDeployment,
 *   DeploymentPlan,
 *   DeploymentStatus
 * } from './asset-deployment-commands';
 *
 * // Create deployment plan
 * const plan = await createDeploymentPlan({
 *   assetId: 'asset-123',
 *   siteId: 'site-456',
 *   plannedDate: new Date('2024-06-15'),
 *   deploymentType: DeploymentType.NEW_INSTALLATION,
 *   requiresSitePrep: true,
 *   estimatedDuration: 480 // minutes
 * });
 *
 * // Schedule deployment with resources
 * await scheduleDeployment(plan.id, {
 *   technicianIds: ['tech-1', 'tech-2'],
 *   equipmentIds: ['crane-1', 'tools-set-5']
 * });
 * ```
 */
import { Model } from 'sequelize-typescript';
import { Transaction, FindOptions } from 'sequelize';
/**
 * Deployment status
 */
export declare enum DeploymentStatus {
    PLANNED = "planned",
    SCHEDULED = "scheduled",
    SITE_PREP_IN_PROGRESS = "site_prep_in_progress",
    READY_FOR_DEPLOYMENT = "ready_for_deployment",
    IN_PROGRESS = "in_progress",
    TESTING = "testing",
    COMPLETED = "completed",
    ON_HOLD = "on_hold",
    CANCELLED = "cancelled",
    FAILED = "failed",
    ROLLED_BACK = "rolled_back"
}
/**
 * Deployment type
 */
export declare enum DeploymentType {
    NEW_INSTALLATION = "new_installation",
    REPLACEMENT = "replacement",
    UPGRADE = "upgrade",
    RELOCATION = "relocation",
    EXPANSION = "expansion",
    TEMPORARY = "temporary"
}
/**
 * Site preparation status
 */
export declare enum SitePrepStatus {
    NOT_REQUIRED = "not_required",
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed"
}
/**
 * Installation phase
 */
export declare enum InstallationPhase {
    PRE_INSTALLATION = "pre_installation",
    PHYSICAL_INSTALLATION = "physical_installation",
    ELECTRICAL_INSTALLATION = "electrical_installation",
    NETWORK_INSTALLATION = "network_installation",
    CONFIGURATION = "configuration",
    CALIBRATION = "calibration",
    TESTING = "testing",
    DOCUMENTATION = "documentation"
}
/**
 * Test status
 */
export declare enum TestStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    PASSED = "passed",
    FAILED = "failed",
    CONDITIONAL_PASS = "conditional_pass"
}
/**
 * Acceptance status
 */
export declare enum AcceptanceStatus {
    PENDING = "pending",
    CUSTOMER_REVIEW = "customer_review",
    ACCEPTED = "accepted",
    REJECTED = "rejected",
    ACCEPTED_WITH_EXCEPTIONS = "accepted_with_exceptions"
}
/**
 * Resource type
 */
export declare enum ResourceType {
    TECHNICIAN = "technician",
    EQUIPMENT = "equipment",
    TOOL = "tool",
    MATERIAL = "material",
    VEHICLE = "vehicle",
    SPECIALIST = "specialist"
}
/**
 * Commissioning status
 */
export declare enum CommissioningStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    FAILED = "failed",
    DEFERRED = "deferred"
}
/**
 * Deployment priority
 */
export declare enum DeploymentPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}
/**
 * Deployment plan data
 */
export interface DeploymentPlanData {
    assetId: string;
    siteId: string;
    locationId: string;
    deploymentType: DeploymentType;
    priority: DeploymentPriority;
    plannedStartDate: Date;
    plannedEndDate: Date;
    estimatedDuration: number;
    requiresSitePrep: boolean;
    sitePrepRequirements?: string[];
    installationSteps?: InstallationStep[];
    requiredResources?: ResourceRequirement[];
    prerequisites?: string[];
    notes?: string;
}
/**
 * Installation step
 */
export interface InstallationStep {
    sequence: number;
    phase: InstallationPhase;
    description: string;
    estimatedDuration: number;
    requiredResources?: string[];
    prerequisites?: number[];
    safetyRequirements?: string[];
    qualityChecks?: string[];
}
/**
 * Resource requirement
 */
export interface ResourceRequirement {
    resourceType: ResourceType;
    resourceId?: string;
    quantity: number;
    requiredFrom: Date;
    requiredUntil: Date;
    skillsRequired?: string[];
    certificationRequired?: string[];
}
/**
 * Site preparation data
 */
export interface SitePreparationData {
    deploymentId: string;
    requirements: SitePrepRequirement[];
    assignedTo?: string;
    scheduledDate?: Date;
    notes?: string;
}
/**
 * Site prep requirement
 */
export interface SitePrepRequirement {
    category: string;
    description: string;
    completed: boolean;
    completedBy?: string;
    completedDate?: Date;
    verificationRequired: boolean;
    verifiedBy?: string;
    notes?: string;
}
/**
 * Resource allocation data
 */
export interface ResourceAllocationData {
    deploymentId: string;
    resourceType: ResourceType;
    resourceId: string;
    allocatedFrom: Date;
    allocatedUntil: Date;
    primaryAssignment: boolean;
    notes?: string;
}
/**
 * Installation progress data
 */
export interface InstallationProgressData {
    deploymentId: string;
    currentPhase: InstallationPhase;
    currentStep: number;
    completedSteps: number[];
    issues?: InstallationIssue[];
    percentComplete: number;
    updatedBy: string;
}
/**
 * Installation issue
 */
export interface InstallationIssue {
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
    reportedBy: string;
    reportedAt: Date;
    resolution?: string;
    resolvedBy?: string;
    resolvedAt?: Date;
}
/**
 * Configuration data
 */
export interface ConfigurationData {
    deploymentId: string;
    configurationType: string;
    parameters: Record<string, any>;
    configuredBy: string;
    configurationDate: Date;
    backupCreated: boolean;
    validationRequired: boolean;
    notes?: string;
}
/**
 * Test execution data
 */
export interface TestExecutionData {
    deploymentId: string;
    testPlanId: string;
    testCases: TestCase[];
    executedBy: string;
    executionDate: Date;
    environment: string;
    notes?: string;
}
/**
 * Test case
 */
export interface TestCase {
    testId: string;
    name: string;
    description: string;
    expectedResult: string;
    actualResult?: string;
    status: TestStatus;
    executedAt?: Date;
    defects?: string[];
    evidence?: string[];
}
/**
 * Acceptance criteria data
 */
export interface AcceptanceCriteriaData {
    deploymentId: string;
    criteria: AcceptanceCriterion[];
    acceptedBy?: string;
    acceptanceDate?: Date;
    exceptions?: string[];
    notes?: string;
}
/**
 * Acceptance criterion
 */
export interface AcceptanceCriterion {
    criterionId: string;
    description: string;
    met: boolean;
    verifiedBy?: string;
    verificationDate?: Date;
    evidence?: string[];
    notes?: string;
}
/**
 * Go-live data
 */
export interface GoLiveData {
    deploymentId: string;
    goLiveDate: Date;
    cutoverPlan: CutoverStep[];
    rollbackPlan: RollbackStep[];
    stakeholderApprovals: string[];
    communicationPlan?: string;
    supportPlan?: string;
}
/**
 * Cutover step
 */
export interface CutoverStep {
    sequence: number;
    description: string;
    responsibleParty: string;
    estimatedDuration: number;
    dependencies?: number[];
    rollbackProcedure?: string;
    completedAt?: Date;
}
/**
 * Rollback step
 */
export interface RollbackStep {
    sequence: number;
    description: string;
    trigger: string;
    responsibleParty: string;
    estimatedDuration: number;
    criticalData?: string[];
}
/**
 * Deployment Plan Model
 */
export declare class DeploymentPlan extends Model {
    id: string;
    deploymentNumber: string;
    assetId: string;
    siteId: string;
    locationId: string;
    deploymentType: DeploymentType;
    status: DeploymentStatus;
    priority: DeploymentPriority;
    plannedStartDate: Date;
    plannedEndDate: Date;
    actualStartDate?: Date;
    actualEndDate?: Date;
    estimatedDuration: number;
    actualDuration?: number;
    requiresSitePrep: boolean;
    sitePrepRequirements?: string[];
    installationSteps?: InstallationStep[];
    requiredResources?: ResourceRequirement[];
    prerequisites?: string[];
    currentPhase?: InstallationPhase;
    percentComplete: number;
    projectManagerId?: string;
    notes?: string;
    attachments?: string[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    sitePreparations?: SitePreparation[];
    resourceAllocations?: ResourceAllocation[];
    configurations?: DeploymentConfiguration[];
    tests?: DeploymentTest[];
    static generateDeploymentNumber(instance: DeploymentPlan): Promise<void>;
}
/**
 * Site Preparation Model
 */
export declare class SitePreparation extends Model {
    id: string;
    deploymentId: string;
    status: SitePrepStatus;
    requirements: SitePrepRequirement[];
    assignedTo?: string;
    scheduledDate?: Date;
    startedDate?: Date;
    completedDate?: Date;
    verificationChecklist?: Record<string, any>;
    photos?: string[];
    documents?: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deployment?: DeploymentPlan;
}
/**
 * Resource Allocation Model
 */
export declare class ResourceAllocation extends Model {
    id: string;
    deploymentId: string;
    resourceType: ResourceType;
    resourceId: string;
    allocatedFrom: Date;
    allocatedUntil: Date;
    primaryAssignment: boolean;
    utilizationPercentage?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deployment?: DeploymentPlan;
}
/**
 * Installation Progress Model
 */
export declare class InstallationProgress extends Model {
    id: string;
    deploymentId: string;
    currentPhase: InstallationPhase;
    currentStep: number;
    completedSteps: number[];
    issues?: InstallationIssue[];
    percentComplete: number;
    updatedBy: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Deployment Configuration Model
 */
export declare class DeploymentConfiguration extends Model {
    id: string;
    deploymentId: string;
    configurationType: string;
    parameters: Record<string, any>;
    configuredBy: string;
    configurationDate: Date;
    backupCreated: boolean;
    backupLocation?: string;
    validationRequired: boolean;
    validated: boolean;
    validatedBy?: string;
    validationDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deployment?: DeploymentPlan;
}
/**
 * Deployment Test Model
 */
export declare class DeploymentTest extends Model {
    id: string;
    deploymentId: string;
    testPlanId: string;
    testCases: TestCase[];
    overallStatus: TestStatus;
    executedBy: string;
    executionDate: Date;
    environment: string;
    resultsSummary?: {
        totalTests: number;
        passed: number;
        failed: number;
        conditionalPass: number;
        notStarted: number;
    };
    notes?: string;
    attachments?: string[];
    createdAt: Date;
    updatedAt: Date;
    deployment?: DeploymentPlan;
}
/**
 * Deployment Acceptance Model
 */
export declare class DeploymentAcceptance extends Model {
    id: string;
    deploymentId: string;
    status: AcceptanceStatus;
    criteria: AcceptanceCriterion[];
    acceptedBy?: string;
    acceptanceDate?: Date;
    exceptions?: string[];
    signOffDocuments?: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Go-Live Plan Model
 */
export declare class GoLivePlan extends Model {
    id: string;
    deploymentId: string;
    goLiveDate: Date;
    actualGoLiveDate?: Date;
    status: string;
    cutoverPlan: CutoverStep[];
    rollbackPlan: RollbackStep[];
    stakeholderApprovals: string[];
    allApprovalsReceived: boolean;
    communicationPlan?: string;
    supportPlan?: string;
    rollbackTriggered: boolean;
    rollbackReason?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Commissioning Record Model
 */
export declare class CommissioningRecord extends Model {
    id: string;
    deploymentId: string;
    status: CommissioningStatus;
    commissioningDate?: Date;
    commissionedBy?: string;
    commissioningChecklist?: Record<string, any>;
    performanceBaseline?: Record<string, any>;
    calibrationResults?: Record<string, any>;
    trainingCompleted: boolean;
    documentationDelivered: boolean;
    warrantyActivated: boolean;
    notes?: string;
    attachments?: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Creates a deployment plan
 *
 * @param data - Deployment plan data
 * @param transaction - Optional database transaction
 * @returns Created deployment plan
 *
 * @example
 * ```typescript
 * const plan = await createDeploymentPlan({
 *   assetId: 'asset-123',
 *   siteId: 'site-456',
 *   locationId: 'loc-789',
 *   deploymentType: DeploymentType.NEW_INSTALLATION,
 *   priority: DeploymentPriority.HIGH,
 *   plannedStartDate: new Date('2024-06-01'),
 *   plannedEndDate: new Date('2024-06-05'),
 *   estimatedDuration: 2400,
 *   requiresSitePrep: true
 * });
 * ```
 */
export declare function createDeploymentPlan(data: DeploymentPlanData, transaction?: Transaction): Promise<DeploymentPlan>;
/**
 * Updates deployment plan
 *
 * @param planId - Plan identifier
 * @param updates - Fields to update
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await updateDeploymentPlan('plan-123', {
 *   priority: DeploymentPriority.CRITICAL,
 *   plannedStartDate: new Date('2024-05-25')
 * });
 * ```
 */
export declare function updateDeploymentPlan(planId: string, updates: Partial<DeploymentPlan>, transaction?: Transaction): Promise<DeploymentPlan>;
/**
 * Schedules a deployment
 *
 * @param planId - Plan identifier
 * @param scheduledDate - Scheduled start date
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await scheduleDeployment('plan-123', new Date('2024-06-01'));
 * ```
 */
export declare function scheduleDeployment(planId: string, scheduledDate: Date, transaction?: Transaction): Promise<DeploymentPlan>;
/**
 * Gets deployment plans by status
 *
 * @param status - Deployment status
 * @param options - Query options
 * @returns Deployment plans
 *
 * @example
 * ```typescript
 * const scheduled = await getDeploymentsByStatus(DeploymentStatus.SCHEDULED);
 * ```
 */
export declare function getDeploymentsByStatus(status: DeploymentStatus, options?: FindOptions): Promise<DeploymentPlan[]>;
/**
 * Gets deployments by site
 *
 * @param siteId - Site identifier
 * @param options - Query options
 * @returns Deployments
 *
 * @example
 * ```typescript
 * const siteDeployments = await getDeploymentsBySite('site-123');
 * ```
 */
export declare function getDeploymentsBySite(siteId: string, options?: FindOptions): Promise<DeploymentPlan[]>;
/**
 * Gets deployments by asset
 *
 * @param assetId - Asset identifier
 * @returns Deployment history
 *
 * @example
 * ```typescript
 * const history = await getDeploymentsByAsset('asset-123');
 * ```
 */
export declare function getDeploymentsByAsset(assetId: string): Promise<DeploymentPlan[]>;
/**
 * Cancels a deployment
 *
 * @param planId - Plan identifier
 * @param reason - Cancellation reason
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await cancelDeployment('plan-123', 'Site not ready');
 * ```
 */
export declare function cancelDeployment(planId: string, reason: string, transaction?: Transaction): Promise<DeploymentPlan>;
/**
 * Creates site preparation record
 *
 * @param data - Site prep data
 * @param transaction - Optional database transaction
 * @returns Created site preparation
 *
 * @example
 * ```typescript
 * const prep = await createSitePreparation({
 *   deploymentId: 'dep-123',
 *   requirements: [{
 *     category: 'Electrical',
 *     description: 'Install 220V outlet',
 *     completed: false,
 *     verificationRequired: true
 *   }],
 *   assignedTo: 'tech-456',
 *   scheduledDate: new Date('2024-05-28')
 * });
 * ```
 */
export declare function createSitePreparation(data: SitePreparationData, transaction?: Transaction): Promise<SitePreparation>;
/**
 * Updates site preparation requirement
 *
 * @param prepId - Site prep identifier
 * @param requirementIndex - Index of requirement to update
 * @param updates - Requirement updates
 * @param transaction - Optional database transaction
 * @returns Updated site preparation
 *
 * @example
 * ```typescript
 * await updateSitePrepRequirement('prep-123', 0, {
 *   completed: true,
 *   completedBy: 'tech-456',
 *   completedDate: new Date()
 * });
 * ```
 */
export declare function updateSitePrepRequirement(prepId: string, requirementIndex: number, updates: Partial<SitePrepRequirement>, transaction?: Transaction): Promise<SitePreparation>;
/**
 * Starts site preparation
 *
 * @param prepId - Site prep identifier
 * @param transaction - Optional database transaction
 * @returns Updated site preparation
 *
 * @example
 * ```typescript
 * await startSitePreparation('prep-123');
 * ```
 */
export declare function startSitePreparation(prepId: string, transaction?: Transaction): Promise<SitePreparation>;
/**
 * Completes site preparation
 *
 * @param prepId - Site prep identifier
 * @param verificationData - Verification checklist data
 * @param transaction - Optional database transaction
 * @returns Updated site preparation
 *
 * @example
 * ```typescript
 * await completeSitePreparation('prep-123', {
 *   electricalVerified: true,
 *   structuralVerified: true,
 *   safetyVerified: true
 * });
 * ```
 */
export declare function completeSitePreparation(prepId: string, verificationData: Record<string, any>, transaction?: Transaction): Promise<SitePreparation>;
/**
 * Gets site preparation for deployment
 *
 * @param deploymentId - Deployment identifier
 * @returns Site preparation records
 *
 * @example
 * ```typescript
 * const preps = await getSitePreparationForDeployment('dep-123');
 * ```
 */
export declare function getSitePreparationForDeployment(deploymentId: string): Promise<SitePreparation[]>;
/**
 * Allocates resource to deployment
 *
 * @param data - Resource allocation data
 * @param transaction - Optional database transaction
 * @returns Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateDeploymentResource({
 *   deploymentId: 'dep-123',
 *   resourceType: ResourceType.TECHNICIAN,
 *   resourceId: 'tech-456',
 *   allocatedFrom: new Date('2024-06-01 08:00'),
 *   allocatedUntil: new Date('2024-06-01 17:00'),
 *   primaryAssignment: true
 * });
 * ```
 */
export declare function allocateDeploymentResource(data: ResourceAllocationData, transaction?: Transaction): Promise<ResourceAllocation>;
/**
 * Deallocates resource from deployment
 *
 * @param allocationId - Allocation identifier
 * @param transaction - Optional database transaction
 * @returns Deletion result
 *
 * @example
 * ```typescript
 * await deallocateDeploymentResource('alloc-123');
 * ```
 */
export declare function deallocateDeploymentResource(allocationId: string, transaction?: Transaction): Promise<boolean>;
/**
 * Gets resource allocations for deployment
 *
 * @param deploymentId - Deployment identifier
 * @returns Resource allocations
 *
 * @example
 * ```typescript
 * const resources = await getDeploymentResourceAllocations('dep-123');
 * ```
 */
export declare function getDeploymentResourceAllocations(deploymentId: string): Promise<ResourceAllocation[]>;
/**
 * Gets resource availability
 *
 * @param resourceId - Resource identifier
 * @param startDate - Start of period
 * @param endDate - End of period
 * @returns Availability status
 *
 * @example
 * ```typescript
 * const available = await checkResourceAvailability(
 *   'tech-123',
 *   new Date('2024-06-01'),
 *   new Date('2024-06-05')
 * );
 * ```
 */
export declare function checkResourceAvailability(resourceId: string, startDate: Date, endDate: Date): Promise<{
    available: boolean;
    allocations: ResourceAllocation[];
}>;
/**
 * Bulk allocates resources
 *
 * @param deploymentId - Deployment identifier
 * @param resources - Resource allocations
 * @param transaction - Optional database transaction
 * @returns Created allocations
 *
 * @example
 * ```typescript
 * await bulkAllocateResources('dep-123', [
 *   { resourceType: ResourceType.TECHNICIAN, resourceId: 'tech-1', ... },
 *   { resourceType: ResourceType.EQUIPMENT, resourceId: 'crane-1', ... }
 * ]);
 * ```
 */
export declare function bulkAllocateResources(deploymentId: string, resources: ResourceAllocationData[], transaction?: Transaction): Promise<ResourceAllocation[]>;
/**
 * Starts deployment execution
 *
 * @param deploymentId - Deployment identifier
 * @param startedBy - User starting deployment
 * @param transaction - Optional database transaction
 * @returns Updated deployment
 *
 * @example
 * ```typescript
 * await startDeploymentExecution('dep-123', 'pm-456');
 * ```
 */
export declare function startDeploymentExecution(deploymentId: string, startedBy: string, transaction?: Transaction): Promise<DeploymentPlan>;
/**
 * Updates installation progress
 *
 * @param data - Progress data
 * @param transaction - Optional database transaction
 * @returns Created progress record
 *
 * @example
 * ```typescript
 * await updateInstallationProgress({
 *   deploymentId: 'dep-123',
 *   currentPhase: InstallationPhase.PHYSICAL_INSTALLATION,
 *   currentStep: 3,
 *   completedSteps: [1, 2],
 *   percentComplete: 25,
 *   updatedBy: 'tech-456'
 * });
 * ```
 */
export declare function updateInstallationProgress(data: InstallationProgressData, transaction?: Transaction): Promise<InstallationProgress>;
/**
 * Records installation issue
 *
 * @param deploymentId - Deployment identifier
 * @param issue - Issue details
 * @param transaction - Optional database transaction
 * @returns Updated progress
 *
 * @example
 * ```typescript
 * await recordInstallationIssue('dep-123', {
 *   severity: 'high',
 *   description: 'Missing mounting hardware',
 *   reportedBy: 'tech-456',
 *   reportedAt: new Date()
 * });
 * ```
 */
export declare function recordInstallationIssue(deploymentId: string, issue: InstallationIssue, transaction?: Transaction): Promise<InstallationProgress>;
/**
 * Resolves installation issue
 *
 * @param deploymentId - Deployment identifier
 * @param issueIndex - Issue index
 * @param resolution - Resolution details
 * @param resolvedBy - User resolving issue
 * @param transaction - Optional database transaction
 * @returns Updated progress
 *
 * @example
 * ```typescript
 * await resolveInstallationIssue('dep-123', 0, 'Hardware procured and installed', 'tech-456');
 * ```
 */
export declare function resolveInstallationIssue(deploymentId: string, issueIndex: number, resolution: string, resolvedBy: string, transaction?: Transaction): Promise<InstallationProgress>;
/**
 * Gets installation progress history
 *
 * @param deploymentId - Deployment identifier
 * @returns Progress records
 *
 * @example
 * ```typescript
 * const history = await getInstallationProgressHistory('dep-123');
 * ```
 */
export declare function getInstallationProgressHistory(deploymentId: string): Promise<InstallationProgress[]>;
/**
 * Records deployment configuration
 *
 * @param data - Configuration data
 * @param transaction - Optional database transaction
 * @returns Created configuration
 *
 * @example
 * ```typescript
 * const config = await recordDeploymentConfiguration({
 *   deploymentId: 'dep-123',
 *   configurationType: 'network',
 *   parameters: { ip: '192.168.1.100', subnet: '255.255.255.0' },
 *   configuredBy: 'tech-456',
 *   configurationDate: new Date(),
 *   backupCreated: true,
 *   validationRequired: true
 * });
 * ```
 */
export declare function recordDeploymentConfiguration(data: ConfigurationData, transaction?: Transaction): Promise<DeploymentConfiguration>;
/**
 * Validates configuration
 *
 * @param configId - Configuration identifier
 * @param validatedBy - User validating
 * @param transaction - Optional database transaction
 * @returns Updated configuration
 *
 * @example
 * ```typescript
 * await validateConfiguration('config-123', 'engineer-789');
 * ```
 */
export declare function validateConfiguration(configId: string, validatedBy: string, transaction?: Transaction): Promise<DeploymentConfiguration>;
/**
 * Gets configurations for deployment
 *
 * @param deploymentId - Deployment identifier
 * @returns Configuration records
 *
 * @example
 * ```typescript
 * const configs = await getDeploymentConfigurations('dep-123');
 * ```
 */
export declare function getDeploymentConfigurations(deploymentId: string): Promise<DeploymentConfiguration[]>;
/**
 * Executes deployment tests
 *
 * @param data - Test execution data
 * @param transaction - Optional database transaction
 * @returns Created test record
 *
 * @example
 * ```typescript
 * const test = await executeDeploymentTests({
 *   deploymentId: 'dep-123',
 *   testPlanId: 'plan-456',
 *   testCases: [{
 *     testId: 'test-1',
 *     name: 'Power on test',
 *     description: 'Verify system powers on correctly',
 *     expectedResult: 'System starts within 30 seconds',
 *     status: TestStatus.NOT_STARTED
 *   }],
 *   executedBy: 'tester-789',
 *   executionDate: new Date(),
 *   environment: 'production'
 * });
 * ```
 */
export declare function executeDeploymentTests(data: TestExecutionData, transaction?: Transaction): Promise<DeploymentTest>;
/**
 * Updates test case result
 *
 * @param testId - Test identifier
 * @param testCaseId - Test case identifier
 * @param result - Test result
 * @param transaction - Optional database transaction
 * @returns Updated test
 *
 * @example
 * ```typescript
 * await updateTestCaseResult('test-123', 'case-1', {
 *   actualResult: 'System started in 15 seconds',
 *   status: TestStatus.PASSED,
 *   executedAt: new Date()
 * });
 * ```
 */
export declare function updateTestCaseResult(testId: string, testCaseId: string, result: Partial<TestCase>, transaction?: Transaction): Promise<DeploymentTest>;
/**
 * Creates acceptance criteria
 *
 * @param data - Acceptance data
 * @param transaction - Optional database transaction
 * @returns Created acceptance record
 *
 * @example
 * ```typescript
 * const acceptance = await createAcceptanceCriteria({
 *   deploymentId: 'dep-123',
 *   criteria: [{
 *     criterionId: 'crit-1',
 *     description: 'All tests passed',
 *     met: true,
 *     verifiedBy: 'qa-456',
 *     verificationDate: new Date()
 *   }]
 * });
 * ```
 */
export declare function createAcceptanceCriteria(data: AcceptanceCriteriaData, transaction?: Transaction): Promise<DeploymentAcceptance>;
/**
 * Records acceptance decision
 *
 * @param deploymentId - Deployment identifier
 * @param accepted - Whether accepted
 * @param acceptedBy - User accepting
 * @param exceptions - Acceptance exceptions
 * @param transaction - Optional database transaction
 * @returns Updated acceptance
 *
 * @example
 * ```typescript
 * await recordAcceptanceDecision('dep-123', true, 'customer-789', []);
 * ```
 */
export declare function recordAcceptanceDecision(deploymentId: string, accepted: boolean, acceptedBy: string, exceptions?: string[], transaction?: Transaction): Promise<DeploymentAcceptance>;
/**
 * Creates go-live plan
 *
 * @param data - Go-live data
 * @param transaction - Optional database transaction
 * @returns Created go-live plan
 *
 * @example
 * ```typescript
 * const goLive = await createGoLivePlan({
 *   deploymentId: 'dep-123',
 *   goLiveDate: new Date('2024-06-15'),
 *   cutoverPlan: [...],
 *   rollbackPlan: [...],
 *   stakeholderApprovals: ['user-1', 'user-2']
 * });
 * ```
 */
export declare function createGoLivePlan(data: GoLiveData, transaction?: Transaction): Promise<GoLivePlan>;
/**
 * Executes go-live
 *
 * @param planId - Go-live plan identifier
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await executeGoLive('plan-123');
 * ```
 */
export declare function executeGoLive(planId: string, transaction?: Transaction): Promise<GoLivePlan>;
/**
 * Triggers rollback
 *
 * @param planId - Go-live plan identifier
 * @param reason - Rollback reason
 * @param transaction - Optional database transaction
 * @returns Updated plan
 *
 * @example
 * ```typescript
 * await triggerRollback('plan-123', 'Critical system error detected');
 * ```
 */
export declare function triggerRollback(planId: string, reason: string, transaction?: Transaction): Promise<GoLivePlan>;
/**
 * Creates commissioning record
 *
 * @param deploymentId - Deployment identifier
 * @param transaction - Optional database transaction
 * @returns Created commissioning record
 *
 * @example
 * ```typescript
 * const commissioning = await createCommissioningRecord('dep-123');
 * ```
 */
export declare function createCommissioningRecord(deploymentId: string, transaction?: Transaction): Promise<CommissioningRecord>;
/**
 * Completes commissioning
 *
 * @param recordId - Commissioning record identifier
 * @param commissionedBy - User completing commissioning
 * @param data - Commissioning data
 * @param transaction - Optional database transaction
 * @returns Updated record
 *
 * @example
 * ```typescript
 * await completeCommissioning('comm-123', 'engineer-456', {
 *   performanceBaseline: {...},
 *   calibrationResults: {...}
 * });
 * ```
 */
export declare function completeCommissioning(recordId: string, commissionedBy: string, data: {
    commissioningChecklist?: Record<string, any>;
    performanceBaseline?: Record<string, any>;
    calibrationResults?: Record<string, any>;
}, transaction?: Transaction): Promise<CommissioningRecord>;
/**
 * Gets commissioning record for deployment
 *
 * @param deploymentId - Deployment identifier
 * @returns Commissioning record
 *
 * @example
 * ```typescript
 * const commissioning = await getCommissioningRecord('dep-123');
 * ```
 */
export declare function getCommissioningRecord(deploymentId: string): Promise<CommissioningRecord | null>;
declare const _default: {
    DeploymentPlan: typeof DeploymentPlan;
    SitePreparation: typeof SitePreparation;
    ResourceAllocation: typeof ResourceAllocation;
    InstallationProgress: typeof InstallationProgress;
    DeploymentConfiguration: typeof DeploymentConfiguration;
    DeploymentTest: typeof DeploymentTest;
    DeploymentAcceptance: typeof DeploymentAcceptance;
    GoLivePlan: typeof GoLivePlan;
    CommissioningRecord: typeof CommissioningRecord;
    createDeploymentPlan: typeof createDeploymentPlan;
    updateDeploymentPlan: typeof updateDeploymentPlan;
    scheduleDeployment: typeof scheduleDeployment;
    getDeploymentsByStatus: typeof getDeploymentsByStatus;
    getDeploymentsBySite: typeof getDeploymentsBySite;
    getDeploymentsByAsset: typeof getDeploymentsByAsset;
    cancelDeployment: typeof cancelDeployment;
    createSitePreparation: typeof createSitePreparation;
    updateSitePrepRequirement: typeof updateSitePrepRequirement;
    startSitePreparation: typeof startSitePreparation;
    completeSitePreparation: typeof completeSitePreparation;
    getSitePreparationForDeployment: typeof getSitePreparationForDeployment;
    allocateDeploymentResource: typeof allocateDeploymentResource;
    deallocateDeploymentResource: typeof deallocateDeploymentResource;
    getDeploymentResourceAllocations: typeof getDeploymentResourceAllocations;
    checkResourceAvailability: typeof checkResourceAvailability;
    bulkAllocateResources: typeof bulkAllocateResources;
    startDeploymentExecution: typeof startDeploymentExecution;
    updateInstallationProgress: typeof updateInstallationProgress;
    recordInstallationIssue: typeof recordInstallationIssue;
    resolveInstallationIssue: typeof resolveInstallationIssue;
    getInstallationProgressHistory: typeof getInstallationProgressHistory;
    recordDeploymentConfiguration: typeof recordDeploymentConfiguration;
    validateConfiguration: typeof validateConfiguration;
    getDeploymentConfigurations: typeof getDeploymentConfigurations;
    executeDeploymentTests: typeof executeDeploymentTests;
    updateTestCaseResult: typeof updateTestCaseResult;
    createAcceptanceCriteria: typeof createAcceptanceCriteria;
    recordAcceptanceDecision: typeof recordAcceptanceDecision;
    createGoLivePlan: typeof createGoLivePlan;
    executeGoLive: typeof executeGoLive;
    triggerRollback: typeof triggerRollback;
    createCommissioningRecord: typeof createCommissioningRecord;
    completeCommissioning: typeof completeCommissioning;
    getCommissioningRecord: typeof getCommissioningRecord;
};
export default _default;
//# sourceMappingURL=asset-deployment-commands.d.ts.map