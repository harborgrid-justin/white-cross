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

export default function InventorySettingsPage() {
  return <InventorySettingsContent />;
}
