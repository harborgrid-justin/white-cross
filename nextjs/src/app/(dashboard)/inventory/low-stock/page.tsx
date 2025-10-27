/**
 * Low Stock Alerts Page
 *
 * View items with low stock levels
 */

import React from 'react';
import { Metadata } from 'next';
import { LowStockAlertsContent } from './LowStockAlertsContent';

export const metadata: Metadata = {
  title: 'Low Stock Alerts | Inventory',
  description: 'View low stock alerts',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function LowStockAlertsPage() {
  return <LowStockAlertsContent />;
}
