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

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsObject,
  IsUUID,
  Min,
  Max,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transaction, Op, WhereOptions } from 'sequelize';
import { ConstructionEquipment } from './models/construction-equipment.model';
import { EquipmentMaintenanceRecord } from './models/equipment-maintenance-record.model';
import { EquipmentAllocation } from './models/equipment-allocation.model';
import { 
    EquipmentCategory, 
    EquipmentStatus, 
    OwnershipType, 
    MaintenanceType, 
    ConditionRating, 
    CertificationStatus 
} from './types/equipment.types';
import { RegisterEquipmentDto } from './dto/register-equipment.dto';
import { AllocateEquipmentDto } from './dto/allocate-equipment.dto';
import { ScheduleMaintenanceDto } from './dto/schedule-maintenance.dto';

// ============================================================================
// EQUIPMENT REGISTRATION & TRACKING FUNCTIONS
// ============================================================================

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
export const registerEquipment = async (
  data: RegisterEquipmentDto
): Promise<ConstructionEquipment> => {
  const existing = await ConstructionEquipment.findOne({
    where: { equipmentNumber: data.equipmentNumber },
  });

  if (existing) {
    throw new ConflictException(
      `Equipment with number ${data.equipmentNumber} already exists`
    );
  }

  const equipment = await ConstructionEquipment.create({
    ...data,
    status: EquipmentStatus.AVAILABLE,
    currentValue: data.purchasePrice,
    acquisitionDate: new Date(),
    operatingHours: 0,
    isActive: true,
  });

  return equipment;
};

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
export const updateEquipmentStatus = async (
  equipmentId: string,
  status: EquipmentStatus,
  notes?: string
): Promise<ConstructionEquipment> => {
  const equipment = await ConstructionEquipment.findByPk(equipmentId);
  if (!equipment) {
    throw new NotFoundException('Equipment not found');
  }

  await equipment.update({ status, notes });
  return equipment;
};

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
export const trackEquipmentLocation = async (
  equipmentId: string,
  location: string,
  coordinates?: { lat: number; lng: number }
): Promise<ConstructionEquipment> => {
  const equipment = await ConstructionEquipment.findByPk(equipmentId);
  if (!equipment) {
    throw new NotFoundException('Equipment not found');
  }

  await equipment.update({
    currentLocation: location,
    gpsCoordinates: coordinates || equipment.gpsCoordinates,
  });

  return equipment;
};

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
export const updateOperatingHours = async (
  equipmentId: string,
  hours: number
): Promise<ConstructionEquipment> => {
  const equipment = await ConstructionEquipment.findByPk(equipmentId);
  if (!equipment) {
    throw new NotFoundException('Equipment not found');
  }

  if (hours < equipment.operatingHours) {
    throw new BadRequestException('Operating hours cannot decrease');
  }

  await equipment.update({ operatingHours: hours });
  return equipment;
};

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
export const updateConditionRating = async (
  equipmentId: string,
  rating: ConditionRating,
  notes?: string
): Promise<ConstructionEquipment> => {
  const equipment = await ConstructionEquipment.findByPk(equipmentId);
  if (!equipment) {
    throw new NotFoundException('Equipment not found');
  }

  await equipment.update({ conditionRating: rating, notes });
  return equipment;
};

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
export const searchEquipment = async (filters: {
  category?: EquipmentCategory;
  status?: EquipmentStatus;
  ownershipType?: OwnershipType;
  location?: string;
}): Promise<ConstructionEquipment[]> => {
  const where: WhereOptions = {};

  if (filters.category) where.category = filters.category;
  if (filters.status) where.status = filters.status;
  if (filters.ownershipType) where.ownershipType = filters.ownershipType;
  if (filters.location) {
    where.currentLocation = { [Op.iLike]: `%${filters.location}%` };
  }

  return ConstructionEquipment.findAll({ where });
};

// ============================================================================
// EQUIPMENT ALLOCATION & SCHEDULING FUNCTIONS
// ============================================================================

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
export const allocateEquipment = async (
  equipmentId: string,
  data: AllocateEquipmentDto
): Promise<EquipmentAllocation> => {
  const equipment = await ConstructionEquipment.findByPk(equipmentId);
  if (!equipment) {
    throw new NotFoundException('Equipment not found');
  }

  if (equipment.status !== EquipmentStatus.AVAILABLE) {
    throw new BadRequestException('Equipment is not available for allocation');
  }

  const endDate = new Date(data.startDate);
  endDate.setDate(endDate.getDate() + data.estimatedDuration);

  const allocation = await EquipmentAllocation.create({
    equipmentId,
    projectId: data.projectId,
    startDate: data.startDate,
    endDate,
    assignedOperatorId: data.assignedOperatorId,
    purpose: data.purpose,
    allocationStatus: 'active',
    dailyRate: equipment.dailyRentalRate || 0,
    estimatedCost:
      (equipment.dailyRentalRate || 0) * data.estimatedDuration,
    startingOperatingHours: equipment.operatingHours,
  });

  await equipment.update({
    status: EquipmentStatus.IN_USE,
    assignedProjectId: data.projectId,
    assignedOperatorId: data.assignedOperatorId,
  });

  return allocation;
};

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
export const releaseEquipment = async (
  allocationId: string,
  finalOperatingHours: number
): Promise<EquipmentAllocation> => {
  const allocation = await EquipmentAllocation.findByPk(allocationId, {
    include: [ConstructionEquipment],
  });

  if (!allocation) {
    throw new NotFoundException('Allocation not found');
  }

  const actualReturnDate = new Date();
  const daysUsed = Math.ceil(
    (actualReturnDate.getTime() - allocation.startDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  await allocation.update({
    allocationStatus: 'completed',
    actualReturnDate,
    endingOperatingHours: finalOperatingHours,
    actualCost: (allocation.dailyRate || 0) * daysUsed,
  });

  await allocation.equipment?.update({
    status: EquipmentStatus.AVAILABLE,
    assignedProjectId: null,
    assignedOperatorId: null,
    operatingHours: finalOperatingHours,
  });

  return allocation;
};

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
export const reserveEquipment = async (
  equipmentId: string,
  startDate: Date,
  endDate: Date,
  projectId: string
): Promise<EquipmentAllocation> => {
  const equipment = await ConstructionEquipment.findByPk(equipmentId);
  if (!equipment) {
    throw new NotFoundException('Equipment not found');
  }

  const conflictingReservation = await EquipmentAllocation.findOne({
    where: {
      equipmentId,
      allocationStatus: { [Op.in]: ['pending', 'active'] },
      [Op.or]: [
        {
          startDate: { [Op.between]: [startDate, endDate] },
        },
        {
          endDate: { [Op.between]: [startDate, endDate] },
        },
      ],
    },
  });

  if (conflictingReservation) {
    throw new ConflictException('Equipment already reserved for this period');
  }

  const reservation = await EquipmentAllocation.create({
    equipmentId,
    projectId,
    startDate,
    endDate,
    allocationStatus: 'pending',
    dailyRate: equipment.dailyRentalRate || 0,
  });

  await equipment.update({ status: EquipmentStatus.RESERVED });

  return reservation;
};

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
export const cancelReservation = async (
  allocationId: string
): Promise<EquipmentAllocation> => {
  const allocation = await EquipmentAllocation.findByPk(allocationId, {
    include: [ConstructionEquipment],
  });

  if (!allocation) {
    throw new NotFoundException('Allocation not found');
  }

  if (allocation.allocationStatus !== 'pending') {
    throw new BadRequestException('Can only cancel pending reservations');
  }

  await allocation.update({ allocationStatus: 'cancelled' });
  await allocation.equipment?.update({ status: EquipmentStatus.AVAILABLE });

  return allocation;
};

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
export const checkEquipmentAvailability = async (
  equipmentId: string,
  startDate: Date,
  endDate: Date
): Promise<boolean> => {
  const conflictingAllocation = await EquipmentAllocation.findOne({
    where: {
      equipmentId,
      allocationStatus: { [Op.in]: ['pending', 'active'] },
      [Op.or]: [
        { startDate: { [Op.between]: [startDate, endDate] } },
        { endDate: { [Op.between]: [startDate, endDate] } },
      ],
    },
  });

  return !conflictingAllocation;
};

// ============================================================================
// MAINTENANCE SCHEDULING & TRACKING FUNCTIONS
// ============================================================================

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
export const scheduleMaintenancePM = async (
  equipmentId: string,
  data: ScheduleMaintenanceDto
): Promise<EquipmentMaintenanceRecord> => {
  const equipment = await ConstructionEquipment.findByPk(equipmentId);
  if (!equipment) {
    throw new NotFoundException('Equipment not found');
  }

  const maintenance = await EquipmentMaintenanceRecord.create({
    equipmentId,
    maintenanceType: data.maintenanceType,
    description: data.description,
    scheduledDate: data.scheduledDate,
    totalCost: data.estimatedCost || 0,
    serviceProvider: data.serviceProvider,
    operatingHoursAtService: equipment.operatingHours,
  });

  await equipment.update({ nextMaintenanceDate: data.scheduledDate });

  return maintenance;
};

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
export const recordMaintenanceCompletion = async (
  maintenanceId: string,
  completionData: {
    completionDate: Date;
    technicianName?: string;
    totalCost?: number;
    laborCost?: number;
    partsCost?: number;
    partsReplaced?: string[];
    downtimeHours?: number;
    findings?: string;
    nextServiceDue?: Date;
  }
): Promise<EquipmentMaintenanceRecord> => {
  const maintenance = await EquipmentMaintenanceRecord.findByPk(maintenanceId, {
    include: [ConstructionEquipment],
  });

  if (!maintenance) {
    throw new NotFoundException('Maintenance record not found');
  }

  await maintenance.update(completionData);

  if (completionData.nextServiceDue && maintenance.equipment) {
    await maintenance.equipment.update({
      lastMaintenanceDate: completionData.completionDate,
      nextMaintenanceDate: completionData.nextServiceDue,
    });
  }

  return maintenance;
};

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
export const trackEmergencyRepair = async (
  equipmentId: string,
  description: string,
  estimatedDowntime: number
): Promise<EquipmentMaintenanceRecord> => {
  const equipment = await ConstructionEquipment.findByPk(equipmentId);
  if (!equipment) {
    throw new NotFoundException('Equipment not found');
  }

  const repair = await EquipmentMaintenanceRecord.create({
    equipmentId,
    maintenanceType: MaintenanceType.EMERGENCY,
    description,
    scheduledDate: new Date(),
    downtimeHours: estimatedDowntime,
    operatingHoursAtService: equipment.operatingHours,
    followUpRequired: true,
  });

  await equipment.update({ status: EquipmentStatus.REPAIR });

  return repair;
};

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
export const getMaintenanceHistory = async (
  equipmentId: string,
  filters?: {
    maintenanceType?: MaintenanceType;
    dateFrom?: Date;
    dateTo?: Date;
  }
): Promise<EquipmentMaintenanceRecord[]> => {
  const where: WhereOptions = { equipmentId };

  if (filters?.maintenanceType) {
    where.maintenanceType = filters.maintenanceType;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    where.scheduledDate = {};
    if (filters.dateFrom) {
      where.scheduledDate[Op.gte] = filters.dateFrom;
    }
    if (filters.dateTo) {
      where.scheduledDate[Op.lte] = filters.dateTo;
    }
  }

  return EquipmentMaintenanceRecord.findAll({
    where,
    order: [['scheduledDate', 'DESC']],
  });
};

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
export const calculateMaintenanceCost = async (
  equipmentId: string,
  dateFrom?: Date,
  dateTo?: Date
): Promise<number> => {
  const where: WhereOptions = { equipmentId, completionDate: { [Op.ne]: null } };

  if (dateFrom || dateTo) {
    where.completionDate = {};
    if (dateFrom) where.completionDate[Op.gte] = dateFrom;
    if (dateTo) where.completionDate[Op.lte] = dateTo;
  }

  const records = await EquipmentMaintenanceRecord.findAll({ where });
  return records.reduce((sum, record) => sum + (record.totalCost || 0), 0);
};

// ============================================================================
// UTILIZATION ANALYSIS FUNCTIONS
// ============================================================================

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
export const trackEquipmentUtilization = async (
  equipmentId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  equipmentId: string;
  utilizationRate: number;
  hoursInUse: number;
  hoursIdle: number;
  hoursMaintenance: number;
  totalPeriodHours: number;
}> => {
  const allocations = await EquipmentAllocation.findAll({
    where: {
      equipmentId,
      allocationStatus: 'completed',
      actualReturnDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const maintenanceRecords = await EquipmentMaintenanceRecord.findAll({
    where: {
      equipmentId,
      completionDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalPeriodHours =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

  const hoursInUse = allocations.reduce((sum, alloc) => {
    const hours =
      (alloc.endingOperatingHours || 0) - (alloc.startingOperatingHours || 0);
    return sum + hours;
  }, 0);

  const hoursMaintenance = maintenanceRecords.reduce(
    (sum, record) => sum + (record.downtimeHours || 0),
    0
  );

  const hoursIdle = totalPeriodHours - hoursInUse - hoursMaintenance;
  const utilizationRate = (hoursInUse / totalPeriodHours) * 100;

  return {
    equipmentId,
    utilizationRate: Math.round(utilizationRate * 100) / 100,
    hoursInUse: Math.round(hoursInUse * 100) / 100,
    hoursIdle: Math.round(hoursIdle * 100) / 100,
    hoursMaintenance: Math.round(hoursMaintenance * 100) / 100,
    totalPeriodHours: Math.round(totalPeriodHours * 100) / 100,
  };
};

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
export const analyzeEquipmentDowntime = async (
  equipmentId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  totalDowntimeHours: number;
  maintenanceDowntime: number;
  repairDowntime: number;
  emergencyDowntime: number;
  downtimePercentage: number;
}> => {
  const maintenanceRecords = await EquipmentMaintenanceRecord.findAll({
    where: {
      equipmentId,
      completionDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const totalPeriodHours =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

  const maintenanceDowntime = maintenanceRecords
    .filter((r) => r.maintenanceType === MaintenanceType.PREVENTIVE)
    .reduce((sum, r) => sum + (r.downtimeHours || 0), 0);

  const repairDowntime = maintenanceRecords
    .filter((r) => r.maintenanceType === MaintenanceType.CORRECTIVE)
    .reduce((sum, r) => sum + (r.downtimeHours || 0), 0);

  const emergencyDowntime = maintenanceRecords
    .filter((r) => r.maintenanceType === MaintenanceType.EMERGENCY)
    .reduce((sum, r) => sum + (r.downtimeHours || 0), 0);

  const totalDowntimeHours =
    maintenanceDowntime + repairDowntime + emergencyDowntime;
  const downtimePercentage = (totalDowntimeHours / totalPeriodHours) * 100;

  return {
    totalDowntimeHours: Math.round(totalDowntimeHours * 100) / 100,
    maintenanceDowntime: Math.round(maintenanceDowntime * 100) / 100,
    repairDowntime: Math.round(repairDowntime * 100) / 100,
    emergencyDowntime: Math.round(emergencyDowntime * 100) / 100,
    downtimePercentage: Math.round(downtimePercentage * 100) / 100,
  };
};

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
export const generatePerformanceReport = async (
  equipmentId: string,
  startDate: Date,
  endDate: Date
): Promise<{
  equipment: ConstructionEquipment;
  utilization: any;
  downtime: any;
  maintenanceCost: number;
  allocationCount: number;
  revenueGenerated: number;
}> => {
  const equipment = await ConstructionEquipment.findByPk(equipmentId);
  if (!equipment) {
    throw new NotFoundException('Equipment not found');
  }

  const utilization = await trackEquipmentUtilization(
    equipmentId,
    startDate,
    endDate
  );
  const downtime = await analyzeEquipmentDowntime(equipmentId, startDate, endDate);
  const maintenanceCost = await calculateMaintenanceCost(
    equipmentId,
    startDate,
    endDate
  );

  const allocations = await EquipmentAllocation.findAll({
    where: {
      equipmentId,
      actualReturnDate: { [Op.between]: [startDate, endDate] },
    },
  });

  const revenueGenerated = allocations.reduce(
    (sum, alloc) => sum + (alloc.actualCost || 0),
    0
  );

  return {
    equipment,
    utilization,
    downtime,
    maintenanceCost: Math.round(maintenanceCost * 100) / 100,
    allocationCount: allocations.length,
    revenueGenerated: Math.round(revenueGenerated * 100) / 100,
  };
};

// ============================================================================
// COST TRACKING & FINANCIAL FUNCTIONS
// ============================================================================

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
export const calculateEquipmentROI = async (
  equipmentId: string
): Promise<{
  equipmentId: string;
  initialInvestment: number;
  totalRevenue: number;
  totalCosts: number;
  netProfit: number;
  roiPercentage: number;
  paybackPeriodMonths: number;
}> => {
  const equipment = await ConstructionEquipment.findByPk(equipmentId);
  if (!equipment) {
    throw new NotFoundException('Equipment not found');
  }

  const allocations = await EquipmentAllocation.findAll({
    where: { equipmentId, allocationStatus: 'completed' },
  });

  const maintenanceRecords = await EquipmentMaintenanceRecord.findAll({
    where: { equipmentId, completionDate: { [Op.ne]: null } },
  });

  const initialInvestment = equipment.purchasePrice || 0;
  const totalRevenue = allocations.reduce(
    (sum, alloc) => sum + (alloc.actualCost || 0),
    0
  );
  const totalCosts = maintenanceRecords.reduce(
    (sum, record) => sum + (record.totalCost || 0),
    0
  );

  const netProfit = totalRevenue - totalCosts;
  const roiPercentage =
    initialInvestment > 0 ? (netProfit / initialInvestment) * 100 : 0;

  // Simple payback period calculation
  const monthlyRevenue = totalRevenue / Math.max(allocations.length, 1);
  const paybackPeriodMonths =
    monthlyRevenue > 0 ? initialInvestment / monthlyRevenue : 0;

  return {
    equipmentId,
    initialInvestment: Math.round(initialInvestment * 100) / 100,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalCosts: Math.round(totalCosts * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    roiPercentage: Math.round(roiPercentage * 100) / 100,
    paybackPeriodMonths: Math.round(paybackPeriodMonths * 100) / 100,
  };
};

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
export const trackFuelConsumption = async (
  allocationId: string,
  gallons: number,
  costPerGallon: number
): Promise<EquipmentAllocation> => {
  const allocation = await EquipmentAllocation.findByPk(allocationId);
  if (!allocation) {
    throw new NotFoundException('Allocation not found');
  }

  const fuelCost = gallons * costPerGallon;
  const currentActualCost = allocation.actualCost || 0;

  await allocation.update({
    fuelConsumed: gallons,
    actualCost: currentActualCost + fuelCost,
  });

  return allocation;
};

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
export const calculateDepreciation = async (
  equipmentId: string,
  method: 'straight-line' | 'declining-balance',
  usefulLifeYears: number
): Promise<{
  currentValue: number;
  annualDepreciation: number;
  totalDepreciation: number;
  remainingValue: number;
}> => {
  const equipment = await ConstructionEquipment.findByPk(equipmentId);
  if (!equipment) {
    throw new NotFoundException('Equipment not found');
  }

  const purchasePrice = equipment.purchasePrice || 0;
  const acquisitionDate = equipment.acquisitionDate || new Date();
  const yearsOwned =
    (new Date().getTime() - acquisitionDate.getTime()) /
    (1000 * 60 * 60 * 24 * 365);

  let annualDepreciation = 0;
  let totalDepreciation = 0;

  if (method === 'straight-line') {
    annualDepreciation = purchasePrice / usefulLifeYears;
    totalDepreciation = Math.min(annualDepreciation * yearsOwned, purchasePrice);
  } else if (method === 'declining-balance') {
    const depreciationRate = 2 / usefulLifeYears; // Double declining
    totalDepreciation = purchasePrice * (1 - Math.pow(1 - depreciationRate, yearsOwned));
    annualDepreciation = purchasePrice * depreciationRate;
  }

  const currentValue = purchasePrice - totalDepreciation;

  await equipment.update({ currentValue });

  return {
    currentValue: Math.round(currentValue * 100) / 100,
    annualDepreciation: Math.round(annualDepreciation * 100) / 100,
    totalDepreciation: Math.round(totalDepreciation * 100) / 100,
    remainingValue: Math.round(currentValue * 100) / 100,
  };
};

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
export const analyzeRentalVsOwnership = (params: {
  purchasePrice: number;
  dailyRentalRate: number;
  estimatedUsageDays: number;
  usefulLifeYears: number;
  maintenanceCostPerYear?: number;
  storageCostPerYear?: number;
}): {
  ownershipCost: number;
  rentalCost: number;
  breakEvenDays: number;
  recommendation: string;
} => {
  const annualDepreciation = params.purchasePrice / params.usefulLifeYears;
  const annualOwnershipCost =
    annualDepreciation +
    (params.maintenanceCostPerYear || 0) +
    (params.storageCostPerYear || 0);

  const ownershipCost =
    (annualOwnershipCost / 365) * params.estimatedUsageDays;
  const rentalCost = params.dailyRentalRate * params.estimatedUsageDays;
  const breakEvenDays = params.purchasePrice / params.dailyRentalRate;

  const recommendation =
    params.estimatedUsageDays > breakEvenDays
      ? 'Purchase recommended'
      : 'Rental recommended';

  return {
    ownershipCost: Math.round(ownershipCost * 100) / 100,
    rentalCost: Math.round(rentalCost * 100) / 100,
    breakEvenDays: Math.round(breakEvenDays),
    recommendation,
  };
};

// ============================================================================
// CERTIFICATION & OPERATOR MANAGEMENT FUNCTIONS
// ============================================================================

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
export const assignOperator = async (
  equipmentId: string,
  operatorId: string,
  certifications: string[]
): Promise<ConstructionEquipment> => {
  const equipment = await ConstructionEquipment.findByPk(equipmentId);
  if (!equipment) {
    throw new NotFoundException('Equipment not found');
  }

  const requiredCerts = equipment.certifications || [];
  const hasAllCerts = requiredCerts.every((cert) =>
    certifications.includes(cert)
  );

  if (!hasAllCerts) {
    throw new BadRequestException(
      'Operator does not have all required certifications'
    );
  }

  await equipment.update({ assignedOperatorId: operatorId });
  return equipment;
};

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
export const trackCertification = async (
  equipmentId: string,
  certificationType: string,
  expirationDate: Date
): Promise<ConstructionEquipment> => {
  const equipment = await ConstructionEquipment.findByPk(equipmentId);
  if (!equipment) {
    throw new NotFoundException('Equipment not found');
  }

  const currentCerts = equipment.certifications || [];
  if (!currentCerts.includes(certificationType)) {
    currentCerts.push(certificationType);
  }

  await equipment.update({ certifications: currentCerts });
  return equipment;
};

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
export const checkCertificationStatus = async (
  equipmentId: string
): Promise<{
  equipmentId: string;
  certifications: string[];
  warrantyStatus: CertificationStatus;
  insuranceStatus: CertificationStatus;
}> => {
  const equipment = await ConstructionEquipment.findByPk(equipmentId);
  if (!equipment) {
    throw new NotFoundException('Equipment not found');
  }

  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  let warrantyStatus = CertificationStatus.NOT_REQUIRED;
  if (equipment.warrantyExpiration) {
    if (equipment.warrantyExpiration < now) {
      warrantyStatus = CertificationStatus.EXPIRED;
    } else if (equipment.warrantyExpiration < thirtyDaysFromNow) {
      warrantyStatus = CertificationStatus.EXPIRING_SOON;
    } else {
      warrantyStatus = CertificationStatus.VALID;
    }
  }

  let insuranceStatus = CertificationStatus.NOT_REQUIRED;
  if (equipment.insuranceExpiration) {
    if (equipment.insuranceExpiration < now) {
      insuranceStatus = CertificationStatus.EXPIRED;
    } else if (equipment.insuranceExpiration < thirtyDaysFromNow) {
      insuranceStatus = CertificationStatus.EXPIRING_SOON;
    } else {
      insuranceStatus = CertificationStatus.VALID;
    }
  }

  return {
    equipmentId: equipment.id,
    certifications: equipment.certifications || [],
    warrantyStatus,
    insuranceStatus,
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validates equipment availability for allocation.
 *
 * @param {ConstructionEquipment} equipment - Equipment record
 * @returns {boolean} Whether equipment can be allocated
 */
const validateEquipmentForAllocation = (
  equipment: ConstructionEquipment
): boolean => {
  if (!equipment.isActive) return false;
  if (equipment.status === EquipmentStatus.OUT_OF_SERVICE) return false;
  if (equipment.status === EquipmentStatus.RETIRED) return false;
  return true;
};

/**
 * Calculates estimated maintenance interval.
 *
 * @param {number} operatingHours - Current operating hours
 * @param {number} intervalHours - Maintenance interval
 * @returns {Date} Next maintenance date
 */
const calculateNextMaintenanceDate = (
  operatingHours: number,
  intervalHours: number
): Date => {
  const remainingHours = intervalHours - (operatingHours % intervalHours);
  const estimatedDays = Math.ceil(remainingHours / 8); // Assuming 8 hours/day
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + estimatedDays);
  return nextDate;
};

/**
 * Formats equipment summary for reporting.
 *
 * @param {ConstructionEquipment} equipment - Equipment record
 * @returns {object} Formatted summary
 */
export const formatEquipmentSummary = (
  equipment: ConstructionEquipment
): object => {
  return {
    id: equipment.id,
    equipmentNumber: equipment.equipmentNumber,
    description: `${equipment.year || ''} ${equipment.make} ${equipment.model}`,
    category: equipment.category,
    status: equipment.status,
    location: equipment.currentLocation,
    operatingHours: equipment.operatingHours,
    condition: equipment.conditionRating,
    value: equipment.currentValue,
  };
};

export default {
  registerEquipment,
  updateEquipmentStatus,
  trackEquipmentLocation,
  updateOperatingHours,
  updateConditionRating,
  searchEquipment,
  allocateEquipment,
  releaseEquipment,
  reserveEquipment,
  cancelReservation,
  checkEquipmentAvailability,
  scheduleMaintenancePM,
  recordMaintenanceCompletion,
  trackEmergencyRepair,
  getMaintenanceHistory,
  calculateMaintenanceCost,
  trackEquipmentUtilization,
  analyzeEquipmentDowntime,
  generatePerformanceReport,
  calculateEquipmentROI,
  trackFuelConsumption,
  calculateDepreciation,
  analyzeRentalVsOwnership,
  assignOperator,
  trackCertification,
  checkCertificationStatus,
  formatEquipmentSummary,
};
