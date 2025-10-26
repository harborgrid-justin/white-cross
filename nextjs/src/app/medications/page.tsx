'use client';

import React, { useState } from 'react';
import { useMedicationsData } from '@/hooks/domains/medications';
import MedicationsOverviewTab from '@/components/medications/tabs/MedicationsOverviewTab';
import MedicationsListTab from '@/components/medications/tabs/MedicationsListTab';
import MedicationsInventoryTab from '@/components/medications/tabs/MedicationsInventoryTab';
import MedicationsRemindersTab from '@/components/medications/tabs/MedicationsRemindersTab';
import MedicationsAdverseReactionsTab from '@/components/medications/tabs/MedicationsAdverseReactionsTab';

type MedicationTab = 'overview' | 'list' | 'inventory' | 'reminders' | 'adverse-reactions';

/**
 * Medications Page
 *
 * Main medications management interface with tabbed navigation for:
 * - Overview: Statistics and quick actions
 * - List: All active medications with filtering
 * - Inventory: Stock management and expiration tracking
 * - Reminders: Administration reminders and scheduling
 * - Adverse Reactions: Safety monitoring and reporting
 *
 * @remarks
 * - Client Component for interactive tab navigation
 * - Uses React Query for server state management
 * - All medication operations are HIPAA-audited
 * - Implements medication safety checks before administration
 */
export default function MedicationsPage() {
  const [activeTab, setActiveTab] = useState<MedicationTab>('overview');

  // Fetch all medication-related data
  const {
    medications,
    inventory,
    reminders,
    adverseReactions,
    isLoading,
    error,
  } = useMedicationsData();

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Medications</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                {error instanceof Error ? error.message : 'Unable to load medication data. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Medications
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage student medications with Five Rights safety verification
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`${
              activeTab === 'list'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
          >
            Medications
            {medications && medications.length > 0 && (
              <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-900">
                {medications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`${
              activeTab === 'inventory'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`${
              activeTab === 'reminders'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
          >
            Reminders
          </button>
          <button
            onClick={() => setActiveTab('adverse-reactions')}
            className={`${
              activeTab === 'adverse-reactions'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium`}
          >
            Adverse Reactions
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <span className="ml-3 text-sm text-gray-500">Loading medications...</span>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <MedicationsOverviewTab
                medications={medications}
                inventory={inventory}
                reminders={reminders}
                adverseReactions={adverseReactions}
              />
            )}
            {activeTab === 'list' && <MedicationsListTab medications={medications} />}
            {activeTab === 'inventory' && <MedicationsInventoryTab inventory={inventory} />}
            {activeTab === 'reminders' && <MedicationsRemindersTab reminders={reminders} />}
            {activeTab === 'adverse-reactions' && (
              <MedicationsAdverseReactionsTab adverseReactions={adverseReactions} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
