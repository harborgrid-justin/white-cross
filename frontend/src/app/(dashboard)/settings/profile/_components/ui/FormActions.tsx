/**
 * @fileoverview Reusable form action buttons component
 * @module app/(dashboard)/profile/_components/ui/FormActions
 * @category Profile - UI Components
 */

'use client';

import { Save } from 'lucide-react';

interface FormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  disabled?: boolean;
}

/**
 * Standard form action buttons (Save/Cancel)
 * Provides consistent styling across all forms
 */
export function FormActions({
  onSave,
  onCancel,
  saveLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  disabled = false
}: FormActionsProps) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onSave}
        disabled={disabled}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="h-4 w-4 mr-2 inline" />
        {saveLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={disabled}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {cancelLabel}
      </button>
    </div>
  );
}
