/**
 * Inventory Reports Page
 *
 * Generate and view inventory reports
 */

import React from 'react';
import { Metadata } from 'next';
import { InventoryReportsContent } from './InventoryReportsContent';

export const metadata: Metadata = {
  title: 'Reports | Inventory',
  description: 'Generate inventory reports',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function InventoryReportsPage() {
  return <InventoryReportsContent />;
}
