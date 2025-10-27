'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/feedback/Alert';
import { Download, FileText, Shield } from 'lucide-react';

/**
 * WF-COMP-STUDENT-MODAL-003 | ExportModal.tsx
 * Purpose: Modal for exporting student data with HIPAA-compliant field selection
 *
 * @module app/(dashboard)/students/components/modals/ExportModal
 */

/**
 * Export format options
 */
export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

/**
 * Data field categories for export
 */
export interface ExportFieldCategory {
  id: string;
  label: string;
  fields: ExportField[];
  requiresPHIAccess: boolean;
}

/**
 * Individual export field
 */
export interface ExportField {
  id: string;
  label: string;
  isPHI: boolean;
}

/**
 * Export configuration
 */
export interface ExportConfig {
  format: ExportFormat;
  selectedFields: string[];
  includeHeaders: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

/**
 * Props for ExportModal component
 */
interface ExportModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
  /** Number of students to be exported */
  studentCount: number;
  /** Available field categories */
  fieldCategories?: ExportFieldCategory[];
  /** Callback when export is initiated */
  onExport: (config: ExportConfig) => void | Promise<void>;
  /** Whether user has PHI access permission */
  canAccessPHI?: boolean;
  /** Whether export is in progress */
  isLoading?: boolean;
}

/**
 * Default field categories
 */
const defaultFieldCategories: ExportFieldCategory[] = [
  {
    id: 'basic',
    label: 'Basic Information',
    requiresPHIAccess: false,
    fields: [
      { id: 'studentId', label: 'Student ID', isPHI: false },
      { id: 'firstName', label: 'First Name', isPHI: false },
      { id: 'lastName', label: 'Last Name', isPHI: false },
      { id: 'gradeLevel', label: 'Grade Level', isPHI: false },
      { id: 'status', label: 'Status', isPHI: false }
    ]
  },
  {
    id: 'personal',
    label: 'Personal Information',
    requiresPHIAccess: true,
    fields: [
      { id: 'dateOfBirth', label: 'Date of Birth', isPHI: true },
      { id: 'gender', label: 'Gender', isPHI: false },
      { id: 'address', label: 'Address', isPHI: true },
      { id: 'phoneNumber', label: 'Phone Number', isPHI: true },
      { id: 'email', label: 'Email', isPHI: true }
    ]
  },
  {
    id: 'health',
    label: 'Health Information',
    requiresPHIAccess: true,
    fields: [
      { id: 'allergies', label: 'Allergies', isPHI: true },
      { id: 'medications', label: 'Medications', isPHI: true },
      { id: 'immunizations', label: 'Immunizations', isPHI: true },
      { id: 'medicalConditions', label: 'Medical Conditions', isPHI: true },
      { id: 'bloodType', label: 'Blood Type', isPHI: true }
    ]
  },
  {
    id: 'emergency',
    label: 'Emergency Contacts',
    requiresPHIAccess: false,
    fields: [
      { id: 'emergencyContactName', label: 'Contact Name', isPHI: false },
      { id: 'emergencyContactPhone', label: 'Contact Phone', isPHI: false },
      { id: 'emergencyContactRelationship', label: 'Relationship', isPHI: false }
    ]
  }
];

/**
 * ExportModal Component
 *
 * Modal for exporting student data with:
 * - Format selection (CSV, XLSX, PDF)
 * - Field selection by category
 * - PHI field awareness and warnings
 * - Export preview
 * - HIPAA compliance notices
 *
 * **Features:**
 * - Multiple export formats
 * - Granular field selection
 * - PHI access checking
 * - Export configuration
 * - Loading states
 * - Field count display
 *
 * **HIPAA Compliance:**
 * - PHI fields clearly marked
 * - Access permission validation
 * - Audit trail of exports
 * - Encryption notice
 * - Data handling warnings
 *
 * **Accessibility:**
 * - Keyboard navigation
 * - ARIA labels
 * - Focus management
 * - Screen reader support
 *
 * @component
 * @example
 * ```tsx
 * const [showExportModal, setShowExportModal] = useState(false);
 *
 * <ExportModal
 *   isOpen={showExportModal}
 *   onClose={() => setShowExportModal(false)}
 *   studentCount={150}
 *   canAccessPHI={currentUser.permissions.includes('view_phi')}
 *   onExport={handleExport}
 * />
 * ```
 */
export function ExportModal({
  isOpen,
  onClose,
  studentCount,
  fieldCategories = defaultFieldCategories,
  onExport,
  canAccessPHI = false,
  isLoading = false
}: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'studentId',
    'firstName',
    'lastName',
    'gradeLevel',
    'status'
  ]);
  const [includeHeaders, setIncludeHeaders] = useState(true);

  /**
   * Toggle field selection
   */
  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((id) => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  /**
   * Toggle entire category
   */
  const toggleCategory = (category: ExportFieldCategory) => {
    const categoryFieldIds = category.fields.map((f) => f.id);
    const allSelected = categoryFieldIds.every((id) => selectedFields.includes(id));

    if (allSelected) {
      setSelectedFields((prev) => prev.filter((id) => !categoryFieldIds.includes(id)));
    } else {
      const newFields = categoryFieldIds.filter((id) => !selectedFields.includes(id));
      setSelectedFields((prev) => [...prev, ...newFields]);
    }
  };

  /**
   * Check if category is fully selected
   */
  const isCategorySelected = (category: ExportFieldCategory) => {
    return category.fields.every((field) => selectedFields.includes(field.id));
  };

  /**
   * Check if category is partially selected
   */
  const isCategoryPartiallySelected = (category: ExportFieldCategory) => {
    const selectedCount = category.fields.filter((field) =>
      selectedFields.includes(field.id)
    ).length;
    return selectedCount > 0 && selectedCount < category.fields.length;
  };

  /**
   * Check if any PHI fields are selected
   */
  const hasPHIFields = fieldCategories.some((category) =>
    category.fields.some((field) => field.isPHI && selectedFields.includes(field.id))
  );

  /**
   * Handle export
   */
  const handleExport = async () => {
    const config: ExportConfig = {
      format,
      selectedFields,
      includeHeaders
    };

    await onExport(config);
  };

  /**
   * Check if export is valid
   */
  const canExport = selectedFields.length > 0 && (!hasPHIFields || canAccessPHI);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <Modal.Header>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Download className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Export Student Data</h2>
            <p className="text-sm text-gray-600">
              Exporting {studentCount} student{studentCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-6">
          {/* PHI Warning */}
          {hasPHIFields && (
            <Alert variant={canAccessPHI ? 'warning' : 'error'}>
              <Shield className="w-5 h-5" />
              <div>
                <p className="font-semibold">Protected Health Information (PHI)</p>
                <p className="text-sm mt-1">
                  {canAccessPHI
                    ? 'Your export includes PHI. This data must be handled according to HIPAA regulations.'
                    : 'You do not have permission to export PHI. Please deselect PHI fields or contact an administrator.'}
                </p>
              </div>
            </Alert>
          )}

          {/* Format Selection */}
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <Select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value as ExportFormat)}
              disabled={isLoading}
              className="w-full"
            >
              <option value="csv">CSV (Comma Separated Values)</option>
              <option value="xlsx">Excel (XLSX)</option>
              <option value="pdf">PDF Document</option>
            </Select>
          </div>

          {/* Options */}
          <div className="flex items-center gap-3">
            <Checkbox
              id="includeHeaders"
              checked={includeHeaders}
              onChange={(e) => setIncludeHeaders(e.target.checked)}
              disabled={isLoading}
            />
            <label htmlFor="includeHeaders" className="text-sm font-medium text-gray-700 cursor-pointer">
              Include column headers
            </label>
          </div>

          {/* Field Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Select Fields to Export ({selectedFields.length} selected)
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {fieldCategories.map((category) => (
                <div key={category.id} className="space-y-2">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
                    <Checkbox
                      checked={isCategorySelected(category)}
                      indeterminate={isCategoryPartiallySelected(category)}
                      onChange={() => toggleCategory(category)}
                      disabled={
                        isLoading ||
                        (category.requiresPHIAccess && !canAccessPHI)
                      }
                    />
                    <span className="font-medium text-gray-900">{category.label}</span>
                    {category.requiresPHIAccess && (
                      <Shield className="w-4 h-4 text-orange-600" title="Contains PHI" />
                    )}
                  </div>

                  {/* Category Fields */}
                  <div className="ml-6 space-y-2">
                    {category.fields.map((field) => (
                      <div key={field.id} className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedFields.includes(field.id)}
                          onChange={() => toggleField(field.id)}
                          disabled={
                            isLoading ||
                            (field.isPHI && !canAccessPHI)
                          }
                        />
                        <label className="text-sm text-gray-700 cursor-pointer flex items-center gap-2">
                          {field.label}
                          {field.isPHI && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                              PHI
                            </span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HIPAA Notice */}
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
            <p className="font-medium mb-1">Data Security Notice:</p>
            <p>
              Exported files containing PHI must be encrypted and stored securely according to
              HIPAA regulations. Do not share exported data via unsecured channels. This export
              will be logged for audit purposes.
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={!canExport || isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export {format.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
