/**
 * Medications Header Component
 *
 * Displays page title, description, and action buttons based on active tab
 */

import React from 'react';
import { Plus, Package } from 'lucide-react';
import type { MedicationTab } from '../types';

interface MedicationsHeaderProps {
  activeTab: MedicationTab;
  onAddMedication: () => void;
  onReportReaction: () => void;
  onInventoryAction: () => void;
}

/**
 * Header component with context-aware action buttons
 */
export default function MedicationsHeader({
  activeTab,
  onAddMedication,
  onReportReaction,
  onInventoryAction,
}: MedicationsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1
          data-testid="medications-title"
          className="text-2xl font-bold text-gray-900"
          role="heading"
        >
          Medication Management
        </h1>
        <p data-testid="medications-subtitle" className="text-gray-600">
          Comprehensive medication tracking, administration, and inventory management
        </p>
      </div>

      <div className="flex gap-2">
        {activeTab === 'medications' && (
          <button
            data-testid="add-medication-button"
            onClick={onAddMedication}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </button>
        )}

        {activeTab === 'inventory' && (
          <button
            data-testid="inventory-button"
            onClick={onInventoryAction}
            className="btn-primary flex items-center"
          >
            <Package className="h-4 w-4 mr-2" />
            Inventory
          </button>
        )}

        {activeTab === 'adverse-reactions' && (
          <button
            data-testid="report-reaction-button"
            onClick={onReportReaction}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Report Reaction
          </button>
        )}

        {activeTab === 'overview' && (
          <button
            data-testid="add-medication-button"
            onClick={onAddMedication}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </button>
        )}
      </div>
    </div>
  );
}
