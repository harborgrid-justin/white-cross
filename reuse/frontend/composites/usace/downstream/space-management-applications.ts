/**
 * LOC: USACE-DOWNSTREAM-SPACE-MGT-004
 * File: /reuse/frontend/composites/usace/downstream/space-management-applications.ts
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  SpaceAllocation,
  SpaceStatus,
} from '../usace-facilities-operations-composites';

export interface SpaceRequest {
  requestId: string;
  requestedBy: string;
  requestDate: Date;
  department: string;
  requiredSquareFeet: number;
  preferredFloor?: number;
  amenitiesRequired: string[];
  occupancyType: 'permanent' | 'temporary' | 'shared';
  startDate: Date;
  endDate?: Date;
  status: 'pending' | 'approved' | 'allocated' | 'rejected';
  allocatedSpaceId?: string;
}

export function useSpaceAllocation(facilityId: string) {
  const [spaces, setSpaces] = useState<SpaceAllocation[]>([]);
  const [requests, setRequests] = useState<SpaceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const availableSpaces = useMemo(() =>
    spaces.filter(s => s.status === 'available'),
    [spaces]
  );

  const loadSpaces = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/facilities/${facilityId}/spaces`);
      const data = await response.json();
      setSpaces(data);
    } finally {
      setLoading(false);
    }
  }, [facilityId]);

  const allocateSpace = useCallback(async (
    spaceId: string,
    assignmentData: Partial<SpaceAllocation>
  ) => {
    const response = await fetch(`/api/facilities/${facilityId}/spaces/${spaceId}/allocate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignmentData),
    });
    const updated = await response.json();
    setSpaces(prev => prev.map(s => s.spaceId === spaceId ? updated : s));
    return updated;
  }, [facilityId]);

  const releaseSpace = useCallback(async (spaceId: string) => {
    const response = await fetch(`/api/facilities/${facilityId}/spaces/${spaceId}/release`, {
      method: 'POST',
    });
    const updated = await response.json();
    setSpaces(prev => prev.map(s => s.spaceId === spaceId ? updated : s));
    return updated;
  }, [facilityId]);

  return {
    spaces,
    availableSpaces,
    loading,
    loadSpaces,
    allocateSpace,
    releaseSpace,
  };
}

export function matchSpaceToRequest(
  request: SpaceRequest,
  availableSpaces: SpaceAllocation[]
): SpaceAllocation[] {
  return availableSpaces
    .filter(space => {
      if (space.squareFeet < request.requiredSquareFeet) return false;
      if (request.preferredFloor && space.floor !== request.preferredFloor) return false;
      const hasRequiredAmenities = request.amenitiesRequired.every(a =>
        space.amenities.includes(a)
      );
      return hasRequiredAmenities;
    })
    .sort((a, b) => a.squareFeet - b.squareFeet);
}

export function calculateSpaceUtilization(spaces: SpaceAllocation[]): {
  totalSpaces: number;
  totalSquareFeet: number;
  occupiedSpaces: number;
  occupiedSquareFeet: number;
  utilizationRate: number;
  utilizationByFloor: Record<number, number>;
} {
  const totalSpaces = spaces.length;
  const totalSquareFeet = spaces.reduce((sum, s) => sum + s.squareFeet, 0);
  const occupiedSpaces = spaces.filter(s => s.status === 'occupied').length;
  const occupiedSquareFeet = spaces
    .filter(s => s.status === 'occupied')
    .reduce((sum, s) => sum + s.squareFeet, 0);
  const utilizationRate = totalSquareFeet > 0 ? (occupiedSquareFeet / totalSquareFeet) * 100 : 0;

  const utilizationByFloor: Record<number, number> = {};
  const spacesByFloor = spaces.reduce((acc, s) => {
    if (!acc[s.floor]) acc[s.floor] = [];
    acc[s.floor].push(s);
    return acc;
  }, {} as Record<number, SpaceAllocation[]>);

  Object.entries(spacesByFloor).forEach(([floor, floorSpaces]) => {
    const total = floorSpaces.reduce((sum, s) => sum + s.squareFeet, 0);
    const occupied = floorSpaces
      .filter(s => s.status === 'occupied')
      .reduce((sum, s) => sum + s.squareFeet, 0);
    utilizationByFloor[Number(floor)] = total > 0 ? (occupied / total) * 100 : 0;
  });

  return {
    totalSpaces,
    totalSquareFeet: Math.round(totalSquareFeet),
    occupiedSpaces,
    occupiedSquareFeet: Math.round(occupiedSquareFeet),
    utilizationRate: Math.round(utilizationRate * 10) / 10,
    utilizationByFloor,
  };
}

export default {
  useSpaceAllocation,
  matchSpaceToRequest,
  calculateSpaceUtilization,
};
