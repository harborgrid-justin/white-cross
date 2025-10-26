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

export default function InventoryReportsPage() {
  return <InventoryReportsContent />;
}
