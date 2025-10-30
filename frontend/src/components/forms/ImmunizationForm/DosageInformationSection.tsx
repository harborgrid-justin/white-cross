/**
 * @fileoverview Dosage Information Section Component
 * 
 * Form section for capturing vaccine dosage information including dose number,
 * total doses, dosage amount, and series completion status.
 * 
 * @module components/forms/ImmunizationForm/DosageInformationSection
 * @since 1.0.0
 */

import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';

interface DosageInformationSectionProps {
  errors?: Record<string, string[]>;
}

/**
 * Dosage Information Section Component
 * 
 * Renders form fields for vaccine dosage information.
 */
export function DosageInformationSection({ errors }: DosageInformationSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Dosage Information</h3>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="doseNumber">Dose Number</Label>
          <Input
            id="doseNumber"
            name="doseNumber"
            type="number"
            min="1"
            placeholder="e.g., 1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalDoses">Total Doses in Series</Label>
          <Input
            id="totalDoses"
            name="totalDoses"
            type="number"
            min="1"
            placeholder="e.g., 3"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dosageAmount">Dosage Amount</Label>
          <Input
            id="dosageAmount"
            name="dosageAmount"
            placeholder="e.g., 0.5mL"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="seriesComplete"
          name="seriesComplete"
          value="true"
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="seriesComplete" className="font-normal">
          Series Complete
        </Label>
      </div>
    </div>
  );
}
