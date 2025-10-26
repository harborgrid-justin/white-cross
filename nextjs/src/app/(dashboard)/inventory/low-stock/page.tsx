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

export default function LowStockAlertsPage() {
  return <LowStockAlertsContent />;
}
