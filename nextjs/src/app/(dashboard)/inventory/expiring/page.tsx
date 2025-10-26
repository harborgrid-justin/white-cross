/**
 * Expiring Items Page
 *
 * View items approaching expiration
 */

import React from 'react';
import { Metadata } from 'next';
import { ExpiringItemsContent } from './ExpiringItemsContent';

export const metadata: Metadata = {
  title: 'Expiring Items | Inventory',
  description: 'View items approaching expiration',
};

export default function ExpiringItemsPage() {
  return <ExpiringItemsContent />;
}
