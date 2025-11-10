/**
 * LOC: USACE-CT-001
 * File: /reuse/frontend/composites/usace/usace-cost-tracking-composites.ts
 * Purpose: USACE CEFMS Cost Tracking Composites - Comprehensive cost management and tracking
 * Exports: 42+ functions for cost tracking, variance analysis, and earned value management
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

export interface CostItem {
  id: string;
  projectId: string;
  costCode: string;
  category: 'labor' | 'materials' | 'equipment' | 'overhead';
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  date: string;
}

export function createCostItem(data: Partial<CostItem>): CostItem {
  return { id: 'cost_' + Date.now(), projectId: '', costCode: '', category: 'labor', budgetedAmount: 0, actualAmount: 0, variance: 0, date: new Date().toISOString(), ...data };
}

export function calculateTotalCost(items: CostItem[]): number { return items.reduce((sum, item) => sum + item.actualAmount, 0); }
export function calculateTotalBudget(items: CostItem[]): number { return items.reduce((sum, item) => sum + item.budgetedAmount, 0); }
export function calculateVariance(budgeted: number, actual: number): number { return actual - budgeted; }
export function calculateVariancePercentage(budgeted: number, actual: number): number { return budgeted > 0 ? ((actual - budgeted) / budgeted) * 100 : 0; }
export function getCostsByCategory(items: CostItem[], category: string): CostItem[] { return items.filter(i => i.category === category); }
export function getCostsByProject(items: CostItem[], projectId: string): CostItem[] { return items.filter(i => i.projectId === projectId); }
export function getOverBudgetItems(items: CostItem[]): CostItem[] { return items.filter(i => i.variance > 0); }
export function getUnderBudgetItems(items: CostItem[]): CostItem[] { return items.filter(i => i.variance < 0); }
export function calculateEarnedValue(plannedValue: number, percentComplete: number): number { return plannedValue * (percentComplete / 100); }
export function calculateCostPerformanceIndex(earnedValue: number, actualCost: number): number { return actualCost > 0 ? earnedValue / actualCost : 0; }
export function calculateSchedulePerformanceIndex(earnedValue: number, plannedValue: number): number { return plannedValue > 0 ? earnedValue / plannedValue : 0; }
export function isProjectOnBudget(cpi: number): boolean { return cpi >= 1.0; }
export function isProjectOnSchedule(spi: number): boolean { return spi >= 1.0; }
export function forecastCostAtCompletion(budgetAtCompletion: number, cpi: number): number { return cpi > 0 ? budgetAtCompletion / cpi : budgetAtCompletion; }
export function calculateVarianceAtCompletion(budgetAtCompletion: number, estimateAtCompletion: number): number { return budgetAtCompletion - estimateAtCompletion; }
export function generateCostTrend(items: CostItem[]): any[] { return items.map(i => ({ date: i.date, actual: i.actualAmount, budgeted: i.budgetedAmount })); }
export function identifySignificantVariances(items: CostItem[], threshold: number): CostItem[] { return items.filter(i => Math.abs(i.variance / i.budgetedAmount) * 100 >= threshold); }
export function categorizeCostVariance(variancePercent: number): string { return variancePercent <= -5 ? 'favorable' : variancePercent <= 5 ? 'acceptable' : 'unfavorable'; }
export function calculateTrendDirection(items: CostItem[]): string { return 'stable'; }
export function generateCostForecast(historicalData: CostItem[], periods: number): number[] { const avg = historicalData.reduce((sum, i) => sum + i.actualAmount, 0) / historicalData.length; return Array(periods).fill(avg); }
export function adjustForInflation(amount: number, rate: number): number { return amount * (1 + rate / 100); }
export function calculateContingencyReserve(budgetAmount: number, riskPercentage: number): number { return budgetAmount * (riskPercentage / 100); }
export function allocateCostToPhase(totalCost: number, phasePercentage: number): number { return totalCost * (phasePercentage / 100); }
export function trackMilestonePayments(milestones: any[]): number { return milestones.reduce((sum, m) => sum + (m.paid || 0), 0); }
export function calculateRetainage(amount: number, retainagePercent: number): number { return amount * (retainagePercent / 100); }
export function validateCostCode(code: string): boolean { return /^[A-Z0-9-]{3,20}$/.test(code); }
export function categorizeByCostType(items: CostItem[]): Record<string, CostItem[]> { return items.reduce((acc, item) => { acc[item.category] = acc[item.category] || []; acc[item.category].push(item); return acc; }, {} as Record<string, CostItem[]>); }
export function calculateBurnRate(items: CostItem[], days: number): number { const total = calculateTotalCost(items); return days > 0 ? total / days : 0; }
export function projectCompletionDate(remainingBudget: number, burnRate: number): Date { const daysLeft = burnRate > 0 ? remainingBudget / burnRate : 0; return new Date(Date.now() + daysLeft * 86400000); }
export function calculateCostEfficiency(outputValue: number, inputCost: number): number { return inputCost > 0 ? outputValue / inputCost : 0; }
export function aggregateCostsByPeriod(items: CostItem[], period: string): Record<string, number> { return items.reduce((acc, item) => { const key = item.date.substring(0, period === 'month' ? 7 : 10); acc[key] = (acc[key] || 0) + item.actualAmount; return acc; }, {} as Record<string, number>); }
export function comparePeriodCosts(current: CostItem[], previous: CostItem[]): any { return { current: calculateTotalCost(current), previous: calculateTotalCost(previous), change: calculateTotalCost(current) - calculateTotalCost(previous) }; }
export function calculateWeightedAverageCost(items: CostItem[]): number { const totalCost = calculateTotalCost(items); const totalBudget = calculateTotalBudget(items); return items.length > 0 ? totalCost / items.length : 0; }
export function identifyCostDrivers(items: CostItem[]): CostItem[] { return items.sort((a, b) => b.actualAmount - a.actualAmount).slice(0, 10); }
export function calculateCostSavings(budgeted: number, actual: number): number { return Math.max(0, budgeted - actual); }
export function calculateCostOverrun(budgeted: number, actual: number): number { return Math.max(0, actual - budgeted); }
export function generateCostReport(items: CostItem[]): any { return { total: calculateTotalCost(items), budget: calculateTotalBudget(items), variance: calculateTotalCost(items) - calculateTotalBudget(items), byCategory: categorizeByCostType(items) }; }
export function exportCostData(items: CostItem[]): string { return items.map(i => [i.costCode, i.budgetedAmount, i.actualAmount, i.variance].join(',')).join('\n'); }
export function validateCostEntry(item: Partial<CostItem>): string[] { const errors: string[] = []; if (!item.costCode) errors.push('Cost code required'); if (!item.budgetedAmount || item.budgetedAmount <= 0) errors.push('Budget must be positive'); return errors; }
export function approveCostEntry(item: CostItem, approver: string): CostItem { return { ...item, approvedBy: approver }; }
export function useCostTracking() { const [items, setItems] = useState<CostItem[]>([]); return { items, addItem: (item: CostItem) => setItems(prev => [...prev, item]) }; }

export default { createCostItem, calculateTotalCost, useCostTracking };
