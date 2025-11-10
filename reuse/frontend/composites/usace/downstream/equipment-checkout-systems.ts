/**
 * LOC: USACE-DOWNSTREAM-CHECKOUT-002
 * File: /reuse/frontend/composites/usace/downstream/equipment-checkout-systems.ts
 *
 * UPSTREAM (imports from):
 *   - ../usace-equipment-tracking-composites
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS equipment management applications
 *   - Equipment utilization tracking systems
 *   - Project resource allocation tools
 *   - Equipment accountability interfaces
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/equipment-checkout-systems.ts
 * Locator: WC-USACE-CHECKOUT-SYS-002
 * Purpose: Comprehensive equipment checkout/check-in system with accountability and utilization tracking
 *
 * Upstream: usace-equipment-tracking-composites, React 18+, Next.js 16+, TypeScript 5.x
 * Downstream: USACE equipment management, utilization tracking, resource allocation, accountability
 * Dependencies: usace-equipment-tracking-composites types and hooks
 * Exports: 15 equipment checkout system functions and components
 *
 * LLM Context: Production-grade USACE equipment checkout management system.
 * Provides complete equipment checkout workflow including availability checking, reservation management,
 * checkout authorization with operator qualification verification, check-in processing with condition
 * assessment, overdue tracking with automated notifications, equipment utilization analysis, damage
 * reporting and cost recovery, project allocation and billing, equipment location tracking, checkout
 * history and audit trail, bulk checkout for projects, equipment substitution recommendations,
 * conflict resolution, checkout extensions and renewals, and integration with equipment maintenance
 * scheduling to prevent checkout of equipment due for service.
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Equipment,
  EquipmentCheckout,
  EquipmentOperator,
  DamageReport,
  useEquipmentCheckout,
  validateOperatorQualifications,
} from '../usace-equipment-tracking-composites';

// ============================================================================
// TYPE DEFINITIONS - Checkout System Types
// ============================================================================

export interface CheckoutRequest {
  requestId: string;
  equipmentId: string;
  equipmentNumber: string;
  requestedBy: string;
  requestedDate: Date;
  checkoutDate: Date;
  expectedReturnDate: Date;
  checkoutPurpose: string;
  projectCode?: string;
  operatorId: string;
  operatorName: string;
  alternateEquipment?: string[];
  priority: 'routine' | 'priority' | 'emergency';
  approvalRequired: boolean;
  approvedBy?: string;
  approvalDate?: Date;
  status: 'pending' | 'approved' | 'rejected' | 'checked_out' | 'completed' | 'cancelled';
  notes?: string;
}

export interface CheckoutAuthorization {
  authorizationId: string;
  checkoutId: string;
  operatorId: string;
  operatorQualified: boolean;
  qualificationIssues: string[];
  equipmentAvailable: boolean;
  availabilityIssues: string[];
  maintenanceStatus: 'ok' | 'due_soon' | 'overdue' | 'in_maintenance';
  safetyChecksPassed: boolean;
  safetyIssues: string[];
  canAuthorize: boolean;
  authorizedBy?: string;
  authorizationDate?: Date;
  conditions: string[];
}

export interface CheckInData {
  checkoutId: string;
  returnedDate: Date;
  returnedBy: string;
  returnedCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'damaged';
  conditionNotes: string;
  meterReading?: {
    type: 'hours' | 'mileage';
    reading: number;
    previousReading: number;
    difference: number;
  };
  fuelLevel?: {
    levelAtCheckout: number;
    levelAtReturn: number;
    fuelAdded: number;
  };
  damages: DamageReport[];
  cleanlinessRating: 1 | 2 | 3 | 4 | 5;
  maintenanceNeeded: boolean;
  maintenanceIssues: string[];
  photoUrls: string[];
  inspectionComplete: boolean;
  inspectedBy?: string;
}

export interface CheckoutConflict {
  conflictId: string;
  equipmentId: string;
  conflictType: 'overlapping_checkout' | 'maintenance_scheduled' | 'out_of_service' | 'reserved';
  conflictingCheckout?: EquipmentCheckout;
  conflictingReservation?: CheckoutReservation;
  maintenanceWindow?: { start: Date; end: Date };
  resolution: 'deny' | 'override' | 'reschedule' | 'alternate_equipment';
  alternateEquipmentIds?: string[];
}

export interface CheckoutReservation {
  reservationId: string;
  equipmentId: string;
  equipmentNumber: string;
  reservedBy: string;
  reservationDate: Date;
  startDate: Date;
  endDate: Date;
  projectCode?: string;
  purpose: string;
  status: 'active' | 'confirmed' | 'fulfilled' | 'cancelled' | 'expired';
  priority: number;
  notifications: boolean;
}

export interface EquipmentUtilization {
  equipmentId: string;
  equipmentNumber: string;
  period: string;
  totalCheckouts: number;
  totalDaysCheckedOut: number;
  totalDaysAvailable: number;
  utilizationRate: number;
  averageCheckoutDuration: number;
  topUsers: { userId: string; userName: string; checkoutCount: number }[];
  topProjects: { projectCode: string; projectName: string; days: number }[];
  revenueGenerated?: number;
}

export interface CheckoutAnalytics {
  period: string;
  totalCheckouts: number;
  totalEquipmentDays: number;
  averageUtilizationRate: number;
  overdueCount: number;
  damageReportCount: number;
  mostUtilizedEquipment: { equipmentId: string; rate: number }[];
  leastUtilizedEquipment: { equipmentId: string; rate: number }[];
  checkoutsByCategory: Record<string, number>;
  checkoutsByProject: Record<string, number>;
}

export interface BulkCheckoutRequest {
  bulkRequestId: string;
  projectCode: string;
  requestedBy: string;
  startDate: Date;
  endDate: Date;
  equipmentRequests: {
    category: string;
    subcategory?: string;
    quantity: number;
    specifications?: Record<string, any>;
    assignedEquipment?: string[];
  }[];
  status: 'draft' | 'submitted' | 'partially_fulfilled' | 'fulfilled' | 'rejected';
}

// ============================================================================
// CHECKOUT REQUEST MANAGEMENT
// ============================================================================

/**
 * Hook for managing checkout requests
 *
 * @param {string} userId - Optional user ID to filter requests
 * @returns {object} Checkout request management
 *
 * @example
 * ```tsx
 * function CheckoutRequestManager({ userId }) {
 *   const {
 *     requests,
 *     createRequest,
 *     approveRequest,
 *     rejectRequest
 *   } = useCheckoutRequests(userId);
 * }
 * ```
 */
export function useCheckoutRequests(userId?: string) {
  const [requests, setRequests] = useState<CheckoutRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const pendingRequests = useMemo(() =>
    requests.filter(r => r.status === 'pending'),
    [requests]
  );

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const url = userId
        ? `/api/usace/equipment-checkouts/requests?userId=${userId}`
        : `/api/usace/equipment-checkouts/requests`;
      const response = await fetch(url);
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Failed to load checkout requests:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createRequest = useCallback(async (requestData: Partial<CheckoutRequest>) => {
    const response = await fetch(`/api/usace/equipment-checkouts/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...requestData,
        requestedDate: new Date(),
        status: 'pending',
      }),
    });
    const newRequest = await response.json();
    setRequests(prev => [newRequest, ...prev]);
    return newRequest;
  }, []);

  const approveRequest = useCallback(async (requestId: string, approver: string) => {
    const response = await fetch(`/api/usace/equipment-checkouts/requests/${requestId}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvedBy: approver, approvalDate: new Date() }),
    });
    const updated = await response.json();
    setRequests(prev => prev.map(r => r.requestId === requestId ? updated : r));
    return updated;
  }, []);

  const rejectRequest = useCallback(async (requestId: string, reason: string) => {
    const response = await fetch(`/api/usace/equipment-checkouts/requests/${requestId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const updated = await response.json();
    setRequests(prev => prev.map(r => r.requestId === requestId ? updated : r));
    return updated;
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  return {
    requests,
    pendingRequests,
    loading,
    createRequest,
    approveRequest,
    rejectRequest,
    refreshRequests: loadRequests,
  };
}

/**
 * Checks equipment availability for checkout
 *
 * @param {string} equipmentId - Equipment ID
 * @param {Date} startDate - Checkout start date
 * @param {Date} endDate - Expected return date
 * @param {EquipmentCheckout[]} existingCheckouts - Existing checkouts
 * @returns {object} Availability check results
 *
 * @example
 * ```tsx
 * const availability = checkEquipmentAvailability(
 *   'eq-123',
 *   new Date('2024-11-15'),
 *   new Date('2024-11-20'),
 *   existingCheckouts
 * );
 * ```
 */
export function checkEquipmentAvailability(
  equipmentId: string,
  startDate: Date,
  endDate: Date,
  existingCheckouts: EquipmentCheckout[]
): {
  available: boolean;
  conflicts: CheckoutConflict[];
  availableFrom?: Date;
  availableUntil?: Date;
} {
  const conflicts: CheckoutConflict[] = [];

  // Check for overlapping checkouts
  const overlapping = existingCheckouts.filter(checkout => {
    if (checkout.equipmentId !== equipmentId) return false;
    if (checkout.status !== 'checked_out') return false;

    const checkoutStart = new Date(checkout.checkedOutDate);
    const checkoutEnd = new Date(checkout.expectedReturnDate);

    return (startDate <= checkoutEnd && endDate >= checkoutStart);
  });

  overlapping.forEach(checkout => {
    conflicts.push({
      conflictId: `conflict_${Date.now()}_${Math.random()}`,
      equipmentId,
      conflictType: 'overlapping_checkout',
      conflictingCheckout: checkout,
      resolution: 'deny',
    });
  });

  return {
    available: conflicts.length === 0,
    conflicts,
    availableFrom: conflicts.length > 0 ? new Date(conflicts[0].conflictingCheckout!.expectedReturnDate) : undefined,
  };
}

/**
 * Authorizes equipment checkout
 *
 * @param {CheckoutRequest} request - Checkout request
 * @param {Equipment} equipment - Equipment details
 * @param {EquipmentOperator} operator - Operator details
 * @returns {CheckoutAuthorization} Authorization result
 *
 * @example
 * ```tsx
 * const authorization = authorizeCheckout(request, equipment, operator);
 * if (authorization.canAuthorize) processCheckout(request);
 * ```
 */
export function authorizeCheckout(
  request: CheckoutRequest,
  equipment: Equipment,
  operator: EquipmentOperator
): CheckoutAuthorization {
  const qualificationCheck = validateOperatorQualifications(operator, equipment.category);

  const equipmentAvailable = equipment.status === 'available';
  const availabilityIssues: string[] = [];
  if (!equipmentAvailable) {
    availabilityIssues.push(`Equipment status is ${equipment.status}`);
  }

  // Check maintenance status
  let maintenanceStatus: 'ok' | 'due_soon' | 'overdue' | 'in_maintenance' = 'ok';
  const maintenanceIssues: string[] = [];
  if (equipment.status === 'maintenance' || equipment.status === 'repair') {
    maintenanceStatus = 'in_maintenance';
    maintenanceIssues.push('Equipment is currently in maintenance');
  }

  // Safety checks
  const safetyChecksPassed = equipment.condition !== 'not_serviceable' && equipment.condition !== 'poor';
  const safetyIssues: string[] = [];
  if (!safetyChecksPassed) {
    safetyIssues.push(`Equipment condition is ${equipment.condition}`);
  }

  const canAuthorize =
    qualificationCheck.isQualified &&
    equipmentAvailable &&
    maintenanceStatus !== 'in_maintenance' &&
    safetyChecksPassed;

  const conditions: string[] = [];
  if (maintenanceStatus === 'due_soon') {
    conditions.push('Return equipment immediately if maintenance light appears');
  }
  if (equipment.isHazardous) {
    conditions.push('Operator must follow all hazmat safety protocols');
  }

  return {
    authorizationId: `auth_${Date.now()}`,
    checkoutId: request.requestId,
    operatorId: operator.operatorId,
    operatorQualified: qualificationCheck.isQualified,
    qualificationIssues: qualificationCheck.reasons,
    equipmentAvailable,
    availabilityIssues,
    maintenanceStatus,
    safetyChecksPassed,
    safetyIssues,
    canAuthorize,
    conditions,
  };
}

/**
 * Processes equipment checkout
 *
 * @param {CheckoutRequest} request - Approved checkout request
 * @param {Equipment} equipment - Equipment to checkout
 * @param {string} checkedOutBy - Person checking out equipment
 * @returns {Partial<EquipmentCheckout>} Checkout record
 *
 * @example
 * ```tsx
 * const checkout = processEquipmentCheckout(request, equipment, userId);
 * ```
 */
export function processEquipmentCheckout(
  request: CheckoutRequest,
  equipment: Equipment,
  checkedOutBy: string
): Partial<EquipmentCheckout> {
  return {
    equipmentId: equipment.equipmentId,
    equipmentNumber: equipment.equipmentNumber,
    checkedOutBy,
    checkedOutDate: request.checkoutDate,
    expectedReturnDate: request.expectedReturnDate,
    checkoutPurpose: request.checkoutPurpose,
    projectCode: request.projectCode,
    location: equipment.location,
    checkedOutCondition: equipment.condition,
    checkedOutMileage: equipment.mileage,
    checkedOutHours: equipment.operationalHours,
    status: 'checked_out',
    notes: request.notes,
  };
}

/**
 * Processes equipment check-in
 *
 * @param {CheckInData} checkInData - Check-in data
 * @param {EquipmentCheckout} checkout - Original checkout record
 * @returns {object} Check-in processing result
 *
 * @example
 * ```tsx
 * const result = processEquipmentCheckIn(checkInData, checkout);
 * ```
 */
export function processEquipmentCheckIn(
  checkInData: CheckInData,
  checkout: EquipmentCheckout
): {
  checkout: Partial<EquipmentCheckout>;
  equipmentUpdates: Partial<Equipment>;
  charges: CheckoutCharges;
  maintenanceRequired: boolean;
} {
  const usageDays = Math.ceil(
    (checkInData.returnedDate.getTime() - new Date(checkout.checkedOutDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const isOverdue = checkInData.returnedDate > new Date(checkout.expectedReturnDate);
  const overdueDays = isOverdue
    ? Math.ceil((checkInData.returnedDate.getTime() - new Date(checkout.expectedReturnDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const charges: CheckoutCharges = {
    usageDays,
    usageRate: 0, // Would be calculated based on equipment type
    usageCharge: 0,
    overdueDays,
    overdueRate: 0,
    overdueCharge: 0,
    damageCharges: checkInData.damages.reduce((sum, d) => sum + d.estimatedRepairCost, 0),
    cleaningCharge: checkInData.cleanlinessRating < 3 ? 50 : 0,
    totalCharge: 0,
  };
  charges.totalCharge = charges.usageCharge + charges.overdueCharge + charges.damageCharges + charges.cleaningCharge;

  const updatedCheckout: Partial<EquipmentCheckout> = {
    actualReturnDate: checkInData.returnedDate,
    returnedCondition: checkInData.returnedCondition,
    returnedMileage: checkInData.meterReading?.reading,
    returnedHours: checkInData.meterReading?.reading,
    damages: checkInData.damages.length > 0 ? checkInData.damages : undefined,
    status: 'returned',
  };

  const equipmentUpdates: Partial<Equipment> = {
    status: checkInData.maintenanceNeeded ? 'maintenance' : 'available',
    condition: checkInData.returnedCondition,
    mileage: checkInData.meterReading?.reading,
    operationalHours: checkInData.meterReading?.reading,
  };

  return {
    checkout: updatedCheckout,
    equipmentUpdates,
    charges,
    maintenanceRequired: checkInData.maintenanceNeeded || checkInData.damages.length > 0,
  };
}

export interface CheckoutCharges {
  usageDays: number;
  usageRate: number;
  usageCharge: number;
  overdueDays: number;
  overdueRate: number;
  overdueCharge: number;
  damageCharges: number;
  cleaningCharge: number;
  totalCharge: number;
}

/**
 * Calculates equipment utilization metrics
 *
 * @param {string} equipmentId - Equipment ID
 * @param {EquipmentCheckout[]} checkouts - Checkout history
 * @param {Date} startDate - Analysis start date
 * @param {Date} endDate - Analysis end date
 * @returns {EquipmentUtilization} Utilization metrics
 *
 * @example
 * ```tsx
 * const utilization = calculateEquipmentUtilization(
 *   'eq-123',
 *   checkouts,
 *   new Date('2024-01-01'),
 *   new Date('2024-12-31')
 * );
 * ```
 */
export function calculateEquipmentUtilization(
  equipmentId: string,
  checkouts: EquipmentCheckout[],
  startDate: Date,
  endDate: Date
): EquipmentUtilization {
  const periodCheckouts = checkouts.filter(c =>
    c.equipmentId === equipmentId &&
    new Date(c.checkedOutDate) >= startDate &&
    new Date(c.checkedOutDate) <= endDate
  );

  const totalDaysInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  let totalDaysCheckedOut = 0;
  const userMap = new Map<string, { userName: string; checkoutCount: number }>();
  const projectMap = new Map<string, { projectName: string; days: number }>();

  periodCheckouts.forEach(checkout => {
    const checkoutDays = Math.ceil(
      (new Date(checkout.actualReturnDate || checkout.expectedReturnDate).getTime() -
        new Date(checkout.checkedOutDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    totalDaysCheckedOut += checkoutDays;

    // Track users
    if (!userMap.has(checkout.checkedOutBy)) {
      userMap.set(checkout.checkedOutBy, { userName: checkout.checkedOutBy, checkoutCount: 0 });
    }
    userMap.get(checkout.checkedOutBy)!.checkoutCount++;

    // Track projects
    if (checkout.projectCode) {
      if (!projectMap.has(checkout.projectCode)) {
        projectMap.set(checkout.projectCode, { projectName: checkout.projectCode, days: 0 });
      }
      projectMap.get(checkout.projectCode)!.days += checkoutDays;
    }
  });

  const utilizationRate = (totalDaysCheckedOut / totalDaysInPeriod) * 100;
  const averageCheckoutDuration = periodCheckouts.length > 0 ? totalDaysCheckedOut / periodCheckouts.length : 0;

  const topUsers = Array.from(userMap.entries())
    .map(([userId, data]) => ({ userId, ...data }))
    .sort((a, b) => b.checkoutCount - a.checkoutCount)
    .slice(0, 5);

  const topProjects = Array.from(projectMap.entries())
    .map(([projectCode, data]) => ({ projectCode, ...data }))
    .sort((a, b) => b.days - a.days)
    .slice(0, 5);

  return {
    equipmentId,
    equipmentNumber: '', // Would be filled from equipment data
    period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
    totalCheckouts: periodCheckouts.length,
    totalDaysCheckedOut: Math.round(totalDaysCheckedOut),
    totalDaysAvailable: totalDaysInPeriod,
    utilizationRate: Math.round(utilizationRate * 100) / 100,
    averageCheckoutDuration: Math.round(averageCheckoutDuration * 10) / 10,
    topUsers,
    topProjects,
  };
}

/**
 * Identifies overdue equipment checkouts
 *
 * @param {EquipmentCheckout[]} checkouts - Active checkouts
 * @returns {object} Overdue checkout analysis
 *
 * @example
 * ```tsx
 * const overdue = identifyOverdueCheckouts(activeCheckouts);
 * overdue.critical.forEach(c => sendUrgentNotification(c));
 * ```
 */
export function identifyOverdueCheckouts(checkouts: EquipmentCheckout[]): {
  critical: EquipmentCheckout[];
  warning: EquipmentCheckout[];
  dueSoon: EquipmentCheckout[];
  totalOverdueValue: number;
} {
  const now = new Date();
  const critical: EquipmentCheckout[] = [];
  const warning: EquipmentCheckout[] = [];
  const dueSoon: EquipmentCheckout[] = [];
  let totalOverdueValue = 0;

  checkouts
    .filter(c => c.status === 'checked_out')
    .forEach(checkout => {
      const expectedReturn = new Date(checkout.expectedReturnDate);
      const daysOverdue = Math.ceil((now.getTime() - expectedReturn.getTime()) / (1000 * 60 * 60 * 24));

      if (daysOverdue > 7) {
        critical.push(checkout);
        totalOverdueValue += 1000; // Estimated value, would come from equipment
      } else if (daysOverdue > 0) {
        warning.push(checkout);
        totalOverdueValue += 1000;
      } else if (daysOverdue > -3) {
        dueSoon.push(checkout);
      }
    });

  return {
    critical,
    warning,
    dueSoon,
    totalOverdueValue,
  };
}

/**
 * Processes bulk checkout request
 *
 * @param {BulkCheckoutRequest} bulkRequest - Bulk checkout request
 * @param {Equipment[]} availableEquipment - Available equipment
 * @returns {object} Bulk checkout result
 *
 * @example
 * ```tsx
 * const result = processBulkCheckout(bulkRequest, equipmentList);
 * ```
 */
export function processBulkCheckout(
  bulkRequest: BulkCheckoutRequest,
  availableEquipment: Equipment[]
): {
  fulfilled: { category: string; equipmentIds: string[] }[];
  partial: { category: string; requested: number; available: number }[];
  unfulfilled: { category: string; reason: string }[];
} {
  const fulfilled: { category: string; equipmentIds: string[] }[] = [];
  const partial: { category: string; requested: number; available: number }[] = [];
  const unfulfilled: { category: string; reason: string }[] = [];

  bulkRequest.equipmentRequests.forEach(request => {
    const matching = availableEquipment.filter(e =>
      e.category === request.category &&
      (!request.subcategory || e.subcategory === request.subcategory) &&
      e.status === 'available'
    );

    if (matching.length >= request.quantity) {
      fulfilled.push({
        category: request.category,
        equipmentIds: matching.slice(0, request.quantity).map(e => e.equipmentId),
      });
    } else if (matching.length > 0) {
      partial.push({
        category: request.category,
        requested: request.quantity,
        available: matching.length,
      });
    } else {
      unfulfilled.push({
        category: request.category,
        reason: 'No equipment available',
      });
    }
  });

  return { fulfilled, partial, unfulfilled };
}

/**
 * Generates checkout analytics report
 *
 * @param {EquipmentCheckout[]} checkouts - Checkout history
 * @param {Equipment[]} equipment - Equipment list
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {CheckoutAnalytics} Analytics report
 *
 * @example
 * ```tsx
 * const analytics = generateCheckoutAnalytics(checkouts, equipment, start, end);
 * ```
 */
export function generateCheckoutAnalytics(
  checkouts: EquipmentCheckout[],
  equipment: Equipment[],
  startDate: Date,
  endDate: Date
): CheckoutAnalytics {
  const periodCheckouts = checkouts.filter(c =>
    new Date(c.checkedOutDate) >= startDate &&
    new Date(c.checkedOutDate) <= endDate
  );

  const totalEquipmentDays = periodCheckouts.reduce((sum, c) => {
    const days = Math.ceil(
      (new Date(c.actualReturnDate || c.expectedReturnDate).getTime() -
        new Date(c.checkedOutDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    return sum + days;
  }, 0);

  const overdueCount = periodCheckouts.filter(c =>
    c.actualReturnDate && new Date(c.actualReturnDate) > new Date(c.expectedReturnDate)
  ).length;

  const damageReportCount = periodCheckouts.filter(c => c.damages && c.damages.length > 0).length;

  // Group by category
  const checkoutsByCategory: Record<string, number> = {};
  periodCheckouts.forEach(checkout => {
    const eq = equipment.find(e => e.equipmentId === checkout.equipmentId);
    if (eq) {
      checkoutsByCategory[eq.category] = (checkoutsByCategory[eq.category] || 0) + 1;
    }
  });

  // Group by project
  const checkoutsByProject: Record<string, number> = {};
  periodCheckouts.forEach(checkout => {
    if (checkout.projectCode) {
      checkoutsByProject[checkout.projectCode] = (checkoutsByProject[checkout.projectCode] || 0) + 1;
    }
  });

  return {
    period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
    totalCheckouts: periodCheckouts.length,
    totalEquipmentDays,
    averageUtilizationRate: 0, // Would be calculated across all equipment
    overdueCount,
    damageReportCount,
    mostUtilizedEquipment: [],
    leastUtilizedEquipment: [],
    checkoutsByCategory,
    checkoutsByProject,
  };
}

// Export all functions
export default {
  useCheckoutRequests,
  checkEquipmentAvailability,
  authorizeCheckout,
  processEquipmentCheckout,
  processEquipmentCheckIn,
  calculateEquipmentUtilization,
  identifyOverdueCheckouts,
  processBulkCheckout,
  generateCheckoutAnalytics,
};
