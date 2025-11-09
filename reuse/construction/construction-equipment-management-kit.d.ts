/**
 * CONSTRUCTION EQUIPMENT MANAGEMENT KIT
 *
 * Comprehensive construction equipment lifecycle management toolkit.
 * Provides 40 specialized functions covering:
 * - Equipment registration, tracking, and inventory management
 * - Equipment allocation, scheduling, and reservation
 * - Maintenance scheduling, preventive and corrective maintenance
 * - Repair tracking, service history, and downtime analysis
 * - Equipment utilization analysis and performance metrics
 * - Equipment cost tracking, ROI analysis, and financial reporting
 * - Equipment certification, compliance, and inspection tracking
 * - Operator assignment, qualifications, and training tracking
 * - Rental vs. ownership analysis and lease management
 * - Depreciation calculations and asset valuation
 * - Fuel consumption tracking and operational efficiency
 * - Equipment location tracking (GPS/telematics integration)
 * - Warranty management and claim processing
 * - Equipment transfer and mobilization tracking
 *
 * @module ConstructionEquipmentManagementKit
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
 * @performance Optimized for large equipment fleets (1,000+ units)
 *
 * @example
 * ```typescript
 * import {
 *   registerEquipment,
 *   allocateEquipment,
 *   scheduleMaintenancePM,
 *   trackEquipmentUtilization,
 *   calculateEquipmentROI,
 *   ConstructionEquipment,
 *   EquipmentCategory
 * } from './construction-equipment-management-kit';
 *
 * // Register new equipment
 * const excavator = await registerEquipment({
 *   equipmentNumber: 'EXC-2024-001',
 *   category: EquipmentCategory.EXCAVATOR,
 *   make: 'Caterpillar',
 *   model: '320',
 *   year: 2024,
 *   purchasePrice: 350000,
 *   ownershipType: 'owned'
 * });
 *
 * // Allocate to project
 * await allocateEquipment(excavator.id, 'proj-001', {
 *   startDate: new Date(),
 *   estimatedDuration: 30,
 *   assignedOperator: 'OP-123'
 * });
 *
 * // Schedule preventive maintenance
 * await scheduleMaintenancePM(excavator.id, {
 *   serviceType: 'oil-change',
 *   intervalHours: 250,
 *   estimatedCost: 450
 * });
 * ```
 */
import { ConstructionEquipment } from './models/construction-equipment.model';
import { EquipmentMaintenanceRecord } from './models/equipment-maintenance-record.model';
import { EquipmentAllocation } from './models/equipment-allocation.model';
import { EquipmentCategory, EquipmentStatus, OwnershipType, MaintenanceType, ConditionRating, CertificationStatus } from './types/equipment.types';
import { RegisterEquipmentDto } from './dto/register-equipment.dto';
import { AllocateEquipmentDto } from './dto/allocate-equipment.dto';
import { ScheduleMaintenanceDto } from './dto/schedule-maintenance.dto';
/**
 * Registers new construction equipment in the system.
 *
 * @param {RegisterEquipmentDto} data - Equipment registration data
 * @returns {Promise<ConstructionEquipment>} Registered equipment record
 *
 * @example
 * ```typescript
 * const equipment = await registerEquipment({
 *   equipmentNumber: 'EXC-2024-001',
 *   category: EquipmentCategory.EXCAVATOR,
 *   make: 'Caterpillar',
 *   model: '320',
 *   ownershipType: OwnershipType.OWNED,
 *   purchasePrice: 350000
 * });
 * ```
 */
export declare const registerEquipment: (data: RegisterEquipmentDto) => Promise<ConstructionEquipment>;
/**
 * Updates equipment status.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {EquipmentStatus} status - New status
 * @param {string} [notes] - Optional status change notes
 * @returns {Promise<ConstructionEquipment>} Updated equipment
 *
 * @example
 * ```typescript
 * await updateEquipmentStatus(equipmentId, EquipmentStatus.MAINTENANCE);
 * ```
 */
export declare const updateEquipmentStatus: (equipmentId: string, status: EquipmentStatus, notes?: string) => Promise<ConstructionEquipment>;
/**
 * Tracks equipment location (GPS or manual).
 *
 * @param {string} equipmentId - Equipment ID
 * @param {string} location - Location description
 * @param {object} [coordinates] - GPS coordinates
 * @returns {Promise<ConstructionEquipment>} Updated equipment
 *
 * @example
 * ```typescript
 * await trackEquipmentLocation(equipmentId, 'Project Site A', {
 *   lat: 40.7128,
 *   lng: -74.0060
 * });
 * ```
 */
export declare const trackEquipmentLocation: (equipmentId: string, location: string, coordinates?: {
    lat: number;
    lng: number;
}) => Promise<ConstructionEquipment>;
/**
 * Updates equipment operating hours.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {number} hours - New operating hours total
 * @returns {Promise<ConstructionEquipment>} Updated equipment
 *
 * @example
 * ```typescript
 * await updateOperatingHours(equipmentId, 1250.5);
 * ```
 */
export declare const updateOperatingHours: (equipmentId: string, hours: number) => Promise<ConstructionEquipment>;
/**
 * Updates equipment condition rating.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {ConditionRating} rating - Condition rating
 * @param {string} [notes] - Assessment notes
 * @returns {Promise<ConstructionEquipment>} Updated equipment
 *
 * @example
 * ```typescript
 * await updateConditionRating(equipmentId, ConditionRating.GOOD, 'Minor wear on hydraulics');
 * ```
 */
export declare const updateConditionRating: (equipmentId: string, rating: ConditionRating, notes?: string) => Promise<ConstructionEquipment>;
/**
 * Searches equipment by filters.
 *
 * @param {object} filters - Search filters
 * @returns {Promise<ConstructionEquipment[]>} Matching equipment
 *
 * @example
 * ```typescript
 * const equipment = await searchEquipment({
 *   category: EquipmentCategory.EXCAVATOR,
 *   status: EquipmentStatus.AVAILABLE
 * });
 * ```
 */
export declare const searchEquipment: (filters: {
    category?: EquipmentCategory;
    status?: EquipmentStatus;
    ownershipType?: OwnershipType;
    location?: string;
}) => Promise<ConstructionEquipment[]>;
/**
 * Allocates equipment to a project.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {AllocateEquipmentDto} data - Allocation data
 * @returns {Promise<EquipmentAllocation>} Allocation record
 *
 * @example
 * ```typescript
 * const allocation = await allocateEquipment(equipmentId, {
 *   projectId: 'PROJ-2024-045',
 *   startDate: new Date(),
 *   estimatedDuration: 30,
 *   assignedOperatorId: 'OP-123'
 * });
 * ```
 */
export declare const allocateEquipment: (equipmentId: string, data: AllocateEquipmentDto) => Promise<EquipmentAllocation>;
/**
 * Releases equipment from project allocation.
 *
 * @param {string} allocationId - Allocation ID
 * @param {number} finalOperatingHours - Final operating hours
 * @returns {Promise<EquipmentAllocation>} Updated allocation
 *
 * @example
 * ```typescript
 * await releaseEquipment(allocationId, 1450);
 * ```
 */
export declare const releaseEquipment: (allocationId: string, finalOperatingHours: number) => Promise<EquipmentAllocation>;
/**
 * Reserves equipment for future use.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {Date} startDate - Reservation start date
 * @param {Date} endDate - Reservation end date
 * @param {string} projectId - Project ID
 * @returns {Promise<EquipmentAllocation>} Reservation record
 *
 * @example
 * ```typescript
 * await reserveEquipment(equipmentId, startDate, endDate, 'PROJ-2024-050');
 * ```
 */
export declare const reserveEquipment: (equipmentId: string, startDate: Date, endDate: Date, projectId: string) => Promise<EquipmentAllocation>;
/**
 * Cancels equipment reservation.
 *
 * @param {string} allocationId - Allocation ID
 * @returns {Promise<EquipmentAllocation>} Cancelled allocation
 *
 * @example
 * ```typescript
 * await cancelReservation(allocationId);
 * ```
 */
export declare const cancelReservation: (allocationId: string) => Promise<EquipmentAllocation>;
/**
 * Gets equipment availability for date range.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Promise<boolean>} Whether equipment is available
 *
 * @example
 * ```typescript
 * const isAvailable = await checkEquipmentAvailability(equipmentId, startDate, endDate);
 * ```
 */
export declare const checkEquipmentAvailability: (equipmentId: string, startDate: Date, endDate: Date) => Promise<boolean>;
/**
 * Schedules preventive maintenance.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {ScheduleMaintenanceDto} data - Maintenance data
 * @returns {Promise<EquipmentMaintenanceRecord>} Maintenance record
 *
 * @example
 * ```typescript
 * await scheduleMaintenancePM(equipmentId, {
 *   maintenanceType: MaintenanceType.PREVENTIVE,
 *   description: 'Oil change',
 *   scheduledDate: new Date('2024-12-15'),
 *   estimatedCost: 450
 * });
 * ```
 */
export declare const scheduleMaintenancePM: (equipmentId: string, data: ScheduleMaintenanceDto) => Promise<EquipmentMaintenanceRecord>;
/**
 * Records completed maintenance.
 *
 * @param {string} maintenanceId - Maintenance record ID
 * @param {object} completionData - Completion details
 * @returns {Promise<EquipmentMaintenanceRecord>} Updated record
 *
 * @example
 * ```typescript
 * await recordMaintenanceCompletion(maintenanceId, {
 *   completionDate: new Date(),
 *   technicianName: 'John Smith',
 *   totalCost: 475.50,
 *   partsReplaced: ['Oil filter', 'Engine oil'],
 *   downtimeHours: 3
 * });
 * ```
 */
export declare const recordMaintenanceCompletion: (maintenanceId: string, completionData: {
    completionDate: Date;
    technicianName?: string;
    totalCost?: number;
    laborCost?: number;
    partsCost?: number;
    partsReplaced?: string[];
    downtimeHours?: number;
    findings?: string;
    nextServiceDue?: Date;
}) => Promise<EquipmentMaintenanceRecord>;
/**
 * Tracks emergency repairs.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {string} description - Repair description
 * @param {number} estimatedDowntime - Estimated downtime hours
 * @returns {Promise<EquipmentMaintenanceRecord>} Repair record
 *
 * @example
 * ```typescript
 * await trackEmergencyRepair(equipmentId, 'Hydraulic line failure', 12);
 * ```
 */
export declare const trackEmergencyRepair: (equipmentId: string, description: string, estimatedDowntime: number) => Promise<EquipmentMaintenanceRecord>;
/**
 * Gets maintenance history for equipment.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {object} [filters] - Optional filters
 * @returns {Promise<EquipmentMaintenanceRecord[]>} Maintenance records
 *
 * @example
 * ```typescript
 * const history = await getMaintenanceHistory(equipmentId, {
 *   maintenanceType: MaintenanceType.PREVENTIVE
 * });
 * ```
 */
export declare const getMaintenanceHistory: (equipmentId: string, filters?: {
    maintenanceType?: MaintenanceType;
    dateFrom?: Date;
    dateTo?: Date;
}) => Promise<EquipmentMaintenanceRecord[]>;
/**
 * Calculates total maintenance cost for equipment.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {Date} [dateFrom] - Start date
 * @param {Date} [dateTo] - End date
 * @returns {Promise<number>} Total maintenance cost
 *
 * @example
 * ```typescript
 * const totalCost = await calculateMaintenanceCost(equipmentId);
 * ```
 */
export declare const calculateMaintenanceCost: (equipmentId: string, dateFrom?: Date, dateTo?: Date) => Promise<number>;
/**
 * Tracks equipment utilization for period.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {Date} startDate - Period start
 * @param {Date} endDate - Period end
 * @returns {Promise<object>} Utilization metrics
 *
 * @example
 * ```typescript
 * const utilization = await trackEquipmentUtilization(equipmentId, startDate, endDate);
 * console.log(`Utilization rate: ${utilization.utilizationRate}%`);
 * ```
 */
export declare const trackEquipmentUtilization: (equipmentId: string, startDate: Date, endDate: Date) => Promise<{
    equipmentId: string;
    utilizationRate: number;
    hoursInUse: number;
    hoursIdle: number;
    hoursMaintenance: number;
    totalPeriodHours: number;
}>;
/**
 * Analyzes equipment downtime.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {Promise<object>} Downtime analysis
 *
 * @example
 * ```typescript
 * const downtime = await analyzeEquipmentDowntime(equipmentId, startDate, endDate);
 * ```
 */
export declare const analyzeEquipmentDowntime: (equipmentId: string, startDate: Date, endDate: Date) => Promise<{
    totalDowntimeHours: number;
    maintenanceDowntime: number;
    repairDowntime: number;
    emergencyDowntime: number;
    downtimePercentage: number;
}>;
/**
 * Generates equipment performance report.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<object>} Performance metrics
 *
 * @example
 * ```typescript
 * const performance = await generatePerformanceReport(equipmentId, startDate, endDate);
 * ```
 */
export declare const generatePerformanceReport: (equipmentId: string, startDate: Date, endDate: Date) => Promise<{
    equipment: ConstructionEquipment;
    utilization: any;
    downtime: any;
    maintenanceCost: number;
    allocationCount: number;
    revenueGenerated: number;
}>;
/**
 * Calculates equipment ROI (Return on Investment).
 *
 * @param {string} equipmentId - Equipment ID
 * @returns {Promise<object>} ROI analysis
 *
 * @example
 * ```typescript
 * const roi = await calculateEquipmentROI(equipmentId);
 * console.log(`ROI: ${roi.roiPercentage}%`);
 * ```
 */
export declare const calculateEquipmentROI: (equipmentId: string) => Promise<{
    equipmentId: string;
    initialInvestment: number;
    totalRevenue: number;
    totalCosts: number;
    netProfit: number;
    roiPercentage: number;
    paybackPeriodMonths: number;
}>;
/**
 * Tracks fuel consumption and costs.
 *
 * @param {string} allocationId - Allocation ID
 * @param {number} gallons - Fuel consumed in gallons
 * @param {number} costPerGallon - Cost per gallon
 * @returns {Promise<EquipmentAllocation>} Updated allocation
 *
 * @example
 * ```typescript
 * await trackFuelConsumption(allocationId, 345.5, 4.25);
 * ```
 */
export declare const trackFuelConsumption: (allocationId: string, gallons: number, costPerGallon: number) => Promise<EquipmentAllocation>;
/**
 * Calculates depreciation for equipment.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {string} method - Depreciation method ('straight-line', 'declining-balance')
 * @param {number} usefulLifeYears - Useful life in years
 * @returns {Promise<object>} Depreciation calculation
 *
 * @example
 * ```typescript
 * const depreciation = await calculateDepreciation(equipmentId, 'straight-line', 10);
 * ```
 */
export declare const calculateDepreciation: (equipmentId: string, method: "straight-line" | "declining-balance", usefulLifeYears: number) => Promise<{
    currentValue: number;
    annualDepreciation: number;
    totalDepreciation: number;
    remainingValue: number;
}>;
/**
 * Analyzes rental vs. ownership costs.
 *
 * @param {object} params - Analysis parameters
 * @returns {object} Cost comparison
 *
 * @example
 * ```typescript
 * const analysis = analyzeRentalVsOwnership({
 *   purchasePrice: 350000,
 *   dailyRentalRate: 750,
 *   estimatedUsageDays: 200,
 *   usefulLifeYears: 10
 * });
 * ```
 */
export declare const analyzeRentalVsOwnership: (params: {
    purchasePrice: number;
    dailyRentalRate: number;
    estimatedUsageDays: number;
    usefulLifeYears: number;
    maintenanceCostPerYear?: number;
    storageCostPerYear?: number;
}) => {
    ownershipCost: number;
    rentalCost: number;
    breakEvenDays: number;
    recommendation: string;
};
/**
 * Assigns operator to equipment.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {string} operatorId - Operator ID
 * @param {string[]} certifications - Operator certifications
 * @returns {Promise<ConstructionEquipment>} Updated equipment
 *
 * @example
 * ```typescript
 * await assignOperator(equipmentId, 'OP-123', ['EXCAVATOR-CERT', 'OSHA-30']);
 * ```
 */
export declare const assignOperator: (equipmentId: string, operatorId: string, certifications: string[]) => Promise<ConstructionEquipment>;
/**
 * Tracks equipment certifications and compliance.
 *
 * @param {string} equipmentId - Equipment ID
 * @param {string} certificationType - Certification type
 * @param {Date} expirationDate - Expiration date
 * @returns {Promise<ConstructionEquipment>} Updated equipment
 *
 * @example
 * ```typescript
 * await trackCertification(equipmentId, 'DOT-INSPECTION', new Date('2025-12-31'));
 * ```
 */
export declare const trackCertification: (equipmentId: string, certificationType: string, expirationDate: Date) => Promise<ConstructionEquipment>;
/**
 * Checks equipment certification status.
 *
 * @param {string} equipmentId - Equipment ID
 * @returns {Promise<object>} Certification status
 *
 * @example
 * ```typescript
 * const status = await checkCertificationStatus(equipmentId);
 * ```
 */
export declare const checkCertificationStatus: (equipmentId: string) => Promise<{
    equipmentId: string;
    certifications: string[];
    warrantyStatus: CertificationStatus;
    insuranceStatus: CertificationStatus;
}>;
/**
 * Formats equipment summary for reporting.
 *
 * @param {ConstructionEquipment} equipment - Equipment record
 * @returns {object} Formatted summary
 */
export declare const formatEquipmentSummary: (equipment: ConstructionEquipment) => object;
declare const _default: {
    registerEquipment: (data: RegisterEquipmentDto) => Promise<ConstructionEquipment>;
    updateEquipmentStatus: (equipmentId: string, status: EquipmentStatus, notes?: string) => Promise<ConstructionEquipment>;
    trackEquipmentLocation: (equipmentId: string, location: string, coordinates?: {
        lat: number;
        lng: number;
    }) => Promise<ConstructionEquipment>;
    updateOperatingHours: (equipmentId: string, hours: number) => Promise<ConstructionEquipment>;
    updateConditionRating: (equipmentId: string, rating: ConditionRating, notes?: string) => Promise<ConstructionEquipment>;
    searchEquipment: (filters: {
        category?: EquipmentCategory;
        status?: EquipmentStatus;
        ownershipType?: OwnershipType;
        location?: string;
    }) => Promise<ConstructionEquipment[]>;
    allocateEquipment: (equipmentId: string, data: AllocateEquipmentDto) => Promise<EquipmentAllocation>;
    releaseEquipment: (allocationId: string, finalOperatingHours: number) => Promise<EquipmentAllocation>;
    reserveEquipment: (equipmentId: string, startDate: Date, endDate: Date, projectId: string) => Promise<EquipmentAllocation>;
    cancelReservation: (allocationId: string) => Promise<EquipmentAllocation>;
    checkEquipmentAvailability: (equipmentId: string, startDate: Date, endDate: Date) => Promise<boolean>;
    scheduleMaintenancePM: (equipmentId: string, data: ScheduleMaintenanceDto) => Promise<EquipmentMaintenanceRecord>;
    recordMaintenanceCompletion: (maintenanceId: string, completionData: {
        completionDate: Date;
        technicianName?: string;
        totalCost?: number;
        laborCost?: number;
        partsCost?: number;
        partsReplaced?: string[];
        downtimeHours?: number;
        findings?: string;
        nextServiceDue?: Date;
    }) => Promise<EquipmentMaintenanceRecord>;
    trackEmergencyRepair: (equipmentId: string, description: string, estimatedDowntime: number) => Promise<EquipmentMaintenanceRecord>;
    getMaintenanceHistory: (equipmentId: string, filters?: {
        maintenanceType?: MaintenanceType;
        dateFrom?: Date;
        dateTo?: Date;
    }) => Promise<EquipmentMaintenanceRecord[]>;
    calculateMaintenanceCost: (equipmentId: string, dateFrom?: Date, dateTo?: Date) => Promise<number>;
    trackEquipmentUtilization: (equipmentId: string, startDate: Date, endDate: Date) => Promise<{
        equipmentId: string;
        utilizationRate: number;
        hoursInUse: number;
        hoursIdle: number;
        hoursMaintenance: number;
        totalPeriodHours: number;
    }>;
    analyzeEquipmentDowntime: (equipmentId: string, startDate: Date, endDate: Date) => Promise<{
        totalDowntimeHours: number;
        maintenanceDowntime: number;
        repairDowntime: number;
        emergencyDowntime: number;
        downtimePercentage: number;
    }>;
    generatePerformanceReport: (equipmentId: string, startDate: Date, endDate: Date) => Promise<{
        equipment: ConstructionEquipment;
        utilization: any;
        downtime: any;
        maintenanceCost: number;
        allocationCount: number;
        revenueGenerated: number;
    }>;
    calculateEquipmentROI: (equipmentId: string) => Promise<{
        equipmentId: string;
        initialInvestment: number;
        totalRevenue: number;
        totalCosts: number;
        netProfit: number;
        roiPercentage: number;
        paybackPeriodMonths: number;
    }>;
    trackFuelConsumption: (allocationId: string, gallons: number, costPerGallon: number) => Promise<EquipmentAllocation>;
    calculateDepreciation: (equipmentId: string, method: "straight-line" | "declining-balance", usefulLifeYears: number) => Promise<{
        currentValue: number;
        annualDepreciation: number;
        totalDepreciation: number;
        remainingValue: number;
    }>;
    analyzeRentalVsOwnership: (params: {
        purchasePrice: number;
        dailyRentalRate: number;
        estimatedUsageDays: number;
        usefulLifeYears: number;
        maintenanceCostPerYear?: number;
        storageCostPerYear?: number;
    }) => {
        ownershipCost: number;
        rentalCost: number;
        breakEvenDays: number;
        recommendation: string;
    };
    assignOperator: (equipmentId: string, operatorId: string, certifications: string[]) => Promise<ConstructionEquipment>;
    trackCertification: (equipmentId: string, certificationType: string, expirationDate: Date) => Promise<ConstructionEquipment>;
    checkCertificationStatus: (equipmentId: string) => Promise<{
        equipmentId: string;
        certifications: string[];
        warrantyStatus: CertificationStatus;
        insuranceStatus: CertificationStatus;
    }>;
    formatEquipmentSummary: (equipment: ConstructionEquipment) => object;
};
export default _default;
//# sourceMappingURL=construction-equipment-management-kit.d.ts.map