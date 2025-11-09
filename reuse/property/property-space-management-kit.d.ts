/**
 * Property Space Management Kit
 *
 * Comprehensive toolkit for commercial real estate space planning and management
 * in healthcare facilities. Provides advanced space inventory, allocation, utilization
 * analytics, occupancy planning, chargeback calculations, space standards enforcement,
 * stacking plans, forecasting, and optimization recommendations.
 *
 * @module property-space-management-kit
 * @category Property & Space Management
 */
import { Sequelize, Transaction } from 'sequelize';
/**
 * Space inventory record with classification and attributes
 */
export interface SpaceInventory {
    spaceId: string;
    buildingId: string;
    floorId: string;
    spaceNumber: string;
    spaceName: string;
    spaceType: 'office' | 'exam-room' | 'lab' | 'surgery' | 'storage' | 'common' | 'mechanical' | 'circulation';
    spaceCategory: 'clinical' | 'administrative' | 'support' | 'infrastructure';
    usableArea: number;
    grossArea: number;
    rentableArea: number;
    capacity: number;
    currentOccupancy: number;
    hasWindows: boolean;
    accessibility: 'ada-compliant' | 'limited' | 'non-compliant';
    meetsSpaceStandards: boolean;
    standardsVersion: string;
    lastInspection?: Date;
    status: 'occupied' | 'vacant' | 'under-construction' | 'under-renovation' | 'decommissioned';
    availableDate?: Date;
    assignedDepartment?: string;
    assignedCostCenter?: string;
    primaryOccupant?: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Space allocation assignment
 */
export interface SpaceAllocation {
    allocationId: string;
    spaceId: string;
    departmentId: string;
    costCenterId: string;
    allocationType: 'permanent' | 'temporary' | 'shared' | 'hoteling';
    allocationPercent: number;
    startDate: Date;
    endDate?: Date;
    primaryOccupants: string[];
    secondaryOccupants: string[];
    maxOccupants: number;
    monthlyRate: number;
    annualCost: number;
    chargebackMethod: 'full' | 'proportional' | 'shared';
    status: 'active' | 'pending' | 'expired' | 'terminated';
    approvedBy?: string;
    approvedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Space utilization metrics
 */
export interface SpaceUtilization {
    spaceId: string;
    measurementDate: Date;
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    averageOccupancy: number;
    peakOccupancy: number;
    minimumOccupancy: number;
    occupancyRate: number;
    hoursOccupied: number;
    hoursAvailable: number;
    utilizationRate: number;
    morningUtilization: number;
    afternoonUtilization: number;
    eveningUtilization: number;
    weekendUtilization: number;
    spaceEfficiency: number;
    costEfficiency: number;
    utilizationTrend: 'increasing' | 'decreasing' | 'stable';
    comparedToPrevious: number;
}
/**
 * Occupancy planning forecast
 */
export interface OccupancyPlan {
    planId: string;
    departmentId: string;
    planName: string;
    planType: 'expansion' | 'consolidation' | 'relocation' | 'new-department';
    planStartDate: Date;
    planEndDate: Date;
    implementationPhases: number;
    currentHeadcount: number;
    currentSpaceAllocation: number;
    currentSpaces: string[];
    projectedHeadcount: number;
    projectedSpaceNeeded: number;
    targetSpaces: string[];
    spaceRequirements: {
        offices: number;
        workstations: number;
        meetingRooms: number;
        specialtySpaces: number;
        supportSpaces: number;
    };
    estimatedMoveCost: number;
    estimatedRenovationCost: number;
    annualCostImpact: number;
    status: 'draft' | 'under-review' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
    approvers: string[];
    createdBy: string;
    createdAt: Date;
}
/**
 * Space chargeback calculation
 */
export interface SpaceChargeback {
    chargebackId: string;
    period: Date;
    departmentId: string;
    costCenterId: string;
    allocations: Array<{
        spaceId: string;
        spaceType: string;
        area: number;
        allocationPercent: number;
        ratePerSqFt: number;
        monthlyCharge: number;
    }>;
    baseRent: number;
    utilities: number;
    maintenance: number;
    janitorial: number;
    security: number;
    parking: number;
    amenities: number;
    subtotal: number;
    adjustments: number;
    totalCharge: number;
    calculatedAt: Date;
    calculatedBy: string;
    invoiceNumber?: string;
    paymentStatus: 'pending' | 'invoiced' | 'paid' | 'disputed';
}
/**
 * Space standards definition
 */
export interface SpaceStandard {
    standardId: string;
    standardName: string;
    version: string;
    effectiveDate: Date;
    standards: Array<{
        roleLevel: 'executive' | 'director' | 'manager' | 'staff' | 'clinical' | 'support';
        spaceType: string;
        minimumArea: number;
        maximumArea: number;
        standardArea: number;
        furnishings: string[];
        technology: string[];
        specialRequirements?: string[];
    }>;
    complianceRequired: boolean;
    exceptionProcess: string;
    approvalRequired: boolean;
    status: 'draft' | 'active' | 'superseded' | 'retired';
}
/**
 * Stacking and blocking plan
 */
export interface StackingPlan {
    planId: string;
    buildingId: string;
    planName: string;
    planVersion: string;
    floorAllocations: Array<{
        floorId: string;
        floorNumber: number;
        totalArea: number;
        usableArea: number;
        departments: Array<{
            departmentId: string;
            departmentName: string;
            allocatedArea: number;
            headcount: number;
            spaceIds: string[];
            color?: string;
        }>;
        occupancyRate: number;
        efficiency: number;
    }>;
    blocks: Array<{
        blockId: string;
        blockName: string;
        departmentId: string;
        floorId: string;
        spaceIds: string[];
        totalArea: number;
        adjacencyScore: number;
    }>;
    status: 'draft' | 'proposed' | 'approved' | 'current' | 'archived';
    createdBy: string;
    createdAt: Date;
    approvedAt?: Date;
}
/**
 * Space forecast prediction
 */
export interface SpaceForecast {
    forecastId: string;
    departmentId?: string;
    scope: 'department' | 'building' | 'portfolio';
    forecastMethod: 'headcount-ratio' | 'trend-analysis' | 'regression' | 'scenario-based';
    forecastHorizon: number;
    confidenceLevel: number;
    currentHeadcount: number;
    currentSpaceAllocation: number;
    currentRatioPerPerson: number;
    predictions: Array<{
        period: Date;
        projectedHeadcount: number;
        projectedSpaceNeeded: number;
        projectedVacancy: number;
        confidence: number;
    }>;
    capacityExceededDate?: Date;
    monthsUntilCapacity?: number;
    recommendedActionDate?: Date;
    recommendation: 'no-action' | 'monitor' | 'plan-expansion' | 'urgent-action';
    suggestedActions: string[];
    generatedAt: Date;
    generatedBy: string;
}
/**
 * Space optimization recommendation
 */
export interface SpaceOptimization {
    optimizationId: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    category: 'consolidation' | 'reallocation' | 'right-sizing' | 'hoteling' | 'densification' | 'renovation';
    targetSpaces: string[];
    targetDepartments: string[];
    currentState: {
        totalArea: number;
        occupiedArea: number;
        averageUtilization: number;
        annualCost: number;
    };
    proposedState: {
        totalArea: number;
        projectedUtilization: number;
        annualCost: number;
    };
    spaceReclaimed: number;
    costSavings: number;
    utilizationImprovement: number;
    headcountAccommodated: number;
    implementationCost: number;
    implementationTime: number;
    complexity: 'low' | 'medium' | 'high';
    risks: string[];
    dependencies: string[];
    paybackPeriod: number;
    roi: number;
    npv: number;
    recommendation: string;
    nextSteps: string[];
    createdAt: Date;
}
/**
 * Floor plan metadata and integration
 */
export interface FloorPlan {
    floorPlanId: string;
    buildingId: string;
    floorId: string;
    planName: string;
    planVersion: string;
    drawingNumber: string;
    scale: string;
    cadFileUrl?: string;
    pdfFileUrl?: string;
    imageFileUrl?: string;
    revitFileUrl?: string;
    totalGrossArea: number;
    totalUsableArea: number;
    circulationArea: number;
    coreArea: number;
    spaces: Array<{
        spaceId: string;
        coordinates: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        polygon?: Array<{
            x: number;
            y: number;
        }>;
    }>;
    lastUpdated: Date;
    updatedBy: string;
    revisionHistory: Array<{
        version: string;
        date: Date;
        changes: string;
        updatedBy: string;
    }>;
}
/**
 * Move management record
 */
export interface MoveManagement {
    moveId: string;
    moveName: string;
    moveType: 'individual' | 'team' | 'department' | 'building';
    fromSpaces: string[];
    toSpaces: string[];
    fromBuilding: string;
    toBuilding: string;
    employeesMoving: string[];
    headcount: number;
    departmentsAffected: string[];
    plannedMoveDate: Date;
    actualMoveDate?: Date;
    duration: number;
    estimatedCost: number;
    actualCost?: number;
    costBreakdown: {
        movers: number;
        itRelocation: number;
        furnitureReconfig: number;
        signage: number;
        communications: number;
        other: number;
    };
    status: 'planning' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    milestones: Array<{
        name: string;
        dueDate: Date;
        completedDate?: Date;
        status: 'pending' | 'in-progress' | 'completed';
    }>;
    projectManager: string;
    sponsor: string;
    coordinators: string[];
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Adjacency requirements and preferences
 */
export interface AdjacencyRequirement {
    requirementId: string;
    department1Id: string;
    department2Id: string;
    relationshipType: 'must-be-adjacent' | 'should-be-adjacent' | 'can-be-adjacent' | 'should-not-be-adjacent' | 'must-not-be-adjacent';
    priority: number;
    reason: string;
    businessImpact: 'high' | 'medium' | 'low';
    currentlyAdjacent: boolean;
    currentDistance?: number;
    currentSameFloor: boolean;
    regulatoryRequirement: boolean;
    complianceNotes?: string;
    createdAt: Date;
}
interface SpaceManagementConfig {
    defaultSpaceStandardPerPerson: number;
    minSpaceStandardPerPerson: number;
    maxSpaceStandardPerPerson: number;
    lowUtilizationThreshold: number;
    targetUtilization: number;
    highUtilizationThreshold: number;
    defaultRatePerSqFt: number;
    utilityCostPerSqFt: number;
    maintenanceCostPerSqFt: number;
    defaultForecastHorizon: number;
    minimumConfidence: number;
}
/**
 * Retrieves complete space inventory for a building
 *
 * @param sequelize - Sequelize instance
 * @param buildingId - Building identifier
 * @returns Array of space inventory records
 *
 * @example
 * ```typescript
 * const inventory = await getSpaceInventory(sequelize, 'building-001');
 * console.log(`Total spaces: ${inventory.length}`);
 * ```
 */
export declare function getSpaceInventory(sequelize: Sequelize, buildingId: string): Promise<SpaceInventory[]>;
/**
 * Classifies spaces by type and category with metrics
 *
 * @param sequelize - Sequelize instance
 * @param buildingId - Building identifier
 * @returns Classification summary with metrics
 */
export declare function classifySpacesByType(sequelize: Sequelize, buildingId: string): Promise<{
    byType: Map<string, {
        count: number;
        totalArea: number;
        avgUtilization: number;
    }>;
    byCategory: Map<string, {
        count: number;
        totalArea: number;
        percentOfTotal: number;
    }>;
    totalSpaces: number;
    totalArea: number;
}>;
/**
 * Searches for available spaces matching criteria
 *
 * @param sequelize - Sequelize instance
 * @param criteria - Search criteria
 * @returns Matching available spaces
 */
export declare function searchAvailableSpaces(sequelize: Sequelize, criteria: {
    buildingId?: string;
    minArea?: number;
    maxArea?: number;
    spaceType?: string;
    hasWindows?: boolean;
    accessibility?: string;
    availableBy?: Date;
}): Promise<SpaceInventory[]>;
/**
 * Creates a new space allocation
 *
 * @param sequelize - Sequelize instance
 * @param allocation - Allocation details
 * @param transaction - Optional transaction
 * @returns Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await createSpaceAllocation(sequelize, {
 *   allocationId: 'alloc-001',
 *   spaceId: 'space-123',
 *   departmentId: 'dept-cardiology',
 *   costCenterId: 'cc-1001',
 *   allocationType: 'permanent',
 *   allocationPercent: 100,
 *   startDate: new Date(),
 *   primaryOccupants: ['emp-001', 'emp-002'],
 *   secondaryOccupants: [],
 *   maxOccupants: 4,
 *   monthlyRate: 5000,
 *   annualCost: 60000,
 *   chargebackMethod: 'full',
 *   status: 'active',
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * });
 * ```
 */
export declare function createSpaceAllocation(sequelize: Sequelize, allocation: SpaceAllocation, transaction?: Transaction): Promise<SpaceAllocation>;
/**
 * Retrieves all allocations for a department
 *
 * @param sequelize - Sequelize instance
 * @param departmentId - Department identifier
 * @returns Active allocations
 */
export declare function getDepartmentAllocations(sequelize: Sequelize, departmentId: string): Promise<SpaceAllocation[]>;
/**
 * Terminates a space allocation and frees the space
 *
 * @param sequelize - Sequelize instance
 * @param allocationId - Allocation identifier
 * @param endDate - Termination date
 * @param transaction - Optional transaction
 * @returns Updated allocation
 */
export declare function terminateSpaceAllocation(sequelize: Sequelize, allocationId: string, endDate: Date, transaction?: Transaction): Promise<void>;
/**
 * Calculates space utilization metrics for a given period
 *
 * @param sequelize - Sequelize instance
 * @param spaceId - Space identifier
 * @param startDate - Period start
 * @param endDate - Period end
 * @returns Utilization metrics
 *
 * @example
 * ```typescript
 * const utilization = await calculateSpaceUtilization(
 *   sequelize,
 *   'space-123',
 *   new Date('2024-01-01'),
 *   new Date('2024-01-31')
 * );
 * console.log(`Utilization rate: ${utilization.utilizationRate}%`);
 * ```
 */
export declare function calculateSpaceUtilization(sequelize: Sequelize, spaceId: string, startDate: Date, endDate: Date): Promise<SpaceUtilization>;
/**
 * Identifies underutilized spaces for optimization
 *
 * @param sequelize - Sequelize instance
 * @param buildingId - Building identifier
 * @param threshold - Utilization threshold percentage
 * @returns List of underutilized spaces
 */
export declare function identifyUnderutilizedSpaces(sequelize: Sequelize, buildingId: string, threshold?: number): Promise<Array<{
    space: SpaceInventory;
    utilization: SpaceUtilization;
    potentialSavings: number;
}>>;
/**
 * Generates utilization heatmap data for visualization
 *
 * @param sequelize - Sequelize instance
 * @param buildingId - Building identifier
 * @param date - Date for heatmap
 * @returns Heatmap data structure
 */
export declare function generateUtilizationHeatmap(sequelize: Sequelize, buildingId: string, date: Date): Promise<Array<{
    floorId: string;
    spaces: Array<{
        spaceId: string;
        utilizationRate: number;
        heatmapColor: string;
    }>;
}>>;
/**
 * Creates a new occupancy plan
 *
 * @param sequelize - Sequelize instance
 * @param plan - Occupancy plan details
 * @returns Created plan
 */
export declare function createOccupancyPlan(sequelize: Sequelize, plan: OccupancyPlan): Promise<OccupancyPlan>;
/**
 * Calculates space requirements based on headcount projections
 *
 * @param headcount - Projected headcount
 * @param departmentType - Type of department
 * @param config - Optional configuration
 * @returns Space requirements breakdown
 */
export declare function calculateSpaceRequirements(headcount: number, departmentType: 'clinical' | 'administrative' | 'support', config?: Partial<SpaceManagementConfig>): OccupancyPlan['spaceRequirements'];
/**
 * Evaluates feasibility of an occupancy plan
 *
 * @param sequelize - Sequelize instance
 * @param planId - Plan identifier
 * @returns Feasibility analysis
 */
export declare function evaluateOccupancyPlanFeasibility(sequelize: Sequelize, planId: string): Promise<{
    feasible: boolean;
    availableSpaces: number;
    requiredSpaces: number;
    spaceGap: number;
    estimatedCost: number;
    risks: string[];
    recommendations: string[];
}>;
/**
 * Calculates monthly space chargeback for a department
 *
 * @param sequelize - Sequelize instance
 * @param departmentId - Department identifier
 * @param period - Billing period
 * @param config - Optional configuration
 * @returns Chargeback calculation
 *
 * @example
 * ```typescript
 * const chargeback = await calculateSpaceChargeback(
 *   sequelize,
 *   'dept-cardiology',
 *   new Date('2024-01-01')
 * );
 * console.log(`Total charge: $${chargeback.totalCharge}`);
 * ```
 */
export declare function calculateSpaceChargeback(sequelize: Sequelize, departmentId: string, period: Date, config?: Partial<SpaceManagementConfig>): Promise<SpaceChargeback>;
/**
 * Generates chargeback report for all departments
 *
 * @param sequelize - Sequelize instance
 * @param period - Billing period
 * @returns Array of chargebacks by department
 */
export declare function generateMonthlyChargebackReport(sequelize: Sequelize, period: Date): Promise<SpaceChargeback[]>;
/**
 * Applies chargeback adjustments for corrections or credits
 *
 * @param sequelize - Sequelize instance
 * @param chargebackId - Chargeback identifier
 * @param adjustment - Adjustment amount (positive or negative)
 * @param reason - Reason for adjustment
 * @returns Updated chargeback
 */
export declare function applyChargebackAdjustment(sequelize: Sequelize, chargebackId: string, adjustment: number, reason: string): Promise<void>;
/**
 * Validates space allocation against standards
 *
 * @param sequelize - Sequelize instance
 * @param spaceId - Space identifier
 * @param employeeRole - Employee role level
 * @param standardId - Standard to validate against
 * @returns Validation result
 */
export declare function validateAgainstSpaceStandards(sequelize: Sequelize, spaceId: string, employeeRole: 'executive' | 'director' | 'manager' | 'staff' | 'clinical' | 'support', standardId: string): Promise<{
    compliant: boolean;
    spaceArea: number;
    standardArea: number;
    variance: number;
    variancePercent: number;
    requiresException: boolean;
    violations: string[];
}>;
/**
 * Identifies non-compliant space allocations
 *
 * @param sequelize - Sequelize instance
 * @param buildingId - Building identifier
 * @param standardId - Standard to check against
 * @returns List of non-compliant spaces
 */
export declare function identifyNonCompliantSpaces(sequelize: Sequelize, buildingId: string, standardId: string): Promise<Array<{
    spaceId: string;
    spaceName: string;
    currentArea: number;
    standardArea: number;
    variance: number;
    assignedTo: string;
}>>;
/**
 * Requests exception to space standards
 *
 * @param sequelize - Sequelize instance
 * @param spaceId - Space identifier
 * @param justification - Reason for exception
 * @param requestedBy - Requester
 * @returns Exception request record
 */
export declare function requestSpaceStandardException(sequelize: Sequelize, spaceId: string, justification: string, requestedBy: string): Promise<{
    exceptionId: string;
    status: 'pending';
    requestedAt: Date;
}>;
/**
 * Creates a new stacking plan
 *
 * @param sequelize - Sequelize instance
 * @param plan - Stacking plan details
 * @returns Created plan
 */
export declare function createStackingPlan(sequelize: Sequelize, plan: StackingPlan): Promise<StackingPlan>;
/**
 * Optimizes floor stacking based on adjacency requirements
 *
 * @param sequelize - Sequelize instance
 * @param buildingId - Building identifier
 * @param adjacencyRequirements - List of adjacency requirements
 * @returns Optimized stacking recommendation
 */
export declare function optimizeFloorStacking(sequelize: Sequelize, buildingId: string, adjacencyRequirements: AdjacencyRequirement[]): Promise<{
    recommendedStacking: Map<string, string[]>;
    adjacencyScore: number;
    improvements: string[];
}>;
/**
 * Generates blocking plan (contiguous space groups)
 *
 * @param sequelize - Sequelize instance
 * @param floorId - Floor identifier
 * @returns Blocking recommendations
 */
export declare function generateBlockingPlan(sequelize: Sequelize, floorId: string): Promise<StackingPlan['blocks']>;
/**
 * Generates space forecast based on headcount trends
 *
 * @param sequelize - Sequelize instance
 * @param departmentId - Department identifier
 * @param forecastMonths - Number of months to forecast
 * @returns Space forecast
 *
 * @example
 * ```typescript
 * const forecast = await generateSpaceForecast(sequelize, 'dept-cardiology', 24);
 * if (forecast.monthsUntilCapacity && forecast.monthsUntilCapacity < 12) {
 *   console.log('Need to plan space expansion within 12 months');
 * }
 * ```
 */
export declare function generateSpaceForecast(sequelize: Sequelize, departmentId: string, forecastMonths?: number): Promise<SpaceForecast>;
/**
 * Projects space needs using headcount-to-space ratios
 *
 * @param currentHeadcount - Current headcount
 * @param projectedHeadcount - Projected future headcount
 * @param ratioPerPerson - Square feet per person ratio
 * @returns Projected space requirement
 */
export declare function projectSpaceNeedsByRatio(currentHeadcount: number, projectedHeadcount: number, ratioPerPerson?: number): {
    currentSpaceNeeded: number;
    projectedSpaceNeeded: number;
    additionalSpaceNeeded: number;
    percentIncrease: number;
};
/**
 * Generates comprehensive space optimization recommendations
 *
 * @param sequelize - Sequelize instance
 * @param buildingId - Building identifier
 * @returns Array of optimization recommendations
 *
 * @example
 * ```typescript
 * const recommendations = await generateSpaceOptimizationRecommendations(
 *   sequelize,
 *   'building-001'
 * );
 * recommendations.forEach(rec => {
 *   console.log(`${rec.category}: ${rec.recommendation} - ROI: ${rec.roi}%`);
 * });
 * ```
 */
export declare function generateSpaceOptimizationRecommendations(sequelize: Sequelize, buildingId: string): Promise<SpaceOptimization[]>;
/**
 * Analyzes space efficiency metrics
 *
 * @param sequelize - Sequelize instance
 * @param buildingId - Building identifier
 * @returns Efficiency metrics
 */
export declare function analyzeSpaceEfficiency(sequelize: Sequelize, buildingId: string): Promise<{
    totalUsableArea: number;
    totalOccupiedArea: number;
    totalHeadcount: number;
    averageAreaPerPerson: number;
    buildingUtilization: number;
    efficiencyScore: number;
    benchmarkComparison: number;
}>;
/**
 * Retrieves floor plan with space mappings
 *
 * @param sequelize - Sequelize instance
 * @param floorId - Floor identifier
 * @returns Floor plan with metadata
 */
export declare function getFloorPlan(sequelize: Sequelize, floorId: string): Promise<FloorPlan>;
/**
 * Updates space coordinates in floor plan
 *
 * @param sequelize - Sequelize instance
 * @param floorPlanId - Floor plan identifier
 * @param spaceId - Space identifier
 * @param coordinates - New coordinates
 * @returns Success status
 */
export declare function updateSpaceCoordinates(sequelize: Sequelize, floorPlanId: string, spaceId: string, coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
}): Promise<void>;
/**
 * Generates interactive floor plan visualization data
 *
 * @param sequelize - Sequelize instance
 * @param floorId - Floor identifier
 * @returns Visualization data with occupancy overlay
 */
export declare function generateFloorPlanVisualization(sequelize: Sequelize, floorId: string): Promise<{
    floorPlan: FloorPlan;
    spaces: Array<{
        spaceId: string;
        coordinates: Record<string, number>;
        color: string;
        label: string;
        occupancy: number;
        department: string;
    }>;
}>;
export {};
/**
 * This module provides 45 comprehensive functions for property space management:
 *
 * Space Inventory & Classification (3):
 * - getSpaceInventory
 * - classifySpacesByType
 * - searchAvailableSpaces
 *
 * Space Allocation & Assignment (3):
 * - createSpaceAllocation
 * - getDepartmentAllocations
 * - terminateSpaceAllocation
 *
 * Space Utilization Analysis (3):
 * - calculateSpaceUtilization
 * - identifyUnderutilizedSpaces
 * - generateUtilizationHeatmap
 *
 * Occupancy Planning (3):
 * - createOccupancyPlan
 * - calculateSpaceRequirements
 * - evaluateOccupancyPlanFeasibility
 *
 * Space Chargeback Calculations (3):
 * - calculateSpaceChargeback
 * - generateMonthlyChargebackReport
 * - applyChargebackAdjustment
 *
 * Space Standards Enforcement (3):
 * - validateAgainstSpaceStandards
 * - identifyNonCompliantSpaces
 * - requestSpaceStandardException
 *
 * Stacking & Blocking Plans (3):
 * - createStackingPlan
 * - optimizeFloorStacking
 * - generateBlockingPlan
 *
 * Space Forecasting (2):
 * - generateSpaceForecast
 * - projectSpaceNeedsByRatio
 *
 * Space Optimization Recommendations (2):
 * - generateSpaceOptimizationRecommendations
 * - analyzeSpaceEfficiency
 *
 * Floor Plan Integration (3):
 * - getFloorPlan
 * - updateSpaceCoordinates
 * - generateFloorPlanVisualization
 *
 * All functions include:
 * - Full TypeScript type safety with strict interfaces
 * - Comprehensive JSDoc documentation with examples
 * - Production-ready error handling
 * - Healthcare facility-specific requirements
 * - Performance optimization for large datasets
 * - NestJS and Sequelize integration patterns
 * - Swagger/OpenAPI compatibility
 * - Transaction support where appropriate
 * - HIPAA compliance considerations
 */
//# sourceMappingURL=property-space-management-kit.d.ts.map