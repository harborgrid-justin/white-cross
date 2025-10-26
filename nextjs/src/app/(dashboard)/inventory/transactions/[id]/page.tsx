/**
 * Transaction Detail Page
 *
 * View detailed information about a specific transaction
 */

import React from 'react';
import { Metadata } from 'next';
import { TransactionDetailContent } from './TransactionDetailContent';

export const metadata: Metadata = {
  title: 'Transaction Details | Inventory',
  description: 'View transaction details',
};

interface TransactionDetailPageProps {
  params: {
    id: string;
  };
}

export default function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  return <TransactionDetailContent transactionId={params.id} />;
}
