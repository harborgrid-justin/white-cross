/**
 * Forms list layout component
 *
 * Renders forms in a vertical list layout using FormListItem components.
 * Handles empty state display when no forms match criteria.
 */

import React from 'react';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HealthcareForm } from './types/formTypes';
import { FormListItem } from './FormListItem';

/**
 * Props for FormsList component
 */
export interface FormsListProps {
  /** Array of forms to display */
  forms: HealthcareForm[];

  /** Set of selected form IDs */
  selectedForms: Set<string>;

  /** Callback when form selection changes */
  onSelectionChange: (formId: string, checked: boolean) => void;

  /** Callback to duplicate a form */
  onDuplicate: (formId: string) => void;

  /** Whether filters are active */
  hasActiveFilters: boolean;
}

/**
 * List layout for displaying forms
 *
 * @param props - Component props
 * @returns JSX element with forms list or empty state
 */
export const FormsList: React.FC<FormsListProps> = ({
  forms,
  selectedForms,
  onSelectionChange,
  onDuplicate,
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

  // List layout
  return (
    <div className="space-y-4">
      {forms.map((form) => (
        <FormListItem
          key={form.id}
          form={form}
          isSelected={selectedForms.has(form.id)}
          onSelectionChange={(checked) => onSelectionChange(form.id, checked)}
          onDuplicate={() => onDuplicate(form.id)}
        />
      ))}
    </div>
  );
};
