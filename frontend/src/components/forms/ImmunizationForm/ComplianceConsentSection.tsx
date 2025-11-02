/**
 * @fileoverview Compliance & Consent Section Component
 * 
 * Form section for capturing compliance status, consent information,
 * and VIS (Vaccine Information Statement) details.
 * 
 * @module components/forms/ImmunizationForm/ComplianceConsentSection
 * @since 1.0.0
 */

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ComplianceConsentSectionProps {
  errors?: Record<string, string[]>;
}

/**
 * Compliance & Consent Section Component
 * 
 * Renders form fields for compliance and consent information.
 */
export function ComplianceConsentSection({ errors }: ComplianceConsentSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Compliance & Consent</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="complianceStatus" className="text-sm font-medium">Compliance Status</label>
          <select
            id="complianceStatus"
            name="complianceStatus"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="COMPLIANT">Compliant</option>
            <option value="OVERDUE">Overdue</option>
            <option value="PARTIALLY_COMPLIANT">Partially Compliant</option>
            <option value="EXEMPT">Exempt</option>
            <option value="NON_COMPLIANT">Non-Compliant</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="nextDueDate" className="text-sm font-medium">Next Dose Due Date</label>
          <Input
            id="nextDueDate"
            name="nextDueDate"
            type="date"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="consentObtained"
            name="consentObtained"
            value="true"
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="consentObtained" className="text-sm font-normal">
            Consent Obtained
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="consentBy" className="text-sm font-medium">Consent Provided By</label>
        <Input
          id="consentBy"
          name="consentBy"
          placeholder="Parent/Guardian name (required if consent obtained)"
        />
        {errors?.consentBy && (
          <p className="text-sm text-red-600">{errors.consentBy.join(', ')}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="visProvided"
          name="visProvided"
          value="true"
          className="h-4 w-4 rounded border-gray-300"
        />
        <label htmlFor="visProvided" className="text-sm font-normal">
          Vaccine Information Statement (VIS) Provided
        </label>
      </div>

      <div className="space-y-2">
        <label htmlFor="visDate" className="text-sm font-medium">VIS Date</label>
        <Input
          id="visDate"
          name="visDate"
          type="date"
        />
        {errors?.visDate && (
          <p className="text-sm text-red-600">{errors.visDate.join(', ')}</p>
        )}
      </div>
    </div>
  );
}

