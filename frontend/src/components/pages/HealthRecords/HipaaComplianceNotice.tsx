/**
 * @fileoverview HIPAA Compliance Notice Component
 * 
 * Compliance notice component for health record pages.
 * 
 * @module components/pages/HealthRecords/HipaaComplianceNotice
 * @since 1.0.0
 */

import { FileText } from 'lucide-react';

/**
 * HIPAA Compliance Notice Component
 * 
 * Renders HIPAA compliance information for health records.
 */
export function HipaaComplianceNotice() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex">
        <FileText className="h-5 w-5 text-blue-600 mr-2" />
        <div>
          <p className="text-sm font-medium text-blue-800">HIPAA Compliance</p>
          <p className="text-sm text-blue-700 mt-1">
            This health record contains Protected Health Information (PHI). Access and disclosure
            are logged for compliance purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
