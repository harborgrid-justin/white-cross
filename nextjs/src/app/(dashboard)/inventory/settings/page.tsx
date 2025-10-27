/**
 * Inventory Settings Page
 *
 * Configure inventory management settings
 */

import React from 'react';
import { Metadata } from 'next';
import { InventorySettingsContent } from './InventorySettingsContent';

export const metadata: Metadata = {
  title: 'Settings | Inventory',
  description: 'Configure inventory settings',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

export default function InventorySettingsPage() {
  return <InventorySettingsContent />;
}
