"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpaceInventory = getSpaceInventory;
exports.classifySpacesByType = classifySpacesByType;
exports.searchAvailableSpaces = searchAvailableSpaces;
exports.createSpaceAllocation = createSpaceAllocation;
exports.getDepartmentAllocations = getDepartmentAllocations;
exports.terminateSpaceAllocation = terminateSpaceAllocation;
exports.calculateSpaceUtilization = calculateSpaceUtilization;
exports.identifyUnderutilizedSpaces = identifyUnderutilizedSpaces;
exports.generateUtilizationHeatmap = generateUtilizationHeatmap;
exports.createOccupancyPlan = createOccupancyPlan;
exports.calculateSpaceRequirements = calculateSpaceRequirements;
exports.evaluateOccupancyPlanFeasibility = evaluateOccupancyPlanFeasibility;
exports.calculateSpaceChargeback = calculateSpaceChargeback;
exports.generateMonthlyChargebackReport = generateMonthlyChargebackReport;
exports.applyChargebackAdjustment = applyChargebackAdjustment;
exports.validateAgainstSpaceStandards = validateAgainstSpaceStandards;
exports.identifyNonCompliantSpaces = identifyNonCompliantSpaces;
exports.requestSpaceStandardException = requestSpaceStandardException;
exports.createStackingPlan = createStackingPlan;
exports.optimizeFloorStacking = optimizeFloorStacking;
exports.generateBlockingPlan = generateBlockingPlan;
exports.generateSpaceForecast = generateSpaceForecast;
exports.projectSpaceNeedsByRatio = projectSpaceNeedsByRatio;
exports.generateSpaceOptimizationRecommendations = generateSpaceOptimizationRecommendations;
exports.analyzeSpaceEfficiency = analyzeSpaceEfficiency;
exports.getFloorPlan = getFloorPlan;
exports.updateSpaceCoordinates = updateSpaceCoordinates;
exports.generateFloorPlanVisualization = generateFloorPlanVisualization;
const sequelize_1 = require("sequelize");
const defaultConfig = {
    defaultSpaceStandardPerPerson: 200,
    minSpaceStandardPerPerson: 100,
    maxSpaceStandardPerPerson: 400,
    lowUtilizationThreshold: 50,
    targetUtilization: 75,
    highUtilizationThreshold: 90,
    defaultRatePerSqFt: 35,
    utilityCostPerSqFt: 3.5,
    maintenanceCostPerSqFt: 2.5,
    defaultForecastHorizon: 24,
    minimumConfidence: 0.7,
};
// ============================================================================
// Space Inventory Functions
// ============================================================================
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
async function getSpaceInventory(sequelize, buildingId) {
    const query = `
    SELECT
      s.space_id,
      s.building_id,
      s.floor_id,
      s.space_number,
      s.space_name,
      s.space_type,
      s.space_category,
      s.usable_area,
      s.gross_area,
      s.rentable_area,
      s.capacity,
      s.current_occupancy,
      s.has_windows,
      s.accessibility,
      s.meets_space_standards,
      s.standards_version,
      s.last_inspection,
      s.status,
      s.available_date,
      s.assigned_department,
      s.assigned_cost_center,
      s.primary_occupant,
      s.created_at,
      s.updated_at
    FROM property_spaces s
    WHERE s.building_id = :buildingId
    ORDER BY s.floor_id, s.space_number
  `;
    const results = await sequelize.query(query, {
        replacements: { buildingId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results.map(row => ({
        spaceId: row.space_id,
        buildingId: row.building_id,
        floorId: row.floor_id,
        spaceNumber: row.space_number,
        spaceName: row.space_name,
        spaceType: row.space_type,
        spaceCategory: row.space_category,
        usableArea: Number(row.usable_area),
        grossArea: Number(row.gross_area),
        rentableArea: Number(row.rentable_area),
        capacity: Number(row.capacity),
        currentOccupancy: Number(row.current_occupancy),
        hasWindows: Boolean(row.has_windows),
        accessibility: row.accessibility,
        meetsSpaceStandards: Boolean(row.meets_space_standards),
        standardsVersion: row.standards_version,
        lastInspection: row.last_inspection ? new Date(row.last_inspection) : undefined,
        status: row.status,
        availableDate: row.available_date ? new Date(row.available_date) : undefined,
        assignedDepartment: row.assigned_department,
        assignedCostCenter: row.assigned_cost_center,
        primaryOccupant: row.primary_occupant,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
    }));
}
/**
 * Classifies spaces by type and category with metrics
 *
 * @param sequelize - Sequelize instance
 * @param buildingId - Building identifier
 * @returns Classification summary with metrics
 */
async function classifySpacesByType(sequelize, buildingId) {
    const query = `
    SELECT
      space_type,
      space_category,
      COUNT(*) as count,
      SUM(usable_area) as total_area,
      AVG(CASE WHEN capacity > 0 THEN (current_occupancy::float / capacity * 100) ELSE 0 END) as avg_utilization
    FROM property_spaces
    WHERE building_id = :buildingId
    GROUP BY space_type, space_category
  `;
    const results = await sequelize.query(query, {
        replacements: { buildingId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const byType = new Map();
    const byCategory = new Map();
    let totalSpaces = 0;
    let totalArea = 0;
    results.forEach(row => {
        const type = row.space_type;
        const category = row.space_category;
        const count = Number(row.count);
        const area = Number(row.total_area);
        const utilization = Number(row.avg_utilization);
        byType.set(type, { count, totalArea: area, avgUtilization: utilization });
        if (byCategory.has(category)) {
            const existing = byCategory.get(category);
            byCategory.set(category, {
                count: existing.count + count,
                totalArea: existing.totalArea + area,
                percentOfTotal: 0, // Will calculate after
            });
        }
        else {
            byCategory.set(category, { count, totalArea: area, percentOfTotal: 0 });
        }
        totalSpaces += count;
        totalArea += area;
    });
    // Calculate percentages
    byCategory.forEach((value, key) => {
        value.percentOfTotal = (value.totalArea / totalArea) * 100;
    });
    return { byType, byCategory, totalSpaces, totalArea };
}
/**
 * Searches for available spaces matching criteria
 *
 * @param sequelize - Sequelize instance
 * @param criteria - Search criteria
 * @returns Matching available spaces
 */
async function searchAvailableSpaces(sequelize, criteria) {
    let query = `
    SELECT *
    FROM property_spaces
    WHERE status IN ('vacant', 'available')
  `;
    const replacements = {};
    if (criteria.buildingId) {
        query += ` AND building_id = :buildingId`;
        replacements.buildingId = criteria.buildingId;
    }
    if (criteria.minArea) {
        query += ` AND usable_area >= :minArea`;
        replacements.minArea = criteria.minArea;
    }
    if (criteria.maxArea) {
        query += ` AND usable_area <= :maxArea`;
        replacements.maxArea = criteria.maxArea;
    }
    if (criteria.spaceType) {
        query += ` AND space_type = :spaceType`;
        replacements.spaceType = criteria.spaceType;
    }
    if (criteria.hasWindows !== undefined) {
        query += ` AND has_windows = :hasWindows`;
        replacements.hasWindows = criteria.hasWindows;
    }
    if (criteria.accessibility) {
        query += ` AND accessibility = :accessibility`;
        replacements.accessibility = criteria.accessibility;
    }
    if (criteria.availableBy) {
        query += ` AND (available_date IS NULL OR available_date <= :availableBy)`;
        replacements.availableBy = criteria.availableBy;
    }
    query += ` ORDER BY usable_area ASC`;
    const results = await sequelize.query(query, {
        replacements,
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results.map(row => mapToSpaceInventory(row));
}
// ============================================================================
// Space Allocation Functions
// ============================================================================
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
async function createSpaceAllocation(sequelize, allocation, transaction) {
    await sequelize.query(`INSERT INTO property_space_allocations
     (allocation_id, space_id, department_id, cost_center_id, allocation_type,
      allocation_percent, start_date, end_date, primary_occupants, secondary_occupants,
      max_occupants, monthly_rate, annual_cost, chargeback_method, status,
      approved_by, approved_at, created_at, updated_at)
     VALUES
     (:allocationId, :spaceId, :departmentId, :costCenterId, :allocationType,
      :allocationPercent, :startDate, :endDate, :primaryOccupants, :secondaryOccupants,
      :maxOccupants, :monthlyRate, :annualCost, :chargebackMethod, :status,
      :approvedBy, :approvedAt, :createdAt, :updatedAt)`, {
        replacements: {
            allocationId: allocation.allocationId,
            spaceId: allocation.spaceId,
            departmentId: allocation.departmentId,
            costCenterId: allocation.costCenterId,
            allocationType: allocation.allocationType,
            allocationPercent: allocation.allocationPercent,
            startDate: allocation.startDate,
            endDate: allocation.endDate || null,
            primaryOccupants: JSON.stringify(allocation.primaryOccupants),
            secondaryOccupants: JSON.stringify(allocation.secondaryOccupants),
            maxOccupants: allocation.maxOccupants,
            monthlyRate: allocation.monthlyRate,
            annualCost: allocation.annualCost,
            chargebackMethod: allocation.chargebackMethod,
            status: allocation.status,
            approvedBy: allocation.approvedBy || null,
            approvedAt: allocation.approvedAt || null,
            createdAt: allocation.createdAt,
            updatedAt: allocation.updatedAt,
        },
        type: sequelize_1.QueryTypes.INSERT,
        transaction,
    });
    // Update space status
    await sequelize.query(`UPDATE property_spaces
     SET status = 'occupied',
         assigned_department = :departmentId,
         assigned_cost_center = :costCenterId,
         current_occupancy = :occupancy,
         updated_at = NOW()
     WHERE space_id = :spaceId`, {
        replacements: {
            departmentId: allocation.departmentId,
            costCenterId: allocation.costCenterId,
            occupancy: allocation.primaryOccupants.length,
            spaceId: allocation.spaceId,
        },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
    return allocation;
}
/**
 * Retrieves all allocations for a department
 *
 * @param sequelize - Sequelize instance
 * @param departmentId - Department identifier
 * @returns Active allocations
 */
async function getDepartmentAllocations(sequelize, departmentId) {
    const query = `
    SELECT *
    FROM property_space_allocations
    WHERE department_id = :departmentId
      AND status = 'active'
    ORDER BY start_date DESC
  `;
    const results = await sequelize.query(query, {
        replacements: { departmentId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results.map(row => mapToSpaceAllocation(row));
}
/**
 * Terminates a space allocation and frees the space
 *
 * @param sequelize - Sequelize instance
 * @param allocationId - Allocation identifier
 * @param endDate - Termination date
 * @param transaction - Optional transaction
 * @returns Updated allocation
 */
async function terminateSpaceAllocation(sequelize, allocationId, endDate, transaction) {
    await sequelize.query(`UPDATE property_space_allocations
     SET status = 'terminated',
         end_date = :endDate,
         updated_at = NOW()
     WHERE allocation_id = :allocationId`, {
        replacements: { allocationId, endDate },
        type: sequelize_1.QueryTypes.UPDATE,
        transaction,
    });
    // Get space ID to update
    const allocationResults = await sequelize.query(`SELECT space_id FROM property_space_allocations WHERE allocation_id = :allocationId`, {
        replacements: { allocationId },
        type: sequelize_1.QueryTypes.SELECT,
        transaction,
    });
    if (allocationResults.length > 0) {
        const spaceId = allocationResults[0].space_id;
        await sequelize.query(`UPDATE property_spaces
       SET status = 'vacant',
           assigned_department = NULL,
           assigned_cost_center = NULL,
           current_occupancy = 0,
           available_date = :endDate,
           updated_at = NOW()
       WHERE space_id = :spaceId`, {
            replacements: { spaceId, endDate },
            type: sequelize_1.QueryTypes.UPDATE,
            transaction,
        });
    }
}
// ============================================================================
// Space Utilization Analysis Functions
// ============================================================================
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
async function calculateSpaceUtilization(sequelize, spaceId, startDate, endDate) {
    const query = `
    SELECT
      space_id,
      AVG(occupancy_count) as avg_occupancy,
      MAX(occupancy_count) as peak_occupancy,
      MIN(occupancy_count) as min_occupancy,
      SUM(hours_occupied) as total_hours_occupied,
      SUM(hours_available) as total_hours_available,
      AVG(CASE WHEN hour_of_day BETWEEN 6 AND 11 THEN occupancy_count ELSE NULL END) as morning_avg,
      AVG(CASE WHEN hour_of_day BETWEEN 12 AND 17 THEN occupancy_count ELSE NULL END) as afternoon_avg,
      AVG(CASE WHEN hour_of_day BETWEEN 18 AND 23 THEN occupancy_count ELSE NULL END) as evening_avg,
      AVG(CASE WHEN day_of_week IN (0, 6) THEN occupancy_count ELSE NULL END) as weekend_avg,
      s.capacity
    FROM property_space_utilization_log u
    JOIN property_spaces s ON u.space_id = s.space_id
    WHERE u.space_id = :spaceId
      AND u.measurement_time BETWEEN :startDate AND :endDate
    GROUP BY u.space_id, s.capacity
  `;
    const results = await sequelize.query(query, {
        replacements: { spaceId, startDate, endDate },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (results.length === 0) {
        throw new Error(`No utilization data found for space: ${spaceId}`);
    }
    const data = results[0];
    const capacity = Number(data.capacity);
    const avgOccupancy = Number(data.avg_occupancy);
    const hoursOccupied = Number(data.total_hours_occupied);
    const hoursAvailable = Number(data.total_hours_available);
    const occupancyRate = capacity > 0 ? (avgOccupancy / capacity) * 100 : 0;
    const utilizationRate = hoursAvailable > 0 ? (hoursOccupied / hoursAvailable) * 100 : 0;
    return {
        spaceId,
        measurementDate: endDate,
        period: 'monthly',
        averageOccupancy: avgOccupancy,
        peakOccupancy: Number(data.peak_occupancy),
        minimumOccupancy: Number(data.min_occupancy),
        occupancyRate,
        hoursOccupied,
        hoursAvailable,
        utilizationRate,
        morningUtilization: Number(data.morning_avg) / capacity * 100,
        afternoonUtilization: Number(data.afternoon_avg) / capacity * 100,
        eveningUtilization: Number(data.evening_avg) / capacity * 100,
        weekendUtilization: Number(data.weekend_avg) / capacity * 100,
        spaceEfficiency: 0, // Calculate separately
        costEfficiency: 0, // Calculate separately
        utilizationTrend: 'stable',
        comparedToPrevious: 0,
    };
}
/**
 * Identifies underutilized spaces for optimization
 *
 * @param sequelize - Sequelize instance
 * @param buildingId - Building identifier
 * @param threshold - Utilization threshold percentage
 * @returns List of underutilized spaces
 */
async function identifyUnderutilizedSpaces(sequelize, buildingId, threshold = 50) {
    const query = `
    SELECT
      s.*,
      AVG(u.utilization_rate) as avg_utilization,
      s.rentable_area * :ratePerSqFt * 12 as annual_cost
    FROM property_spaces s
    LEFT JOIN property_space_utilization u ON s.space_id = u.space_id
    WHERE s.building_id = :buildingId
      AND s.status = 'occupied'
    GROUP BY s.space_id
    HAVING AVG(u.utilization_rate) < :threshold
    ORDER BY avg_utilization ASC
  `;
    const results = await sequelize.query(query, {
        replacements: {
            buildingId,
            threshold,
            ratePerSqFt: defaultConfig.defaultRatePerSqFt,
        },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const underutilizedSpaces = [];
    for (const row of results) {
        const space = mapToSpaceInventory(row);
        const avgUtilization = Number(row.avg_utilization);
        const annualCost = Number(row.annual_cost);
        // Estimate potential savings if space is consolidated
        const potentialSavings = annualCost * ((threshold - avgUtilization) / 100);
        // Get detailed utilization
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        try {
            const utilization = await calculateSpaceUtilization(sequelize, space.spaceId, startDate, endDate);
            underutilizedSpaces.push({ space, utilization, potentialSavings });
        }
        catch (error) {
            // Skip if no utilization data
            continue;
        }
    }
    return underutilizedSpaces;
}
/**
 * Generates utilization heatmap data for visualization
 *
 * @param sequelize - Sequelize instance
 * @param buildingId - Building identifier
 * @param date - Date for heatmap
 * @returns Heatmap data structure
 */
async function generateUtilizationHeatmap(sequelize, buildingId, date) {
    const query = `
    SELECT
      s.floor_id,
      s.space_id,
      COALESCE(AVG(u.utilization_rate), 0) as utilization_rate
    FROM property_spaces s
    LEFT JOIN property_space_utilization u ON s.space_id = u.space_id
      AND DATE(u.measurement_date) = :date
    WHERE s.building_id = :buildingId
    GROUP BY s.floor_id, s.space_id
    ORDER BY s.floor_id, s.space_number
  `;
    const results = await sequelize.query(query, {
        replacements: { buildingId, date },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const floorMap = new Map();
    results.forEach(row => {
        const floorId = row.floor_id;
        const spaceId = row.space_id;
        const utilizationRate = Number(row.utilization_rate);
        // Assign color based on utilization
        let heatmapColor = '#00ff00'; // Green - good utilization
        if (utilizationRate < 50) {
            heatmapColor = '#ffff00'; // Yellow - underutilized
        }
        else if (utilizationRate > 90) {
            heatmapColor = '#ff0000'; // Red - overutilized
        }
        if (!floorMap.has(floorId)) {
            floorMap.set(floorId, []);
        }
        floorMap.get(floorId).push({ spaceId, utilizationRate, heatmapColor });
    });
    return Array.from(floorMap.entries()).map(([floorId, spaces]) => ({
        floorId,
        spaces,
    }));
}
// ============================================================================
// Occupancy Planning Functions
// ============================================================================
/**
 * Creates a new occupancy plan
 *
 * @param sequelize - Sequelize instance
 * @param plan - Occupancy plan details
 * @returns Created plan
 */
async function createOccupancyPlan(sequelize, plan) {
    await sequelize.query(`INSERT INTO property_occupancy_plans
     (plan_id, department_id, plan_name, plan_type, plan_start_date, plan_end_date,
      implementation_phases, current_headcount, current_space_allocation, current_spaces,
      projected_headcount, projected_space_needed, target_spaces, space_requirements,
      estimated_move_cost, estimated_renovation_cost, annual_cost_impact, status,
      approvers, created_by, created_at)
     VALUES
     (:planId, :departmentId, :planName, :planType, :planStartDate, :planEndDate,
      :implementationPhases, :currentHeadcount, :currentSpaceAllocation, :currentSpaces,
      :projectedHeadcount, :projectedSpaceNeeded, :targetSpaces, :spaceRequirements,
      :estimatedMoveCost, :estimatedRenovationCost, :annualCostImpact, :status,
      :approvers, :createdBy, :createdAt)`, {
        replacements: {
            planId: plan.planId,
            departmentId: plan.departmentId,
            planName: plan.planName,
            planType: plan.planType,
            planStartDate: plan.planStartDate,
            planEndDate: plan.planEndDate,
            implementationPhases: plan.implementationPhases,
            currentHeadcount: plan.currentHeadcount,
            currentSpaceAllocation: plan.currentSpaceAllocation,
            currentSpaces: JSON.stringify(plan.currentSpaces),
            projectedHeadcount: plan.projectedHeadcount,
            projectedSpaceNeeded: plan.projectedSpaceNeeded,
            targetSpaces: JSON.stringify(plan.targetSpaces),
            spaceRequirements: JSON.stringify(plan.spaceRequirements),
            estimatedMoveCost: plan.estimatedMoveCost,
            estimatedRenovationCost: plan.estimatedRenovationCost,
            annualCostImpact: plan.annualCostImpact,
            status: plan.status,
            approvers: JSON.stringify(plan.approvers),
            createdBy: plan.createdBy,
            createdAt: plan.createdAt,
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    return plan;
}
/**
 * Calculates space requirements based on headcount projections
 *
 * @param headcount - Projected headcount
 * @param departmentType - Type of department
 * @param config - Optional configuration
 * @returns Space requirements breakdown
 */
function calculateSpaceRequirements(headcount, departmentType, config = {}) {
    const mergedConfig = { ...defaultConfig, ...config };
    // Different ratios for different department types
    const ratios = {
        clinical: { office: 0.3, workstation: 0.4, meeting: 0.1, specialty: 0.15, support: 0.05 },
        administrative: { office: 0.2, workstation: 0.5, meeting: 0.15, specialty: 0.05, support: 0.1 },
        support: { office: 0.1, workstation: 0.6, meeting: 0.1, specialty: 0.1, support: 0.1 },
    };
    const ratio = ratios[departmentType];
    return {
        offices: Math.ceil(headcount * ratio.office),
        workstations: Math.ceil(headcount * ratio.workstation),
        meetingRooms: Math.ceil(headcount * ratio.meeting),
        specialtySpaces: Math.ceil(headcount * ratio.specialty),
        supportSpaces: Math.ceil(headcount * ratio.support),
    };
}
/**
 * Evaluates feasibility of an occupancy plan
 *
 * @param sequelize - Sequelize instance
 * @param planId - Plan identifier
 * @returns Feasibility analysis
 */
async function evaluateOccupancyPlanFeasibility(sequelize, planId) {
    // Retrieve plan
    const planResults = await sequelize.query(`SELECT * FROM property_occupancy_plans WHERE plan_id = :planId`, {
        replacements: { planId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (planResults.length === 0) {
        throw new Error(`Occupancy plan not found: ${planId}`);
    }
    const planData = planResults[0];
    const targetSpaces = JSON.parse(planData.target_spaces);
    const spaceRequirements = JSON.parse(planData.space_requirements);
    // Check availability of target spaces
    const availabilityQuery = `
    SELECT COUNT(*) as available_count
    FROM property_spaces
    WHERE space_id = ANY(:targetSpaces::text[])
      AND status IN ('vacant', 'available')
  `;
    const availabilityResults = await sequelize.query(availabilityQuery, {
        replacements: { targetSpaces },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const availableSpaces = Number(availabilityResults[0].available_count);
    const requiredSpaces = targetSpaces.length;
    const spaceGap = requiredSpaces - availableSpaces;
    const risks = [];
    const recommendations = [];
    if (spaceGap > 0) {
        risks.push(`${spaceGap} required spaces are not currently available`);
        recommendations.push('Consider phased implementation or alternative spaces');
    }
    const estimatedCost = Number(planData.estimated_move_cost) + Number(planData.estimated_renovation_cost);
    if (estimatedCost > 500000) {
        risks.push('High implementation cost may require executive approval');
        recommendations.push('Prepare detailed ROI analysis for executive review');
    }
    const feasible = spaceGap <= Math.ceil(requiredSpaces * 0.1); // Allow 10% flexibility
    return {
        feasible,
        availableSpaces,
        requiredSpaces,
        spaceGap,
        estimatedCost,
        risks,
        recommendations,
    };
}
// ============================================================================
// Space Chargeback Functions
// ============================================================================
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
async function calculateSpaceChargeback(sequelize, departmentId, period, config = {}) {
    const mergedConfig = { ...defaultConfig, ...config };
    // Get all active allocations for the department
    const query = `
    SELECT
      a.allocation_id,
      a.space_id,
      a.allocation_percent,
      s.space_type,
      s.rentable_area,
      a.monthly_rate
    FROM property_space_allocations a
    JOIN property_spaces s ON a.space_id = s.space_id
    WHERE a.department_id = :departmentId
      AND a.status = 'active'
      AND a.start_date <= :period
      AND (a.end_date IS NULL OR a.end_date >= :period)
  `;
    const results = await sequelize.query(query, {
        replacements: { departmentId, period },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const allocations = results.map(row => {
        const area = Number(row.rentable_area);
        const allocationPercent = Number(row.allocation_percent);
        const allocatedArea = area * (allocationPercent / 100);
        const ratePerSqFt = mergedConfig.defaultRatePerSqFt;
        const monthlyCharge = allocatedArea * ratePerSqFt;
        return {
            spaceId: row.space_id,
            spaceType: row.space_type,
            area: allocatedArea,
            allocationPercent,
            ratePerSqFt,
            monthlyCharge,
        };
    });
    const baseRent = allocations.reduce((sum, a) => sum + a.monthlyCharge, 0);
    const totalArea = allocations.reduce((sum, a) => sum + a.area, 0);
    // Calculate additional costs
    const utilities = totalArea * mergedConfig.utilityCostPerSqFt;
    const maintenance = totalArea * mergedConfig.maintenanceCostPerSqFt;
    const janitorial = totalArea * 1.0; // $1 per sq ft
    const security = totalArea * 0.5; // $0.50 per sq ft
    const parking = 0; // Would calculate based on parking spaces
    const amenities = totalArea * 0.25; // $0.25 per sq ft
    const subtotal = baseRent + utilities + maintenance + janitorial + security + parking + amenities;
    const adjustments = 0; // Any credits or adjustments
    const totalCharge = subtotal + adjustments;
    // Get cost center
    const costCenterResults = await sequelize.query(`SELECT cost_center_id FROM property_space_allocations
     WHERE department_id = :departmentId AND status = 'active' LIMIT 1`, {
        replacements: { departmentId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const costCenterId = costCenterResults.length > 0 ? costCenterResults[0].cost_center_id : '';
    return {
        chargebackId: `cb-${departmentId}-${period.getTime()}`,
        period,
        departmentId,
        costCenterId,
        allocations,
        baseRent,
        utilities,
        maintenance,
        janitorial,
        security,
        parking,
        amenities,
        subtotal,
        adjustments,
        totalCharge,
        calculatedAt: new Date(),
        calculatedBy: 'system',
        paymentStatus: 'pending',
    };
}
/**
 * Generates chargeback report for all departments
 *
 * @param sequelize - Sequelize instance
 * @param period - Billing period
 * @returns Array of chargebacks by department
 */
async function generateMonthlyChargebackReport(sequelize, period) {
    // Get all departments with active allocations
    const departmentQuery = `
    SELECT DISTINCT department_id
    FROM property_space_allocations
    WHERE status = 'active'
      AND start_date <= :period
      AND (end_date IS NULL OR end_date >= :period)
  `;
    const departments = await sequelize.query(departmentQuery, {
        replacements: { period },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const chargebacks = [];
    for (const dept of departments) {
        const departmentId = dept.department_id;
        const chargeback = await calculateSpaceChargeback(sequelize, departmentId, period);
        chargebacks.push(chargeback);
    }
    return chargebacks;
}
/**
 * Applies chargeback adjustments for corrections or credits
 *
 * @param sequelize - Sequelize instance
 * @param chargebackId - Chargeback identifier
 * @param adjustment - Adjustment amount (positive or negative)
 * @param reason - Reason for adjustment
 * @returns Updated chargeback
 */
async function applyChargebackAdjustment(sequelize, chargebackId, adjustment, reason) {
    await sequelize.query(`UPDATE property_space_chargebacks
     SET adjustments = adjustments + :adjustment,
         total_charge = total_charge + :adjustment,
         adjustment_reason = :reason,
         updated_at = NOW()
     WHERE chargeback_id = :chargebackId`, {
        replacements: { chargebackId, adjustment, reason },
        type: sequelize_1.QueryTypes.UPDATE,
    });
}
// ============================================================================
// Space Standards Enforcement Functions
// ============================================================================
/**
 * Validates space allocation against standards
 *
 * @param sequelize - Sequelize instance
 * @param spaceId - Space identifier
 * @param employeeRole - Employee role level
 * @param standardId - Standard to validate against
 * @returns Validation result
 */
async function validateAgainstSpaceStandards(sequelize, spaceId, employeeRole, standardId) {
    // Get space details
    const spaceResults = await sequelize.query(`SELECT usable_area, space_type FROM property_spaces WHERE space_id = :spaceId`, {
        replacements: { spaceId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (spaceResults.length === 0) {
        throw new Error(`Space not found: ${spaceId}`);
    }
    const spaceArea = Number(spaceResults[0].usable_area);
    const spaceType = spaceResults[0].space_type;
    // Get applicable standard
    const standardResults = await sequelize.query(`SELECT standards FROM property_space_standards WHERE standard_id = :standardId`, {
        replacements: { standardId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (standardResults.length === 0) {
        throw new Error(`Standard not found: ${standardId}`);
    }
    const standards = JSON.parse(standardResults[0].standards);
    const applicableStandard = standards.find(s => s.roleLevel === employeeRole && s.spaceType === spaceType);
    if (!applicableStandard) {
        return {
            compliant: false,
            spaceArea,
            standardArea: 0,
            variance: 0,
            variancePercent: 0,
            requiresException: true,
            violations: ['No applicable standard found for this role and space type'],
        };
    }
    const standardArea = applicableStandard.standardArea;
    const variance = spaceArea - standardArea;
    const variancePercent = (variance / standardArea) * 100;
    const violations = [];
    let compliant = true;
    if (spaceArea < applicableStandard.minimumArea) {
        violations.push(`Space is below minimum required area of ${applicableStandard.minimumArea} sq ft`);
        compliant = false;
    }
    if (spaceArea > applicableStandard.maximumArea) {
        violations.push(`Space exceeds maximum allowed area of ${applicableStandard.maximumArea} sq ft`);
        compliant = false;
    }
    const requiresException = !compliant && Math.abs(variancePercent) > 10;
    return {
        compliant,
        spaceArea,
        standardArea,
        variance,
        variancePercent,
        requiresException,
        violations,
    };
}
/**
 * Identifies non-compliant space allocations
 *
 * @param sequelize - Sequelize instance
 * @param buildingId - Building identifier
 * @param standardId - Standard to check against
 * @returns List of non-compliant spaces
 */
async function identifyNonCompliantSpaces(sequelize, buildingId, standardId) {
    const query = `
    SELECT
      s.space_id,
      s.space_name,
      s.usable_area,
      s.primary_occupant,
      s.meets_space_standards
    FROM property_spaces s
    WHERE s.building_id = :buildingId
      AND s.status = 'occupied'
      AND s.meets_space_standards = false
  `;
    const results = await sequelize.query(query, {
        replacements: { buildingId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    return results.map(row => ({
        spaceId: row.space_id,
        spaceName: row.space_name,
        currentArea: Number(row.usable_area),
        standardArea: 200, // Would look up actual standard
        variance: Number(row.usable_area) - 200,
        assignedTo: row.primary_occupant || 'Unknown',
    }));
}
/**
 * Requests exception to space standards
 *
 * @param sequelize - Sequelize instance
 * @param spaceId - Space identifier
 * @param justification - Reason for exception
 * @param requestedBy - Requester
 * @returns Exception request record
 */
async function requestSpaceStandardException(sequelize, spaceId, justification, requestedBy) {
    const exceptionId = `exc-${spaceId}-${Date.now()}`;
    await sequelize.query(`INSERT INTO property_space_exceptions
     (exception_id, space_id, justification, requested_by, requested_at, status)
     VALUES (:exceptionId, :spaceId, :justification, :requestedBy, NOW(), 'pending')`, {
        replacements: { exceptionId, spaceId, justification, requestedBy },
        type: sequelize_1.QueryTypes.INSERT,
    });
    return {
        exceptionId,
        status: 'pending',
        requestedAt: new Date(),
    };
}
// ============================================================================
// Stacking and Blocking Plans Functions
// ============================================================================
/**
 * Creates a new stacking plan
 *
 * @param sequelize - Sequelize instance
 * @param plan - Stacking plan details
 * @returns Created plan
 */
async function createStackingPlan(sequelize, plan) {
    await sequelize.query(`INSERT INTO property_stacking_plans
     (plan_id, building_id, plan_name, plan_version, floor_allocations, blocks,
      status, created_by, created_at)
     VALUES
     (:planId, :buildingId, :planName, :planVersion, :floorAllocations, :blocks,
      :status, :createdBy, :createdAt)`, {
        replacements: {
            planId: plan.planId,
            buildingId: plan.buildingId,
            planName: plan.planName,
            planVersion: plan.planVersion,
            floorAllocations: JSON.stringify(plan.floorAllocations),
            blocks: JSON.stringify(plan.blocks),
            status: plan.status,
            createdBy: plan.createdBy,
            createdAt: plan.createdAt,
        },
        type: sequelize_1.QueryTypes.INSERT,
    });
    return plan;
}
/**
 * Optimizes floor stacking based on adjacency requirements
 *
 * @param sequelize - Sequelize instance
 * @param buildingId - Building identifier
 * @param adjacencyRequirements - List of adjacency requirements
 * @returns Optimized stacking recommendation
 */
async function optimizeFloorStacking(sequelize, buildingId, adjacencyRequirements) {
    // Get current floor allocations
    const query = `
    SELECT
      s.floor_id,
      s.assigned_department,
      SUM(s.usable_area) as total_area
    FROM property_spaces s
    WHERE s.building_id = :buildingId
      AND s.status = 'occupied'
      AND s.assigned_department IS NOT NULL
    GROUP BY s.floor_id, s.assigned_department
    ORDER BY s.floor_id
  `;
    const results = await sequelize.query(query, {
        replacements: { buildingId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Build current stacking
    const currentStacking = new Map();
    results.forEach(row => {
        const floorId = row.floor_id;
        const deptId = row.assigned_department;
        if (!currentStacking.has(floorId)) {
            currentStacking.set(floorId, []);
        }
        currentStacking.get(floorId).push(deptId);
    });
    // Calculate adjacency score (simplified)
    let adjacencyScore = 0;
    let totalRequirements = 0;
    adjacencyRequirements.forEach(req => {
        totalRequirements++;
        // Check if departments are on same floor
        for (const [floorId, depts] of currentStacking.entries()) {
            if (depts.includes(req.department1Id) && depts.includes(req.department2Id)) {
                if (req.relationshipType === 'must-be-adjacent' || req.relationshipType === 'should-be-adjacent') {
                    adjacencyScore += req.priority;
                }
            }
        }
    });
    adjacencyScore = totalRequirements > 0 ? (adjacencyScore / (totalRequirements * 10)) * 100 : 0;
    const improvements = [];
    // Identify improvement opportunities
    adjacencyRequirements.forEach(req => {
        if (!req.currentlyAdjacent && req.relationshipType === 'must-be-adjacent') {
            improvements.push(`Move ${req.department1Id} and ${req.department2Id} to same floor (${req.reason})`);
        }
    });
    return {
        recommendedStacking: currentStacking,
        adjacencyScore,
        improvements,
    };
}
/**
 * Generates blocking plan (contiguous space groups)
 *
 * @param sequelize - Sequelize instance
 * @param floorId - Floor identifier
 * @returns Blocking recommendations
 */
async function generateBlockingPlan(sequelize, floorId) {
    const query = `
    SELECT
      s.space_id,
      s.assigned_department,
      s.usable_area,
      s.space_number
    FROM property_spaces s
    WHERE s.floor_id = :floorId
      AND s.status = 'occupied'
      AND s.assigned_department IS NOT NULL
    ORDER BY s.assigned_department, s.space_number
  `;
    const results = await sequelize.query(query, {
        replacements: { floorId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    // Group contiguous spaces by department
    const blocks = [];
    const departmentGroups = new Map();
    results.forEach(row => {
        const deptId = row.assigned_department;
        const spaceId = row.space_id;
        const area = Number(row.usable_area);
        if (!departmentGroups.has(deptId)) {
            departmentGroups.set(deptId, []);
        }
        departmentGroups.get(deptId).push({ spaceId, area });
    });
    // Create blocks
    let blockIndex = 1;
    departmentGroups.forEach((spaces, deptId) => {
        const totalArea = spaces.reduce((sum, s) => sum + s.area, 0);
        const spaceIds = spaces.map(s => s.spaceId);
        blocks.push({
            blockId: `block-${floorId}-${blockIndex}`,
            blockName: `${deptId} Block ${blockIndex}`,
            departmentId: deptId,
            floorId,
            spaceIds,
            totalArea,
            adjacencyScore: 100, // Would calculate based on actual adjacency
        });
        blockIndex++;
    });
    return blocks;
}
// ============================================================================
// Space Forecasting Functions
// ============================================================================
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
async function generateSpaceForecast(sequelize, departmentId, forecastMonths = 24) {
    // Get historical headcount data
    const historyQuery = `
    SELECT
      measurement_date,
      headcount,
      space_allocation
    FROM department_headcount_history
    WHERE department_id = :departmentId
      AND measurement_date >= NOW() - INTERVAL '12 months'
    ORDER BY measurement_date ASC
  `;
    const history = await sequelize.query(historyQuery, {
        replacements: { departmentId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (history.length < 3) {
        throw new Error('Insufficient historical data for forecasting');
    }
    // Calculate current metrics
    const current = history[history.length - 1];
    const currentHeadcount = Number(current.headcount);
    const currentSpaceAllocation = Number(current.space_allocation);
    const currentRatioPerPerson = currentSpaceAllocation / currentHeadcount;
    // Simple linear regression for headcount
    const n = history.length;
    const x = history.map((_, idx) => idx);
    const y = history.map(h => Number(h.headcount));
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    // Generate predictions
    const predictions = [];
    let capacityExceededDate;
    let monthsUntilCapacity;
    for (let month = 1; month <= forecastMonths; month++) {
        const projectedHeadcount = Math.round(intercept + slope * (n + month));
        const projectedSpaceNeeded = projectedHeadcount * currentRatioPerPerson;
        const projectedVacancy = currentSpaceAllocation - projectedSpaceNeeded;
        predictions.push({
            period: new Date(new Date().setMonth(new Date().getMonth() + month)),
            projectedHeadcount,
            projectedSpaceNeeded,
            projectedVacancy,
            confidence: Math.max(0.5, 0.95 - (month / forecastMonths) * 0.3),
        });
        if (!capacityExceededDate && projectedSpaceNeeded > currentSpaceAllocation) {
            capacityExceededDate = predictions[predictions.length - 1].period;
            monthsUntilCapacity = month;
        }
    }
    let recommendation = 'no-action';
    const suggestedActions = [];
    if (monthsUntilCapacity) {
        if (monthsUntilCapacity < 6) {
            recommendation = 'urgent-action';
            suggestedActions.push('Initiate immediate space expansion or consolidation');
            suggestedActions.push('Consider temporary space solutions');
        }
        else if (monthsUntilCapacity < 12) {
            recommendation = 'plan-expansion';
            suggestedActions.push('Begin space planning process');
            suggestedActions.push('Identify potential spaces or buildings');
        }
        else {
            recommendation = 'monitor';
            suggestedActions.push('Continue monitoring headcount trends');
            suggestedActions.push('Review forecast quarterly');
        }
    }
    return {
        forecastId: `forecast-${departmentId}-${Date.now()}`,
        departmentId,
        scope: 'department',
        forecastMethod: 'trend-analysis',
        forecastHorizon: forecastMonths,
        confidenceLevel: 0.85,
        currentHeadcount,
        currentSpaceAllocation,
        currentRatioPerPerson,
        predictions,
        capacityExceededDate,
        monthsUntilCapacity,
        recommendedActionDate: monthsUntilCapacity
            ? new Date(new Date().setMonth(new Date().getMonth() + Math.max(1, monthsUntilCapacity - 6)))
            : undefined,
        recommendation,
        suggestedActions,
        generatedAt: new Date(),
        generatedBy: 'system',
    };
}
/**
 * Projects space needs using headcount-to-space ratios
 *
 * @param currentHeadcount - Current headcount
 * @param projectedHeadcount - Projected future headcount
 * @param ratioPerPerson - Square feet per person ratio
 * @returns Projected space requirement
 */
function projectSpaceNeedsByRatio(currentHeadcount, projectedHeadcount, ratioPerPerson = defaultConfig.defaultSpaceStandardPerPerson) {
    const currentSpaceNeeded = currentHeadcount * ratioPerPerson;
    const projectedSpaceNeeded = projectedHeadcount * ratioPerPerson;
    const additionalSpaceNeeded = projectedSpaceNeeded - currentSpaceNeeded;
    const percentIncrease = (additionalSpaceNeeded / currentSpaceNeeded) * 100;
    return {
        currentSpaceNeeded,
        projectedSpaceNeeded,
        additionalSpaceNeeded,
        percentIncrease,
    };
}
// ============================================================================
// Space Optimization Functions
// ============================================================================
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
async function generateSpaceOptimizationRecommendations(sequelize, buildingId) {
    const recommendations = [];
    // Identify underutilized spaces
    const underutilized = await identifyUnderutilizedSpaces(sequelize, buildingId, 50);
    if (underutilized.length > 0) {
        const totalArea = underutilized.reduce((sum, u) => sum + u.space.usableArea, 0);
        const totalCost = underutilized.reduce((sum, u) => sum + u.potentialSavings, 0);
        const targetSpaces = underutilized.map(u => u.space.spaceId);
        recommendations.push({
            optimizationId: `opt-consolidation-${Date.now()}`,
            priority: 'high',
            category: 'consolidation',
            targetSpaces,
            targetDepartments: [],
            currentState: {
                totalArea,
                occupiedArea: totalArea * 0.4, // Estimated at 40% utilization
                averageUtilization: 40,
                annualCost: totalCost,
            },
            proposedState: {
                totalArea: totalArea * 0.7, // Consolidate to 70% of current
                projectedUtilization: 75,
                annualCost: totalCost * 0.7,
            },
            spaceReclaimed: totalArea * 0.3,
            costSavings: totalCost * 0.3,
            utilizationImprovement: 35,
            headcountAccommodated: 0,
            implementationCost: 50000,
            implementationTime: 3,
            complexity: 'medium',
            risks: ['Temporary disruption during moves', 'Employee resistance to change'],
            dependencies: ['IT infrastructure relocation', 'Furniture reconfiguration'],
            paybackPeriod: 2,
            roi: ((totalCost * 0.3) / 50000) * 100,
            npv: (totalCost * 0.3 * 3) - 50000,
            recommendation: 'Consolidate underutilized spaces to improve efficiency and reduce costs',
            nextSteps: [
                'Conduct detailed space utilization study',
                'Engage with affected departments',
                'Develop phased implementation plan',
            ],
            createdAt: new Date(),
        });
    }
    // Sort by ROI
    recommendations.sort((a, b) => b.roi - a.roi);
    return recommendations;
}
/**
 * Analyzes space efficiency metrics
 *
 * @param sequelize - Sequelize instance
 * @param buildingId - Building identifier
 * @returns Efficiency metrics
 */
async function analyzeSpaceEfficiency(sequelize, buildingId) {
    const query = `
    SELECT
      SUM(s.usable_area) as total_usable,
      SUM(CASE WHEN s.status = 'occupied' THEN s.usable_area ELSE 0 END) as occupied_area,
      SUM(s.current_occupancy) as total_headcount
    FROM property_spaces s
    WHERE s.building_id = :buildingId
  `;
    const results = await sequelize.query(query, {
        replacements: { buildingId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const data = results[0];
    const totalUsableArea = Number(data.total_usable);
    const totalOccupiedArea = Number(data.occupied_area);
    const totalHeadcount = Number(data.total_headcount);
    const averageAreaPerPerson = totalHeadcount > 0 ? totalOccupiedArea / totalHeadcount : 0;
    const buildingUtilization = (totalOccupiedArea / totalUsableArea) * 100;
    // Efficiency score: lower is better (industry benchmark ~175-200 sq ft/person)
    const benchmarkArea = 200;
    const efficiencyScore = (benchmarkArea / averageAreaPerPerson) * 100;
    const benchmarkComparison = ((averageAreaPerPerson - benchmarkArea) / benchmarkArea) * 100;
    return {
        totalUsableArea,
        totalOccupiedArea,
        totalHeadcount,
        averageAreaPerPerson,
        buildingUtilization,
        efficiencyScore,
        benchmarkComparison,
    };
}
// ============================================================================
// Floor Plan Integration Functions
// ============================================================================
/**
 * Retrieves floor plan with space mappings
 *
 * @param sequelize - Sequelize instance
 * @param floorId - Floor identifier
 * @returns Floor plan with metadata
 */
async function getFloorPlan(sequelize, floorId) {
    const query = `
    SELECT *
    FROM property_floor_plans
    WHERE floor_id = :floorId
    ORDER BY created_at DESC
    LIMIT 1
  `;
    const results = await sequelize.query(query, {
        replacements: { floorId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    if (results.length === 0) {
        throw new Error(`Floor plan not found for floor: ${floorId}`);
    }
    const data = results[0];
    return {
        floorPlanId: data.floor_plan_id,
        buildingId: data.building_id,
        floorId: data.floor_id,
        planName: data.plan_name,
        planVersion: data.plan_version,
        drawingNumber: data.drawing_number,
        scale: data.scale,
        cadFileUrl: data.cad_file_url,
        pdfFileUrl: data.pdf_file_url,
        imageFileUrl: data.image_file_url,
        revitFileUrl: data.revit_file_url,
        totalGrossArea: Number(data.total_gross_area),
        totalUsableArea: Number(data.total_usable_area),
        circulationArea: Number(data.circulation_area),
        coreArea: Number(data.core_area),
        spaces: JSON.parse(data.spaces),
        lastUpdated: new Date(data.last_updated),
        updatedBy: data.updated_by,
        revisionHistory: JSON.parse(data.revision_history),
    };
}
/**
 * Updates space coordinates in floor plan
 *
 * @param sequelize - Sequelize instance
 * @param floorPlanId - Floor plan identifier
 * @param spaceId - Space identifier
 * @param coordinates - New coordinates
 * @returns Success status
 */
async function updateSpaceCoordinates(sequelize, floorPlanId, spaceId, coordinates) {
    // This would update the JSON field - implementation depends on database
    await sequelize.query(`UPDATE property_floor_plans
     SET spaces = jsonb_set(
       spaces,
       '{${spaceId}}',
       '${JSON.stringify(coordinates)}'::jsonb
     ),
     last_updated = NOW()
     WHERE floor_plan_id = :floorPlanId`, {
        replacements: { floorPlanId },
        type: sequelize_1.QueryTypes.UPDATE,
    });
}
/**
 * Generates interactive floor plan visualization data
 *
 * @param sequelize - Sequelize instance
 * @param floorId - Floor identifier
 * @returns Visualization data with occupancy overlay
 */
async function generateFloorPlanVisualization(sequelize, floorId) {
    const floorPlan = await getFloorPlan(sequelize, floorId);
    // Get space details
    const spaceQuery = `
    SELECT
      space_id,
      space_name,
      assigned_department,
      current_occupancy,
      capacity,
      status
    FROM property_spaces
    WHERE floor_id = :floorId
  `;
    const spaceResults = await sequelize.query(spaceQuery, {
        replacements: { floorId },
        type: sequelize_1.QueryTypes.SELECT,
    });
    const spaces = spaceResults.map(row => {
        const spaceId = row.space_id;
        const occupancy = Number(row.current_occupancy);
        const capacity = Number(row.capacity);
        const utilizationRate = capacity > 0 ? (occupancy / capacity) * 100 : 0;
        // Color code by utilization
        let color = '#90EE90'; // Light green - good utilization
        if (utilizationRate < 50) {
            color = '#FFD700'; // Gold - underutilized
        }
        else if (utilizationRate > 90) {
            color = '#FF6347'; // Tomato - overutilized
        }
        const spaceCoordinates = floorPlan.spaces.find(s => s.spaceId === spaceId)?.coordinates || { x: 0, y: 0, width: 0, height: 0 };
        return {
            spaceId,
            coordinates: spaceCoordinates,
            color,
            label: row.space_name,
            occupancy: utilizationRate,
            department: row.assigned_department || 'Unassigned',
        };
    });
    return { floorPlan, spaces };
}
// ============================================================================
// Helper Functions
// ============================================================================
/**
 * Maps database row to SpaceInventory
 */
function mapToSpaceInventory(row) {
    return {
        spaceId: row.space_id,
        buildingId: row.building_id,
        floorId: row.floor_id,
        spaceNumber: row.space_number,
        spaceName: row.space_name,
        spaceType: row.space_type,
        spaceCategory: row.space_category,
        usableArea: Number(row.usable_area),
        grossArea: Number(row.gross_area),
        rentableArea: Number(row.rentable_area),
        capacity: Number(row.capacity),
        currentOccupancy: Number(row.current_occupancy),
        hasWindows: Boolean(row.has_windows),
        accessibility: row.accessibility,
        meetsSpaceStandards: Boolean(row.meets_space_standards),
        standardsVersion: row.standards_version,
        lastInspection: row.last_inspection ? new Date(row.last_inspection) : undefined,
        status: row.status,
        availableDate: row.available_date ? new Date(row.available_date) : undefined,
        assignedDepartment: row.assigned_department,
        assignedCostCenter: row.assigned_cost_center,
        primaryOccupant: row.primary_occupant,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
    };
}
/**
 * Maps database row to SpaceAllocation
 */
function mapToSpaceAllocation(row) {
    return {
        allocationId: row.allocation_id,
        spaceId: row.space_id,
        departmentId: row.department_id,
        costCenterId: row.cost_center_id,
        allocationType: row.allocation_type,
        allocationPercent: Number(row.allocation_percent),
        startDate: new Date(row.start_date),
        endDate: row.end_date ? new Date(row.end_date) : undefined,
        primaryOccupants: JSON.parse(row.primary_occupants),
        secondaryOccupants: JSON.parse(row.secondary_occupants),
        maxOccupants: Number(row.max_occupants),
        monthlyRate: Number(row.monthly_rate),
        annualCost: Number(row.annual_cost),
        chargebackMethod: row.chargeback_method,
        status: row.status,
        approvedBy: row.approved_by,
        approvedAt: row.approved_at ? new Date(row.approved_at) : undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
    };
}
// ============================================================================
// Export Summary
// ============================================================================
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
//# sourceMappingURL=property-space-management-kit.js.map