/**
 * Form card component for grid view
 *
 * Displays an individual form as a card with metadata, statistics,
 * status badges, and action buttons.
 */

import React from 'react';
import Link from 'next/link';
import { Edit, Eye, Copy, Share, Pause, Play, Archive, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HealthcareForm } from './types/formTypes';
import {
  getStatusBadge,
  getPriorityBadge,
  getTypeIcon,
  formatDate,
  formatCompletionRate,
} from './utils/formHelpers';

/**
 * Props for FormCard component
 */
export interface FormCardProps {
  /** Form data to display */
  form: HealthcareForm;

  /** Whether the form is selected */
  isSelected: boolean;

  /** Callback when form selection changes */
  onSelectionChange: (checked: boolean) => void;

  /** Callback to duplicate the form */
  onDuplicate: () => void;

  /** Callback to toggle form status */
  onToggleStatus: () => void;

  /** Callback to archive the form */
  onArchive: () => void;
}

/**
 * Form card component for grid view display
 *
 * @param props - Component props
 * @returns JSX element with form card
 */
export const FormCard: React.FC<FormCardProps> = ({
  form,
  isSelected,
  onSelectionChange,
  onDuplicate,
  onToggleStatus,
  onArchive,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-6">
      {/* Form Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {getTypeIcon(form.type)}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelectionChange(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              aria-label={`Select form: ${form.title}`}
            />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{form.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{form.description}</p>
        </div>
      </div>

      {/* Status and Priority Badges */}
      <div className="flex items-center gap-2 mb-4">
        {getStatusBadge(form.status)}
        {getPriorityBadge(form.priority)}
        {form.settings.requiresHIPAAConsent && (
          <Badge className="bg-purple-100 text-purple-800">
            <Shield className="h-3 w-3 mr-1" />
            HIPAA
          </Badge>
        )}
      </div>

      {/* Form Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-semibold text-gray-900">{form.analytics.submissions}</div>
          <div className="text-gray-600">Responses</div>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <div className="font-semibold text-gray-900">
            {formatCompletionRate(form.analytics.completionRate)}
          </div>
          <div className="text-gray-600">Completion</div>
        </div>
      </div>

      {/* Form Metadata */}
      <div className="text-xs text-gray-500 mb-4 space-y-1">
        <div>Created: {formatDate(form.createdAt)}</div>
        <div>Updated: {formatDate(form.updatedAt)}</div>
        <div>By: {form.createdBy.name}</div>
        <div>Fields: {form.fields.length}</div>
      </div>

      {/* Tags */}
      {form.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {form.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
            {form.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{form.tags.length - 3} more</span>
            )}
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2">
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

          {form.sharing.isPublic && (
            <Button variant="ghost" size="sm" title="Share form">
              <Share className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleStatus}
            title={form.status === 'published' ? 'Pause form' : 'Publish form'}
          >
            {form.status === 'published' ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button variant="ghost" size="sm" onClick={onArchive} title="Archive form">
            <Archive className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
