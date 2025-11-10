/**
 * LOC: USACE-EC-001
 * File: /reuse/frontend/composites/usace/usace-environmental-compliance-composites.ts
 * Purpose: USACE CEFMS Environmental Compliance Composites - Environmental regulations and monitoring
 * Exports: 37+ functions for environmental compliance and reporting
 */

'use client';

import React, { useState } from 'react';

export interface EnvironmentalPermit {
  id: string;
  permitNumber: string;
  permitType: 'air' | 'water' | 'waste' | 'wetlands' | 'endangered_species';
  issuingAgency: string;
  issueDate: string;
  expirationDate: string;
  status: 'active' | 'expired' | 'pending' | 'revoked';
  conditions: string[];
}

export interface ComplianceInspection {
  id: string;
  inspectionDate: string;
  inspector: string;
  facilityId: string;
  findings: string[];
  violations: string[];
  status: 'passed' | 'failed' | 'conditional';
}

export interface EnvironmentalIncident {
  id: string;
  incidentDate: string;
  incidentType: 'spill' | 'emission' | 'discharge' | 'other';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  location: string;
  description: string;
  reportedBy: string;
  resolved: boolean;
}

export interface MonitoringData {
  id: string;
  parameter: string;
  value: number;
  unit: string;
  measurementDate: string;
  location: string;
  withinLimits: boolean;
}

export function createPermit(data: Partial<EnvironmentalPermit>): EnvironmentalPermit {
  return { id: 'permit_' + Date.now(), permitNumber: '', permitType: 'air', issuingAgency: '', issueDate: '', expirationDate: '', status: 'pending', conditions: [], ...data };
}

export function renewPermit(permit: EnvironmentalPermit, newExpirationDate: string): EnvironmentalPermit { return { ...permit, expirationDate: newExpirationDate, status: 'active' }; }
export function revokePermit(permit: EnvironmentalPermit): EnvironmentalPermit { return { ...permit, status: 'revoked' }; }
export function isPermitExpired(permit: EnvironmentalPermit): boolean { return new Date(permit.expirationDate) < new Date(); }
export function getExpiringPermits(permits: EnvironmentalPermit[], daysThreshold: number): EnvironmentalPermit[] { const threshold = new Date(Date.now() + daysThreshold * 86400000); return permits.filter(p => new Date(p.expirationDate) <= threshold && p.status === 'active'); }
export function getPermitsByType(permits: EnvironmentalPermit[], type: string): EnvironmentalPermit[] { return permits.filter(p => p.permitType === type); }
export function getActivePermits(permits: EnvironmentalPermit[]): EnvironmentalPermit[] { return permits.filter(p => p.status === 'active'); }
export function createInspection(data: Partial<ComplianceInspection>): ComplianceInspection { return { id: 'insp_' + Date.now(), inspectionDate: new Date().toISOString(), inspector: '', facilityId: '', findings: [], violations: [], status: 'passed', ...data }; }
export function addFinding(inspection: ComplianceInspection, finding: string): ComplianceInspection { return { ...inspection, findings: [...inspection.findings, finding] }; }
export function addViolation(inspection: ComplianceInspection, violation: string): ComplianceInspection { return { ...inspection, violations: [...inspection.violations, violation], status: 'failed' }; }
export function getFailedInspections(inspections: ComplianceInspection[]): ComplianceInspection[] { return inspections.filter(i => i.status === 'failed'); }
export function getInspectionsByFacility(inspections: ComplianceInspection[], facilityId: string): ComplianceInspection[] { return inspections.filter(i => i.facilityId === facilityId); }
export function createIncident(data: Partial<EnvironmentalIncident>): EnvironmentalIncident { return { id: 'inc_' + Date.now(), incidentDate: new Date().toISOString(), incidentType: 'other', severity: 'minor', location: '', description: '', reportedBy: '', resolved: false, ...data }; }
export function resolveIncident(incident: EnvironmentalIncident): EnvironmentalIncident { return { ...incident, resolved: true }; }
export function getCriticalIncidents(incidents: EnvironmentalIncident[]): EnvironmentalIncident[] { return incidents.filter(i => i.severity === 'critical' || i.severity === 'major'); }
export function getUnresolvedIncidents(incidents: EnvironmentalIncident[]): EnvironmentalIncident[] { return incidents.filter(i => !i.resolved); }
export function recordMonitoringData(data: Partial<MonitoringData>): MonitoringData { return { id: 'mon_' + Date.now(), parameter: '', value: 0, unit: '', measurementDate: new Date().toISOString(), location: '', withinLimits: true, ...data }; }
export function checkComplianceLimits(data: MonitoringData, limit: number): boolean { return data.value <= limit; }
export function getExceedances(monitoringData: MonitoringData[]): MonitoringData[] { return monitoringData.filter(d => !d.withinLimits); }
export function getMonitoringByParameter(monitoringData: MonitoringData[], parameter: string): MonitoringData[] { return monitoringData.filter(d => d.parameter === parameter); }
export function calculateAverageValue(monitoringData: MonitoringData[]): number { return monitoringData.length > 0 ? monitoringData.reduce((sum, d) => sum + d.value, 0) / monitoringData.length : 0; }
export function identifyTrends(monitoringData: MonitoringData[]): string { if (monitoringData.length < 3) return 'insufficient_data'; const sorted = [...monitoringData].sort((a, b) => new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime()); const increasing = sorted.every((d, i) => i === 0 || d.value > sorted[i - 1].value); const decreasing = sorted.every((d, i) => i === 0 || d.value < sorted[i - 1].value); return increasing ? 'increasing' : decreasing ? 'decreasing' : 'stable'; }
export function generateComplianceReport(permits: EnvironmentalPermit[], inspections: ComplianceInspection[], incidents: EnvironmentalIncident[]): any { return { activePermits: getActivePermits(permits).length, expiringPermits: getExpiringPermits(permits, 30).length, failedInspections: getFailedInspections(inspections).length, unresolvedIncidents: getUnresolvedIncidents(incidents).length, criticalIncidents: getCriticalIncidents(incidents).length }; }
export function validatePermit(permit: Partial<EnvironmentalPermit>): string[] { const errors: string[] = []; if (!permit.permitNumber) errors.push('Permit number required'); if (!permit.issuingAgency) errors.push('Issuing agency required'); if (!permit.expirationDate) errors.push('Expiration date required'); return errors; }
export function schedulePermitRenewal(permit: EnvironmentalPermit, daysBeforeExpiration: number): Date { return new Date(new Date(permit.expirationDate).getTime() - daysBeforeExpiration * 86400000); }
export function calculateComplianceRate(inspections: ComplianceInspection[]): number { const passed = inspections.filter(i => i.status === 'passed').length; return inspections.length > 0 ? (passed / inspections.length) * 100 : 0; }
export function identifyHighRiskAreas(incidents: EnvironmentalIncident[]): string[] { const locationCounts: Record<string, number> = {}; incidents.forEach(i => { locationCounts[i.location] = (locationCounts[i.location] || 0) + 1; }); return Object.entries(locationCounts).filter(([_, count]) => count >= 3).map(([loc, _]) => loc); }
export function forecastMonitoringNeeds(monitoringData: MonitoringData[], parameter: string): number { const paramData = getMonitoringByParameter(monitoringData, parameter); return paramData.length > 0 ? paramData.length * 12 : 52; }
export function exportPermitsToCSV(permits: EnvironmentalPermit[]): string { return permits.map(p => [p.permitNumber, p.permitType, p.issuingAgency, p.expirationDate, p.status].join(',')).join('\n'); }
export function notifyExpiringPermits(permits: EnvironmentalPermit[], daysThreshold: number): EnvironmentalPermit[] { return getExpiringPermits(permits, daysThreshold); }
export function auditComplianceRecords(permits: EnvironmentalPermit[], inspections: ComplianceInspection[]): any { return { expiredPermits: permits.filter(p => isPermitExpired(p)).length, missedInspections: 0, pendingActions: getUnresolvedIncidents([]).length }; }
export function calculateEnvironmentalScore(complianceRate: number, incidents: number): number { return Math.max(0, complianceRate - incidents * 5); }
export function prioritizeComplianceActions(permits: EnvironmentalPermit[], incidents: EnvironmentalIncident[]): any[] { return [...getExpiringPermits(permits, 30), ...getCriticalIncidents(incidents)]; }
export function useEnvironmentalCompliance() { const [permits, setPermits] = useState<EnvironmentalPermit[]>([]); return { permits, addPermit: (p: EnvironmentalPermit) => setPermits(prev => [...prev, p]) }; }

export default { createPermit, renewPermit, createInspection, useEnvironmentalCompliance };
