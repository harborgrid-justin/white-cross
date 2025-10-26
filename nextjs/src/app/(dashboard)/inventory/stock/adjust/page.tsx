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

export default function StockAdjustmentPage() {
  return <StockAdjustmentContent />;
}
