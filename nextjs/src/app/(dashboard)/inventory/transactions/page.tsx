/**
 * Transaction History Page
 *
 * View all inventory transactions
 */

import React from 'react';
import { Metadata } from 'next';
import { TransactionHistoryContent } from './TransactionHistoryContent';

export const metadata: Metadata = {
  title: 'Transaction History | Inventory',
  description: 'View inventory transaction history',
};

export default function TransactionHistoryPage() {
  return <TransactionHistoryContent />;
}
