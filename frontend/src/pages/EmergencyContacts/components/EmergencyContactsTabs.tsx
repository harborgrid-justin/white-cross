/**
 * Emergency Contacts Tabs Component
 *
 * Navigation tabs for different views
 *
 * @module components/EmergencyContactsTabs
 */

import React from 'react';
import { Users, Phone, Send } from 'lucide-react';
import type { EmergencyContactsTab } from '../types';

interface EmergencyContactsTabsProps {
  activeTab: EmergencyContactsTab;
  onTabChange: (tab: EmergencyContactsTab) => void;
}

const TABS = [
  { id: 'overview' as const, label: 'Overview', icon: Users },
  { id: 'contacts' as const, label: 'Contacts', icon: Phone },
  { id: 'notify' as const, label: 'Send Notification', icon: Send },
];

/**
 * Tabs navigation component
 */
export default function EmergencyContactsTabs({
  activeTab,
  onTabChange,
}: EmergencyContactsTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
