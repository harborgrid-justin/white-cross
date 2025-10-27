/**
 * Inventory Dashboard Page
 *
 * Main inventory management dashboard with overview statistics
 */

import React from 'react';
import { Metadata } from 'next';
import { InventoryDashboardContent } from './InventoryDashboardContent';

export const metadata: Metadata = {
  title: 'Inventory Dashboard | White Cross',
  description: 'Inventory management overview and statistics',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function InventoryDashboardPage() {
  return <InventoryDashboardContent />;
}
