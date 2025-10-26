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

export default function PhysicalCountsPage() {
  return <PhysicalCountsContent />;
}
