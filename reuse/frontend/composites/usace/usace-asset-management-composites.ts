/**
 * LOC: USACE-AM-001
 * File: /reuse/frontend/composites/usace/usace-asset-management-composites.ts
 * Purpose: USACE CEFMS Asset Management Composites - Asset lifecycle and valuation management
 * Exports: 36+ functions for asset tracking and management
 */

'use client';

import React, { useState } from 'react';

export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  category: 'equipment' | 'vehicle' | 'building' | 'land' | 'other';
  acquisitionDate: string;
  acquisitionCost: number;
  currentValue: number;
  location: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  status: 'active' | 'maintenance' | 'retired' | 'disposed';
}

export function createAsset(data: Partial<Asset>): Asset {
  return { id: 'asset_' + Date.now(), assetTag: '', name: '', category: 'equipment', acquisitionDate: '', acquisitionCost: 0, currentValue: 0, location: '', condition: 'good', status: 'active', ...data };
}

export function updateAssetValue(asset: Asset, newValue: number): Asset { return { ...asset, currentValue: newValue }; }
export function calculateDepreciation(asset: Asset, years: number, method: 'straight_line' | 'declining_balance' = 'straight_line'): number { if (method === 'straight_line') { return asset.acquisitionCost / years; } return asset.currentValue * 0.2; }
export function updateAssetCondition(asset: Asset, condition: Asset['condition']): Asset { return { ...asset, condition }; }
export function updateAssetStatus(asset: Asset, status: Asset['status']): Asset { return { ...asset, status }; }
export function retireAsset(asset: Asset): Asset { return { ...asset, status: 'retired' }; }
export function disposeAsset(asset: Asset): Asset { return { ...asset, status: 'disposed' }; }
export function calculateAssetAge(asset: Asset): number { return (Date.now() - new Date(asset.acquisitionDate).getTime()) / (365.25 * 86400000); }
export function getAssetsByCategory(assets: Asset[], category: string): Asset[] { return assets.filter(a => a.category === category); }
export function getAssetsByLocation(assets: Asset[], location: string): Asset[] { return assets.filter(a => a.location === location); }
export function getAssetsByStatus(assets: Asset[], status: string): Asset[] { return assets.filter(a => a.status === status); }
export function getActiveAssets(assets: Asset[]): Asset[] { return assets.filter(a => a.status === 'active'); }
export function getRetiredAssets(assets: Asset[]): Asset[] { return assets.filter(a => a.status === 'retired'); }
export function calculateTotalAssetValue(assets: Asset[]): number { return assets.reduce((sum, a) => sum + a.currentValue, 0); }
export function calculateTotalAcquisitionCost(assets: Asset[]): number { return assets.reduce((sum, a) => sum + a.acquisitionCost, 0); }
export function identifyDepreciatingAssets(assets: Asset[]): Asset[] { return assets.filter(a => a.currentValue < a.acquisitionCost); }
export function groupAssetsByCategory(assets: Asset[]): Record<string, Asset[]> { return assets.reduce((acc, a) => { acc[a.category] = acc[a.category] || []; acc[a.category].push(a); return acc; }, {} as Record<string, Asset[]>); }
export function validateAsset(asset: Partial<Asset>): string[] { const errors: string[] = []; if (!asset.assetTag) errors.push('Asset tag required'); if (!asset.name) errors.push('Name required'); if (!asset.acquisitionCost || asset.acquisitionCost <= 0) errors.push('Acquisition cost must be positive'); return errors; }
export function transferAsset(asset: Asset, newLocation: string): Asset { return { ...asset, location: newLocation }; }
export function scheduleAssetMaintenance(asset: Asset): any { return { assetId: asset.id, scheduledDate: new Date(Date.now() + 30 * 86400000).toISOString() }; }
export function calculateMaintenanceCost(asset: Asset, maintenancePercent: number): number { return asset.currentValue * (maintenancePercent / 100); }
export function assessAssetCondition(asset: Asset): string { return asset.condition; }
export function recommendDisposal(asset: Asset): boolean { return asset.condition === 'poor' || calculateAssetAge(asset) > 20; }
export function calculateReplacementCost(asset: Asset, inflationRate: number): number { const age = calculateAssetAge(asset); return asset.acquisitionCost * Math.pow(1 + inflationRate / 100, age); }
export function prioritizeAssetMaintenance(assets: Asset[]): Asset[] { return assets.sort((a, b) => { const scoreA = a.condition === 'poor' ? 3 : a.condition === 'fair' ? 2 : 1; const scoreB = b.condition === 'poor' ? 3 : b.condition === 'fair' ? 2 : 1; return scoreB - scoreA; }); }
export function generateAssetInventory(assets: Asset[]): any { return { total: assets.length, active: getActiveAssets(assets).length, byCategory: groupAssetsByCategory(assets), totalValue: calculateTotalAssetValue(assets) }; }
export function exportAssetsToCSV(assets: Asset[]): string { return assets.map(a => [a.assetTag, a.name, a.category, a.currentValue, a.status].join(',')).join('\n'); }
export function calculateUtilizationRate(asset: Asset, usageDays: number, totalDays: number): number { return totalDays > 0 ? (usageDays / totalDays) * 100 : 0; }
export function forecastAssetReplacement(asset: Asset, usefulLife: number): Date { const age = calculateAssetAge(asset); const yearsRemaining = usefulLife - age; return new Date(Date.now() + yearsRemaining * 365.25 * 86400000); }
export function compareAssetValue(asset1: Asset, asset2: Asset): number { return asset1.currentValue - asset2.currentValue; }
export function auditAssetRegistry(assets: Asset[]): any { return { total: assets.length, missingTags: assets.filter(a => !a.assetTag).length, outdatedValues: assets.filter(a => a.currentValue === a.acquisitionCost).length }; }
export function tagAsset(asset: Asset, newTag: string): Asset { return { ...asset, assetTag: newTag }; }
export function updateAssetLocation(asset: Asset, location: string): Asset { return transferAsset(asset, location); }
export function useAssetManagement() { const [assets, setAssets] = useState<Asset[]>([]); return { assets, addAsset: (a: Asset) => setAssets(prev => [...prev, a]) }; }

export default { createAsset, updateAssetValue, useAssetManagement };
