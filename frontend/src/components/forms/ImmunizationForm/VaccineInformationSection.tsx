/**
 * @fileoverview Vaccine Information Section Component
 * 
 * Form section for capturing basic vaccine information including name, type,
 * manufacturer, lot number, and CDC/NDC codes.
 * 
 * @module components/forms/ImmunizationForm/VaccineInformationSection
 * @since 1.0.0
 */

import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

interface VaccineInformationSectionProps {
  errors?: Record<string, string[]>;
}

/**
 * Vaccine Information Section Component
 * 
 * Renders form fields for basic vaccine information.
 */
export function VaccineInformationSection({ errors }: VaccineInformationSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Vaccine Information</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="vaccineName">
            Vaccine Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="vaccineName"
            name="vaccineName"
            placeholder="e.g., MMR, COVID-19, Flu"
            required
          />
          {errors?.vaccineName && (
            <p className="text-sm text-destructive">{errors.vaccineName.join(', ')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vaccineType">Vaccine Type</Label>
          <Input
            id="vaccineType"
            name="vaccineType"
            placeholder="e.g., Viral, Bacterial"
          />
          {errors?.vaccineType && (
            <p className="text-sm text-destructive">{errors.vaccineType.join(', ')}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input
            id="manufacturer"
            name="manufacturer"
            placeholder="e.g., Pfizer, Moderna, Johnson & Johnson"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lotNumber">Lot Number</Label>
          <Input
            id="lotNumber"
            name="lotNumber"
            placeholder="Vaccine lot number"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cvxCode">CVX Code</Label>
          <Input
            id="cvxCode"
            name="cvxCode"
            placeholder="1-3 digits (CDC code)"
          />
          {errors?.cvxCode && (
            <p className="text-sm text-destructive">{errors.cvxCode.join(', ')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ndcCode">NDC Code</Label>
          <Input
            id="ndcCode"
            name="ndcCode"
            placeholder="12345-1234-12"
          />
          {errors?.ndcCode && (
            <p className="text-sm text-destructive">{errors.ndcCode.join(', ')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
