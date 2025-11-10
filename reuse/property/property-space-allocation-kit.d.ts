/**
 * LOC: PROP-SPACE-001
 * File: /reuse/property/property-space-allocation-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Property management services
 *   - Facility management modules
 *   - Space planning services
 *   - Workplace management systems
 */
/**
 * File: /reuse/property/property-space-allocation-kit.ts
 * Locator: WC-UTL-SPACE-001
 * Purpose: Comprehensive Workplace Space Allocation Utilities - Desk assignment, hoteling, space optimization
 *
 * Upstream: Independent utility module for workplace space allocation management
 * Downstream: ../backend/*, property services, facility management, space planning modules
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40 utility functions for space allocation, hoteling, desk assignment, move management, optimization
 *
 * LLM Context: Production-grade workplace space allocation utilities for White Cross healthcare system.
 * Provides desk and workspace assignment, department space allocation, hoteling and hot-desking management,
 * space reservation systems, move management, space request workflows, allocation optimization algorithms,
 * cost per seat calculations, space utilization reporting, and flexible workspace management.
 */
import { Model, Sequelize, Optional } from 'sequelize';
interface SpaceAllocation {
    id: number;
    spaceId: string;
    userId?: string;
    departmentId?: string;
    allocationType: 'permanent' | 'temporary' | 'shared' | 'hoteling' | 'flexible';
    startDate: Date;
    endDate?: Date;
    status: 'active' | 'pending' | 'expired' | 'cancelled';
    priority: number;
    metadata?: Record<string, any>;
}
interface WorkspaceConfig {
    id: string;
    type: 'desk' | 'office' | 'cubicle' | 'meeting-room' | 'collaborative-space' | 'phone-booth';
    capacity: number;
    floor: string;
    building: string;
    zone: string;
    amenities: string[];
    area: number;
    costPerMonth: number;
    isAvailable: boolean;
    accessibility: boolean;
    features: Record<string, any>;
}
interface DeskAssignment {
    deskId: string;
    userId: string;
    assignmentType: 'permanent' | 'hot-desk' | 'hotel' | 'reserved';
    startTime: Date;
    endTime?: Date;
    preferences: Record<string, any>;
}
interface HotelingReservation {
    id: string;
    workspaceId: string;
    userId: string;
    reservationDate: Date;
    startTime: Date;
    endTime: Date;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
    checkInTime?: Date;
    checkOutTime?: Date;
    amenitiesRequested: string[];
}
interface DepartmentSpaceRequirement {
    departmentId: string;
    departmentName: string;
    headcount: number;
    requiredDesks: number;
    requiredMeetingRooms: number;
    requiredPrivateOffices: number;
    requiredCollaborativeSpaces: number;
    growthProjection: number;
    budgetConstraint: number;
    preferredFloors: string[];
    specialRequirements: string[];
}
interface MoveRequest {
    id: string;
    requesterId: string;
    currentSpaceId: string;
    targetSpaceId?: string;
    reason: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'approved' | 'scheduled' | 'in-progress' | 'completed' | 'rejected';
    requestedDate: Date;
    scheduledDate?: Date;
    completedDate?: Date;
    approvers: string[];
    cost?: number;
}
interface SpaceUtilizationMetrics {
    spaceId: string;
    occupancyRate: number;
    averageDailyUse: number;
    peakUsageTimes: {
        hour: number;
        usage: number;
    }[];
    underutilizationScore: number;
    utilizationTrend: 'increasing' | 'stable' | 'decreasing';
    costEfficiency: number;
}
interface AllocationOptimizationResult {
    recommendedAllocations: SpaceAllocation[];
    costSavings: number;
    utilizationImprovement: number;
    spacesFreed: string[];
    reassignments: Array<{
        userId: string;
        fromSpace: string;
        toSpace: string;
        reason: string;
    }>;
    implementationPlan: string[];
}
interface CostPerSeatAnalysis {
    spaceId: string;
    monthlyCost: number;
    annualCost: number;
    costPerSeat: number;
    costPerSquareFoot: number;
    utilizationAdjustedCost: number;
    benchmarkComparison: number;
}
interface SpaceRequest {
    id: string;
    requesterId: string;
    requestType: 'new-space' | 'modification' | 'additional-capacity' | 'relocation';
    justification: string;
    requiredCapacity: number;
    requiredFeatures: string[];
    timeline: Date;
    status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'fulfilled';
    approvalWorkflow: string[];
}
interface FlexibleWorkspacePool {
    id: string;
    name: string;
    workspaces: string[];
    eligibleUsers: string[];
    eligibleDepartments: string[];
    bookingRules: {
        maxAdvanceBookingDays: number;
        maxConsecutiveDays: number;
        requiresApproval: boolean;
        blackoutDates: Date[];
    };
    utilizationTarget: number;
}
interface SpaceAllocationRule {
    id: string;
    name: string;
    priority: number;
    conditions: Record<string, any>;
    actions: Record<string, any>;
    enabled: boolean;
}
interface OccupancySensor {
    sensorId: string;
    spaceId: string;
    isOccupied: boolean;
    lastUpdate: Date;
    confidenceLevel: number;
}
interface SpaceAllocationAttributes {
    id: number;
    spaceId: string;
    userId: string | null;
    departmentId: string | null;
    allocationType: 'permanent' | 'temporary' | 'shared' | 'hoteling' | 'flexible';
    startDate: Date;
    endDate: Date | null;
    status: 'active' | 'pending' | 'expired' | 'cancelled';
    priority: number;
    costPerMonth: number;
    utilizationTarget: number;
    actualUtilization: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
interface SpaceAllocationCreationAttributes extends Optional<SpaceAllocationAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export declare class SpaceAllocationModel extends Model<SpaceAllocationAttributes, SpaceAllocationCreationAttributes> implements SpaceAllocationAttributes {
    id: number;
    spaceId: string;
    userId: string | null;
    departmentId: string | null;
    allocationType: 'permanent' | 'temporary' | 'shared' | 'hoteling' | 'flexible';
    startDate: Date;
    endDate: Date | null;
    status: 'active' | 'pending' | 'expired' | 'cancelled';
    priority: number;
    costPerMonth: number;
    utilizationTarget: number;
    actualUtilization: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof SpaceAllocationModel;
}
interface HotelingReservationAttributes {
    id: number;
    workspaceId: string;
    userId: string;
    reservationDate: Date;
    startTime: Date;
    endTime: Date;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no-show';
    checkInTime: Date | null;
    checkOutTime: Date | null;
    amenitiesRequested: string[];
    cost: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
interface HotelingReservationCreationAttributes extends Optional<HotelingReservationAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export declare class HotelingReservationModel extends Model<HotelingReservationAttributes, HotelingReservationCreationAttributes> implements HotelingReservationAttributes {
    id: number;
    workspaceId: string;
    userId: string;
    reservationDate: Date;
    startTime: Date;
    endTime: Date;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no-show';
    checkInTime: Date | null;
    checkOutTime: Date | null;
    amenitiesRequested: string[];
    cost: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof HotelingReservationModel;
}
interface MoveRequestAttributes {
    id: number;
    requesterId: string;
    currentSpaceId: string;
    targetSpaceId: string | null;
    reason: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'approved' | 'scheduled' | 'in-progress' | 'completed' | 'rejected';
    requestedDate: Date;
    scheduledDate: Date | null;
    completedDate: Date | null;
    approvers: string[];
    cost: number;
    impactScore: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
interface MoveRequestCreationAttributes extends Optional<MoveRequestAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
export declare class MoveRequestModel extends Model<MoveRequestAttributes, MoveRequestCreationAttributes> implements MoveRequestAttributes {
    id: number;
    requesterId: string;
    currentSpaceId: string;
    targetSpaceId: string | null;
    reason: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'approved' | 'scheduled' | 'in-progress' | 'completed' | 'rejected';
    requestedDate: Date;
    scheduledDate: Date | null;
    completedDate: Date | null;
    approvers: string[];
    cost: number;
    impactScore: number;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    static initModel(sequelize: Sequelize): typeof MoveRequestModel;
}
/**
 * Assigns a desk to a user with specified assignment type.
 *
 * @param {DeskAssignment} assignment - Desk assignment details
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<SpaceAllocation>} Created allocation
 *
 * @example
 * ```typescript
 * const allocation = await assignDeskToUser(
 *   {
 *     deskId: 'DESK-3F-042',
 *     userId: 'USR-12345',
 *     assignmentType: 'permanent',
 *     startTime: new Date(),
 *     preferences: { window: true, standing: false }
 *   },
 *   sequelize
 * );
 * ```
 */
export declare const assignDeskToUser: (assignment: DeskAssignment, sequelize: Sequelize) => Promise<SpaceAllocation>;
/**
 * Finds available desks matching user preferences and requirements.
 *
 * @param {object} criteria - Search criteria
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<WorkspaceConfig[]>} Available desks
 *
 * @example
 * ```typescript
 * const desks = await findAvailableDesks(
 *   {
 *     floor: '3',
 *     building: 'Main',
 *     accessibility: true,
 *     amenities: ['standing-desk', 'dual-monitor'],
 *     startDate: new Date('2025-01-01')
 *   },
 *   sequelize
 * );
 * ```
 */
export declare const findAvailableDesks: (criteria: {
    floor?: string;
    building?: string;
    zone?: string;
    accessibility?: boolean;
    amenities?: string[];
    startDate: Date;
    endDate?: Date;
    minArea?: number;
}, sequelize: Sequelize) => Promise<WorkspaceConfig[]>;
/**
 * Reassigns a desk from one user to another.
 *
 * @param {string} deskId - Desk identifier
 * @param {string} fromUserId - Current user
 * @param {string} toUserId - New user
 * @param {Date} effectiveDate - Effective date of reassignment
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ oldAllocation: SpaceAllocation; newAllocation: SpaceAllocation }>}
 *
 * @example
 * ```typescript
 * const result = await reassignDesk(
 *   'DESK-3F-042',
 *   'USR-12345',
 *   'USR-67890',
 *   new Date('2025-02-01'),
 *   sequelize
 * );
 * ```
 */
export declare const reassignDesk: (deskId: string, fromUserId: string, toUserId: string, effectiveDate: Date, sequelize: Sequelize) => Promise<{
    oldAllocation: SpaceAllocation;
    newAllocation: SpaceAllocation;
}>;
/**
 * Calculates optimal desk assignments for a list of users based on preferences and constraints.
 *
 * @param {string[]} userIds - User identifiers
 * @param {WorkspaceConfig[]} availableDesks - Available desks
 * @param {Record<string, any>} preferences - User preferences map
 * @returns {Promise<Map<string, string>>} User to desk mapping
 *
 * @example
 * ```typescript
 * const assignments = await calculateOptimalDeskAssignments(
 *   ['USR-001', 'USR-002', 'USR-003'],
 *   availableDesks,
 *   {
 *     'USR-001': { floor: '3', window: true },
 *     'USR-002': { accessibility: true },
 *     'USR-003': { zone: 'quiet' }
 *   }
 * );
 * ```
 */
export declare const calculateOptimalDeskAssignments: (userIds: string[], availableDesks: WorkspaceConfig[], preferences: Record<string, any>) => Promise<Map<string, string>>;
/**
 * Releases a desk assignment, making it available for reassignment.
 *
 * @param {string} deskId - Desk identifier
 * @param {string} userId - User identifier
 * @param {Date} releaseDate - Release date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<SpaceAllocation>} Updated allocation
 *
 * @example
 * ```typescript
 * const released = await releaseDeskAssignment(
 *   'DESK-3F-042',
 *   'USR-12345',
 *   new Date(),
 *   sequelize
 * );
 * ```
 */
export declare const releaseDeskAssignment: (deskId: string, userId: string, releaseDate: Date, sequelize: Sequelize) => Promise<SpaceAllocation>;
/**
 * Allocates space to a department based on requirements and constraints.
 *
 * @param {DepartmentSpaceRequirement} requirements - Department space requirements
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<SpaceAllocation[]>} Created allocations
 *
 * @example
 * ```typescript
 * const allocations = await allocateSpaceToDepartment(
 *   {
 *     departmentId: 'DEPT-ENG',
 *     departmentName: 'Engineering',
 *     headcount: 50,
 *     requiredDesks: 45,
 *     requiredMeetingRooms: 3,
 *     requiredPrivateOffices: 5,
 *     requiredCollaborativeSpaces: 2,
 *     growthProjection: 20,
 *     budgetConstraint: 50000,
 *     preferredFloors: ['3', '4'],
 *     specialRequirements: ['high-bandwidth', 'quiet-zones']
 *   },
 *   sequelize
 * );
 * ```
 */
export declare const allocateSpaceToDepartment: (requirements: DepartmentSpaceRequirement, sequelize: Sequelize) => Promise<SpaceAllocation[]>;
/**
 * Calculates department space utilization and compliance with allocation.
 *
 * @param {string} departmentId - Department identifier
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Utilization analysis
 *
 * @example
 * ```typescript
 * const analysis = await analyzeDepartmentSpaceUtilization(
 *   'DEPT-ENG',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * // Returns: { allocated: 50, utilized: 42, utilizationRate: 84, compliance: true }
 * ```
 */
export declare const analyzeDepartmentSpaceUtilization: (departmentId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<{
    allocated: number;
    utilized: number;
    utilizationRate: number;
    compliance: boolean;
    recommendations: string[];
}>;
/**
 * Redistributes department space based on changing headcount and needs.
 *
 * @param {string} departmentId - Department identifier
 * @param {number} newHeadcount - New headcount
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Redistribution plan
 *
 * @example
 * ```typescript
 * const plan = await redistributeDepartmentSpace(
 *   'DEPT-ENG',
 *   65,
 *   sequelize
 * );
 * ```
 */
export declare const redistributeDepartmentSpace: (departmentId: string, newHeadcount: number, sequelize: Sequelize) => Promise<{
    currentCapacity: number;
    requiredCapacity: number;
    surplus: number;
    deficit: number;
    actions: string[];
}>;
/**
 * Generates department space allocation forecast based on growth projections.
 *
 * @param {string} departmentId - Department identifier
 * @param {number} growthRate - Annual growth rate (percentage)
 * @param {number} forecastYears - Number of years to forecast
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array>} Yearly forecast
 *
 * @example
 * ```typescript
 * const forecast = await forecastDepartmentSpaceNeeds(
 *   'DEPT-ENG',
 *   15,
 *   3,
 *   sequelize
 * );
 * // Returns 3-year space requirement forecast
 * ```
 */
export declare const forecastDepartmentSpaceNeeds: (departmentId: string, growthRate: number, forecastYears: number, sequelize: Sequelize) => Promise<Array<{
    year: number;
    projectedHeadcount: number;
    requiredDesks: number;
    requiredMeetingRooms: number;
    estimatedCost: number;
}>>;
/**
 * Creates a hoteling reservation for a workspace.
 *
 * @param {HotelingReservation} reservation - Reservation details
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<HotelingReservation>} Created reservation
 *
 * @example
 * ```typescript
 * const reservation = await createHotelingReservation(
 *   {
 *     id: 'RSV-12345',
 *     workspaceId: 'HOTDESK-3F-010',
 *     userId: 'USR-67890',
 *     reservationDate: new Date('2025-01-15'),
 *     startTime: new Date('2025-01-15T09:00:00'),
 *     endTime: new Date('2025-01-15T17:00:00'),
 *     status: 'confirmed',
 *     amenitiesRequested: ['dual-monitor', 'whiteboard']
 *   },
 *   sequelize
 * );
 * ```
 */
export declare const createHotelingReservation: (reservation: Omit<HotelingReservation, "checkInTime" | "checkOutTime">, sequelize: Sequelize) => Promise<HotelingReservation>;
/**
 * Checks in a user to their hoteling reservation.
 *
 * @param {string} reservationId - Reservation identifier
 * @param {Date} checkInTime - Check-in timestamp
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<HotelingReservation>} Updated reservation
 *
 * @example
 * ```typescript
 * const checkedIn = await checkInHotelingReservation(
 *   'RSV-12345',
 *   new Date(),
 *   sequelize
 * );
 * ```
 */
export declare const checkInHotelingReservation: (reservationId: string, checkInTime: Date, sequelize: Sequelize) => Promise<HotelingReservation>;
/**
 * Checks out a user from their hoteling reservation.
 *
 * @param {string} reservationId - Reservation identifier
 * @param {Date} checkOutTime - Check-out timestamp
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<HotelingReservation>} Updated reservation
 *
 * @example
 * ```typescript
 * const checkedOut = await checkOutHotelingReservation(
 *   'RSV-12345',
 *   new Date(),
 *   sequelize
 * );
 * ```
 */
export declare const checkOutHotelingReservation: (reservationId: string, checkOutTime: Date, sequelize: Sequelize) => Promise<HotelingReservation>;
/**
 * Finds available hot desks for a specific time period.
 *
 * @param {Date} startTime - Start time
 * @param {Date} endTime - End time
 * @param {object} filters - Additional filters
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<WorkspaceConfig[]>} Available hot desks
 *
 * @example
 * ```typescript
 * const available = await findAvailableHotDesks(
 *   new Date('2025-01-15T09:00:00'),
 *   new Date('2025-01-15T17:00:00'),
 *   { floor: '3', amenities: ['dual-monitor'] },
 *   sequelize
 * );
 * ```
 */
export declare const findAvailableHotDesks: (startTime: Date, endTime: Date, filters: {
    floor?: string;
    building?: string;
    amenities?: string[];
}, sequelize: Sequelize) => Promise<WorkspaceConfig[]>;
/**
 * Calculates hoteling utilization metrics for a workspace or pool.
 *
 * @param {string} workspaceId - Workspace identifier (or pool ID)
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Utilization metrics
 *
 * @example
 * ```typescript
 * const metrics = await calculateHotelingUtilization(
 *   'HOTDESK-POOL-3F',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * ```
 */
export declare const calculateHotelingUtilization: (workspaceId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<{
    totalReservations: number;
    completedReservations: number;
    noShowRate: number;
    averageSessionDuration: number;
    peakUsageTimes: Array<{
        hour: number;
        count: number;
    }>;
    utilizationRate: number;
}>;
/**
 * Validates if a space reservation request is permissible.
 *
 * @param {object} request - Reservation request
 * @param {FlexibleWorkspacePool} pool - Workspace pool configuration
 * @returns {Promise<{ valid: boolean; errors: string[] }>}
 *
 * @example
 * ```typescript
 * const validation = await validateReservationRequest(
 *   { userId: 'USR-123', startDate: new Date(), days: 3 },
 *   workspacePool
 * );
 * ```
 */
export declare const validateReservationRequest: (request: {
    userId: string;
    startDate: Date;
    endDate: Date;
    workspaceId: string;
}, pool: FlexibleWorkspacePool) => Promise<{
    valid: boolean;
    errors: string[];
}>;
/**
 * Cancels a space reservation with optional penalty calculation.
 *
 * @param {string} reservationId - Reservation identifier
 * @param {string} reason - Cancellation reason
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ reservation: HotelingReservation; penalty: number }>}
 *
 * @example
 * ```typescript
 * const result = await cancelReservation(
 *   'RSV-12345',
 *   'Schedule conflict',
 *   sequelize
 * );
 * ```
 */
export declare const cancelReservation: (reservationId: string, reason: string, sequelize: Sequelize) => Promise<{
    reservation: HotelingReservation;
    penalty: number;
}>;
/**
 * Extends an existing reservation if the space is available.
 *
 * @param {string} reservationId - Reservation identifier
 * @param {Date} newEndTime - New end time
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<HotelingReservation>} Updated reservation
 *
 * @example
 * ```typescript
 * const extended = await extendReservation(
 *   'RSV-12345',
 *   new Date('2025-01-15T19:00:00'),
 *   sequelize
 * );
 * ```
 */
export declare const extendReservation: (reservationId: string, newEndTime: Date, sequelize: Sequelize) => Promise<HotelingReservation>;
/**
 * Generates a recurring reservation series for regular workspace usage.
 *
 * @param {object} pattern - Recurrence pattern
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<HotelingReservation[]>} Created reservations
 *
 * @example
 * ```typescript
 * const series = await createRecurringReservation(
 *   {
 *     userId: 'USR-123',
 *     workspaceId: 'DESK-3F-010',
 *     pattern: 'weekly',
 *     daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
 *     startTime: '09:00',
 *     endTime: '17:00',
 *     startDate: new Date('2025-01-15'),
 *     endDate: new Date('2025-03-15')
 *   },
 *   sequelize
 * );
 * ```
 */
export declare const createRecurringReservation: (pattern: {
    userId: string;
    workspaceId: string;
    pattern: "daily" | "weekly" | "monthly";
    daysOfWeek?: number[];
    startTime: string;
    endTime: string;
    startDate: Date;
    endDate: Date;
}, sequelize: Sequelize) => Promise<HotelingReservation[]>;
/**
 * Creates a move request for space relocation.
 *
 * @param {MoveRequest} request - Move request details
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<MoveRequest>} Created move request
 *
 * @example
 * ```typescript
 * const moveRequest = await createMoveRequest(
 *   {
 *     id: 'MOVE-12345',
 *     requesterId: 'USR-67890',
 *     currentSpaceId: 'DESK-2F-020',
 *     targetSpaceId: 'DESK-3F-015',
 *     reason: 'Closer to team members',
 *     priority: 'medium',
 *     status: 'pending',
 *     requestedDate: new Date(),
 *     approvers: ['MGR-001']
 *   },
 *   sequelize
 * );
 * ```
 */
export declare const createMoveRequest: (request: Omit<MoveRequest, "scheduledDate" | "completedDate" | "cost">, sequelize: Sequelize) => Promise<MoveRequest>;
/**
 * Approves or rejects a move request with optional comments.
 *
 * @param {string} requestId - Move request identifier
 * @param {string} approverId - Approver identifier
 * @param {boolean} approved - Approval decision
 * @param {string} comments - Approval comments
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<MoveRequest>} Updated move request
 *
 * @example
 * ```typescript
 * const approved = await approveMoveRequest(
 *   'MOVE-12345',
 *   'MGR-001',
 *   true,
 *   'Approved - valid business justification',
 *   sequelize
 * );
 * ```
 */
export declare const approveMoveRequest: (requestId: string, approverId: string, approved: boolean, comments: string, sequelize: Sequelize) => Promise<MoveRequest>;
/**
 * Schedules an approved move request for execution.
 *
 * @param {string} requestId - Move request identifier
 * @param {Date} scheduledDate - Scheduled move date
 * @param {number} estimatedCost - Estimated move cost
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<MoveRequest>} Updated move request
 *
 * @example
 * ```typescript
 * const scheduled = await scheduleMoveRequest(
 *   'MOVE-12345',
 *   new Date('2025-02-01'),
 *   250,
 *   sequelize
 * );
 * ```
 */
export declare const scheduleMoveRequest: (requestId: string, scheduledDate: Date, estimatedCost: number, sequelize: Sequelize) => Promise<MoveRequest>;
/**
 * Completes a move request and updates space allocations accordingly.
 *
 * @param {string} requestId - Move request identifier
 * @param {Date} completedDate - Move completion date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ request: MoveRequest; newAllocation: SpaceAllocation }>}
 *
 * @example
 * ```typescript
 * const result = await completeMoveRequest(
 *   'MOVE-12345',
 *   new Date(),
 *   sequelize
 * );
 * ```
 */
export declare const completeMoveRequest: (requestId: string, completedDate: Date, sequelize: Sequelize) => Promise<{
    request: MoveRequest;
    newAllocation: SpaceAllocation | null;
}>;
/**
 * Calculates the impact score for a move request based on multiple factors.
 *
 * @param {MoveRequest} request - Move request
 * @param {object} context - Additional context
 * @returns {Promise<number>} Impact score (0-100)
 *
 * @example
 * ```typescript
 * const impact = await calculateMoveImpact(
 *   moveRequest,
 *   { teamSize: 5, recentMoves: 2, businessCritical: true }
 * );
 * ```
 */
export declare const calculateMoveImpact: (request: MoveRequest, context: {
    teamSize: number;
    recentMoves: number;
    businessCritical: boolean;
}) => Promise<number>;
/**
 * Creates a new space request with workflow initialization.
 *
 * @param {SpaceRequest} request - Space request details
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<SpaceRequest>} Created space request
 *
 * @example
 * ```typescript
 * const spaceRequest = await createSpaceRequest(
 *   {
 *     id: 'SREQ-12345',
 *     requesterId: 'USR-67890',
 *     requestType: 'additional-capacity',
 *     justification: 'Team expansion - 10 new hires',
 *     requiredCapacity: 10,
 *     requiredFeatures: ['collaborative-spaces', 'meeting-rooms'],
 *     timeline: new Date('2025-03-01'),
 *     status: 'draft',
 *     approvalWorkflow: ['MGR-001', 'DIR-002', 'CFO-001']
 *   },
 *   sequelize
 * );
 * ```
 */
export declare const createSpaceRequest: (request: SpaceRequest, sequelize: Sequelize) => Promise<SpaceRequest>;
/**
 * Routes a space request through the approval workflow.
 *
 * @param {string} requestId - Space request identifier
 * @param {string} currentApproverId - Current approver
 * @param {boolean} approved - Approval decision
 * @param {string} comments - Approval comments
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<SpaceRequest>} Updated space request
 *
 * @example
 * ```typescript
 * const updated = await routeSpaceRequestApproval(
 *   'SREQ-12345',
 *   'MGR-001',
 *   true,
 *   'Approved - valid business need',
 *   sequelize
 * );
 * ```
 */
export declare const routeSpaceRequestApproval: (requestId: string, currentApproverId: string, approved: boolean, comments: string, sequelize: Sequelize) => Promise<SpaceRequest>;
/**
 * Evaluates space requests against available inventory and budget.
 *
 * @param {string} requestId - Space request identifier
 * @param {object} constraints - Evaluation constraints
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Evaluation result
 *
 * @example
 * ```typescript
 * const evaluation = await evaluateSpaceRequest(
 *   'SREQ-12345',
 *   { maxBudget: 50000, preferredFloors: ['3', '4'], deadline: new Date('2025-03-01') },
 *   sequelize
 * );
 * ```
 */
export declare const evaluateSpaceRequest: (requestId: string, constraints: {
    maxBudget: number;
    preferredFloors: string[];
    deadline: Date;
}, sequelize: Sequelize) => Promise<{
    feasible: boolean;
    estimatedCost: number;
    availableOptions: string[];
    timeline: Date;
    recommendations: string[];
}>;
/**
 * Fulfills an approved space request by allocating resources.
 *
 * @param {string} requestId - Space request identifier
 * @param {string[]} allocatedSpaceIds - Allocated space identifiers
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<{ request: SpaceRequest; allocations: SpaceAllocation[] }>}
 *
 * @example
 * ```typescript
 * const result = await fulfillSpaceRequest(
 *   'SREQ-12345',
 *   ['DESK-3F-010', 'DESK-3F-011', 'DESK-3F-012'],
 *   sequelize
 * );
 * ```
 */
export declare const fulfillSpaceRequest: (requestId: string, allocatedSpaceIds: string[], sequelize: Sequelize) => Promise<{
    request: SpaceRequest;
    allocations: SpaceAllocation[];
}>;
/**
 * Analyzes current space allocations and identifies optimization opportunities.
 *
 * @param {object} criteria - Optimization criteria
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<AllocationOptimizationResult>}
 *
 * @example
 * ```typescript
 * const optimization = await optimizeSpaceAllocations(
 *   {
 *     targetUtilization: 85,
 *     costReductionTarget: 15,
 *     considerHotDesking: true
 *   },
 *   sequelize
 * );
 * ```
 */
export declare const optimizeSpaceAllocations: (criteria: {
    targetUtilization: number;
    costReductionTarget: number;
    considerHotDesking: boolean;
}, sequelize: Sequelize) => Promise<AllocationOptimizationResult>;
/**
 * Identifies underutilized spaces that could be repurposed or deallocated.
 *
 * @param {number} utilizationThreshold - Utilization threshold percentage
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<SpaceUtilizationMetrics[]>}
 *
 * @example
 * ```typescript
 * const underutilized = await identifyUnderutilizedSpaces(60, sequelize);
 * ```
 */
export declare const identifyUnderutilizedSpaces: (utilizationThreshold: number, sequelize: Sequelize) => Promise<SpaceUtilizationMetrics[]>;
/**
 * Suggests space consolidation opportunities to reduce footprint and costs.
 *
 * @param {string} departmentId - Department identifier
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Consolidation recommendations
 *
 * @example
 * ```typescript
 * const consolidation = await suggestSpaceConsolidation('DEPT-ENG', sequelize);
 * ```
 */
export declare const suggestSpaceConsolidation: (departmentId: string, sequelize: Sequelize) => Promise<{
    currentSpaces: number;
    recommendedSpaces: number;
    potentialSavings: number;
    consolidationPlan: string[];
}>;
/**
 * Balances space distribution across floors and buildings for optimal efficiency.
 *
 * @param {object} constraints - Balancing constraints
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Rebalancing plan
 *
 * @example
 * ```typescript
 * const plan = await rebalanceSpaceDistribution(
 *   { maxPerFloor: 50, preferClustering: true },
 *   sequelize
 * );
 * ```
 */
export declare const rebalanceSpaceDistribution: (constraints: {
    maxPerFloor: number;
    preferClustering: boolean;
}, sequelize: Sequelize) => Promise<{
    currentDistribution: Record<string, number>;
    targetDistribution: Record<string, number>;
    movesRequired: number;
    efficiency: number;
}>;
/**
 * Calculates comprehensive cost per seat metrics for a space or pool.
 *
 * @param {string} spaceId - Space identifier
 * @param {object} costs - Cost breakdown
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<CostPerSeatAnalysis>}
 *
 * @example
 * ```typescript
 * const analysis = await calculateCostPerSeat(
 *   'FLOOR-3-ZONE-A',
 *   { rent: 25000, utilities: 3000, maintenance: 2000, amenities: 1500 },
 *   sequelize
 * );
 * ```
 */
export declare const calculateCostPerSeat: (spaceId: string, costs: {
    rent: number;
    utilities: number;
    maintenance: number;
    amenities: number;
}, sequelize: Sequelize) => Promise<CostPerSeatAnalysis>;
/**
 * Compares cost efficiency across multiple spaces or departments.
 *
 * @param {string[]} spaceIds - Space identifiers to compare
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object[]>} Comparative analysis
 *
 * @example
 * ```typescript
 * const comparison = await compareSpaceCostEfficiency(
 *   ['FLOOR-2', 'FLOOR-3', 'FLOOR-4'],
 *   sequelize
 * );
 * ```
 */
export declare const compareSpaceCostEfficiency: (spaceIds: string[], sequelize: Sequelize) => Promise<Array<{
    spaceId: string;
    costPerSeat: number;
    utilization: number;
    efficiency: number;
    rank: number;
}>>;
/**
 * Projects future cost per seat based on growth and market trends.
 *
 * @param {string} spaceId - Space identifier
 * @param {object} projections - Growth and cost projections
 * @returns {Promise<object[]>} Multi-year cost projection
 *
 * @example
 * ```typescript
 * const forecast = await projectCostPerSeat(
 *   'FLOOR-3',
 *   { headcountGrowth: 10, rentIncrease: 3, years: 3 }
 * );
 * ```
 */
export declare const projectCostPerSeat: (spaceId: string, projections: {
    headcountGrowth: number;
    rentIncrease: number;
    years: number;
}) => Promise<Array<{
    year: number;
    seats: number;
    monthlyCost: number;
    costPerSeat: number;
}>>;
/**
 * Generates comprehensive space allocation report for a time period.
 *
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Space allocation report
 *
 * @example
 * ```typescript
 * const report = await generateSpaceAllocationReport(
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * ```
 */
export declare const generateSpaceAllocationReport: (startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<{
    totalAllocations: number;
    allocationsByType: Record<string, number>;
    utilizationRate: number;
    costSummary: object;
    trends: object;
}>;
/**
 * Tracks space allocation metrics over time for trend analysis.
 *
 * @param {string} spaceId - Space identifier (or 'all')
 * @param {string} interval - Time interval ('daily', 'weekly', 'monthly')
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Array>} Time-series metrics
 *
 * @example
 * ```typescript
 * const trends = await trackAllocationMetrics(
 *   'FLOOR-3',
 *   'weekly',
 *   new Date('2024-10-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * ```
 */
export declare const trackAllocationMetrics: (spaceId: string, interval: "daily" | "weekly" | "monthly", startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<Array<{
    period: Date;
    allocations: number;
    utilization: number;
    cost: number;
}>>;
/**
 * Exports space allocation data in various formats for external analysis.
 *
 * @param {object} filters - Export filters
 * @param {string} format - Export format ('csv', 'json', 'excel')
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<Buffer | string>} Exported data
 *
 * @example
 * ```typescript
 * const csvData = await exportAllocationData(
 *   { departmentId: 'DEPT-ENG', status: 'active' },
 *   'csv',
 *   sequelize
 * );
 * ```
 */
export declare const exportAllocationData: (filters: {
    departmentId?: string;
    status?: string;
    allocationType?: string;
}, format: "csv" | "json" | "excel", sequelize: Sequelize) => Promise<string>;
/**
 * Creates a flexible workspace pool with booking rules and eligibility.
 *
 * @param {FlexibleWorkspacePool} pool - Workspace pool configuration
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<FlexibleWorkspacePool>} Created pool
 *
 * @example
 * ```typescript
 * const pool = await createFlexibleWorkspacePool(
 *   {
 *     id: 'FLEX-POOL-3F',
 *     name: 'Floor 3 Hot Desk Pool',
 *     workspaces: ['HOTDESK-3F-001', 'HOTDESK-3F-002', 'HOTDESK-3F-003'],
 *     eligibleUsers: ['USR-*'],
 *     eligibleDepartments: ['DEPT-ENG', 'DEPT-PRODUCT'],
 *     bookingRules: {
 *       maxAdvanceBookingDays: 14,
 *       maxConsecutiveDays: 5,
 *       requiresApproval: false,
 *       blackoutDates: []
 *     },
 *     utilizationTarget: 75
 *   },
 *   sequelize
 * );
 * ```
 */
export declare const createFlexibleWorkspacePool: (pool: FlexibleWorkspacePool, sequelize: Sequelize) => Promise<FlexibleWorkspacePool>;
/**
 * Assigns users to flexible workspace pools based on work patterns.
 *
 * @param {string[]} userIds - User identifiers
 * @param {object} workPatterns - Work pattern analysis
 * @param {FlexibleWorkspacePool[]} pools - Available pools
 * @returns {Promise<Map<string, string>>} User to pool mapping
 *
 * @example
 * ```typescript
 * const assignments = await assignUsersToFlexPools(
 *   ['USR-001', 'USR-002', 'USR-003'],
 *   { 'USR-001': { daysPerWeek: 2, preferredFloor: '3' } },
 *   availablePools
 * );
 * ```
 */
export declare const assignUsersToFlexPools: (userIds: string[], workPatterns: Record<string, {
    daysPerWeek: number;
    preferredFloor?: string;
}>, pools: FlexibleWorkspacePool[]) => Promise<Map<string, string>>;
/**
 * Manages pool capacity and enforces booking limits.
 *
 * @param {string} poolId - Pool identifier
 * @param {Date} date - Date to check
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Capacity status
 *
 * @example
 * ```typescript
 * const capacity = await managePoolCapacity(
 *   'FLEX-POOL-3F',
 *   new Date('2025-01-15'),
 *   sequelize
 * );
 * ```
 */
export declare const managePoolCapacity: (poolId: string, date: Date, sequelize: Sequelize) => Promise<{
    totalCapacity: number;
    bookedSeats: number;
    availableSeats: number;
    utilizationRate: number;
    acceptingReservations: boolean;
}>;
/**
 * Monitors flexible workspace usage patterns and suggests optimizations.
 *
 * @param {string} poolId - Pool identifier
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Promise<object>} Usage analysis and recommendations
 *
 * @example
 * ```typescript
 * const analysis = await monitorFlexWorkspaceUsage(
 *   'FLEX-POOL-3F',
 *   new Date('2025-01-01'),
 *   new Date('2025-01-31'),
 *   sequelize
 * );
 * ```
 */
export declare const monitorFlexWorkspaceUsage: (poolId: string, startDate: Date, endDate: Date, sequelize: Sequelize) => Promise<{
    averageUtilization: number;
    peakDays: string[];
    lowUsageDays: string[];
    userDistribution: Record<string, number>;
    recommendations: string[];
}>;
export { SpaceAllocation, WorkspaceConfig, DeskAssignment, HotelingReservation, DepartmentSpaceRequirement, MoveRequest, SpaceUtilizationMetrics, AllocationOptimizationResult, CostPerSeatAnalysis, SpaceRequest, FlexibleWorkspacePool, SpaceAllocationRule, OccupancySensor, };
//# sourceMappingURL=property-space-allocation-kit.d.ts.map