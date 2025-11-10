/**
 * LOC: USACE-MT-001
 * File: /reuse/frontend/composites/usace/usace-milestone-tracking-composites.ts
 * Purpose: USACE CEFMS Milestone Tracking Composites - Project milestone and deliverable management
 * Exports: 40+ functions for milestone tracking and progress monitoring
 */

'use client';

import React, { useState, useCallback } from 'react';

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description: string;
  plannedDate: string;
  actualDate?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'delayed';
  percentComplete: number;
  dependencies: string[];
  deliverables: string[];
}

export function createMilestone(data: Partial<Milestone>): Milestone {
  return { id: 'ms_' + Date.now(), projectId: '', name: '', description: '', plannedDate: '', status: 'planned', percentComplete: 0, dependencies: [], deliverables: [], ...data };
}

export function updateMilestoneStatus(milestone: Milestone, status: Milestone['status']): Milestone { return { ...milestone, status }; }
export function completeMilestone(milestone: Milestone): Milestone { return { ...milestone, status: 'completed', percentComplete: 100, actualDate: new Date().toISOString() }; }
export function calculateMilestoneDelay(planned: string, actual: string): number { return (new Date(actual).getTime() - new Date(planned).getTime()) / 86400000; }
export function isMilestoneOnTrack(milestone: Milestone): boolean { return new Date(milestone.plannedDate) >= new Date() || milestone.status === 'completed'; }
export function getMilestonesByProject(milestones: Milestone[], projectId: string): Milestone[] { return milestones.filter(m => m.projectId === projectId); }
export function getCompletedMilestones(milestones: Milestone[]): Milestone[] { return milestones.filter(m => m.status === 'completed'); }
export function getPendingMilestones(milestones: Milestone[]): Milestone[] { return milestones.filter(m => m.status !== 'completed'); }
export function getDelayedMilestones(milestones: Milestone[]): Milestone[] { return milestones.filter(m => m.status === 'delayed'); }
export function calculateProjectProgress(milestones: Milestone[]): number { return milestones.length > 0 ? milestones.reduce((sum, m) => sum + m.percentComplete, 0) / milestones.length : 0; }
export function getMilestoneDependencies(milestone: Milestone, allMilestones: Milestone[]): Milestone[] { return allMilestones.filter(m => milestone.dependencies.includes(m.id)); }
export function canStartMilestone(milestone: Milestone, allMilestones: Milestone[]): boolean { const deps = getMilestoneDependencies(milestone, allMilestones); return deps.every(d => d.status === 'completed'); }
export function getNextMilestones(milestones: Milestone[]): Milestone[] { return milestones.filter(m => m.status === 'planned').sort((a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime()).slice(0, 5); }
export function getCriticalPathMilestones(milestones: Milestone[]): Milestone[] { return milestones.filter(m => m.dependencies.length === 0 || m.status === 'delayed'); }
export function estimateCompletionDate(milestones: Milestone[]): Date | null { const pending = getPendingMilestones(milestones); if (pending.length === 0) return new Date(); const latest = pending.reduce((max, m) => new Date(m.plannedDate) > max ? new Date(m.plannedDate) : max, new Date(0)); return latest; }
export function calculateMilestoneSlippage(milestones: Milestone[]): number { return milestones.filter(m => m.actualDate).reduce((sum, m) => sum + calculateMilestoneDelay(m.plannedDate, m.actualDate!), 0); }
export function groupMilestonesByStatus(milestones: Milestone[]): Record<string, Milestone[]> { return milestones.reduce((acc, m) => { acc[m.status] = acc[m.status] || []; acc[m.status].push(m); return acc; }, {} as Record<string, Milestone[]>); }
export function sortMilestonesByDate(milestones: Milestone[]): Milestone[] { return [...milestones].sort((a, b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime()); }
export function getMilestonesByDateRange(milestones: Milestone[], startDate: string, endDate: string): Milestone[] { return milestones.filter(m => m.plannedDate >= startDate && m.plannedDate <= endDate); }
export function calculateMilestoneVelocity(completedMilestones: Milestone[], days: number): number { return days > 0 ? completedMilestones.length / days : 0; }
export function forecastMilestoneCompletion(remainingMilestones: number, velocity: number): Date { const daysNeeded = velocity > 0 ? remainingMilestones / velocity : remainingMilestones * 30; return new Date(Date.now() + daysNeeded * 86400000); }
export function validateMilestone(milestone: Partial<Milestone>): string[] { const errors: string[] = []; if (!milestone.name) errors.push('Name required'); if (!milestone.plannedDate) errors.push('Planned date required'); return errors; }
export function addMilestoneDependency(milestone: Milestone, dependencyId: string): Milestone { return { ...milestone, dependencies: [...milestone.dependencies, dependencyId] }; }
export function removeMilestoneDependency(milestone: Milestone, dependencyId: string): Milestone { return { ...milestone, dependencies: milestone.dependencies.filter(d => d !== dependencyId) }; }
export function addDeliverable(milestone: Milestone, deliverable: string): Milestone { return { ...milestone, deliverables: [...milestone.deliverables, deliverable] }; }
export function removeDeliverable(milestone: Milestone, deliverable: string): Milestone { return { ...milestone, deliverables: milestone.deliverables.filter(d => d !== deliverable) }; }
export function updateProgress(milestone: Milestone, percent: number): Milestone { return { ...milestone, percentComplete: Math.max(0, Math.min(100, percent)) }; }
export function setMilestoneBaseline(milestone: Milestone): any { return { milestoneId: milestone.id, baselineDate: milestone.plannedDate, baselineStatus: milestone.status }; }
export function compareMilestoneToBaseline(milestone: Milestone, baseline: any): any { return { variance: calculateMilestoneDelay(baseline.baselineDate, milestone.plannedDate), statusChanged: baseline.baselineStatus !== milestone.status }; }
export function generateMilestoneTimeline(milestones: Milestone[]): any[] { return sortMilestonesByDate(milestones).map(m => ({ name: m.name, date: m.plannedDate, status: m.status })); }
export function exportMilestonesToCSV(milestones: Milestone[]): string { return milestones.map(m => [m.name, m.plannedDate, m.status, m.percentComplete].join(',')).join('\n'); }
export function getMilestoneStatistics(milestones: Milestone[]): any { return { total: milestones.length, completed: getCompletedMilestones(milestones).length, delayed: getDelayedMilestones(milestones).length, avgProgress: calculateProjectProgress(milestones) }; }
export function identifyBottlenecks(milestones: Milestone[]): Milestone[] { return milestones.filter(m => m.status === 'delayed' && m.dependencies.length > 0); }
export function calculateCriticalityScore(milestone: Milestone, allMilestones: Milestone[]): number { const dependents = allMilestones.filter(m => m.dependencies.includes(milestone.id)); return dependents.length; }
export function rankMilestonesByCriticality(milestones: Milestone[]): Milestone[] { return [...milestones].sort((a, b) => calculateCriticalityScore(b, milestones) - calculateCriticalityScore(a, milestones)); }
export function suggestMilestoneResequencing(milestones: Milestone[]): Milestone[] { return rankMilestonesByCriticality(milestones); }
export function alertOverdueMilestones(milestones: Milestone[]): Milestone[] { return milestones.filter(m => m.status !== 'completed' && new Date(m.plannedDate) < new Date()); }
export function useMilestoneTracking() { const [milestones, setMilestones] = useState<Milestone[]>([]); return { milestones, addMilestone: (m: Milestone) => setMilestones(prev => [...prev, m]) }; }

export default { createMilestone, updateMilestoneStatus, useMilestoneTracking };
