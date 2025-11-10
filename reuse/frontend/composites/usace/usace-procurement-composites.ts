/**
 * LOC: USACE-PR-001
 * File: /reuse/frontend/composites/usace/usace-procurement-composites.ts
 * Purpose: USACE CEFMS Procurement Composites - Procurement processes and vendor management
 * Exports: 40+ functions for procurement and purchase order management
 */

'use client';

import React, { useState } from 'react';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  requisitionId?: string;
  orderDate: string;
  deliveryDate: string;
  totalAmount: number;
  status: 'draft' | 'submitted' | 'approved' | 'ordered' | 'received' | 'closed';
  items: PurchaseItem[];
  approver?: string;
}

export interface PurchaseItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactEmail: string;
  rating: number;
  status: 'active' | 'inactive' | 'suspended';
}

export function createPurchaseOrder(data: Partial<PurchaseOrder>): PurchaseOrder {
  return { id: 'po_' + Date.now(), poNumber: '', vendorId: '', orderDate: new Date().toISOString(), deliveryDate: '', totalAmount: 0, status: 'draft', items: [], ...data };
}

export function addItemToPO(po: PurchaseOrder, item: PurchaseItem): PurchaseOrder { const items = [...po.items, item]; const total = items.reduce((sum, i) => sum + i.totalPrice, 0); return { ...po, items, totalAmount: total }; }
export function removeItemFromPO(po: PurchaseOrder, itemId: string): PurchaseOrder { const items = po.items.filter(i => i.id !== itemId); const total = items.reduce((sum, i) => sum + i.totalPrice, 0); return { ...po, items, totalAmount: total }; }
export function submitPurchaseOrder(po: PurchaseOrder): PurchaseOrder { return { ...po, status: 'submitted' }; }
export function approvePurchaseOrder(po: PurchaseOrder, approver: string): PurchaseOrder { return { ...po, status: 'approved', approver }; }
export function orderPurchaseOrder(po: PurchaseOrder): PurchaseOrder { return { ...po, status: 'ordered' }; }
export function receivePurchaseOrder(po: PurchaseOrder): PurchaseOrder { return { ...po, status: 'received' }; }
export function closePurchaseOrder(po: PurchaseOrder): PurchaseOrder { return { ...po, status: 'closed' }; }
export function calculatePOTotal(items: PurchaseItem[]): number { return items.reduce((sum, item) => sum + item.totalPrice, 0); }
export function createPurchaseItem(data: Partial<PurchaseItem>): PurchaseItem { const quantity = data.quantity || 1; const unitPrice = data.unitPrice || 0; return { id: 'item_' + Date.now(), description: data.description || '', quantity, unitPrice, totalPrice: quantity * unitPrice, category: data.category || '', ...data }; }
export function updateItemQuantity(item: PurchaseItem, quantity: number): PurchaseItem { return { ...item, quantity, totalPrice: quantity * item.unitPrice }; }
export function updateItemPrice(item: PurchaseItem, unitPrice: number): PurchaseItem { return { ...item, unitPrice, totalPrice: item.quantity * unitPrice }; }
export function getPOsByVendor(orders: PurchaseOrder[], vendorId: string): PurchaseOrder[] { return orders.filter(po => po.vendorId === vendorId); }
export function getPOsByStatus(orders: PurchaseOrder[], status: string): PurchaseOrder[] { return orders.filter(po => po.status === status); }
export function getPendingPOs(orders: PurchaseOrder[]): PurchaseOrder[] { return orders.filter(po => po.status === 'submitted'); }
export function getOverduePOs(orders: PurchaseOrder[]): PurchaseOrder[] { return orders.filter(po => po.status !== 'received' && po.status !== 'closed' && new Date(po.deliveryDate) < new Date()); }
export function calculateTotalSpending(orders: PurchaseOrder[]): number { return orders.filter(po => po.status !== 'draft').reduce((sum, po) => sum + po.totalAmount, 0); }
export function calculateSpendingByVendor(orders: PurchaseOrder[]): Record<string, number> { return orders.reduce((acc, po) => { acc[po.vendorId] = (acc[po.vendorId] || 0) + po.totalAmount; return acc; }, {} as Record<string, number>); }
export function createVendor(data: Partial<Vendor>): Vendor { return { id: 'vendor_' + Date.now(), name: '', contactEmail: '', rating: 5, status: 'active', ...data }; }
export function updateVendorRating(vendor: Vendor, rating: number): Vendor { return { ...vendor, rating: Math.max(1, Math.min(5, rating)) }; }
export function activateVendor(vendor: Vendor): Vendor { return { ...vendor, status: 'active' }; }
export function suspendVendor(vendor: Vendor): Vendor { return { ...vendor, status: 'suspended' }; }
export function getActiveVendors(vendors: Vendor[]): Vendor[] { return vendors.filter(v => v.status === 'active'); }
export function getTopVendors(vendors: Vendor[], count: number): Vendor[] { return [...vendors].sort((a, b) => b.rating - a.rating).slice(0, count); }
export function validatePurchaseOrder(po: Partial<PurchaseOrder>): string[] { const errors: string[] = []; if (!po.poNumber) errors.push('PO number required'); if (!po.vendorId) errors.push('Vendor required'); if (!po.deliveryDate) errors.push('Delivery date required'); if (!po.items || po.items.length === 0) errors.push('At least one item required'); return errors; }
export function duplicatePurchaseOrder(po: PurchaseOrder): PurchaseOrder { return { ...po, id: 'po_' + Date.now(), poNumber: po.poNumber + '_COPY', status: 'draft' }; }
export function calculateLeadTime(orderDate: string, deliveryDate: string): number { return (new Date(deliveryDate).getTime() - new Date(orderDate).getTime()) / 86400000; }
export function forecastProcurementNeeds(historicalOrders: PurchaseOrder[], category: string): number { const relevant = historicalOrders.filter(po => po.items.some(i => i.category === category)); return relevant.length > 0 ? relevant.reduce((sum, po) => sum + po.totalAmount, 0) / relevant.length : 0; }
export function identifyFrequentlyOrderedItems(orders: PurchaseOrder[]): Record<string, number> { const itemCounts: Record<string, number> = {}; orders.forEach(po => po.items.forEach(item => { itemCounts[item.description] = (itemCounts[item.description] || 0) + item.quantity; })); return itemCounts; }
export function calculateProcurementCycle(orders: PurchaseOrder[]): number { const completed = orders.filter(po => po.status === 'closed'); if (completed.length === 0) return 0; const avgCycle = completed.reduce((sum, po) => sum + calculateLeadTime(po.orderDate, po.deliveryDate), 0) / completed.length; return avgCycle; }
export function suggestBulkOrdering(items: Record<string, number>, threshold: number): string[] { return Object.entries(items).filter(([_, count]) => count >= threshold).map(([desc, _]) => desc); }
export function calculateCostSavings(bulkPrice: number, regularPrice: number, quantity: number): number { return (regularPrice - bulkPrice) * quantity; }
export function generateProcurementReport(orders: PurchaseOrder[]): any { return { totalOrders: orders.length, totalSpending: calculateTotalSpending(orders), pending: getPendingPOs(orders).length, overdue: getOverduePOs(orders).length, avgCycle: calculateProcurementCycle(orders) }; }
export function exportPOsToCSV(orders: PurchaseOrder[]): string { return orders.map(po => [po.poNumber, po.vendorId, po.orderDate, po.totalAmount, po.status].join(',')).join('\n'); }
export function trackPOStatus(po: PurchaseOrder): string { return po.status; }
export function notifyOverduePOs(orders: PurchaseOrder[]): PurchaseOrder[] { return getOverduePOs(orders); }
export function calculateVendorPerformance(orders: PurchaseOrder[], vendorId: string): any { const vendorOrders = getPOsByVendor(orders, vendorId); const onTime = vendorOrders.filter(po => po.status === 'received' && new Date(po.deliveryDate) >= new Date()).length; return { totalOrders: vendorOrders.length, onTimeDelivery: vendorOrders.length > 0 ? (onTime / vendorOrders.length) * 100 : 0 }; }
export function useProcurement() { const [orders, setOrders] = useState<PurchaseOrder[]>([]); return { orders, addOrder: (po: PurchaseOrder) => setOrders(prev => [...prev, po]) }; }

export default { createPurchaseOrder, submitPurchaseOrder, useProcurement };
