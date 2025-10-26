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

export default function TransferStockPage() {
  return <TransferStockContent />;
}
