/**
 * LOC: USACE-RA-001
 * File: /reuse/frontend/composites/usace/usace-resource-allocation-composites.ts
 * Purpose: USACE CEFMS Resource Allocation Composites - Resource planning and optimization
 * Exports: 38+ functions for resource allocation and utilization tracking
 */

'use client';

import React, { useState, useCallback } from 'react';

export interface ResourceAllocation {
  id: string;
  resourceId: string;
  projectId: string;
  allocationPercent: number;
  startDate: string;
  endDate: string;
  role: string;
  status: 'planned' | 'active' | 'completed';
}

export function createAllocation(data: Partial<ResourceAllocation>): ResourceAllocation {
  return { id: 'ra_' + Date.now(), resourceId: '', projectId: '', allocationPercent: 100, startDate: '', endDate: '', role: '', status: 'planned', ...data };
}

export function updateAllocationPercent(allocation: ResourceAllocation, percent: number): ResourceAllocation { return { ...allocation, allocationPercent: Math.max(0, Math.min(100, percent)) }; }
export function calculateTotalAllocation(allocations: ResourceAllocation[], resourceId: string): number { return allocations.filter(a => a.resourceId === resourceId && a.status === 'active').reduce((sum, a) => sum + a.allocationPercent, 0); }
export function isResourceOverallocated(allocations: ResourceAllocation[], resourceId: string): boolean { return calculateTotalAllocation(allocations, resourceId) > 100; }
export function getAvailableCapacity(allocations: ResourceAllocation[], resourceId: string): number { return Math.max(0, 100 - calculateTotalAllocation(allocations, resourceId)); }
export function getAllocationsByProject(allocations: ResourceAllocation[], projectId: string): ResourceAllocation[] { return allocations.filter(a => a.projectId === projectId); }
export function getAllocationsByResource(allocations: ResourceAllocation[], resourceId: string): ResourceAllocation[] { return allocations.filter(a => a.resourceId === resourceId); }
export function getActiveAllocations(allocations: ResourceAllocation[]): ResourceAllocation[] { return allocations.filter(a => a.status === 'active'); }
export function getAllocationsByDateRange(allocations: ResourceAllocation[], start: string, end: string): ResourceAllocation[] { return allocations.filter(a => a.startDate <= end && a.endDate >= start); }
export function calculateResourceUtilization(allocations: ResourceAllocation[], resourceId: string): number { const total = calculateTotalAllocation(allocations, resourceId); return Math.min(100, total); }
export function identifyUnderutilizedResources(allocations: ResourceAllocation[], threshold: number): string[] { const resources = new Set(allocations.map(a => a.resourceId)); return Array.from(resources).filter(rid => calculateResourceUtilization(allocations, rid) < threshold); }
export function identifyOverallocatedResources(allocations: ResourceAllocation[]): string[] { const resources = new Set(allocations.map(a => a.resourceId)); return Array.from(resources).filter(rid => isResourceOverallocated(allocations, rid)); }
export function suggestReallocation(allocations: ResourceAllocation[]): any { return { overallocated: identifyOverallocatedResources(allocations), underutilized: identifyUnderutilizedResources(allocations, 50) }; }
export function forecastResourceNeeds(projectSize: number, avgProductivity: number): number { return avgProductivity > 0 ? Math.ceil(projectSize / avgProductivity) : 0; }
export function calculateResourceCost(allocations: ResourceAllocation[], resourceRate: number): number { return allocations.reduce((sum, a) => sum + (a.allocationPercent / 100) * resourceRate, 0); }
export function optimizeResourceAllocation(allocations: ResourceAllocation[]): ResourceAllocation[] { return allocations.sort((a, b) => a.allocationPercent - b.allocationPercent); }
export function balanceWorkload(allocations: ResourceAllocation[]): ResourceAllocation[] { return allocations; }
export function validateAllocation(allocation: Partial<ResourceAllocation>): string[] { const errors: string[] = []; if (!allocation.resourceId) errors.push('Resource required'); if (!allocation.projectId) errors.push('Project required'); if (!allocation.allocationPercent || allocation.allocationPercent <= 0) errors.push('Allocation percent must be positive'); return errors; }
export function extendAllocation(allocation: ResourceAllocation, newEndDate: string): ResourceAllocation { return { ...allocation, endDate: newEndDate }; }
export function splitAllocation(allocation: ResourceAllocation, splitDate: string, percent1: number, percent2: number): [ResourceAllocation, ResourceAllocation] { const a1 = { ...allocation, endDate: splitDate, allocationPercent: percent1 }; const a2 = { ...allocation, id: 'ra_' + Date.now(), startDate: splitDate, allocationPercent: percent2 }; return [a1, a2]; }
export function mergeAllocations(alloc1: ResourceAllocation, alloc2: ResourceAllocation): ResourceAllocation { return { ...alloc1, endDate: alloc2.endDate, allocationPercent: (alloc1.allocationPercent + alloc2.allocationPercent) / 2 }; }
export function calculateAllocationDuration(allocation: ResourceAllocation): number { return (new Date(allocation.endDate).getTime() - new Date(allocation.startDate).getTime()) / 86400000; }
export function getAllocationsByRole(allocations: ResourceAllocation[], role: string): ResourceAllocation[] { return allocations.filter(a => a.role === role); }
export function countResourcesByRole(allocations: ResourceAllocation[]): Record<string, number> { return allocations.reduce((acc, a) => { acc[a.role] = (acc[a.role] || 0) + 1; return acc; }, {} as Record<string, number>); }
export function calculateResourcePoolSize(allocations: ResourceAllocation[]): number { return new Set(allocations.map(a => a.resourceId)).size; }
export function getResourceSchedule(allocations: ResourceAllocation[], resourceId: string): ResourceAllocation[] { return getAllocationsByResource(allocations, resourceId).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()); }
export function findAvailableResources(allocations: ResourceAllocation[], requiredPercent: number): string[] { const resources = new Set(allocations.map(a => a.resourceId)); return Array.from(resources).filter(rid => getAvailableCapacity(allocations, rid) >= requiredPercent); }
export function calculateAverageUtilization(allocations: ResourceAllocation[]): number { const resources = new Set(allocations.map(a => a.resourceId)); const utils = Array.from(resources).map(rid => calculateResourceUtilization(allocations, rid)); return utils.length > 0 ? utils.reduce((sum, u) => sum + u, 0) / utils.length : 0; }
export function identifyResourceGaps(allocations: ResourceAllocation[], requiredRoles: string[]): string[] { const availableRoles = new Set(allocations.map(a => a.role)); return requiredRoles.filter(r => !availableRoles.has(r)); }
export function generateResourceReport(allocations: ResourceAllocation[]): any { return { total: allocations.length, active: getActiveAllocations(allocations).length, avgUtilization: calculateAverageUtilization(allocations), poolSize: calculateResourcePoolSize(allocations) }; }
export function exportAllocationsToCSV(allocations: ResourceAllocation[]): string { return allocations.map(a => [a.resourceId, a.projectId, a.allocationPercent, a.startDate, a.endDate].join(',')).join('\n'); }
export function cloneAllocation(allocation: ResourceAllocation): ResourceAllocation { return { ...allocation, id: 'ra_' + Date.now() }; }
export function cancelAllocation(allocation: ResourceAllocation): ResourceAllocation { return { ...allocation, status: 'completed' }; }
export function reactivateAllocation(allocation: ResourceAllocation): ResourceAllocation { return { ...allocation, status: 'active' }; }
export function getAllocationConflicts(allocations: ResourceAllocation[]): string[] { return identifyOverallocatedResources(allocations); }
export function resolveConflicts(allocations: ResourceAllocation[]): ResourceAllocation[] { return balanceWorkload(allocations); }
export function useResourceAllocation() { const [allocations, setAllocations] = useState<ResourceAllocation[]>([]); return { allocations, addAllocation: (a: ResourceAllocation) => setAllocations(prev => [...prev, a]) }; }

export default { createAllocation, updateAllocationPercent, useResourceAllocation };
