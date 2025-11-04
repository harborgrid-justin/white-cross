/**
 * Form list item component for list view
 *
 * Displays an individual form as a compact list item with
 * inline metadata and action buttons.
 */

import React from 'react';
import Link from 'next/link';
import { Edit, Eye, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HealthcareForm } from './types/formTypes';
import {
  getStatusBadge,
  getPriorityBadge,
  getTypeIcon,
  formatDate,
  formatCompletionRate,
} from './utils/formHelpers';

/**
 * Props for FormListItem component
 */
export interface FormListItemProps {
  /** Form data to display */
  form: HealthcareForm;

  /** Whether the form is selected */
  isSelected: boolean;

  /** Callback when form selection changes */
  onSelectionChange: (checked: boolean) => void;

  /** Callback to duplicate the form */
  onDuplicate: () => void;
}

/**
 * Form list item component for list view display
 *
 * @param props - Component props
 * @returns JSX element with form list item
 */
export const FormListItem: React.FC<FormListItemProps> = ({
  form,
  isSelected,
  onSelectionChange,
  onDuplicate,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-4">
      <div className="flex items-center gap-4">
        {/* Selection and Type */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelectionChange(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label={`Select form: ${form.title}`}
          />
          {getTypeIcon(form.type)}
        </div>

        {/* Form Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{form.title}</h3>
            {getStatusBadge(form.status)}
            {getPriorityBadge(form.priority)}
          </div>
          <p className="text-sm text-gray-600 truncate">{form.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
            <span>By {form.createdBy.name}</span>
            <span>Updated {formatDate(form.updatedAt)}</span>
            <span>{form.fields.length} fields</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="text-right">
          <div className="text-sm font-semibold text-gray-900">
            {form.analytics.submissions} responses
          </div>
          <div className="text-xs text-gray-500">
            {formatCompletionRate(form.analytics.completionRate)} completion
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link href={`/forms/${form.id}/edit`}>
            <Button variant="ghost" size="sm" title="Edit form">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/forms/${form.id}/responses`}>
            <Button variant="ghost" size="sm" title="View responses">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={onDuplicate} title="Duplicate form">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
