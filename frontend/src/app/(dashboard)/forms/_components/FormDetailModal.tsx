/**
 * Form detail modal component
 *
 * Displays comprehensive information about a form including analytics,
 * fields, settings, and action buttons in a modal overlay.
 */

import React from 'react';
import Link from 'next/link';
import { X, Edit, BarChart3, ExternalLink, Copy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HealthcareForm } from './types/formTypes';
import { getTypeIcon, formatCompletionRate } from './utils/formHelpers';

/**
 * Props for FormDetailModal component
 */
export interface FormDetailModalProps {
  /** Form to display (null if modal is closed) */
  form: HealthcareForm | null;

  /** Callback to close the modal */
  onClose: () => void;

  /** Callback to duplicate the form */
  onDuplicate: (formId: string) => void;
}

/**
 * Modal component for displaying detailed form information
 *
 * @param props - Component props
 * @returns JSX element with modal or null if form is null
 */
export const FormDetailModal: React.FC<FormDetailModalProps> = ({
  form,
  onClose,
  onDuplicate,
}) => {
  // Don't render if no form is selected
  if (!form) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getTypeIcon(form.type)}
            <div>
              <h2 className="font-semibold text-gray-900">{form.title}</h2>
              <p className="text-sm text-gray-600">{form.description}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Form Analytics */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{form.analytics.views}</div>
              <div className="text-sm text-gray-600">Views</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{form.analytics.submissions}</div>
              <div className="text-sm text-gray-600">Submissions</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {formatCompletionRate(form.analytics.completionRate)}
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>

          {/* Form Fields Preview */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">
              Form Fields ({form.fields.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {form.fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">{field.label}</span>
                    <Badge className="bg-gray-100 text-gray-800 text-xs">{field.type}</Badge>
                    {field.required && (
                      <Badge className="bg-red-100 text-red-800 text-xs">Required</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Settings */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Settings</h3>
            <div className="grid gap-2 md:grid-cols-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Authentication Required:</span>
                <span className="font-medium">
                  {form.settings.requireAuthentication ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Multiple Submissions:</span>
                <span className="font-medium">
                  {form.settings.multipleSubmissions ? 'Allowed' : 'Not Allowed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">HIPAA Consent:</span>
                <span className="font-medium">
                  {form.settings.requiresHIPAAConsent ? 'Required' : 'Not Required'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Auto-save:</span>
                <span className="font-medium">
                  {form.settings.autoSave ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-between">
          <div className="flex gap-2">
            <Link href={`/forms/${form.id}/edit`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Form
              </Button>
            </Link>
            <Link href={`/forms/${form.id}/responses`}>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Responses
              </Button>
            </Link>
          </div>
          <div className="flex gap-2">
            {form.sharing.isPublic && (
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Form
              </Button>
            )}
            <Button variant="outline" onClick={() => onDuplicate(form.id)}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
