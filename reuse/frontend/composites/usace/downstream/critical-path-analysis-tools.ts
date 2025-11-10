/**
 * LOC: USACE-DS-CPM-064
 * File: /reuse/frontend/composites/usace/downstream/critical-path-analysis-tools.ts
 */
'use client';
import React from 'react';
import { Injectable, Logger } from '@nestjs/common';

export interface CPMActivity {
  id: string; duration: number; predecessors: string[];
  earlyStart: number; earlyFinish: number; lateStart: number; lateFinish: number;
  totalFloat: number; freeFloat: number; isCritical: boolean;
}

export interface CriticalPathResult {
  criticalPath: string[]; projectDuration: number; activities: CPMActivity[];
  criticalActivitiesCount: number; longestPathDuration: number;
}

export const calculateForwardPass = (activities: CPMActivity[]): CPMActivity[] => {
  const sorted = topologicalSort(activities);
  for (const activity of sorted) {
    const predFinishes = activity.predecessors.map(predId => {
      const pred = activities.find(a => a.id === predId);
      return pred ? pred.earlyFinish : 0;
    });
    activity.earlyStart = predFinishes.length > 0 ? Math.max(...predFinishes) : 0;
    activity.earlyFinish = activity.earlyStart + activity.duration;
  }
  return activities;
};

export const calculateBackwardPass = (activities: CPMActivity[], projectDuration: number): CPMActivity[] => {
  const sorted = topologicalSort(activities).reverse();
  for (const activity of sorted) {
    const successors = activities.filter(a => a.predecessors.includes(activity.id));
    const succStarts = successors.map(s => s.lateStart);
    activity.lateFinish = succStarts.length > 0 ? Math.min(...succStarts) : projectDuration;
    activity.lateStart = activity.lateFinish - activity.duration;
  }
  return activities;
};

export const calculateFloat = (activities: CPMActivity[]): CPMActivity[] => {
  return activities.map(activity => ({
    ...activity,
    totalFloat: activity.lateStart - activity.earlyStart,
    freeFloat: 0,
    isCritical: (activity.lateStart - activity.earlyStart) === 0
  }));
};

export const identifyCriticalPath = (activities: CPMActivity[]): string[] => {
  return activities.filter(a => a.isCritical).map(a => a.id);
};

export const calculateCriticalPath = (activities: CPMActivity[]): CriticalPathResult => {
  let processed = calculateForwardPass(activities);
  const projectDuration = Math.max(...processed.map(a => a.earlyFinish));
  processed = calculateBackwardPass(processed, projectDuration);
  processed = calculateFloat(processed);
  const criticalPath = identifyCriticalPath(processed);
  
  return {
    criticalPath,
    projectDuration,
    activities: processed,
    criticalActivitiesCount: criticalPath.length,
    longestPathDuration: projectDuration
  };
};

export const topologicalSort = (activities: CPMActivity[]): CPMActivity[] => {
  const sorted = [];
  const visited = new Set<string>();
  const visit = (activity: CPMActivity) => {
    if (visited.has(activity.id)) return;
    visited.add(activity.id);
    for (const predId of activity.predecessors) {
      const pred = activities.find(a => a.id === predId);
      if (pred) visit(pred);
    }
    sorted.push(activity);
  };
  for (const activity of activities) visit(activity);
  return sorted;
};

export const findAllPaths = (activities: CPMActivity[], start: string, end: string): string[][] => {
  const paths = [];
  const findPath = (current: string, path: string[]) => {
    if (current === end) {
      paths.push([...path, current]);
      return;
    }
    const successors = activities.filter(a => a.predecessors.includes(current));
    for (const succ of successors) {
      findPath(succ.id, [...path, current]);
    }
  };
  findPath(start, []);
  return paths;
};

export const calculateNearCriticalActivities = (activities: CPMActivity[], threshold: number = 5): CPMActivity[] => {
  return activities.filter(a => !a.isCritical && a.totalFloat <= threshold);
};

export const analyzeCriticalityIndex = (activities: CPMActivity[]): Record<string, number> => {
  const index: Record<string, number> = {};
  for (const activity of activities) {
    index[activity.id] = activity.isCritical ? 100 : (1 - activity.totalFloat / 100) * 100;
  }
  return index;
};

export const detectCriticalPathChanges = (before: CriticalPathResult, after: CriticalPathResult): { added: string[]; removed: string[] } => {
  const beforeSet = new Set(before.criticalPath);
  const afterSet = new Set(after.criticalPath);
  return {
    added: after.criticalPath.filter(id => !beforeSet.has(id)),
    removed: before.criticalPath.filter(id => !afterSet.has(id))
  };
};

export const calculateCriticalPathRisk = (activities: CPMActivity[]): { riskScore: number; riskLevel: string } => {
  const criticalCount = activities.filter(a => a.isCritical).length;
  const riskScore = (criticalCount / activities.length) * 100;
  return {
    riskScore,
    riskLevel: riskScore > 40 ? 'high' : riskScore > 20 ? 'medium' : 'low'
  };
};

@Injectable()
export class CriticalPathAnalysisToolsService {
  private readonly logger = new Logger(CriticalPathAnalysisToolsService.name);
  async analyzeCriticalPath(projectId: string): Promise<CriticalPathResult> {
    const activities: CPMActivity[] = [];
    return calculateCriticalPath(activities);
  }
}

export default { calculateForwardPass, calculateBackwardPass, calculateFloat, identifyCriticalPath, calculateCriticalPath, topologicalSort, findAllPaths, calculateNearCriticalActivities, analyzeCriticalityIndex, detectCriticalPathChanges, calculateCriticalPathRisk, CriticalPathAnalysisToolsService };
