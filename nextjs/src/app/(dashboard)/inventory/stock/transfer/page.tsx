/**
 * Transfer Stock Page
 *
 * Transfer stock between locations
 */

import React from 'react';
import { Metadata } from 'next';
import { TransferStockContent } from './TransferStockContent';

export const metadata: Metadata = {
  title: 'Transfer Stock | Inventory',
  description: 'Transfer stock between locations',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function TransferStockPage() {
  return <TransferStockContent />;
}
