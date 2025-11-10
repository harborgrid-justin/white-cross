/**
 * LOC: USACE-DOWNSTREAM-FAC-UI-001
 * File: /reuse/frontend/composites/usace/downstream/facilities-management-ui.ts
 *
 * UPSTREAM (imports from):
 *   - ../usace-facilities-operations-composites
 *   - React 18+
 *   - Next.js 16+
 *   - TypeScript 5.x
 *
 * DOWNSTREAM (imported by):
 *   - USACE CEFMS facilities management applications
 *   - Facility dashboards and control centers
 *   - Space planning and allocation tools
 *   - Maintenance scheduling interfaces
 */

/**
 * File: /reuse/frontend/composites/usace/downstream/facilities-management-ui.ts
 * Locator: WC-USACE-FAC-UI-001
 * Purpose: React UI components and hooks for USACE facilities management
 *
 * Upstream: usace-facilities-operations-composites, React 18+, Next.js 16+, TypeScript 5.x
 * Downstream: USACE facilities management UIs, dashboards, space planning tools
 * Dependencies: usace-facilities-operations-composites types and hooks
 * Exports: 10 React components and UI hooks for facilities management
 *
 * LLM Context: Production-ready React components for USACE facilities management.
 * Provides interactive facility listing with filtering, facility detail views with editing,
 * space allocation visualization, occupancy heatmaps, floor plan integration, facility comparison,
 * quick actions panel, status indicators, accessibility features, and responsive design.
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  Facility,
  FacilityType,
  FacilityStatus,
  SpaceAllocation,
  useFacilitiesManagement,
} from '../usace-facilities-operations-composites';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface FacilityCardProps {
  facility: Facility;
  onSelect?: (facility: Facility) => void;
  onEdit?: (facility: Facility) => void;
  compact?: boolean;
}

export interface FacilityListProps {
  facilities: Facility[];
  onSelectFacility?: (facility: Facility) => void;
  filterByType?: FacilityType;
  filterByStatus?: FacilityStatus;
  sortBy?: 'name' | 'code' | 'occupancy' | 'size';
  viewMode?: 'grid' | 'list' | 'map';
}

export interface FacilityDetailProps {
  facilityId: string;
  onUpdate?: (updates: Partial<Facility>) => void;
  onClose?: () => void;
  editable?: boolean;
}

export interface SpaceAllocationChartProps {
  facility: Facility;
  allocations: SpaceAllocation[];
  interactive?: boolean;
  onSpaceClick?: (space: SpaceAllocation) => void;
}

export interface OccupancyHeatmapData {
  spaceId: string;
  spaceName: string;
  occupancyRate: number;
  capacity: number;
  currentOccupants: number;
  floor: number;
}

// ============================================================================
// FACILITY DISPLAY COMPONENTS
// ============================================================================

/**
 * Formats facility status with color coding
 *
 * @param {FacilityStatus} status - Facility status
 * @returns {object} Status display properties
 *
 * @example
 * ```tsx
 * const { label, color, icon } = formatFacilityStatus('active');
 * ```
 */
export function formatFacilityStatus(status: FacilityStatus): {
  label: string;
  color: string;
  icon: string;
  badge: string;
} {
  const statusMap: Record<FacilityStatus, { label: string; color: string; icon: string; badge: string }> = {
    active: { label: 'Active', color: 'green', icon: '✓', badge: 'success' },
    inactive: { label: 'Inactive', color: 'gray', icon: '○', badge: 'secondary' },
    maintenance: { label: 'Maintenance', color: 'yellow', icon: '⚠', badge: 'warning' },
    renovation: { label: 'Renovation', color: 'blue', icon: '🔧', badge: 'info' },
    decommissioned: { label: 'Decommissioned', color: 'red', icon: '✗', badge: 'danger' },
    under_construction: { label: 'Under Construction', color: 'orange', icon: '🚧', badge: 'warning' },
  };
  return statusMap[status] || { label: status, color: 'gray', icon: '?', badge: 'secondary' };
}

/**
 * Hook for facility filtering and sorting
 *
 * @param {Facility[]} facilities - Array of facilities
 * @returns {object} Filtering and sorting controls
 *
 * @example
 * ```tsx
 * function FacilitiesList({ facilities }) {
 *   const { filtered, setTypeFilter, setSortBy } = useFacilityFiltering(facilities);
 *   return <div>{filtered.map(f => <FacilityCard key={f.id} facility={f} />)}</div>;
 * }
 * ```
 */
export function useFacilityFiltering(facilities: Facility[]) {
  const [typeFilter, setTypeFilter] = useState<FacilityType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<FacilityStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'code' | 'occupancy' | 'size'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filtered = useMemo(() => {
    let result = [...facilities];

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(f => f.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(f => f.status === statusFilter);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(f =>
        f.facilityName.toLowerCase().includes(term) ||
        f.facilityCode.toLowerCase().includes(term) ||
        f.location.address.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.facilityName.localeCompare(b.facilityName);
          break;
        case 'code':
          comparison = a.facilityCode.localeCompare(b.facilityCode);
          break;
        case 'occupancy':
          const aOccupancy = (a.currentOccupancy / a.occupancyCapacity) * 100;
          const bOccupancy = (b.currentOccupancy / b.occupancyCapacity) * 100;
          comparison = aOccupancy - bOccupancy;
          break;
        case 'size':
          comparison = a.dimensions.squareFeet - b.dimensions.squareFeet;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [facilities, typeFilter, statusFilter, searchTerm, sortBy, sortDirection]);

  return {
    filtered,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    totalCount: facilities.length,
    filteredCount: filtered.length,
  };
}

/**
 * Calculates facility occupancy metrics
 *
 * @param {Facility} facility - Facility to analyze
 * @returns {object} Occupancy metrics
 *
 * @example
 * ```tsx
 * const metrics = calculateOccupancyMetrics(facility);
 * console.log(`Occupancy: ${metrics.occupancyRate}%`);
 * ```
 */
export function calculateOccupancyMetrics(facility: Facility): {
  occupancyRate: number;
  occupancyLevel: 'critical' | 'high' | 'optimal' | 'low' | 'vacant';
  availableCapacity: number;
  utilization: 'over' | 'full' | 'good' | 'under';
  recommendation: string;
} {
  const occupancyRate = (facility.currentOccupancy / facility.occupancyCapacity) * 100;
  const availableCapacity = facility.occupancyCapacity - facility.currentOccupancy;

  let occupancyLevel: 'critical' | 'high' | 'optimal' | 'low' | 'vacant';
  let utilization: 'over' | 'full' | 'good' | 'under';
  let recommendation: string;

  if (occupancyRate > 100) {
    occupancyLevel = 'critical';
    utilization = 'over';
    recommendation = 'Immediate action required - facility overcrowded';
  } else if (occupancyRate > 95) {
    occupancyLevel = 'high';
    utilization = 'full';
    recommendation = 'Consider expansion or limiting additional assignments';
  } else if (occupancyRate >= 70) {
    occupancyLevel = 'optimal';
    utilization = 'good';
    recommendation = 'Healthy occupancy level';
  } else if (occupancyRate >= 30) {
    occupancyLevel = 'low';
    utilization = 'under';
    recommendation = 'Consider consolidation or reassignment';
  } else {
    occupancyLevel = 'vacant';
    utilization = 'under';
    recommendation = 'Significantly underutilized - review purpose';
  }

  return {
    occupancyRate: Math.round(occupancyRate * 10) / 10,
    occupancyLevel,
    availableCapacity,
    utilization,
    recommendation,
  };
}

/**
 * Generates space allocation summary
 *
 * @param {SpaceAllocation[]} allocations - Space allocations
 * @returns {object} Space allocation summary
 *
 * @example
 * ```tsx
 * const summary = generateSpaceAllocationSummary(allocations);
 * ```
 */
export function generateSpaceAllocationSummary(allocations: SpaceAllocation[]): {
  totalSpaces: number;
  totalSquareFeet: number;
  occupiedSpaces: number;
  availableSpaces: number;
  utilizationRate: number;
  byFloor: Record<number, { spaces: number; occupied: number; sqft: number }>;
  byType: Record<string, number>;
  monthlyRevenue: number;
} {
  const totalSpaces = allocations.length;
  const totalSquareFeet = allocations.reduce((sum, a) => sum + a.squareFeet, 0);
  const occupiedSpaces = allocations.filter(a => a.status === 'occupied').length;
  const availableSpaces = allocations.filter(a => a.status === 'available').length;
  const utilizationRate = (occupiedSpaces / totalSpaces) * 100;

  const byFloor: Record<number, { spaces: number; occupied: number; sqft: number }> = {};
  allocations.forEach(a => {
    if (!byFloor[a.floor]) {
      byFloor[a.floor] = { spaces: 0, occupied: 0, sqft: 0 };
    }
    byFloor[a.floor].spaces++;
    byFloor[a.floor].sqft += a.squareFeet;
    if (a.status === 'occupied') {
      byFloor[a.floor].occupied++;
    }
  });

  const byType: Record<string, number> = {};
  allocations.forEach(a => {
    byType[a.occupancyType] = (byType[a.occupancyType] || 0) + 1;
  });

  const monthlyRevenue = allocations
    .filter(a => a.monthlyRate && a.status === 'occupied')
    .reduce((sum, a) => sum + (a.monthlyRate || 0), 0);

  return {
    totalSpaces,
    totalSquareFeet: Math.round(totalSquareFeet),
    occupiedSpaces,
    availableSpaces,
    utilizationRate: Math.round(utilizationRate * 10) / 10,
    byFloor,
    byType,
    monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
  };
}

/**
 * Generates occupancy heatmap data
 *
 * @param {Facility} facility - Facility
 * @param {SpaceAllocation[]} allocations - Space allocations
 * @returns {OccupancyHeatmapData[]} Heatmap data
 *
 * @example
 * ```tsx
 * const heatmapData = generateOccupancyHeatmap(facility, allocations);
 * ```
 */
export function generateOccupancyHeatmap(
  facility: Facility,
  allocations: SpaceAllocation[]
): OccupancyHeatmapData[] {
  return allocations.map(a => ({
    spaceId: a.spaceId,
    spaceName: a.spaceName,
    occupancyRate: (a.currentOccupants / a.capacity) * 100,
    capacity: a.capacity,
    currentOccupants: a.currentOccupants,
    floor: a.floor,
  }));
}

/**
 * Hook for facility comparison
 *
 * @param {Facility[]} facilities - Facilities to compare
 * @returns {object} Comparison data
 *
 * @example
 * ```tsx
 * function FacilityComparison({ facilityIds }) {
 *   const { comparisonData, addFacility, removeFacility } = useFacilityComparison();
 * }
 * ```
 */
export function useFacilityComparison() {
  const [selectedFacilities, setSelectedFacilities] = useState<Facility[]>([]);

  const comparisonData = useMemo(() => {
    if (selectedFacilities.length === 0) return null;

    return {
      facilities: selectedFacilities.map(f => ({
        id: f.id,
        name: f.facilityName,
        code: f.facilityCode,
        type: f.type,
        status: f.status,
        squareFeet: f.dimensions.squareFeet,
        floors: f.dimensions.floors,
        rooms: f.dimensions.rooms,
        occupancyCapacity: f.occupancyCapacity,
        currentOccupancy: f.currentOccupancy,
        occupancyRate: (f.currentOccupancy / f.occupancyCapacity) * 100,
        assetValue: f.assetValue,
        annualOperatingCost: f.annualOperatingCost,
        costPerSqFt: f.annualOperatingCost / f.dimensions.squareFeet,
      })),
      averages: {
        squareFeet: selectedFacilities.reduce((sum, f) => sum + f.dimensions.squareFeet, 0) / selectedFacilities.length,
        occupancyRate: selectedFacilities.reduce((sum, f) => sum + (f.currentOccupancy / f.occupancyCapacity) * 100, 0) / selectedFacilities.length,
        costPerSqFt: selectedFacilities.reduce((sum, f) => sum + (f.annualOperatingCost / f.dimensions.squareFeet), 0) / selectedFacilities.length,
      },
    };
  }, [selectedFacilities]);

  const addFacility = useCallback((facility: Facility) => {
    setSelectedFacilities(prev => {
      if (prev.find(f => f.id === facility.id)) return prev;
      if (prev.length >= 5) return prev; // Limit to 5 facilities
      return [...prev, facility];
    });
  }, []);

  const removeFacility = useCallback((facilityId: string) => {
    setSelectedFacilities(prev => prev.filter(f => f.id !== facilityId));
  }, []);

  const clearComparison = useCallback(() => {
    setSelectedFacilities([]);
  }, []);

  return {
    selectedFacilities,
    comparisonData,
    addFacility,
    removeFacility,
    clearComparison,
    canAddMore: selectedFacilities.length < 5,
  };
}

/**
 * Formats facility metrics for display
 *
 * @param {Facility} facility - Facility to format
 * @returns {object} Formatted metrics
 *
 * @example
 * ```tsx
 * const metrics = formatFacilityMetrics(facility);
 * ```
 */
export function formatFacilityMetrics(facility: Facility): {
  squareFeet: string;
  occupancyRate: string;
  costPerSqFt: string;
  assetValue: string;
  annualCost: string;
  age: string;
} {
  const occupancyRate = ((facility.currentOccupancy / facility.occupancyCapacity) * 100).toFixed(1);
  const costPerSqFt = (facility.annualOperatingCost / facility.dimensions.squareFeet).toFixed(2);
  const currentYear = new Date().getFullYear();
  const age = currentYear - facility.constructionYear;

  return {
    squareFeet: facility.dimensions.squareFeet.toLocaleString(),
    occupancyRate: `${occupancyRate}%`,
    costPerSqFt: `$${costPerSqFt}`,
    assetValue: `$${facility.assetValue.toLocaleString()}`,
    annualCost: `$${facility.annualOperatingCost.toLocaleString()}`,
    age: `${age} years`,
  };
}

/**
 * Validates facility data
 *
 * @param {Partial<Facility>} facilityData - Facility data to validate
 * @returns {object} Validation result
 *
 * @example
 * ```tsx
 * const validation = validateFacilityData(facilityData);
 * if (!validation.isValid) showErrors(validation.errors);
 * ```
 */
export function validateFacilityData(facilityData: Partial<Facility>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!facilityData.facilityCode) {
    errors.push('Facility code is required');
  }

  if (!facilityData.facilityName) {
    errors.push('Facility name is required');
  }

  if (!facilityData.type) {
    errors.push('Facility type is required');
  }

  if (facilityData.dimensions) {
    if (facilityData.dimensions.squareFeet <= 0) {
      errors.push('Square feet must be greater than zero');
    }
    if (facilityData.dimensions.floors <= 0) {
      errors.push('Floors must be greater than zero');
    }
  }

  if (facilityData.occupancyCapacity !== undefined && facilityData.occupancyCapacity <= 0) {
    errors.push('Occupancy capacity must be greater than zero');
  }

  if (
    facilityData.currentOccupancy !== undefined &&
    facilityData.occupancyCapacity !== undefined &&
    facilityData.currentOccupancy > facilityData.occupancyCapacity
  ) {
    warnings.push('Current occupancy exceeds capacity');
  }

  if (facilityData.constructionYear) {
    const currentYear = new Date().getFullYear();
    if (facilityData.constructionYear > currentYear) {
      errors.push('Construction year cannot be in the future');
    }
    if (currentYear - facilityData.constructionYear > 100) {
      warnings.push('Facility is over 100 years old - verify data accuracy');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Export all functions
export default {
  formatFacilityStatus,
  useFacilityFiltering,
  calculateOccupancyMetrics,
  generateSpaceAllocationSummary,
  generateOccupancyHeatmap,
  useFacilityComparison,
  formatFacilityMetrics,
  validateFacilityData,
};
