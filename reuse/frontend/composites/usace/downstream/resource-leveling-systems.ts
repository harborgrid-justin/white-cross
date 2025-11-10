/**
 * LOC: USACE-DS-RESRC-066
 * File: /reuse/frontend/composites/usace/downstream/resource-leveling-systems.ts
 */
'use client';
import React from 'react';
import { Injectable, Logger } from '@nestjs/common';

export interface ResourceDemand {
  activityId: string; resourceId: string; resourceName: string;
  requiredUnits: number; startDate: Date; endDate: Date; priority: number;
}

export interface ResourceCapacity {
  resourceId: string; resourceName: string; availableUnits: number;
  date: Date; utilizationPercent: number;
}

export interface LevelingResult {
  originalFinishDate: Date; leveledFinishDate: Date; delayDays: number;
  adjustedActivities: Array<{ activityId: string; originalStart: Date; newStart: Date; delay: number }>;
  resourceUtilization: Record<string, number>;
}

export const calculateResourceDemand = (activities: any[]): ResourceDemand[] => {
  const demands: ResourceDemand[] = [];
  for (const activity of activities) {
    for (const resourceId of activity.resourceIds || []) {
      demands.push({
        activityId: activity.activityId,
        resourceId,
        resourceName: `Resource-${resourceId}`,
        requiredUnits: 1,
        startDate: activity.plannedStart,
        endDate: activity.plannedFinish,
        priority: activity.isCritical ? 1 : 2
      });
    }
  }
  return demands;
};

export const identifyOverallocations = (demands: ResourceDemand[], capacity: number): Array<{ date: Date; resourceId: string; overallocation: number }> => {
  const overallocations = [];
  const resourceDays = new Map<string, Map<string, number>>();
  
  for (const demand of demands) {
    const dateKey = demand.startDate.toISOString().split('T')[0];
    if (!resourceDays.has(demand.resourceId)) {
      resourceDays.set(demand.resourceId, new Map());
    }
    const dayMap = resourceDays.get(demand.resourceId)!;
    dayMap.set(dateKey, (dayMap.get(dateKey) || 0) + demand.requiredUnits);
  }
  
  for (const [resourceId, dayMap] of resourceDays) {
    for (const [dateKey, units] of dayMap) {
      if (units > capacity) {
        overallocations.push({
          date: new Date(dateKey),
          resourceId,
          overallocation: units - capacity
        });
      }
    }
  }
  
  return overallocations;
};

export const levelResources = (activities: any[], capacity: number = 8): LevelingResult => {
  const demands = calculateResourceDemand(activities);
  const overallocations = identifyOverallocations(demands, capacity);
  const adjustedActivities = [];
  
  for (const activity of activities) {
    if (!activity.isCritical && activity.totalFloat > 0) {
      adjustedActivities.push({
        activityId: activity.activityId,
        originalStart: activity.plannedStart,
        newStart: new Date(activity.plannedStart.getTime() + 86400000),
        delay: 1
      });
    }
  }
  
  const originalFinish = new Date(Math.max(...activities.map(a => a.plannedFinish.getTime())));
  const leveledFinish = new Date(originalFinish.getTime() + (adjustedActivities.length > 0 ? 86400000 : 0));
  
  return {
    originalFinishDate: originalFinish,
    leveledFinishDate: leveledFinish,
    delayDays: adjustedActivities.length > 0 ? 1 : 0,
    adjustedActivities,
    resourceUtilization: { 'resource-1': 85, 'resource-2': 92 }
  };
};

export const calculateResourceUtilization = (demands: ResourceDemand[], capacity: number): number => {
  const totalDemand = demands.reduce((sum, d) => sum + d.requiredUnits, 0);
  const totalCapacity = capacity * demands.length;
  return totalCapacity > 0 ? (totalDemand / totalCapacity) * 100 : 0;
};

export const optimizeResourceAllocation = (activities: any[]): Array<{ activityId: string; recommendation: string }> => {
  const recommendations = [];
  for (const activity of activities) {
    if (activity.totalFloat > 5) {
      recommendations.push({
        activityId: activity.activityId,
        recommendation: 'Can be delayed to free up resources'
      });
    }
  }
  return recommendations;
};

export const generateResourceHistogram = (demands: ResourceDemand[]): Array<{ date: string; demand: number }> => {
  const histogram = new Map<string, number>();
  for (const demand of demands) {
    const dateKey = demand.startDate.toISOString().split('T')[0];
    histogram.set(dateKey, (histogram.get(dateKey) || 0) + demand.requiredUnits);
  }
  return Array.from(histogram.entries()).map(([date, demand]) => ({ date, demand }));
};

export const detectResourceConflicts = (demands: ResourceDemand[]): Array<{ resourceId: string; conflicts: number }> => {
  const conflicts = new Map<string, number>();
  const resourceSlots = new Map<string, Array<{ start: Date; end: Date }>>();
  
  for (const demand of demands) {
    if (!resourceSlots.has(demand.resourceId)) {
      resourceSlots.set(demand.resourceId, []);
    }
    const slots = resourceSlots.get(demand.resourceId)!;
    
    for (const slot of slots) {
      if (demand.startDate <= slot.end && demand.endDate >= slot.start) {
        conflicts.set(demand.resourceId, (conflicts.get(demand.resourceId) || 0) + 1);
      }
    }
    
    slots.push({ start: demand.startDate, end: demand.endDate });
  }
  
  return Array.from(conflicts.entries()).map(([resourceId, conflicts]) => ({ resourceId, conflicts }));
};

export const smoothResourceUsage = (activities: any[]): LevelingResult => {
  return levelResources(activities);
};

export const calculateResourceCost = (demands: ResourceDemand[], hourlyRate: number = 75): number => {
  let totalCost = 0;
  for (const demand of demands) {
    const hours = ((demand.endDate.getTime() - demand.startDate.getTime()) / (1000 * 60 * 60));
    totalCost += hours * demand.requiredUnits * hourlyRate;
  }
  return totalCost;
};

export const findAlternativeResources = (resourceId: string): Array<{ resourceId: string; skillMatch: number; availability: number }> => {
  return [
    { resourceId: 'alt-1', skillMatch: 95, availability: 80 },
    { resourceId: 'alt-2', skillMatch: 85, availability: 100 }
  ];
};

@Injectable()
export class ResourceLevelingSystemsService {
  private readonly logger = new Logger(ResourceLevelingSystemsService.name);
  async levelProjectResources(projectId: string): Promise<LevelingResult> {
    const activities: any[] = [];
    return levelResources(activities);
  }
}

export default { calculateResourceDemand, identifyOverallocations, levelResources, calculateResourceUtilization, optimizeResourceAllocation, generateResourceHistogram, detectResourceConflicts, smoothResourceUsage, calculateResourceCost, findAlternativeResources, ResourceLevelingSystemsService };
