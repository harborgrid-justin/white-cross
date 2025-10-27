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

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function ExpiringItemsPage() {
  return <ExpiringItemsContent />;
}
