/**
 * Physical Counts Page
 *
 * Perform and manage physical inventory counts
 */

import React from 'react';
import { Metadata } from 'next';
import { PhysicalCountsContent } from './PhysicalCountsContent';

export const metadata: Metadata = {
  title: 'Physical Counts | Inventory',
  description: 'Manage physical inventory counts',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function PhysicalCountsPage() {
  return <PhysicalCountsContent />;
}
