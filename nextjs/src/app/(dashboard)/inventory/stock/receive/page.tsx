/**
 * Receive Stock Page
 *
 * Receive stock shipments into inventory
 */

import React from 'react';
import { Metadata } from 'next';
import { ReceiveStockContent } from './ReceiveStockContent';

export const metadata: Metadata = {
  title: 'Receive Stock | Inventory',
  description: 'Receive stock shipments',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function ReceiveStockPage() {
  return <ReceiveStockContent />;
}
