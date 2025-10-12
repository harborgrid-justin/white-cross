/**
 * Medications Tabs Component
 *
 * Navigation tabs for different medication management sections
 */

import React from 'react';
import { Pill, Package, Bell, AlertTriangle } from 'lucide-react';
import type { MedicationTab } from '../types';

interface MedicationsTabsProps {
  activeTab: MedicationTab;
  onTabChange: (tab: MedicationTab) => void;
}

const tabs = [
  { id: 'overview' as MedicationTab, label: 'Overview', icon: Pill },
  { id: 'medications' as MedicationTab, label: 'Medications', icon: Pill },
  { id: 'inventory' as MedicationTab, label: 'Inventory', icon: Package },
  { id: 'reminders' as MedicationTab, label: 'Reminders', icon: Bell },
  {
    id: 'adverse-reactions' as MedicationTab,
    label: 'Adverse Reactions',
    icon: AlertTriangle,
  },
];

/**
 * Tab navigation component for medication sections
 */
export default function MedicationsTabs({
  activeTab,
  onTabChange,
}: MedicationsTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              data-testid={`${tab.id}-tab`}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              className={`
                flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
