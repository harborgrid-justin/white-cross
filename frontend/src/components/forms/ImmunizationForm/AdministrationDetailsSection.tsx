/**
 * @fileoverview Administration Details Section Component
 * 
 * Form section for capturing vaccine administration details including date,
 * provider, facility, and administration site/route information.
 * 
 * @module components/forms/ImmunizationForm/AdministrationDetailsSection
 * @since 1.0.0
 */

import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

interface AdministrationDetailsSectionProps {
  errors?: Record<string, string[]>;
}

/**
 * Administration Details Section Component
 * 
 * Renders form fields for vaccine administration details.
 */
export function AdministrationDetailsSection({ errors }: AdministrationDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Administration Details</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="administrationDate" className="text-sm font-medium">
            Administration Date <span className="text-red-600">*</span>
          </label>
          <Input
            id="administrationDate"
            name="administrationDate"
            type="date"
            required
          />
          {errors?.administrationDate && (
            <p className="text-sm text-red-600">{errors.administrationDate.join(', ')}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="administeredBy" className="text-sm font-medium">
            Administered By <span className="text-red-600">*</span>
          </label>
          <Input
            id="administeredBy"
            name="administeredBy"
            placeholder="Healthcare provider name"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="administeredByRole" className="text-sm font-medium">Provider Role</label>
          <Input
            id="administeredByRole"
            name="administeredByRole"
            placeholder="e.g., RN, MD, NP"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="facility" className="text-sm font-medium">Facility</label>
          <Input
            id="facility"
            name="facility"
            placeholder="Healthcare facility name"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="siteOfAdministration" className="text-sm font-medium">Site of Administration</label>
          <select
            id="siteOfAdministration"
            name="siteOfAdministration"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select site...</option>
            <option value="LEFT_ARM">Left Arm</option>
            <option value="RIGHT_ARM">Right Arm</option>
            <option value="LEFT_DELTOID">Left Deltoid</option>
            <option value="RIGHT_DELTOID">Right Deltoid</option>
            <option value="LEFT_THIGH">Left Thigh</option>
            <option value="RIGHT_THIGH">Right Thigh</option>
            <option value="ORAL">Oral</option>
            <option value="NASAL">Nasal</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="routeOfAdministration" className="text-sm font-medium">Route of Administration</label>
          <select
            id="routeOfAdministration"
            name="routeOfAdministration"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select route...</option>
            <option value="INTRAMUSCULAR">Intramuscular (IM)</option>
            <option value="SUBCUTANEOUS">Subcutaneous (SC)</option>
            <option value="INTRADERMAL">Intradermal (ID)</option>
            <option value="ORAL">Oral</option>
            <option value="NASAL">Nasal</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
