/**
 * Forms grid layout component
 *
 * Renders forms in a responsive grid layout using FormCard components.
 * Handles empty state display when no forms match criteria.
 */

import React from 'react';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HealthcareForm } from './types/formTypes';
import { FormCard } from './FormCard';

/**
 * Props for FormsGrid component
 */
export interface FormsGridProps {
  /** Array of forms to display */
  forms: HealthcareForm[];

  /** Set of selected form IDs */
  selectedForms: Set<string>;

  /** Callback when form selection changes */
  onSelectionChange: (formId: string, checked: boolean) => void;

  /** Callback to duplicate a form */
  onDuplicate: (formId: string) => void;

  /** Callback to toggle form status */
  onToggleStatus: (formId: string) => void;

  /** Callback to archive a form */
  onArchive: (formId: string) => void;

  /** Whether filters are active */
  hasActiveFilters: boolean;
}

/**
 * Grid layout for displaying forms
 *
 * @param props - Component props
 * @returns JSX element with forms grid or empty state
 */
export const FormsGrid: React.FC<FormsGridProps> = ({
  forms,
  selectedForms,
  onSelectionChange,
  onDuplicate,
  onToggleStatus,
  onArchive,
  hasActiveFilters,
}) => {
  // Empty state
  if (forms.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 font-medium mb-2">
          {hasActiveFilters ? 'No forms match your criteria' : 'No forms created yet'}
        </p>
        <p className="text-sm text-gray-400 mb-4">
          {hasActiveFilters
            ? 'Try adjusting your search terms or filters'
            : 'Create your first healthcare form to get started.'}
        </p>
        <Link href="/forms/new">
          <Button variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Form
          </Button>
        </Link>
      </div>
    );
  }

  // Grid layout
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {forms.map((form) => (
        <FormCard
          key={form.id}
          form={form}
          isSelected={selectedForms.has(form.id)}
          onSelectionChange={(checked) => onSelectionChange(form.id, checked)}
          onDuplicate={() => onDuplicate(form.id)}
          onToggleStatus={() => onToggleStatus(form.id)}
          onArchive={() => onArchive(form.id)}
        />
      ))}
    </div>
  );
};
