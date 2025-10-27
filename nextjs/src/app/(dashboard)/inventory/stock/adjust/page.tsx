/**
 * Stock Adjustment Page
 *
 * Manually adjust stock levels
 */

import React from 'react';
import { Metadata } from 'next';
import { StockAdjustmentContent } from './StockAdjustmentContent';

export const metadata: Metadata = {
  title: 'Adjust Stock | Inventory',
  description: 'Manually adjust stock levels',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function StockAdjustmentPage() {
  return <StockAdjustmentContent />;
}
