/**
 * Stock Levels Page
 *
 * View current stock levels across all locations
 */

import React from 'react';
import { Metadata } from 'next';
import { StockLevelsContent } from './StockLevelsContent';

export const metadata: Metadata = {
  title: 'Stock Levels | Inventory',
  description: 'View current stock levels',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function StockLevelsPage() {
  return <StockLevelsContent />;
}
